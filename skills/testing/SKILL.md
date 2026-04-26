# Testing Skill

**Purpose**: Guide the testing strategy and implementation for OpenSUI

## Overview

This skill provides specialized knowledge for implementing comprehensive testing across all components of OpenSUI. Testing ensures code quality, prevents regressions, and validates that the extension meets requirements.

## Testing Philosophy

- **Test-Driven Development (TDD)**: Write tests before implementation when possible
- **High Coverage**: Target ≥ 80% code coverage before release
- **Fast Tests**: Unit tests should run in milliseconds
- **Isolated Tests**: Each test should be independent
- **Clear Names**: Test names should describe what they test

## Testing Stack

### Framework
- **Jest**: Primary testing framework
- **@types/jest**: TypeScript type definitions

### Utilities
- **vscode-test**: VS Code extension testing utilities
- **mock-fs**: Mock file system for file operations

### Coverage
- **Jest Coverage**: Built-in coverage reporting
- **Threshold**: 80% minimum for release

## Test Structure

### Directory Structure
```
tests/
├── parser/
│   ├── lexer.test.ts
│   ├── parser.test.ts
│   ├── swiftUIAnalyzer.test.ts
│   └── componentTreeBuilder.test.ts
├── renderer/
│   ├── layoutEngine.test.ts
│   ├── styleEngine.test.ts
│   ├── canvasRenderer.test.ts
│   └── compositor.test.ts
├── vscode/
│   ├── extension.test.ts
│   ├── previewPanel.test.ts
│   ├── fileWatcher.test.ts
│   └── commandHandler.test.ts
└── integration/
    ├── end-to-end.test.ts
    └── visual-regression.test.ts
```

## Unit Testing

### Parser Tests

**Lexer Tests**
```typescript
describe('Lexer', () => {
  it('should tokenize keywords', () => {
    const lexer = new Lexer();
    const tokens = lexer.tokenize('struct MyView');
    expect(tokens).toContainEqual({ type: TokenType.KEYWORD, value: 'struct' });
  });

  it('should handle string literals', () => {
    const lexer = new Lexer();
    const tokens = lexer.tokenize('Text("Hello")');
    expect(tokens).toContainEqual({ type: TokenType.LITERAL, value: 'Hello' });
  });
});
```

**Parser Tests**
```typescript
describe('Parser', () => {
  it('should parse struct declaration', () => {
    const parser = new Parser();
    const ast = parser.parse(tokens);
    expect(ast.type).toBe('StructDecl');
  });

  it('should handle nested expressions', () => {
    const parser = new Parser();
    const ast = parser.parse(complexTokens);
    expect(ast.children).toHaveLength(3);
  });
});
```

**SwiftUI Analyzer Tests**
```typescript
describe('SwiftUIAnalyzer', () => {
  it('should identify View conforming structs', () => {
    const analyzer = new SwiftUIAnalyzer();
    const result = analyzer.analyze(ast);
    expect(result).not.toBeNull();
  });

  it('should extract component hierarchy', () => {
    const analyzer = new SwiftUIAnalyzer();
    const result = analyzer.analyze(ast);
    expect(result.children).toHaveLength(2);
  });
});
```

### Renderer Tests

**Layout Engine Tests**
```typescript
describe('LayoutEngine', () => {
  it('should calculate VStack layout', () => {
    const engine = new LayoutEngine();
    const result = engine.layout(vStackComponent, constraints);
    expect(result.height).toBeGreaterThan(0);
  });

  it('should handle spacing in HStack', () => {
    const engine = new LayoutEngine();
    const result = engine.layout(hStackComponent, constraints);
    expect(result.width).toBeGreaterThan(sumOfChildrenWidths);
  });
});
```

**Style Engine Tests**
```typescript
describe('StyleEngine', () => {
  it('should map SwiftUI colors to hex', () => {
    const engine = new StyleEngine();
    const style = engine.applyStyles(component, baseStyle);
    expect(style.textColor).toBe('#007AFF');
  });

  it('should apply padding modifier', () => {
    const engine = new StyleEngine();
    const style = engine.applyStyles(component, baseStyle);
    expect(style.padding).toBeDefined();
  });
});
```

### VS Code Integration Tests

**Extension Tests**
```typescript
describe('Extension', () => {
  it('should activate successfully', async () => {
    const context = createMockExtensionContext();
    await activate(context);
    expect(context.subscriptions).not.toHaveLength(0);
  });

  it('should register commands', async () => {
    const context = createMockExtensionContext();
    await activate(context);
    expect(vscode.commands.registerCommand).toHaveBeenCalled();
  });
});
```

## Integration Testing

### End-to-End Tests
```typescript
describe('End-to-End', () => {
  it('should preview a simple SwiftUI view', async () => {
    const swiftCode = `
      struct ContentView: View {
        var body: some View {
          Text("Hello World")
        }
      }
    `;
    const result = await runPreviewPipeline(swiftCode);
    expect(result.image).toBeDefined();
    expect(result.image.height).toBeGreaterThan(0);
  });
});
```

### Visual Regression Tests
```typescript
describe('Visual Regression', () => {
  it('should match expected output for VStack', async () => {
    const component = createVStackComponent();
    const rendered = await renderComponent(component);
    const expected = await loadExpectedImage('vstack-expected.png');
    expect(compareImages(rendered, expected)).toBeLessThan(0.01);
  });
});
```

## Test Data

### Sample SwiftUI Files
Create sample `.swift` files for testing:
```
tests/fixtures/
├── simple-text.swift
├── vstack-example.swift
├── hstack-example.swift
├── button-example.swift
└── complex-view.swift
```

### Expected Outputs
Store expected rendering outputs:
```
tests/expected/
├── simple-text.png
├── vstack-example.png
├── hstack-example.png
└── button-example.png
```

## Performance Testing

### Benchmark Tests
```typescript
describe('Performance', () => {
  it('should parse 500-line file in < 1s', () => {
    const code = loadLargeSwiftFile(500);
    const start = Date.now();
    parser.parse(code);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000);
  });

  it('should render complex view in < 2s', () => {
    const tree = createComplexComponentTree(50);
    const start = Date.now();
    renderer.render(tree);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });
});
```

## Coverage Requirements

### Minimum Coverage by Module
- Parser: ≥ 85%
- Renderer: ≥ 85%
- VS Code Integration: ≥ 75%
- Overall: ≥ 80%

### Coverage Report
Run coverage with:
```bash
npm run test:coverage
```

## Test Scripts

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test lexer.test.ts
```

## Best Practices

### Test Organization
- Group related tests with `describe`
- Use descriptive test names with `it`
- Arrange-Act-Assert pattern
- Use `beforeEach`/`afterEach` for setup/teardown

### Mocking
- Mock external dependencies (file system, VS Code API)
- Use dependency injection for testability
- Avoid mocking the system under test

### Assertions
- Use specific matchers
- Test behavior, not implementation
- Include edge cases and error conditions

### Test Data
- Use realistic test data
- Avoid magic numbers in tests
- Create reusable test helpers

## Continuous Integration

### CI Pipeline
- Run tests on every commit
- Fail build if coverage drops below threshold
- Run performance tests nightly
- Run visual regression tests on PRs

### GitHub Actions Example
```yaml
- name: Run tests
  run: npm test

- name: Check coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## References

- AGENTS.md: Quality criteria and checkpoints
- Context/requirements-summary.md: Testing requirements
- Jest Documentation: https://jestjs.io/

## Quality Checklist

- [ ] Unit tests for all modules
- [ ] Integration tests for critical paths
- [ ] Visual regression tests for renderer
- [ ] Performance tests for parser and renderer
- [ ] Test coverage ≥ 80%
- [ ] All tests pass
- [ ] Tests run in CI
- [ ] Test data organized and documented
- [ ] Mock external dependencies appropriately
- [ ] Test names are descriptive
