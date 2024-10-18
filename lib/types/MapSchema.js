"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapSchema = void 0;
exports.getMapProxy = getMapProxy;
const utils_1 = require("./utils");
const ChangeTree_1 = require("../changes/ChangeTree");
const spec_1 = require("../spec");
function getMapProxy(value) {
    value['$proxy'] = true;
    value = new Proxy(value, {
        get: (obj, prop) => {
            if (typeof (prop) !== "symbol" && // accessing properties
                typeof (obj[prop]) === "undefined") {
                return obj.get(prop);
            }
            else {
                return obj[prop];
            }
        },
        set: (obj, prop, setValue) => {
            if (typeof (prop) !== "symbol" &&
                (prop.indexOf("$") === -1 &&
                    prop !== "onAdd" &&
                    prop !== "onRemove" &&
                    prop !== "onChange")) {
                obj.set(prop, setValue);
            }
            else {
                obj[prop] = setValue;
            }
            return true;
        },
        deleteProperty: (obj, prop) => {
            obj.delete(prop);
            return true;
        },
    });
    return value;
}
class MapSchema {
    onAdd(callback, triggerAll = true) {
        return (0, utils_1.addCallback)((this.$callbacks || (this.$callbacks = {})), spec_1.OPERATION.ADD, callback, (triggerAll)
            ? this.$items
            : undefined);
    }
    onRemove(callback) { return (0, utils_1.addCallback)(this.$callbacks || (this.$callbacks = {}), spec_1.OPERATION.DELETE, callback); }
    onChange(callback) { return (0, utils_1.addCallback)(this.$callbacks || (this.$callbacks = {}), spec_1.OPERATION.REPLACE, callback); }
    static is(type) {
        return type['map'] !== undefined;
    }
    constructor(initialValues) {
        this.$changes = new ChangeTree_1.ChangeTree(this);
        this.$items = new Map();
        this.$indexes = new Map();
        this.$refId = 0;
        if (initialValues) {
            if (initialValues instanceof Map ||
                initialValues instanceof MapSchema) {
                initialValues.forEach((v, k) => this.set(k, v));
            }
            else {
                for (const k in initialValues) {
                    this.set(k, initialValues[k]);
                }
            }
        }
    }
    /** Iterator */
    [Symbol.iterator]() { return this.$items[Symbol.iterator](); }
    get [Symbol.toStringTag]() { return this.$items[Symbol.toStringTag]; }
    static get [Symbol.species]() {
        return MapSchema;
    }
    set(key, value) {
        if (value === undefined || value === null) {
            throw new Error(`MapSchema#set('${key}', ${value}): trying to set ${value} value on '${key}'.`);
        }
        // Force "key" as string
        // See: https://github.com/colyseus/colyseus/issues/561#issuecomment-1646733468
        key = key.toString();
        // get "index" for this value.
        const hasIndex = typeof (this.$changes.indexes[key]) !== "undefined";
        const index = (hasIndex)
            ? this.$changes.indexes[key]
            : this.$refId++;
        let operation = (hasIndex)
            ? spec_1.OPERATION.REPLACE
            : spec_1.OPERATION.ADD;
        const isRef = (value['$changes']) !== undefined;
        if (isRef) {
            value['$changes'].setParent(this, this.$changes.root, index);
        }
        //
        // (encoding)
        // set a unique id to relate directly with this key/value.
        //
        if (!hasIndex) {
            this.$changes.indexes[key] = index;
            this.$indexes.set(index, key);
        }
        else if (!isRef &&
            this.$items.get(key) === value) {
            // if value is the same, avoid re-encoding it.
            return;
        }
        else if (isRef && // if is schema, force ADD operation if value differ from previous one.
            this.$items.get(key) !== value) {
            operation = spec_1.OPERATION.ADD;
        }
        this.$items.set(key, value);
        this.$changes.change(key, operation);
        return this;
    }
    get(key) {
        return this.$items.get(key);
    }
    delete(key) {
        //
        // TODO: add a "purge" method after .encode() runs, to cleanup removed `$indexes`
        //
        // We don't remove $indexes to allow setting the same key in the same patch
        // (See "should allow to remove and set an item in the same place" test)
        //
        // // const index = this.$changes.indexes[key];
        // // this.$indexes.delete(index);
        this.$changes.delete(key.toString());
        return this.$items.delete(key);
    }
    clear(changes) {
        // discard previous operations.
        this.$changes.discard(true, true);
        this.$changes.indexes = {};
        // clear previous indexes
        this.$indexes.clear();
        //
        // When decoding:
        // - enqueue items for DELETE callback.
        // - flag child items for garbage collection.
        //
        if (changes) {
            utils_1.removeChildRefs.call(this, changes);
        }
        // clear items
        this.$items.clear();
        this.$changes.operation({ index: 0, op: spec_1.OPERATION.CLEAR });
        // touch all structures until reach root
        this.$changes.touchParents();
    }
    has(key) {
        return this.$items.has(key);
    }
    forEach(callbackfn) {
        this.$items.forEach(callbackfn);
    }
    entries() {
        return this.$items.entries();
    }
    keys() {
        return this.$items.keys();
    }
    values() {
        return this.$items.values();
    }
    get size() {
        return this.$items.size;
    }
    setIndex(index, key) {
        this.$indexes.set(index, key);
    }
    getIndex(index) {
        return this.$indexes.get(index);
    }
    getByIndex(index) {
        return this.$items.get(this.$indexes.get(index));
    }
    deleteByIndex(index) {
        const key = this.$indexes.get(index);
        this.$items.delete(key);
        this.$indexes.delete(index);
    }
    toJSON() {
        const map = {};
        this.forEach((value, key) => {
            map[key] = (typeof (value['toJSON']) === "function")
                ? value['toJSON']()
                : value;
        });
        return map;
    }
    //
    // Decoding utilities
    //
    clone(isDecoding) {
        let cloned;
        if (isDecoding) {
            // client-side
            cloned = Object.assign(new MapSchema(), this);
        }
        else {
            // server-side
            cloned = new MapSchema();
            this.forEach((value, key) => {
                if (value['$changes']) {
                    cloned.set(key, value['clone']());
                }
                else {
                    cloned.set(key, value);
                }
            });
        }
        return cloned;
    }
}
exports.MapSchema = MapSchema;
//# sourceMappingURL=MapSchema.js.map