# Contributing to OpenSUI

Thank you for your interest in contributing to OpenSUI! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Git
- VS Code 1.86.0 or higher

### Clone and Install

```bash
git clone https://github.com/GabrielCruzSoto/open-swift-ui-preview.git
cd open-swift-ui-preview
npm install
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

This will compile the extension in watch mode.

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Specific Test Suite

```bash
npm test -- --testPathPatterns="tests/parser"
npm test -- --testPathPatterns="tests/renderer"
npm test -- --testPathPatterns="tests/vscode"
npm test -- --testPathPatterns="tests/performance"
```

## Code Style

OpenSUI follows these conventions:

- **TypeScript**: Strict mode enabled
- **Quotes**: Single quotes
- **Semicolons**: No semicolons
- **Indentation**: 2 spaces
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run check-types
```

## Project Structure

```
opensui/
├── src/
│   ├── parser/        # Lexer and parser
│   ├── renderer/      # Layout engine and rendering
│   └── vscode/        # VS Code integration
├── tests/
│   ├── parser/
│   ├── renderer/
│   ├── vscode/
│   └── performance/
├── assets/
│   └── device-frames/ # Device frames
├── Context/           # Project context for agents
├── docs/              # Documentation
└── skills/            # Agent skills
```

## Commit Convention

We follow Conventional Commits:

```
type(scope): description

[type] feat|fix|test|docs|refactor|chore
[scope] parser|renderer|vscode|tests|docs
[description] clear action in present tense
```

### Examples

```bash
feat(parser): add memoization cache
fix(renderer): resolve layout calculation error
test(vscode): add preview panel tests
docs(readme): update installation instructions
chore(deps): update dependencies
```

## Branching Strategy

- `main` - Production releases
- `develop` - Integration branch
- `fase-N-name` - Feature branches for each phase

## Pull Request Process

1. Create a branch from `develop`
2. Make your changes with atomic commits
3. Run tests and linting
4. Ensure coverage ≥ 80%
5. Create a pull request to `develop`
6. Wait for review and approval

## Quality Criteria

Before submitting a PR, ensure:

- [ ] TypeScript compiles without errors (`npm run check-types`)
- [ ] Linting passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Coverage ≥ 80% (if applicable)
- [ ] CHANGELOG.md is updated
- [ ] Commit messages follow the convention

## Questions?

Feel free to open an issue for questions or discussion.
