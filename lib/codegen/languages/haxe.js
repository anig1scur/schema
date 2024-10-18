"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const types_1 = require("../types");
const typeMaps = {
    "string": "String",
    "number": "Dynamic",
    "boolean": "Bool",
    "int8": "Int",
    "uint8": "UInt",
    "int16": "Int",
    "uint16": "UInt",
    "int32": "Int",
    "uint32": "UInt",
    "int64": "Int",
    "uint64": "UInt",
    "float32": "Float",
    "float64": "Float",
};
const typeInitializer = {
    "string": '""',
    "number": "0",
    "boolean": "false",
    "int8": "0",
    "uint8": "0",
    "int16": "0",
    "uint16": "0",
    "int32": "0",
    "uint32": "0",
    "int64": "0",
    "uint64": "0",
    "float32": "0",
    "float64": "0",
};
function generate(context, options) {
    return context.classes.map(klass => ({
        name: klass.name + ".hx",
        content: generateClass(klass, options.namespace, context.classes)
    }));
}
function getInheritanceTree(klass, allClasses, includeSelf = true) {
    let currentClass = klass;
    let inheritanceTree = [];
    if (includeSelf) {
        inheritanceTree.push(currentClass);
    }
    while (currentClass.extends !== "Schema") {
        currentClass = allClasses.find(klass => klass.name == currentClass.extends);
        inheritanceTree.push(currentClass);
    }
    return inheritanceTree;
}
function generateClass(klass, namespace, allClasses) {
    return `${(0, types_1.getCommentHeader)()}

${namespace ? `package ${namespace};` : ""}
import io.colyseus.serializer.schema.Schema;
import io.colyseus.serializer.schema.types.*;

class ${klass.name} extends ${klass.extends} {
${klass.properties.map(prop => generateProperty(prop)).join("\n")}
}
`;
}
function generateProperty(prop) {
    let langType;
    let initializer = "";
    let typeArgs = `"${prop.type}"`;
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
        }
        else if (prop.type === "array") {
            langType = (isUpcaseFirst)
                ? `ArraySchema<${prop.childType}>`
                : `ArraySchema<${typeMaps[prop.childType]}>`;
            initializer = `new ${langType}()`;
        }
        else if (prop.type === "map") {
            langType = (isUpcaseFirst)
                ? `MapSchema<${prop.childType}>`
                : `MapSchema<${typeMaps[prop.childType]}>`;
            initializer = `new ${langType}()`;
        }
    }
    else {
        langType = typeMaps[prop.type];
        initializer = typeInitializer[prop.type];
    }
    return `\t@:type(${typeArgs})\n\tpublic var ${prop.name}: ${langType} = ${initializer};\n`;
}
//# sourceMappingURL=haxe.js.map