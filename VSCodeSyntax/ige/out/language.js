"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signatureData = exports.completionData = void 0;
const node_1 = require("vscode-languageserver/node");
const parser_1 = require("./parser");
const utils_1 = require("./utils");
const functions = (0, parser_1.parseMarkdown)((0, utils_1.read)('data/functions.md'));
const snippets = (0, parser_1.parseRegions)((0, utils_1.read)('data/snippets.ige'));
// command for triggering signature help
const signatureHelpCommand = {
    title: 'triggerParameterHints',
    command: 'editor.action.triggerParameterHints'
};
function buildFunc({ trigger, title = '', insert, snippet }) {
    const res = {
        label: trigger,
        kind: node_1.CompletionItemKind.Function,
        detail: title,
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: docs[trigger]
        },
        command: signatureHelpCommand
    };
    if (insert) {
        res.insertTextFormat = node_1.InsertTextFormat.PlainText;
        res.insertText = insert;
    }
    if (snippet) {
        res.insertTextFormat = node_1.InsertTextFormat.Snippet;
        res.insertText = snippet;
    }
    return res;
}
exports.completionData = [
    {
        label: 'setup',
        kind: node_1.CompletionItemKind.Property,
        detail: '(snippet) default setup snippet',
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        insertText: snippets['setup']
    }
];
exports.signatureData = {
    '40': {
        label: '40 X Y',
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: docs['40']
        },
        parameters: [
            { label: 'X' },
            { label: 'Y' }
        ]
    },
};
//# sourceMappingURL=language.js.map