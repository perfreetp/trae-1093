import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { formatPrice, formatDuration } from '@/utils/format'
import { myOrders } from '@/data/order'
import styles from './index.module.scss'

const payMethods = [
  { id: 'wechat', icon: '💚', name: '微信支付' },
  { id: 'alipay', icon: '💙', name: '支付宝' },
  { id: 'balance', icon: '💰', name: '余额支付' }
]

const PaymentPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('wechat')
  const order = myOrders.find(o => o.status === 'pending_payment') || myOrders[2]

  const handlePay = () => {
    Taro.showLoading({ title: '支付中...' })
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showToast({ title: '支付成功', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }, 1500)
  }

  return (
    <View className={styles.page}>
      <View className={styles.amountSection}>
        <Text className={styles.amountLabel}>停车费用</Text>
        <Text className={styles.amountValue}>{formatPrice(order.totalAmount)}</Text>
      </View>

      <View className={styles.orderInfo}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>停车场</Text>
          <Text className={styles.infoValue}>{order.parkingLotName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>车牌号码</Text>
          <Text className={styles.infoValue}>{order.plateNumber}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>入场时间</Text>
          <Text className={styles.infoValue}>{order.entryTime}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>停车时长</Text>
          <Text className={styles.infoValue}>
            {order.duration ? formatDuration(order.duration) : '--'}
          </Text>
        </View>
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
          确认支付 {formatPrice(order.totalAmount)}
        </View>
      </View>
    </View>
  )
}

export default PaymentPage
