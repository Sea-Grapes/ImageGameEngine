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
            // completionProvider: {
            //   resolveProvider: true
            // }
        }
    };
});
// ws.onCompletion(() => {
//   return [
//     {
//       label: 'D0',
//       kind: CompletionItemKind.Function,
//       documentation: {
//         kind: MarkupKind.Markdown,
//         value: 'This is a test adding markdown'
//       },
//       detail: 'Fill area'
//     }
//   ]
// })
// ws.onCompletionResolve((item: CompletionItem) => {
//   return item
// })
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