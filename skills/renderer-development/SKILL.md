# Renderer Development Skill

**Purpose**: Guide the development of the SwiftUI rendering engine for OpenSUI

## Overview

This skill provides specialized knowledge for implementing the rendering engine that converts parsed SwiftUI component trees into visual representations (images). The renderer is responsible for layout calculation, style application, and canvas rendering.

## Key Concepts

### Layout Engine
- Calculate positions and sizes for all components
- Implement SwiftUI layout rules (VStack, HStack, ZStack)
- Handle spacing and alignment
- Resolve layout constraints
- Support Spacer expansion

### Style Engine
- Map SwiftUI modifiers to CSS-like styles
- Handle color mapping (SwiftUI colors to hex values)
- Map SwiftUI fonts to CSS fonts
- Apply padding, borders, corner radius
- Process modifier chains in correct order

### Canvas Rendering
- Use HTML5 Canvas API (via webview) or Node.js canvas library
- Render components to image buffer
- Apply background, text, shapes
- Handle transparency and opacity
- Export to PNG/JPEG format

### Device Composition
- Load device frame images
- Scale preview to device screen dimensions
- Composite preview onto device frame
- Apply device-specific effects (notch, rounded corners)

## Layout Algorithms

### VStack (Vertical Stack)
- Children arranged vertically
- Height = sum of children heights + spacing
- Width = max child width
- Supports spacing and alignment properties

### HStack (Horizontal Stack)
- Children arranged horizontally
- Width = sum of children widths + spacing
- Height = max child height
- Supports spacing and alignment properties

### ZStack (Z-Axis Stack)
- Children layered on top of each other
- All children occupy same space
- Size = largest child size
- Supports alignment for positioning

### Spacer
- Expands to fill available space
- Zero intrinsic size
- Only valid within VStack/HStack

## Style Mapping

### Color Mapping
Map SwiftUI colors to CSS hex values:
- `.red` → `#FF3B30`
- `.blue` → `#007AFF`
- `.green` → `#34C759`
- `.black` → `#000000`
- `.white` → `#FFFFFF`
- etc.

### Font Mapping
Map SwiftUI fonts to CSS font properties:
- `.largeTitle` → 34px, bold
- `.title` → 28px, bold
- `.headline` → 17px, semibold
- `.body` → 17px, regular
- etc.

### Modifier Processing
Common modifiers and their effects:
- `.padding()` → Add padding to style
- `.background()` → Set background color
- `.foregroundColor()` → Set text color
- `.font()` → Set font properties
- `.cornerRadius()` → Set corner radius
- `.shadow()` → Add shadow effect
- `.opacity()` → Set opacity

## Implementation Guidelines

### File Structure
```
src/renderer/
├── layoutEngine.ts
├── styleEngine.ts
├── canvasRenderer.ts
├── compositor.ts
├── componentRenderers/
│   ├── textRenderer.ts
│   ├── buttonRenderer.ts
│   ├── stackRenderer.ts
│   ├── imageRenderer.ts
│   └── ...
└── types.ts
```

### Layout Interface
```typescript
interface LayoutConstraints {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

interface LayoutResult {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

### Style Interface
```typescript
interface ComponentStyle {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: string;
  padding?: { top: number; right: number; bottom: number; left: number };
  cornerRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  opacity?: number;
}
```

### Device Frame Interface
```typescript
interface DeviceFrame {
  name: string;
  framePath: string;
  screenWidth: number;
  screenHeight: number;
  screenX: number;
  screenY: number;
  notchHeight?: number;
}
```

## Performance Considerations

### Optimization Strategies
- Cache layout results for unchanged components
- Implement incremental rendering
- Reuse canvas instances
- Load device frames on demand
- Use worker threads for heavy operations

### Performance Targets
- Simple view (Text + Button): < 500ms
- Medium view (Stack with 10 children): < 1s
- Complex view (Nested stacks, 50+ components): < 2s

## Testing Requirements

### Unit Tests
- Layout engine: Various layout scenarios
- Style engine: Style application and mapping
- Component renderers: Individual component rendering
- Compositor: Device frame composition

### Integration Tests
- End-to-end rendering of sample component trees
- Visual regression testing (compare expected vs actual)
- Performance testing (measure render times)

### Test Coverage
- Target ≥ 80% coverage
- Include edge cases (empty views, deep nesting)
- Test with real SwiftUI component trees

## Device Specifications

### iPhone 15 Pro
- Screen: 393 x 852 points
- Frame: 1284 x 2796 pixels
- Screen offset: x=60, y=120
- Notch height: 59px

### iPhone 16 Pro
- Screen: 402 x 874 points
- Frame: 1320 x 2868 pixels
- Screen offset: x=62, y=125
- Dynamic Island height: 35px

### iPhone 17 Pro
- Screen: 412 x 896 points
- Frame: 1356 x 2934 pixels
- Screen offset: x=64, y=130
- Dynamic Island height: 35px

## References

- Context: `Context/architecture.md` - Renderer engine architecture
- Design: `docs/design-renderer.md` - Detailed renderer design
- Requirements: `Context/requirements-summary.md` - RF-003, RF-004

## Quality Checklist

- [ ] Layout engine correctly positions all components
- [ ] Style engine accurately maps SwiftUI modifiers
- [ ] Canvas renderer produces correct visual output
- [ ] Device composition applies frames correctly
- [ ] Performance targets met (< 2s for complex views)
- [ ] Memory usage stays within limits (< 200 MB idle)
- [ ] Test coverage ≥ 80%
- [ ] All tests pass
- [ ] Code follows project style guidelines (single quotes, no semicolons)
