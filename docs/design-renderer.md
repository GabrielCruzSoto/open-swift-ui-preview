# Renderer Design — OpenSUI

## Overview

The renderer engine is responsible for converting the parsed SwiftUI component tree into a visual representation (image). This document describes the design and implementation strategy for the renderer.

## Architecture

```
Component Tree
      │
      ▼
┌──────────────┐
│Layout Engine │ → Positioned Components
└──────────────┘
      │
      ▼
┌──────────────┐
│Style Engine  │ → Styled Components
└──────────────┘
      │
      ▼
┌──────────────┐
│Canvas Renderer│ → Image Buffer
└──────────────┘
      │
      ▼
┌──────────────┐
│ Compositor   │ → Final Image with Device Frame
└──────────────┘
```

## Components

### 1. Layout Engine (`layoutEngine.ts`)

**Purpose**: Calculate positions and sizes for all components

**Layout Algorithm**:
1. Traverse component tree depth-first
2. Calculate intrinsic size for each component
3. Apply layout rules based on container type
4. Resolve constraints and spacing
5. Assign final positions

**Layout Types**:

**VStack (Vertical Stack)**
- Children arranged vertically
- Respects `spacing` property
- Supports `alignment` (leading, center, trailing)
- Height = sum of children heights + spacing
- Width = max child width

**HStack (Horizontal Stack)**
- Children arranged horizontally
- Respects `spacing` property
- Supports `alignment` (top, center, bottom)
- Width = sum of children widths + spacing
- Height = max child height

**ZStack (Z-Axis Stack)**
- Children layered on top of each other
- All children occupy same space
- Supports `alignment` for positioning
- Size = largest child size

**Spacer**
- Expands to fill available space
- Zero intrinsic size
- Only valid within VStack/HStack

**Interface**:
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

class LayoutEngine {
  layout(component: SwiftUIComponent, constraints: LayoutConstraints): LayoutResult;
}
```

### 2. Style Engine (`styleEngine.ts`)

**Purpose**: Apply SwiftUI styling rules to components

**Style Properties**:

**Text Styles**
- Font: `.title`, `.headline`, `.body`, `.caption`, etc.
- Font size: numeric values
- Font weight: `.bold`, `.light`, `.regular`
- Color: `.blue`, `.red`, `.green`, hex values
- Text alignment: `.leading`, `.center`, `.trailing`

**Background Styles**
- Background color
- Background image
- Corner radius
- Shadow

**Padding**
- All edges: `.padding()`
- Specific edges: `.padding(.leading)`, `.padding(.top)`, etc.
- Custom amount: `.padding(16)`

**Border**
- Border width
- Border color
- Corner radius

**Style Mapping**:
```typescript
interface ComponentStyle {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: string;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  cornerRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  opacity?: number;
}

class StyleEngine {
  applyStyles(component: SwiftUIComponent, baseStyle: ComponentStyle): ComponentStyle;
}
```

### 3. Canvas Renderer (`canvasRenderer.ts`)

**Purpose**: Render styled components to image buffer

**Rendering Technology**:
- HTML5 Canvas API (via webview)
- Alternative: Node.js canvas library (canvas, sharp)

**Rendering Pipeline**:
1. Create canvas with component dimensions
2. Apply background
3. Render children in order
4. Apply effects (shadows, opacity)
5. Export to PNG/JPEG

**Interface**:
```typescript
class CanvasRenderer {
  render(component: SwiftUIComponent, style: ComponentStyle): Buffer;
  setDimensions(width: number, height: number): void;
}
```

### 4. Component Renderers

Each SwiftUI component has a dedicated renderer:

**Text Renderer** (`textRenderer.ts`)
```typescript
class TextRenderer {
  render(text: string, style: ComponentStyle, canvas: Canvas): void;
  measure(text: string, style: ComponentStyle): { width: number; height: number };
}
```

**Button Renderer** (`buttonRenderer.ts`)
```typescript
class ButtonRenderer {
  render(label: SwiftUIComponent, style: ComponentStyle, canvas: Canvas): void;
  measure(label: SwiftUIComponent, style: ComponentStyle): { width: number; height: number };
}
```

**Stack Renderer** (`stackRenderer.ts`)
```typescript
class StackRenderer {
  render(children: SwiftUIComponent[], layout: LayoutResult, canvas: Canvas): void;
}
```

**Image Renderer** (`imageRenderer.ts`)
```typescript
class ImageRenderer {
  render(imageName: string, style: ComponentStyle, canvas: Canvas): void;
  measure(imageName: string, style: ComponentStyle): { width: number; height: number };
}
```

### 5. Compositor (`compositor.ts`)

**Purpose**: Apply device frame to rendered preview

**Composition Steps**:
1. Load device frame image
2. Calculate screen area within frame
3. Scale rendered preview to screen dimensions
4. Composite preview onto frame
5. Apply device-specific effects (notch, rounded corners)

**Interface**:
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

class Compositor {
  compose(preview: Buffer, device: DeviceFrame): Buffer;
  loadDeviceFrame(deviceModel: string): DeviceFrame;
}
```

## Rendering Pipeline

### Complete Flow

```
1. Receive Component Tree
   ↓
2. Layout Engine calculates positions
   - Traverse tree depth-first
   - Calculate intrinsic sizes
   - Apply layout rules
   - Resolve constraints
   ↓
3. Style Engine applies styles
   - Map SwiftUI modifiers to styles
   - Resolve colors and fonts
   - Apply padding and borders
   ↓
4. Canvas Renderer renders
   - Create canvas
   - Render background
   - Render components in order
   - Apply effects
   ↓
5. Compositor applies device frame
   - Load device frame
   - Scale preview
   - Composite onto frame
   ↓
6. Return final image
```

## Style System

### Color Mapping

SwiftUI colors to CSS colors:
```typescript
const colorMap: Record<string, string> = {
  'red': '#FF3B30',
  'blue': '#007AFF',
  'green': '#34C759',
  'orange': '#FF9500',
  'yellow': '#FFCC00',
  'pink': '#FF2D55',
  'purple': '#AF52DE',
  'black': '#000000',
  'white': '#FFFFFF',
  'gray': '#8E8E93',
  // ... more colors
};
```

### Font Mapping

SwiftUI fonts to CSS fonts:
```typescript
const fontMap: Record<string, { size: number; weight: string }> = {
  'largeTitle': { size: 34, weight: 'bold' },
  'title': { size: 28, weight: 'bold' },
  'title2': { size: 22, weight: 'bold' },
  'title3': { size: 20, weight: 'semibold' },
  'headline': { size: 17, weight: 'semibold' },
  'body': { size: 17, weight: 'regular' },
  'callout': { size: 16, weight: 'regular' },
  'subheadline': { size: 15, weight: 'regular' },
  'footnote': { size: 13, weight: 'regular' },
  'caption': { size: 12, weight: 'regular' },
  'caption2': { size: 11, weight: 'regular' },
};
```

### Modifier Processing

**Common Modifiers**:
- `.padding()` → Add padding to style
- `.background()` → Set background color
- `.foregroundColor()` → Set text color
- `.font()` → Set font properties
- `.frame()` → Override layout constraints
- `.cornerRadius()` → Set corner radius
- `.shadow()` → Add shadow effect
- `.opacity()` → Set opacity

**Modifier Order**:
Modifiers are applied in order (last modifier on top)

## Device Frames

### Device Specifications

**iPhone 15 Pro**
- Screen: 393 x 852 points
- Frame: 1284 x 2796 pixels
- Screen offset: x=60, y=120
- Notch height: 59px

**iPhone 16 Pro**
- Screen: 402 x 874 points
- Frame: 1320 x 2868 pixels
- Screen offset: x=62, y=125
- Dynamic Island height: 35px

**iPhone 17 Pro**
- Screen: 412 x 896 points
- Frame: 1356 x 2934 pixels
- Screen offset: x=64, y=130
- Dynamic Island height: 35px

### Frame Assets

Device frames stored as PNG images with transparency:
- Path: `assets/device-frames/{model}.png`
- Naming: `iphone-15-pro.png`, `iphone-16-pro.png`, etc.
- Resolution: High-resolution (2x or 3x)

## Performance Considerations

### Optimization Strategies

1. **Layout Caching**: Cache layout results for unchanged components
2. **Incremental Rendering**: Only re-render changed components
3. **Canvas Pooling**: Reuse canvas instances
4. **Lazy Loading**: Load device frames on demand
5. **Worker Threads**: Offload rendering to worker threads

### Performance Targets

- Simple view (Text + Button): < 500ms
- Medium view (Stack with 10 children): < 1s
- Complex view (Nested stacks, 50+ components): < 2s

## Testing Strategy

### Unit Tests
- Layout engine: Various layout scenarios
- Style engine: Style application and mapping
- Component renderers: Individual component rendering
- Compositor: Device frame composition

### Integration Tests
- End-to-end rendering of sample component trees
- Visual regression testing (compare expected vs actual output)
- Performance testing (measure render times)

### Test Coverage
- Target: ≥ 80% coverage
- Include edge cases (empty views, deep nesting)
- Test with real SwiftUI component trees

## Future Enhancements

1. **Animation Support**: Render animation states
2. **Dark Mode**: Support for dark mode color schemes
3. **Custom Fonts**: Support for custom font families
4. **Gradients**: Support for gradient backgrounds
5. **Blur Effects**: Support for blur and transparency effects
6. **SVG Export**: Alternative to PNG/JPEG output
7. **High DPI**: Support for retina display rendering
