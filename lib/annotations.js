"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalContext = exports.Context = exports.SchemaDefinition = void 0;
exports.hasFilter = hasFilter;
exports.type = type;
exports.filter = filter;
exports.filterChildren = filterChildren;
exports.deprecated = deprecated;
exports.defineTypes = defineTypes;
const Schema_1 = require("./Schema");
const ArraySchema_1 = require("./types/ArraySchema");
const MapSchema_1 = require("./types/MapSchema");
const typeRegistry_1 = require("./types/typeRegistry");
class SchemaDefinition {
    constructor() {
        //
        // TODO: use a "field" structure combining all these properties per-field.
        //
        this.indexes = {};
        this.fieldsByIndex = {};
        this.deprecated = {};
        this.descriptors = {};
    }
    static create(parent) {
        const definition = new SchemaDefinition();
        // support inheritance
        definition.schema = Object.assign({}, parent && parent.schema || {});
        definition.indexes = Object.assign({}, parent && parent.indexes || {});
        definition.fieldsByIndex = Object.assign({}, parent && parent.fieldsByIndex || {});
        definition.descriptors = Object.assign({}, parent && parent.descriptors || {});
        definition.deprecated = Object.assign({}, parent && parent.deprecated || {});
        return definition;
    }
    addField(field, type) {
        const index = this.getNextFieldIndex();
        this.fieldsByIndex[index] = field;
        this.indexes[field] = index;
        this.schema[field] = (Array.isArray(type))
            ? { array: type[0] }
            : type;
    }
    hasField(field) {
        return this.indexes[field] !== undefined;
    }
    addFilter(field, cb) {
        if (!this.filters) {
            this.filters = {};
            this.indexesWithFilters = [];
        }
        this.filters[this.indexes[field]] = cb;
        this.indexesWithFilters.push(this.indexes[field]);
        return true;
    }
    addChildrenFilter(field, cb) {
        const index = this.indexes[field];
        const type = this.schema[field];
        if ((0, typeRegistry_1.getType)(Object.keys(type)[0])) {
            if (!this.childFilters) {
                this.childFilters = {};
            }
            this.childFilters[index] = cb;
            return true;
        }
        else {
            console.warn(`@filterChildren: field '${field}' can't have children. Ignoring filter.`);
        }
    }
    getChildrenFilter(field) {
        return this.childFilters && this.childFilters[this.indexes[field]];
    }
    getNextFieldIndex() {
        return Object.keys(this.schema || {}).length;
    }
}
exports.SchemaDefinition = SchemaDefinition;
function hasFilter(klass) {
    return klass._context && klass._context.useFilters;
}
class Context {
    constructor() {
        this.types = {};
        this.schemas = new Map();
        this.useFilters = false;
    }
    has(schema) {
        return this.schemas.has(schema);
    }
    get(typeid) {
        return this.types[typeid];
    }
    add(schema, typeid = this.schemas.size) {
        // FIXME: move this to somewhere else?
        // support inheritance
        schema._definition = SchemaDefinition.create(schema._definition);
        schema._typeid = typeid;
        this.types[typeid] = schema;
        this.schemas.set(schema, typeid);
    }
    static create(options = {}) {
        return function (definition) {
            if (!options.context) {
                options.context = new Context();
            }
            return type(definition, options);
        };
    }
}
exports.Context = Context;
exports.globalContext = new Context();
/**
 * [See documentation](https://docs.colyseus.io/state/schema/)
 *
 * Annotate a Schema property to be serializeable.
 * \@type()'d fields are automatically flagged as "dirty" for the next patch.
 *
 * @example Standard usage, with automatic change tracking.
 * ```
 * \@type("string") propertyName: string;
 * ```
 *
 * @example You can provide the "manual" option if you'd like to manually control your patches via .setDirty().
 * ```
 * \@type("string", { manual: true })
 * ```
 */
function type(type, options = {}) {
    return function (target, field) {
        const context = options.context || exports.globalContext;
        const constructor = target.constructor;
        constructor._context = context;
        if (!type) {
            throw new Error(`${constructor.name}: @type() reference provided for "${field}" is undefined. Make sure you don't have any circular dependencies.`);
        }
        /*
         * static schema
         */
        if (!context.has(constructor)) {
            context.add(constructor);
        }
        const definition = constructor._definition;
        definition.addField(field, type);
        /**
         * skip if descriptor already exists for this field (`@deprecated()`)
         */
        if (definition.descriptors[field]) {
            if (definition.deprecated[field]) {
                // do not create accessors for deprecated properties.
                return;
            }
            else {
                // trying to define same property multiple times across inheritance.
                // https://github.com/colyseus/colyseus-unity3d/issues/131#issuecomment-814308572
                try {
                    throw new Error(`@colyseus/schema: Duplicate '${field}' definition on '${constructor.name}'.\nCheck @type() annotation`);
                }
                catch (e) {
                    const definitionAtLine = e.stack.split("\n")[4].trim();
                    throw new Error(`${e.message} ${definitionAtLine}`);
                }
            }
        }
        const isArray = ArraySchema_1.ArraySchema.is(type);
        const isMap = !isArray && MapSchema_1.MapSchema.is(type);
        // TODO: refactor me.
        // Allow abstract intermediary classes with no fields to be serialized
        // (See "should support an inheritance with a Schema type without fields" test)
        if (typeof (type) !== "string" && !Schema_1.Schema.is(type)) {
            const childType = Object.values(type)[0];
            if (typeof (childType) !== "string" && !context.has(childType)) {
                context.add(childType);
            }
        }
        if (options.manual) {
            // do not declare getter/setter descriptor
            definition.descriptors[field] = {
                enumerable: true,
                configurable: true,
                writable: true,
            };
            return;
        }
        const fieldCached = `_${field}`;
        definition.descriptors[fieldCached] = {
            enumerable: false,
            configurable: false,
            writable: true,
        };
        definition.descriptors[field] = {
            get: function () {
                return this[fieldCached];
            },
            set: function (value) {
                /**
                 * Create Proxy for array or map items
                 */
                // skip if value is the same as cached.
                if (value === this[fieldCached]) {
                    return;
                }
                if (value !== undefined &&
                    value !== null) {
                    // automaticallty transform Array into ArraySchema
                    if (isArray && !(value instanceof ArraySchema_1.ArraySchema)) {
                        value = new ArraySchema_1.ArraySchema(...value);
                    }
                    // automaticallty transform Map into MapSchema
                    if (isMap && !(value instanceof MapSchema_1.MapSchema)) {
                        value = new MapSchema_1.MapSchema(value);
                    }
                    // try to turn provided structure into a Proxy
                    if (value['$proxy'] === undefined) {
                        if (isMap) {
                            value = (0, MapSchema_1.getMapProxy)(value);
                        }
                        else if (isArray) {
                            value = (0, ArraySchema_1.getArrayProxy)(value);
                        }
                    }
                    // flag the change for encoding.
                    this.$changes.change(field);
                    //
                    // call setParent() recursively for this and its child
                    // structures.
                    //
                    if (value['$changes']) {
                        value['$changes'].setParent(this, this.$changes.root, this._definition.indexes[field]);
                    }
                }
                else if (this[fieldCached]) {
                    //
                    // Setting a field to `null` or `undefined` will delete it.
                    //
                    this.$changes.delete(field);
                }
                this[fieldCached] = value;
            },
            enumerable: true,
            configurable: true
        };
    };
}
/**
 * `@filter()` decorator for defining data filters per client
 */
function filter(cb) {
    return function (target, field) {
        const constructor = target.constructor;
        const definition = constructor._definition;
        if (definition.addFilter(field, cb)) {
            constructor._context.useFilters = true;
        }
    };
}
function filterChildren(cb) {
    return function (target, field) {
        const constructor = target.constructor;
        const definition = constructor._definition;
        if (definition.addChildrenFilter(field, cb)) {
            constructor._context.useFilters = true;
        }
    };
}
/**
 * `@deprecated()` flag a field as deprecated.
 * The previous `@type()` annotation should remain along with this one.
 */
function deprecated(throws = true) {
    return function (target, field) {
        const constructor = target.constructor;
        const definition = constructor._definition;
        definition.deprecated[field] = true;
        if (throws) {
            definition.descriptors[field] = {
                get: function () { throw new Error(`${field} is deprecated.`); },
                set: function (value) { },
                enumerable: false,
                configurable: true
            };
        }
    };
}
function defineTypes(target, fields, options = {}) {
    if (!options.context) {
        options.context = target._context || options.context || exports.globalContext;
    }
    for (let field in fields) {
        type(fields[field], options)(target.prototype, field);
    }
    return target;
}
//# sourceMappingURL=annotations.js.map