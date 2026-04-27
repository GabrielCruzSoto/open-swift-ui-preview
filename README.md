# OpenSUI

OpenSUI is a Visual Studio Code extension that provides real-time SwiftUI preview without requiring Xcode or Apple hardware. It enables iOS developers to preview SwiftUI views directly in VS Code on Windows, Linux, and macOS.

## Features

- **Real-time SwiftUI Preview**: See your SwiftUI views update as you type
- **Device Frame Selection**: Preview on iPhone 15, 16, and 17 series devices
- **Multi-platform Support**: Works on Windows, Linux, and macOS
- **Custom Rendering Engine**: No Xcode dependency - uses a custom parser and renderer
- **File Watching**: Automatic preview updates when files change
- **Performance Optimized**: Fast parsing with memoization and efficient rendering

## Supported SwiftUI Components

- **Layout**: VStack, HStack, ZStack, Spacer
- **Text**: Text
- **Controls**: Button, Toggle, Slider, TextField, Picker
- **Containers**: List, ScrollView, NavigationStack, TabView
- **Multimedia**: Image
- **Structure**: Divider

## Installation

### From VS Code Marketplace

```bash
ext install opensui.preview
```

### From Source

```bash
git clone https://github.com/GabrielCruzSoto/open-swift-ui-preview.git
cd open-swift-ui-preview
npm install
npm run build
```

## Usage

1. Open a SwiftUI file (`.swift`) in VS Code
2. Run the command `OpenSUI: Start Preview` from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. The preview panel will appear showing your SwiftUI view
4. To change the device, run `OpenSUI: Select Device`
5. To stop the preview, run `OpenSUI: Stop Preview` or close the preview panel

## Commands

- `OpenSUI: Start Preview` - Start the SwiftUI preview for the current file
- `OpenSUI: Stop Preview` - Stop the current preview
- `OpenSUI: Toggle Preview` - Toggle the preview on/off
- `OpenSUI: Select Device` - Select a device for preview (iPhone 15/16/17 series)

## Requirements

- Node.js 20 or higher
- VS Code 1.86.0 or higher
- A Swift file with SwiftUI code

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## Architecture

OpenSUI consists of three main modules:

1. **Parser Engine** (`src/parser/`): Tokenizes and parses SwiftUI code into an AST
2. **Renderer Engine** (`src/renderer/`): Computes layout and renders to canvas
3. **VS Code Integration** (`src/vscode/`): Manages WebView panel, file watching, and commands

## Performance

- Parseo simple: < 100ms
- Parseo complejo: < 500ms
- Layout simple: < 50ms
- Layout complejo: < 200ms
- Renderizado simple: < 500ms
- Renderizado complejo: < 2000ms
- Pipeline completo: < 3000ms

## License

MIT

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.
