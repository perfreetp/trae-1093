import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import StatusTag from '@/components/StatusTag'
import EmptyState from '@/components/EmptyState'
import { useAppStore } from '@/store'
import type { ParkingOrder } from '@/types/order'
import { formatDuration, formatPrice, formatPlateNumber } from '@/utils/format'
import dayjs from 'dayjs'
import styles from './index.module.scss'

const tabs = [
  { key: 'all', label: '全部欠费' },
  { key: 'pending', label: '待支付' },
  { key: 'overdue', label: '已逾期' }
]

const ArrearsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null)
  const [showPayModal, setShowPayModal] = useState(false)
  const { orders, coupons, useCoupon, updateOrder } = useAppStore()

  const arrearsOrders = useMemo(
    () => orders.filter(o => o.status === 'overdue' || o.status === 'pending_payment'),
    [orders]
  )

  const filteredOrders = useMemo(() => {
    switch (activeTab) {
      case 'pending':
        return arrearsOrders.filter(o => o.status === 'pending_payment')
      case 'overdue':
        return arrearsOrders.filter(o => o.status === 'overdue')
      default:
        return arrearsOrders
    }
  }, [activeTab, arrearsOrders])

  const selectedTotal = useMemo(() => {
    return filteredOrders
      .filter(o => selectedIds.includes(o.id))
      .reduce((sum, o) => sum + o.totalAmount - o.paidAmount, 0)
  }, [filteredOrders, selectedIds])

  const selectedCoupon = useMemo(
    () => coupons.find(c => c.id === selectedCouponId && c.status === 'available'),
    [coupons, selectedCouponId]
  )

  const discountAmount = useMemo(() => {
    if (!selectedCoupon) return 0
    if (selectedCoupon.type === 'amount') {
      return selectedCoupon.value
    }
    return Math.ceil(selectedTotal * (1 - selectedCoupon.value) * 100) / 100
  }, [selectedCoupon, selectedTotal])

  const payAmount = useMemo(() => {
    return Math.max(0, Math.ceil((selectedTotal - discountAmount) * 100) / 100)
  }, [selectedTotal, discountAmount])

  const allSelected = useMemo(() => {
    return filteredOrders.length > 0 && filteredOrders.every(o => selectedIds.includes(o.id))
  }, [filteredOrders, selectedIds])

  const handleSelectOrder = (orderId: string) => {
    setSelectedIds(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredOrders.map(o => o.id))
    }
  }

  const handlePay = (order: ParkingOrder) => {
    Taro.navigateTo({
      url: `/pages/payment/index?orderId=${order.id}`
    })
  }

  const handleCouponSelect = () => {
    const now = dayjs()
    const couponList: { coupon: typeof coupons[0]; disabled: boolean; reason: string }[] = []

    coupons.forEach(c => {
      let disabled = false
      let reason = ''
      if (c.status === 'used') {
        disabled = true
        reason = '已使用'
      } else if (c.status === 'expired' || dayjs(c.expireTime).isBefore(now, 'day')) {
        disabled = true
        reason = '已过期'
      } else if (c.minAmount > 0 && selectedTotal < c.minAmount) {
        disabled = true
        reason = `满¥${c.minAmount.toFixed(2)}可用`
      }
      couponList.push({ coupon: c, disabled, reason })
    })

    if (couponList.length === 0) {
      Taro.showToast({ title: '暂无优惠券', icon: 'none' })
      return
    }

    Taro.showActionSheet({
      itemList: couponList.map(item => {
        const c = item.coupon
        let valueText = ''
        if (c.type === 'amount') {
          valueText = `减¥${c.value}`
        } else {
          valueText = `${c.value * 10}折`
        }
        if (item.disabled) {
          return `${c.name} - ${valueText}（${item.reason}）`
        }
        return `${c.name} - ${valueText}`
      }),
      success: res => {
        const selected = couponList[res.tapIndex]
        if (selected.disabled) {
          Taro.showToast({ title: selected.reason, icon: 'none' })
          return
        }
        setSelectedCouponId(selected.coupon.id)
      }
    })
  }

  const handlePayAll = () => {
    if (selectedIds.length === 0) {
      Taro.showToast({ title: '请选择要支付的订单', icon: 'none' })
      return
    }
    setShowPayModal(true)
  }

  const confirmPayAll = () => {
    if (selectedCoupon) {
      useCoupon(selectedCoupon.id)
    }

    Taro.showLoading({ title: '支付中...' })
    setTimeout(() => {
      Taro.hideLoading()
      selectedIds.forEach(orderId => {
        const order = orders.find(o => o.id === orderId)
        if (order) {
          const orderDiscount = discountAmount / selectedIds.length
          updateOrder(orderId, {
            ...order,
            discountAmount: orderDiscount,
            paidAmount: order.totalAmount - orderDiscount,
            couponId: selectedCoupon?.id,
            status: 'completed',
            invoiceStatus: 'none'
          })
        }
      })
      setSelectedIds([])
      setSelectedCouponId(null)
      setShowPayModal(false)
      Taro.showToast({ title: '支付成功', icon: 'success' })
    }, 1500)
  }

  const totalArrears = arrearsOrders.reduce((sum, o) => sum + o.totalAmount - o.paidAmount, 0)

  return (
    <View className={styles.page}>
      <View className={styles.summaryCard}>
        <Text className={styles.summaryTitle}>待补缴总金额</Text>
        <Text className={styles.summaryAmount}>{formatPrice(totalArrears)}</Text>
        <Text className={styles.summaryCount}>共 {arrearsOrders.length} 笔欠费订单</Text>
      </View>

      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.activeTab)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.list}>
        {filteredOrders.length === 0 ? (
          <EmptyState title='暂无欠费记录' />
        ) : (
          filteredOrders.map(order => (
            <View
              key={order.id}
              className={styles.orderCard}
              onClick={() => handleSelectOrder(order.id)}
            >
              <View
                className={classnames(styles.cardCheckbox, selectedIds.includes(order.id) && styles.checked)}
                onClick={e => {
                  e.stopPropagation()
                  handleSelectOrder(order.id)
                }}
              >
                {selectedIds.includes(order.id) && '✓'}
              </View>
              <View className={styles.orderHeader}>
                <Text className={styles.orderLot}>{order.parkingLotName}</Text>
                <StatusTag status={order.status} size='md' />
              </View>
              <Text className={styles.orderAddress}>{order.parkingLotAddress}</Text>
              <View className={styles.orderInfo}>
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
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>车牌号码</Text>
                  <Text className={styles.infoValue}>{formatPlateNumber(order.plateNumber)}</Text>
                </View>
              </View>
              <View className={styles.orderFooter}>
                <Text className={styles.orderPrice}>
                  {formatPrice(order.totalAmount - order.paidAmount)}
                </Text>
                <View
                  className={styles.payBtn}
                  onClick={e => {
                    e.stopPropagation()
                    handlePay(order)
                  }}
                >
                  去支付
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {filteredOrders.length > 0 && (
        <View className={styles.bottomBar}>
          <View className={styles.selectAll} onClick={handleSelectAll}>
            <View className={classnames(styles.checkbox, allSelected && styles.checked)}>
              {allSelected && '✓'}
            </View>
            <Text className={styles.selectText}>全选</Text>
          </View>
          <View className={styles.totalSection}>
            <View className={styles.couponRow} onClick={handleCouponSelect}>
              <Text className={styles.couponLabel}>优惠券</Text>
              {selectedCoupon ? (
                <Text className={styles.couponValue}>
                  {selectedCoupon.type === 'amount' ? `-¥${selectedCoupon.value}` : `-${(selectedCoupon.value * 10).toFixed(0)}折`}
                </Text>
              ) : (
                <Text className={styles.couponPlaceholder}>选择</Text>
              )}
              <Text className={styles.couponArrow}>›</Text>
            </View>
            <View className={styles.totalAmount}>
              合计：<Text>{formatPrice(payAmount)}</Text>
              {discountAmount > 0 && (
                <Text className={styles.discountHint}>已优惠{formatPrice(discountAmount)}</Text>
              )}
            </View>
            <View className={styles.payAllBtn} onClick={handlePayAll}>
              批量支付({selectedIds.length})
            </View>
          </View>
        </View>
      )}

      {showPayModal && (
        <View className={styles.modalOverlay} onClick={() => setShowPayModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>确认支付</Text>
            <View className={styles.modalBody}>
              <View className={styles.modalRow}>
                <Text>支付订单</Text>
                <Text>{selectedIds.length} 笔</Text>
              </View>
              <View className={styles.modalRow}>
                <Text>订单总额</Text>
                <Text>{formatPrice(selectedTotal)}</Text>
              </View>
              {discountAmount > 0 && (
                <View className={styles.modalRow}>
                  <Text>优惠抵扣</Text>
                  <Text style={{ color: '#00B42A' }}>-{formatPrice(discountAmount)}</Text>
                </View>
              )}
              <View className={styles.modalRow}>
                <Text>实付金额</Text>
                <Text className={styles.modalPrice}>{formatPrice(payAmount)}</Text>
              </View>
            </View>
            <View className={styles.modalActions}>
              <View className={styles.modalCancel} onClick={() => setShowPayModal(false)}>取消</View>
              <View className={styles.modalConfirm} onClick={confirmPayAll}>确认支付</View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default ArrearsPage
