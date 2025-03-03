"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const path = require("path");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    const module = context.asAbsolutePath(path.join('out', 'server.js'));
    const serverOptions = {
        run: { module, transport: node_1.TransportKind.ipc },
        debug: { module, transport: node_1.TransportKind.ipc }
    };
    // this uses `languages/id` from package.json
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'ige' }],
        synchronize: { fileEvents: vscode_1.workspace.createFileSystemWatcher('**/*.ige') }
    };
    client = new node_1.LanguageClient('ige', serverOptions, clientOptions);
    client.start();
    client.onDidChangeState(event => {
        if (event.newState === node_1.State.Running) {
            console.log('[IGE CLIENT] active');
            vscode_1.window.showInformationMessage('ige enabled');
        }
    });
    vscode_1.window.onDidChangeTextEditorSelection(event => {
        console.log('change');
        vscode_1.commands.executeCommand('editor.action.triggerParameterHints');
    });
    // let lastLine = -1
    // window.onDidChangeTextEditorSelection(event => {
    //   const currentLine = event.textEditor.selection.active.line
    //   if(currentLine !== lastLine) commands.executeCommand('closeParameterHints')
    //   lastLine = currentLine
    // })
}
function deactivate() {
    if (client)
        client.stop();
}
//# sourceMappingURL=extension.js.map