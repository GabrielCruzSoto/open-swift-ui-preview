/**
 * Preview Panel — Fase 4
 *
 * Manages the WebView panel that displays the SwiftUI preview.
 */

import * as vscode from 'vscode'
import { SwiftUIParser } from '../parser/swiftui-parser'
import { LayoutEngine } from '../renderer/layout-engine'
import { CanvasRenderer } from '../renderer/canvas-renderer'
import { DeviceFrame } from '../renderer/device-frame'
import { DeviceSelector } from './device-selector'
import { DEFAULT_DEVICE } from './device-models'

export class PreviewPanel {
  private static currentPanel: PreviewPanel | undefined
  private readonly panel: vscode.WebviewPanel
  private disposables: vscode.Disposable[] = []
  private currentSourceCode: string = ''
  private deviceSelector: DeviceSelector

  private constructor(
    panel: vscode.WebviewPanel,
    private extensionUri: vscode.Uri
  ) {
    this.panel = panel
    this.deviceSelector = new DeviceSelector(DEFAULT_DEVICE)

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables)

    this.panel.webview.onDidReceiveMessage(
      (message) => this.handleMessage(message),
      null,
      this.disposables
    )
  }

  public static createOrShow(extensionUri: vscode.Uri): void {
    const column = vscode.window.activeTextEditor?.viewColumn

    if (PreviewPanel.currentPanel) {
      PreviewPanel.currentPanel.panel.reveal(column)
      return
    }

    const panel = vscode.window.createWebviewPanel(
      'opensui.preview',
      'OpenSUI Preview',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri],
      }
    )

    PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri)
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri): void {
    PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri)
  }

  public static getCurrentPanel(): PreviewPanel | undefined {
    return PreviewPanel.currentPanel
  }

  public getDeviceSelector(): DeviceSelector {
    return this.deviceSelector
  }

  public async updatePreview(sourceCode: string): Promise<void> {
    this.currentSourceCode = sourceCode
    await this.render()
  }

  private async render(): Promise<void> {
    try {
      const parser = new SwiftUIParser()
      const componentTree = parser.parse(this.currentSourceCode)

      if (!componentTree.root) {
        throw new Error('No SwiftUI component found in file')
      }

      const currentDevice = this.deviceSelector.getCurrentDevice()
      const layoutEngine = new LayoutEngine()
      const layoutTree = layoutEngine.computeLayout(
        componentTree,
        currentDevice.screenWidth,
        currentDevice.screenHeight
      )

      if (!layoutTree) {
        throw new Error('Failed to compute layout')
      }

      const canvasRenderer = new CanvasRenderer()
      const imageBuffer = canvasRenderer.render(
        layoutTree,
        currentDevice.screenWidth,
        currentDevice.screenHeight
      )

      const finalImage = DeviceFrame.attachFrame(imageBuffer, false)

      const base64Image = finalImage.toString('base64')

      this.panel.webview.html = this.getWebviewContent(base64Image, currentDevice.name)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.panel.webview.html = this.getErrorWebviewContent(errorMessage)
      vscode.window.showErrorMessage(`OpenSUI Error: ${errorMessage}`)
    }
  }

  private handleMessage(message: { type: string; data?: unknown }): void {
    switch (message.type) {
      case 'ready':
        this.render()
        break
      case 'deviceChanged':
        if (message.data && typeof message.data === 'string') {
          this.deviceSelector.selectDeviceById(message.data).then((success) => {
            if (success) {
              this.render()
            }
          })
        }
        break
    }
  }

  private getWebviewContent(imageBase64: string, deviceName: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OpenSUI Preview</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
    }
    .preview-container {
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .preview-image {
      max-width: 100%;
      height: auto;
      border: 1px solid var(--vscode-panel-border);
    }
    .status {
      margin-top: 10px;
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <img class="preview-image" src="data:image/png;base64,${imageBase64}" alt="SwiftUI Preview" />
    <div class="status">Device: ${deviceName} | Preview updated</div>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    vscode.postMessage({ type: 'ready' });
  </script>
</body>
</html>`
  }

  private getErrorWebviewContent(errorMessage: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OpenSUI Preview - Error</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background-color: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
    }
    .error {
      color: var(--vscode-errorForeground);
      border: 1px solid var(--vscode-errorBorder);
      padding: 16px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="error">
    <h2>Preview Error</h2>
    <p>${errorMessage}</p>
  </div>
</body>
</html>`
  }

  public dispose(): void {
    PreviewPanel.currentPanel = undefined
    this.panel.dispose()
    while (this.disposables.length) {
      const disposable = this.disposables.pop()
      if (disposable) {
        disposable.dispose()
      }
    }
  }
}
