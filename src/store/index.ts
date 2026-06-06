import { create } from 'zustand'
import type { ParkingOrder } from '@/types/order'
import type { Booking } from '@/types/booking'
import type { Vehicle, Invoice } from '@/types/user'
import type { Coupon } from '@/types/coupon'
import { myOrders } from '@/data/order'
import { myBookings } from '@/data/booking'
import { myVehicles, myInvoices } from '@/data/user'
import { myCoupons } from '@/data/coupon'

interface AppState {
  orders: ParkingOrder[]
  bookings: Booking[]
  vehicles: Vehicle[]
  invoices: Invoice[]
  coupons: Coupon[]
  availableCoupons: Coupon[]

  setOrders: (orders: ParkingOrder[]) => void
  addOrder: (order: ParkingOrder) => void
  updateOrderStatus: (orderId: string, status: ParkingOrder['status']) => void

  setBookings: (bookings: Booking[]) => void
  addBooking: (booking: Booking) => void
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void
  cancelBooking: (bookingId: string) => void

  setVehicles: (vehicles: Vehicle[]) => void
  addVehicle: (vehicle: Vehicle) => void
  updateVehicle: (vehicle: Vehicle) => void
  deleteVehicle: (vehicleId: string) => void
  setDefaultVehicle: (vehicleId: string) => void

  setInvoices: (invoices: Invoice[]) => void
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (invoice: Invoice) => void
  deleteInvoice: (invoiceId: string) => void
  setDefaultInvoice: (invoiceId: string) => void

  setCoupons: (coupons: Coupon[]) => void
  claimCoupon: (coupon: Coupon) => void
  useCoupon: (couponId: string) => void
}

const initialAvailableCoupons: Coupon[] = [
  {
    id: 'ac1',
    name: '新用户专享券',
    type: 'amount',
    value: 15,
    minAmount: 30,
    expireTime: '2025-12-31',
    status: 'available',
    description: '新用户注册专享，满30元可用'
  },
  {
    id: 'ac2',
    name: '工作日立减券',
    type: 'amount',
    value: 8,
    minAmount: 20,
    expireTime: '2025-08-31',
    status: 'available',
    description: '周一至周五可用，满20元减8元'
  },
  {
    id: 'ac3',
    name: '夜间停车7折',
    type: 'discount',
    value: 0.7,
    minAmount: 0,
    expireTime: '2025-09-30',
    status: 'available',
    description: '每日18:00-次日8:00使用'
  },
  {
    id: 'ac4',
    name: '首次预约免费',
    type: 'amount',
    value: 25,
    minAmount: 0,
    expireTime: '2025-10-31',
    status: 'available',
    description: '首次预约停车免费，最高抵扣25元'
  }
]

export const useAppStore = create<AppState>((set, get) => ({
  orders: myOrders,
  bookings: myBookings,
  vehicles: myVehicles,
  invoices: myInvoices,
  coupons: myCoupons,
  availableCoupons: initialAvailableCoupons,

  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(o => o.id === orderId ? { ...o, status, paidAmount: status === 'completed' ? o.totalAmount : o.paidAmount } : o)
  })),

  setBookings: (bookings) => set({ bookings }),
  addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
  updateBookingStatus: (bookingId, status) => set((state) => ({
    bookings: state.bookings.map(b => b.id === bookingId ? { ...b, status } : b)
  })),
  cancelBooking: (bookingId) => set((state) => ({
    bookings: state.bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
  })),

  setVehicles: (vehicles) => set({ vehicles }),
  addVehicle: (vehicle) => set((state) => ({
    vehicles: vehicle.isDefault
      ? [vehicle, ...state.vehicles.map(v => ({ ...v, isDefault: false }))]
      : [...state.vehicles, vehicle]
  })),
  updateVehicle: (vehicle) => set((state) => ({
    vehicles: state.vehicles.map(v => {
      if (v.id === vehicle.id) {
        return vehicle
      }
      if (vehicle.isDefault) {
        return { ...v, isDefault: false }
      }
      return v
    })
  })),
  deleteVehicle: (vehicleId) => set((state) => ({
    vehicles: state.vehicles.filter(v => v.id !== vehicleId)
  })),
  setDefaultVehicle: (vehicleId) => set((state) => ({
    vehicles: state.vehicles.map(v => ({ ...v, isDefault: v.id === vehicleId }))
  })),

  setInvoices: (invoices) => set({ invoices }),
  addInvoice: (invoice) => set((state) => ({
    invoices: invoice.isDefault
      ? [invoice, ...state.invoices.map(i => ({ ...i, isDefault: false }))]
      : [...state.invoices, invoice]
  })),
  updateInvoice: (invoice) => set((state) => ({
    invoices: state.invoices.map(i => {
      if (i.id === invoice.id) {
        return invoice
      }
      if (invoice.isDefault) {
        return { ...i, isDefault: false }
      }
      return i
    })
  })),
  deleteInvoice: (invoiceId) => set((state) => ({
    invoices: state.invoices.filter(i => i.id !== invoiceId)
  })),
  setDefaultInvoice: (invoiceId) => set((state) => ({
    invoices: state.invoices.map(i => ({ ...i, isDefault: i.id === invoiceId }))
  })),

  setCoupons: (coupons) => set({ coupons }),
  claimCoupon: (coupon) => set((state) => ({
    coupons: [...state.coupons, { ...coupon, id: `claimed_${Date.now()}` }],
    availableCoupons: state.availableCoupons.filter(c => c.id !== coupon.id)
  })),
  useCoupon: (couponId) => set((state) => ({
    coupons: state.coupons.map(c => c.id === couponId ? { ...c, status: 'used' } : c)
  }))
}))
