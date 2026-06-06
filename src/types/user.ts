export interface UserInfo {
  id: string
  nickname: string
  avatar: string
  phone: string
  balance: number
  points: number
}

export interface Vehicle {
  id: string
  plateNumber: string
  brand: string
  model: string
  color: string
  isDefault: boolean
}

export interface Invoice {
  id: string
  title: string
  taxNumber: string
  address?: string
  phone?: string
  bank?: string
  bankAccount?: string
  isDefault: boolean
  type: 'personal' | 'company'
}

export interface Feedback {
  id: string
  type: 'complaint' | 'suggestion' | 'praise'
  content: string
  images?: string[]
  status: 'pending' | 'processing' | 'resolved'
  createTime: string
  reply?: string
}
