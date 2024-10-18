"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const types_1 = require("../types");
const typeMaps = {
    "string": "string",
    "number": "number",
    "boolean": "boolean",
    "int8": "number",
    "uint8": "number",
    "int16": "number",
    "uint16": "number",
    "int32": "number",
    "uint32": "number",
    "int64": "number",
    "uint64": "number",
    "float32": "number",
    "float64": "number",
};
const distinct = (value, index, self) => self.indexOf(value) === index;
function generate(context, options) {
    return [
        ...context.classes.map(structure => ({
            name: structure.name + ".ts",
            content: generateClass(structure, options.namespace, context.classes)
        })),
        ...context.interfaces.map(structure => ({
            name: structure.name + ".ts",
            content: generateInterface(structure, options.namespace, context.classes),
        }))
    ];
}
function generateClass(klass, namespace, allClasses) {
    const allRefs = [];
    klass.properties.forEach(property => {
        let type = property.type;
        // keep all refs list
        if ((type === "ref" || type === "array" || type === "map" || type === "set")) {
            allRefs.push(property);
        }
    });
    return `${(0, types_1.getCommentHeader)()}

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
${allRefs.
        filter(ref => ref.childType && typeMaps[ref.childType] === undefined).
        map(ref => ref.childType).
        concat((0, types_1.getInheritanceTree)(klass, allClasses, false).map(klass => klass.name)).
        filter(distinct).
        map(childType => `import { ${childType} } from './${childType}'`).
        join("\n")}

export class ${klass.name} extends ${klass.extends} {
${klass.properties.map(prop => `    ${generateProperty(prop)}`).join("\n")}
}
`;
}
function generateProperty(prop) {
    let langType;
    let initializer = "";
    let typeArgs;
    if (prop.childType) {
        const isUpcaseFirst = prop.childType.match(/^[A-Z]/);
        if (isUpcaseFirst) {
            typeArgs += `, ${prop.childType}`;
        }
        else {
            typeArgs += `, "${prop.childType}"`;
        }
        if (prop.type === "ref") {
            langType = `${prop.childType}`;
            initializer = `new ${prop.childType}()`;
            typeArgs = `${prop.childType}`;
        }
        else if (prop.type === "array") {
            langType = (isUpcaseFirst)
                ? `ArraySchema<${prop.childType}>`
                : `ArraySchema<${typeMaps[prop.childType]}>`;
            initializer = `new ${langType}()`;
            typeArgs = (isUpcaseFirst)
                ? `[ ${prop.childType} ]`
                : `[ "${prop.childType}" ]`;
        }
        else if (prop.type === "map") {
            langType = (isUpcaseFirst)
                ? `MapSchema<${prop.childType}>`
                : `MapSchema<${typeMaps[prop.childType]}>`;
            initializer = `new ${langType}()`;
            typeArgs = (isUpcaseFirst)
                ? `{ map: ${prop.childType} }`
                : `{ map: "${prop.childType}" }`;
        }
        else if (prop.type === "set") {
            langType = (isUpcaseFirst)
                ? `SetSchema<${prop.childType}>`
                : `SetSchema<${typeMaps[prop.childType]}>`;
            initializer = `new ${langType}()`;
            typeArgs = (isUpcaseFirst)
                ? `{ set: ${prop.childType} }`
                : `{ set: "${prop.childType}" }`;
        }
    }
    else {
        langType = typeMaps[prop.type];
        typeArgs = `"${prop.type}"`;
    }
    // TS1263: "Declarations with initializers cannot also have definite assignment assertions"
    const definiteAssertion = initializer ? "" : "!";
    return `@type(${typeArgs}) public ${prop.name}${definiteAssertion}: ${langType}${(initializer) ? ` = ${initializer}` : ""};`;
}
function generateInterface(structure, namespace, allClasses) {
    return `${(0, types_1.getCommentHeader)()}

export interface ${structure.name} {
${structure.properties.map(prop => `    ${prop.name}: ${prop.type};`).join("\n")}
}
`;
}
//# sourceMappingURL=ts.js.map