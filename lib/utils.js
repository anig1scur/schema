"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpChanges = dumpChanges;
function dumpChanges(schema) {
    const changeTrees = [schema['$changes']];
    let numChangeTrees = 1;
    const dump = {};
    let currentStructure = dump;
    for (let i = 0; i < numChangeTrees; i++) {
        const changeTree = changeTrees[i];
        changeTree.changes.forEach((change) => {
            const ref = changeTree.ref;
            const fieldIndex = change.index;
            const field = (ref['_definition'])
                ? ref['_definition'].fieldsByIndex[fieldIndex]
                : ref['$indexes'].get(fieldIndex);
            currentStructure[field] = changeTree.getValue(fieldIndex);
        });
    }
    return dump;
}
//# sourceMappingURL=utils.js.map