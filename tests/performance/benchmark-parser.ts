/**
 * Parser Benchmark — Fase 6
 *
 * Performance benchmarks for the SwiftUI parser.
 */

import { SwiftUIParser } from '../../src/parser/swiftui-parser'

describe('Parser Performance Benchmarks', () => {
  const parser = new SwiftUIParser()

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

  it('should parse simple SwiftUI view in < 100ms', () => {
    const start = performance.now()
    const result = parser.parse(simpleSwiftUI)
    const end = performance.now()
    const duration = end - start

    expect(result.root).toBeDefined()
    expect(duration).toBeLessThan(100)
  })

  it('should parse complex SwiftUI view in < 500ms', () => {
    const start = performance.now()
    const result = parser.parse(complexSwiftUI)
    const end = performance.now()
    const duration = end - start

    expect(result.root).toBeDefined()
    expect(duration).toBeLessThan(500)
  })

  it('should benefit from memoization on repeated parses', () => {
    const firstStart = performance.now()
    parser.parse(simpleSwiftUI)
    const firstEnd = performance.now()
    const firstDuration = firstEnd - firstStart

    const secondStart = performance.now()
    parser.parse(simpleSwiftUI)
    const secondEnd = performance.now()
    const secondDuration = secondEnd - secondStart

    // Cached parse should be significantly faster
    expect(secondDuration).toBeLessThan(firstDuration)
  })

  it('should handle 100 parses in < 1s', () => {
    const start = performance.now()
    for (let i = 0; i < 100; i++) {
      parser.parse(simpleSwiftUI)
    }
    const end = performance.now()
    const duration = end - start

    expect(duration).toBeLessThan(1000)
  })
})
