import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import type { ParkingLot } from '@/types/parking'
import { formatDistance, formatPrice } from '@/utils/format'
import styles from './index.module.scss'

interface ParkingCardProps {
  data: ParkingLot
  onClick?: () => void
  showFavorite?: boolean
  onFavorite?: () => void
}

const ParkingCard: React.FC<ParkingCardProps> = ({ data, onClick, showFavorite = true, onFavorite }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      Taro.navigateTo({
        url: `/pages/parking-detail/index?id=${data.id}`
      })
    }
  }

  const handleFavorite = (e: any) => {
    e.stopPropagation()
    onFavorite?.()
  }

  const isAvailable = data.availableSpaces > 0

  return (
    <View className={styles.card} onClick={handleClick}>
      <Image className={styles.image} src={data.image} mode='aspectFill' />
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{data.name}</Text>
          {showFavorite && (
            <View
              className={classnames(styles.favorite, data.isFavorite && styles.active)}
              onClick={handleFavorite}
            >
              <Text>{data.isFavorite ? '❤️' : '🤍'}</Text>
            </View>
          )}
        </View>
        <Text className={styles.address}>{data.address}</Text>
        <View className={styles.info}>
          <View className={styles.infoItem}>
            <Text className={styles.distance}>{formatDistance(data.distance)}</Text>
          </View>
          <View
            className={classnames(
              styles.availability,
              isAvailable ? styles.available : styles.unavailable
            )}
          >
            <Text>
              {isAvailable ? `剩余 ${data.availableSpaces} 位` : '车位已满'}
            </Text>
          </View>
        </View>
        <View className={styles.footer}>
          <View className={styles.tags}>
            {data.tags.slice(0, 3).map((tag, index) => (
              <View key={index} className={styles.tag}>
                <Text>{tag}</Text>
              </View>
            ))}
          </View>
          <View className={styles.price}>
            <Text className={styles.priceValue}>{formatPrice(data.pricePerHour)}</Text>
            <Text className={styles.priceUnit}>/小时</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ParkingCard
