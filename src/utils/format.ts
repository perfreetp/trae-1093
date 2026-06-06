export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  }
  return `${distance.toFixed(1)}km`
}

export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`
}

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) {
    return `${hours}小时`
  }
  return `${hours}小时${mins}分钟`
}

export const formatPlateNumber = (plate: string): string => {
  if (plate.length <= 7) return plate
  return plate.slice(0, 2) + '·' + plate.slice(2)
}

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消',
    parking: '停车中',
    pending_payment: '待支付',
    overdue: '已欠费',
    available: '可使用',
    used: '已使用',
    expired: '已过期'
  }
  return statusMap[status] || status
}

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: '#FF7D00',
    confirmed: '#1677FF',
    completed: '#00B42A',
    cancelled: '#86909C',
    parking: '#1677FF',
    pending_payment: '#FF7D00',
    overdue: '#F53F3F',
    available: '#00B42A',
    used: '#86909C',
    expired: '#86909C'
  }
  return colorMap[status] || '#86909C'
}
