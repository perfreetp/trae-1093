import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { parkingLots } from '@/data/parking'
import { formatDistance, formatPrice } from '@/utils/format'
import styles from './index.module.scss'

const ParkingDetailPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.params
  const parking = parkingLots.find(p => p.id === id) || parkingLots[0]
  const [isFavorite, setIsFavorite] = useState(parking.isFavorite)

  const features = [
    { icon: '🔌', text: '充电桩' },
    { icon: '♿', text: '无障碍' },
    { icon: '🚿', text: '洗车' },
    { icon: '💳', text: '无感支付' }
  ]

  const handleNavigate = () => {
    Taro.showToast({ title: '导航功能开发中', icon: 'none' })
  }

  const handleBooking = () => {
    Taro.navigateTo({
      url: `/pages/booking-confirm/index?parkingId=${parking.id}`
    })
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '已收藏',
      icon: 'success'
    })
  }

  return (
    <View className={styles.page}>
      <Image className={styles.banner} src={parking.image} mode='aspectFill' />

      <ScrollView scrollY className={styles.content} style={{ paddingBottom: 200 }}>
        <View className={styles.header}>
          <Text className={styles.name}>{parking.name}</Text>
          <Text className={styles.address}>{parking.address}</Text>
          <View className={styles.tags}>
            {parking.tags.map((tag, index) => (
              <View key={index} className={styles.tag}>
                <Text>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.infoTitle}>基本信息</Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>距离</Text>
            <Text className={styles.infoValue}>{formatDistance(parking.distance)}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>营业时间</Text>
            <Text className={styles.infoValue}>{parking.openTime}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>总车位</Text>
            <Text className={styles.infoValue}>{parking.totalSpaces} 个</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>剩余车位</Text>
            <Text className={`${styles.infoValue} ${parking.availableSpaces > 0 ? styles.available : ''}`}>
              {parking.availableSpaces > 0 ? `${parking.availableSpaces} 个` : '暂无车位'}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>小时单价</Text>
            <Text className={styles.infoValue}>{formatPrice(parking.pricePerHour)}</Text>
          </View>
          {parking.pricePerDay && (
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>日封顶</Text>
              <Text className={styles.infoValue}>{formatPrice(parking.pricePerDay)}</Text>
            </View>
          )}
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.infoTitle}>服务设施</Text>
          <View className={styles.features}>
            {features.map((feature, index) => (
              <View key={index} className={styles.featureItem}>
                <Text className={styles.featureIcon}>{feature.icon}</Text>
                <Text className={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.favBtn} onClick={handleFavorite}>
          <Text>{isFavorite ? '❤️' : '🤍'}</Text>
        </View>
        <View className={styles.actionBtns}>
          <View className={`${styles.actionBtn} ${styles.secondaryBtn}`} onClick={handleNavigate}>
            导航前往
          </View>
          <View className={`${styles.actionBtn} ${styles.primaryBtn}`} onClick={handleBooking}>
            立即预约
          </View>
        </View>
      </View>
    </View>
  )
}

export default ParkingDetailPage
