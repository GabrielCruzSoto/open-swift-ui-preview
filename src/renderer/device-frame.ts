import { createCanvas, Image } from 'canvas'

// This will compose the generated rendering into a generic device frame design.
export class DeviceFrame {
  // Overlays the screenshot onto a simulated device frame context.
  static attachFrame(screenshotBuffer: Buffer, isDarkMode = false): Buffer {
    // For now, simple border & notch simulation.
    // In later phases, we will load actual PNG assets from `assets/device-frames/`.
    const screenWidth = 393
    const screenHeight = 852
    
    // Add 20px padding for the frame
    const framePadding = 20
    const canvasWidth = screenWidth + framePadding * 2
    const canvasHeight = screenHeight + framePadding * 2

    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')

    // Draw device body (Rounded Rect)
    ctx.fillStyle = isDarkMode ? '#1C1C1E' : '#E5E5EA'
    ctx.beginPath()
    const r = 50
    ctx.moveTo(r, 0)
    ctx.arcTo(canvasWidth, 0, canvasWidth, canvasHeight, r)
    ctx.arcTo(canvasWidth, canvasHeight, 0, canvasHeight, r)
    ctx.arcTo(0, canvasHeight, 0, 0, r)
    ctx.arcTo(0, 0, canvasWidth, 0, r)
    ctx.closePath()
    ctx.fill()

    // Load the screenshot image
    const img = new Image()
    img.src = screenshotBuffer

    // Draw the screen
    ctx.drawImage(img, framePadding, framePadding, screenWidth, screenHeight)

    // Draw the Notch
    ctx.fillStyle = '#000000'
    const notchWidth = 120
    const notchHeight = 30
    const notchX = (canvasWidth - notchWidth) / 2
    
    ctx.beginPath()
    ctx.moveTo(notchX, framePadding)
    ctx.lineTo(notchX + notchWidth, framePadding)
    ctx.lineTo(notchX + notchWidth, framePadding + notchHeight - 10)
    ctx.arcTo(notchX + notchWidth, framePadding + notchHeight, notchX + notchWidth - 10, framePadding + notchHeight, 10)
    ctx.lineTo(notchX + 10, framePadding + notchHeight)
    ctx.arcTo(notchX, framePadding + notchHeight, notchX, framePadding + notchHeight - 10, 10)
    ctx.closePath()
    ctx.fill()

    return canvas.toBuffer('image/png')
  }
}
