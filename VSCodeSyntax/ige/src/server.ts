import { TextDocument } from 'vscode-languageserver-textdocument'
import { CompletionItem, CompletionItemKind, CompletionParams, CompletionTriggerKind, createConnection, InitializeResult, InsertTextFormat, MarkupKind, ProposedFeatures, SignatureHelpParams, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver/node'
import * as fs from 'fs'
import * as path from 'path'


// const yaml_data = fs.readFileSync('./docs.yaml')


const ws = createConnection(ProposedFeatures.all)

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument)

ws.onInitialize((): InitializeResult => {

  console.log('[IGE SERVER] active')

  const numberTriggers = Array.from({length: 10}, (v, i) => i.toString())

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        // hacky fix to allow number commands, because wordpattern isn't working
        triggerCharacters: numberTriggers
      },
      signatureHelpProvider: {
        triggerCharacters: 'abcdefghijklmnopqrstuvwxyz '.split('').concat(numberTriggers)
      }
    }
  }
})

ws.onCompletion((params: CompletionParams) => {

  // console.log('completion')

  const doc = documents.get(params.textDocument.uri)
  
  const position = params.position
  const lineText = doc.getText({
    start: { line: position.line, character: 0 },
    end: { line: position.line, character: Number.MAX_VALUE }
  })


  // get string from start to cursor
  const lineStart = lineText.slice(0, position.character)

  // check if cursor is in the first word. we're assuming that
  // command completions will always be in the first word
  const isCursorInFirstWord = lineStart.trim().split(/\s+/).length <= 1
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
  // see if cursor inside a parameter

  console.log('evt: sig help')


  const doc = documents.get(params.textDocument.uri)
  const position = params.position

  let lineText = doc.getText({
    start: { line: position.line, character: 0 },
    end: { line: position.line, character: Number.MAX_VALUE }
  })

  let tokens = Array.from(lineText.trimStart().matchAll(/ *\S+/g)).map(token => {
    return {
      string: token[0],
      start: token.index,
      end: token.index + token[0].length
    }
  })

  // tokens.shift()

  const currentTokenIndex = tokens.findIndex(token => position.character >= token.start && position.character <= token.end)

  console.log(currentTokenIndex)

  if(currentTokenIndex <= 0) return null


  // let pos = 0
  // let lineTokens = lineText.trim().split(/\s+/).map(string => {
  //   const start = lineText.indexOf(string, pos)
  //   const end = start + string.length

  //   pos = end
  //   return { start, end, string }
  // })

  // const currentTokenIndex = lineTokens.findIndex(token => position.character >= token.start && position.character <= token.end)
  // const currentToken = currentTokenIndex >= 0 ? lineTokens[currentTokenIndex] : null

  // console.log(currentTokenIndex)

  // if(currentToken === null || currentTokenIndex === 0) return { signatures: [] }
  
  return {
    activeParameter: currentTokenIndex - 1,
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