import { CanvasRenderer } from '../../src/renderer/canvas-renderer'
import { LayoutNode } from '../../src/renderer/types'
import { DeviceFrame } from '../../src/renderer/device-frame'

describe('CanvasRenderer', () => {
  it('renders an empty layout without crashing', () => {
    const renderer = new CanvasRenderer()
    const layout: LayoutNode = {
      component: { type: 'VStack', properties: {}, modifiers: [], children: [] },
      layout: { x: 0, y: 0, width: 300, height: 300, minWidth: 0, maxWidth: 300, minHeight: 0, maxHeight: 300 },
      children: []
    }
    const buffer = renderer.render(layout, 300, 300)
    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('renders Text, Button and Divider', () => {
    const renderer = new CanvasRenderer()
    const layout: LayoutNode = {
      component: { type: 'VStack', properties: {}, modifiers: [{ type: 'background', properties: { value: '.gray' } }, { type: 'cornerRadius', properties: { value: 10 } }], children: [] },
      layout: { x: 0, y: 0, width: 300, height: 300, minWidth: 0, maxWidth: 300, minHeight: 0, maxHeight: 300 },
      children: [
        {
          component: { type: 'Text', properties: { content: 'Test Text' }, modifiers: [], children: [] },
          layout: { x: 10, y: 10, width: 100, height: 20, minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 20 },
          children: []
        },
        {
          component: { type: 'Button', properties: {}, modifiers: [], children: [] },
          layout: { x: 10, y: 40, width: 100, height: 40, minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 40 },
          children: []
        },
        {
          component: { type: 'Divider', properties: {}, modifiers: [], children: [] },
          layout: { x: 10, y: 90, width: 280, height: 1, minWidth: 0, maxWidth: 280, minHeight: 0, maxHeight: 1 },
          children: []
        }
      ]
    }
    const buffer = renderer.render(layout, 300, 300)
    expect(buffer).toBeInstanceOf(Buffer)
  })
})

describe('DeviceFrame', () => {
  it('wraps a screenshot cleanly', () => {
    // Generate a valid 1x1 PNG instead of a junk buffer
    const dummyCanvas = require('canvas').createCanvas(1, 1)
    const screenshot = dummyCanvas.toBuffer('image/png')
    const framed = DeviceFrame.attachFrame(screenshot, true)
    expect(framed).toBeInstanceOf(Buffer)
    expect(framed.length).toBeGreaterThan(0)
  })
})
