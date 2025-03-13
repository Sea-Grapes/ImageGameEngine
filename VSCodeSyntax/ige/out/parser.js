"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRegions = parseRegions;
function parseRegions(input) {
    const lines = input.split(/\r?\n/);
    const regions = {};
    let activeRegion = null;
    for (const line of lines) {
        if (line.startsWith('#region')) {
            if (activeRegion)
                regions[activeRegion.name] = activeRegion.lines.join('\n').trim();
            activeRegion = {
                name: line.replace('#region', '').trim(),
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
//# sourceMappingURL=parser.js.map