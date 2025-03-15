"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRegions = parseRegions;
exports.parseMarkdown = parseMarkdown;
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
    let currentData = null;
    for (let line of lines) {
        if (line.startsWith('```')) {
            insideCodeBlock = !insideCodeBlock;
        }
        if (line.startsWith('# ') && !insideCodeBlock) {
            // if there is data already, save it
            if (currentData) {
                currentData.content = currentData.content.join('\n');
                results.push(currentData);
            }
            currentData = {
                heading: line.slice(2),
                content: []
            };
        }
        else if (currentData) {
            currentData.content.push(line);
        }
    }
    if (currentData) {
        currentData.content = currentData.content.join('\n');
        results.push(currentData);
    }
    return results;
}
//# sourceMappingURL=parser.js.map