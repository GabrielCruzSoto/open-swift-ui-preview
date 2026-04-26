# VS Code Extension Patterns

## Objetivo

Establecer patrones de diseño para la extensión VS Code en OpenSUI.

---

## WebView Panel

### Creación básica

```typescript
const panel = vscode.window.createWebviewPanel(
  'opensui.preview',      // id único
  'OpenSUI Preview',      // título
  { viewColumn: ViewColumn.Two, preserveFocus: true },
  {
    enableScripts: true,
    localResourceRoots: [Uri.file(assetsPath)],
  }
);
```

### Lifecycle

```typescript
export class PreviewPanel {
  private panel: WebviewPanel | null = null;

  async create(): Promise<void> {
    if (this.panel) {
      this.panel.reveal();
      return;
    }
    this.panel = /* ... */;
    this.panel.onDidDispose(() => this.dispose());
  }

  dispose(): void {
    this.panel?.dispose();
    this.panel = null;
  }

  show(): void {
    this.panel?.reveal();
  }

  hide(): void {
    this.panel?.hide();
  }
}
```

---

## Commands

### Registro de comandos

```typescript
export function registerCommands(context: ExtensionContext): void {
  const startCmd = vscode.commands.registerCommand(
    'opensui.startPreview',
    async () => {
      // handler
    }
  );

  context.subscriptions.push(startCmd);
}
```

### package.json commands

```json
{
  "commands": [
    {
      "command": "opensui.startPreview",
      "title": "OpenSUI: Start Preview"
    }
  ]
}
```

---

## File Watcher

### Creación

```typescript
import { workspace } from 'vscode';

class FileWatcher {
  private watcher: FileSystemWatcher | null = null;

  watch(filePath: string): void {
    this.watcher = workspace.createFileSystemWatcher(filePath);

    this.watcher.onDidChange((uri) => {
      this.handleChange(uri);
    });
  }

  unwatch(): void {
    this.watcher?.dispose();
    this.watcher = null;
  }

  private handleChange(uri: Uri): void {
    // debounce y re-render
  }
}
```

### Contexto de disposición

```typescript
// En activate()
const watcher = new FileWatcher();
context.subscriptions.push({
  dispose: () => watcher.unwatch(),
});
```

---

## Messaging WebView

### Desde extensión a WebView

```typescript
panel.webview.postMessage({
  type: 'render',
  image: base64Image,
  device: currentDevice,
});
```

### Desde WebView a extensión

```typescript
panel.webview.onDidReceiveMessage((msg) => {
  switch (msg.type) {
    case 'selectDevice':
      handleDeviceSelect(msg.device);
      break;
  }
});
```

### HTML del WebView

```html
<script>
  const vscode = acquireVsCodeApi();
  
  window.addEventListener('message', (event) => {
    const { type, image } = event.data;
    if (type === 'render') {
      document.getElementById('preview').src = `data:image/png;base64,${image}`;
    }
  });
</script>
```

---

## Configuración de Estado

```typescript
// Persistir estado entre sesiones
const state = context.workspaceState;

// Guardar
state.update('lastDevice', 'iphone15pro');

// Recuperar
const device = state.get('lastDevice', 'iphone15pro');
```

---

## Aplicación

Cargar este skill al:
- Implementar integración VS Code
- Trabajar con WebView
- Registrar comandos