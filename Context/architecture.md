# Architecture — OpenSUI

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Visual Studio Code                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              OpenSUI Extension                        │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                      │  │
│  │  ┌──────────────┐    ┌──────────────┐              │  │
│  │  │ VS Code      │    │ Preview      │              │  │
│  │  │ Integration  │◄──►│ Panel        │              │  │
│  │  └──────────────┘    └──────────────┘              │  │
│  │         │                     │                     │  │
│  │         ▼                     ▼                     │  │
│  │  ┌──────────────┐    ┌──────────────┐              │  │
│  │  │ File Watcher │    │ Device       │              │  │
│  │  └──────────────┘    │ Selector     │              │  │
│  │                       └──────────────┘              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Engine                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Parser     │───►│   Renderer   │───►│  Compositor  │ │
│  │   Engine     │    │   Engine     │    │              │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                     │                     │       │
│         ▼                     ▼                     ▼       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Lexer      │    │   Layout     │    │  Device      │ │
│  │              │    │   Engine     │    │  Frames      │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Module Breakdown

### 1. VS Code Integration (`src/vscode/`)

**Purpose**: Bridge between VS Code and OpenSUI engine

**Components**:
- `extension.ts`: Main extension entry point
- `previewPanel.ts`: Webview panel for preview display
- `fileWatcher.ts`: Monitors file changes
- `commandHandler.ts`: Handles VS Code commands
- `deviceSelector.ts`: Device selection UI

**Responsibilities**:
- Register extension commands
- Create and manage preview webview
- Detect SwiftUI file activation
- Trigger parse/render on file changes
- Manage device selection state

### 2. Parser Engine (`src/parser/`)

**Purpose**: Analyze SwiftUI code and extract component structure

**Components**:
- `lexer.ts`: Tokenizes Swift source code
- `parser.ts`: Builds AST from tokens
- `swiftUIAnalyzer.ts`: Identifies SwiftUI components
- `componentTreeBuilder.ts`: Constructs component hierarchy

**Responsibilities**:
- Tokenize Swift source code
- Parse Swift syntax
- Identify SwiftUI View protocol implementations
- Extract component properties
- Build hierarchical component tree

**Data Flow**:
```
Swift Source Code → Lexer → Tokens → Parser → AST → 
SwiftUI Analyzer → Component Tree → Renderer
```

### 3. Renderer Engine (`src/renderer/`)

**Purpose**: Convert component tree into visual representation

**Components**:
- `layoutEngine.ts`: Calculates component positions
- `styleEngine.ts`: Applies styles (colors, fonts, spacing)
- `canvasRenderer.ts`: Renders to canvas/image
- `componentRenderers/`: Individual component renderers
  - `textRenderer.ts`
  - `buttonRenderer.ts`
  - `stackRenderer.ts`
  - etc.

**Responsibilities**:
- Calculate layout constraints
- Apply SwiftUI styling rules
- Render components to image buffer
- Handle component-specific rendering logic

**Data Flow**:
```
Component Tree → Layout Engine → Positioned Components → 
Style Engine → Styled Components → Canvas Renderer → Image
```

### 4. Device Frames (`assets/device-frames/`)

**Purpose**: Provide realistic iPhone device frames

**Components**:
- PNG/SVG images of device frames
- Device metadata (dimensions, notch position)
- Frame composition logic

**Supported Devices**:
- iPhone 15 series
- iPhone 16 series
- iPhone 17 series

## Key Interfaces

### Parser Interface

```typescript
interface SwiftUIParser {
  parse(sourceCode: string): SwiftUIComponentTree;
  isSwiftUIFile(filePath: string): boolean;
  getSupportedComponents(): string[];
}
```

### Renderer Interface

```typescript
interface SwiftUIRenderer {
  render(componentTree: SwiftUIComponentTree): Buffer;
  setDevice(deviceModel: DeviceModel): void;
  getSupportedDevices(): DeviceModel[];
}
```

### Component Tree Structure

```typescript
interface SwiftUIComponentTree {
  root: SwiftUIComponent;
  metadata: {
    fileName: string;
    viewName: string;
    parsedAt: Date;
  };
}

interface SwiftUIComponent {
  type: string;
  properties: Record<string, any>;
  children: SwiftUIComponent[];
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
```

## Data Flow

### Complete Flow

```
1. User opens .swift file in VS Code
   ↓
2. VS Code Integration detects SwiftUI View
   ↓
3. Parser Engine analyzes source code
   ├─ Lexer tokenizes code
   ├─ Parser builds AST
   └─ SwiftUI Analyzer extracts components
   ↓
4. Component Tree generated
   ↓
5. Renderer Engine processes tree
   ├─ Layout Engine calculates positions
   ├─ Style Engine applies styles
   └─ Canvas Renderer generates image
   ↓
6. Compositor applies device frame
   ↓
7. Preview Panel displays result
   ↓
8. User modifies code
   ↓
9. File Watcher detects change
   ↓
10. Steps 3-7 repeat automatically
```

## Technology Choices

### TypeScript
- Type safety for complex data structures
- Excellent tooling support
- VS Code native language

### VS Code Extension API
- Native integration with editor
- Webview panel for rich preview
- File system access
- Command palette integration

### Custom Parser (vs. Swift compiler)
- No dependency on Swift toolchain
- Cross-platform compatibility
- Focused on SwiftUI subset
- Faster for preview use case

### Canvas Rendering
- No external graphics library dependency
- Browser-native rendering in webview
- Cross-platform consistency

## Performance Considerations

### Optimization Strategies

1. **Incremental Parsing**: Only re-parse changed portions
2. **Component Caching**: Cache rendered components
3. **Debounced Updates**: Delay render on rapid changes
4. **Lazy Loading**: Load device frames on demand
5. **Worker Threads**: Offload parsing/rendering to workers

### Performance Targets

- Parse time: < 1 second (simple views)
- Render time: < 2 seconds
- Update latency: < 3 seconds
- Memory usage: < 200 MB idle

## Security Considerations

- No external network requests
- No code execution (parsing only)
- Sandboxed webview environment
- No file system access beyond workspace

## Extensibility Points

1. **New Components**: Add renderers for additional SwiftUI components
2. **New Devices**: Add device frame assets and metadata
3. **Custom Themes**: Extend style engine for custom styling
4. **Export Formats**: Add alternative output formats (PDF, SVG)
5. **Code Generation**: Reverse engineer preview to code (future)
