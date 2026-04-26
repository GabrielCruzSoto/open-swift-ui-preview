# Git Workflow

## Objetivo

Establecer el flujo de trabajo con Git para el proyecto OpenSUI.

---

## Rama Principal

```
main
├── Releases estables
└── Solo accepts merges de develop
```

## Rama de Desarrollo

```
develop
├── Integración de features
├── Rama base para fases
└── Siempre lista para desarrollo
```

## Ramas de Fase

```
fase-N-nombre
├── Creada desde develop
├── Contiene trabajo de una fase
├── Commits atómicos
└── Merge via PR cuando completa
```

---

## Flujo de Trabajo

### 1. Iniciar nueva fase

```bash
git checkout develop
git pull origin develop
git checkout -b fase-N-nombre
```

### 2. Trabajar en la fase

```bash
# Commits atómicos
git add .
git commit -m "feat(scope): descripción"
git push origin fase-N-nombre
```

### 3. Completar fase

```bash
# Crear PR en GitHub
gh pr create --title "Fase N: Nombre" --body "Completa fase N"

# O merge manual
git checkout develop
git merge fase-N-nombre
git push origin develop
```

---

## Conventional Commits

```
tipo(scope): descripción

feat(parser): add Lexer implementation
fix(renderer): resolve memory leak in canvas
test(vscode): add panel lifecycle tests
docs(readme): update installation guide
chore(deps): update vscode dependency
```

### Tipos válidos

| Tipo | Uso |
|------|-----|
| feat | Nueva funcionalidad |
| fix | Bug fix |
| test | Tests |
| docs | Documentación |
| refactor | Refactorización |
| chore | Mantenimiento |

---

## Resolución de Conflictos

```bash
# 1. Traer cambios de develop
git fetch origin develop

# 2. Rebase sobre develop
git rebase origin/develop

# 3. Resolver conflictos
git add .
git rebase --continue

# 4. Push con force (si es necesario)
git push --force-with-lease origin fase-N-nombre
```

---

## Tags y Releases

```bash
# Tag de versión
git tag v1.0.0
git push origin v1.0.0

# Tag de fase (opcional)
git tag fase-2-complete
git push origin fase-2-complete
```

---

## Aplicación

Cargar este skill al:
- Iniciar nueva rama
- Resolver conflictos
- Crear releases