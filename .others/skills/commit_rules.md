# Commit Rules

## Objetivo

Establecer formato y reglas para commits del proyecto OpenSUI.

---

## Formato Obligatorio

```
tipo(scope): descripción en presente

[campos obligatorios]
tipo: feat|fix|test|docs|refactor|chore
scope: parser|renderer|vscode|tests|docs|skills
descripción: acción clara, max 72 caracteres
```

---

## Ejemplos del Proyecto

### Features

```bash
# Parser
feat(parser): add TokenType enum and tokenization logic
feat(parser): implement Lexer with position tracking
feat(parser): add SwiftUIParser facade

# Renderer
feat(renderer): implement LayoutEngine for spacing calculation
feat(renderer): add ComponentMapper for style resolution
feat(renderer): integrate canvas-renderer for PNG output

# VS Code
feat(vscode): register openSUI commands
feat(vscode): create PreviewPanel WebView
feat(vscode): implement FileWatcher with debounce
```

### Fixes

```bash
fix(parser): handle unclosed braces gracefully
fix(renderer): resolve color cache miss
fix(vscode): prevent memory leak on panel dispose
```

### Tests

```bash
test(parser): add tokenizer edge cases
test(renderer): test layout with nested containers
test(vscode): mock VS Code API for panel tests
```

### Docs

```bash
docs(readme): add installation instructions
docs(contributing): add setup guide
docs(changelog): document v1.0.0 release
```

### Chores

```bash
chore(deps): update vscode to v1.86.0
chore(deps): add canvas types
chore(ci): configure GitHub Actions workflow
```

---

## Reglas de Commits Atómicos

### UN COMMIT por tarea

```
✅ SÍ: "feat(parser): add Lexer class"
✅ SÍ: "feat(parser): add Parser class"

❌ NO: "feat(parser): add Lexer and Parser"
```

### Scope correcto

```bash
# Scope debe indicar módulo afectado
feat(parser): add tokenize method
feat(renderer): add layout calculation
feat(vscode): add command registration
```

---

## Verificación

Antes de commit:

1. ¿El commit tiene formato correcto?
2. ¿El scope es correcto?
3. ¿Es atómico (una tarea)?
4. ¿El mensaje describe qué y por qué?

---

## Aplicación

Cargar este skill al:
- Hacer commit
- Code review de commits
- Verificar Conventional Commits