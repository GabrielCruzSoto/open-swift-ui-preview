# Parser Development Skill

**Purpose**: Guide the development of the SwiftUI parser engine for OpenSUI

## Overview

This skill provides specialized knowledge for implementing the SwiftUI parser that analyzes Swift source code and extracts UI component structures. The parser is a critical component that converts SwiftUI code into a structured component tree for rendering.

## Key Concepts

### Lexer Implementation
- Tokenize Swift source code using regex patterns
- Support Swift-specific tokens (keywords, operators, literals)
- Track line and column numbers for error reporting
- Handle string interpolation and comments

### Parser Implementation
- Use recursive descent parsing for clarity
- Build Abstract Syntax Tree (AST) from tokens
- Support Swift grammar relevant to SwiftUI
- Implement error recovery for robustness

### SwiftUI Analysis
- Identify structs conforming to `View` protocol
- Locate `body` property returning `some View`
- Extract SwiftUI component hierarchy
- Map AST nodes to SwiftUI component types
- Handle modifier chains (`.padding()`, `.background()`, etc.)

### Component Tree Construction
- Build hierarchical component structure
- Extract component properties
- Preserve source location for debugging
- Validate against supported component list

## Supported Components

**Layout**: VStack, HStack, ZStack, Spacer
**Text**: Text
**Controls**: Button, Toggle, Slider, TextField, Picker
**Containers**: List, ScrollView, NavigationStack, TabView
**Multimedia**: Image
**Structure**: Divider

## Implementation Guidelines

### File Structure
```
src/parser/
├── lexer.ts
├── parser.ts
├── swiftUIAnalyzer.ts
├── componentTreeBuilder.ts
└── types.ts
```

### Type Definitions
Define clear TypeScript interfaces for:
- Token types and structure
- AST node types
- Component tree structure
- Property maps

### Error Handling
- Provide descriptive error messages with file, line, column
- Implement error recovery to continue parsing
- Log errors for debugging
- Gracefully handle unknown components

### Performance
- Target < 1s parse time for files < 500 lines
- Implement incremental parsing for large files
- Cache tokens for unchanged files
- Consider worker threads for parallel processing

## Testing Requirements

### Unit Tests
- Lexer: Tokenization of various Swift constructs
- Parser: AST generation for valid/invalid code
- Analyzer: Component detection and extraction
- Builder: Tree construction and validation

### Test Coverage
- Target ≥ 80% coverage
- Include edge cases (empty files, malformed code)
- Test with real SwiftUI code examples

### Test Files
```
tests/parser/
├── lexer.test.ts
├── parser.test.ts
├── swiftUIAnalyzer.test.ts
└── componentTreeBuilder.test.ts
```

## Common Patterns

### Token Definition
```typescript
enum TokenType {
  KEYWORD = 'KEYWORD',
  IDENTIFIER = 'IDENTIFIER',
  LITERAL = 'LITERAL',
  OPERATOR = 'OPERATOR',
  // ... more types
}
```

### AST Node
```typescript
interface ASTNode {
  type: string;
  children?: ASTNode[];
  value?: any;
  line?: number;
  column?: number;
}
```

### Component Tree
```typescript
interface SwiftUIComponent {
  type: string;
  properties: Record<string, any>;
  modifiers: Modifier[];
  children: SwiftUIComponent[];
  sourceLocation: { line: number; column: number };
}
```

## References

- Context: `Context/architecture.md` - Parser engine architecture
- Design: `docs/design-parser.md` - Detailed parser design
- Requirements: `Context/requirements-summary.md` - RF-002, RF-003

## Quality Checklist

- [ ] Lexer correctly tokenizes all Swift constructs
- [ ] Parser builds valid AST for supported Swift syntax
- [ ] SwiftUI analyzer correctly identifies View conforming structs
- [ ] Component tree accurately represents SwiftUI hierarchy
- [ ] Property extraction handles literals, enums, and expressions
- [ ] Error messages include file, line, and column information
- [ ] Performance targets met (< 1s for 500-line files)
- [ ] Test coverage ≥ 80%
- [ ] All tests pass
- [ ] Code follows project style guidelines (single quotes, no semicolons)
