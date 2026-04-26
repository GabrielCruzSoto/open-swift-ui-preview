# SwiftUI Components

## Objetivo

Catálogo de componentes SwiftUI con soporte y prioridad para OpenSUI.

---

## Componentes de Layout

| Componente | Props renderizables | Prioridad | Estado |
|-----------|---------------------|----------|--------|
| VStack | alignment, spacing | Alta | ✅ Soportado |
| HStack | alignment, spacing | Alta | ✅ Soportado |
| ZStack | alignment | Alta | ✅ Soportado |
| LazyVStack | alignment, spacing | Media | 🔜 Planeado |
| LazyHStack | alignment, spacing | Media | 🔜 Planeado |
| Spacer | minLength | Alta | ✅ Soportado |
| Divider | - | Media | ✅ Soportado |

---

## Componentes de Texto

| Componente | Props renderizables | Prioridad | Estado |
|-----------|---------------------|----------|--------|
| Text | text, font, foregroundColor, bold, italic, lineLimit | Alta | ✅ Soportado |
| Label | title, icon | Media | ✅ Soportado |
| TextField | text, placeholder | Baja | ✅ Soportado |
| SecureField | text, prompt | Baja | ✅ Soportado |
| TextEditor | text | Baja | ✅ Soportado |

---

## Componentes de Imagen

| Componente | Props renderizables | Prioridad | Estado |
|-----------|---------------------|----------|--------|
| Image | systemName, resizable, aspectRatio, frame | Alta | ✅ Soportado |
| AsyncImage | url, placeholder | Media | ✅ Soportado |

---

## Componentes de Control

| Componente | Props renderizables | Prioridad | Estado |
|-----------|---------------------|----------|--------|
| Button | label, role | Alta | ✅ Soportado |
| Toggle | isOn, label | Baja | 🔜 Planeado |
| Slider | value, bounds | Baja | 🔜 Planeado |
| Picker | selection, label | Baja | ✅ Soportado |
| Stepper | value, bounds | Baja | ✅ Soportado |
| DatePicker | selection, displayedComponents | Baja | ✅ Soportado |

---

## Componentes de Navegación

| Componente | Props renderizables | Prioridad | Estado |
|-----------|---------------------|----------|--------|
| NavigationStack | path | Media | ✅ Soportado |
| NavigationView | - | Media | ✅ Soportado |
| TabView | selection | Media | ✅ Soportado |
| List | selection, tint | Media | ✅ Soportado |
| ScrollView | axis, showsIndicators | Media | ✅ Soportado |

---

## Modificadores Comunes

| Modificador | Props | Prioridad | Estado |
|------------|-------|----------|--------|
| .padding | number, EdgeInsets | Alta | ✅ Soportado |
| .frame | width, height, alignment | Alta | ✅ Soportado |
| .background | Color | Alta | ✅ Soportado |
| .foregroundColor | Color | Alta | ✅ Soportado |
| .font | FontWeight | Alta | ✅ Soportado |
| .bold | - | Media | ✅ Soportado |
| .italic | - | Media | ✅ Soportado |
| .lineLimit | number | Media | ✅ Soportado |
| .resizable | - | Alta | ✅ Soportado |
| .aspectRatio | value, contentMode | Media | ✅ Soportado |

---

## Sistema de Colores

### Colores del Sistema

```typescript
const SYSTEM_COLORS: Record<string, string> = {
  'Color.primary': '#000000',
  'Color.secondary': '#8E8E93',
  'Color.blue': '#007AFF',
  'Color.red': '#FF3B30',
  'Color.green': '#34C759',
  'Color.orange': '#FF9500',
  'Color.white': '#FFFFFF',
  'Color.black': '#000000',
  'Color.clear': 'transparent',
};
```

### Colores Semánticos

| Color | Hex | Uso |
|-------|-----|-----|
| AccentColor | #007AFF | Taps, enlaces |
| Background | #FFFFFF | Fondo principal |
| Secondary | #F2F2F7 | Fondos secundario |
| Label | #000000 | Texto principal |

---

## NO Soportados

Los siguientes componentes NO serán soportados:

- Animaciones y transiciones
- Gestos (Gesture)
- Animaciones conMatchedGeometryEffect
- Services (Environment)
- Core Data
- Combine publishers

---

## Aplicación

Cargar este skill al:
- Implementar parser
- Mapear componentes a estilos
- Definir alcance del proyecto