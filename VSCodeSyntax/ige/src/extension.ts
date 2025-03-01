import * as path from 'path'
import { workspace, ExtensionContext, window, languages } from 'vscode'

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node'

let client: LanguageClient

export function activate(context: ExtensionContext) {
  window.showInformationMessage('ige enabled')

  const module = context.asAbsolutePath(path.join('out', 'server.js'))

  const serverOptions: ServerOptions = {
    run: { module, transport: TransportKind.ipc },
    debug: { module, transport: TransportKind.ipc }
  }

  // this uses `languages/id` from package.json
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'ige' }],
    synchronize: { fileEvents: workspace.createFileSystemWatcher('**/*.ige')}
  }

  client = new LanguageClient('ige', serverOptions, clientOptions)

  // languages.setLanguageConfiguration('ige', { wordPattern: /[\S]+/})

  client.start()
}

export function deactivate() {
  if(client) client.stop()
}