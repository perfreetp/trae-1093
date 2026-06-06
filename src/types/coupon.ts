export interface Coupon {
  id: string
  name: string
  type: 'discount' | 'amount'
  value: number
  minAmount: number
  expireTime: string
  status: 'available' | 'used' | 'expired'
  description: string
}

export interface MonthlyCard {
  id: string
  name: string
  price: number
  duration: number
  description: string
  parkingLots: string[]
  status: 'available' | 'owned' | 'expired'
  expireTime?: string
}
