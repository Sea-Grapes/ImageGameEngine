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
      value: ''
    },
    parameters: [
      { label: 'X' },
      { label: 'Y' }
    ]
  },
}