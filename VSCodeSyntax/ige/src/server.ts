import { TextDocument } from 'vscode-languageserver-textdocument'
import { CompletionItem, CompletionItemKind, createConnection, InitializeResult, MarkupKind, ProposedFeatures, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver/node'

const ws = createConnection(ProposedFeatures.all)

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument)

ws.onInitialize((): InitializeResult => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true
      }
    }
  }
})

ws.onCompletion(() => {
  return [
    {
      label: 'D0',
      kind: CompletionItemKind.Function,
      documentation: {
        kind: MarkupKind.Markdown,
        value: 'This is a test adding markdown'
      },
      detail: 'Fill area'
    }
  ]
})

ws.onCompletionResolve((item: CompletionItem) => {
  return item
})

documents.listen(ws)
ws.listen()

console.log