# Change Log

All notable changes to the "open-swift-ui-preview" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

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