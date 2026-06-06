import React, { useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useAppStore } from '@/store'
import { formatPrice, formatDuration, formatPlateNumber } from '@/utils/format'
import styles from './index.module.scss'

const PaymentResultPage: React.FC = () => {
  const router = useRouter()
  const { orderId } = router.params
  const { orders, coupons } = useAppStore()

  const order = useMemo(() => orders.find(o => o.id === orderId), [orders, orderId])
  const usedCoupon = useMemo(
    () => coupons.find(c => c.id === order?.couponId),
    [coupons, order?.couponId]
  )

  const handleBackToOrder = () => {
    Taro.switchTab({ url: '/pages/order/index' })
  }

  const handleApplyInvoice = () => {
    Taro.navigateTo({
      url: `/pages/invoice-apply/index?orderId=${orderId}`
    })
  }

  const handleBackHome = () => {
    Taro.switchTab({ url: '/pages/home/index' })
  }

  if (!order) {
    return (
      <View className={styles.page}>
        <Text className={styles.empty}>订单不存在</Text>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.successHeader}>
        <View className={styles.successIcon}>✓</View>
        <Text className={styles.successTitle}>支付成功</Text>
        <Text className={styles.successPrice}>{formatPrice(order.paidAmount)}</Text>
      </View>

      <View className={styles.orderInfo}>
        <View className={styles.infoCard}>
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
              <Text className={styles.infoLabel}>离场时间</Text>
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

        <View className={styles.infoCard}>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>订单金额</Text>
            <Text className={styles.infoValue}>{formatPrice(order.totalAmount)}</Text>
          </View>
          {order.discountAmount && order.discountAmount > 0 && (
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>
                优惠券抵扣
                {usedCoupon && (
                  <Text className={styles.couponName}>（{usedCoupon.name}）</Text>
                )}
              </Text>
              <Text className={styles.discountValue}>-{formatPrice(order.discountAmount)}</Text>
            </View>
          )}
          <View className={styles.divider} />
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>实付金额</Text>
            <Text className={styles.priceValue}>{formatPrice(order.paidAmount)}</Text>
          </View>
        </View>
      </View>

      <View className={styles.actions}>
        <View className={styles.secondaryBtn} onClick={handleBackToOrder}>
          查看订单
        </View>
        <View className={styles.primaryBtn} onClick={handleApplyInvoice}>
          申请发票
        </View>
      </View>

      <View className={styles.backHome} onClick={handleBackHome}>
        返回首页
      </View>
    </View>
  )
}

export default PaymentResultPage
