# Testing Rules

## Objetivo

Establecer reglas de testing con Jest para el proyecto OpenSUI.

---

## Estructura de Tests

```typescript
// tests/parser/lexer.test.ts
import { Lexer } from '../../src/parser/lexer';
import { TokenType } from '../../src/parser/types';

describe('Lexer', () => {
  let lexer: Lexer;

  beforeEach(() => {
    lexer = new Lexer('');
  });

  describe('tokenize', () => {
    it('should tokenize VStack', () => {
      const tokens = lexer.tokenize('VStack { }');
      expect(tokens[0].type).toBe(TokenType.VSTACK);
    });
  });
});
```

---

## Naming Conventions

```typescript
// Archivos: {module}.test.ts
lexer.test.ts
parser.test.ts
layout-engine.test.ts

// Describe blocks: nombre del módulo
describe('Lexer', () => {});
describe('LayoutEngine', () => {});

// Test cases: descripción clara
it('should tokenize VStack component', () => {});
it('should handle nested structures up to 10 levels', () => {});
```

---

## Cobertura Mínima

| Módulo | Cobertura mínima |
|--------|-------------------|
| Parser | ≥ 80% |
| Renderer | ≥ 80% |
| VS Code | ≥ 70% |
| Global | ≥ 80% |

---

## Tipos de Tests

### Unit Tests

```typescript
// Test de unidad individual
it('should tokenize string literals', () => {
  const tokens = lexer.tokenize('"Hello World"');
  expect(tokens[0].type).toBe(TokenType.STRING);
});
```

### Integration Tests

```typescript
// Test de integración entre módulos
describe('SwiftUIParser', () => {
  it('should parse complete SwiftUI view', () => {
    const parser = new SwiftUIParser();
    const ast = parser.parse('struct ContentView: View { VStack { Text("Hello") } }');
    expect(ast.root.children[0].type).toBe('VStack');
  });
});
```

### Edge Cases

```typescript
it('should handle empty source', () => { /* ... */ });
it('should handle deeply nested structures', () => { /* ... */ });
it('should handle unknown tokens gracefully', () => { /* ... */ });
```

---

## Mocks y Stubs

```typescript
// Mock de VS Code API
jest.mock('vscode', () => ({
  window: {
    createWebviewPanel: jest.fn(() => mockPanel),
    showInformationMessage: jest.fn(),
  },
}));

// Stub de canvas
jest.mock('canvas', () => ({
  createCanvas: jest.fn(() => mockCanvas),
}));
```

---

## Comandos de Verificación

```bash
# Ejecutar tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch

# Tests de un módulo específico
npm test -- --testPathPattern="parser"
```

---

## Aplicación

Cargar este skill al:
- Escribir tests
- Verificar cobertura
- Mockear dependencias