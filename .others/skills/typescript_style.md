# TypeScript Style Guide

## Objetivo

Establecer reglas de tipado strict para el proyecto OpenSUI.

---

## Configuración Required

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

---

## Reglas de Tipado

### NO any

```typescript
// ❌ BAD
function parse(source: any) {
  return source.toString();
}

// ✅ GOOD
function parse(source: string): string {
  return source;
}
```

### Explicit return types

```typescript
// ✅ GOOD
function tokenize(source: string): Token[] {
  // ...
}

// ✅ GOOD
const parse = (source: string): SwiftUIComponentTree => {
  // ...
}
```

### Explicit types en propiedades

```typescript
// ✅ GOOD
export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(source: string) {
    this.source = source;
  }
}
```

---

## Utility Types

### Partial y Required

```typescript
// Para updates parciales
interface Update {
  name?: string;
  age?: number;
}

function updateUser(data: Partial<Update>): void {}

// Para.required properties
type Config = {
  name: string;
  age?: number;
};
```

### Record

```typescript
const deviceModels: Record<string, DeviceModel> = {
  iphone15: { /* ... */ },
  iphone16: { /* ... */ },
};
```

### Pick y Omit

```typescript
type ParserPublic = Pick<Parser, 'parse' | 'isSwiftUIFile'>;
type ParserInternal = Omit<Parser, 'parse'>;
```

---

## Generics

```typescript
// ✅ GOOD: Generic con constraint
function process<T extends SwiftUIComponent>(item: T): T {
  return item;
}

// ✅ GOOD: Generic con múltiples types
function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn);
}
```

---

## Prohibiciones

```typescript
// ❌ NO any
let value: any;

// ❌ NO implicit any en funciones
function process(x) {} // Must have: (x: SomeType)

// ❌ NO @ts-ignore sin justificación
// @ts-ignore: Reason why
```

---

## Aplicación

Cargar este skill al:
- Escribir código TypeScript
- Code review
- Verificar tipos