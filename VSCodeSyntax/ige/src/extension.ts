import * as path from 'path'
import { ExtensionContext, window, workspace } from 'vscode'

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  State,
  TransportKind
} from 'vscode-languageclient/node'

let client: LanguageClient

export function activate(context: ExtensionContext) {

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
  client.start()

  client.onDidChangeState(event => {
    if(event.newState === State.Running) {
      console.log('[IGE CLIENT] active')
      window.showInformationMessage('ige enabled')
    }
  })

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

export function deactivate() {
  if(client) client.stop()
}