"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const fs = require("fs");
const path = require("path");
const parser_1 = require("./parser");
function generate(targetId, options) {
    let generator;
    try {
        generator = require('./languages/' + targetId).generate;
    }
    catch (e) {
        throw new Error("You must provide a valid generator as argument, such as: --csharp, --haxe or --cpp");
    }
    if (!fs.existsSync(options.output)) {
        console.log("Creating", options.output, "directory");
        fs.mkdirSync(options.output);
    }
    /**
     * Default `@type()` decorator name
     */
    if (!options.decorator) {
        options.decorator = "type";
    }
    // resolve wildcard files
    options.files = options.files.reduce((acc, cur) => {
        if (cur.endsWith("*")) {
            acc.push(...recursiveFiles(cur.slice(0, -1)).filter(filename => /\.(js|ts|mjs)$/.test(filename)));
        }
        else {
            acc.push(cur);
        }
        return acc;
    }, []);
    const structures = (0, parser_1.parseFiles)(options.files, options.decorator);
    // Post-process classes before generating
    structures.classes.forEach(klass => klass.postProcessing());
    const files = generator(structures, options);
    files.forEach((file) => {
        const outputPath = path.resolve(options.output, file.name);
        fs.writeFileSync(outputPath, file.content);
        console.log("generated:", file.name);
    });
}
function recursiveFiles(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let collect = [];
    files.forEach(file => {
        const filename = path.resolve(dir, file.name);
        file.isDirectory() ? collect.push(...recursiveFiles(filename)) : collect.push(filename);
    });
    return collect;
}
//# sourceMappingURL=api.js.map