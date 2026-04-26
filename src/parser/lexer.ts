import { Token, TokenType } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// Keyword → TokenType mapping
// ─────────────────────────────────────────────────────────────────────────────

const KEYWORDS: Record<string, TokenType> = {
  struct: TokenType.STRUCT,
  var: TokenType.VAR,
  let: TokenType.LET,
  func: TokenType.FUNC,
  return: TokenType.RETURN,
  if: TokenType.IF,
  else: TokenType.ELSE,
  some: TokenType.SOME,
  View: TokenType.VIEW,
  body: TokenType.BODY,
  true: TokenType.BOOL_LITERAL,
  false: TokenType.BOOL_LITERAL,
  // SwiftUI components
  VStack: TokenType.VSTACK,
  HStack: TokenType.HSTACK,
  ZStack: TokenType.ZSTACK,
  Spacer: TokenType.SPACER,
  Text: TokenType.TEXT,
  Button: TokenType.BUTTON,
  Toggle: TokenType.TOGGLE,
  Slider: TokenType.SLIDER,
  TextField: TokenType.TEXTFIELD,
  Picker: TokenType.PICKER,
  List: TokenType.LIST,
  ScrollView: TokenType.SCROLLVIEW,
  NavigationStack: TokenType.NAVIGATIONSTACK,
  TabView: TokenType.TABVIEW,
  Image: TokenType.IMAGE,
  Divider: TokenType.DIVIDER,
}

// ─────────────────────────────────────────────────────────────────────────────
// Lexer
// ─────────────────────────────────────────────────────────────────────────────

/** Converts raw SwiftUI source code into a flat list of Tokens. */
export class Lexer {
  private readonly source: string
  private position: number = 0
  private line: number = 1
  private column: number = 1
  private readonly tokens: Token[] = []

  constructor(source: string) {
    this.source = source
  }

  /** Tokenise the entire source and return all tokens. */
  tokenize(): Token[] {
    while (this.position < this.source.length) {
      this.skipWhitespaceAndComments()
      if (this.position >= this.source.length) {break}

      const token = this.nextToken()
      if (token) {
        this.tokens.push(token)
      }
    }

    this.tokens.push(this.makeToken(TokenType.EOF, '', this.position, this.position))
    return this.tokens
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private nextToken(): Token | null {
    const start = this.position
    const ch = this.source[this.position]

    // Newline
    if (ch === '\n') {
      const tok = this.makeToken(TokenType.NEWLINE, '\n', start, start + 1)
      this.advance()
      this.line++
      this.column = 1
      return tok
    }

    // String literal
    if (ch === '"') {return this.readString()}

    // Number literal
    if (this.isDigit(ch)) {return this.readNumber()}

    // Identifier / keyword
    if (this.isIdentStart(ch)) {return this.readIdentifier()}

    // Two-character operators
    if (ch === '-' && this.peek() === '>') {return this.readFixed(TokenType.ARROW, '->', 2)}
    if (ch === '.' && this.peek() === '.' && this.source[this.position + 2] === '.') {
      return this.readFixed(TokenType.ELLIPSIS, '...', 3)
    }

    // Single-character tokens
    const singleMap: Record<string, TokenType> = {
      ':': TokenType.COLON,
      '.': TokenType.DOT,
      ',': TokenType.COMMA,
      '=': TokenType.EQUALS,
      '(': TokenType.LPAREN,
      ')': TokenType.RPAREN,
      '{': TokenType.LBRACE,
      '}': TokenType.RBRACE,
      '[': TokenType.LBRACKET,
      ']': TokenType.RBRACKET,
      '@': TokenType.AT,
      '$': TokenType.DOLLAR,
    }

    if (ch in singleMap) {
      const tok = this.makeToken(singleMap[ch], ch, start, start + 1)
      this.advance()
      return tok
    }

    // Unknown character – skip and report
    const tok = this.makeToken(TokenType.UNKNOWN, ch, start, start + 1)
    this.advance()
    return tok
  }

  // ── Readers ────────────────────────────────────────────────────────────────

  private readString(): Token {
    const start = this.position
    this.advance() // consume opening "
    let value = ''

    while (this.position < this.source.length && this.source[this.position] !== '"') {
      if (this.source[this.position] === '\\') {
        this.advance()
        const escaped = this.source[this.position]
        const escapeMap: Record<string, string> = {
          n: '\n', t: '\t', r: '\r', '"': '"', '\\': '\\',
        }
        value += escapeMap[escaped] ?? escaped
      } else {
        value += this.source[this.position]
      }
      this.advance()
    }

    this.advance() // consume closing "
    return this.makeToken(TokenType.STRING_LITERAL, value, start, this.position)
  }

  private readNumber(): Token {
    const start = this.position
    let value = ''

    while (this.position < this.source.length &&
      (this.isDigit(this.source[this.position]) || this.source[this.position] === '.')) {
      value += this.source[this.position]
      this.advance()
    }

    return this.makeToken(TokenType.NUMBER_LITERAL, value, start, this.position)
  }

  private readIdentifier(): Token {
    const start = this.position
    let value = ''

    while (this.position < this.source.length && this.isIdentPart(this.source[this.position])) {
      value += this.source[this.position]
      this.advance()
    }

    const tokenType = KEYWORDS[value] ?? TokenType.IDENTIFIER
    return this.makeToken(tokenType, value, start, this.position)
  }

  private readFixed(type: TokenType, value: string, length: number): Token {
    const start = this.position
    for (let i = 0; i < length; i++) {this.advance()}
    return this.makeToken(type, value, start, this.position)
  }

  // ── Comment & whitespace skipping ─────────────────────────────────────────

  private skipWhitespaceAndComments(): void {
    while (this.position < this.source.length) {
      const ch = this.source[this.position]

      // Horizontal whitespace only (newline is a token)
      if (ch === ' ' || ch === '\t' || ch === '\r') {
        this.advance()
        continue
      }

      // Single-line comment
      if (ch === '/' && this.peek() === '/') {
        while (this.position < this.source.length && this.source[this.position] !== '\n') {
          this.advance()
        }
        continue
      }

      // Multi-line comment
      if (ch === '/' && this.peek() === '*') {
        this.advance(); this.advance()
        while (this.position < this.source.length) {
          if (this.source[this.position] === '*' && this.peek() === '/') {
            this.advance(); this.advance()
            break
          }
          if (this.source[this.position] === '\n') { this.line++; this.column = 1 }
          this.advance()
        }
        continue
      }

      break
    }
  }

  // ── Utilities ──────────────────────────────────────────────────────────────

  private advance(): void {
    this.position++
    this.column++
  }

  private peek(): string {
    return this.position + 1 < this.source.length ? this.source[this.position + 1] : ''
  }

  private isDigit(ch: string): boolean {
    return ch >= '0' && ch <= '9'
  }

  private isIdentStart(ch: string): boolean {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_'
  }

  private isIdentPart(ch: string): boolean {
    return this.isIdentStart(ch) || this.isDigit(ch)
  }

  private makeToken(type: TokenType, value: string, start: number, end: number): Token {
    return { type, value, line: this.line, column: this.column, startIndex: start, endIndex: end }
  }
}
