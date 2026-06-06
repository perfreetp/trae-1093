export interface ParkingOrder {
  id: string
  parkingLotId: string
  parkingLotName: string
  parkingLotAddress: string
  plateNumber: string
  entryTime: string
  exitTime?: string
  duration?: number
  totalAmount: number
  discountAmount?: number
  paidAmount: number
  status: 'parking' | 'pending_payment' | 'completed' | 'overdue'
  invoiceStatus?: 'none' | 'applied' | 'issued'
  couponId?: string
  parkingPosition?: string
  createTime: string
}
