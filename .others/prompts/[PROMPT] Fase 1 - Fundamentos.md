# [PROMPT] Fase 1 — Fundamentos

> Versión: 1.0 | Proyecto: OpenSUI

---

## CONTEXTO (C)

Eres un Ingeniero de Software TypeScript trabajando en **OpenSUI**, una extensión VS Code para previsualización de vistas SwiftUI.

**Referencias obligatorias que debes leer antes de comenzar:**
- `docs/[DESIGN] OpenSUI - Diseno de la Solucion.md` — Secciones: 1.1, 1.2, 6.2
- `docs/[PLAN] OpenSUI - Plan de Trabajo.md` — Fase 1: Fundamentos

**Estado del repositorio al inicio de esta fase:**
- Fases completadas: Ninguna
- Archivos existentes relevantes: Ninguno (scaffolding inicial)

---

## OBJETIVO (O)

Al finalizar esta fase, el repositorio debe contener:

**Código fuente:**
- [ ] `src/main.ts` — Entry point de la extensión con estructura básica
- [ ] `src/parser/index.ts` — Exports del módulo parser
- [ ] `src/renderer/index.ts` — Exports del módulo renderer
- [ ] `src/vscode/index.ts` — Exports del módulo vscode

**Configuración:**
- [ ] `package.json` — Dependencias configuradas
- [ ] `tsconfig.json` — TypeScript con strict mode
- [ ] `.eslintrc.json` — ESLint configurado
- [ ] `.vscode/launch.json` — Debug config

**Tests:**
- [ ] `tests/basic.test.ts` — Test básico de estructura

**Documentación:**
- [ ] `CHANGELOG.md` actualizado con entrada para esta fase

---

## RESTRICCIONES (R)

**De código:**
- ✅ TypeScript estricto (`strict: true` en tsconfig)
- ✅ Sin dependencias externas no declaradas en `requirements.md`
- ❌ No duplicar lógica que ya existe en fases anteriores
- ❌ No romper compatibilidad con la API pública de fases previas

**De commits:**
- ✅ Commits atómicos por cada tarea técnica completada
- ✅ Formato: `tipo(scope): descripción` (Conventional Commits)
- ✅ Tipos válidos: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`
- Ejemplo: `feat(fundamentos): add scaffolding de extensión VS Code`

**De calidad:**
- ✅ Cobertura de tests: ≥ 80%
- ✅ Sin errores de compilación (`tsc --noEmit`)
- ✅ Sin warnings de linting (`eslint src/`)

---

## EJECUCIÓN (E)

Sigue estos pasos **en orden**. No avances al siguiente si el actual falla.

### Paso 1 — Preparación del entorno y configuración inicial

```bash
# Inicializar npm y crear package.json
npm init -y

# Instalar dependencias deVS Code
npm install --save vscode@^1.85.0
npm install --save-dev typescript@^5.0.0 @types/vscode@^1.85.0 @types/node@^18.0.0

# Instalar herramientas de desarrollo
npm install --save-dev eslint@^8.0.0 prettier@^3.0.0
npm install --save-dev @typescript-eslint/parser@^6.0.0 @typescript-eslint/eslint-plugin@^6.0.0
```

### Paso 2 — Configurar TypeScript

Crear `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Paso 3 — Crear estructura de directorios

```bash
mkdir -p src/parser src/renderer src/vscode tests/parser tests/renderer tests/vscode .vscode assets
```

### Paso 4 — Implementar entry point básico

Crear `src/main.ts`:
```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(
    'opensui.helloWorld',
    () => {
      vscode.window.showInformationMessage('OpenSUI Hello World!');
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): void {}
```

Crear módulos index.ts vacíos para cada módulo.

### Paso 5 — Configurar ESLint

Crear `.eslintrc.json`:
```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "env": {
    "node": true,
    "es2020": true
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### Paso 6 — Agregar scripts al package.json

```json
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "lint": "eslint src/ --ext .ts",
    "test": "jest",
    "package": "vsce package"
  }
}
```

### Paso 7 — Configurar VS Code debug

Crear `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

### Paso 8 — Testing básico

Crear test que verifique que la estructura carga correctamente.

### Paso 9 — Actualización del CHANGELOG

Agregar al inicio de `CHANGELOG.md`:
```markdown
## [0.1.0] — YYYY-MM-DD
### Added
- Scaffolding de extensión VS Code básico
- Estructura de módulos (parser, renderer, vscode)
- Comando Hello World de prueba
```

### Paso 10 — Commit y Push

```bash
git add .
git commit -m "feat(fundamentos): add VS Code extension scaffolding"
git push origin fase-1-fundamentos
```

---

## CRITERIOS DE ACEPTACIÓN DE LA FASE

| # | Criterio | Comando de verificación |
|---|----------|------------------------|
| 1 | Extensión compila sin errores | `tsc --noEmit` |
| 2 | Linting sin errores | `npm run lint` |
| 3 | Estructura de directorios correcta | `ls -R src/` |
| 4 | Comando Hello World registrado | Buscar en package.json |
| 5 | CHANGELOG actualizado | `head CHANGELOG.md` |

---

**Fin del prompt**