# [PROMPT] Fase 3 — Motor de Renderizado

> Versión: 1.0 | Proyecto: OpenSUI

---

## CONTEXTO (C)

Eres un Ingeniero de Software TypeScript trabajando en **OpenSUI**, una extensión VS Code para previsualización de vistas SwiftUI.

**Referencias obligatorias:**
- `docs/[DESIGN]` — Sección 4 (Renderer)
- `docs/[PLAN]` — Fase 3: Motor de Renderizado

**Estado del repositorio:**
- Fases completadas: Fases 1-2
- Archivos relevantes: `src/parser/*`, `src/renderer/index.ts`

---

## OBJETIVO (O)

Al finalizar esta fase:

**Código fuente:**
- [ ] `src/renderer/types.ts` — Tipos del renderer
- [ ] `src/renderer/layout-engine.ts` — Layout calculations
- [ ] `src/renderer/component-mapper.ts` — Style mapping
- [ ] `src/renderer/canvas-renderer.ts` — Canvas rendering
- [ ] `src/renderer/device-frame.ts` — Frame composition

**Tests:**
- [ ] `tests/renderer/layout-engine.test.ts` (cobertura ≥ 80%)
- [ ] `tests/renderer/component-mapper.test.ts`
- [ ] `tests/renderer/canvas-renderer.test.ts`

---

## RESTRICCIONES (R)

- ✅ node-canvas para renderizado
- ✅ Tiempo de renderizado < 2s
- ❌ No generar animaciones

---

## EJECUCIÓN (E)

### Paso 1 — Tipos del Renderer

Crear `src/renderer/types.ts`:
```typescript
export interface LayoutNode {
  component: SwiftUIComponent;
  layout: ComputedLayout;
  children: LayoutNode[];
}

export interface ComputedLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}
```

### Paso 2 — Layout Engine

Crear `src/renderer/layout-engine.ts`:
```typescript
export class LayoutEngine {
  computeLayout(ast: SwiftUIComponentTree): LayoutNode { /* ... */ }
  private computeContainerLayout(/* ... */): LayoutNode[] { /* ... */ }
}
```

### Paso 3 — Component Mapper

Crear `src/renderer/component-mapper.ts`:
```typescript
export class ComponentMapper {
  mapToStyle(component: SwiftUIComponent): RenderStyle { /* ... */ }
  private resolveColor(colorValue: string): string { /* ... */ }
}
```

### Paso 4 — Canvas Renderer

Crear `src/renderer/canvas-renderer.ts`:
```typescript
export class CanvasRenderer {
  render(layoutTree: LayoutNode, style: RenderStyle): Buffer { /* ... */ }
  private renderNode(node: LayoutNode): void { /* ... */ }
}
```

### Paso 5 — Tests y verificación

```bash
npm test -- --testPathPattern="tests/renderer"
```

### Paso 6 — Update CHANGELOG, commit y push

```bash
git add .
git commit -m "feat(renderer): add Layout Engine and Canvas Renderer"
git push origin fase-3-motor-de-renderizado
```

---

## CRITERIOS DE ACEPTACIÓN

| # | Criterio | Comando |
|---|----------|--------|
| 1 | Compilación sin errores | `tsc --noEmit` |
| 2 | Tests pasan | `npm test -- renderer` |
| 3 | Coverage ≥ 80% | `npm run test:coverage` |
| 4 | Genera imagen PNG válida | Test manual |
| 5 | Tiempo renderizado < 2s | Benchmark |

---

**Fin del prompt**