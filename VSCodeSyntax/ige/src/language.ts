import { CompletionItem, CompletionItemKind, InsertTextFormat, MarkupKind, SignatureInformation } from 'vscode-languageserver/node'
import { parseMarkdown, parseRegions } from "./parser"
import { read } from './utils'

const functions = parseMarkdown(read('data/functions.md'))
const snippets = parseRegions(read('data/snippets.ige'))

// command for triggering signature help
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