import { SwiftUIComponent } from '../parser/types'
import { RenderStyle } from './types'

export class ComponentMapper {
  mapToStyle(component: SwiftUIComponent): RenderStyle {
    const style: RenderStyle = {}

    // Process modifiers
    for (const mod of component.modifiers) {
      switch (mod.type) {
        case 'padding': {
          const val = mod.properties['value']
          const pad = typeof val === 'number' ? val : 16 // Default padding
          style.padding = { top: pad, right: pad, bottom: pad, left: pad }
          for (const [k, v] of Object.entries(mod.properties)) {
            if (typeof v === 'number') {
              if (k === 'top' && style.padding) {style.padding.top = v}
              if (k === 'bottom' && style.padding) {style.padding.bottom = v}
              if (k === 'leading' && style.padding) {style.padding.left = v}
              if (k === 'trailing' && style.padding) {style.padding.right = v}
            }
          }
          break
        }
        case 'background': {
          const val = mod.properties['value']
          if (typeof val === 'string') {
            style.backgroundColor = this.resolveColor(val)
          }
          break
        }
        case 'foregroundColor':
        case 'foregroundStyle': {
          const val = mod.properties['value']
          if (typeof val === 'string') {
            style.foregroundColor = this.resolveColor(val)
          }
          break
        }
        case 'font': {
          const val = mod.properties['value']
          if (typeof val === 'string') {
            style.font = this.resolveFont()
            style.fontSize = this.resolveFontSize(val)
          }
          break
        }
        case 'bold': {
          style.fontWeight = 'bold'
          break
        }
        case 'cornerRadius': {
          const val = mod.properties['value']
          if (typeof val === 'number') {
            style.cornerRadius = val
          }
          break
        }
        case 'opacity': {
          const val = mod.properties['value']
          if (typeof val === 'number') {
            style.opacity = Math.max(0, Math.min(1, val))
          }
          break
        }
      }
    }

    return style
  }

  // Very basic color resolution, maps SwiftUI `.color` to CSS colors
  private resolveColor(colorValue: string): string {
    const raw = colorValue.startsWith('.') ? colorValue.substring(1) : colorValue
    const colorMap: Record<string, string> = {
      blue: '#007AFF',
      red: '#FF3B30',
      green: '#34C759',
      yellow: '#FFCC00',
      orange: '#FF9500',
      purple: '#AF52DE',
      pink: '#FF2D55',
      primary: '#000000',
      secondary: '#3C3C43', // 60% opacity roughly
      gray: '#8E8E93',
      white: '#FFFFFF',
      black: '#000000',
      clear: 'transparent',
    }
    return colorMap[raw] || '#000000'
  }

  private resolveFont(): string {
    return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  }

  private resolveFontSize(fontValue: string): number {
    const raw = fontValue.startsWith('.') ? fontValue.substring(1) : fontValue
    const sizeMap: Record<string, number> = {
      largeTitle: 34,
      title: 28,
      title2: 22,
      title3: 20,
      headline: 17, // semi-bold usually
      body: 17,
      callout: 16,
      subheadline: 15,
      footnote: 13,
      caption: 12,
      caption2: 11,
    }
    return sizeMap[raw] || 17
  }
}
