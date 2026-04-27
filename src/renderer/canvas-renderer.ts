import { LayoutNode } from './types'
import { ComponentMapper } from './component-mapper'
import { createCanvas, CanvasRenderingContext2D } from 'canvas'

export class CanvasRenderer {
  private mapper = new ComponentMapper()

  render(layoutTree: LayoutNode, width = 393, height = 852): Buffer {
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // Background (basic dark mode or light mode context, assume white for now)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)

    if (layoutTree) {
      this.renderNode(ctx, layoutTree)
    }

    return canvas.toBuffer('image/png')
  }

  private renderNode(ctx: CanvasRenderingContext2D, node: LayoutNode) {
    const style = this.mapper.mapToStyle(node.component)
    const { x, y, width, height } = node.layout

    ctx.save()

    // 1. Render Background
    if (style.backgroundColor) {
      ctx.fillStyle = style.backgroundColor
      if (style.cornerRadius) {
        this.fillRoundRect(ctx, x, y, width, height, style.cornerRadius)
      } else {
        ctx.fillRect(x, y, width, height)
      }
    }

    // 2. Render Component Specific Details
    ctx.globalAlpha = style.opacity ?? 1.0

    if (node.component.type === 'Text') {
      const text = String(node.component.properties['content'] || '')
      ctx.fillStyle = style.foregroundColor || '#000000'
      const fontSize = style.fontSize || 17
      const fontWeight = style.fontWeight || 'normal'
      ctx.font = `${fontWeight} ${fontSize}px system-ui`
      
      // Basic text alignment at the top-left of the bounding box + some padding offset
      // Since layout engine sets height to 20, we draw text using top alignment
      ctx.textBaseline = 'top'
      ctx.fillText(text, x, y)
    } else if (node.component.type === 'Button') {
       // Button defaults to blue text unless explicitly changed
       if (!style.foregroundColor) {
         style.foregroundColor = '#007AFF'
       }
    } else if (node.component.type === 'Divider') {
       ctx.fillStyle = style.foregroundColor || '#C6C6C8'
       ctx.fillRect(x, y + height / 2, width, 1)
    }

    // 3. Render Children recursions
    for (const child of node.children) {
      this.renderNode(ctx, child)
    }

    ctx.restore()
  }

  private fillRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    if (w < 2 * r) {r = w / 2}
    if (h < 2 * r) {r = h / 2}
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
    ctx.fill()
  }
}
