import type { ParkingOrder } from '@/types/order'

export const myOrders: ParkingOrder[] = [
  {
    id: 'o1',
    parkingLotId: '1',
    parkingLotName: '万达广场地下停车场',
    parkingLotAddress: '北京市朝阳区建国路88号万达广场B1层',
    plateNumber: '京A12345',
    entryTime: '2025-06-07 09:30',
    duration: 180,
    totalAmount: 24,
    paidAmount: 0,
    status: 'parking',
    parkingPosition: 'B2-A区-088',
    createTime: '2025-06-07 09:30'
  },
  {
    id: 'o2',
    parkingLotId: '4',
    parkingLotName: '望京SOHO停车场',
    parkingLotAddress: '北京市朝阳区望京街道阜通东大街1号',
    plateNumber: '京A12345',
    entryTime: '2025-06-06 08:00',
    exitTime: '2025-06-06 18:30',
    duration: 630,
    totalAmount: 66,
    paidAmount: 66,
    status: 'completed',
    parkingPosition: 'B1-C区-156',
    createTime: '2025-06-06 08:00'
  },
  {
    id: 'o3',
    parkingLotId: '2',
    parkingLotName: '国贸中心停车场',
    parkingLotAddress: '北京市朝阳区建国门外大街1号',
    plateNumber: '京B67890',
    entryTime: '2025-06-05 10:00',
    exitTime: '2025-06-05 14:00',
    duration: 240,
    totalAmount: 48,
    paidAmount: 0,
    status: 'pending_payment',
    parkingPosition: 'B3-A区-023',
    createTime: '2025-06-05 10:00'
  },
  {
    id: 'o4',
    parkingLotId: '6',
    parkingLotName: '朝阳大悦城停车场',
    parkingLotAddress: '北京市朝阳区朝阳北路101号',
    plateNumber: '京A12345',
    entryTime: '2025-06-04 13:00',
    exitTime: '2025-06-04 17:30',
    duration: 270,
    totalAmount: 25,
    paidAmount: 25,
    status: 'completed',
    parkingPosition: 'B2-D区-210',
    createTime: '2025-06-04 13:00'
  },
  {
    id: 'o5',
    parkingLotId: '8',
    parkingLotName: '奥林匹克公园停车场',
    parkingLotAddress: '北京市朝阳区北辰东路15号',
    plateNumber: '京C11111',
    entryTime: '2025-06-03 09:00',
    exitTime: '2025-06-03 12:00',
    duration: 180,
    totalAmount: 15,
    paidAmount: 0,
    status: 'overdue',
    parkingPosition: 'P3-056',
    createTime: '2025-06-03 09:00'
  },
  {
    id: 'o6',
    parkingLotId: '3',
    parkingLotName: '三里屯太古里停车场',
    parkingLotAddress: '北京市朝阳区三里屯路19号',
    plateNumber: '京A12345',
    entryTime: '2025-06-02 18:00',
    exitTime: '2025-06-02 22:00',
    duration: 240,
    totalAmount: 40,
    paidAmount: 40,
    status: 'completed',
    parkingPosition: 'B1-B区-078',
    createTime: '2025-06-02 18:00'
  }
]

export const currentParking = myOrders.find(o => o.status === 'parking')
export const arrearsOrders = myOrders.filter(o => o.status === 'overdue' || o.status === 'pending_payment')
