import { TextDocument } from 'vscode-languageserver-textdocument'
import { CompletionItem, CompletionItemKind, CompletionParams, createConnection, InitializeResult, InsertTextFormat, MarkupKind, ProposedFeatures, SignatureHelpParams, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver/node'
import * as fs from 'fs'
import * as path from 'path'

const ws = createConnection(ProposedFeatures.all)

console.log('HELLO')
ws.console.log('HELLO')

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument)

ws.onInitialize((): InitializeResult => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        // hacky fix to allow number commands, because wordpattern wasn't working
        triggerCharacters: Array.from({length: 10}, (v, i) => i.toString())
      },
      signatureHelpProvider: {
        triggerCharacters: [' ']
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
        value: `Goes to the specified address.`
      },
      insertTextFormat: InsertTextFormat.Snippet,
      insertText: "40 ${1:00} ${2:00}",
      command: {
        title: 'triggerParameterHints',
        command: 'editor.action.triggerParameterHints'
      }
    },
    {
      label: 'B0',
      kind: CompletionItemKind.Function,
      detail: '(method) 0xB0 Write',
      documentation: {
        kind: MarkupKind.Markdown,
        value: 'Writes a singular pixel value to a specific address.'
      },
      insertTextFormat: InsertTextFormat.Snippet,
      insertText: 'B0 ${1:00} ${2:00}',
      command: {
        title: 'triggerParameterHints',
        command: 'editor.action.triggerParameterHints'
      }
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

ws.onSignatureHelp((params: SignatureHelpParams) => {

  console.log(params)

  return {
    signatures: [
      {
        label: '40 x y',
        documentation: 'this is a test does this work',
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
      },
      {
        label: 'B0 x y',
        documentation: 'Writes a singular pixel value to a specific address.',
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
  }
})

documents.listen(ws)
ws.listen()

console.log