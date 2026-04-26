# Parser Design — OpenSUI

## Overview

The parser engine is responsible for analyzing SwiftUI source code and extracting a structured representation of the UI components. This document describes the design and implementation strategy for the parser.

## Architecture

```
Swift Source Code
       │
       ▼
   ┌─────────┐
   │  Lexer  │ → Tokens
   └─────────┘
       │
       ▼
   ┌─────────┐
   │ Parser  │ → AST
   └─────────┘
       │
       ▼
┌─────────────────┐
│ SwiftUI Analyzer│ → Component Tree
└─────────────────┘
```

## Components

### 1. Lexer (`lexer.ts`)

**Purpose**: Convert Swift source code into tokens

**Token Types**:
- Keywords: `struct`, `var`, `let`, `func`, `return`, `if`, `else`
- Identifiers: Variable names, function names, type names
- Literals: Strings, numbers, booleans
- Operators: `=`, `+`, `-`, `*`, `/`, `.`, `:`, `->`
- Punctuation: `(`, `)`, `{`, `}`, `[`, `]`, `,`, `;`
- SwiftUI-specific: `View`, `body`, `some`

**Design Decisions**:
- Use regex-based tokenization for simplicity
- Track line and column numbers for error reporting
- Handle Swift string interpolation (basic support)
- Ignore comments (single-line `//` and multi-line `/* */`)

**Interface**:
```typescript
interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

class Lexer {
  tokenize(source: string): Token[];
}
```

### 2. Parser (`parser.ts`)

**Purpose**: Build Abstract Syntax Tree (AST) from tokens

**Grammar Support**:
- Struct declarations
- Property declarations
- Function declarations
- Property wrappers (`@State`, `@Binding`)
- Closures
- Expression statements

**AST Node Types**:
```typescript
interface ASTNode {
  type: 'StructDecl' | 'PropertyDecl' | 'FuncDecl' | 'Identifier' | 'Literal' | 'CallExpr' | 'ClosureExpr';
  children?: ASTNode[];
  value?: any;
  line?: number;
}
```

**Design Decisions**:
- Recursive descent parser for clarity
- Error recovery to continue parsing after errors
- Focus on SwiftUI-relevant constructs only
- Simplified Swift grammar (not full Swift support)

**Interface**:
```typescript
class Parser {
  parse(tokens: Token[]): ASTNode;
}
```

### 3. SwiftUI Analyzer (`swiftUIAnalyzer.ts`)

**Purpose**: Identify SwiftUI components and extract their properties

**Detection Logic**:
1. Find structs conforming to `View` protocol
2. Locate `body` property returning `some View`
3. Analyze body expression for SwiftUI components
4. Extract component hierarchy and properties

**Component Recognition**:
- Map AST nodes to SwiftUI component types
- Identify component initializers
- Extract parameter values
- Handle modifier chains (`.padding()`, `.background()`, etc.)

**Interface**:
```typescript
interface ComponentInfo {
  type: string;
  properties: Map<string, any>;
  modifiers: Modifier[];
  children: ComponentInfo[];
}

class SwiftUIAnalyzer {
  analyze(ast: ASTNode): ComponentInfo | null;
  isSwiftUIView(ast: ASTNode): boolean;
}
```

### 4. Component Tree Builder (`componentTreeBuilder.ts`)

**Purpose**: Construct hierarchical component tree

**Tree Structure**:
```typescript
interface SwiftUIComponent {
  type: string;
  properties: Record<string, any>;
  modifiers: Modifier[];
  children: SwiftUIComponent[];
  sourceLocation: {
    line: number;
    column: number;
  };
}

interface Modifier {
  type: string;
  properties: Record<string, any>;
}
```

**Design Decisions**:
- Preserve source location for debugging
- Normalize property values (convert literals to appropriate types)
- Handle default values for missing properties
- Validate component types against supported list

**Interface**:
```typescript
class ComponentTreeBuilder {
  build(componentInfo: ComponentInfo): SwiftUIComponent;
  validate(component: SwiftUIComponent): boolean;
}
```

## Supported Components

### Layout Components

**VStack**
```swift
VStack(spacing: 16) {
  Text("Hello")
  Text("World")
}
```
Properties: `spacing`, `alignment`

**HStack**
```swift
HStack(spacing: 8) {
  Text("Left")
  Spacer()
  Text("Right")
}
```
Properties: `spacing`, `alignment`

**ZStack**
```swift
ZStack {
  Image("background")
  Text("Overlay")
}
```
Properties: `alignment`

**Spacer**
```swift
HStack {
  Text("Left")
  Spacer()
  Text("Right")
}
```
Properties: none

### Text Component

**Text**
```swift
Text("Hello World")
  .font(.title)
  .foregroundColor(.blue)
```
Properties: `text`, `font`, `foregroundColor`

### Control Components

**Button**
```swift
Button(action: { print("Clicked") }) {
  Text("Click me")
}
```
Properties: `label`, `action` (ignored for preview)

**Toggle**
```swift
Toggle(isOn: $isOn) {
  Text("Enable")
}
```
Properties: `isOn`, `label`

**Slider**
```swift
Slider(value: $value, in: 0...100)
```
Properties: `value`, `in` (range)

**TextField**
```swift
TextField("Placeholder", text: $text)
```
Properties: `placeholder`, `text`

**Picker**
```swift
Picker("Selection", selection: $selection) {
  Text("Option 1").tag(1)
  Text("Option 2").tag(2)
}
```
Properties: `label`, `selection`, `content`

### Container Components

**List**
```swift
List {
  Text("Item 1")
  Text("Item 2")
}
```
Properties: `content`

**ScrollView**
```swift
ScrollView {
  VStack {
    Text("Content")
  }
}
```
Properties: `content`, `axes`

**NavigationStack**
```swift
NavigationStack {
  Text("Root")
}
```
Properties: `root`

**TabView**
```swift
TabView {
  Text("Tab 1").tabItem { Text("1") }
  Text("Tab 2").tabItem { Text("2") }
}
```
Properties: `content`

### Multimedia

**Image**
```swift
Image("photo")
  .resizable()
  .aspectRatio(contentMode: .fit)
```
Properties: `name`, `resizable`, `aspectRatio`

### Structure

**Divider**
```swift
Divider()
```
Properties: none

## Property Extraction

### Literal Values
- String literals: `"text"` → string
- Number literals: `42`, `3.14` → number
- Boolean literals: `true`, `false` → boolean

### Enum Values
- SwiftUI enums: `.center`, `.title`, `.blue` → string representation
- Need enum mapping for common SwiftUI enums

### Expressions
- Variable references: `$variable` → string (binding name)
- Simple arithmetic: `10 + 5` → evaluate if possible
- Default to string representation for complex expressions

### Modifiers
- Parse modifier chains: `.modifier1().modifier2()`
- Extract modifier parameters
- Apply modifiers to parent component

## Error Handling

### Lexer Errors
- Invalid characters
- Unterminated strings
- Invalid escape sequences

### Parser Errors
- Unexpected tokens
- Mismatched brackets
- Incomplete expressions

### Analyzer Errors
- Unknown component types
- Invalid property values
- Malformed SwiftUI syntax

**Error Reporting**:
- Include file name, line, and column
- Provide descriptive error messages
- Attempt recovery to continue parsing
- Log errors for debugging

## Performance Considerations

### Optimization Strategies
1. **Incremental Parsing**: Only re-parse changed files
2. **Token Caching**: Cache tokens for unchanged files
3. **Lazy Analysis**: Only analyze when preview is requested
4. **Parallel Processing**: Use worker threads for large files

### Performance Targets
- Files < 100 lines: < 100ms
- Files < 500 lines: < 500ms
- Files < 1000 lines: < 1s

## Testing Strategy

### Unit Tests
- Lexer: Tokenization of various Swift constructs
- Parser: AST generation for valid/invalid code
- Analyzer: Component detection and extraction
- Builder: Tree construction and validation

### Integration Tests
- End-to-end parsing of sample SwiftUI files
- Component tree validation
- Property extraction accuracy

### Test Coverage
- Target: ≥ 80% coverage
- Include edge cases and error conditions
- Test with real SwiftUI code examples

## Future Enhancements

1. **Full Swift Grammar**: Expand to support more Swift features
2. **Property Wrappers**: Better support for `@State`, `@Binding`, etc.
3. **Custom Components**: Support for user-defined SwiftUI components
4. **Preview Macros**: Support for `#Preview` macros
5. **Type Inference**: Better type inference for complex expressions
