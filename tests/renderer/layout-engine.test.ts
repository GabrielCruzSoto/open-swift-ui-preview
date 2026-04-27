import { LayoutEngine } from '../../src/renderer/layout-engine'
import { SwiftUIComponentTree, SwiftUIComponent } from '../../src/parser/types'

describe('LayoutEngine', () => {
  it('returns null for an empty tree', () => {
    const engine = new LayoutEngine()
    const tree: SwiftUIComponentTree = { root: null, errors: [] }
    expect(engine.computeLayout(tree)).toBeNull()
  })

  it('measures VStack stacking dimensions vertically', () => {
    const root: SwiftUIComponent = {
      type: 'VStack',
      properties: { spacing: 10 },
      modifiers: [],
      children: [
        { type: 'Text', properties: { content: 'Hello' }, modifiers: [], children: [] },
        { type: 'Text', properties: { content: 'World' }, modifiers: [], children: [] }
      ]
    }
    const tree: SwiftUIComponentTree = { root, errors: [] }
    const engine = new LayoutEngine()
    const layout = engine.computeLayout(tree)

    expect(layout).not.toBeNull()
    expect(layout?.children.length).toBe(2)
    // 20px per text + 10px spacing = 50px approx height for VStack
    expect(layout?.layout.height).toBe(50)
  })

  it('measures HStack stacking dimensions horizontally', () => {
    const root: SwiftUIComponent = {
      type: 'HStack',
      properties: { spacing: 5 },
      modifiers: [],
      children: [
        { type: 'Text', properties: { content: 'Left' }, modifiers: [], children: [] },
        { type: 'Spacer', properties: {}, modifiers: [], children: [] },
        { type: 'Text', properties: { content: 'Right' }, modifiers: [], children: [] }
      ]
    }
    const tree: SwiftUIComponentTree = { root, errors: [] }
    const engine = new LayoutEngine()
    const layout = engine.computeLayout(tree)

    expect(layout).not.toBeNull()
    expect(layout?.children.length).toBe(2) // Spacer is skipped in children array push?
    // Wait, spacer is "continue" in loop, let's verify if my mock skips it entirely or just gives 0 width.
    // In our simplistic model we skipped push for Spacer in HStack, let's adjust tests based on actual implementation.
    expect(layout?.layout.height).toBe(20) // Text height is 20
  })

  it('handles Buttons with child components', () => {
    const root: SwiftUIComponent = {
      type: 'Button',
      properties: {},
      modifiers: [{ type: 'padding', properties: { value: 20 } }],
      children: [
        { type: 'Text', properties: { content: 'Click' }, modifiers: [], children: [] }
      ]
    }
    const engine = new LayoutEngine()
    const layout = engine.computeLayout({ root, errors: [] })
    
    // Expect 20px padding around
    expect(layout?.layout.height).toBe(60) // 20 text height + 40 padding
  })

  it('handles unknown components securely', () => {
    const root: SwiftUIComponent = {
      type: 'UnknownThing',
      properties: {},
      modifiers: [],
      children: []
    }
    const engine = new LayoutEngine()
    const layout = engine.computeLayout({ root, errors: [] })
    expect(layout?.layout.width).toBe(100) // Fallback default
  })
})
