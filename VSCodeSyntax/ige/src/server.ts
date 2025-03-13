import { TextDocument } from 'vscode-languageserver-textdocument'
import { CompletionItem, CompletionParams, createConnection, InitializeResult, ProposedFeatures, SignatureHelpParams, SignatureHelp, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver/node'

import { completionData } from './language'

const ws = createConnection(ProposedFeatures.all)
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument)

ws.onInitialize((): InitializeResult => {
  console.log('[IGE SERVER] active')

  const numberTriggers = Array.from({length: 10}, (v, i) => i.toString())
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'

  const signatureTriggers = alphabet.split('')
    .concat(alphabet.toUpperCase().split(''))
    .concat(numberTriggers)
    .concat(' ', '$')

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        // hacky fix to allow number commands, because wordpattern isn't working
        triggerCharacters: numberTriggers
      },
      signatureHelpProvider: {
        triggerCharacters: signatureTriggers
      }
    }
  }
})


ws.onCompletion((params: CompletionParams): CompletionItem[] => {

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

  return completionData
})

ws.onCompletionResolve((item: CompletionItem) => {
  return item
})


ws.onSignatureHelp((params: SignatureHelpParams): SignatureHelp => {
  // see if cursor inside a parameter
  // this is purely for methods parameters


  const doc = documents.get(params.textDocument.uri)
  const position = params.position

  let lineText = doc.getText({
    start: { line: position.line, character: 0 },
    end: { line: position.line, character: Number.MAX_VALUE }
  })

  // let firstToken = lineText.match(/\S+/)[0]

  let tokens = Array.from(lineText.matchAll(/ *\S+|\s+/g)).map(token => {
    return {
      string: token[0],
      start: token.index,
      end: token.index + token[0].length
    }
  })

  const currentTokenIndex = tokens.findIndex(token => position.character >= token.start && position.character <= token.end)
  // if we're in first token, quit
  if(currentTokenIndex <= 0) return null

  

  let currentParameterIndex = currentTokenIndex - 1

  // fill this in with real value later
  let numOfParams = 2
  if(currentParameterIndex >= numOfParams) return null

  
  return {
    activeParameter: currentParameterIndex,
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