# VS Code Integration Skill

**Purpose**: Guide the development of the VS Code extension integration for OpenSUI

## Overview

This skill provides specialized knowledge for implementing the VS Code extension that bridges OpenSUI's core engine with the Visual Studio Code extension API. The integration handles commands, file watching, preview panel management, and user interaction.

## Key Concepts

### Extension Lifecycle
- Extension activation and deactivation
- Command registration
- Context management
- Resource cleanup

### Preview Panel
- Webview panel creation and management
- Panel lifecycle (show, hide, dispose)
- Message passing between extension and webview
- Preview content updates
- Device selection UI

### File Watching
- Monitor file changes in workspace
- Detect SwiftUI file modifications
- Debounce rapid changes
- Trigger parse and render on changes
- Handle file deletion/renaming

### Command Handling
- Register commands in VS Code command palette
- Handle command execution
- Manage command state
- Provide user feedback

### State Management
- Maintain extension state
- Persist settings across sessions
- Manage device selection
- Handle configuration changes

## VS Code Extension API

### Extension Entry Point
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

### Activation Events
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

### Webview Panel
```typescript
class PreviewPanel {
  private panel: vscode.WebviewPanel | null = null;

  show(): void;
  hide(): void;
  dispose(): void;
  updatePreview(image: Buffer): void;
  handleMessage(message: any): void;
}
```

## Commands

### opensui.startPreview
- Start preview for current file
- Check if file is SwiftUI
- Show preview panel
- Start file watcher
- Parse and render file

### opensui.stopPreview
- Stop preview
- Close preview panel
- Stop file watcher
- Clean up resources

### opensui.selectDevice
- Open device selector
- Update current device
- Re-render preview
- Persist selection

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

## Message Protocol

### Extension → Webview
```typescript
interface ExtensionMessage {
  type: 'updatePreview' | 'setDevice' | 'error';
  data?: any;
}
```

### Webview → Extension
```typescript
interface WebviewMessage {
  type: 'deviceChanged' | 'ready';
  data?: any;
}
```

## Implementation Guidelines

### File Structure
```
src/vscode/
├── extension.ts
├── previewPanel.ts
├── fileWatcher.ts
├── commandHandler.ts
├── deviceSelector.ts
└── types.ts
```

### State Management
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

## Error Handling

### Error Types
- File errors (not found, not SwiftUI)
- Engine errors (parser, renderer failure)
- Extension errors (panel creation, command execution)

### Error Display
Show errors in:
1. VS Code status bar
2. Preview panel (error overlay)
3. Output channel (for debugging)

### Error Message Format
```typescript
interface ErrorMessage {
  type: 'error' | 'warning' | 'info';
  message: string;
  details?: string;
  file?: string;
  line?: number;
}
```

## Performance Considerations

### Optimization Strategies
- Lazy loading: Initialize engine only when needed
- Debouncing: Prevent excessive re-renders (500ms delay)
- Webview optimization: Use efficient message passing
- Resource cleanup: Properly dispose resources
- Caching: Cache parsed results

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

## Testing Requirements

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

## References

- Context: `Context/architecture.md` - VS Code integration architecture
- Design: `docs/design-vscode-integration.md` - Detailed integration design
- Requirements: `Context/requirements-summary.md` - RF-001, RF-006, RF-007, RF-008

## Quality Checklist

- [ ] Extension activates/deactivates correctly
- [ ] All commands registered and functional
- [ ] Preview panel shows/hides properly
- [ ] File watcher detects changes accurately
- [ ] Debouncing prevents excessive updates
- [ ] Device selection persists across sessions
- [ ] Configuration settings work correctly
- [ ] Error messages are clear and helpful
- [ ] Performance targets met
- [ ] Test coverage ≥ 80%
- [ ] All tests pass
- [ ] Code follows project style guidelines (single quotes, no semicolons)
