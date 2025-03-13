import { CompletionItem, CompletionItemKind, InsertTextFormat, MarkupKind, SignatureInformation } from 'vscode-languageserver/node'
import { parseRegions } from "./parser"
import { read } from './utils'

const docs = parseRegions(read('data/docs.md'))
const snippets = parseRegions(read('data/snippets.ige'))

// if the function has parameters, upon completion resolve
const signatureHelpCommand = {
  title: 'triggerParameterHints',
  command: 'editor.action.triggerParameterHints'
}


export const completionData: CompletionItem[] = [
  {
    label: '40',
    kind: CompletionItemKind.Function,
    detail: '(method) 0x40 Goto function',
    documentation: {
      kind: MarkupKind.Markdown,
      value: docs['40']
    },
    insertTextFormat: InsertTextFormat.Snippet,
    insertText: "40 ${1:00} ${2:00}",
    command: signatureHelpCommand
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
    command: signatureHelpCommand
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
  },
  {
    label: 'setup',
    kind: CompletionItemKind.Property,
    detail: '(snippet) default setup snippet',
    insertTextFormat: InsertTextFormat.Snippet,
    insertText: snippets['setup']
  }
]


export const signatureData: Record<string, SignatureInformation | SignatureInformation[]> = {
  '40': [
    {
      label: '40 X Y',
      documentation: {
        kind: MarkupKind.Markdown,
        value: docs['40']
      },
      parameters: [
        {
          label: 'X',
        },
        {
          label: 'Y',
        }
      ]
    },
    {
      label: '40 X Y Z',
      documentation: {
        kind: MarkupKind.Markdown,
        value: docs['40']
      },
      parameters: [
        { label: 'X' },
        { label: 'Y' },
        { label: 'Z' },
      ]
    }
  ]
}