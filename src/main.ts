import * as vscode from 'vscode'

/**
 * OpenSUI Extension — Entry point
 * Registers all commands and initialises the extension subscriptions.
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log('OpenSUI is now active!')

  const disposable = vscode.commands.registerCommand(
    'opensui.helloWorld',
    () => {
      vscode.window.showInformationMessage('OpenSUI Hello World!')
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate(): void {}
