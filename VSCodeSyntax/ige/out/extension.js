"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const path = require("path");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    vscode_1.window.showInformationMessage('ige enabled');
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
    // languages.setLanguageConfiguration('ige', { wordPattern: /[\S]+/})
    client.start();
}
function deactivate() {
    if (client)
        client.stop();
}
//# sourceMappingURL=extension.js.map