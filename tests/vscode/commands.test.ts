/**
 * Commands Tests — Fase 4
 */

import { COMMANDS } from '../../src/vscode/commands'

describe('COMMANDS', () => {
  it('should have START_PREVIEW command', () => {
    expect(COMMANDS.START_PREVIEW).toBe('opensui.startPreview')
  })

  it('should have STOP_PREVIEW command', () => {
    expect(COMMANDS.STOP_PREVIEW).toBe('opensui.stopPreview')
  })

  it('should have SELECT_DEVICE command', () => {
    expect(COMMANDS.SELECT_DEVICE).toBe('opensui.selectDevice')
  })

  it('should have TOGGLE_PREVIEW command', () => {
    expect(COMMANDS.TOGGLE_PREVIEW).toBe('opensui.togglePreview')
  })

  it('should have all required commands', () => {
    const commands = Object.values(COMMANDS)
    expect(commands).toHaveLength(4)
    expect(commands).toContain('opensui.startPreview')
    expect(commands).toContain('opensui.stopPreview')
    expect(commands).toContain('opensui.selectDevice')
    expect(commands).toContain('opensui.togglePreview')
  })
})
