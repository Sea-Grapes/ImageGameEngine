import { TextDocument } from 'vscode-languageserver-textdocument'
import { CompletionItem, CompletionItemKind, CompletionParams, createConnection, InitializeResult, InsertTextFormat, MarkupKind, ProposedFeatures, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver/node'
import * as fs from 'fs'
import * as path from 'path'

const ws = createConnection(ProposedFeatures.all)

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument)

ws.onInitialize((): InitializeResult => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        // hacky fix to allow number commands, because wordpattern wasn't working
        triggerCharacters: Array.from({length: 10}, (v, i) => i.toString())
      }
    }
  }
})

ws.onCompletion((data) => {

  return [
    {
      label: '40',
      kind: CompletionItemKind.Function,
      detail: '(method) 0x40 Goto function',
      documentation: {
        kind: MarkupKind.Markdown,
        value: `Goes to the specified address.\n`
      },
      insertTextFormat: InsertTextFormat.Snippet,
      insertText: "D0 ${1:00} ${2:00}"
    },
    {
      label: 'A0',
      kind: CompletionItemKind.Function,
      detail: 'Value mode',
      documentation: {
        kind: MarkupKind.Markdown,
        value: 'Todo'
      },
    },
    {
      label: 'A1',
      kind: CompletionItemKind.Function,
      detail: 'Variable mode',
      documentation: {
        kind: MarkupKind.Markdown,
        value: 'Todo'
      }
    }
  ]
})

ws.onCompletionResolve((item: CompletionItem) => {
  return item
})

// ws.onSignatureHelp(() => {
//   return {
//     signatures: [
//       {
//         label: '40',
//         documentation: 'this is a test',
//         parameters: [
//           {
//             label: 'x',
//             documentation: 'x coordinate'
//           },
//           {
//             label: 'y',
//             documentation: 'y coordinate'
//           }
//         ]
//       }
//     ]
//   }
// })

documents.listen(ws)
ws.listen()

console.log