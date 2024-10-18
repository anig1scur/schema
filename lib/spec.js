"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPERATION = exports.TYPE_ID = exports.SWITCH_TO_STRUCTURE = void 0;
// export const SWITCH_TO_STRUCTURE = 193; (easily collides with DELETE_AND_ADD + fieldIndex = 2)
exports.SWITCH_TO_STRUCTURE = 255; // (decoding collides with DELETE_AND_ADD + fieldIndex = 63)
exports.TYPE_ID = 213;
/**
 * Encoding Schema field operations.
 */
var OPERATION;
(function (OPERATION) {
    // add new structure/primitive
    OPERATION[OPERATION["ADD"] = 128] = "ADD";
    // replace structure/primitive
    OPERATION[OPERATION["REPLACE"] = 0] = "REPLACE";
    // delete field
    OPERATION[OPERATION["DELETE"] = 64] = "DELETE";
    // DELETE field, followed by an ADD
    OPERATION[OPERATION["DELETE_AND_ADD"] = 192] = "DELETE_AND_ADD";
    // TOUCH is used to determine hierarchy of nested Schema structures during serialization.
    // touches are NOT encoded.
    OPERATION[OPERATION["TOUCH"] = 1] = "TOUCH";
    // MapSchema Operations
    OPERATION[OPERATION["CLEAR"] = 10] = "CLEAR";
})(OPERATION || (exports.OPERATION = OPERATION = {}));
// export enum OPERATION {
//     // add new structure/primitive
//     // (128)
//     ADD = 128, // 10000000,
//     // replace structure/primitive
//     REPLACE = 1,// 00000001
//     // delete field
//     DELETE = 192, // 11000000
//     // DELETE field, followed by an ADD
//     DELETE_AND_ADD = 224, // 11100000
//     // TOUCH is used to determine hierarchy of nested Schema structures during serialization.
//     // touches are NOT encoded.
//     TOUCH = 0, // 00000000
//     // MapSchema Operations
//     CLEAR = 10,
// }
//# sourceMappingURL=spec.js.map