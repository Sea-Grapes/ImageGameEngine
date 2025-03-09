"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const node_1 = require("vscode-languageserver/node");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const basepath = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(basepath, file), 'utf-8');
const ws = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
ws.onInitialize(() => {
    console.log('[IGE SERVER] active');
    const numberTriggers = Array.from({ length: 10 }, (v, i) => i.toString());
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const signatureTriggers = alphabet.split('')
        .concat(alphabet.toUpperCase().split(''))
        .concat(numberTriggers)
        .concat(' ', '$');
    return {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true,
                // hacky fix to allow number commands, because wordpattern isn't working
                triggerCharacters: numberTriggers
            },
            signatureHelpProvider: {
                triggerCharacters: signatureTriggers
            }
        }
    };
});
function parseDocs(input) {
    const data = input.trim().split(/@(\w+)/).filter(Boolean);
    const res = {};
    for (let i = 0; i < data.length; i += 2) {
        const key = data[i];
        const value = data[i + 1].trim();
        res[key] = value;
    }
    return res;
}
const config = YAML.parse(read('data/config.yaml'));
const docs = parseDocs(read('data/docs.md'));
const completionData = Object.entries(config).map(([triggerString, data]) => {
    let res = {
        label: triggerString,
        kind: data.type ?? node_1.CompletionItemKind.Function,
        detail: data.title,
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: docs[triggerString] ?? 'Unknown'
        }
    };
    if (data.type === node_1.CompletionItemKind.Function) {
        res.command = {
            title: 'triggerParameterHints',
            command: 'editor.action.triggerParameterHints'
        };
    }
    if (data.snippet) {
        res.insertTextFormat = node_1.InsertTextFormat.Snippet;
        res.insertText = data.snippet;
    }
    return res;
});
ws.onCompletion((params) => {
    const doc = documents.get(params.textDocument.uri);
    const position = params.position;
    const lineText = doc.getText({
        start: { line: position.line, character: 0 },
        end: { line: position.line, character: Number.MAX_VALUE }
    });
    // get string from start to cursor
    const lineStart = lineText.slice(0, position.character);
    // check if cursor is in the first word. we're assuming that
    // command completions will always be in the first word
    const isCursorInFirstWord = lineStart.trim().split(/\s+/).length <= 1;
    if (!isCursorInFirstWord)
        return [];
    return completionData;
    /*return [
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
    ]*/
});
ws.onCompletionResolve((item) => {
    return item;
});
ws.onSignatureHelp((params) => {
    // see if cursor inside a parameter
    // this is purely for methods parameters
    const doc = documents.get(params.textDocument.uri);
    const position = params.position;
    let lineText = doc.getText({
        start: { line: position.line, character: 0 },
        end: { line: position.line, character: Number.MAX_VALUE }
    });
    // let firstToken = lineText.match(/\S+/)[0]
    let tokens = Array.from(lineText.trimStart().matchAll(/ *\S+|\s+/g)).map(token => {
        return {
            string: token[0],
            start: token.index,
            end: token.index + token[0].length
        };
    });
    const currentTokenIndex = tokens.findIndex(token => position.character >= token.start && position.character <= token.end);
    if (currentTokenIndex <= 0)
        return null;
    let currentParameterIndex = currentTokenIndex - 1;
    // fill this in with real value later
    let numOfParams = 2;
    if (currentParameterIndex >= numOfParams)
        return null;
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
    };
});
documents.listen(ws);
ws.listen();
//# sourceMappingURL=server.js.map