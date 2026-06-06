import type { UserInfo, Vehicle, Invoice, Feedback } from '@/types/user'

export const userInfo: UserInfo = {
  id: 'u1',
  nickname: '停车达人',
  avatar: 'https://picsum.photos/id/64/200/200',
  phone: '138****8888',
  balance: 128.50,
  points: 2580
}

export const myVehicles: Vehicle[] = [
  {
    id: 'v1',
    plateNumber: '京A12345',
    brand: '特斯拉',
    model: 'Model 3',
    color: '珍珠白',
    isDefault: true
  },
  {
    id: 'v2',
    plateNumber: '京B67890',
    brand: '奥迪',
    model: 'A6L',
    color: '黑色',
    isDefault: false
  },
  {
    id: 'v3',
    plateNumber: '京C11111',
    brand: '大众',
    model: '途观L',
    color: '银色',
    isDefault: false
  }
]

export const myInvoices: Invoice[] = [
  {
    id: 'i1',
    title: '北京某某科技有限公司',
    taxNumber: '91110105MA01234567',
    address: '北京市朝阳区建国路88号',
    phone: '010-88888888',
    bank: '中国工商银行北京分行',
    bankAccount: '6222021234567890123',
    isDefault: true,
    type: 'company'
  },
  {
    id: 'i2',
    title: '张三',
    taxNumber: '',
    isDefault: false,
    type: 'personal'
  }
]

export const myFeedbacks: Feedback[] = [
  {
    id: 'f1',
    type: 'suggestion',
    content: '建议增加更多充电桩停车场的筛选功能',
    status: 'resolved',
    createTime: '2025-06-01',
    reply: '感谢您的建议，我们已在最新版本中增加了充电桩筛选功能，敬请体验！'
  },
  {
    id: 'f2',
    type: 'complaint',
    content: '朝阳大悦城停车场出口收费排队时间太长',
    status: 'processing',
    createTime: '2025-06-05'
  },
  {
    id: 'f3',
    type: 'praise',
    content: '万达广场的无感支付非常方便，体验很好！',
    status: 'resolved',
    createTime: '2025-05-28',
    reply: '感谢您的肯定，我们会继续努力提供更好的服务！'
  }
]
