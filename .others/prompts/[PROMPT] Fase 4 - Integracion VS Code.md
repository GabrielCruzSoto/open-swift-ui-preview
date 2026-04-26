# [PROMPT] Fase 4 — Integración VS Code

> Versión: 1.0 | Proyecto: OpenSUI

---

## CONTEXTO (C)

Eres un Ingeniero de Software TypeScript trabajando en **OpenSUI**, una extensión VS Code para previsualización de vistas SwiftUI.

**Referencias obligatorias:**
- `docs/[DESIGN]` — Sección 5 (VS Code Integration)
- `docs/[PLAN]` — Fase 4: Integración VS Code

**Estado del repositorio:**
- Fases completadas: Fases 1-3
- Archivos relevantes: `src/main.ts`, `src/parser/*`, `src/renderer/*`

---

## OBJETIVO (O)

Al finalizar esta fase:

**Código fuente:**
- [ ] `src/vscode/commands.ts` — Command registration
- [ ] `src/vscode/preview-panel.ts` — WebView panel
- [ ] `src/vscode/file-watcher.ts` — File change detection
- [ ] `src/vscode/extension.ts` — Main integration
- [ ] `src/main.ts` actualizado

**Tests:**
- [ ] `tests/vscode/commands.test.ts`
- [ ] `tests/vscode/preview-panel.test.ts`

---

## RESTRICCIONES (R)

- ✅ Usa WebView API de VS Code
- ✅ Panel con enableScripts: true
- ❌ No usa funcionalidades experimentales

---

## EJECUCIÓN (E)

### Paso 1 — Comandos VS Code

Crear `src/vscode/commands.ts`:
```typescript
export const COMMANDS = {
  START_PREVIEW: 'opensui.startPreview',
  STOP_PREVIEW: 'opensui.stopPreview',
  SELECT_DEVICE: 'opensui.selectDevice',
  TOGGLE_PREVIEW: 'opensui.togglePreview',
};
```

### Paso 2 — WebView Panel

Crear `src/vscode/preview-panel.ts`:
```typescript
export class PreviewPanel {
  async create(): Promise<void> { /* ... */ }
  async show(): Promise<void> { /* ... */ }
  async updatePreview(sourceCode: string): Promise<void> { /* ... */ }
  private async render(sourceCode?: string): Promise<void> { /* ... */ }
}
```

### Paso 3 — File Watcher

Crear `src/vscode/file-watcher.ts`:
```typescript
export class FileWatcher {
  startWatching(filePath: string): void { /* ... */ }
  stopWatching(): void { /* ... */ }
}
```

### Paso 4 — Integración principal

Actualizar `src/main.ts`:
```typescript
import { PreviewPanel } from './vscode/preview-panel';
import { FileWatcher } from './vscode/file-watcher';

let previewPanel: PreviewPanel | null = null;
let fileWatcher: FileWatcher | null = null;

export function activate(context: vscode.ExtensionContext): void {
  const startCmd = vscode.commands.registerCommand(
    'opensui.startPreview',
    async () => {
      previewPanel = new PreviewPanel();
      await previewPanel.create();
    }
  );
  context.subscriptions.push(startCmd);
}
```

### Paso 5 — Tests

```bash
npm test -- --testPathPattern="tests/vscode"
```

### Paso 6 — Commit

```bash
git add .
git commit -m "feat(vscode): add WebView panel and file watcher integration"
git push origin fase-4-integracion-vs-code
```

---

## CRITERIOS DE ACEPTACIÓN

| # | Criterio | Comando |
|---|----------|--------|
| 1 | Panel se abre | Test manual |
| 2 | Preview muestra imagen | Test manual |
| 3 | Tests pasan | `npm test -- vscode` |
| 4 | Compilación sin errores | `tsc --noEmit` |

---

**Fin del prompt**