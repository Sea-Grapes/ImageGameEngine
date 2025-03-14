"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signatureData = exports.completionData = void 0;
const node_1 = require("vscode-languageserver/node");
const parser_1 = require("./parser");
const utils_1 = require("./utils");
const docs = (0, parser_1.parseDocs)((0, utils_1.read)('data/docs.md'));
const snippets = (0, parser_1.parseRegions)((0, utils_1.read)('data/snippets.ige'));
// console.log(docs)
// if the function has parameters, upon completion resolve
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
    },
    buildFunc({
        trigger: '00',
        title: '(special) 0x00 Null',
        insert: '00 '
    }),
    buildFunc({
        trigger: '50',
        title: '(method) 0x50 Offset function',
        insert: '50 '
    }),
    buildFunc({
        trigger: '40',
        title: '(method) 0x40 Goto function',
        // snippet: "40 ${1:00} ${0:00}",
        insert: '40 '
    }),
    buildFunc({
        trigger: 'A0',
        title: '(method) 0xA0 Value function',
        insert: 'A0 '
    }),
    buildFunc({
        trigger: 'A1',
        title: '(method) 0xA1 Variable function'
    })
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