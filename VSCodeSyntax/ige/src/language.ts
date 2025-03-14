import { CompletionItem, CompletionItemKind, InsertTextFormat, MarkupKind, SignatureInformation } from 'vscode-languageserver/node'
import { parseDocs, parseRegions } from "./parser"
import { read } from './utils'

const docs = parseDocs(read('data/docs.md'))
const snippets = parseRegions(read('data/snippets.ige'))

// console.log(docs)

// if the function has parameters, upon completion resolve
const signatureHelpCommand = {
  title: 'triggerParameterHints',
  command: 'editor.action.triggerParameterHints'
}


interface bundFuncParams {
  trigger: string
  title?: string
  insert?: string
  snippet?: string
}


function buildFunc({ trigger, title = '', insert, snippet }: bundFuncParams): CompletionItem {
  const res: CompletionItem = {
    label: trigger,
    kind: CompletionItemKind.Function,
    detail: title,
    documentation: {
      kind: MarkupKind.Markdown,
      value: docs[trigger]
    },
    command: signatureHelpCommand
  }

  if(insert) {
    res.insertTextFormat = InsertTextFormat.PlainText
    res.insertText = insert
  }

  if(snippet) {
    res.insertTextFormat = InsertTextFormat.Snippet
    res.insertText = snippet
  }

  return res
}


export const completionData: CompletionItem[] = [
  buildFunc({
    trigger: '00',
    title: '(special) 0x00 Null'
  }),
  buildFunc({
    trigger: '50',
    title: '(method) 0x50 Offset function'
  }),
  buildFunc({
    trigger: '40',
    title: '(method) 0x40 Goto function',
    snippet: "40 ${1:00} ${0:00}",
  }),
  {
    label: 'setup',
    kind: CompletionItemKind.Property,
    detail: '(snippet) default setup snippet',
    insertTextFormat: InsertTextFormat.Snippet,
    insertText: snippets['setup']
  }
]


export const signatureData: Record<string, SignatureInformation | SignatureInformation[]> = {
  '40': {
    label: '40 X Y',
    documentation: {
      kind: MarkupKind.Markdown,
      value: docs['40']
    },
    parameters: [
      { label: 'X' },
      { label: 'Y' }
    ]
  },
}