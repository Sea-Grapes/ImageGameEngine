import { TextDocument } from 'vscode-languageserver-textdocument'
import { CompletionItem, CompletionItemKind, CompletionParams, CompletionTriggerKind, createConnection, InitializeResult, InsertTextFormat, MarkupKind, ProposedFeatures, SignatureHelpParams, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver/node'
import * as fs from 'fs'
import * as path from 'path'

const ws = createConnection(ProposedFeatures.all)

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument)

ws.onInitialize((): InitializeResult => {

  console.log('[IGE SERVER] active')

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

// add parsing here to sort methods
// ex. don't show A0 when typing coords
ws.onCompletion((params: CompletionParams) => {
  
  // console.log(params)
  
  const doc = documents.get(params.textDocument.uri)
  
  const position = params.position
  const lineText = doc.getText({
    start: { line: position.line, character: 0 },
    end: { line: position.line, character: Number.MAX_VALUE }
  })


  // get string from start to cursor
  const lineStart = lineText.slice(0, position.character)
  const isCursorInFirstWord = lineStart.trim().split(/\s+/).length <= 1

  console.log(isCursorInFirstWord)

  if(!isCursorInFirstWord) return []

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

  // console.log(params)

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