import * as path from 'path'
import { workspace, ExtensionContext, window, languages, commands } from 'vscode'

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

  window.onDidChangeTextEditorSelection(event => {
    console.log('change')
    commands.executeCommand('editor.action.triggerParameterHints')
  })
  

  // let lastLine = -1

  // window.onDidChangeTextEditorSelection(event => {
  //   const currentLine = event.textEditor.selection.active.line

  //   if(currentLine !== lastLine) commands.executeCommand('closeParameterHints')
  //   lastLine = currentLine
  // })

}

export function deactivate() {
  if(client) client.stop()
}