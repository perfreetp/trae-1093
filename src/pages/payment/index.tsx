import React, { useState, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { formatPrice, formatDuration, formatPlateNumber } from '@/utils/format'
import { useAppStore } from '@/store'
import styles from './index.module.scss'

const payMethods = [
  { id: 'wechat', icon: '💚', name: '微信支付' },
  { id: 'alipay', icon: '💙', name: '支付宝' },
  { id: 'balance', icon: '💰', name: '余额支付' }
]

const PaymentPage: React.FC = () => {
  const router = useRouter()
  const { orderId } = router.params
  const [selectedMethod, setSelectedMethod] = useState('wechat')
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null)
  const { orders, updateOrderStatus, coupons, useCoupon } = useAppStore()

  const order = useMemo(() => {
    if (orderId) {
      return orders.find(o => o.id === orderId)
    }
    return orders.find(o => o.status === 'pending_payment' || o.status === 'overdue') || orders[2]
  }, [orderId, orders])

  const payableAmount = order ? order.totalAmount - order.paidAmount : 0

  const availableCoupons = useMemo(() => {
    return coupons.filter(c => {
      if (c.status !== 'available') return false
      if (c.minAmount > 0 && payableAmount < c.minAmount) return false
      return true
    })
  }, [coupons, payableAmount])

  const selectedCoupon = useMemo(
    () => coupons.find(c => c.id === selectedCouponId && c.status === 'available'),
    [coupons, selectedCouponId]
  )

  const discountAmount = useMemo(() => {
    if (!selectedCoupon) return 0
    if (selectedCoupon.type === 'amount') {
      return selectedCoupon.value
    }
    return Math.ceil(payableAmount * (1 - selectedCoupon.value) * 100) / 100
  }, [selectedCoupon, payableAmount])

  const actualPayAmount = useMemo(() => {
    return Math.max(0, Math.ceil((payableAmount - discountAmount) * 100) / 100)
  }, [payableAmount, discountAmount])

  const handleCouponSelect = () => {
    if (availableCoupons.length === 0) {
      Taro.showToast({ title: '暂无可用优惠券', icon: 'none' })
      return
    }
    Taro.showActionSheet({
      itemList: availableCoupons.map(c => {
        if (c.type === 'amount') {
          return `${c.name} - 减¥${c.value}`
        }
        return `${c.name} - ${c.value * 10}折`
      }),
      success: res => {
        setSelectedCouponId(availableCoupons[res.tapIndex].id)
      }
    })
  }

  const handlePay = () => {
    if (!order) return

    if (selectedCoupon) {
      useCoupon(selectedCoupon.id)
    }

    Taro.showLoading({ title: '支付中...' })
    setTimeout(() => {
      Taro.hideLoading()
      updateOrderStatus(order.id, 'completed')
      Taro.showToast({ title: '支付成功', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }, 1500)
  }

  if (!order) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>
          <Text>订单不存在</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.amountSection}>
        <Text className={styles.amountLabel}>应付金额</Text>
        <Text className={styles.amountValue}>{formatPrice(actualPayAmount)}</Text>
        {discountAmount > 0 && (
          <Text className={styles.amountDiscount}>已优惠 {formatPrice(discountAmount)}</Text>
        )}
      </View>

      <View className={styles.orderInfo}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>停车场</Text>
          <Text className={styles.infoValue}>{order.parkingLotName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>车牌号码</Text>
          <Text className={styles.infoValue}>{formatPlateNumber(order.plateNumber)}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>入场时间</Text>
          <Text className={styles.infoValue}>{order.entryTime}</Text>
        </View>
        {order.exitTime && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>出场时间</Text>
            <Text className={styles.infoValue}>{order.exitTime}</Text>
          </View>
        )}
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>停车时长</Text>
          <Text className={styles.infoValue}>
            {order.duration ? formatDuration(order.duration) : '--'}
          </Text>
        </View>
      </View>

      <View className={styles.couponSection}>
        <View className={styles.couponRow} onClick={handleCouponSelect}>
          <Text className={styles.couponLabel}>
            <Text>🎫</Text> 优惠券
          </Text>
          <View className={styles.couponRight}>
            {selectedCoupon ? (
              <Text className={styles.couponSelected}>
                {selectedCoupon.type === 'amount' ? `-¥${selectedCoupon.value}` : `-${(selectedCoupon.value * 10).toFixed(0)}折`}
              </Text>
            ) : (
              <Text className={styles.couponPlaceholder}>
                {availableCoupons.length > 0 ? `${availableCoupons.length}张可用` : '暂无可用'}
              </Text>
            )}
            <Text className={styles.couponArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.orderInfo}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>订单金额</Text>
          <Text className={styles.infoValue}>{formatPrice(order.totalAmount)}</Text>
        </View>
        {order.paidAmount > 0 && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>已付金额</Text>
            <Text className={styles.infoValue}>{formatPrice(order.paidAmount)}</Text>
          </View>
        )}
        {discountAmount > 0 && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>优惠券抵扣</Text>
            <Text className={styles.infoValue} style={{ color: '#00B42A' }}>-{formatPrice(discountAmount)}</Text>
          </View>
        )}
      </View>

      <View className={styles.payMethods}>
        <Text className={styles.methodTitle}>选择支付方式</Text>
        {payMethods.map(method => (
          <View
            key={method.id}
            className={styles.methodItem}
            onClick={() => setSelectedMethod(method.id)}
          >
            <Text className={styles.methodIcon}>{method.icon}</Text>
            <Text className={styles.methodText}>{method.name}</Text>
            <View
              className={classnames(
                styles.radio,
                selectedMethod === method.id && styles.radioActive
              )}
            />
          </View>
        ))}
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.payBtn} onClick={handlePay}>
          确认支付 {formatPrice(actualPayAmount)}
        </View>
      </View>
    </View>
  )
}

export default PaymentPage
