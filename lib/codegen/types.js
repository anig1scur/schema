"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = exports.Enum = exports.Class = exports.Interface = exports.Context = void 0;
exports.getCommentHeader = getCommentHeader;
exports.getInheritanceTree = getInheritanceTree;
const fs = require("fs");
const VERSION = JSON.parse(fs.readFileSync(__dirname + "/../../package.json").toString()).version;
const COMMENT_HEADER = `
THIS FILE HAS BEEN GENERATED AUTOMATICALLY
DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING

GENERATED USING @colyseus/schema ${VERSION}
`;
function getCommentHeader(singleLineComment = "//") {
    return `${COMMENT_HEADER.split("\n").map(line => `${singleLineComment} ${line}`).join("\n")}`;
}
class Context {
    constructor() {
        this.classes = [];
        this.interfaces = [];
        this.enums = [];
    }
    getStructures() {
        return {
            classes: this.classes.filter(klass => {
                if (this.isSchemaClass(klass)) {
                    return true;
                }
                else {
                    let parentClass = klass;
                    while (parentClass = this.getParentClass(parentClass)) {
                        if (this.isSchemaClass(parentClass)) {
                            return true;
                        }
                    }
                }
                return false;
            }),
            interfaces: this.interfaces,
            enums: this.enums,
        };
    }
    addStructure(structure) {
        structure.context = this;
        if (structure instanceof Class) {
            this.classes.push(structure);
        }
        else if (structure instanceof Interface) {
            this.interfaces.push(structure);
        }
        else if (structure instanceof Enum) {
            this.enums.push(structure);
        }
    }
    getParentClass(klass) {
        return this.classes.find(c => c.name === klass.extends);
    }
    isSchemaClass(klass) {
        let isSchema = false;
        let currentClass = klass;
        while (!isSchema && currentClass) {
            //
            // TODO: ideally we should check for actual @colyseus/schema module
            // reference rather than arbitrary strings.
            //
            isSchema = (currentClass.extends === "Schema" ||
                currentClass.extends === "schema.Schema" ||
                currentClass.extends === "Schema.Schema");
            //
            // When extending from `schema.Schema`, it is required to
            // normalize as "Schema" for code generation.
            //
            if (currentClass === klass && isSchema) {
                klass.extends = "Schema";
            }
            currentClass = this.getParentClass(currentClass);
        }
        return isSchema;
    }
}
exports.Context = Context;
class Interface {
    constructor() {
        this.properties = [];
    }
    addProperty(property) {
        if (property.type.indexOf("[]") >= 0) {
            // is array!
            property.childType = property.type.match(/([^\[]+)/i)[1];
            property.type = "array";
            this.properties.push(property);
        }
        else {
            this.properties.push(property);
        }
    }
}
exports.Interface = Interface;
class Class {
    constructor() {
        this.properties = [];
    }
    addProperty(property) {
        property.index = this.properties.length;
        this.properties.push(property);
    }
    postProcessing() {
        /**
         * Ensure the proprierties `index` are correct using inheritance
         */
        let parentKlass = this;
        while (parentKlass &&
            (parentKlass = this.context.classes.find(k => k.name === parentKlass.extends))) {
            this.properties.forEach(prop => {
                prop.index += parentKlass.properties.length;
            });
        }
    }
}
exports.Class = Class;
class Enum {
    constructor() {
        this.properties = [];
    }
    addProperty(property) {
        this.properties.push(property);
    }
}
exports.Enum = Enum;
class Property {
}
exports.Property = Property;
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
//# sourceMappingURL=types.js.map