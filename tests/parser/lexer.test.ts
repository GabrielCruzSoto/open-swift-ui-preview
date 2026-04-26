import { Lexer } from '../../src/parser/lexer'
import { TokenType } from '../../src/parser/types'

describe('Lexer', () => {
  it('tokenizes keywords and SwiftUI components', () => {
    const lexer = new Lexer('struct VStack Text true false')
    const tokens = lexer.tokenize()
    expect(tokens.length).toBe(6) // 5 tokens + EOF
    expect(tokens[0].type).toBe(TokenType.STRUCT)
    expect(tokens[1].type).toBe(TokenType.VSTACK)
    expect(tokens[2].type).toBe(TokenType.TEXT)
    expect(tokens[3].type).toBe(TokenType.BOOL_LITERAL)
    expect(tokens[4].type).toBe(TokenType.BOOL_LITERAL)
    expect(tokens[5].type).toBe(TokenType.EOF)
  })

  it('tokenizes punctuation and operators', () => {
    const lexer = new Lexer('(),.{}:=$')
    const tokens = lexer.tokenize()
    const expected = [
      TokenType.LPAREN, TokenType.RPAREN, TokenType.COMMA, TokenType.DOT,
      TokenType.LBRACE, TokenType.RBRACE, TokenType.COLON, TokenType.EQUALS,
      TokenType.DOLLAR, TokenType.EOF,
    ]
    expect(tokens.map((t) => t.type)).toEqual(expected)
  })

  it('tokenizes composite operators', () => {
    const lexer = new Lexer('-> ...')
    const tokens = lexer.tokenize()
    expect(tokens[0].type).toBe(TokenType.ARROW)
    expect(tokens[1].type).toBe(TokenType.ELLIPSIS)
  })

  it('tokenizes string literals with escapes', () => {
    const source = '"Hello \\n \\"World\\""'
    const lexer = new Lexer(source)
    const tokens = lexer.tokenize()
    expect(tokens[0].type).toBe(TokenType.STRING_LITERAL)
    expect(tokens[0].value).toBe('Hello \n "World"')
  })

  it('tokenizes number literals', () => {
    const lexer = new Lexer('42 3.14')
    const tokens = lexer.tokenize()
    expect(tokens[0].type).toBe(TokenType.NUMBER_LITERAL)
    expect(tokens[0].value).toBe('42')
    expect(tokens[1].type).toBe(TokenType.NUMBER_LITERAL)
    expect(tokens[1].value).toBe('3.14')
  })

  it('skips comments and whitespace', () => {
    const source = `
      // Single line comment
      let x = 1
      /*
        Multi-line comment
      */
      let y = 2
    `
    const lexer = new Lexer(source)
    const tokens = lexer.tokenize()
    // It captures NEWLINE tokens as well. Let's filter them out for this spec to make it simpler
    const nonNewlines = tokens.filter((t) => t.type !== TokenType.NEWLINE)
    expect(nonNewlines.map((t) => t.type)).toEqual([
      TokenType.LET, TokenType.IDENTIFIER, TokenType.EQUALS, TokenType.NUMBER_LITERAL,
      TokenType.LET, TokenType.IDENTIFIER, TokenType.EQUALS, TokenType.NUMBER_LITERAL,
      TokenType.EOF,
    ])
  })

  it('tracks line and column correctly', () => {
    const source = 'let x\n  var y'
    const lexer = new Lexer(source)
    const tokens = lexer.tokenize()
    
    // let
    expect(tokens[0].line).toBe(1)
    expect(tokens[0].column).toBe(4) // after reading 'let', it's length 3 + 1
    
    // x
    expect(tokens[1].line).toBe(1)
    expect(tokens[1].column).toBe(6)

    // \n
    expect(tokens[2].type).toBe(TokenType.NEWLINE)
    expect(tokens[2].line).toBe(1)
    expect(tokens[2].column).toBe(6)

    // var
    expect(tokens[3].line).toBe(2)
    expect(tokens[3].column).toBe(6) // 3 spaces/chars
  })

  it('handles unknown characters gracefully', () => {
    const lexer = new Lexer('^')
    const tokens = lexer.tokenize()
    expect(tokens[0].type).toBe(TokenType.UNKNOWN)
    expect(tokens[0].value).toBe('^')
  })
})
