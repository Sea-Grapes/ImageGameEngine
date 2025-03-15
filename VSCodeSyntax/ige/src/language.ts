import { CompletionItem, CompletionItemKind, InsertTextFormat, MarkupKind, SignatureInformation } from 'vscode-languageserver/node'
import { parseMarkdown, parseRegions } from "./parser"
import { cutString, read } from './utils'


const snippets = parseRegions(read('data/snippets.ige'))

// command for triggering signature help
const signatureHelpCommand = {
  title: 'triggerParameterHints',
  command: 'editor.action.triggerParameterHints'
}

const completionData: CompletionItem[] = [
  {
    label: 'setup',
    kind: CompletionItemKind.Property,
    detail: '(snippet) default setup snippet',
    insertTextFormat: InsertTextFormat.Snippet,
    insertText: snippets['setup']
  }
]

// parsing functions into completionData
const wordRegex = /\w+/
parseMarkdown(read('data/functions.md'), ({ heading, content }) => {
  let trigger = wordRegex.exec(heading)?.[0]
  if(!trigger) return

  let title = cutString(heading, ' ')[1]
  
  const res: CompletionItem = {
    label: trigger,
    kind: CompletionItemKind.Function,
    detail: title,
    documentation: {
      kind: MarkupKind.Markdown,
      value: content
    },
    command: signatureHelpCommand,
    insertTextFormat: InsertTextFormat.PlainText,
    insertText: trigger + ' '
  }

  completionData.push(res)
})

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

export { completionData }