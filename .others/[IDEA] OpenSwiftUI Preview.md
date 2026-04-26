# OpenSUI

## Descripción

OpenSUI es una extensión para Visual Studio Code diseñada para apoyar a desarrolladores de aplicaciones móviles iOS en su flujo de trabajo.

La extensión permite previsualizar vistas de SwiftUI en tiempo real directamente en VS Code, ofreciendo una experiencia de desarrollo más flexible y accesible.

> [!NOTA:]
> OpenSUI **no es un emulador de iOS**. La extensión muestra una previsualización gráfica de la vista SwiftUI, no un dispositivo virtual ejecutando la aplicación completa.

## Problema

Actualmente, el desarrollo de aplicaciones iOS requiere Xcode, el entorno de desarrollo oficial de Apple. Xcode solo puede ejecutarse en computadoras con macOS, lo que representa una barrera significativa para:

- Desarrolladores que utilizan sistemas operativos diferentes (Windows, Linux)
- Equipos que no cuentan con hardware de Apple
- Organizaciones que prefieren mantener un entorno de desarrollo multiplataforma

Esta limitación dificulta que una amplia comunidad de desarrolladores pueda participar en la creación de aplicaciones para el ecosistema iOS.

## Solución

OpenSUI permite previsualizar vistas de SwiftUI en tiempo real directamente en Visual Studio Code, independientemente del sistema operativo utilizado.

### Cómo funciona

1. **Motor de renderizado propio**: OpenSUI implementa un motor de previsualización desarrollado desde cero que interpreta y renderiza vistas SwiftUI.
2. **Previsualización gráfica**: En lugar de ejecutar un emulador, la extensión muestra una representación visual (imagen) de la vista SwiftUI dentro de un marco del dispositivo seleccionado.
3. **Selección de dispositivo**: Al previsualizar, el usuario puede elegir entre diferentes modelos de iPhone para ver cómo se adapta la vista.

### Limitaciones conocidas

- La previsualización es una representación gráfica estática, no una ejecución interactiva de la aplicación
- No permite probar interacciones táctiles ni comportamientos dinámicos completos
- Está orientada a verificar el diseño y layout de las vistas SwiftUI

## Características

- Previsualización en tiempo real de vistas SwiftUI en VS Code
- Motor de renderizado propio, desarrollado desde cero
- Soporte para múltiples vistas SwiftUI
- Galería de dispositivos: series iPhone 15, iPhone 16 y iPhone 17
- Compatible con cualquier sistema operativo (Windows, Linux, macOS)

## Modelo de negocio

OpenSUI es un proyecto **gratuito y de código abierto** (open source). La extensión estará disponible sin costo para toda la comunidad de desarrolladores.

## Estado del proyecto

**Solo idea**: Actualmente OpenSUI se encuentra en fase de conceptualización. No existe código ni prototipo implementado.

## Diferenciación

| Característica | Xcode | OpenSUI |
|----------------|-------|---------|
| Plataforma de ejecución | macOS exclusivamente | Cualquier SO con VS Code |
| Tipo de previsualización | Emulador completo | Representación gráfica de vistas |
| Requisitos de hardware | Mac con Xcode | Cualquier computador + iPhone |
| Enfoque | Desarrollo completo de apps | Verificación rápida de diseño UI |

### Alternatives existentes

La única alternativa oficial para desarrollo iOS es **Xcode**, el IDE de Apple, que:

- Solo puede ejecutarse en computadoras con macOS
- Requiere una Mac para cada desarrollador
- Ofrece un emulador completo de iOS (Swift Playgrounds)

OpenSUI busca democratizar el desarrollo iOS permitiendo previsualizar vistas SwiftUI sin necesidad de hardware Apple, aunque con un alcance más limitado (solo diseño UI, no ejecución completa de aplicaciones).

## Tecnologías y herramientas consideradas

- **Visual Studio Code**: Plataforma base para la extensión
- **SwiftUI**: Framework de UI de Apple para definir interfaces
- **iPhone como pantalla**: El dispositivo físico del usuario sirve como medio de visualización
- **Motor de renderizado personalizado**: Implementación propia para interpretar y mostrar vistas SwiftUI

## Casos de uso

1. **Desarrolladores cross-platform**: Profesionales que trabajan con múltiples sistemas operativos y necesitan verificar diseños iOS sin mantener una Mac.
2. **Equipos distribuidos**: Organizaciones con equipos distribuidos que no todos tienen acceso a hardware Apple.
3. **Aprendizaje**: Personas que desean aprender SwiftUI sin invertir en una Mac.
4. **Prototipado rápido**: Diseño iterativo de interfaces SwiftUI con retroalimentación visual inmediata.

## Roadmap (bajo conceptualización)

1. Definición de arquitectura del motor de renderizado SwiftUI
2. Diseño del protocolo de comunicación VS Code ↔ dispositivo
3. Implementación del soporte para series iPhone 15
4. Desarrollo de interfaz de usuario de la extensión
5. Pruebas y validación con la comunidad
