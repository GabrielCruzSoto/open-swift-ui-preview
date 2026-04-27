/**
 * Extension Integration — Fase 4
 *
 * Main integration logic for VS Code extension.
 * Coordinates commands, preview panel, and file watching.
 */

import * as vscode from 'vscode'
import { COMMANDS } from './commands'
import { PreviewPanel } from './preview-panel'
import { FileWatcher } from './file-watcher'
import { SwiftUIParser } from '../parser/swiftui-parser'

export class ExtensionIntegration {
  private previewPanel: PreviewPanel | undefined
  private fileWatcher: FileWatcher | undefined
  private disposables: vscode.Disposable[] = []

  constructor(private extensionUri: vscode.Uri) {}

  registerCommands(context: vscode.ExtensionContext): void {
    // Start Preview command
    const startCmd = vscode.commands.registerCommand(
      COMMANDS.START_PREVIEW,
      async () => {
        await this.startPreview()
      }
    )
    context.subscriptions.push(startCmd)

    // Stop Preview command
    const stopCmd = vscode.commands.registerCommand(
      COMMANDS.STOP_PREVIEW,
      () => {
        this.stopPreview()
      }
    )
    context.subscriptions.push(stopCmd)

    // Toggle Preview command
    const toggleCmd = vscode.commands.registerCommand(
      COMMANDS.TOGGLE_PREVIEW,
      async () => {
        if (this.previewPanel) {
          this.stopPreview()
        } else {
          await this.startPreview()
        }
      }
    )
    context.subscriptions.push(toggleCmd)

    // Select Device command
    const selectDeviceCmd = vscode.commands.registerCommand(
      COMMANDS.SELECT_DEVICE,
      async () => {
        if (!this.previewPanel) {
          vscode.window.showWarningMessage('No preview panel is open')
          return
        }

        const deviceSelector = this.previewPanel.getDeviceSelector()
        const selectedDevice = await deviceSelector.show()

        if (selectedDevice) {
          await this.previewPanel.updatePreview(this.previewPanel['currentSourceCode'])
          vscode.window.showInformationMessage(`Device changed to ${selectedDevice.name}`)
        }
      }
    )
    context.subscriptions.push(selectDeviceCmd)
  }

  private async startPreview(): Promise<void> {
    const activeEditor = vscode.window.activeTextEditor
    if (!activeEditor) {
      vscode.window.showWarningMessage('No active editor found')
      return
    }

    const document = activeEditor.document
    if (document.languageId !== 'swift') {
      vscode.window.showWarningMessage('Current file is not a Swift file')
      return
    }

    const sourceCode = document.getText()
    const parser = new SwiftUIParser()

    if (!parser.isSwiftUIFile(sourceCode)) {
      vscode.window.showWarningMessage('Current file does not contain a SwiftUI View')
      return
    }

    // Create or show preview panel
    PreviewPanel.createOrShow(this.extensionUri)
    this.previewPanel = PreviewPanel.getCurrentPanel()

    if (this.previewPanel) {
      await this.previewPanel.updatePreview(sourceCode)

      // Start file watching
      this.fileWatcher = new FileWatcher(this.extensionUri)
      this.fileWatcher.startWatching(document.uri)
    }
  }

  private stopPreview(): void {
    if (this.fileWatcher) {
      this.fileWatcher.dispose()
      this.fileWatcher = undefined
    }

    if (this.previewPanel) {
      this.previewPanel.dispose()
      this.previewPanel = undefined
    }
  }

  dispose(): void {
    this.stopPreview()
    while (this.disposables.length) {
      const disposable = this.disposables.pop()
      if (disposable) {
        disposable.dispose()
      }
    }
  }
}
