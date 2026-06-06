import type { Booking, TimeSlot } from '@/types/booking'

export const myBookings: Booking[] = [
  {
    id: 'b1',
    parkingLotId: '1',
    parkingLotName: '万达广场地下停车场',
    parkingLotAddress: '北京市朝阳区建国路88号万达广场B1层',
    plateNumber: '京A12345',
    startTime: '2025-06-07 14:00',
    endTime: '2025-06-07 18:00',
    duration: 4,
    price: 32,
    status: 'confirmed',
    createTime: '2025-06-06 10:30'
  },
  {
    id: 'b2',
    parkingLotId: '4',
    parkingLotName: '望京SOHO停车场',
    parkingLotAddress: '北京市朝阳区望京街道阜通东大街1号',
    plateNumber: '京A12345',
    startTime: '2025-06-08 09:00',
    endTime: '2025-06-08 18:00',
    duration: 9,
    price: 54,
    status: 'pending',
    createTime: '2025-06-07 08:00'
  },
  {
    id: 'b3',
    parkingLotId: '6',
    parkingLotName: '朝阳大悦城停车场',
    parkingLotAddress: '北京市朝阳区朝阳北路101号',
    plateNumber: '京B67890',
    startTime: '2025-06-05 10:00',
    endTime: '2025-06-05 15:00',
    duration: 5,
    price: 25,
    status: 'completed',
    createTime: '2025-06-04 16:00'
  },
  {
    id: 'b4',
    parkingLotId: '2',
    parkingLotName: '国贸中心停车场',
    parkingLotAddress: '北京市朝阳区建国门外大街1号',
    plateNumber: '京A12345',
    startTime: '2025-06-03 13:00',
    endTime: '2025-06-03 16:00',
    duration: 3,
    price: 36,
    status: 'cancelled',
    createTime: '2025-06-02 09:00'
  }
]

export const generateTimeSlots = (date: string): TimeSlot[] => {
  const slots: TimeSlot[] = []
  for (let hour = 8; hour < 22; hour++) {
    const start = `${hour.toString().padStart(2, '0')}:00`
    const end = `${(hour + 1).toString().padStart(2, '0')}:00`
    slots.push({
      start,
      end,
      available: Math.random() > 0.3,
      price: 8 + Math.floor(Math.random() * 8)
    })
  }
  return slots
}
