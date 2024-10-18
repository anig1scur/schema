"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPERATION = exports.Context = exports.SchemaDefinition = exports.hasFilter = exports.defineTypes = exports.filterChildren = exports.filter = exports.deprecated = exports.type = exports.ReflectionField = exports.ReflectionType = exports.Reflection = exports.decode = exports.encode = exports.dumpChanges = exports.registerType = exports.SetSchema = exports.CollectionSchema = exports.ArraySchema = exports.MapSchema = exports.Schema = void 0;
var Schema_1 = require("./Schema");
Object.defineProperty(exports, "Schema", { enumerable: true, get: function () { return Schema_1.Schema; } });
const MapSchema_1 = require("./types/MapSchema");
Object.defineProperty(exports, "MapSchema", { enumerable: true, get: function () { return MapSchema_1.MapSchema; } });
const ArraySchema_1 = require("./types/ArraySchema");
Object.defineProperty(exports, "ArraySchema", { enumerable: true, get: function () { return ArraySchema_1.ArraySchema; } });
const CollectionSchema_1 = require("./types/CollectionSchema");
Object.defineProperty(exports, "CollectionSchema", { enumerable: true, get: function () { return CollectionSchema_1.CollectionSchema; } });
const SetSchema_1 = require("./types/SetSchema");
Object.defineProperty(exports, "SetSchema", { enumerable: true, get: function () { return SetSchema_1.SetSchema; } });
const typeRegistry_1 = require("./types/typeRegistry");
Object.defineProperty(exports, "registerType", { enumerable: true, get: function () { return typeRegistry_1.registerType; } });
(0, typeRegistry_1.registerType)("map", { constructor: MapSchema_1.MapSchema });
(0, typeRegistry_1.registerType)("array", { constructor: ArraySchema_1.ArraySchema });
(0, typeRegistry_1.registerType)("set", { constructor: SetSchema_1.SetSchema });
(0, typeRegistry_1.registerType)("collection", { constructor: CollectionSchema_1.CollectionSchema, });
// Utils
var utils_1 = require("./utils");
Object.defineProperty(exports, "dumpChanges", { enumerable: true, get: function () { return utils_1.dumpChanges; } });
const encode = require("./encoding/encode");
exports.encode = encode;
const decode = require("./encoding/decode");
exports.decode = decode;
// Reflection
var Reflection_1 = require("./Reflection");
Object.defineProperty(exports, "Reflection", { enumerable: true, get: function () { return Reflection_1.Reflection; } });
Object.defineProperty(exports, "ReflectionType", { enumerable: true, get: function () { return Reflection_1.ReflectionType; } });
Object.defineProperty(exports, "ReflectionField", { enumerable: true, get: function () { return Reflection_1.ReflectionField; } });
var annotations_1 = require("./annotations");
// Annotations
Object.defineProperty(exports, "type", { enumerable: true, get: function () { return annotations_1.type; } });
Object.defineProperty(exports, "deprecated", { enumerable: true, get: function () { return annotations_1.deprecated; } });
Object.defineProperty(exports, "filter", { enumerable: true, get: function () { return annotations_1.filter; } });
Object.defineProperty(exports, "filterChildren", { enumerable: true, get: function () { return annotations_1.filterChildren; } });
Object.defineProperty(exports, "defineTypes", { enumerable: true, get: function () { return annotations_1.defineTypes; } });
Object.defineProperty(exports, "hasFilter", { enumerable: true, get: function () { return annotations_1.hasFilter; } });
// Internals
Object.defineProperty(exports, "SchemaDefinition", { enumerable: true, get: function () { return annotations_1.SchemaDefinition; } });
Object.defineProperty(exports, "Context", { enumerable: true, get: function () { return annotations_1.Context; } });
var spec_1 = require("./spec");
Object.defineProperty(exports, "OPERATION", { enumerable: true, get: function () { return spec_1.OPERATION; } });
//# sourceMappingURL=index.js.map