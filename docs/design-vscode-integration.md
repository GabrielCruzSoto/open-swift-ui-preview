# VS Code Integration Design — OpenSUI

## Overview

The VS Code integration module is responsible for bridging OpenSUI's core engine with the Visual Studio Code extension API. This document describes the design and implementation strategy for the integration layer.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Visual Studio Code                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              OpenSUI Extension                    │  │
│  ├───────────────────────────────────────────────────┤  │
│  │                                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────┐ │  │
│  │  │  Extension   │  │  Preview     │  │  File   │ │  │
│  │  │  Manager     │  │  Panel       │  │ Watcher │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────┘ │  │
│  │         │                  │              │        │  │
│  │         └──────────────────┼──────────────┘        │  │
│  │                            ▼                         │  │
│  │                   ┌──────────────┐                 │  │
│  │                   │  Command     │                 │  │
│  │                   │  Handler     │                 │  │
│  │                   └──────────────┘                 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │ Core Engine  │
                    │ (Parser +    │
                    │  Renderer)   │
                    └──────────────┘
```

## Components

### 1. Extension Manager (`extension.ts`)

**Purpose**: Main entry point for the VS Code extension

**Responsibilities**:
- Register extension with VS Code
- Initialize core engine
- Register commands
- Manage extension lifecycle
- Handle activation/deactivation

**Interface**:
```typescript
export function activate(context: vscode.ExtensionContext): void {
  // Initialize parser
  // Initialize renderer
  // Register commands
  // Setup file watcher
  // Create preview panel
}

export function deactivate(): void {
  // Cleanup resources
  // Dispose panels
  // Stop file watcher
}
```

**Activation Events**:
```json
{
  "activationEvents": [
    "onCommand:opensui.startPreview",
    "onCommand:opensui.stopPreview",
    "onCommand:opensui.selectDevice",
    "onLanguage:swift"
  ]
}
```

### 2. Preview Panel (`previewPanel.ts`)

**Purpose**: Manage the webview panel that displays the preview

**Responsibilities**:
- Create and show webview panel
- Handle panel lifecycle (show, hide, dispose)
- Communicate with webview (messages)
- Update preview content
- Manage device selection UI

**Interface**:
```typescript
class PreviewPanel {
  private panel: vscode.WebviewPanel | null = null;
  private currentDevice: DeviceModel;

  show(): void;
  hide(): void;
  dispose(): void;
  updatePreview(image: Buffer): void;
  setDevice(device: DeviceModel): void;
  handleMessage(message: any): void;
}
```

**Webview Content**:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Preview panel styles */
  </style>
</head>
<body>
  <div id="device-selector">
    <select id="device-select">
      <!-- Device options -->
    </select>
  </div>
  <div id="preview-container">
    <img id="preview-image" src="" />
  </div>
  <script>
    // Webview scripts
  </script>
</body>
</html>
```

**Message Protocol**:
```typescript
// Extension → Webview
interface ExtensionMessage {
  type: 'updatePreview' | 'setDevice' | 'error';
  data?: any;
}

// Webview → Extension
interface WebviewMessage {
  type: 'deviceChanged' | 'ready';
  data?: any;
}
```

### 3. File Watcher (`fileWatcher.ts`)

**Purpose**: Monitor file changes and trigger updates

**Responsibilities**:
- Watch for file changes in workspace
- Detect SwiftUI file modifications
- Debounce rapid changes
- Trigger parse and render on changes
- Handle file deletion/renaming

**Interface**:
```typescript
class FileWatcher {
  private watcher: vscode.FileSystemWatcher | null = null;
  private debounceTimer: NodeJS.Timeout | null = null;

  start(): void;
  stop(): void;
  onFileChange(uri: vscode.Uri): void;
  private debouncedUpdate(): void;
}
```

**Debounce Strategy**:
- Wait 500ms after last change before triggering update
- Cancel previous debounce timer on new change
- Prevent excessive re-renders during rapid editing

### 4. Command Handler (`commandHandler.ts`)

**Purpose**: Handle VS Code command palette commands

**Commands**:
- `opensui.startPreview`: Start preview for current file
- `opensui.stopPreview`: Stop preview and close panel
- `opensui.selectDevice`: Open device selector

**Interface**:
```typescript
class CommandHandler {
  registerCommands(context: vscode.ExtensionContext): void;

  private async startPreview(): Promise<void>;
  private async stopPreview(): Promise<void>;
  private async selectDevice(): Promise<void>;
}
```

**Command Registration**:
```typescript
context.subscriptions.push(
  vscode.commands.registerCommand('opensui.startPreview', () => this.startPreview()),
  vscode.commands.registerCommand('opensui.stopPreview', () => this.stopPreview()),
  vscode.commands.registerCommand('opensui.selectDevice', () => this.selectDevice())
);
```

### 5. Device Selector (`deviceSelector.ts`)

**Purpose**: Manage device selection UI and state

**Responsibilities**:
- Maintain current device selection
- Provide list of available devices
- Persist selection across sessions
- Update preview on device change

**Interface**:
```typescript
class DeviceSelector {
  private currentDevice: DeviceModel;
  private availableDevices: DeviceModel[];

  getCurrentDevice(): DeviceModel;
  setCurrentDevice(device: DeviceModel): void;
  getAvailableDevices(): DeviceModel[];
  loadFromStorage(): void;
  saveToStorage(): void;
}
```

**Device Model**:
```typescript
interface DeviceModel {
  id: string;
  name: string;
  series: 'iPhone 15' | 'iPhone 16' | 'iPhone 17';
  framePath: string;
  screenWidth: number;
  screenHeight: number;
}
```

## State Management

### Extension State

```typescript
interface ExtensionState {
  isActive: boolean;
  currentFile: vscode.Uri | null;
  currentDevice: DeviceModel;
  previewPanelVisible: boolean;
}
```

### Persistence

Use VS Code's `globalState` for persistence:
```typescript
// Save device selection
await context.globalState.update('opensui.device', currentDevice);

// Load device selection
const savedDevice = context.globalState.get<DeviceModel>('opensui.device');
```

## Communication Flow

### Starting Preview

```
1. User executes "OpenSUI: Start Preview" command
   ↓
2. CommandHandler.startPreview() called
   ↓
3. Get active editor file
   ↓
4. Check if file is SwiftUI
   ↓
5. If valid:
   - Show PreviewPanel
   - Start FileWatcher
   - Parse file
   - Render preview
   - Update panel
   ↓
6. If invalid:
   - Show error message
```

### File Change

```
1. User modifies SwiftUI file
   ↓
2. FileWatcher detects change
   ↓
3. Debounce for 500ms
   ↓
4. Parse modified file
   ↓
5. Render new preview
   ↓
6. Update PreviewPanel
   ↓
7. Webview displays new image
```

### Device Change

```
1. User selects new device in dropdown
   ↓
2. Webview sends "deviceChanged" message
   ↓
3. PreviewPanel handles message
   ↓
4. DeviceSelector updates current device
   ↓
5. Save to storage
   ↓
6. Re-render preview with new device
   ↓
7. Update PreviewPanel
```

## Error Handling

### Error Types

**File Errors**
- File not found
- File not a SwiftUI file
- Parse errors

**Engine Errors**
- Parser failure
- Renderer failure
- Device frame not found

**Extension Errors**
- Webview panel creation failure
- Command execution failure
- State persistence failure

### Error Display

Show errors in:
1. VS Code status bar
2. Preview panel (error overlay)
3. Output channel (for debugging)

**Error Message Format**:
```typescript
interface ErrorMessage {
  type: 'error' | 'warning' | 'info';
  message: string;
  details?: string;
  file?: string;
  line?: number;
}
```

## Configuration

### VS Code Settings

```json
{
  "opensui.enabled": {
    "type": "boolean",
    "default": true,
    "description": "Enable OpenSUI extension"
  },
  "opensui.autoPreview": {
    "type": "boolean",
    "default": true,
    "description": "Automatically start preview when opening SwiftUI files"
  },
  "opensui.defaultDevice": {
    "type": "string",
    "default": "iphone-15-pro",
    "description": "Default device for preview"
  },
  "opensui.updateDelay": {
    "type": "number",
    "default": 500,
    "description": "Delay in ms before updating preview after file change"
  }
}
```

### Accessing Configuration

```typescript
const config = vscode.workspace.getConfiguration('opensui');
const enabled = config.get<boolean>('enabled', true);
const autoPreview = config.get<boolean>('autoPreview', true);
```

## Testing Strategy

### Unit Tests
- Extension lifecycle (activate/deactivate)
- Command registration and execution
- File watcher behavior
- State management
- Configuration handling

### Integration Tests
- End-to-end preview flow
- File change detection and update
- Device selection and persistence
- Error handling scenarios

### Manual Testing
- Install extension in VS Code
- Test all commands
- Test with real SwiftUI files
- Test on different platforms (Windows, Linux, macOS)

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Initialize engine only when needed
2. **Debouncing**: Prevent excessive re-renders
3. **Webview Optimization**: Use efficient message passing
4. **Resource Cleanup**: Properly dispose resources
5. **Caching**: Cache parsed results

### Performance Targets

- Extension activation: < 500ms
- Preview start: < 1s
- File change to update: < 3s
- Memory usage: < 100 MB (excluding engine)

## Security Considerations

1. **Webview Security**: Use proper CSP headers
2. **File Access**: Only access workspace files
3. **No External Requests**: No network calls
4. **Input Validation**: Validate all user inputs
5. **Sandboxing**: Webview runs in sandbox

## Future Enhancements

1. **Multiple Previews**: Support multiple preview panels
2. **Split View**: Side-by-side code and preview
3. **Keyboard Shortcuts**: Customizable shortcuts
4. **Theme Support**: Match VS Code theme
5. **Export**: Export preview as image file
6. **Debug Mode**: Show component tree overlay
