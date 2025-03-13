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
            vscode_1.window.showInformationMessage(`ige enabled`);
        }
    });
    // selectionChangeListener = window.onDidChangeTextEditorSelection(event => {
    //   console.log('change')
    //   commands.executeCommand('editor.action.triggerParameterHints')
    //   // commands.executeCommand(
    //   //   'vscode.executeSignatureHelpProvider',
    //   //   event.textEditor.document.uri,
    //   //   event.textEditor.selection.active
    //   // )
    // })
}
function deactivate() {
    if (client)
        client.stop();
}
//# sourceMappingURL=extension.js.map