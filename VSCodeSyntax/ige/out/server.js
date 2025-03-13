"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const node_1 = require("vscode-languageserver/node");
const fs = require("fs");
const path = require("path");
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
const basepath = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(basepath, file), 'utf-8');
function parseSections(input) {
    const data = input.trim().split(/@(\w+)/).filter(Boolean);
    const res = {};
    for (let i = 0; i < data.length; i += 2) {
        const key = data[i];
        const value = data[i + 1].trim();
        res[key] = value;
    }
    return res;
}
function parseRegions(input) {
    const lines = input.split(/\r?\n/);
    const regions = {};
    let activeRegion = null;
    for (const line of lines) {
        if (line.startsWith('#region')) {
            if (activeRegion)
                regions[activeRegion.name] = activeRegion.lines.join('\n').trim();
            activeRegion = {
                name: line.replace('#region', '').trim(),
                lines: []
            };
        }
        else if (line.startsWith('#endregion') && activeRegion) {
            regions[activeRegion.name] = activeRegion.lines.join('\n');
            activeRegion = null;
        }
        else if (activeRegion) {
            activeRegion.lines.push(line);
        }
    }
    if (activeRegion) {
        regions[activeRegion.name] = activeRegion.lines.join('\n').trim();
    }
    return regions;
}
const docs = parseSections(read('data/docs.md'));
const snippets = parseSections(read('data/snippets.ige'));
const completionData = [
    {
        label: '40',
        kind: node_1.CompletionItemKind.Function,
        detail: '(method) 0x40 Goto function',
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: docs['40']
        },
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        insertText: "40 ${1:00} ${2:00}",
        command: {
            title: 'triggerParameterHints',
            command: 'editor.action.triggerParameterHints'
        }
    },
    {
        label: 'B0',
        kind: node_1.CompletionItemKind.Function,
        detail: '(method) 0xB0 Write',
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: 'Writes a singular pixel value to a specific address.'
        },
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        insertText: 'B0 ${1:00} ${2:00}',
        command: {
            title: 'triggerParameterHints',
            command: 'editor.action.triggerParameterHints'
        }
    },
    {
        label: 'A0',
        kind: node_1.CompletionItemKind.Function,
        detail: 'Value mode',
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: 'Todo'
        },
    },
    {
        label: 'A1',
        kind: node_1.CompletionItemKind.Function,
        detail: 'Variable mode',
        documentation: {
            kind: node_1.MarkupKind.Markdown,
            value: 'Todo'
        }
    },
    {
        label: 'setup',
        kind: node_1.CompletionItemKind.Property,
        detail: '(snippet) default setup snippet',
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        insertText: snippets['setup']
    }
];
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
    // if we're in first token, quit
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