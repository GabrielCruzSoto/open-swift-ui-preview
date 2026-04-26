# Parser Design

## Objetivo

Documentar el diseño del lexer y parser de SwiftUI para OpenSUI.

---

## Arquitectura del Parser

```
┌─────────────────────────────────────────────────┐
│                    INPUT                         │
│              Código fuente SwiftUI                │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                    LEXER                        │
│  Convierte string en secuencia de Tokens        │
│                                                   │
│  source → [Token] → [Token] → [Token] → ...    │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                   PARSER                        │
│  Convierte tokens en AST                       │
│                                                   │
│  [Token] → SwiftUIComponentTree                │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                    OUTPUT                       │
│           SwiftUIComponentTree                  │
└─────────────────────────────────────────────────┘
```

---

## Tokenización

### Patrones de Tokens

```typescript
const TOKEN_PATTERNS = [
  // Comentarios
  { type: TokenType.COMMENT, pattern: /^(\/\/.*|\/\*[\s\S]*?\*\/)/ },

  // Strings
  { type: TokenType.STRING, pattern: /^"([^"\\]|\\.)*"/ },

  // Numbers
  { type: TokenType.NUMBER, pattern: /^-?\d+(\.\d+)?/ },

  // Componentes SwiftUI (orden de especificidad)
  { type: TokenType.VSTACK, pattern: /^VStack\b/ },
  { type: TokenType.HSTACK, pattern: /^HStack\b/ },
  // ...
];
```

### Position Tracking

```typescript
interface Token {
  type: TokenType;
  value: string;
  line: number;      // Línea actual
  column: number;    // Columna actual
  startIndex: number;
  endIndex: number;
}
```

---

## Parsing

### Gramática Simplificada

```
view        ::= 'struct' identifier ':' 'View' '{' content '}'
content     ::= (component | modifier)*
component  ::= container | simple
container  ::= 'VStack' args? '{' content '}'
              | 'HStack' args? '{' content '}'
              | 'ZStack' args? '{' content '}'
simple     ::= 'Text' args
              | 'Button' args
              | 'Image' args
args       ::= '(' (kv (',' kv)*)? ')'
kv         ::= identifier ':' value
modifier   ::= '.' identifier args?
value      ::= string | number | identifier
```

### Construcción del AST

```typescript
interface SwiftUIComponent {
  type: ComponentType;
  props: ComponentProperties;
  children: SwiftUIComponent[];
  modifiers: Modifier[];
}
```

---

## Manejo de Errores

### Errores Léxicos

```typescript
// Carácter desconocido → token UNKNOWN
// Continuar tokenización, marcar error
if (token.type === TokenType.UNKNOWN) {
  errors.push({ type: 'unknown_char', value: char });
}
```

### Errores Sintácticos

```typescript
// Token inesperado
if (!this.check(expected)) {
  this.errors.push({
    expected,
    found: this.current().type,
    position: this.current().startIndex,
  });
}
```

---

## Optimizaciones

### Memoización

```typescript
class Parser {
  private cache = new Map<string, SwiftUIComponentTree>();

  parse(sourceCode: string): SwiftUIComponentTree {
    const cached = this.cache.get(sourceCode);
    if (cached) return cached;

    const result = this.doParse(sourceCode);
    this.cache.set(sourceCode, result);
    return result;
  }
}
```

### Depth Tracking

```typescript
const MAX_DEPTH = 10;

private parseComponent(depth: number): SwiftUIComponent {
  if (depth > MAX_DEPTH) {
    throw new Error('Maximum nesting depth exceeded');
  }
  // ...
}
```

---

## Aplicación

Cargar este skill al:
- Implementar lexer
- Implementar parser
- Debug parser errors