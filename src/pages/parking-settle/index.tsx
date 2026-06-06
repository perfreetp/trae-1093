import React, { useMemo, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store'
import { formatPrice, formatDuration, formatPlateNumber } from '@/utils/format'
import dayjs from 'dayjs'
import styles from './index.module.scss'

const ParkingSettlePage: React.FC = () => {
  const router = useRouter()
  const { orderId } = router.params
  const { orders, coupons, useCoupon, updateOrder } = useAppStore()
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null)

  const order = useMemo(() => orders.find(o => o.id === orderId), [orders, orderId])

  const exitTime = useMemo(() => dayjs().format('YYYY-MM-DD HH:mm'), [])

  const calculatedDuration = useMemo(() => {
    if (!order) return 0
    const entry = dayjs(order.entryTime)
    const exit = dayjs()
    return Math.max(exit.diff(entry, 'hour', true), 0.5)
  }, [order])

  const parkingLotPrice = useMemo(() => {
    if (!order) return 8
    const parking = {
      '1': 8, '2': 12, '3': 10, '4': 6, '5': 10,
      '6': 5, '7': 4, '8': 5, '9': 4, '10': 8
    }
    return parking[order.parkingLotId as keyof typeof parking] || 8
  }, [order])

  const totalAmount = useMemo(() => {
    return Math.ceil(calculatedDuration * parkingLotPrice * 100) / 100
  }, [calculatedDuration, parkingLotPrice])

  const selectedCoupon = useMemo(
    () => coupons.find(c => c.id === selectedCouponId && c.status === 'available'),
    [coupons, selectedCouponId]
  )

  const availableCoupons = useMemo(() => {
    return coupons.filter(c => {
      if (c.status !== 'available') return false
      if (c.minAmount > 0 && totalAmount < c.minAmount) return false
      return true
    })
  }, [coupons, totalAmount])

  const discountAmount = useMemo(() => {
    if (!selectedCoupon) return 0
    if (selectedCoupon.type === 'amount') {
      return selectedCoupon.value
    }
    return Math.ceil(totalAmount * (1 - selectedCoupon.value) * 100) / 100
  }, [selectedCoupon, totalAmount])

  const payableAmount = useMemo(() => {
    return Math.max(0, Math.ceil((totalAmount - discountAmount) * 100) / 100)
  }, [totalAmount, discountAmount])

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

    updateOrder(order.id, {
      ...order,
      exitTime,
      duration: calculatedDuration,
      totalAmount,
      paidAmount: payableAmount,
      status: 'completed'
    })

    Taro.showToast({ title: '支付成功', icon: 'success' })
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/order/index' })
    }, 1500)
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
      <ScrollView scrollY className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.headerTitle}>停车结算</Text>
          <Text className={styles.headerDesc}>请确认停车费用后支付</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>停车场信息</Text>
          <View className={styles.card}>
            <Text className={styles.parkingName}>{order.parkingLotName}</Text>
            <Text className={styles.parkingAddress}>📍 {order.parkingLotAddress}</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>停车信息</Text>
          <View className={styles.card}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>车牌号码</Text>
              <Text className={styles.infoValue}>{formatPlateNumber(order.plateNumber)}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>入场时间</Text>
              <Text className={styles.infoValue}>{order.entryTime}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>离场时间</Text>
              <Text className={styles.infoValue}>{exitTime}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>停车时长</Text>
              <Text className={styles.infoValue}>{formatDuration(calculatedDuration)}</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>费用明细</Text>
          <View className={styles.card}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>计费单价</Text>
              <Text className={styles.infoValue}>{formatPrice(parkingLotPrice)}/小时</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>停车时长</Text>
              <Text className={styles.infoValue}>{formatDuration(calculatedDuration)}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>应收金额</Text>
              <Text className={styles.infoValue}>{formatPrice(totalAmount)}</Text>
            </View>
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
            {selectedCoupon && (
              <View className={styles.discountRow}>
                <Text className={styles.discountLabel}>优惠券抵扣</Text>
                <Text className={styles.discountValue}>-{formatPrice(discountAmount)}</Text>
              </View>
            )}
            <View className={styles.divider} />
            <View className={styles.totalRow}>
              <Text className={styles.totalLabel}>应付金额</Text>
              <Text className={styles.totalPrice}>{formatPrice(payableAmount)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.totalBox}>
          <Text className={styles.totalLabel}>应付</Text>
          <Text className={styles.totalPrice}>{formatPrice(payableAmount)}</Text>
        </View>
        <View className={styles.payBtn} onClick={handlePay}>
          确认支付
        </View>
      </View>
    </View>
  )
}

export default ParkingSettlePage
