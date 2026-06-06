import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import EmptyState from '@/components/EmptyState'
import { favoriteLots, parkingLots } from '@/data/parking'
import type { ParkingLot } from '@/types/parking'
import { formatDistance, formatPrice } from '@/utils/format'
import styles from './index.module.scss'

const tabs = [
  { key: 'all', label: '全部收藏' },
  { key: 'available', label: '有车位' },
  { key: 'indoor', label: '室内' }
]

const FavoritesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [favorites, setFavorites] = useState<ParkingLot[]>(favoriteLots)

  const filteredFavorites = useMemo(() => {
    let result = favorites
    switch (activeTab) {
      case 'available':
        return result.filter(lot => lot.availableSpaces > 0)
      case 'indoor':
        return result.filter(lot => lot.tags.includes('室内'))
      default:
        return result
    }
  }, [favorites, activeTab])

  const handleToggleFavorite = (lotId: string) => {
    setFavorites(prev => prev.filter(lot => lot.id !== lotId))
    Taro.showToast({ title: '已取消收藏', icon: 'success' })
  }

  const handleNavigate = (lot: ParkingLot) => {
    Taro.showToast({ title: '导航功能开发中', icon: 'none' })
  }

  const handleBooking = (lot: ParkingLot) => {
    Taro.navigateTo({
      url: `/pages/parking-detail/index?id=${lot.id}`
    })
  }

  const handleCardClick = (lot: ParkingLot) => {
    Taro.navigateTo({
      url: `/pages/parking-detail/index?id=${lot.id}`
    })
  }

  const onRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  return (
    <View className={styles.page}>
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

      <ScrollView
        scrollY
        className={styles.list}
        refresherEnabled
        onRefresherRefresh={onRefresh}
      >
        {filteredFavorites.length === 0 ? (
          <EmptyState title='暂无收藏的停车场' />
        ) : (
          filteredFavorites.map(lot => (
            <View
              key={lot.id}
              className={styles.parkingCard}
              onClick={() => handleCardClick(lot)}
            >
              <Image
                src={lot.image}
                className={styles.cardImage}
                mode='aspectFill'
              />
              <View className={styles.cardContent}>
                <View className={styles.cardHeader}>
                  <Text className={styles.cardTitle}>{lot.name}</Text>
                  <View
                    className={styles.favoriteBtn}
                    onClick={e => {
                      e.stopPropagation()
                      handleToggleFavorite(lot.id)
                    }}
                  >
                    ❤️
                  </View>
                </View>
                <View className={styles.cardAddress}>
                  <Text>📍</Text>
                  <Text>{lot.address}</Text>
                </View>
                <View className={styles.cardInfo}>
                  <View className={styles.infoItem}>
                    <Text>📏</Text>
                    <Text>{formatDistance(lot.distance)}</Text>
                  </View>
                  <View className={styles.infoItem}>
                    <Text>🅿️</Text>
                    <Text
                      className={classnames(
                        lot.availableSpaces > 0 ? styles.availableSpaces : styles.fullSpaces
                      )}
                    >
                      剩余 {lot.availableSpaces} 位
                    </Text>
                  </View>
                  <View className={styles.infoItem}>
                    <Text>⏰</Text>
                    <Text>{lot.openTime}</Text>
                  </View>
                </View>
                <View className={styles.tags}>
                  {lot.tags.map((tag, idx) => (
                    <View key={idx} className={styles.tag}>
                      <Text>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View className={styles.cardFooter}>
                  <View className={styles.priceSection}>
                    <Text className={styles.priceValue}>{formatPrice(lot.pricePerHour)}</Text>
                    <Text className={styles.priceUnit}>/小时</Text>
                  </View>
                  <View className={styles.rating}>⭐ {lot.rating}</View>
                </View>
                <View className={styles.cardActions}>
                  <View
                    className={classnames(styles.actionBtn, styles.secondary)}
                    onClick={e => {
                      e.stopPropagation()
                      handleNavigate(lot)
                    }}
                  >
                    导航
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.primary)}
                    onClick={e => {
                      e.stopPropagation()
                      handleBooking(lot)
                    }}
                  >
                    预约停车
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default FavoritesPage
