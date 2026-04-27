/**
 * Device Selector — Fase 5
 *
 * Provides UI for selecting device models for preview.
 */

import * as vscode from 'vscode'
import { DeviceModel, DeviceModels, getDeviceById } from './device-models'

export class DeviceSelector {
  private currentDevice: DeviceModel

  constructor(initialDevice: DeviceModel = DeviceModels.IPHONE_15_PRO) {
    this.currentDevice = initialDevice
  }

  getCurrentDevice(): DeviceModel {
    return this.currentDevice
  }

  setCurrentDevice(device: DeviceModel): void {
    this.currentDevice = device
  }

  async show(): Promise<DeviceModel | undefined> {
    const items = Object.values(DeviceModels).map((device) => ({
      label: device.name,
      description: `${device.series} - ${device.screenWidth}x${device.screenHeight}`,
      device,
    }))

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a device for preview',
    })

    if (selected) {
      this.currentDevice = selected.device
      return selected.device
    }

    return undefined
  }

  async selectDeviceById(deviceId: string): Promise<boolean> {
    const device = getDeviceById(deviceId)
    if (device) {
      this.currentDevice = device
      return true
    }
    return false
  }

  getAllDevices(): DeviceModel[] {
    return Object.values(DeviceModels)
  }
}
