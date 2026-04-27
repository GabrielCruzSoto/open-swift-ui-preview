/**
 * Device Models — Fase 5
 *
 * Defines device models for iPhone 15, 16, and 17 series.
 */

export interface DeviceModel {
  id: string
  name: string
  series: 'iPhone 15' | 'iPhone 16' | 'iPhone 17'
  screenWidth: number
  screenHeight: number
  frameImage: string
  screenX: number
  screenY: number
  notchHeight?: number
}

export const DeviceModels: Record<string, DeviceModel> = {
  IPHONE_15: {
    id: 'iphone15',
    name: 'iPhone 15',
    series: 'iPhone 15',
    screenWidth: 393,
    screenHeight: 852,
    frameImage: 'assets/device-frames/iphone15/iphone15.png',
    screenX: 60,
    screenY: 120,
  },
  IPHONE_15_PLUS: {
    id: 'iphone15plus',
    name: 'iPhone 15 Plus',
    series: 'iPhone 15',
    screenWidth: 430,
    screenHeight: 932,
    frameImage: 'assets/device-frames/iphone15/iphone15plus.png',
    screenX: 65,
    screenY: 130,
  },
  IPHONE_15_PRO: {
    id: 'iphone15pro',
    name: 'iPhone 15 Pro',
    series: 'iPhone 15',
    screenWidth: 393,
    screenHeight: 852,
    frameImage: 'assets/device-frames/iphone15/iphone15pro.png',
    screenX: 60,
    screenY: 120,
    notchHeight: 59,
  },
  IPHONE_15_PRO_MAX: {
    id: 'iphone15promax',
    name: 'iPhone 15 Pro Max',
    series: 'iPhone 15',
    screenWidth: 430,
    screenHeight: 932,
    frameImage: 'assets/device-frames/iphone15/iphone15promax.png',
    screenX: 65,
    screenY: 130,
    notchHeight: 59,
  },
  IPHONE_16: {
    id: 'iphone16',
    name: 'iPhone 16',
    series: 'iPhone 16',
    screenWidth: 402,
    screenHeight: 874,
    frameImage: 'assets/device-frames/iphone16/iphone16.png',
    screenX: 62,
    screenY: 125,
  },
  IPHONE_16_PLUS: {
    id: 'iphone16plus',
    name: 'iPhone 16 Plus',
    series: 'iPhone 16',
    screenWidth: 440,
    screenHeight: 956,
    frameImage: 'assets/device-frames/iphone16/iphone16plus.png',
    screenX: 67,
    screenY: 135,
  },
  IPHONE_16_PRO: {
    id: 'iphone16pro',
    name: 'iPhone 16 Pro',
    series: 'iPhone 16',
    screenWidth: 402,
    screenHeight: 874,
    frameImage: 'assets/device-frames/iphone16/iphone16pro.png',
    screenX: 62,
    screenY: 125,
    notchHeight: 35,
  },
  IPHONE_16_PRO_MAX: {
    id: 'iphone16promax',
    name: 'iPhone 16 Pro Max',
    series: 'iPhone 16',
    screenWidth: 440,
    screenHeight: 956,
    frameImage: 'assets/device-frames/iphone16/iphone16promax.png',
    screenX: 67,
    screenY: 135,
    notchHeight: 35,
  },
  IPHONE_17: {
    id: 'iphone17',
    name: 'iPhone 17',
    series: 'iPhone 17',
    screenWidth: 412,
    screenHeight: 896,
    frameImage: 'assets/device-frames/iphone17/iphone17.png',
    screenX: 64,
    screenY: 130,
  },
  IPHONE_17_PLUS: {
    id: 'iphone17plus',
    name: 'iPhone 17 Plus',
    series: 'iPhone 17',
    screenWidth: 450,
    screenHeight: 978,
    frameImage: 'assets/device-frames/iphone17/iphone17plus.png',
    screenX: 69,
    screenY: 140,
  },
  IPHONE_17_PRO: {
    id: 'iphone17pro',
    name: 'iPhone 17 Pro',
    series: 'iPhone 17',
    screenWidth: 412,
    screenHeight: 896,
    frameImage: 'assets/device-frames/iphone17/iphone17pro.png',
    screenX: 64,
    screenY: 130,
    notchHeight: 35,
  },
  IPHONE_17_PRO_MAX: {
    id: 'iphone17promax',
    name: 'iPhone 17 Pro Max',
    series: 'iPhone 17',
    screenWidth: 450,
    screenHeight: 978,
    frameImage: 'assets/device-frames/iphone17/iphone17promax.png',
    screenX: 69,
    screenY: 140,
    notchHeight: 35,
  },
}

export const DEFAULT_DEVICE = DeviceModels.IPHONE_15_PRO

export function getDeviceById(id: string): DeviceModel | undefined {
  return Object.values(DeviceModels).find((device) => device.id === id)
}

export function getAllDevices(): DeviceModel[] {
  return Object.values(DeviceModels)
}
