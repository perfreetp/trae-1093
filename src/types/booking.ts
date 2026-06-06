export interface Booking {
  id: string
  parkingLotId: string
  parkingLotName: string
  parkingLotAddress: string
  plateNumber: string
  startTime: string
  endTime: string
  duration: number
  price: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createTime: string
}

export interface TimeSlot {
  start: string
  end: string
  available: boolean
  price: number
}
