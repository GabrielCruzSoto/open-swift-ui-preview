# Changelog Format

## Objetivo

Establecer formato para CHANGELOG.md del proyecto OpenSUI.

---

## Formato: Keep a Changelog

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
```

---

## Estructura de Versión

```markdown
## [1.0.0] — YYYY-MM-DD

### Added
- Nuevas funcionalidades para usuarios

### Changed
- Cambios en funcionalidades existentes

### Deprecated
- Funcionalidades que serán removidas en el futuro

### Removed
- Funcionalidades removidas

### Fixed
- Bug fixes

### Security
- Cambios relacionados a seguridad
```

---

## Secciones

| Sección | Descripción |
|--------|-------------|
| Added | Nuevas funcionalidades |
| Changed | Cambios en funcionalidades existentes |
| Deprecated | Funcionalidades marcadas para remoción |
| Removed | Funcionalidades removidas |
| Fixed | Bug fixes |
| Security | Cambios de seguridad |

---

## Reglas

### SÉISto orden

```
1. Added
2. Changed
3. Deprecated
4. Removed
5. Fixed
6. Security
```

### Un cambio por línea

```markdown
### Added
- Lexer implementation
- Parser implementation

### Fixed
- Memory leak in preview panel
```

### Descripción clara

```markdown
### Added
- Command registration for OpenSUI: Start Preview
- WebView panel with preview rendering

### Fixed
- Resolve memory leak on panel dispose
- Handle empty SwiftUI files gracefully
```

---

## Versionado Semántico

```
MAJOR.MINOR.PATCH

1.0.0
│ │ │
│ │ └── Patch: Bug fixes
│ └───── Minor: Nuevas funcionalidades (backward compatible)
└──────── MAJOR: Breaking changes
```

### Cuándo incrementar

| Incremento | Cuándo |
|------------|--------|
| MAJOR | Breaking changes |
| MINOR | New features (backward compatible) |
| PATCH | Bug fixes |

---

## Ejemplo Completo

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] — 2026-04-25

### Added
- SwiftUI preview functionality
- Device selector (iPhone 15/16/17 series)
- Real-time preview updates
- WebView panel integration
- File watcher with debounce

### Changed
- Improved layout engine positioning

### Fixed
- Memory leak on panel dispose
- Parse errors in nested structures

## [0.1.0] — 2026-04-20

### Added
- Initial VS Code extension scaffolding
- Basic lexer implementation
```

---

## Aplicación

Cargar este skill al:
- Actualizar CHANGELOG
- Preparar release
- Versionar proyecto