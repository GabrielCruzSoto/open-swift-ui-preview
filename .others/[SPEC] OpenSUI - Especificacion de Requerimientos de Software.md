# SPEC - Especificación de Requerimientos de Software

**Proyecto:** OpenSUI - Extensión de Visual Studio Code para Previsualización de SwiftUI

**Versión del documento:** 1.0

**Fecha:** 24 de abril de 2026

**Autor:** Analista de Software Senior

---

## 1. Introducción

### 1.1 Propósito

Este documento establece la especificación de requerimientos de software para **OpenSUI**, una extensión de Visual Studio Code diseñada para previsualizar vistas de SwiftUI en tiempo real. El propósito de este documento es definir de manera clara y precisa los requerimientos funcionales y no funcionales del sistema, sirviendo como acuerdo entre los interesados (stakeholders) y el equipo de desarrollo.

### 1.2 Alcance del producto

OpenSUI es una extensión de VS Code que permite a los desarrolladores visualizar el diseño de sus vistas SwiftUI sin necesidad de ejecutar Xcode o tener hardware Apple. La extensión parsea el código fuente SwiftUI del archivo seleccionado y renderiza una previsualización gráfica dentro de un marco de dispositivo iPhone simulado, todo dentro del entorno de VS Code.

### 1.3 Definiciones, acrónimos y abreviaturas

| Término | Definición |
|---------|------------|
| **SwiftUI** | Framework de Apple para construir interfaces de usuario de forma declarativa |
| **VS Code** | Visual Studio Code, editor de código fuente desarrollado por Microsoft |
| **Previsualización** | Renderizado gráfico de una vista SwiftUI en formato de imagen estática |
| **Marco de dispositivo** | Representación visual (imagen) del bisel de un iPhone |
| **Motor de renderizado** | Componente interno que interpreta y convierte código SwiftUI en representación visual |
| **Extensión VS Code** | Plugin que extiende la funcionalidad del editor VS Code |

### 1.4 Referencias

| Referencia | Descripción |
|------------|-------------|
| SwiftUI Documentation | Documentación oficial de Apple para el framework SwiftUI |
| VS Code Extension API | Guía oficial para desarrollo de extensiones de Visual Studio Code |
| Swift Language Guide | Guía del lenguaje de programación Swift |

---

## 2. Descripción general del producto

### 2.1 Perspectiva del producto

OpenSUI es una herramienta de desarrollo que opera como extensión de Visual Studio Code. El producto no requiere comunicación con dispositivos físicos externos; toda la previsualización se realiza dentro del entorno de VS Code mediante una pestaña adicional que muestra una representación gráfica del archivo SwiftUI seleccionado.

### 2.2 Funciones del producto

#### 2.2.1 Función principal

La función principal de OpenSUI es parsear código fuente SwiftUI y generar una previsualización gráfica en tiempo real que se actualiza conforme el desarrollador modifica el código.

#### 2.2.2 Funciones secundarias

1. **Detección de archivos SwiftUI**: Identificar automáticamente archivos `.swift` que contengan vistas SwiftUI.
2. **Motor de renderizado propio**: Interpretar el código fuente SwiftUI y convertirlo en una representación visual.
3. **Selección de dispositivo**: Permitir al usuario elegir entre diferentes modelos de iPhone (series 15, 16, 17) para visualizar el diseño.
4. **Actualización en tiempo real**: Reflejar cambios en el código fuente de forma inmediata en la previsualización.
5. **Visualización en pestaña**: Abrir la previsualización en una pestaña dedicada dentro de VS Code.

### 2.3 Características de los usuarios

#### 2.3.1 Usuarios objetivo

| Perfil | Descripción |
|--------|-------------|
| **Desarrolladores cross-platform** | Profesionales que trabajan en Windows o Linux y desarrollan para iOS |
| **Equipos distribuidos** | Organizaciones con equipos que no tienen acceso a hardware Apple |
| **Aprendices de SwiftUI** | Personas que desean aprender el framework sin inversión en Mac |
| **Diseñadores UI** | Profesionales que necesitan verificar diseños SwiftUI rápidamente |

#### 2.3.2 Entorno de uso

- Sistema operativo: Windows, Linux, macOS
- Editor requerido: Visual Studio Code
- Requisitos adicionales: Ninguno (no requiere iPhone físico ni Mac)

### 2.4 Restricciones del diseño

1. **Sin comunicación externa**: OpenSUI no se comunica con ningún dispositivo físico
2. **Renderizado propio**: El motor de renderizado es una implementación independiente, no utiliza Xcode
3. **Componentes básicos**: Solo se soportan componentes básicos de SwiftUI
4. **Representación estática**: La previsualización es una imagen, no una ejecución interactiva

---

## 3. Requisitos específicos

### 3.1 Requisitos funcionales

#### RF-001: Detección de archivo SwiftUI activo

| Atributo | Descripción |
|----------|-------------|
| **Código** | RF-001 |
| **Título** | Detección de archivo SwiftUI activo |
| **Descripción** | El sistema debe identificar cuando el usuario selecciona o edita un archivo `.swift` que contenga una vista SwiftUI (estructura que conforme con el protocolo `View`) |
| **Prioridad** | Alta |
| **Entrada** | Archivo `.swift` activo en el editor |
| **Proceso** | Analizar el código fuente para detectar structs que implementen el protocolo `View` |
| **Salida** | Booleano indicando si el archivo es una vista SwiftUI válida |

**Criterios de aceptación:**
- [ ] El sistema detecta archivos `.swift` con estructuras que implementen `View`
- [ ] El sistema ignora archivos Swift que no contengan vistas SwiftUI
- [ ] La detección ocurre automáticamente al cambiar de archivo

#### RF-002: Motor de parseo de código SwiftUI

| Atributo | Descripción |
|----------|-------------|
| **Código** | RF-002 |
| **Título** | Motor de parseo de código SwiftUI |
| **Descripción** | El motor debe interpretar el código fuente SwiftUI mediante análisis léxico y sintáctico del archivo, extrayendo información de componentes UI, sus propiedades y jerarquía |
| **Prioridad** | Crítica |
| **Entrada** | Código fuente del archivo SwiftUI seleccionado |
| **Proceso** | Tokenización y parsing del código para identificar componentes SwiftUI |
| **Salida** | Estructura de datos con la jerarquía de componentes y sus propiedades |

**Criterios de aceptación:**
- [ ] El motor identifica componentes: `Text`, `VStack`, `HStack`, `ZStack`, `Button`, `Image`, `List`, `ScrollView`, `Spacer`, `Divider`, `Toggle`, `Slider`, `TextField`, `Picker`, `NavigationStack`, `TabView`
- [ ] El motor extrae propiedades de cada componente (texto, colores, alineación, spacing)
- [ ] El motor procesa anidamiento de componentes hasta 10 niveles de profundidad

#### RF-003: Motor de renderizado gráfico

| Atributo | Descripción |
|----------|-------------|
| **Código** | RF-003 |
| **Título** | Motor de renderizado gráfico |
| **Descripción** | Convertir la estructura de datos parseada en una representación visual (imagen) que muestre los componentes UI posicionados correctamente |
| **Prioridad** | Crítica |
| **Entrada** | Estructura de datos con jerarquía de componentes |
| **Proceso** | Generación de imagen con posicionamiento y estilos aplicados |
| **Salida** | Imagen en formato PNG/JPEG del diseño renderizado |

**Criterios de aceptación:**
- [ ] La imagen generada muestra todos los componentes en su posición correcta
- [ ] Los estilos (colores, fuentes, espaciado) se aplican según el código
- [ ] El renderizado es independiente de Xcode (implementación propia)
- [ ] El tiempo de renderizado es menor a 2 segundos para vistas simples

#### RF-004: Visualización en marco de dispositivo

| Atributo | Descripción |
|----------|-------------|
| **Código** | RF-004 |
| **Título** | Visualización en marco de dispositivo |
| **Descripción** | Mostrar la previsualización dentro de un marco gráfico que simule la apariencia de un iPhone físico |
| **Prioridad** | Alta |
| **Entrada** | Imagen renderizada y modelo de dispositivo seleccionado |
| **Proceso** | Componer la imagen del renderizado dentro del marco del dispositivo |
| **Salida** | Imagen final con marco de iPhone aplicado |

**Criterios de aceptación:**
- [ ] Se muestra un marco visual de iPhone alrededor de la previsualización
- [ ] El marco corresponde al modelo de dispositivo seleccionado
- [ ] El marco incluye detalles realistas (notch, bordes redondeados)

#### RF-005: Selector de modelo de dispositivo

| Atributo | Descripción |
|----------|-------------|
| **Código** | RF-005 |
| **Título** | Selector de modelo de dispositivo |
| **Descripción** | Permitir al usuario seleccionar el modelo de iPhone para la previsualización entre las series disponibles |
| **Prioridad** | Alta |
| **Entrada** | Selección del usuario |
| **Proceso** | Actualizar el marco y dimensiones de visualización |
| **Salida** | Previsualización con el nuevo marco aplicado |

**Dispositivos soportados:**

| Serie | Modelos disponibles |
|-------|---------------------|
| iPhone 15 | iPhone 15, iPhone 15 Plus, iPhone 15 Pro, iPhone 15 Pro Max |
| iPhone 16 | iPhone 16, iPhone 16 Plus, iPhone 16 Pro, iPhone 16 Pro Max |
| iPhone 17 | iPhone 17, iPhone 17 Plus, iPhone 17 Pro, iPhone 17 Pro Max |

**Criterios de aceptación:**
- [ ] El usuario puede seleccionar cualquier modelo de las series 15, 16 y 17
- [ ] Al cambiar de dispositivo, la previsualización se actualiza con las nuevas dimensiones de pantalla
- [ ] El último dispositivo seleccionado persiste entre sesiones

#### RF-006: Actualización en tiempo real

| Atributo | Descripción |
|----------|-------------|
| **Código** | RF-006 |
| **Título** | Actualización en tiempo real |
| **Descripción** | Reflejar automáticamente los cambios realizados en el código SwiftUI en la previsualización |
| **Prioridad** | Alta |
| **Entrada** | Eventos de cambio en el editor de código |
| **Proceso** | Detectar modificación → Re-parsear → Re-renderizar |
| **Salida** | Previsualización actualizada |

**Criterios de aceptación:**
- [ ] Los cambios en el código se reflejan en la previsualización en menos de 3 segundos
- [ ] La actualización ocurre automáticamente sin intervención del usuario
- [ ] No se pierde el estado de selección de dispositivo durante la actualización

#### RF-007: Apertura en pestaña de VS Code

| Atributo | Descripción |
|----------|-------------|
| **Código** | RF-007 |
| **Título** | Apertura en pestaña de VS Code |
| **Descripción** | La previsualización debe mostrarse en una pestaña dedicada dentro de VS Code |
| **Prioridad** | Crítica |
| **Entrada** | Comando del usuario o detección de archivo SwiftUI |
| **Proceso** | Crear/activar pestaña de previsualización |
| **Salida** | Pestaña visible con la previsualización |

**Criterios de aceptación:**
- [ ] La previsualización se muestra en una pestaña titled "OpenSUI Preview"
- [ ] Se puede tener la previsualización y el código abiertos simultáneamente
- [ ] La pestaña se puede cerrar y reabrir sin perder estado

#### RF-008: Comando de activación manual

| Atributo | Descripción |
|----------|-------------|
| **Código** | RF-008 |
| **Título** | Comando de activación manual |
| **Descripción** | Proveer un comando en la paleta de comandos de VS Code para activar la previsualización |
| **Prioridad** | Media |
| **Entrada** | Comando "OpenSUI: Start Preview" en paleta de comandos |
| **Proceso** | Activar detección y mostrar previsualización |
| **Salida** | Apertura de la pestaña de previsualización |

**Criterios de aceptación:**
- [ ] El comando aparece en la paleta de comandos de VS Code
- [ ] El comando tiene el nombre "OpenSUI: Start Preview"
- [ ] El comando tiene un icono representativo

### 3.2 Requisitos no funcionales

#### RNF-001: Compatibilidad con versiones de SwiftUI

| Atributo | Descripción |
|----------|-------------|
| **Código** | RNF-001 |
| **Título** | Compatibilidad con versiones de SwiftUI |
| **Descripción** | El sistema debe soportar la última versión disponible del framework SwiftUI |
| **Prioridad** | Alta |
| **Versión objetivo** | Última versión GA de SwiftUI al momento del desarrollo |

**Criterios de aceptación:**
- [ ] Componentes nuevos de la última versión de SwiftUI son reconocidos
- [ ] La documentación indica claramente la versión de SwiftUI soportada

#### RNF-002: Rendimiento de renderizado

| Atributo | Descripción |
|----------|-------------|
| **Código** | RNF-002 |
| **Título** | Rendimiento de renderizado |
| **Descripción** | El tiempo de respuesta del sistema debe ser óptimo para no interrumpir el flujo de trabajo del desarrollador |
| **Prioridad** | Alta |

| Métrica | Valor objetivo |
|---------|----------------|
| Tiempo de parseo inicial | < 1 segundo |
| Tiempo de renderizado | < 2 segundos |
| Tiempo de actualización en cambio | < 3 segundos |
| Uso de memoria en idle | < 200 MB |

#### RNF-003: Compatibilidad multiplataforma

| Atributo | Descripción |
|----------|-------------|
| **Código** | RNF-003 |
| **Título** | Compatibilidad multiplataforma |
| **Descripción** | La extensión debe funcionar correctamente en los tres sistemas operativos principales |
| **Prioridad** | Crítica |

**Entornos soportados:**

| Sistema operativo | Versión mínima |
|-------------------|----------------|
| Windows | Windows 10 (64-bit) |
| macOS | macOS 10.15 (Catalina) |
| Linux | Ubuntu 18.04+, Debian 10+ |

#### RNF-004: Modelo de distribución

| Atributo | Descripción |
|----------|-------------|
| **Código** | RNF-004 |
| **Título** | Modelo de distribución |
| **Descripción** | El producto será distribuido de forma gratuita y con código fuente abierto |
| **Prioridad** | Alta |
| **Licencia** | Open Source (por definir: MIT, Apache 2.0, GPL) |

#### RNF-005: Documentación técnica

| Atributo | Descripción |
|----------|-------------|
| **Código** | RNF-005 |
| **Título** | Documentación técnica |
| **Descripción** | El proyecto debe contar con documentación técnica adecuada |
| **Prioridad** | Media |

**Documentos requeridos:**

| Documento | Descripción |
|-----------|-------------|
| README.md | Guía de instalación y uso básico |
| CONTRIBUTING.md | Guía para contribuciones al proyecto |
| API.md | Documentación de APIs internas (si aplica) |
| CHANGELOG.md | Registro de cambios entre versiones |

### 3.3 Requisitos de interfaz

#### 3.3.1 Interfaces de usuario

##### IU-001: Panel de previsualización

| Elemento | Descripción |
|----------|-------------|
| **Tipo** | Pestaña de VS Code |
| **Componentes** | Marco de dispositivo + Imagen renderizada |
| **Controles** | Selector de dispositivo (dropdown) |

**Mockup conceptual:**

```
┌─────────────────────────────────────────────┐
│ OpenSUI Preview                       [X] │
├─────────────────────────────────────────────┤
│ Dispositivo: [iPhone 15 Pro        ▼]       │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ ████████████████████████████████        │ │
│ │ ████████████████████████████████        │ │
│ │ ██  ┌────────────────────┐    ██        │ │
│ │ ██  │    Hello World     │    ██        │ │
│ │ ██  │                    │    ██        │ │
│ │ ██  │   ┌──────────┐     │    ██        │ │
│ │ ██  │   │  Button   │     │    ██        │ │
│ │ ██  │   └──────────┘     │    ██        │ │
│ │ ██  │                    │    ██        │ │
│ │ ██  └────────────────────┘    ██        │ │
│ │ ████████████████████████████████        │ │
│ │ ████████████████████████████████        │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

##### IU-002: Paleta de comandos

| Comando | Descripción |
|---------|-------------|
| `OpenSUI: Start Preview` | Activa la previsualización del archivo actual |
| `OpenSUI: Stop Preview` | Detiene la previsualización |
| `OpenSUI: Select Device` | Abre selector de dispositivo |

#### 3.3.2 Interfaces de programación (API)

##### API-001: Interfaz del motor de parseo

```typescript
interface SwiftUIParser {
  parse(sourceCode: string): SwiftUIComponentTree;
  isSwiftUIFile(filePath: string): boolean;
}
```

##### API-002: Interfaz del motor de renderizado

```typescript
interface SwiftUIRenderer {
  render(componentTree: SwiftUIComponentTree): Buffer;
  setDevice(deviceModel: DeviceModel): void;
}
```

### 3.4 Casos de uso específicos

#### CU-001: Previsualizar vista SwiftUI

| Caso de uso | CU-001 |
|-------------|--------|
| **Título** | Previsualizar vista SwiftUI |
| **Actor** | Desarrollador |
| **Precondiciones** | VS Code está abierto con un archivo SwiftUI activo |
| **Flujo principal** | 1. Desarrollador abre archivo `.swift` con vista SwiftUI |
| | 2. Sistema detecta automáticamente que es un archivo SwiftUI |
| | 3. Sistema parsea el código y genera la previsualización |
| | 4. La previsualización aparece en una pestaña de VS Code |
| **Flujo alternativo** | 1a. Desarrollador ejecuta comando "OpenSUI: Start Preview" |
| **Postcondiciones** | La previsualización está visible y actualizada |

#### CU-002: Cambiar dispositivo de previsualización

| Caso de uso | CU-002 |
|-------------|--------|
| **Título** | Cambiar dispositivo de previsualización |
| **Actor** | Desarrollador |
| **Precondiciones** | La previsualización está activa |
| **Flujo principal** | 1. Desarrollador hace clic en el selector de dispositivo |
| | 2. Se muestra lista de dispositivos disponibles |
| | 3. Desarrollador selecciona nuevo dispositivo (ej. iPhone 16 Pro) |
| | 4. Sistema actualiza el marco y dimensiones |
| | 5. La previsualización se redimensiona al nuevo dispositivo |
| **Postcondiciones** | La previsualización muestra el nuevo marco de dispositivo |

#### CU-003: Ver cambios en tiempo real

| Caso de uso | CU-003 |
|-------------|--------|
| **Título** | Ver cambios en tiempo real |
| **Actor** | Desarrollador |
| **Precondiciones** | Previsualización activa y archivo abierto |
| **Flujo principal** | 1. Desarrollador modifica código SwiftUI en el editor |
| | 2. Sistema detecta el cambio |
| | 3. Sistema re-parsea el código modificado |
| | 4. Sistema re-renderiza la vista |
| | 5. La previsualización se actualiza automáticamente |
| **Postcondiciones** | La previsualización refleja los cambios realizados |

### 3.5 Matriz de trazabilidad

| Requisito | Caso de uso | Prioridad | Estado |
|-----------|-------------|-----------|--------|
| RF-001 | CU-001 | Alta | Pendiente |
| RF-002 | CU-001, CU-003 | Crítica | Pendiente |
| RF-003 | CU-001, CU-003 | Crítica | Pendiente |
| RF-004 | CU-001, CU-002 | Alta | Pendiente |
| RF-005 | CU-002 | Alta | Pendiente |
| RF-006 | CU-003 | Alta | Pendiente |
| RF-007 | CU-001 | Crítica | Pendiente |
| RF-008 | CU-001 | Media | Pendiente |
| RNF-001 | - | Alta | Pendiente |
| RNF-002 | - | Alta | Pendiente |
| RNF-003 | - | Crítica | Pendiente |
| RNF-004 | - | Alta | Pendiente |
| RNF-005 | - | Media | Pendiente |

---

## 4. Anexos

### 4.1 Glosario técnico

| Término | Definición técnica |
|---------|-------------------|
| **Tokenización** | Proceso de convertir una secuencia de caracteres en una secuencia de tokens (unidades léxicas) |
| **Parsing** | Proceso de analizar una secuencia de tokens según las reglas de una gramática formal |
| **AST (Abstract Syntax Tree)** | Representación en forma de árbol de la estructura sintáctica de un código |
| **Buffer** | Área de memoria utilizada para almacenar datos temporalmente |
| **PNG/JPEG** | Formatos de imagen para almacenar gráficos digitalmente |

### 4.2 Componentes SwiftUI soportados (versión inicial)

| Categoría | Componentes |
|-----------|-------------|
| **Layout** | `VStack`, `HStack`, `ZStack`, `Spacer` |
| **Texto** | `Text` |
| **Controles** | `Button`, `Toggle`, `Slider`, `TextField`, `Picker` |
| **Contenedores** | `List`, `ScrollView`, `NavigationStack`, `TabView` |
| **Multimedia** | `Image` |
| **Estructura** | `Divider` |

### 4.3 Formato de datos del árbol de componentes

```typescript
interface SwiftUIComponentTree {
  root: SwiftUIComponent;
}

interface SwiftUIComponent {
  type: string;
  properties: Record<string, any>;
  children: SwiftUIComponent[];
}
```

**Ejemplo:**

```json
{
  "type": "VStack",
  "properties": { "spacing": 16 },
  "children": [
    {
      "type": "Text",
      "properties": { "text": "Hello World", "font": "title" },
      "children": []
    },
    {
      "type": "Button",
      "properties": { "label": "Click me" },
      "children": []
    }
  ]
}
```

---

## 5. Control de versiones

| Versión | Fecha | Autor | Descripción |
|---------|-------|-------|-------------|
| 1.0 | 24/04/2026 | Analista de Software Senior | Creación inicial del documento SRS |

---

**Fin del documento**
