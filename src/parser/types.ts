// ─────────────────────────────────────────────────────────────────────────────
// Token types
// ─────────────────────────────────────────────────────────────────────────────

/** All token categories produced by the Lexer. */
export enum TokenType {
  // Swift keywords
  STRUCT = 'STRUCT',
  VAR = 'VAR',
  LET = 'LET',
  FUNC = 'FUNC',
  RETURN = 'RETURN',
  IF = 'IF',
  ELSE = 'ELSE',
  SOME = 'SOME',

  // SwiftUI view protocol markers
  VIEW = 'VIEW',
  BODY = 'BODY',

  // Layout components
  VSTACK = 'VSTACK',
  HSTACK = 'HSTACK',
  ZSTACK = 'ZSTACK',
  SPACER = 'SPACER',

  // Text component
  TEXT = 'TEXT',

  // Control components
  BUTTON = 'BUTTON',
  TOGGLE = 'TOGGLE',
  SLIDER = 'SLIDER',
  TEXTFIELD = 'TEXTFIELD',
  PICKER = 'PICKER',

  // Container components
  LIST = 'LIST',
  SCROLLVIEW = 'SCROLLVIEW',
  NAVIGATIONSTACK = 'NAVIGATIONSTACK',
  TABVIEW = 'TABVIEW',

  // Multimedia
  IMAGE = 'IMAGE',

  // Structure
  DIVIDER = 'DIVIDER',

  // Identifiers and literals
  IDENTIFIER = 'IDENTIFIER',
  STRING_LITERAL = 'STRING_LITERAL',
  NUMBER_LITERAL = 'NUMBER_LITERAL',
  BOOL_LITERAL = 'BOOL_LITERAL',

  // Operators & punctuation
  COLON = 'COLON',
  DOT = 'DOT',
  COMMA = 'COMMA',
  EQUALS = 'EQUALS',
  ARROW = 'ARROW',
  DOLLAR = 'DOLLAR',

  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  LBRACE = 'LBRACE',
  RBRACE = 'RBRACE',
  LBRACKET = 'LBRACKET',
  RBRACKET = 'RBRACKET',

  // Misc
  AT = 'AT',
  ELLIPSIS = 'ELLIPSIS',
  NEWLINE = 'NEWLINE',
  EOF = 'EOF',
  UNKNOWN = 'UNKNOWN',
}

/** A single token produced by the Lexer. */
export interface Token {
  type: TokenType
  value: string
  line: number
  column: number
  startIndex: number
  endIndex: number
}

// ─────────────────────────────────────────────────────────────────────────────
// AST node types
// ─────────────────────────────────────────────────────────────────────────────

export type ASTNodeType =
  | 'StructDecl'
  | 'PropertyDecl'
  | 'FuncDecl'
  | 'Identifier'
  | 'Literal'
  | 'CallExpr'
  | 'ClosureExpr'
  | 'ModifierExpr'
  | 'MemberExpr'
  | 'BinaryExpr'
  | 'Program'

/** A node in the Abstract Syntax Tree. */
export interface ASTNode {
  type: ASTNodeType
  children?: ASTNode[]
  value?: string | number | boolean | null
  name?: string
  line?: number
  column?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Component tree types
// ─────────────────────────────────────────────────────────────────────────────

/** A SwiftUI view modifier (e.g. `.padding()`, `.foregroundColor(.blue)`). */
export interface Modifier {
  type: string
  properties: Record<string, PropertyValue>
}

/** Accepted property value types. */
export type PropertyValue = string | number | boolean | null | PropertyValue[]

/** A node in the resolved SwiftUI component tree. */
export interface SwiftUIComponent {
  type: string
  properties: Record<string, PropertyValue>
  modifiers: Modifier[]
  children: SwiftUIComponent[]
  sourceLocation?: {
    line: number
    column: number
  }
}

/** The root of the parsed SwiftUI component tree. */
export interface SwiftUIComponentTree {
  root: SwiftUIComponent | null
  errors: ParseError[]
}

/** A parse / analysis error with location information. */
export interface ParseError {
  message: string
  line: number
  column: number
  severity: 'error' | 'warning'
}

/** Intermediate info produced by the SwiftUIAnalyzer. */
export interface ComponentInfo {
  type: string
  properties: Map<string, PropertyValue>
  modifiers: Modifier[]
  children: ComponentInfo[]
  line: number
  column: number
}
