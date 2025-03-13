import { TextDocument } from 'vscode-languageserver-textdocument'
import { CompletionItem, CompletionParams, createConnection, InitializeResult, ProposedFeatures, SignatureHelpParams, SignatureHelp, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver/node'

import { completionData, signatureData } from './language'

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

  console.log('EVT: signature')
  console.log(params.context.activeSignatureHelp)


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

  // if we're in first token, quit
  const currentTokenIndex = tokens.findIndex(token => position.character >= token.start && position.character <= token.end)
  if(currentTokenIndex <= 0) return null

  // if the first token has no signatures, quit
  let firstToken = tokens[0].string.trim()
  if(!signatureData[firstToken]) return null

  let currentParameterIndex = currentTokenIndex - 1

  // fill this in with real value later
  // possibly, check what the activeSignature is
  // and clamp the parameter count to this
  let numOfParams = 2
  if(currentParameterIndex >= numOfParams) return null

  let currentData = signatureData[firstToken]
  if(!Array.isArray(currentData)) currentData = [currentData]

  
  return {
    activeSignature: params.context.activeSignatureHelp?.activeSignature,
    activeParameter: currentParameterIndex,
    signatures: currentData
  }
})

documents.listen(ws)
ws.listen()