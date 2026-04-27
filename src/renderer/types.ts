import { SwiftUIComponent } from '../parser/types'

export interface ComputedLayout {
  x: number
  y: number
  width: number
  height: number
  minWidth: number
  maxWidth: number
  minHeight: number
  maxHeight: number
}

export interface LayoutNode {
  component: SwiftUIComponent
  layout: ComputedLayout
  children: LayoutNode[]
}

export interface RenderStyle {
  backgroundColor?: string
  foregroundColor?: string // color of text / strokes
  font?: string
  fontSize?: number
  fontWeight?: string
  cornerRadius?: number
  padding?: { top: number; right: number; bottom: number; left: number }
  opacity?: number
}
