"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signatureData = exports.completionData = void 0;
const node_1 = require("vscode-languageserver/node");
const parser_1 = require("./parser");
const utils_1 = require("./utils");
const docs = (0, parser_1.parseRegions)((0, utils_1.read)('data/docs.md'));
const snippets = (0, parser_1.parseRegions)((0, utils_1.read)('data/snippets.ige'));
// if the function has parameters, upon completion resolve
const signatureHelpCommand = {
    title: 'triggerParameterHints',
    command: 'editor.action.triggerParameterHints'
};
exports.completionData = [
    {
        label: '40',
        kind: node_1.CompletionItemKind.Function,
        detail: '(method) 0x40 Goto function',
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: docs['40']
        },
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        insertText: "40 ${1:00} ${2:00}",
        command: signatureHelpCommand
    },
    {
        label: 'B0',
        kind: node_1.CompletionItemKind.Function,
        detail: '(method) 0xB0 Write',
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: 'Writes a singular pixel value to a specific address.'
        },
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        insertText: 'B0 ${1:00} ${2:00}',
        command: signatureHelpCommand
    },
    {
        label: 'A0',
        kind: node_1.CompletionItemKind.Function,
        detail: 'Value mode',
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: 'Todo'
        },
    },
    {
        label: 'A1',
        kind: node_1.CompletionItemKind.Function,
        detail: 'Variable mode',
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: 'Todo'
        }
    },
    {
        label: 'setup',
        kind: node_1.CompletionItemKind.Property,
        detail: '(snippet) default setup snippet',
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        insertText: snippets['setup']
    }
];
exports.signatureData = {
    '40': [
        {
            label: '40 X Y',
            documentation: {
                kind: node_1.MarkupKind.Markdown,
                value: docs['40']
            },
            parameters: [
                {
                    label: 'X',
                },
                {
                    label: 'Y',
                }
            ]
        },
        {
            label: '40 X Y Z',
            documentation: {
                kind: node_1.MarkupKind.Markdown,
                value: docs['40']
            },
            parameters: [
                { label: 'X' },
                { label: 'Y' },
                { label: 'Z' },
            ]
        }
    ]
};
//# sourceMappingURL=language.js.map