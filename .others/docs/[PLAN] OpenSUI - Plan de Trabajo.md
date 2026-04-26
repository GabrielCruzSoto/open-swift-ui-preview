# PLAN - Plan de Trabajo

**Proyecto:** OpenSUI - Extensión de Visual Studio Code para Previsualización de SwiftUI

**Versión del documento:** 1.0

**Fecha:** 25 de abril de 2026

**Autor:** OpenSUI Dev Agent

---

## 1. Visión General del Plan

Este documento establece el plan de trabajo detallado para el desarrollo de OpenSUI en 7 fases incrementales. Cada fase construye sobre la anterior, permitiendo validación continua del progreso.

### 1.1 Fases del Proyecto

| # | Nombre | Descripción | Dependencias |
|---|--------|-------------|---------------|
| 1 | Fundamentos | Scaffolding de la extensión VS Code y estructura base | Ninguna |
| 2 | Motor de Parsing | Lexer y parser de SwiftUI | Fase 1 |
| 3 | Motor de Renderizado | Layout engine y generación visual | Fase 2 |
| 4 | Integración VS Code | Panel, comandos y eventos | Fases 1-3 |
| 5 | Dispositivos y UI | Selector de dispositivos y marcos iPhone | Fase 4 |
| 6 | Optimización | Rendimiento, tiempo real, manejo de errores | Fases 1-5 |
| 7 | Testing y Documentación | Pruebas, CI/CD y documentación final | Fases 1-6 |

### 1.2 Duración Total Estimada

| Fase | Duración estimada |
|------|------------------|
| Fase 1 | 2-3 días |
| Fase 2 | 3-5 días |
| Fase 3 | 4-6 días |
| Fase 4 | 3-4 días |
| Fase 5 | 2-3 días |
| Fase 6 | 2-3 días |
| Fase 7 | 3-4 días |
| **Total** | **19-28 días** |

---

## 2. Fase 1 — Fundamentos

### 2.1 Objetivo

Establecer la estructura base de la extensión VS Code, incluyendo configuración del proyecto, estructura de directorios, y configuración de herramientas de desarrollo.

### 2.2 Entradas

- Documento de diseño (DESIGN)
- package.json base con dependencias VS Code
- TypeScript configuration

### 2.3 Salidas

```
src/
├── main.ts               # Entry point de la extensión
├── parser/
│   └── index.ts         # Exports del módulo
├── renderer/
│   └── index.ts        # Exports del módulo
└── vscode/
    └── index.ts       # Exports del módulo

package.json            # Dependencias configuradas
tsconfig.json          # TypeScript config
.eslintrc.json         # ESLint config
.vscode/
└── launch.json        # Configuración de debug
```

### 2.4 Tareas Técnicas

1. **Inicializar proyecto npm**
   - Crear package.json con metadata
   - Configurar dependencies (vscode, typescript)
   - Configurar devDependencies

2. **Configurar TypeScript**
   - Crear tsconfig.json con strict mode
   - Configurar paths y aliases
   - Setup de compilación

3. **Configurar ESLint/Prettier**
   - Crear configuración de linting
   - Configurar rules de código
   - Integrar con package.json scripts

4. **Crear estructura de directorios**
   - Crear módulos: parser, renderer, vscode
   - Configurar exports de cada módulo

5. **Implementar entry point**
   - Crear main.ts con estructura básica
   - Registrar comandos vacío
   - Configurar activationEvents

6. **Configurar VS Code debugging**
   - Crear launch.json
   - Configurar tasks de build

### 2.5 Criterios de Aceptación

- [ ] Extensión se carga en VS Code sin errores
- [ ] Comando "Hello World" registrado y funcional
- [ ] `npm run build` compila sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Estructura de directorios coincide con DESIGN

### 2.6 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Configuración de VS Code compleja | Media | Alto | Usar template de vscode-extension-typescript como referencia |
| Dependencias incompatibles | Baja | Alto | Usar versiones estables documentadas |

---

## 3. Fase 2 — Motor de Parsing

### 3.1 Objetivo

Implementar el lexer y parser que tokeniza y parsea código SwiftUI para generar un AST representativo.

### 3.2 Entradas

- DESIGN doc, sección 2 (Lexer) y 3 (Parser)
- Fase 1 completada con estructura de directorios

### 3.3 Salidas

```
src/
├── parser/
│   ├── types.ts         # Token, AST types
│   ├── lexer.ts         # Lexer implementation
│   ├── parser.ts        # Parser implementation
│   └── swiftui-parser.ts # High-level facade

tests/
└── parser/
    ├── lexer.test.ts   # Lexer tests
    ├── parser.test.ts  # Parser tests
    └── fixtures/        # Test fixtures
        ├── basic-view.swift
        ├── nested-stack.swift
        └── full-example.swift
```

### 3.4 Tareas Técnicas

1. **Implementar tipos del Lexer**
   - Definir TokenType enum
   - Definir Token interface
   - Crear regex patterns

2. **Implementar Lexer**
   - Crear clase Lexer
   - Implementar tokenize()
   - Manejar position tracking
   - Manejar errores léxicos

3. **Implementar tipos del Parser**
   - Definir SwiftUIComponentTree
   - Definir SwiftUIComponent
   - Definir ComponentProperties
   - Definir Modifier types

4. **Implementar Parser**
   - Crear clase Parser
   - Implementar parseViewDeclaration()
   - Implementar parseComponent()
   - Implementar parseArguments()
   - Implementar parseModifiers()

5. **Implementar SwiftUIParser facade**
   - Crear clase SwiftUIParser
   - Expose parse() y isSwiftUIFile()

6. **Escribir tests del Lexer**
   - Test tokenización básica
   - Test componentes SwiftUI
   - Test modificadores
   - Test casos borde

7. **Escribir tests del Parser**
   - Test parsing básico
   - Test anidamiento (hasta 10 niveles)
   - Test componentes soportados

8. **Crear test fixtures**
   - Crear archivos SwiftUI de prueba

### 3.5 Criterios de Aceptación

- [ ] `tsc --noEmit` sin errores
- [ ] Tests del lexer pasan (cobertura ≥ 80%)
- [ ] Tests del parser pasan (cobertura ≥ 80%)
- [ ] Parser reconoce componentes: Text, VStack, HStack, ZStack, Button, Image, etc.
- [ ] Parser maneja anidamiento hasta 10 niveles

### 3.6 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Parser no maneja SwiftUI avanzado | Media | Medio | Limitar a subconjunto definido en SPEC |
| Errores de posición en tokens | Baja | Medio | Tests exhaustivos de position tracking |

---

## 4. Fase 3 — Motor de Renderizado

### 4.1 Objetivo

Implementar el motor que convierte el AST en imagen visual renderizada usando node-canvas.

### 4.2 Entradas

- DESIGN doc, sección 4 (Renderer)
- Fase 2 completada con parser funcional

### 4.3 Salidas

```
src/
├── renderer/
│   ├── types.ts            # Renderer types
│   ├── layout-engine.ts   # Layout calculations
│   ├── component-mapper.ts # Style mapping
│   ├── canvas-renderer.ts # Canvas rendering
│   └── index.ts           # Exports

tests/
└── renderer/
    ├── layout-engine.test.ts
    ├── component-mapper.test.ts
    ├── canvas-renderer.test.ts
    └── fixtures/
        └── layout-*.json
```

### 4.4 Tareas Técnicas

1. **Implementar tipos del Renderer**
   - Definir LayoutNode
   - Definir ComputedLayout
   - Definir RenderStyle

2. **Implementar Layout Engine**
   - Crear clase LayoutEngine
   - Implementar computeLayout()
   - Implementar computeContainerLayout()
   - Manejar alignment y spacing

3. **Implementar Component Mapper**
   - Crear clase ComponentMapper
   - Implementar mapToStyle()
   - Resolver colores del sistema
   - Resolver fonts

4. **Implementar Canvas Renderer**
   - Crear clase CanvasRenderer
   - Implementar render()
   - Implementar renderNode() para cada tipo
   - Manejar wrapText() para multilínea

5. **Implementar Device Frame**
   - Crear módulo de composición de frame
   - Implementar composeWithFrame()

6. **Escribir tests del Layout Engine**
   - Test cálculos de tamaño
   - Test alignment
   - Test spacing

7. **Escribir tests del Component Mapper**
   - Test mapping de estilos
   - Test resolución de colores

8. **Escribir tests del Canvas Renderer**
   - Test generación de imagen
   - Test renderizado de componentes

### 4.5 Criterios de Aceptación

- [ ] `tsc --noEmit` sin errores
- [ ] Tests pasan con cobertura ≥ 80%
- [ ] Genera imagen PNG válida
- [ ] Layout correcto según alignment/spacing del código
- [ ] Tiempo de renderizado < 2s

### 4.6 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| node-canvas performance | Media | Alto | Optimizar render batching |
| Imágenes sistema no disponibles | Alta | Medio | Usar placeholders Unicode |

---

## 5. Fase 4 — Integración VS Code

### 5.1 Objetivo

Integrarparser y renderer con VS Code para mostrar previsualización en WebView panel.

### 5.2 Entradas

- DESIGN doc, sección 5 (VS Code Integration)
- Fases 1-3 completadas

### 5.3 Salidas

```
src/
└── vscode/
    ├── commands.ts       # Command registration
    ├── preview-panel.ts # WebView panel
    ├── file-watcher.ts # File change detection
    └── extension.ts   # Main integration

tests/
└── vscode/
    ├── commands.test.ts
    ├── preview-panel.test.ts
    └── file-watcher.test.ts
```

### 5.4 Tareas Técnicas

1. **Implementar comandos VS Code**
   - Crear definitions de comandos
   - Registrar comandos en extension.ts
   - Implementar handlers

2. **Implementar WebView Panel**
   - Crear clase PreviewPanel
   - Implementar create(), show(), hide()
   - Configurar HTML/CSS del panel
   - Implementar messaging

3. **Implementar File Watcher**
   - Crear clase FileWatcher
   - Implementar debounce
   - Conectar con parser/renderer

4. **Integrar extensión completa**
   - Conectar comandos con panel
   - Conectar file watcher con preview
   - Implementar lifecycle

5. **Escribir tests de integración**
   - Test comando registration
   - Test panel lifecycle
   - Test file watcher

### 5.5 Criterios de Aceptación

- [ ] `npm run build` sin errores
- [ ] Tests pasan
- [ ] Panel se abre en VS Code
- [ ] Preview se muestra con imagen
- [ ] Cambios en códigoactualizan preview

### 5.6 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| WebView messaging complejo | Media | Alto | Usar patrón simple request/response |
| File watcher memory leaks | Baja | Alto | Cleanup apropiada de watchers |

---

## 6. Fase 5 — Dispositivos y UI

### 6.1 Objetivo

Implementar selector de dispositivos y generar marcos visuales de iPhone.

### 6.2 Entradas

- DESIGN doc, sección 5.4 (Device Models)
- Fase 4 completada

### 6.3 Salidas

```
src/
└── vscode/
    ├── device-selector.ts   # Device selection UI
    ├── device-models.ts   # Device definitions
    └── preview-panel.ts  # Updated with device frame

assets/
└── device-frames/
    ├── iphone-15/
    │   ├── iphone15-frame.png
    │   ├── iphone15pro-frame.png
    │   └── ...
    ├── iphone-16/
    └── iphone-17/

tests/
└── vscode/
    └── device-selector.test.ts
```

### 6.4 Tareas Técnicas

1. **Implementar Device Models**
   - Definir DeviceModel interface
   - Crear DeviceModels const con todas las variantes
   - iPhone 15/16/17 series

2. **Implementar Device Selector**
   - Crear clase DeviceSelector
   - Implementar UI de selección
   - Persistir selección

3. **Crear Device Frames**
   - Generar marcos PNG para cada dispositivo
   - Usar diseño consistente
   - Incluir notch, bordes redondeados

4. **Integrar con Preview Panel**
   - Actualizar panel para compositear frame
   - Actualizar dimensiones según device

5. **Escribir tests**
   - Test device selection
   - Test persistence

### 6.5 Criterios de Aceptación

- [ ] Tests pasan
- [ ] Selector muestra todos los dispositivos
- [ ] Cambio de dispositivo actualiza preview
- [ ] Frame visual correcto

### 6.6 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Frames no disponibles | Media | Medio | Generar programmatically |
| UI selector compleja | Baja | Medio | Usar QuickPick simple |

---

## 7. Fase 6 — Optimización

### 7.1 Objetivo

Optimizar rendimiento, tiempo real, y manejo de errores según requisitos no funcionales.

### 7.2 Entradas

- SPEC doc, sección 3.2 (RNF-002)
- Fases 1-5 completadas

### 7.3 Salidas

```
src/
├── parser/
│   └── optimized-parser.ts  # Parser optimizado
├── renderer/
│   └── optimized-renderer.ts # Renderer optimizado
└── vscode/
    └── optimized-watcher.ts # Watcher optimizado

tests/
└── performance/
    ├── benchmark-parser.ts
    ├── benchmark-renderer.ts
    └── stress-test.ts
```

### 7.4 Tareas Técnicas

1. **Optimizar Parser**
   - Implementar memoización
   - Optimizar regex patterns
   - Reducir allocations

2. **Optimizar Renderer**
   - Implementar render batching
   - Cachear estilos
   - Parallelizar si es posible

3. **Optimizar File Watcher**
   - Ajustar debounce timing
   - Implementar cancellation
   - Prevenir memoria leaks

4. **Manejo de Errores**
   - Implementar error boundaries
   - Logging estructurado
   - Recovery strategies

5. **Performance Testing**
   - Benchmark de tiempos
   - Memory profiling
   - Stress testing

### 7.5 Criterios de Aceptación

- [ ] Parseo < 1s
- [ ] Renderizado < 2s
- [ ] Update en cambio < 3s
- [ ] Memoria idle < 200MB

### 7.6 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Objetivos de perf no logrados | Media | Medio | Perfilado y tuning iterativo |

---

## 8. Fase 7 — Testing y Documentación

### 8.1 Objetivo

Completar testing, configurar CI/CD, y generar documentación final.

### 8.2 Entradas

-Todas las fases anteriores completadas

### 8.3 Salidas

```
.github/
└── workflows/
    ├── ci.yml    # GitHub Actions CI
    └── release.yml # Release workflow

tests/  # Suite completa con coverage ≥ 80%

README.md        # Documentación de uso
CONTRIBUTING.md  # Guía de contribuciones
CHANGELOG.md    # Registro de cambios

package.json    # Scripts completos
```

### 8.4 Tareas Técnicas

1. **Completar Testing**
   - Coverage análisis
   - Tests faltantes
   - Integration tests

2. **Configurar CI/CD**
   - GitHub Actions workflow
   - Automatizar tests
   - Automatizar build

3. **Generar Documentación**
   - README.md completo
   - CONTRIBUTING.md
   - CHANGELOG.md

4. **Finalización**
   - Versionado semántico
   - Package para distribución
   - Validación final

### 8.5 Criterios de Aceptación

- [ ] Coverage ≥ 80%
- [ ] CI workflow funcional
- [ ] README completo
- [ ] Extensión lista para distribución

### 8.6 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Coverage < 80% | Baja | Medio | Tests adicionales |

---

## 9. Dependencias entre Fases

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPENDENCIAS DE FASES                          │
└─────────────────────────────────────────────────────────────────┘

Fase 1 ────────┐
  (Fundamentos)  │
               │
Fase 2 ────────┼──> Fase 3 ────────> Fase 4 ────────> Fase 5 ────────> Fase 6 ────────> Fase 7
  (Parser)       (Renderer)       (VS Code)       (Devices)       (Opt)          (Tests)

  Requiere:       Requiere:       Requiere:       Requiere:       Requiere:       Requiere:
  - Fase 1       - Fase 2       - Fases 1-3   - Fase 4     - Fases 1-5   - Todas
```

---

## 10. Validación de Avance

### 10.1 Checkpoints por Fase

| Fase | Checkpoint | Criterio |
|------|-----------|----------|
| 1 | Extensión cargada | Hello command funciona |
| 2 | Parser tests green | Coverage ≥ 80% |
| 3 | Renderer tests green | Coverage ≥ 80% |
| 4 | Preview visible | Panel muestra imagen |
| 5 | Device selector | Cambio device actualiza |
| 6 | Perf meets RNF | Tiempos < límites |
| 7 | Coverage ≥ 80% | CI green |

### 10.2 Criterios de Release

- [ ] Todas las fases completadas
- [ ] Coverage ≥ 80%
- [ ] CI pasando
- [ ] Documentation completa
- [ ] Build produce .vsix válido

---

## 11. Referencias

- [DESIGN] OpenSUI - Diseno de la Solucion.md
- [SPEC] OpenSUI - Especificacion de Requerimientos de Software.md
- [IDEA] OpenSwiftUI Preview.md

---

**Fin del documento**

End of file