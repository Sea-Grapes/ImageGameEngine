"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const node_1 = require("vscode-languageserver/node");
const ws = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
ws.onInitialize(() => {
    return {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true,
                // hacky fix to allow number commands, because wordpattern wasn't working
                triggerCharacters: Array.from({ length: 10 }, (v, i) => i.toString())
            },
            // signatureHelpProvider: {
            //   triggerCharacters: [' ']
            // }
        }
    };
});
ws.onCompletion((data) => {
    return [
        {
            label: '40',
            kind: node_1.CompletionItemKind.Function,
            detail: '(method) \`0x40\` Goto function',
            documentation: {
                kind: node_1.MarkupKind.Markdown,
                value: `Goes to the specified address.\n`
            },
            insertTextFormat: node_1.InsertTextFormat.Snippet,
            insertText: "40 ${1:00} ${2:00}"
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
        }
    ];
});
ws.onCompletionResolve((item) => {
    return item;
});
ws.onSignatureHelp(() => {
    return {
        signatures: [
            {
                label: '40',
                documentation: 'this is a test',
                parameters: [
                    {
                        label: 'x',
                        documentation: 'x coordinate'
                    },
                    {
                        label: 'y',
                        documentation: 'y coordinate'
                    }
                ]
            }
        ]
    };
});
documents.listen(ws);
ws.listen();
console.log;
//# sourceMappingURL=server.js.map