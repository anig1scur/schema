"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCallback = addCallback;
exports.removeChildRefs = removeChildRefs;
exports.spliceOne = spliceOne;
const spec_1 = require("../spec");
function addCallback($callbacks, op, callback, existing) {
    // initialize list of callbacks
    if (!$callbacks[op]) {
        $callbacks[op] = [];
    }
    $callbacks[op].push(callback);
    //
    // Trigger callback for existing elements
    // - OPERATION.ADD
    // - OPERATION.REPLACE
    //
    existing?.forEach((item, key) => callback(item, key));
    return () => spliceOne($callbacks[op], $callbacks[op].indexOf(callback));
}
function removeChildRefs(changes) {
    const needRemoveRef = (typeof (this.$changes.getType()) !== "string");
    this.$items.forEach((item, key) => {
        changes.push({
            refId: this.$changes.refId,
            op: spec_1.OPERATION.DELETE,
            field: key,
            value: undefined,
            previousValue: item
        });
        if (needRemoveRef) {
            this.$changes.root.removeRef(item['$changes'].refId);
        }
    });
}
function spliceOne(arr, index) {
    // manually splice an array
    if (index === -1 || index >= arr.length) {
        return false;
    }
    const len = arr.length - 1;
    for (let i = index; i < len; i++) {
        arr[i] = arr[i + 1];
    }
    arr.length = len;
    return true;
}
//# sourceMappingURL=utils.js.map