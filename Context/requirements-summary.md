# Requirements Summary — OpenSUI

## Functional Requirements

### RF-001: SwiftUI File Detection
- Detect active `.swift` files containing SwiftUI Views
- Automatic detection on file change
- Ignore non-SwiftUI Swift files

### RF-002: SwiftUI Parser Engine
- Tokenize Swift source code
- Parse Swift syntax
- Identify SwiftUI components
- Extract component properties
- Support component nesting (10 levels deep)

**Supported Components**:
- Layout: VStack, HStack, ZStack, Spacer
- Text: Text
- Controls: Button, Toggle, Slider, TextField, Picker
- Containers: List, ScrollView, NavigationStack, TabView
- Multimedia: Image
- Structure: Divider

### RF-003: Rendering Engine
- Convert component tree to visual representation
- Apply styles (colors, fonts, spacing)
- Position components correctly
- Generate PNG/JPEG output
- Render time < 2 seconds
- Independent of Xcode

### RF-004: Device Frame Visualization
- Display preview within iPhone frame
- Support realistic frame details (notch, rounded corners)
- Match selected device model

### RF-005: Device Selection
- Support iPhone 15, 16, 17 series
- Dropdown selector in preview panel
- Persist selection between sessions
- Update preview on device change

### RF-006: Real-time Updates
- Auto-detect code changes
- Re-parse and re-render automatically
- Update latency < 3 seconds
- Maintain device selection state

### RF-007: VS Code Tab Integration
- Display in dedicated "OpenSUI Preview" tab
- Allow simultaneous code and preview
- Support tab close/reopen without state loss

### RF-008: Manual Activation Command
- Command: "OpenSUI: Start Preview"
- Available in VS Code command palette
- Include representative icon

## Non-Functional Requirements

### RNF-001: SwiftUI Version Compatibility
- Support latest GA version of SwiftUI
- Document supported version clearly

### RNF-002: Performance
- Initial parse: < 1 second
- Render time: < 2 seconds
- Update latency: < 3 seconds
- Idle memory: < 200 MB

### RNF-003: Cross-Platform Compatibility
- Windows 10+ (64-bit)
- macOS 10.15+ (Catalina)
- Ubuntu 18.04+, Debian 10+

### RNF-004: Distribution Model
- Open source license (TBD: MIT, Apache 2.0, GPL)
- Free distribution
- Public repository

### RNF-005: Documentation
- README.md (installation and usage)
- CONTRIBUTING.md (contribution guide)
- API.md (internal APIs)
- CHANGELOG.md (version history)

## Interface Requirements

### UI-001: Preview Panel
- VS Code tab titled "OpenSUI Preview"
- Device selector dropdown
- Device frame with rendered preview
- Close button

### UI-002: Command Palette
- "OpenSUI: Start Preview"
- "OpenSUI: Stop Preview"
- "OpenSUI: Select Device"

## API Interfaces

### Parser API
```typescript
interface SwiftUIParser {
  parse(sourceCode: string): SwiftUIComponentTree;
  isSwiftUIFile(filePath: string): boolean;
}
```

### Renderer API
```typescript
interface SwiftUIRenderer {
  render(componentTree: SwiftUIComponentTree): Buffer;
  setDevice(deviceModel: DeviceModel): void;
}
```

## Use Cases

### UC-001: Preview SwiftUI View
1. Developer opens .swift file with SwiftUI View
2. System detects SwiftUI file automatically
3. System parses code and generates preview
4. Preview appears in VS Code tab

**Alternative**: Developer executes "OpenSUI: Start Preview" command

### UC-002: Change Preview Device
1. Developer clicks device selector
2. System shows available devices
3. Developer selects new device
4. System updates frame and dimensions
5. Preview resizes to new device

### UC-003: Real-time Updates
1. Developer modifies SwiftUI code
2. System detects change
3. System re-parses code
4. System re-renders view
5. Preview updates automatically

## Requirements Traceability Matrix

| Req | Use Case | Priority | Status |
|-----|----------|-----------|--------|
| RF-001 | UC-001 | High | Pending |
| RF-002 | UC-001, UC-003 | Critical | Pending |
| RF-003 | UC-001, UC-003 | Critical | Pending |
| RF-004 | UC-001, UC-002 | High | Pending |
| RF-005 | UC-002 | High | Pending |
| RF-006 | UC-003 | High | Pending |
| RF-007 | UC-001 | Critical | Pending |
| RF-008 | UC-001 | Medium | Pending |
| RNF-001 | - | High | Pending |
| RNF-002 | - | High | Pending |
| RNF-003 | - | Critical | Pending |
| RNF-004 | - | High | Pending |
| RNF-005 | - | Medium | Pending |

## Technical Constraints

1. **No external communication**: All processing within VS Code
2. **Custom rendering**: No Xcode or Swift compiler dependency
3. **Component subset**: Initial support for basic components only
4. **Static preview**: Image representation, not interactive execution
5. **No device communication**: No physical device connection required

## Success Criteria

- All functional requirements implemented
- All non-functional requirements met
- Test coverage ≥ 80%
- Performance targets achieved
- Cross-platform compatibility verified
- Documentation complete
