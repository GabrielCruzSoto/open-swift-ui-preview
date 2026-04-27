import * as vscode from 'vscode'
import { ExtensionIntegration } from './vscode/extension'

/**
 * OpenSUI Extension — Entry point
 * Registers all commands and initialises the extension subscriptions.
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log('OpenSUI is now active!')

  const extensionUri = context.extensionUri
  const integration = new ExtensionIntegration(extensionUri)

  integration.registerCommands(context)

  context.subscriptions.push(integration)
}

export function deactivate(): void {}
