# AGENTS.md — OpenSUI Agent Configuration

> Versión: 1.0 | Proyecto: OpenSUI

---

## Propósito

Este documento establece el comportamiento esperado del agente de desarrollo en el proyecto OpenSUI, incluyendo protocolos de trabajo, estrategias de branching, y políticas de calidad.

---

## Comportamiento del Agente

### Modos de Operación

| Modo | Activación | Descripción |
|------|------------|-------------|
| **Planificación** | Análisis inicial | Solo lectura, no modifica archivos |
| **Build** | Confirmación del usuario | Puede generar código y ejecutar comandos |
| **Review** | Solicitud explícita | Revisa código existente |

### Protocolo de Razonamiento

El agente debe seguir el protocolo C.O.R.E. en cada tarea:

```
[THINK]   → Identificar información necesaria
[PLAN]    → Definir orden de ejecución
[ACT]     → Generar entregable
[VERIFY]  → Confirmar criterios de aceptación
```

### Protocolo de Progreso

Reportar avances en cada milestone:

```
[PROGRESS] Fase N: tarea X/Y completada
```

Ejemplo:
```
[PROGRESS] Fase 2: 3/8 tareas completadas - Lexer implementado
```

### Protocolo de Decisiones

Cuando se requiera decisión del usuario:

```
[DECISION REQUIRED] Opción A vs B
Impacto: [descripción del impacto]
Recomendación: [opción recomendada con justificación]
```

---

## Estrategia de Branching

### Modelo de Ramas

```
main    ────●────────────────●────────────> releases
            ↑                ↑
develop ────●───────●───────●──> integración
              ↑     ↑     ↑
fase-1-xxx───●─●────●─●────
fase-2-xxx─────────●─●────
```

### Nomenclatura de Ramas

| Prefijo | Uso | Ejemplo |
|--------|-----|--------|
| `fase-N-nombre` | Trabajo por fase | `fase-2-motor-de-parsing` |
| `feature/nombre` | Features | `feature/nuevo-componente` |
| `fix/nombre` | Bug fixes | `fix-parser-error` |
| `docs/nombre` | Documentación | `docs-readme` |

### Ciclo de Vida de Rama

1. Crear desde `develop`
2.Trabajar con commits atómicos
3. Push regularmente
4. Crear PR cuando la fase complete
5. Merge a `develop` tras approval

---

## Política de Commits

### Formato Obligatorio

```
tipo(scope): descripción

[tipo]feat|fix|test|docs|refactor|chore
[scope]parser|renderer|vscode|tests|docs
[descripción] acción clara en presente
```

### Ejemplos Válidos

```bash
feat(parser): add Lexer with tokenization
feat(renderer): implement Layout Engine
fix(vscode): resolve panel disposal memory leak
test(parser): add tokenizer edge case tests
docs(readme): add installation instructions
chore(deps): update vscode to v1.86.0
```

### Regla deCommits Atómicos

- **SIEMPRE**: Un commit por tarea técnica completada
- **JAMÁS**: Commits enormes con múltiples cambios no relacionados

---

## Política de Edición

### Cuándo Crear vs Editar

| Situación | Acción |
|----------|--------|
| Módulo existente tiene el tipo de archivo | Editar |
| Nueva funcionalidad en módulo nuevo | Crear archivo |
| Refactorización grande | Nueva rama, nuevos archivos |

### Preservación de Contexto

- **SIEMPRE**: Leer archivo existente antes de editar
- **REQUERIDO**: Usar `Read` tool antes de `edit`
- **PROHIBIDO**: Editar sin haber leído el archivo

---

## Criterios de Calidad

### Checkpoints Obligatorios

| Fase | Checkpoint | Verificación |
|------|-----------|--------------|
| Cualquiera | Compilación | `tsc --noEmit` sin errores |
| Cualquiera | Linting | `npm run lint` sin errores |
| Fase 2+ | Tests | Tests pasan |
| Fase 2+ | Coverage | ≥ 80% si aplica |
| Fase 7 | Release | Coverage ≥ 80% |

### Regla de Avance

```
❌ NUNCA avances a la siguiente fase si la actual tiene criterios sin cumplir
❌ NUNCA omitas tests de un módulo que implementaste
❌ NUNCA generes código que no compila

✅ SIEMPRE reporta progreso al completar tareas
✅ SIEMPRE usa Conventional Commits
✅ SIEMPRE actualiza CHANGELOG.md
```

---

## Documentos de Referencia

| Documento | Propósito |
|----------|----------|
| `docs/[DESIGN]` | Arquitectura y diseño |
| `docs/[PLAN]` | Plan de trabajo |
| `requirements.md` | Dependencias y scripts |
| `skills/*` | Reglas específicas |

---

**Fin del documento**