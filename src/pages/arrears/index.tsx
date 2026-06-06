import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import StatusTag from '@/components/StatusTag'
import EmptyState from '@/components/EmptyState'
import { useAppStore } from '@/store'
import type { ParkingOrder } from '@/types/order'
import { formatDuration, formatPrice, formatPlateNumber } from '@/utils/format'
import styles from './index.module.scss'

const tabs = [
  { key: 'all', label: '全部欠费' },
  { key: 'pending', label: '待支付' },
  { key: 'overdue', label: '已逾期' }
]

const ArrearsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const orders = useAppStore(state => state.orders)

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

  const totalAmount = useMemo(() => {
    return filteredOrders
      .filter(o => selectedIds.includes(o.id))
      .reduce((sum, o) => sum + o.totalAmount - o.paidAmount, 0)
  }, [filteredOrders, selectedIds])

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

  const handlePayAll = () => {
    if (selectedIds.length === 0) {
      Taro.showToast({ title: '请选择要支付的订单', icon: 'none' })
      return
    }
    Taro.showToast({ title: '支付功能开发中', icon: 'none' })
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
            <View className={styles.totalAmount}>
              合计：<Text>{formatPrice(totalAmount)}</Text>
            </View>
            <View className={styles.payAllBtn} onClick={handlePayAll}>
              批量支付
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default ArrearsPage
