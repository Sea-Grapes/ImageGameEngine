"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const node_1 = require("vscode-languageserver/node");
const language_1 = require("./language");
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
    const isCursorInFirstWord = lineStart.trim().split(/\W+/).length <= 1;
    if (!isCursorInFirstWord)
        return [];
    return language_1.completionData;
});
ws.onCompletionResolve((item) => {
    return item;
});
ws.onSignatureHelp((params) => {
    // see if cursor inside a parameter
    // this is purely for methods parameters
    const { context } = params;
    const { activeSignatureHelp } = context;
    // console.log('EVT: signature')
    const doc = documents.get(params.textDocument.uri);
    const position = params.position;
    let lineText = doc.getText({
        start: { line: position.line, character: 0 },
        end: { line: position.line, character: Number.MAX_VALUE }
    });
    // let firstToken = lineText.match(/\S+/)[0]
    let tokens = Array.from(lineText.matchAll(/\W*\w+|\W+/g)).map(token => {
        return {
            string: token[0],
            start: token.index,
            end: token.index + token[0].length
        };
    });
    console.log(tokens);
    // if we're in first token, quit
    const currentTokenIndex = tokens.findIndex(token => position.character >= token.start && position.character <= token.end);
    if (currentTokenIndex <= 0)
        return null;
    // if the first token has no signatures, quit
    let firstToken = tokens[0].string.trim();
    if (!language_1.signatureData[firstToken])
        return null;
    // fill this in with real value later
    // possibly, check what the activeSignature is
    // and clamp the parameter count to this
    let currentParameterIndex = currentTokenIndex - 1;
    let numOfParams = activeSignatureHelp?.signatures[activeSignatureHelp.activeSignature].parameters.length;
    if (currentParameterIndex >= numOfParams)
        return null;
    let currentData = language_1.signatureData[firstToken];
    if (!Array.isArray(currentData))
        currentData = [currentData];
    return {
        activeSignature: activeSignatureHelp?.activeSignature,
        activeParameter: currentParameterIndex,
        signatures: currentData
    };
});
documents.listen(ws);
ws.listen();
//# sourceMappingURL=server.js.map