import { Lexer } from './lexer'
import { Parser } from './parser'
import {
  ASTNode,
  ComponentInfo,
  Modifier,
  PropertyValue,
  SwiftUIComponent,
  SwiftUIComponentTree,
  TokenType,
} from './types'

// ─────────────────────────────────────────────────────────────────────────────
// SwiftUI component names recognised by the analyzer
// ─────────────────────────────────────────────────────────────────────────────

const SWIFTUI_COMPONENTS: Set<string> = new Set([
  'VStack', 'HStack', 'ZStack', 'Spacer',
  'Text', 'Button', 'Toggle', 'Slider', 'TextField', 'Picker',
  'List', 'ScrollView', 'NavigationStack', 'TabView',
  'Image', 'Divider',
])

const MODIFIER_NAMES: Set<string> = new Set([
  'padding', 'background', 'foregroundColor', 'foregroundStyle',
  'font', 'frame', 'cornerRadius', 'overlay', 'shadow',
  'opacity', 'bold', 'italic', 'lineLimit', 'multilineTextAlignment',
  'resizable', 'aspectRatio', 'scaledToFit', 'scaledToFill',
  'tabItem', 'tag', 'navigationTitle', 'disabled',
])

// ─────────────────────────────────────────────────────────────────────────────
// High-level facade
// ─────────────────────────────────────────────────────────────────────────────

/**
 * High-level facade that coordinates the Lexer and Parser
 * and walks the resulting AST to produce a SwiftUIComponentTree.
 */
export class SwiftUIParser {
  private cache = new Map<string, SwiftUIComponentTree>()
  private readonly maxCacheSize = 100

  /**
   * Parse SwiftUI source code and return a component tree.
   * Never throws – errors are contained inside the returned tree.
   * Uses memoization to cache parsed results.
   */
  parse(sourceCode: string): SwiftUIComponentTree {
    const cached = this.cache.get(sourceCode)
    if (cached) {
      return cached
    }

    const result = this.parseInternal(sourceCode)

    // Cache the result (LRU eviction if cache is full)
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(sourceCode, result)

    return result
  }

  private parseInternal(sourceCode: string): SwiftUIComponentTree {
    try {
      const lexer = new Lexer(sourceCode)
      const tokens = lexer.tokenize()

      const parser = new Parser(tokens)
      const ast = parser.parse()

      const component = this.analyzeProgram(ast)
      return { root: component, errors: parser.errors }
    } catch (err) {
      return {
        root: null,
        errors: [
          {
            message: err instanceof Error ? err.message : String(err),
            line: 0,
            column: 0,
            severity: 'error',
          },
        ],
      }
    }
  }

  /**
   * Quick check: returns true when the source looks like a SwiftUI view file.
   * Used by the extension to decide whether to activate the preview.
   */
  isSwiftUIFile(sourceCode: string): boolean {
    return sourceCode.includes(': View') || sourceCode.includes('#Preview')
  }

  // ── AST walking ────────────────────────────────────────────────────────────

  private analyzeProgram(program: ASTNode): SwiftUIComponent | null {
    if (!program.children) {return null}

    for (const node of program.children) {
      if (node.type === 'StructDecl') {
        const result = this.analyzeStructDecl(node)
        if (result) {return result}
      }
    }
    return null
  }

  private analyzeStructDecl(node: ASTNode): SwiftUIComponent | null {
    if (!node.children) {return null}

    // Find a `body` property whose children contain SwiftUI components
    for (const child of node.children) {
      if (child.type === 'PropertyDecl' && child.name === 'body') {
        return this.findRootComponent(child)
      }
    }
    return null
  }

  private findRootComponent(bodyNode: ASTNode): SwiftUIComponent | null {
    if (!bodyNode.children) {return null}

    for (const child of bodyNode.children) {
      const component = this.nodeToComponent(child)
      if (component) {return component}
    }
    return null
  }

  // ── Node → Component ───────────────────────────────────────────────────────

  private nodeToComponent(node: ASTNode): SwiftUIComponent | null {
    const { base, modNodes } = this.unwrapModifiers(node)
    const name = (base as ASTNode & { name?: string })?.name ?? ''

    if (base && base.type === 'CallExpr' && SWIFTUI_COMPONENTS.has(name)) {
      const info = this.extractComponentInfo(base, modNodes)
      return this.infoToComponent(info)
    }

    // Walk children for nested components
    if (base && base.type === 'ClosureExpr' && base.children) {
      for (const child of base.children) {
        const comp = this.nodeToComponent(child)
        if (comp) {return comp}
      }
    }

    return null
  }

  private tryExtractInfo(node: ASTNode): ComponentInfo | null {
    const { base, modNodes } = this.unwrapModifiers(node)
    const name = (base as ASTNode & { name?: string })?.name ?? ''

    if (base && base.type === 'CallExpr' && SWIFTUI_COMPONENTS.has(name)) {
      return this.extractComponentInfo(base, modNodes)
    }
    return null
  }

  private unwrapModifiers(node: ASTNode): { base: ASTNode | null; modNodes: ASTNode[] } {
    const modNodes: ASTNode[] = []
    let current: ASTNode | null = node

    while (current && current.type === 'ModifierExpr') {
      modNodes.unshift(current) // The outermost modifier is at the top of the AST, so unshift to keep order (optional)
      current = current.children?.[0] ?? null // Base is the first child
    }

    return { base: current, modNodes: modNodes.reverse() } // Reverse to apply from inner to outer
  }

  private extractComponentInfo(baseNode: ASTNode, modifierNodes: ASTNode[]): ComponentInfo {
    const name = (baseNode as ASTNode & { name?: string }).name ?? 'Unknown'
    const properties = new Map<string, PropertyValue>()
    const modifiers: Modifier[] = []
    const children: ComponentInfo[] = []

    // 1. Extract properties and children from the base node
    if (baseNode.children) {
      for (const child of baseNode.children) {
        if (child.type === 'BinaryExpr') {
          // Labelled argument
          const key = (child as ASTNode & { name?: string }).name ?? ''
          const val = child.children?.[0]
          if (val) {properties.set(key, this.extractValue(val))}
        } else if (child.type === 'ClosureExpr' && child.children) {
          // Children inside trailing closure
          for (const bodyNode of child.children) {
            const childInfo = this.tryExtractInfo(bodyNode)
            if (childInfo) {children.push(childInfo)}
          }
        } else if (child.type === 'Literal') {
          // Positional argument
          if (name === 'Text' || name === 'TextField' || name === 'Image') {
            properties.set('content', this.extractValue(child))
          }
        }
      }
    }

    // 2. Extract modifiers
    for (const mod of modifierNodes) {
      const modName = (mod as ASTNode & { name?: string }).name ?? ''
      if (MODIFIER_NAMES.has(modName)) {
        const modProps: Record<string, PropertyValue> = {}
        // The first child is the base node, the rest are arguments
        if (mod.children) {
          for (const arg of mod.children.slice(1)) {
            if (arg.type === 'BinaryExpr') {
              const k = (arg as ASTNode & { name?: string }).name ?? ''
              const v = arg.children?.[0]
              if (v) {modProps[k] = this.extractValue(v)}
            } else if (arg.type === 'Identifier' || arg.type === 'MemberExpr' || arg.type === 'Literal') {
              // Positional argument for modifier, let's just save it as 'value'
              modProps['value'] = this.extractValue(arg)
            }
          }
        }
        modifiers.push({ type: modName, properties: modProps })
      }
    }

    return { type: name, properties, modifiers, children, line: baseNode.line ?? 0, column: baseNode.column ?? 0 }
  }

  private extractValue(node: ASTNode): PropertyValue {
    if (node.type === 'Literal') {return node.value as PropertyValue}
    if (node.type === 'MemberExpr') {return (node as ASTNode & { name?: string }).name ?? null}
    if (node.type === 'Identifier') {return (node as ASTNode & { name?: string }).name ?? null}
    return null
  }

  private infoToComponent(info: ComponentInfo): SwiftUIComponent {
    const props: Record<string, PropertyValue> = {}
    info.properties.forEach((v, k) => { props[k] = v })

    return {
      type: info.type,
      properties: props,
      modifiers: info.modifiers,
      children: info.children.map((c) => this.infoToComponent(c)),
      sourceLocation: { line: info.line, column: info.column },
    }
  }

  // Suppress TS "unused" warning for TokenType import
  private _tokenTypeRef = TokenType.EOF
}
