# [PROMPT] Fase 7 — Testing y Documentación

> Versión: 1.0 | Proyecto: OpenSUI

---

## CONTEXTO (C)

Eres un Ingeniero de Software TypeScript trabajando en **OpenSUI**, una extensión VS Code para previsualización de vistas SwiftUI.

**Referencias:**
- `docs/[PLAN]` — Fase 7: Testing y Documentación
- `skills/testing_rules.md`
- `skills/changelog_format.md`

**Estado del repositorio:**
- Fases completadas: Fases 1-6

---

## OBJETIVO (O)

Al finalizar esta fase:

**Testing:**
- [ ] Coverage ≥ 80% (整体)
- [ ] Integration tests
- [ ] Tests de todos los módulos

**CI/CD:**
- [ ] `.github/workflows/ci.yml`

**Documentación:**
- [ ] `README.md` completo
- [ ] `CONTRIBUTING.md`
- [ ] `CHANGELOG.md` (versión 1.0.0)

---

## RESTRICCIONES (R)

- ✅ Jest para testing
- ✅ GitHub Actions para CI
- ✅ Formato Keep a Changelog

---

## EJECUCIÓN (E)

### Paso 1 — Coverage check

```bash
npm run test:coverage
# Asegurar ≥ 80%
```

### Paso 2 — GitHub Actions CI

Crear `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - run: npm test
      - run: npm run lint
```

### Paso 3 — README.md

```markdown
# OpenSUI

VS Code extension for SwiftUI preview.

## Features
- Real-time SwiftUI preview
- Device frame selection
- Multi-platform support

## Installation
\`\`\`
ext install opensui.preview
\`\`\`

## Usage
1. Open SwiftUI file
2. Run "OpenSUI: Start Preview"
```

### Paso 4 — CONTRIBUTING.md

```markdown
# Contributing

## Setup
\`\`\`
git clone
npm install
npm run build
\`\`\`

## Testing
\`\`\`
npm test
\`\`\`
```

### Paso 5 — CHANGELOG.md version 1.0.0

```markdown
## [1.0.0] — YYYY-MM-DD
### Added
- Full SwiftUI preview functionality
- Device selector (iPhone 15/16/17)
- Real-time updates
- WebView panel
### Changed
- ...
```

### Paso 6 — Final commit

```bash
git add .
git commit -m "release: v1.0.0 - complete SwiftUI preview"
git push origin fase-7-testing-doc
git tag v1.0.0
git push origin v1.0.0
```

---

## CRITERIOS DE ACEPTACIÓN

| # | Criterio |
|---|----------|
| 1 | Coverage ≥ 80% |
| 2 | CI workflow funciona |
| 3 | README completo |
| 4 | CHANGELOG actualizado |

---

**Fin del prompt**