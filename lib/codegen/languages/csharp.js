"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const types_1 = require("../types");
const typeMaps = {
    "string": "string",
    "number": "float",
    "boolean": "bool",
    "int8": "sbyte",
    "uint8": "byte",
    "int16": "short",
    "uint16": "ushort",
    "int32": "int",
    "uint32": "uint",
    "int64": "long",
    "uint64": "ulong",
    "float32": "float",
    "float64": "double",
};
/**
 * C# Code Generator
 */
const capitalize = (s) => {
    if (typeof s !== 'string')
        return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};
function generate(context, options) {
    // enrich typeMaps with enums
    context.enums.forEach((structure) => {
        typeMaps[structure.name] = structure.name;
    });
    return [
        ...context.classes.map(structure => ({
            name: `${structure.name}.cs`,
            content: generateClass(structure, options.namespace)
        })),
        ...context.interfaces.map(structure => ({
            name: `${structure.name}.cs`,
            content: generateInterface(structure, options.namespace),
        })),
        ...context.enums.filter(structure => structure.name !== 'OPERATION').map((structure) => ({
            name: `${structure.name}.cs`,
            content: generateEnum(structure, options.namespace),
        })),
    ];
}
function generateClass(klass, namespace) {
    const indent = (namespace) ? "\t" : "";
    return `${(0, types_1.getCommentHeader)()}

using Colyseus.Schema;
using Action = System.Action;
#if UNITY_5_3_OR_NEWER
using UnityEngine.Scripting;
#endif
${namespace ? `\nnamespace ${namespace} {` : ""}
${indent}public partial class ${klass.name} : ${klass.extends} {
#if UNITY_5_3_OR_NEWER
[Preserve] 
#endif
public ${klass.name}() { }
${klass.properties.map((prop) => generateProperty(prop, indent)).join("\n\n")}

${indent}\t/*
${indent}\t * Support for individual property change callbacks below...
${indent}\t */

${generateAllFieldCallbacks(klass, indent)}
${indent}}
${namespace ? "}" : ""}
`;
}
function generateEnum(_enum, namespace) {
    const indent = namespace ? "\t" : "";
    return `${(0, types_1.getCommentHeader)()}
${namespace ? `\nnamespace ${namespace} {` : ""}
${indent}public struct ${_enum.name} {

${_enum.properties
        .map((prop) => {
        let dataType = "int";
        let value;
        if (prop.type) {
            if (isNaN(Number(prop.type))) {
                value = `"${prop.type}"`;
                dataType = "string";
            }
            else {
                value = Number(prop.type);
                dataType = Number.isInteger(value) ? 'int' : 'float';
            }
        }
        else {
            value = _enum.properties.indexOf(prop);
        }
        return `${indent}\tpublic const ${dataType} ${prop.name} = ${value};`;
    })
        .join("\n")}
${indent}}
${namespace ? "}" : ""}`;
}
function generateProperty(prop, indent = "") {
    let typeArgs = `"${prop.type}"`;
    let property = "public";
    let langType;
    let initializer = "";
    if (prop.childType) {
        const isUpcaseFirst = prop.childType.match(/^[A-Z]/);
        langType = getType(prop);
        typeArgs += `, typeof(${langType})`;
        if (!isUpcaseFirst) {
            typeArgs += `, "${prop.childType}"`;
        }
        initializer = `new ${langType}()`;
    }
    else {
        langType = getType(prop);
        initializer = `default(${langType})`;
    }
    property += ` ${langType} ${prop.name}`;
    let ret = (prop.deprecated) ? `\t\t[System.Obsolete("field '${prop.name}' is deprecated.", true)]\n` : '';
    return ret + `\t${indent}[Type(${prop.index}, ${typeArgs})]
\t${indent}${property} = ${initializer};`;
}
function generateInterface(struct, namespace) {
    const indent = (namespace) ? "\t" : "";
    return `${(0, types_1.getCommentHeader)()}

using Colyseus.Schema;
${namespace ? `\nnamespace ${namespace} {` : ""}
${indent}public class ${struct.name} {
${struct.properties.map(prop => `\t${indent}public ${getType(prop)} ${prop.name};`).join("\n")}
${indent}}
${namespace ? "}" : ""}
`;
}
function generateAllFieldCallbacks(klass, indent) {
    //
    // TODO: improve me. It would be great to generate less boilerplate in favor
    // of a single implementation on C# Schema class itself.
    //
    const eventNames = [];
    return `${klass.properties
        .filter(prop => !prop.deprecated) // generate only for properties that haven't been deprecated.
        .map(prop => {
        const eventName = `__${prop.name}Change`;
        eventNames.push(eventName);
        const defaultNull = (prop.childType)
            ? "null"
            : `default(${getType(prop)})`;
        return `\t${indent}protected event PropertyChangeHandler<${getType(prop)}> ${eventName};
\t${indent}public Action On${capitalize(prop.name)}Change(PropertyChangeHandler<${getType(prop)}> __handler, bool __immediate = true) {
\t${indent}\tif (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
\t${indent}\t__callbacks.AddPropertyCallback(nameof(this.${prop.name}));
\t${indent}\t${eventName} += __handler;
\t${indent}\tif (__immediate && this.${prop.name} != ${defaultNull}) { __handler(this.${prop.name}, ${defaultNull}); }
\t${indent}\treturn () => {
\t${indent}\t\t__callbacks.RemovePropertyCallback(nameof(${prop.name}));
\t${indent}\t\t${eventName} -= __handler;
\t${indent}\t};
\t${indent}}`;
    }).join("\n\n")}

\t${indent}protected override void TriggerFieldChange(DataChange change) {
\t${indent}\tswitch (change.Field) {
${klass.properties.filter(prop => !prop.deprecated).map((prop, i) => {
        return `\t${indent}\t\tcase nameof(${prop.name}): ${eventNames[i]}?.Invoke((${getType(prop)}) change.Value, (${getType(prop)}) change.PreviousValue); break;`;
    }).join("\n")}
\t${indent}\t\tdefault: break;
\t\t${indent}}
\t${indent}}`;
}
function getChildType(prop) {
    return typeMaps[prop.childType];
}
function getType(prop) {
    if (prop.childType) {
        const isUpcaseFirst = prop.childType.match(/^[A-Z]/);
        let type;
        if (prop.type === "ref") {
            type = (isUpcaseFirst)
                ? prop.childType
                : getChildType(prop);
        }
        else {
            const containerClass = capitalize(prop.type);
            type = (isUpcaseFirst)
                ? `${containerClass}Schema<${prop.childType}>`
                : `${containerClass}Schema<${getChildType(prop)}>`;
        }
        return type;
    }
    else {
        return (prop.type === "array")
            ? `${typeMaps[prop.childType] || prop.childType}[]`
            : typeMaps[prop.type];
    }
}
//# sourceMappingURL=csharp.js.map