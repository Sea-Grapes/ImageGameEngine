"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = exports.basePath = void 0;
exports.splitStr = splitStr;
const fs = require("fs");
const path = require("path");
exports.basePath = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(exports.basePath, file), 'utf-8');
exports.read = read;
function splitStr(string, delimiter) {
    const i = string.indexOf(delimiter);
    if (i === -1)
        return [string, ''];
    return [string.slice(0, i), string.slice(i + 1)];
}
//# sourceMappingURL=utils.js.map