"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = exports.basePath = void 0;
const fs = require("fs");
const path = require("path");
exports.basePath = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(exports.basePath, file), 'utf-8');
exports.read = read;
//# sourceMappingURL=utils.js.map