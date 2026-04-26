# Renderer Design

## Objetivo

Documentar el diseño del motor de renderizado de OpenSUI.

---

## Pipeline de Renderizado

```
┌──────────────────────────────────────────────────────┐
│                   INPUT                               │
│            SwiftUIComponentTree                      │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│               LAYOUT ENGINE                           │
│  1. Calcula posiciones y tamaños                     │
│  2. Aplica alignment y spacing                        │
│  3. Resuelve frames y paddings                        │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│               COMPONENT MAPPER                        │
│  1. Convierte props SwiftUI a estilos                 │
│  2. Resuelve colores del sistema                     │
│  3. Resuelve fonts                                   │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│               CANVAS RENDERER                         │
│  1. Genera imagen PNG                                │
│  2. Dibuja componentes en orden                      │
│  3. Compone con device frame                        │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│                   OUTPUT                              │
│               PNG Buffer                              │
└──────────────────────────────────────────────────────┘
```

---

## Layout Engine

### Algoritmo de Layout

```typescript
class LayoutEngine {
  computeLayout(ast: SwiftUIComponentTree): LayoutNode {
    return this.computeNodeLayout(ast.root, this.rootLayout);
  }

  private computeNodeLayout(
    component: SwiftUIComponent,
    parentLayout: ComputedLayout
  ): LayoutNode {
    const layout = this.applyFrameModifier(component, parentLayout);
    const paddedLayout = this.applyPadding(component, layout);

    if (this.isContainer(component.type)) {
      const children = this.computeContainerLayout(component, paddedLayout);
      return { component, layout: paddedLayout, children };
    }

    return { component, layout: paddedLayout, children: [] };
  }
}
```

### Cálculo de Container

```typescript
private computeContainerLayout(
  component: SwiftUIComponent,
  parentLayout: ComputedLayout
): LayoutNode[] {
  const spacing = component.props.spacing || 0;
  const alignment = component.props.alignment || 'center';
  const children = component.children;
  const childLayouts: LayoutNode[] = [];

  // First pass: calculate child sizes
  for (const child of children) {
    childLayouts.push(this.computeNodeLayout(child, parentLayout));
  }

  // Second pass: position children
  let currentY = parentLayout.y;

  if (alignment === 'center') {
    const totalHeight = this.calculateTotalHeight(childLayouts, spacing);
    currentY += (parentLayout.height - totalHeight) / 2;
  }

  for (const childLayout of childLayouts) {
    childLayout.layout.y = currentY;
    currentY += childLayout.layout.height + spacing;
  }

  return childLayouts;
}
```

---

## Component Mapper

### Mapeo de Estilos

```typescript
class ComponentMapper {
  mapToStyle(component: SwiftUIComponent): RenderStyle {
    const style = this.getDefaultStyle();

    switch (component.type) {
      case 'Text':
        this.applyTextStyles(component, style);
        break;
      case 'Button':
        this.applyButtonStyles(component, style);
        break;
    }

    this.applyModifiers(component, style);
    return style;
  }
}
```

### Resolución de Colores

```typescript
private resolveColor(colorValue: string): string {
  if (this.colorCache.has(colorValue)) {
    return this.colorCache.get(colorValue)!;
  }

  // Parse hex colors
  if (colorValue.startsWith('#')) {
    return colorValue;
  }

  return colorValue;
}
```

---

## Canvas Renderer

### Renderizado de Componentes

```typescript
class CanvasRenderer {
  render(layoutTree: LayoutNode): Buffer {
    this.clear();
    this.renderNode(layoutTree);
    return this.canvas.toBuffer('image/png');
  }

  private renderNode(node: LayoutNode): void {
    const { component, layout } = node;

    switch (component.type) {
      case 'Text':
        this.renderText(component, layout);
        break;
      case 'Button':
        this.renderButton(component, layout);
        break;
      case 'Image':
        this.renderImage(component, layout);
        break;
      case 'Divider':
        this.renderDivider(layout);
        break;
    }

    // Render children
    for (const child of node.children) {
      this.renderNode(child);
    }
  }
}
```

### Ejemplo: Text

```typescript
private renderText(component: SwiftUIComponent, layout: ComputedLayout): void {
  const text = component.props.text || '';
  const mapper = new ComponentMapper();
  const style = mapper.mapToStyle(component);

  this.ctx.fillStyle = style.color;
  this.ctx.font = `${style.fontSize}px "${style.fontFamily}"`;
  this.ctx.textAlign = style.textAlign;
  this.ctx.fillText(text, layout.x, layout.y);
}
```

---

## Device Frame Composition

```typescript
class DeviceFrameRenderer {
  composeWithFrame(imageBuffer: Buffer, device: DeviceModel): Buffer {
    const frame = loadImage(device.frameImage);
    const canvas = createCanvas(device.width, device.height);

    // Draw frame
    canvas.getContext('2d').drawImage(frame, 0, 0);

    // Draw preview inside frame
    const preview = loadImage(imageBuffer);
    canvas.getContext('2d').drawImage(
      preview,
      device.notchOffset,
      0,
      device.screenWidth,
      device.screenHeight
    );

    return canvas.toBuffer('image/png');
  }
}
```

---

## Métricas de Rendimiento

| Métrica | Objetivo |
|--------|---------|
| Tiempo de renderizado | < 2s |
| Memoria por renderizado | < 50MB |
| Tasa de frames | N/A (estático) |

---

## Aplicación

Cargar este skill al:
- Implementar renderer
- Optimizar performance
- Debug layout issues