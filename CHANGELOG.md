# Change Log

All notable changes to the "open-swift-ui-preview" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.5.0] — 2026-04-26

### Added

- Dispositivos y UI (Fase 5)
- `src/vscode/device-models.ts` con DeviceModel interface y constantes para iPhone 15/16/17 series
- `src/vscode/device-selector.ts` para selección de dispositivos mediante QuickPick
- `assets/device-frames/` con estructura de directorios para marcos PNG de dispositivos
- Integración de DeviceSelector en PreviewPanel para renderizado con dimensiones específicas
- Integración de comando SELECT_DEVICE en ExtensionIntegration
- Tests para device models en `tests/vscode/device-selector.test.ts`

### Changed

- PreviewPanel ahora usa dimensiones del dispositivo seleccionado para layout y renderizado
- WebView muestra nombre del dispositivo actual en el status

## [0.4.0] — 2026-04-26

### Added

- Integración VS Code (Fase 4)
- `src/vscode/commands.ts` con definición de comandos (START_PREVIEW, STOP_PREVIEW, SELECT_DEVICE, TOGGLE_PREVIEW)
- `src/vscode/preview-panel.ts` para gestión de WebView panel con renderizado de preview
- `src/vscode/file-watcher.ts` para detección de cambios en archivos con debounce de 500ms
- `src/vscode/extension.ts` como integración principal que coordina comandos, panel y file watcher
- Actualización de `src/main.ts` para usar ExtensionIntegration
- Tests básicos para módulos VS Code en `tests/vscode/`
- Configuración de esbuild para excluir módulos nativos (canvas)

### Changed

- Actualizado `esbuild.js` para marcar `canvas` como módulo externo
- Actualizado `jest.config.js` para incluir setup file de tests

## [0.3.0] — 2026-04-26

### Added

- Motor de Renderizado (Fase 3)
- Soporte para renderizado en Canvas vía `node-canvas`
- `layout-engine.ts` para estimación posicional jerárquica de interfaces gráficas.
- `component-mapper.ts` para conversión de UI Modifiers de SwiftUI a directivas Canvas/CSS.
- `canvas-renderer.ts` y `device-frame.ts` para serialización de buffers y renderizado estético.

## [0.2.0] — 2026-04-26

### Added

- Motor de Parsing (Fase 2)
- Types para AST y Component Tree (`src/parser/types.ts`)
- Lexer sin Regex dependiente de AST (`src/parser/lexer.ts`)
- Parser recursivo de descenso con recuperación de error natural (`src/parser/parser.ts`)
- Fachada SwiftUIParser y extractor de componentes (`src/parser/swiftui-parser.ts`)
- Pruebas exhaustivas para lexer, parser y fachada con Jest (80%+ de cobertura de código)

## [0.1.0] — 2026-04-26

### Added

- Scaffolding inicial de la extensión VS Code (Fase 1 — Fundamentos)
- Estructura de módulos: `src/parser`, `src/renderer`, `src/vscode`
- Entry point centralizado `src/main.ts` (activate / deactivate)
- Comando `opensui.helloWorld` registrado en la extensión
- TypeScript con strict mode completo (`tsconfig.json` reforzado)
- ESLint reforzado con reglas `no-unused-vars` y `no-explicit-any`
- Tests estructurales básicos en `tests/basic.test.ts`
- Script `dev` como alias de `watch` en `package.json`

## [Unreleased]

- Initial release