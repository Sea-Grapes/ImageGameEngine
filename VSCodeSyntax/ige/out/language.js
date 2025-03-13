"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completionData = void 0;
const node_1 = require("vscode-languageserver/node");
const fs = require("fs");
const path = require("path");
const parser_1 = require("./parser");
const basepath = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(basepath, file), 'utf-8');
const docs = (0, parser_1.parseRegions)(read('data/docs.md'));
const snippets = (0, parser_1.parseRegions)(read('data/snippets.ige'));
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
        command: {
            title: 'triggerParameterHints',
            command: 'editor.action.triggerParameterHints'
        }
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
        command: {
            title: 'triggerParameterHints',
            command: 'editor.action.triggerParameterHints'
        }
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
//# sourceMappingURL=language.js.map