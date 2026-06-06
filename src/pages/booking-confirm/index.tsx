import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import EmptyState from '@/components/EmptyState'
import { formatPrice } from '@/utils/format'
import styles from './index.module.scss'

const BookingConfirmPage: React.FC = () => {
  const handleSubmit = () => {
    Taro.showToast({ title: '预约成功', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <EmptyState
          title='预约确认功能'
          description='选择停车场和时段后确认预约'
        />
      </View>
      <View className={styles.bottomBar}>
        <View>
          <Text className={styles.totalPrice}>预计费用</Text>
          <Text className={styles.priceValue}>{formatPrice(32)}</Text>
        </View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          确认预约
        </View>
      </View>
    </View>
  )
}

export default BookingConfirmPage
