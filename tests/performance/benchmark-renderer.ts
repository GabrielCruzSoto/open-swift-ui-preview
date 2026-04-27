/**
 * Renderer Benchmark — Fase 6
 *
 * Performance benchmarks for the SwiftUI renderer.
 */

import { SwiftUIParser } from '../../src/parser/swiftui-parser'
import { LayoutEngine } from '../../src/renderer/layout-engine'
import { CanvasRenderer } from '../../src/renderer/canvas-renderer'

describe('Renderer Performance Benchmarks', () => {
  const parser = new SwiftUIParser()
  const layoutEngine = new LayoutEngine()
  const canvasRenderer = new CanvasRenderer()

  const simpleSwiftUI = `
struct ContentView: View {
  var body: some View {
    Text("Hello, World!")
  }
}
`

  const complexSwiftUI = `
struct ContentView: View {
  var body: some View {
    VStack {
      Text("Title")
        .font(.largeTitle)
        .padding()
      
      HStack {
        Text("Label 1")
        Spacer()
        Text("Label 2")
      }
      .padding()
      
      Button(action: {}) {
        Text("Click Me")
      }
      .padding()
      .background(Color.blue)
      .cornerRadius(10)
    }
  }
}
`

  it('should compute layout for simple view in < 50ms', () => {
    const componentTree = parser.parse(simpleSwiftUI)
    if (!componentTree.root) {
      throw new Error('Failed to parse')
    }

    const start = performance.now()
    const layoutTree = layoutEngine.computeLayout(componentTree)
    const end = performance.now()
    const duration = end - start

    expect(layoutTree).toBeDefined()
    expect(duration).toBeLessThan(50)
  })

  it('should compute layout for complex view in < 200ms', () => {
    const componentTree = parser.parse(complexSwiftUI)
    if (!componentTree.root) {
      throw new Error('Failed to parse')
    }

    const start = performance.now()
    const layoutTree = layoutEngine.computeLayout(componentTree)
    const end = performance.now()
    const duration = end - start

    expect(layoutTree).toBeDefined()
    expect(duration).toBeLessThan(200)
  })

  it('should render simple view in < 500ms', () => {
    const componentTree = parser.parse(simpleSwiftUI)
    if (!componentTree.root) {
      throw new Error('Failed to parse')
    }

    const layoutTree = layoutEngine.computeLayout(componentTree)
    if (!layoutTree) {
      throw new Error('Failed to compute layout')
    }

    const start = performance.now()
    const imageBuffer = canvasRenderer.render(layoutTree, 393, 852)
    const end = performance.now()
    const duration = end - start

    expect(imageBuffer).toBeDefined()
    expect(duration).toBeLessThan(500)
  })

  it('should render complex view in < 2000ms', () => {
    const componentTree = parser.parse(complexSwiftUI)
    if (!componentTree.root) {
      throw new Error('Failed to parse')
    }

    const layoutTree = layoutEngine.computeLayout(componentTree)
    if (!layoutTree) {
      throw new Error('Failed to compute layout')
    }

    const start = performance.now()
    const imageBuffer = canvasRenderer.render(layoutTree, 393, 852)
    const end = performance.now()
    const duration = end - start

    expect(imageBuffer).toBeDefined()
    expect(duration).toBeLessThan(2000)
  })

  it('should handle full pipeline (parse + layout + render) in < 3000ms', () => {
    const start = performance.now()

    const componentTree = parser.parse(complexSwiftUI)
    if (!componentTree.root) {
      throw new Error('Failed to parse')
    }

    const layoutTree = layoutEngine.computeLayout(componentTree)
    if (!layoutTree) {
      throw new Error('Failed to compute layout')
    }

    const imageBuffer = canvasRenderer.render(layoutTree, 393, 852)
    if (!imageBuffer) {
      throw new Error('Failed to render')
    }

    const end = performance.now()
    const duration = end - start

    expect(duration).toBeLessThan(3000)
  })
})
