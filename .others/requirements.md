# Requirements — OpenSUI

## Runtime

| Dependency | Versión mínima | Descripción |
|------------|----------------|-------------|
| Node.js | >=18.0.0 | JavaScript runtime |
| TypeScript | >=5.0.0 | Type system |
| VS Code Engine | >=1.85.0 | Extension host |

## Dependencias de producción

| Package | Versión | Propósito |
|---------|---------|-----------|
| vscode | ^1.85.0 | VS Code Extension API |

## Dependencias de desarrollo

| Package | Versión | Propósito |
|---------|---------|-----------|
| typescript | ^5.0.0 | TypeScript compiler |
| @types/vscode | ^1.85.0 | VS Code type definitions |
| @types/node | ^18.0.0 | Node.js type definitions |
| @types/jest | ^29.0.0 | Jest type definitions |
| jest | ^29.0.0 | Testing framework |
| @typescript-eslint/parser | ^6.0.0 | ESLint parser for TypeScript |
| @typescript-eslint/eslint-plugin | ^6.0.0 | ESLint rules for TypeScript |
| eslint | ^8.0.0 | Linting |
| prettier | ^3.0.0 | Code formatting |
| vsce | ^2.0.0 | VS Code extension packaging |

## Variables de entorno

| Variable | Requerida | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| NODE_ENV | No | Environment (development/production) | development |
| VSCODE_DEV_MODE | No | VS Code development mode | true |

## Scripts disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| dev | npm run dev | Compilación en modo watch |
| build | npm run build | Build de producción |
| test | npm test | Ejecutar suite de tests |
| test:coverage | npm run test:coverage | Tests con reporte de cobertura |
| lint | npm run lint | Análisis estático de código |
| lint:fix | npm run lint:fix | Linting con auto-fix |
| format | npm run format | Formatear código con Prettier |
| package | npm run package | Empaquetar extensión (.vsix) |
| test:watch | npm run test:watch | Tests en modo watch |

## Estructura de directorios esperada

```
opensui/
├── src/
│   ├── parser/        # Lexer y parser
│   ├── renderer/      # Layout engine y renderizado
│   └── vscode/        # Integración VS Code
├── tests/
│   ├── parser/
│   ├── renderer/
│   └── vscode/
├── assets/
│   └── device-frames/ # Marcos de dispositivos
├── docs/              # Documentación
├── prompts/           # Prompts de fase
└── skills/            # Skills del agente
```

## Configuración de VS Code

```json
{
  "engines": {
    "vscode": "^1.85.0"
  },
  "activationEvents": [
    "onCommand:opensui.startPreview",
    "onCommand:opensui.stopPreview"
  ]
}
```

---

**Fin del documento**