import React, { useMemo } from 'react'
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
  { key: 'all', label: '全部' },
  { key: 'parking', label: '停车中' },
  { key: 'completed', label: '已完成' },
  { key: 'unpaid', label: '待支付' }
]

const OrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('all')
  const orders = useAppStore(state => state.orders)

  const currentParking = useMemo(
    () => orders.find(o => o.status === 'parking'),
    [orders]
  )

  const filteredOrders = useMemo(() => {
    let result = orders.filter(o => o.status !== 'parking')
    switch (activeTab) {
      case 'parking':
        return []
      case 'completed':
        return result.filter(o => o.status === 'completed')
      case 'unpaid':
        return result.filter(o => o.status === 'pending_payment' || o.status === 'overdue')
      default:
        return result
    }
  }, [orders, activeTab])

  const handlePay = (order: ParkingOrder) => {
    Taro.navigateTo({
      url: `/pages/payment/index?orderId=${order.id}`
    })
  }

  const handleFindCar = () => {
    Taro.navigateTo({ url: '/pages/find-car/index' })
  }

  const handleNavigate = () => {
    Taro.showToast({ title: '导航功能开发中', icon: 'none' })
  }

  const handleSettle = (orderId: string) => {
    Taro.navigateTo({
      url: `/pages/parking-settle/index?orderId=${orderId}`
    })
  }

  const handleOrderClick = (order: ParkingOrder) => {
    if (order.status === 'pending_payment' || order.status === 'overdue') {
      handlePay(order)
    }
  }

  const onRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      onRefresherRefresh={onRefresh}
    >
      {currentParking && (
        <View className={styles.currentCard}>
          <View className={styles.currentHeader}>
            <Text className={styles.currentIcon}>🚙</Text>
            <Text className={styles.currentTitle}>正在停车中</Text>
          </View>
          <Text className={styles.currentLot}>{currentParking.parkingLotName}</Text>
          <Text className={styles.currentAddress}>{currentParking.parkingLotAddress}</Text>
          <View className={styles.currentInfo}>
            <View className={styles.infoBlock}>
              <Text className={styles.infoLabel}>入场时间</Text>
              <Text className={styles.infoValue}>{currentParking.entryTime}</Text>
            </View>
            <View className={styles.infoBlock}>
              <Text className={styles.infoLabel}>已停时长</Text>
              <Text className={styles.infoValue}>
                {currentParking.duration ? formatDuration(currentParking.duration) : '--'}
              </Text>
            </View>
            <View className={styles.infoBlock}>
              <Text className={styles.infoLabel}>车位号</Text>
              <Text className={styles.infoValue}>{currentParking.parkingPosition || '--'}</Text>
            </View>
          </View>
          <View className={styles.currentActions}>
            <View
              className={classnames(styles.actionBtn, styles.secondaryAction)}
              onClick={handleFindCar}
            >
              找车
            </View>
            <View
              className={classnames(styles.actionBtn, styles.warningAction)}
              onClick={handleNavigate}
            >
              导航到出口
            </View>
            <View
              className={classnames(styles.actionBtn, styles.primaryAction)}
              onClick={() => handleSettle(currentParking.id)}
            >
              去结算
            </View>
          </View>
        </View>
      )}

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

      <View className={styles.list}>
        {filteredOrders.length === 0 ? (
          <EmptyState title='暂无订单记录' />
        ) : (
          filteredOrders.map(order => (
            <View
              key={order.id}
              className={styles.orderCard}
              onClick={() => handleOrderClick(order)}
            >
              <View className={styles.orderHeader}>
                <Text className={styles.orderLot}>{order.parkingLotName}</Text>
                <StatusTag status={order.status} size='md' />
              </View>
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
                <Text className={styles.orderPrice}>{formatPrice(order.totalAmount)}</Text>
                {(order.status === 'pending_payment' || order.status === 'overdue') && (
                  <View
                    className={styles.payBtn}
                    onClick={e => {
                      e.stopPropagation()
                      handlePay(order)
                    }}
                  >
                    去支付
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  )
}

export default OrderPage
