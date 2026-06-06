import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { parkingLots } from '@/data/parking'
import { formatDistance } from '@/utils/format'
import styles from './index.module.scss'

const NavigationPage: React.FC = () => {
  const router = useRouter()
  const { parkingId } = router.params
  const parking = parkingLots.find(p => p.id === parkingId) || parkingLots[0]
  const [isNavigating, setIsNavigating] = useState(false)

  const distance = parking.distance
  const duration = Math.ceil(distance * 10)
  const eta = new Date(Date.now() + duration * 60000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  const handleStartNav = () => {
    setIsNavigating(true)
    Taro.showToast({ title: '已开始导航', icon: 'success' })
  }

  const handleStopNav = () => {
    setIsNavigating(false)
    Taro.showToast({ title: '已停止导航', icon: 'none' })
  }

  const handleScanEntry = () => {
    Taro.navigateTo({ url: '/pages/scan-entry/index' })
  }

  return (
    <View className={styles.page}>
      <View className={styles.mapArea}>
        <View className={styles.mapPlaceholder}>
          <Text className={styles.mapIcon}>🗺️</Text>
          <Text className={styles.mapText}>{isNavigating ? '导航中...' : '规划路线中'}</Text>
        </View>
        <View className={styles.routeLine}>
          <View className={styles.routePath} />
        </View>
        {isNavigating && (
          <View className={styles.navStatusBar}>
            <View className={styles.navDot} />
            <Text className={styles.navStatusText}>正在前往：{parking.entranceAddress}</Text>
          </View>
        )}
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.parkingName}>{parking.name}</Text>
        <View className={styles.parkingAddress}>
          <Text>📍</Text>
          <Text>{parking.address}</Text>
        </View>
        <View className={styles.entranceInfo}>
          <Text className={styles.entranceLabel}>入口地址</Text>
          <Text className={styles.entranceText}>{parking.entranceAddress}</Text>
        </View>

        <View className={styles.routeInfo}>
          <View className={styles.routeItem}>
            <Text className={styles.routeValue}>{formatDistance(distance)}</Text>
            <Text className={styles.routeLabel}>总距离</Text>
          </View>
          <View className={styles.routeItem}>
            <Text className={styles.routeValue}>{duration}分钟</Text>
            <Text className={styles.routeLabel}>预计用时</Text>
          </View>
          <View className={styles.routeItem}>
            <Text className={styles.routeValue}>{eta}</Text>
            <Text className={styles.routeLabel}>预计到达</Text>
          </View>
        </View>

        <View className={styles.tips}>
          <Text className={styles.tipsTitle}>
            <Text>💡</Text>
            温馨提示
          </Text>
          <Text className={styles.tipsItem}>• 请按导航路线前往入口，注意行车安全</Text>
          <Text className={styles.tipsItem}>• 剩余车位 {parking.availableSpaces} 个，入场前可先预约</Text>
          <Text className={styles.tipsItem}>• 支持无感支付，离场无需扫码</Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.secondaryBtn} onClick={handleScanEntry}>
          扫码进场
        </View>
        <View
          className={classnames(styles.primaryBtn, isNavigating && styles.navigating)}
          onClick={isNavigating ? handleStopNav : handleStartNav}
        >
          {isNavigating ? (
            <View className={styles.navigatingStatus}>
              <View className={styles.navDot} />
              <Text>导航中 · 点击停止</Text>
            </View>
          ) : (
            '开始导航'
          )}
        </View>
      </View>
    </View>
  )
}

export default NavigationPage
