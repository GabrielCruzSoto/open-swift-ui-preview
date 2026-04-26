# [PROMPT] Fase 2 — Motor de Parsing

> Versión: 1.0 | Proyecto: OpenSUI

---

## CONTEXTO (C)

Eres un Ingeniero de Software TypeScript trabajando en **OpenSUI**, una extensión VS Code para previsualización de vistas SwiftUI.

**Referencias obligatorias que debes leer antes de comenzar:**
- `docs/[DESIGN] OpenSUI - Diseno de la Solucion.md` — Secciones: 2 (Lexer), 3 (Parser)
- `docs/[PLAN] OpenSUI - Plan de Trabajo.md` — Fase 2: Motor de Parsing

**Estado del repositorio al inicio de esta fase:**
- Fases completadas: Fase 1 (Fundamentos)
- Archivos existentes relevantes: `src/main.ts`, `src/parser/index.ts`, `src/renderer/index.ts`, `src/vscode/index.ts`

---

## OBJETIVO (O)

Al finalizar esta fase, el repositorio debe contener:

**Código fuente:**
- [ ] `src/parser/types.ts` — Token y tipos de AST
- [ ] `src/parser/lexer.ts` — Implementación del Lexer
- [ ] `src/parser/parser.ts` — Implementación del Parser
- [ ] `src/parser/swiftui-parser.ts` — Fachada de alto nivel

**Tests:**
- [ ] `tests/parser/lexer.test.ts` — Tests del lexer (cobertura ≥ 80%)
- [ ] `tests/parser/parser.test.ts` — Tests del parser (cobertura ≥ 80%)
- [ ] `tests/parser/fixtures/` — Archivos SwiftUI de prueba

**Documentación:**
- [ ] `CHANGELOG.md` actualizado

---

## RESTRICCIONES (R)

**De código:**
- ✅ TypeScript estricto (`strict: true`)
- ✅ Todos los componentes del SPEC-002 reconocidos
- ❌ No duplicar lógica entre lexer y parser

**De commits:**
- ✅ Formato Conventional Commits
- Ejemplo: `feat(parser): add Lexer with tokenization`

---

## EJECUCIÓN (E)

### Paso 1 — Implementar tipos del Lexer

Crear `src/parser/types.ts`:
```typescript
export enum TokenType {
  STRUCT = 'STRUCT',
  VSTACK = 'VSTACK',
  HSTACK = 'HSTACK',
  TEXT = 'TEXT',
  // ... todos los TokenType del DESIGN
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  startIndex: number;
  endIndex: number;
}
```

### Paso 2 — Implementar Lexer

Crear `src/parser/lexer.ts`:

```typescript
import { Token, TokenType } from './types';

const TOKEN_PATTERNS = [/* ... regex patterns del DESIGN */];

export class Lexer {
  private source: string;
  private position: number;
  // ...
  
  tokenize(): Token[] { /* ... */ }
  private nextToken(): Token | null { /* ... */ }
}
```

### Paso 3 — Implementar Parser

Crear `src/parser/parser.ts`:

```typescript
import { SwiftUIComponentTree, SwiftUIComponent, ComponentType } from './types';

export class Parser {
  private tokens: Token[];
  // ...
  
  parse(): SwiftUIComponentTree { /* ... */ }
  private parseViewDeclaration(): SwiftUIComponent { /* ... */ }
  private parseComponent(): SwiftUIComponent | null { /* ... */ }
  private parseArguments(): ComponentProperties { /* ... */ }
  private parseModifiers(): Modifier[] { /* ... */ }
}
```

### Paso 4 — Implementar SwiftUIParser facade

Crear `src/parser/swiftui-parser.ts`:

```typescript
import { Lexer } from './lexer';
import { Parser } from './parser';

export class SwiftUIParser {
  parse(sourceCode: string): SwiftUIComponentTree {
    const lexer = new Lexer(sourceCode);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    return parser.parse();
  }
  
  isSwiftUIFile(sourceCode: string): boolean {
    return sourceCode.includes(': View');
  }
}
```

### Paso 5 — Escribir tests

Implementar tests en `tests/parser/lexer.test.ts` y `tests/parser/parser.test.ts`.

### Paso 6 — Crear fixtures

Crear archivos SwiftUI de prueba en `tests/parser/fixtures/`.

### Paso 7 — Run y verify

```bash
npm run test -- --testPathPattern="tests/parser"
npm run test:coverage
```

### Paso 8 — Update CHANGELOG, commit y push

```bash
git add .
git commit -m "feat(parser): add Lexer and Parser implementation"
git push origin fase-2-motor-de-parsing
```

---

## CRITERIOS DE ACEPTACIÓN DE LA FASE

| # | Criterio | Comando |
|---|----------|--------|
| 1 | Compilación sin errores | `tsc --noEmit` |
| 2 | Tests del lexer pasan | `npm test -- lexer` |
| 3 | Tests del parser pasan | `npm test -- parser` |
| 4 | Coverage ≥ 80% | `npm run test:coverage` |
| 5 | Reconoce componentes del SPEC | Test manual |

---

**Fin del prompt**