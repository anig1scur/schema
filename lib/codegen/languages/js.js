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
    return context.classes.map(klass => ({
        name: klass.name + ".js",
        content: generateClass(klass, options.namespace, context.classes)
    }));
}
function generateClass(klass, namespace, allClasses) {
    const allRefs = [];
    klass.properties.forEach(property => {
        let type = property.type;
        // keep all refs list
        if ((type === "ref" || type === "array" || type === "map")) {
            allRefs.push(property);
        }
    });
    return `${(0, types_1.getCommentHeader)()}

const schema = require("@colyseus/schema");
const Schema = schema.Schema;
const type = schema.type;
${allRefs.
        filter(ref => ref.childType && typeMaps[ref.childType] === undefined).
        map(ref => ref.childType).
        concat((0, types_1.getInheritanceTree)(klass, allClasses, false).map(klass => klass.name)).
        filter(distinct).
        map(childType => `const ${childType} = require("./${childType}");`).
        join("\n")}

class ${klass.name} extends ${klass.extends} {
    constructor () {
        super();
${klass.properties.
        filter(prop => prop.childType !== undefined).
        map(prop => "        " + generatePropertyInitializer(prop)).join("\n")}
    }
}
${klass.properties.map(prop => generatePropertyDeclaration(klass.name, prop)).join("\n")}

export default ${klass.name};
`;
}
function generatePropertyDeclaration(className, prop) {
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
            typeArgs = `${prop.childType}`;
        }
        else if (prop.type === "array") {
            typeArgs = (isUpcaseFirst)
                ? `[ ${prop.childType} ]`
                : `[ "${prop.childType}" ]`;
        }
        else if (prop.type === "map") {
            typeArgs = (isUpcaseFirst)
                ? `{ map: ${prop.childType} }`
                : `{ map: "${prop.childType}" }`;
        }
    }
    else {
        typeArgs = `"${prop.type}"`;
    }
    return `type(${typeArgs})(${className}.prototype, "${prop.name}");`;
}
function generatePropertyInitializer(prop) {
    let initializer = "";
    if (prop.type === "ref") {
        initializer = `new ${prop.childType}()`;
    }
    else if (prop.type === "array") {
        initializer = `new schema.ArraySchema()`;
    }
    else if (prop.type === "map") {
        initializer = `new schema.MapSchema()`;
    }
    return `this.${prop.name} = ${initializer}`;
}
//# sourceMappingURL=js.js.map