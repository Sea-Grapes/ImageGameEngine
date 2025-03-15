"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completionData = exports.signatureData = void 0;
const node_1 = require("vscode-languageserver/node");
const parser_1 = require("./parser");
const utils_1 = require("./utils");
const snippets = (0, parser_1.parseRegions)((0, utils_1.read)('data/snippets.ige'));
// command for triggering signature help
const signatureHelpCommand = {
    title: 'triggerParameterHints',
    command: 'editor.action.triggerParameterHints'
};
const completionData = [
    {
        label: 'setup',
        kind: node_1.CompletionItemKind.Property,
        detail: '(snippet) default setup snippet',
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        insertText: snippets['setup']
    }
];
exports.completionData = completionData;
// parsing functions into completionData
const wordRegex = /\w+/;
(0, parser_1.parseMarkdown)((0, utils_1.read)('data/functions.md'), ({ heading, content }) => {
    let trigger = wordRegex.exec(heading)?.[0];
    if (!trigger)
        return;
    let title = (0, utils_1.cutString)(heading, ' ')[1];
    const res = {
        label: trigger,
        kind: node_1.CompletionItemKind.Function,
        detail: title,
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: content
        },
        command: signatureHelpCommand,
        insertTextFormat: node_1.InsertTextFormat.PlainText,
        insertText: trigger + ' '
    };
    completionData.push(res);
});
exports.signatureData = {
    '40': {
        label: '40 X Y',
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: ''
        },
        parameters: [
            { label: 'X' },
            { label: 'Y' }
        ]
    },
};
//# sourceMappingURL=language.js.map