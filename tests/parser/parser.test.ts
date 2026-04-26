import { Lexer } from '../../src/parser/lexer'
import { Parser } from '../../src/parser/parser'
import { SwiftUIParser } from '../../src/parser/swiftui-parser'

describe('Parser', () => {
  it('parses a basic StructDecl with a property', () => {
    const source = `
      struct ContentView: View {
        var body: some View {
          Text("Hello")
        }
      }
    `
    const lexer = new Lexer(source)
    const parser = new Parser(lexer.tokenize())
    const ast = parser.parse()

    expect(parser.errors).toHaveLength(0)
    expect(ast.type).toBe('Program')
    expect(ast.children).toBeDefined()
    expect(ast.children![0].type).toBe('StructDecl')
    expect(ast.children![0].name).toBe('ContentView')
  })

  it('handles invalid syntax with error recovery', () => {
    const source = `struct { }` // missing identifier
    const lexer = new Lexer(source)
    const parser = new Parser(lexer.tokenize())
    parser.parse()
    expect(parser.errors.length).toBeGreaterThan(0)
  })

  it('parses expressions and modifiers', () => {
    const source = `
      Text("Hello")
        .font(.title)
        .padding(16)
      $bindingVar
      true
      42
    `
    const lexer = new Lexer(source)
    const parser = new Parser(lexer.tokenize())
    const ast = parser.parse()
    expect(parser.errors).toHaveLength(0)
  })

  it('skips unknown top-level tokens', () => {
    const source = `unknown_token struct Foo {}`
    const parser = new Parser(new Lexer(source).tokenize())
    const ast = parser.parse()
    expect(ast.children).toBeDefined()
    expect(ast.children!.length).toBe(1)
  })

  it('handles function declaration with return type', () => {
    const source = `func myFunc() -> View { }`
    const parser = new Parser(new Lexer(source).tokenize())
    const ast = parser.parse()
    expect(ast.children![0].type).toBe('FuncDecl')
  })
})

describe('SwiftUIParser', () => {
  it('identifies SwiftUI files', () => {
    const parser = new SwiftUIParser()
    expect(parser.isSwiftUIFile('struct Foo: View {}')).toBe(true)
    expect(parser.isSwiftUIFile('#Preview { ContentView() }')).toBe(true)
    expect(parser.isSwiftUIFile('let x = 42')).toBe(false)
  })

  it('extracts SwiftUI component tree from valid source', () => {
    const source = `
      struct MyView: View {
        var body: some View {
          VStack(spacing: 16) {
            Text("Title")
              .bold()
            HStack {
              Spacer()
            }
          }
        }
      }
    `
    const parser = new SwiftUIParser()
    const tree = parser.parse(source)
    expect(tree.errors).toHaveLength(0)
    
    const root = tree.root
    expect(root).toBeDefined()
    expect(root?.type).toBe('VStack')
    expect(root?.properties['spacing']).toBe(16)
    
    // VStack children: Text, HStack
    expect(root?.children.length).toBe(2)
    expect(root?.children[0].type).toBe('Text')
    expect(root?.children[0].properties['content']).toBe('Title')
    expect(root?.children[0].modifiers.length).toBe(1)
    expect(root?.children[0].modifiers[0].type).toBe('bold')

    expect(root?.children[1].type).toBe('HStack')
    expect(root?.children[1].children.length).toBe(1)
    expect(root?.children[1].children[0].type).toBe('Spacer')
  })

  it('handles empty parse when no views found', () => {
    const parser = new SwiftUIParser()
    const tree = parser.parse(`struct Foo { let x = 42 }`)
    expect(tree.root).toBeNull()
  })

  it('returns errors for unparseable input', () => {
    const parser = new SwiftUIParser()
    // Forcing an error in parsing by passing invalid tokens will be recorded in tree.errors
    const tree = parser.parse(`struct {`)
    expect(tree.errors.length).toBeGreaterThan(0)
  })

  it('handles modifiers without parameters and labelled arguments', () => {
    const source = `
      struct Foo: View {
        var body: some View {
          Button(action: { }) {
            Text("Click me")
              .bold()
          }.disabled(true)
        }
      }
    `
    const parser = new SwiftUIParser()
    const tree = parser.parse(source)
    expect(tree.root?.type).toBe('Button')
    expect(tree.root?.modifiers.length).toBe(1)
    expect(tree.root?.modifiers[0].type).toBe('disabled')
    expect(tree.root?.modifiers[0].properties['value']).toBe(true)
  })
})
