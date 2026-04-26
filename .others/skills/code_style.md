# Code Style Guide

## Objetivo

Establecer convenciones de código consistentes para el proyecto OpenSUI.

---

## Reglas de Nomenclatura

### Variables y funciones

```typescript
// camelCase para variables y funciones
const previewPanel = new PreviewPanel();
function parseSwiftUI() {}

// camelCase para métodos
class Parser {
  parse(): void {}
  tokenize(): Token[] {}
}

// camelCase para constantes locales
const MAX_NESTING_DEPTH = 10;
```

### Tipos e interfaces

```typescript
// PascalCase para tipos
interface SwiftUIComponent {}
type ComponentType = string;
enum TokenType {}

// I prefix para interfaces
interface IPreviewPanel {}
```

### Archivos

```typescript
// kebab-case para archivos
// lexer.ts, layout-engine.ts, preview-panel.ts
```

---

## Estructura de Archivos

```typescript
// 1. Imports
import { Token, TokenType } from './types';

// 2. Exports (constantes, enums)
export enum TokenType {}

// 3. Interfaces
export interface Token {}

// 4. Clases
export class Lexer {
  // 4.1 Propiedades privadas
  private source: string;
  private position: number;

  // 4.2 Constructor
  constructor(source: string) {
    this.source = source;
  }

  // 4.3 Métodos públicos
  public tokenize(): Token[] {}

  // 4.4 Métodos privados
  private nextToken(): Token | null {}
}
```

---

## Comentarios

```typescript
// Comentario de línea para documentación
// NO agregar comentarios innecesarios

// GOOD: Comentario que explica decisión no obvia
const debounceMs = 300; // 300ms para balance entre responsividad y performance

// BAD: Comentario redundante
const x = 0; // Initialize x to 0
```

---

## Imports

```typescript
// Orden de imports
// 1. Node.js built-ins
import * as path from 'path';

// 2. Dependencias externas (vscode, etc.)
import * as vscode from 'vscode';

// 3. Dependencias internas
import { Token, TokenType } from '../parser/types';
import { LayoutEngine } from './layout-engine';

// 4. Assets locales
```

---

## Control de Flujo

```typescript
// Preferir early returns
function parse(tokens: Token[]): AST | null {
  if (!tokens.length) {
    return null;
  }
  // ...
}

// Preferir destructuring
const { name, value } = token;

// Preferir const sobre let
const result = parse(source);
```

---

## Aplicación

Cargar este skill al:
- Crear nuevos archivos TypeScript
- Refactorizar código existente
- Code review