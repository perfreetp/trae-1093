import type { Coupon, MonthlyCard } from '@/types/coupon'

export const myCoupons: Coupon[] = [
  {
    id: 'c1',
    name: '新人停车优惠券',
    type: 'amount',
    value: 10,
    minAmount: 20,
    expireTime: '2025-07-31',
    status: 'available',
    description: '新用户专享，满20元可用'
  },
  {
    id: 'c2',
    name: '周末8折券',
    type: 'discount',
    value: 0.8,
    minAmount: 0,
    expireTime: '2025-06-30',
    status: 'available',
    description: '周末停车享受8折优惠'
  },
  {
    id: 'c3',
    name: '5元立减券',
    type: 'amount',
    value: 5,
    minAmount: 10,
    expireTime: '2025-06-15',
    status: 'available',
    description: '满10元可用'
  },
  {
    id: 'c4',
    name: '首单免费券',
    type: 'amount',
    value: 20,
    minAmount: 0,
    expireTime: '2025-05-31',
    status: 'expired',
    description: '首次停车免费，最高抵扣20元'
  },
  {
    id: 'c5',
    name: '会员专享券',
    type: 'discount',
    value: 0.9,
    minAmount: 0,
    expireTime: '2025-05-01',
    status: 'used',
    description: '会员专享9折优惠'
  }
]

export const availableCoupons = myCoupons.filter(c => c.status === 'available')

export const monthlyCards: MonthlyCard[] = [
  {
    id: 'm1',
    name: '商圈畅停月卡',
    price: 300,
    duration: 30,
    description: '万达广场、朝阳大悦城通用',
    parkingLots: ['1', '6'],
    status: 'available'
  },
  {
    id: 'm2',
    name: 'CBD商务月卡',
    price: 500,
    duration: 30,
    description: '国贸、银泰、SKP商圈通用',
    parkingLots: ['2'],
    status: 'available'
  },
  {
    id: 'm3',
    name: '科技园月卡',
    price: 200,
    duration: 30,
    description: '中关村软件园月卡',
    parkingLots: ['7'],
    status: 'owned',
    expireTime: '2025-07-15'
  },
  {
    id: 'm4',
    name: '季度畅停卡',
    price: 800,
    duration: 90,
    description: '全市停车场通用季度卡',
    parkingLots: ['1', '2', '3', '4', '5', '6', '7', '8'],
    status: 'available'
  }
]
