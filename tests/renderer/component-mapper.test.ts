import { ComponentMapper } from '../../src/renderer/component-mapper'
import { SwiftUIComponent } from '../../src/parser/types'

describe('ComponentMapper', () => {
  it('maps basic padding modifiers', () => {
    const mapper = new ComponentMapper()
    const component: SwiftUIComponent = {
      type: 'Text',
      properties: {},
      children: [],
      modifiers: [
        { type: 'padding', properties: { value: 10 } }
      ]
    }
    const style = mapper.mapToStyle(component)
    expect(style.padding?.top).toBe(10)
    expect(style.padding?.left).toBe(10)
  })

  it('maps specific padding sides', () => {
    const mapper = new ComponentMapper()
    const component: SwiftUIComponent = {
      type: 'Text',
      properties: {},
      children: [],
      modifiers: [
        { type: 'padding', properties: { leading: 20, top: 5 } }
      ]
    }
    const style = mapper.mapToStyle(component)
    // The mapper defaults to 16 if 'value' is missing, then overwrites specifics
    expect(style.padding?.left).toBe(20)
    expect(style.padding?.top).toBe(5)
    expect(style.padding?.bottom).toBe(16)
  })

  it('maps colors securely', () => {
    const mapper = new ComponentMapper()
    const component: SwiftUIComponent = {
      type: 'View',
      properties: {},
      children: [],
      modifiers: [
        { type: 'background', properties: { value: '.blue' } },
        { type: 'foregroundColor', properties: { value: 'red' } }
      ]
    }
    const style = mapper.mapToStyle(component)
    expect(style.backgroundColor).toBe('#007AFF')
    expect(style.foregroundColor).toBe('#FF3B30')
  })

  it('maps font constraints', () => {
    const mapper = new ComponentMapper()
    const component: SwiftUIComponent = {
      type: 'Text',
      properties: {},
      children: [],
      modifiers: [
        { type: 'font', properties: { value: '.title' } },
        { type: 'bold', properties: {} }
      ]
    }
    const style = mapper.mapToStyle(component)
    expect(style.fontSize).toBe(28)
    expect(style.fontWeight).toBe('bold')
    expect(style.font).toContain('system-ui')
  })
})
