# [PROMPT] Fase 5 — Dispositivos y UI

> Versión: 1.0 | Proyecto: OpenSUI

---

## CONTEXTO (C)

Eres un Ingeniero de Software TypeScript trabajando en **OpenSUI**, una extensión VS Code para previsualización de vistas SwiftUI.

**Referencias:**
- `docs/[DESIGN]` — Sección 5.4 (Device Models)
- `docs/[PLAN]` — Fase 5: Dispositivos y UI

**Estado del repositorio:**
- Fases completadas: Fases 1-4
- Archivos relevantes: `src/vscode/preview-panel.ts`

---

## OBJETIVO (O)

Al finalizar esta fase:

**Código fuente:**
- [ ] `src/vscode/device-models.ts` — DeviceModel interface y constantes
- [ ] `src/vscode/device-selector.ts` — Device selection UI
- [ ] `assets/device-frames/` — Marcos PNG de dispositivos

**Tests:**
- [ ] `tests/vscode/device-selector.test.ts`

---

## RESTRICCIONES (R)

- ✅ iPhone 15/16/17 series
- ✅ Marco PNG con notch

---

## EJECUCIÓN (E)

### Paso 1 — Device Models

Crear `src/vscode/device-models.ts`:
```typescript
export interface DeviceModel {
  id: string;
  name: string;
  series: string;
  screenWidth: number;
  screenHeight: number;
  frameImage: string;
}

export const DeviceModels = {
  IPHONE_15_PRO: { id: 'iphone15pro', name: 'iPhone 15 Pro', ... },
  // ... iPhone 15, 16, 17 series
};
```

### Paso 2 — Device Selector

Crear `src/vscode/device-selector.ts`:
```typescript
import { DeviceModel, DeviceModels } from './device-models';

export class DeviceSelector {
  async show(): Promise<DeviceModel> {
    const items = Object.values(DeviceModels).map(d => d.name);
    const selected = await vscode.window.showQuickPick(items);
    return DeviceModels[selected!.toLowerCase().replace(/ /g, '_')];
  }
}
```

### Paso 3 — Device Frames

Crear directorio y marcos PNG en `assets/device-frames/`:
- iphone15/, iphone16/, iphone17/
- Frame con notch, bordes redondeados

### Paso 4 — Integración

Actualizar `PreviewPanel` para usar device frame.

### Paso 5 — Tests y commit

```bash
git add .
git commit -m "feat(devices): add device selector and iPhone frames"
git push origin fase-5-dispositivos-ui
```

---

## CRITERIOS DE ACEPTACIÓN

| # | Criterio |
|---|----------|
| 1 | Selector muestra dispositivos |
| 2 | Cambio actualiza preview |
| 3 | Frame visual correcto |

---

**Fin del prompt**