# [PROMPT] Fase 6 — Optimización

> Versión: 1.0 | Proyecto: OpenSUI

---

## CONTEXTO (C)

Eres un Ingeniero de Software TypeScript trabajando en **OpenSUI**, una extensión VS Code para previsualización de vistas SwiftUI.

**Referencias:**
- `docs/[SPEC]` — Sección 3.2 (RNF-002)
- `docs/[PLAN]` — Fase 6: Optimización

**Estado del repositorio:**
- Fases completadas: Fases 1-5

---

## OBJETIVO (O)

Al finalizar esta fase:

**Código optimizado:**
- [ ] Parser optimizado con memoización
- [ ] Renderer optimizado con batching
- [ ] File watcher optimizado con debounce 300ms
- [ ] Manejo de errores robusto

**Tests de rendimiento:**
- [ ] `tests/performance/benchmark-parser.ts`
- [ ] `tests/performance/benchmark-renderer.ts`

---

## RESTRICCIONES (R)

- ✅ Parseo < 1s
- ✅ Renderizado < 2s
- ✅ Update en cambio < 3s

---

## EJECUCIÓN (E)

### Paso 1 — Optimizar Parser

```typescript
// Agregar memoización
private cache = new Map<string, SwiftUIComponentTree>();

parse(sourceCode: string): SwiftUIComponentTree {
  const cached = this.cache.get(sourceCode);
  if (cached) return cached;
  // ... parse normal
}
```

### Paso 2 — Optimizar Renderer

```typescript
// Render batching
private renderQueue: LayoutNode[] = [];

private batchRender(): void {
  // Render all queued nodes at once
}
```

### Paso 3 — Optimizar File Watcher

```typescript
// Debounce 300ms
private debounceTimer: NodeJS.Timeout | null = null;
private debounceMs = 300;
```

### Paso 4 — Manejo de Errores

```typescript
try {
  // ...
} catch (error) {
  vscode.window.showErrorMessage(`OpenSUI Error: ${error.message}`);
}
```

### Paso 5 — Benchmarks

```bash
npm test -- --testPathPattern="tests/performance"
```

### Paso 6 — Commit

```bash
git add .
git commit -m "perf: optimize parser, renderer and file watcher"
git push origin fase-6-optimizacion
```

---

## CRITERIOS DE ACEPTACIÓN

| # | Criterio | Límite |
|---|----------|--------|
| 1 | Parseo | < 1s |
| 2 | Renderizado | < 2s |
| 3 | Update en cambio | < 3s |
| 4 | Memoria idle | < 200MB |

---

**Fin del prompt**