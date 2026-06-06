import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { parkingLots } from '@/data/parking'
import { formatDistance, formatPrice } from '@/utils/format'
import styles from './index.module.scss'

const MapPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>('1')

  const markers = [
    { id: '1', x: '30%', y: '30%' },
    { id: '2', x: '60%', y: '25%' },
    { id: '3', x: '45%', y: '45%' },
    { id: '4', x: '70%', y: '55%' },
    { id: '5', x: '25%', y: '65%' },
    { id: '6', x: '55%', y: '70%' }
  ]

  const displayedParkings = parkingLots.slice(0, 6)
  const selectedParking = parkingLots.find(p => p.id === selectedId)

  const handleMarkerClick = (id: string) => {
    setSelectedId(id)
  }

  const handleParkingClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/parking-detail/index?id=${id}`
    })
  }

  const handleNavigate = (id: string) => {
    Taro.navigateTo({
      url: `/pages/navigation/index?parkingId=${id}`
    })
  }

  const handleScan = () => {
    Taro.navigateTo({ url: '/pages/scan-entry/index' })
  }

  const handleLocate = () => {
    Taro.showToast({ title: '定位中...', icon: 'loading' })
  }

  return (
    <View className={styles.page}>
      <View className={styles.mapContainer}>
        <View className={styles.mapPlaceholder}>
          <Text className={styles.mapIcon}>🗺️</Text>
          <Text className={styles.mapText}>地图加载中...</Text>
        </View>

        {markers.map(marker => {
          const parking = parkingLots.find(p => p.id === marker.id)
          if (!parking) return null
          return (
            <View
              key={marker.id}
              className={classnames(styles.marker, selectedId === marker.id && styles.active)}
              style={{ left: marker.x, top: marker.y }}
              onClick={() => handleMarkerClick(marker.id)}
            >
              <View className={styles.markerPin}>
                <Text>P</Text>
              </View>
              {parking.availableSpaces > 0 && (
                <View className={styles.markerAvailable}>
                  <Text>{parking.availableSpaces}位</Text>
                </View>
              )}
            </View>
          )
        })}

        <View className={styles.scanButton} onClick={handleScan}>
          <Text>📷</Text>
        </View>

        <View className={styles.myLocation} onClick={handleLocate}>
          <Text>📍</Text>
        </View>
      </View>

      <View className={styles.bottomSheet}>
        <View className={styles.sheetHandle} />
        <Text className={styles.sheetTitle}>附近停车场</Text>
        <ScrollView scrollY className={styles.sheetContent} style={{ maxHeight: 400 }}>
          {displayedParkings.map(parking => (
            <View
              key={parking.id}
              className={classnames(styles.parkingItem, selectedId === parking.id && styles.active)}
              onClick={() => handleParkingClick(parking.id)}
            >
              <Image className={styles.itemImage} src={parking.image} mode='aspectFill' />
              <View className={styles.itemInfo}>
                <Text className={styles.itemName}>{parking.name}</Text>
                <Text className={styles.itemAddress}>{parking.address}</Text>
                <View className={styles.itemBottom}>
                  <Text className={styles.itemAvailable}>
                    {parking.availableSpaces > 0 ? `剩余 ${parking.availableSpaces} 位` : '车位已满'}
                    {' · '}
                    {formatDistance(parking.distance)}
                  </Text>
                  <View>
                    <Text className={styles.itemPrice}>{formatPrice(parking.pricePerHour)}</Text>
                    <Text className={styles.itemPriceUnit}>/小时</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default MapPage
