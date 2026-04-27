/**
 * Device Selector Tests — Fase 5
 *
 * Note: Full integration tests require manual testing in VS Code environment.
 * This file verifies that the module can be imported and has the expected exports.
 */

import { DeviceModels, DEFAULT_DEVICE, getDeviceById, getAllDevices } from '../../src/vscode/device-models'

describe('Device Models', () => {
  it('should have DEFAULT_DEVICE defined', () => {
    expect(DEFAULT_DEVICE).toBeDefined()
    expect(DEFAULT_DEVICE.id).toBe('iphone15pro')
  })

  it('should have iPhone 15 series devices', () => {
    expect(DeviceModels.IPHONE_15).toBeDefined()
    expect(DeviceModels.IPHONE_15_PLUS).toBeDefined()
    expect(DeviceModels.IPHONE_15_PRO).toBeDefined()
    expect(DeviceModels.IPHONE_15_PRO_MAX).toBeDefined()
  })

  it('should have iPhone 16 series devices', () => {
    expect(DeviceModels.IPHONE_16).toBeDefined()
    expect(DeviceModels.IPHONE_16_PLUS).toBeDefined()
    expect(DeviceModels.IPHONE_16_PRO).toBeDefined()
    expect(DeviceModels.IPHONE_16_PRO_MAX).toBeDefined()
  })

  it('should have iPhone 17 series devices', () => {
    expect(DeviceModels.IPHONE_17).toBeDefined()
    expect(DeviceModels.IPHONE_17_PLUS).toBeDefined()
    expect(DeviceModels.IPHONE_17_PRO).toBeDefined()
    expect(DeviceModels.IPHONE_17_PRO_MAX).toBeDefined()
  })

  it('should get device by id', () => {
    const device = getDeviceById('iphone15pro')
    expect(device).toBeDefined()
    expect(device?.name).toBe('iPhone 15 Pro')
  })

  it('should return undefined for invalid device id', () => {
    const device = getDeviceById('invalid')
    expect(device).toBeUndefined()
  })

  it('should get all devices', () => {
    const devices = getAllDevices()
    expect(devices).toHaveLength(12)
  })

  it('should have correct device properties', () => {
    const device = DeviceModels.IPHONE_15_PRO
    expect(device.id).toBe('iphone15pro')
    expect(device.name).toBe('iPhone 15 Pro')
    expect(device.series).toBe('iPhone 15')
    expect(device.screenWidth).toBe(393)
    expect(device.screenHeight).toBe(852)
    expect(device.screenX).toBe(60)
    expect(device.screenY).toBe(120)
  })
})
