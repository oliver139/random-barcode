export interface BarcodeInfo {
  name: string
  code: string
}

export interface UsageRecord {
  name: string
  count: number
}

export type Layout = 'up' | 'down' | 'swipe'
