"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRegions = parseRegions;
const newlines = /\r?\n/;
const wordRegex = /\w+/;
// parse #region and #endregion
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
// key = wordRegex.exec(line)?.[0]
// basic markdown parser for top-level headings
function parseMarkdown(input) {
    const lines = input.split(newlines);
    const results = [];
    let insideCodeBlock = false;
    for (const line of lines) {
        if (line.startsWith('```')) {
            insideCodeBlock = !insideCodeBlock;
        }
        // start a new data region
        if (line.startsWith('# ') && !insideCodeBlock) {
            results.push({
                heading: line.slice(2),
                content: ''
            });
        }
        else if (results.length) {
            let current = results.at(-1);
            current.content += (current.content.length ? '\n' : '') + line;
        }
    }
    return results;
}
//# sourceMappingURL=parser.js.map