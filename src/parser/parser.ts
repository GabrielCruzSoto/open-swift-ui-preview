import {
  ASTNode,
  ASTNodeType,
  Token,
  TokenType,
  ParseError,
} from './types'

// ─────────────────────────────────────────────────────────────────────────────
// Recursive-descent Parser
// ─────────────────────────────────────────────────────────────────────────────

/** Builds an AST from a flat token stream produced by the Lexer. */
export class Parser {
  private readonly tokens: Token[]
  private position: number = 0
  readonly errors: ParseError[] = []

  constructor(tokens: Token[]) {
    // Strip newlines – they are not semantically significant for our grammar
    this.tokens = tokens.filter((t) => t.type !== TokenType.NEWLINE)
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Parse all tokens and return a Program ASTNode. */
  parse(): ASTNode {
    const children: ASTNode[] = []

    while (!this.isAtEnd()) {
      const node = this.parseTopLevel()
      if (node) {children.push(node)}
    }

    return { type: 'Program', children }
  }

  // ── Top-level ──────────────────────────────────────────────────────────────

  private parseTopLevel(): ASTNode | null {
    const tok = this.current()

    if (tok.type === TokenType.STRUCT) {return this.parseStructDecl()}
    if (tok.type === TokenType.VAR || tok.type === TokenType.LET) {return this.parsePropertyDecl()}
    if (tok.type === TokenType.FUNC) {return this.parseFuncDecl()}

    // Unknown top-level token – skip to recover
    this.advance()
    return null
  }

  // ── Struct declaration ─────────────────────────────────────────────────────

  private parseStructDecl(): ASTNode {
    const tok = this.consume(TokenType.STRUCT)
    const nameTok = this.consume(TokenType.IDENTIFIER)
    const name = nameTok.value

    // Optional conformances: `: View`
    if (this.match(TokenType.COLON)) {
      this.advance() // :
      if (this.current().type === TokenType.VIEW || this.current().type === TokenType.IDENTIFIER) {
        this.advance()
      }
    }

    const body = this.parseBlock()
    return {
      type: 'StructDecl',
      name,
      line: tok.line,
      column: tok.column,
      children: body,
    }
  }

  // ── Property declaration ───────────────────────────────────────────────────

  private parsePropertyDecl(): ASTNode {
    const tok = this.current()
    this.advance() // var / let

    let name = 'unknown'
    if (this.match(TokenType.IDENTIFIER) || this.current().type === TokenType.BODY) {
      name = this.current().value
      this.advance()
    }

    // Optional type annotation: `: Type`
    if (this.match(TokenType.COLON)) {
      this.advance() // :
      // Skip until { or = or EOF
      while (!this.isAtEnd() && !this.match(TokenType.LBRACE) && !this.match(TokenType.EQUALS)) {
        this.advance()
      }
    }

    // Optional body block
    let children: ASTNode[] | undefined
    if (this.match(TokenType.LBRACE)) {
      children = this.parseBlock()
    } else if (this.match(TokenType.EQUALS)) {
      this.advance()
      const expr = this.parseExpression()
      children = expr ? [expr] : undefined
    }

    return { type: 'PropertyDecl', name, line: tok.line, column: tok.column, children }
  }

  // ── Function declaration ───────────────────────────────────────────────────

  private parseFuncDecl(): ASTNode {
    const tok = this.consume(TokenType.FUNC)
    const nameTok = this.consume(TokenType.IDENTIFIER)
    const name = nameTok.value

    // Skip parameter list (simplified)
    if (this.match(TokenType.LPAREN)) {
      this.skipBalanced(TokenType.LPAREN, TokenType.RPAREN)
    }

    // Optional return type -> Type
    if (this.match(TokenType.ARROW)) {
      this.advance()
      this.advance() // skip return type
    }

    const body = this.match(TokenType.LBRACE) ? this.parseBlock() : []
    return { type: 'FuncDecl', name, line: tok.line, column: tok.column, children: body }
  }

  // ── Block `{ ... }` ────────────────────────────────────────────────────────

  private parseBlock(): ASTNode[] {
    const children: ASTNode[] = []
    if (!this.match(TokenType.LBRACE)) {return children}

    this.advance() // consume {

    while (!this.isAtEnd() && !this.match(TokenType.RBRACE)) {
      const node = this.parseStatement()
      if (node) {children.push(node)}
    }

    if (this.match(TokenType.RBRACE)) {this.advance()} // consume }

    return children
  }

  // ── Statements ─────────────────────────────────────────────────────────────

  private parseStatement(): ASTNode | null {
    const tok = this.current()

    if (tok.type === TokenType.STRUCT) {return this.parseStructDecl()}
    if (tok.type === TokenType.VAR || tok.type === TokenType.LET) {return this.parsePropertyDecl()}
    if (tok.type === TokenType.FUNC) {return this.parseFuncDecl()}

    return this.parseExpression()
  }

  // ── Expressions ────────────────────────────────────────────────────────────

  private parseExpression(): ASTNode | null {
    let node = this.parsePrimary()
    if (!node) {return null}

    // Modifier chain: expr.modifier1().modifier2()
    while (this.match(TokenType.DOT)) {
      this.advance() // consume .
      const memberName = this.current().value
      const memberTok = this.current()
      this.advance()

      if (this.match(TokenType.LPAREN)) {
        const args = this.parseArguments()
        node = {
          type: 'ModifierExpr',
          name: memberName,
          line: memberTok.line,
          column: memberTok.column,
          children: node ? [node, ...args] : args,
        }
      } else {
        node = {
          type: 'MemberExpr',
          name: memberName,
          line: memberTok.line,
          column: memberTok.column,
          children: node ? [node] : [],
        }
      }
    }

    // Trailing closure: expr { ... }
    if (this.match(TokenType.LBRACE)) {
      const closure = this.parseClosure()
      return {
        type: 'CallExpr',
        name: (node as ASTNode & { name?: string }).name,
        line: node.line,
        column: node.column,
        children: [node, closure],
      }
    }

    return node
  }

  private parsePrimary(): ASTNode | null {
    const tok = this.current()

    // Literals
    if (tok.type === TokenType.STRING_LITERAL) {
      this.advance()
      return { type: 'Literal', value: tok.value, line: tok.line, column: tok.column }
    }
    if (tok.type === TokenType.NUMBER_LITERAL) {
      this.advance()
      return { type: 'Literal', value: parseFloat(tok.value), line: tok.line, column: tok.column }
    }
    if (tok.type === TokenType.BOOL_LITERAL) {
      this.advance()
      return { type: 'Literal', value: tok.value === 'true', line: tok.line, column: tok.column }
    }

    // Identifiers and call expressions (including SwiftUI components)
    if (this.isIdentifierLike(tok.type)) {
      this.advance()
      const name = tok.value

      if (this.match(TokenType.LPAREN)) {
        const args = this.parseArguments()
        let children = args

        // Trailing closure directly after ()
        if (this.match(TokenType.LBRACE)) {
          children = [...args, this.parseClosure()]
        }

        return { type: 'CallExpr', name, line: tok.line, column: tok.column, children }
      }

      // Trailing closure without () (e.g. HStack { ... })
      if (this.match(TokenType.LBRACE)) {
        return { type: 'CallExpr', name, line: tok.line, column: tok.column, children: [this.parseClosure()] }
      }

      return { type: 'Identifier', name, line: tok.line, column: tok.column }
    }

    // $ binding reference
    if (tok.type === TokenType.DOLLAR) {
      this.advance()
      const bindingName = this.current().value
      this.advance()
      return { type: 'Identifier', name: `$${bindingName}`, line: tok.line, column: tok.column }
    }

    // Dot enum value: .someCase
    if (tok.type === TokenType.DOT) {
      this.advance()
      const memberName = this.current().value
      this.advance()
      return { type: 'MemberExpr', name: `.${memberName}`, line: tok.line, column: tok.column }
    }

    // Closure expression
    if (tok.type === TokenType.LBRACE) {
      return this.parseClosure()
    }

    // Fallthrough – skip unknown token and recover
    if (!this.match(TokenType.RBRACE) && !this.match(TokenType.EOF)) {
      this.advance()
    }
    return null
  }

  // ── Argument list `( ... )` ────────────────────────────────────────────────

  private parseArguments(): ASTNode[] {
    const args: ASTNode[] = []
    this.advance() // consume (

    while (!this.isAtEnd() && !this.match(TokenType.RPAREN)) {
      const positionBefore = this.position

      // Labelled argument: `label: value`
      if (
        this.isIdentifierLike(this.current().type) &&
        this.peek()?.type === TokenType.COLON
      ) {
        const labelTok = this.current()
        this.advance() // label
        this.advance() // :
        const val = this.parseExpression()
        if (val) {
          args.push({
            type: 'BinaryExpr',
            name: labelTok.value,
            line: labelTok.line,
            column: labelTok.column,
            children: [val],
          })
        }
      } else {
        const val = this.parseExpression()
        if (val) {args.push(val)}
      }

      if (this.match(TokenType.COMMA)) {
        this.advance()
      } else if (this.position === positionBefore) {
        // Prevent infinite loop if parser cannot progress
        this.advance()
      }
    }

    if (this.match(TokenType.RPAREN)) {this.advance()} // consume )
    return args
  }

  // ── Closure `{ ... }` ─────────────────────────────────────────────────────

  private parseClosure(): ASTNode {
    const tok = this.current()
    const body = this.parseBlock()
    return { type: 'ClosureExpr', line: tok.line, column: tok.column, children: body }
  }

  // ── Utilities ──────────────────────────────────────────────────────────────

  private current(): Token {
    return this.tokens[this.position] ?? { type: TokenType.EOF, value: '', line: 0, column: 0, startIndex: 0, endIndex: 0 }
  }

  private peek(): Token | null {
    return this.tokens[this.position + 1] ?? null
  }

  private advance(): Token {
    const tok = this.current()
    if (!this.isAtEnd()) {this.position++}
    return tok
  }

  private match(type: TokenType): boolean {
    return this.current().type === type
  }

  private consume(type: TokenType): Token {
    if (!this.match(type)) {
      const tok = this.current()
      this.errors.push({
        message: `Expected ${type} but found ${tok.type} ("${tok.value}")`,
        line: tok.line,
        column: tok.column,
        severity: 'error',
      })
    }
    return this.advance()
  }

  private isAtEnd(): boolean {
    return this.current().type === TokenType.EOF
  }

  private isIdentifierLike(type: TokenType): boolean {
    const identLike: Set<TokenType> = new Set([
      TokenType.IDENTIFIER, TokenType.VIEW, TokenType.BODY, TokenType.SOME,
      TokenType.VSTACK, TokenType.HSTACK, TokenType.ZSTACK, TokenType.SPACER,
      TokenType.TEXT, TokenType.BUTTON, TokenType.TOGGLE, TokenType.SLIDER,
      TokenType.TEXTFIELD, TokenType.PICKER, TokenType.LIST, TokenType.SCROLLVIEW,
      TokenType.NAVIGATIONSTACK, TokenType.TABVIEW, TokenType.IMAGE, TokenType.DIVIDER,
    ] as TokenType[])
    return identLike.has(type)
  }

  /** Skip balanced bracket pairs for error recovery. */
  private skipBalanced(open: TokenType, close: TokenType): void {
    let depth = 0
    while (!this.isAtEnd()) {
      if (this.match(open)) {depth++}
      else if (this.match(close)) { depth--; if (depth === 0) { this.advance(); return } }
      this.advance()
    }
  }

  // Suppress TS "unused" warning for ASTNodeType import
  private _typeCheck: ASTNodeType = 'Program'
}
