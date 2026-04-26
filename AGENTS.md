# AGENTS.md — OpenSUI Agent Configuration

> A simple, open format for guiding coding agents. Think of it as a README for agents.

---

## Project Overview

**OpenSUI** is a Visual Studio Code extension for real-time SwiftUI preview. It allows iOS developers to preview SwiftUI views directly in VS Code without requiring Xcode or Apple hardware.

- **Language**: TypeScript
- **Platform**: VS Code Extension
- **Purpose**: SwiftUI preview rendering engine

---

## Setup Commands

```bash
# Install dependencies
npm install

# Start development server (watch mode)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Package extension
npm run package
```

---

## Code Style

- **TypeScript**: Strict mode enabled
- **Quotes**: Single quotes
- **Semicolons**: No semicolons
- **Indentation**: 2 spaces
- **Patterns**: Functional patterns where possible
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces

---

## Agent Behavior

### Operation Modes

| Mode | Activation | Description |
|------|------------|-------------|
| **Planning** | Initial analysis | Read-only, no file modifications |
| **Build** | User confirmation | Can generate code and execute commands |
| **Review** | Explicit request | Reviews existing code |

### Reasoning Protocol

Follow the C.O.R.E. protocol for each task:

```
[THINK]   → Identify necessary information
[PLAN]    → Define execution order
[ACT]     → Generate deliverable
[VERIFY]  → Confirm acceptance criteria
```

### Progress Reporting

Report progress at each milestone:

```
[PROGRESS] Phase N: X/Y tasks completed - [description]
```

Example:
```
[PROGRESS] Phase 2: 3/8 tasks completed - Lexer implemented
```

### Decision Protocol

When user decision is required:

```
[DECISION REQUIRED] Option A vs B
Impact: [description of impact]
Recommendation: [recommended option with justification]
```

---

## Branching Strategy

### Branch Model

```
main    ────●────────────────●────────────> releases
            ↑                ↑
develop ────●───────●───────●──> integration
              ↑     ↑     ↑
fase-1-xxx───●─●────●─●────
fase-2-xxx─────────●─●────
```

### Branch Naming

| Prefix | Use | Example |
|--------|-----|--------|
| `fase-N-nombre` | Phase-based work | `fase-2-motor-de-parsing` |
| `feature/nombre` | Features | `feature/nuevo-componente` |
| `fix/nombre` | Bug fixes | `fix-parser-error` |
| `docs/nombre` | Documentation | `docs-readme` |

### Branch Lifecycle

1. Create from `develop`
2. Work with atomic commits
3. Push regularly
4. Create PR when phase is complete
5. Merge to `develop` after approval

---

## Commit Policy

### Required Format

```
type(scope): description

[type] feat|fix|test|docs|refactor|chore
[scope] parser|renderer|vscode|tests|docs
[description] clear action in present tense
```

### Valid Examples

```bash
feat(parser): add Lexer with tokenization
feat(renderer): implement Layout Engine
fix(vscode): resolve panel disposal memory leak
test(parser): add tokenizer edge case tests
docs(readme): add installation instructions
chore(deps): update vscode to v1.86.0
```

### Atomic Commits Rule

- **ALWAYS**: One commit per completed technical task
- **NEVER**: Large commits with multiple unrelated changes

---

## Editing Policy

### When to Create vs Edit

| Situation | Action |
|----------|--------|
| Existing module has the file type | Edit |
| New functionality in new module | Create file |
| Large refactoring | New branch, new files |

### Context Preservation

- **ALWAYS**: Read existing file before editing
- **REQUIRED**: Use `Read` tool before `edit`
- **PROHIBITED**: Edit without reading the file first

---

## Quality Criteria

### Mandatory Checkpoints

| Phase | Checkpoint | Verification |
|-------|-----------|--------------|
| Any | Compilation | `tsc --noEmit` without errors |
| Any | Linting | `npm run lint` without errors |
| Phase 2+ | Tests | Tests pass |
| Phase 2+ | Coverage | ≥ 80% if applicable |
| Phase 7 | Release | Coverage ≥ 80% |

### Progress Rule

```
❌ NEVER advance to next phase if current phase has unmet criteria
❌ NEVER omit tests for a module you implemented
❌ NEVER generate code that doesn't compile

✅ ALWAYS report progress when completing tasks
✅ ALWAYS use Conventional Commits
✅ ALWAYS update CHANGELOG.md
```

---

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
│   └── vscode/
├── assets/
│   └── device-frames/ # Device frames
├── Context/           # Project context for agents
├── docs/              # Documentation
├── skills/            # Agent skills
└── AGENTS.md          # This file
```

---

## Reference Documents

| Document | Purpose |
|----------|---------|
| `Context/` | Project context and architecture |
| `docs/` | Architecture and design documentation |
| `requirements.md` | Dependencies and scripts |
| `skills/*` | Specific agent skills |

---

## Key Technical Details

### Supported SwiftUI Components (Initial)

| Category | Components |
|-----------|-------------|
| **Layout** | `VStack`, `HStack`, `ZStack`, `Spacer` |
| **Text** | `Text` |
| **Controls** | `Button`, `Toggle`, `Slider`, `TextField`, `Picker` |
| **Containers** | `List`, `ScrollView`, `NavigationStack`, `TabView` |
| **Multimedia** | `Image` |
| **Structure** | `Divider` |

### Device Support

- iPhone 15 series
- iPhone 16 series
- iPhone 17 series

### Critical Requirements

- Custom rendering engine (no Xcode dependency)
- Static image preview (not interactive execution)
- Cross-platform (Windows, Linux, macOS)
- Real-time updates on code changes

---

## Testing Requirements

- Unit tests for parser components
- Integration tests for renderer
- E2E tests for VS Code integration
- Minimum 80% code coverage before release

---

**End of document**
