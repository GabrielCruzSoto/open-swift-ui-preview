import { SwiftUIComponent, SwiftUIComponentTree } from '../parser/types'
import { LayoutNode, ComputedLayout } from './types'
import { createCanvas } from 'canvas'

export class LayoutEngine {
  private ctx = createCanvas(1, 1).getContext('2d')

  computeLayout(tree: SwiftUIComponentTree, viewportWidth = 393, viewportHeight = 852): LayoutNode | null {
    if (!tree.root) {return null}

    // Perform a naive top-down measure and bottom-up layout.
    // For simplicity in a 0 budget open-source project, we use a basic flex-like model.
    return this.measureAndLayout(tree.root, 0, 0, viewportWidth, viewportHeight)
  }

  private measureAndLayout(
    component: SwiftUIComponent,
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number
  ): LayoutNode {
    const layout: ComputedLayout = {
      x, y,
      width: 0, height: 0,
      minWidth: 0, maxWidth,
      minHeight: 0, maxHeight
    }

    const children: LayoutNode[] = []
    let currentX = x
    let currentY = y

    // Very naive layout rules based on component type
    if (component.type === 'VStack') {
      const spacing = typeof component.properties['spacing'] === 'number' ? component.properties['spacing'] : 8
      let totalHeight = 0
      let maxChildWidth = 0

      for (const child of component.children) {
        const childNode = this.measureAndLayout(child, currentX, currentY, maxWidth, maxHeight)
        children.push(childNode)
        currentY += childNode.layout.height + spacing
        totalHeight += childNode.layout.height + spacing
        maxChildWidth = Math.max(maxChildWidth, childNode.layout.width)
      }
      
      layout.width = maxChildWidth
      layout.height = Math.max(0, totalHeight - spacing)
    } 
    else if (component.type === 'HStack') {
      const spacing = typeof component.properties['spacing'] === 'number' ? component.properties['spacing'] : 8
      let totalWidth = 0
      let maxChildHeight = 0

      for (const child of component.children) {
        if (child.type === 'Spacer') {
          // Simplistic spacer handling: we leave it for now and fix after other elements.
          // For now, it takes minimal space in first pass.
          continue
        }
        const childNode = this.measureAndLayout(child, currentX, currentY, maxWidth, maxHeight)
        children.push(childNode)
        currentX += childNode.layout.width + spacing
        totalWidth += childNode.layout.width + spacing
        maxChildHeight = Math.max(maxChildHeight, childNode.layout.height)
      }

      layout.width = Math.max(0, totalWidth - spacing)
      layout.height = maxChildHeight
    }
    else if (component.type === 'Text') {
      const text = String(component.properties['content'] || '')
      // Check font size from modifiers if possible, but Layout engine might not have style map
      // For now, use basic estimate or canvas measure
      this.ctx.font = '17px system-ui'
      const metrics = this.ctx.measureText(text)
      layout.width = metrics.width
      layout.height = 20 // Approx for 17px font
    }
    else if (component.type === 'Button') {
       // Button uses child for its layout usually
       if (component.children.length > 0) {
         const childNode = this.measureAndLayout(component.children[0], x, y, maxWidth, maxHeight)
         children.push(childNode)
         layout.width = childNode.layout.width
         layout.height = childNode.layout.height
       } else {
         layout.width = 100
         layout.height = 44
       }
    }
    else if (component.type === 'Spacer') {
      // In a real flex engine, Spacer expands to fill remaining space.
      // We assign it a large placeholder value or 0 if unconstrained.
      layout.width = 0
      layout.height = 0
    }
    else {
      // Default placeholder layout
      layout.width = 100
      layout.height = 100
    }

    // Process basic padding modifier for layout bounds
    const paddingMod = component.modifiers.find((m) => m.type === 'padding')
    if (paddingMod) {
      const pad = typeof paddingMod.properties['value'] === 'number' ? paddingMod.properties['value'] : 16
      layout.width += pad * 2
      layout.height += pad * 2
      // Shift children inward
      for (const child of children) {
        child.layout.x += pad
        child.layout.y += pad
      }
    }

    return { component, layout, children }
  }
}
