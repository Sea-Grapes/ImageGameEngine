import * as path from 'path'
import { workspace, ExtensionContext, window, languages, commands } from 'vscode'

import {
  Disposable,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  State,
  TransportKind
} from 'vscode-languageclient/node'

let client: LanguageClient
let selectionChangeListener: Disposable

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

  // context.subscriptions.push(selectionChangeListener)
  

  // let lastLine = -1

  // window.onDidChangeTextEditorSelection(event => {
  //   const currentLine = event.textEditor.selection.active.line

  //   if(currentLine !== lastLine) commands.executeCommand('closeParameterHints')
  //   lastLine = currentLine
  // })

}

export function deactivate() {
  // if(selectionChangeListener) selectionChangeListener.dispose()
  if(client) client.stop()
}