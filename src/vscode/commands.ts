/**
 * VS Code Commands — Fase 4
 *
 * Defines all command identifiers used by the OpenSUI extension.
 */

export const COMMANDS = {
  START_PREVIEW: 'opensui.startPreview',
  STOP_PREVIEW: 'opensui.stopPreview',
  SELECT_DEVICE: 'opensui.selectDevice',
  TOGGLE_PREVIEW: 'opensui.togglePreview',
} as const

export type CommandId = typeof COMMANDS[keyof typeof COMMANDS]
