"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRegions = parseRegions;
exports.parseDocs = parseDocs;
const utils_1 = require("./utils");
const newlineRegex = /\r?\n/;
const wordRegex = /\w+/;
function parseRegions(input) {
    const lines = input.split(/\r?\n/);
    const regions = {};
    let activeRegion = null;
    for (const line of lines) {
        if (line.startsWith('#region')) {
            if (activeRegion)
                regions[activeRegion.name] = activeRegion.lines.join('\n').trim();
            activeRegion = {
                name: line.replace('#region', '').match(/\w+/)[0].trim(),
                lines: []
            };
        }
        else if (line.startsWith('#endregion') && activeRegion) {
            regions[activeRegion.name] = activeRegion.lines.join('\n');
            activeRegion = null;
        }
        else if (activeRegion) {
            activeRegion.lines.push(line);
        }
    }
    if (activeRegion) {
        regions[activeRegion.name] = activeRegion.lines.join('\n').trim();
    }
    return regions;
}
function parseDocs(input) {
    const lines = input.split(newlineRegex);
    const sections = {};
    let activeKey;
    for (let line of lines) {
        if (line.startsWith('# ')) {
            line = line.slice(2);
            activeKey = wordRegex.exec(line)[0];
            const title = (0, utils_1.cutString)(line, ' ')[1];
            sections[activeKey] = {
                title,
                content: ''
            };
        }
        else if (activeKey) {
            sections[activeKey].content += line;
        }
    }
    return sections;
}
//# sourceMappingURL=parser.js.map