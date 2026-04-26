# Fase 1 — Fundamentos: Plan de Implementación

El proyecto ya tiene scaffolding generado por VS Code (vía Yeoman). Esta fase
adapta esa base al estándar definido en el prompt, agrega los módulos vacíos
requeridos y completa la configuración faltante.

## Estado actual del repositorio

| Artefacto | Estado |
|-----------|--------|
| `src/extension.ts` | ✅ Existe (scaffolding Yeoman) |
| `src/parser/`, `src/renderer/`, `src/vscode/` | ❌ No existen |
| `src/main.ts` | ❌ No existe (el prompt indica este archivo) |
| `package.json` | ✅ Existe, ajustes menores necesarios |
| `tsconfig.json` | ✅ Existe, faltan campos (`outDir`, `esModuleInterop`, etc.) |
| `.eslintrc.json` | ❌ No existe (hay `eslint.config.mjs` moderno) |
| `.vscode/launch.json` | ✅ Existe y correcto |
| `tests/basic.test.ts` | ❌ No existe |
| `CHANGELOG.md` | ✅ Existe, sin entrada de la fase |

## Decisiones de adaptación

> [!IMPORTANT]
> El proyecto usa **ESLint v9 flat config** (`eslint.config.mjs`), que es
> incompatible con el formato `.eslintrc.json` (ESLint v8). Se mantendrá el
> formato moderno y se reforzarán las reglas según el prompt.

> [!NOTE]  
> El entry point del scaffolding es `src/extension.ts` y el `package.json` lo
> apunta como `./dist/extension.js`. Se creará `src/main.ts` como re-export
> centralizado, y `extension.ts` importará desde `main.ts` para que el bundling
> con esbuild siga funcionando.

> [!NOTE]
> El prompt menciona `tests/basic.test.ts` pero el proyecto usa **Mocha +
> @vscode/test-electron** (no Jest). Se creará el test con la estructura de Mocha
> para mantener coherencia con las herramientas ya instaladas.

## Cambios propuestos

---

### Paso 1 — Rama git
Crear rama `fase-1-fundamentos` desde `main`.

---

### Paso 2 — Estructura de directorios
```
src/
  parser/index.ts   [NEW]
  renderer/index.ts [NEW]
  vscode/index.ts   [NEW]
  main.ts           [NEW]
tests/
  basic.test.ts     [NEW]
```

---

### Paso 3 — Archivos de código fuente

#### [NEW] `src/main.ts`
Entry point oficial del módulo, registra el comando `opensui.helloWorld`.

#### [NEW] `src/parser/index.ts`
Barrel export vacío con comentario de placeholder para Fase 2.

#### [NEW] `src/renderer/index.ts`
Barrel export vacío con comentario de placeholder para Fase 3.

#### [NEW] `src/vscode/index.ts`
Barrel export vacío con comentario de placeholder para Fase 4.

---

### Paso 4 — Configuración

#### [MODIFY] `tsconfig.json`
Agregar campos faltantes: `outDir`, `esModuleInterop`, `skipLibCheck`,
`forceConsistentCasingInFileNames`, `resolveJsonModule`, `declaration`,
`declarationMap`.

#### [MODIFY] `package.json`
- Añadir comando `opensui.helloWorld` en `contributes.commands`
- Agregar script `dev` (alias de `watch`)
- Actualizar `version` a `0.1.0`

#### [MODIFY] `eslint.config.mjs`
Reforzar con reglas `no-unused-vars` y `no-explicit-any`.

---

### Paso 5 — Tests

#### [NEW] `tests/basic.test.ts`
Test con Mocha que verifica módulos (parser, renderer, vscode).

---

### Paso 6 — Documentación

#### [MODIFY] `CHANGELOG.md`
Agregar entrada `[0.1.0]` para esta fase.

---

## Plan de verificación

| # | Criterio | Comando |
|---|----------|---------|
| 1 | Compila sin errores | `npm run check-types` |
| 2 | Linting sin errores | `npm run lint` |
| 3 | Estructura de directorios | `ls -R src/` |
| 4 | Comando Hello World en package.json | `grep opensui package.json` |
| 5 | CHANGELOG actualizado | `head CHANGELOG.md` |
