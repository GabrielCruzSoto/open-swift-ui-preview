/**
 * File Watcher — Fase 4 (Optimized in Fase 6)
 *
 * Monitors file changes and triggers preview updates.
 */

import * as vscode from 'vscode'
import { PreviewPanel } from './preview-panel'

export class FileWatcher {
  private watcher: vscode.FileSystemWatcher | null = null
  private debounceTimer: NodeJS.Timeout | null = null
  private readonly debounceMs = 300
  private currentFile: vscode.Uri | null = null

  constructor(private extensionUri: vscode.Uri) {}

  startWatching(filePath: vscode.Uri): void {
    this.stopWatching()
    this.currentFile = filePath

    const pattern = new vscode.RelativePattern(filePath, '*')
    this.watcher = vscode.workspace.createFileSystemWatcher(pattern)

    this.watcher.onDidChange(async (uri) => {
      if (uri.toString() === this.currentFile?.toString()) {
        this.debouncedUpdate()
      }
    })

    this.watcher.onDidDelete(() => {
      this.stopWatching()
    })
  }

  stopWatching(): void {
    if (this.watcher) {
      this.watcher.dispose()
      this.watcher = null
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
    this.currentFile = null
  }

  private debouncedUpdate(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(async () => {
      if (this.currentFile) {
        const document = await vscode.workspace.openTextDocument(this.currentFile)
        const sourceCode = document.getText()
        PreviewPanel.createOrShow(this.extensionUri)
        PreviewPanel.getCurrentPanel()?.updatePreview(sourceCode)
      }
    }, this.debounceMs)
  }

  dispose(): void {
    this.stopWatching()
  }
}
