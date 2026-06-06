import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import classnames from 'classnames'
import ParkingCard from '@/components/ParkingCard'
import SectionHeader from '@/components/SectionHeader'
import { parkingLots } from '@/data/parking'
import { currentParking as mockCurrentParking } from '@/data/order'
import type { ParkingLot } from '@/types/parking'
import { formatDuration } from '@/utils/format'
import styles from './index.module.scss'

const quickActions = [
  { icon: '📷', text: '扫码进场', path: '' },
  { icon: '📅', text: '预约车位', path: '/pages/booking/index' },
  { icon: '💳', text: '月卡购买', path: '/pages/monthly-card/index' },
  { icon: '🚗', text: '车辆管理', path: '/pages/vehicle/index' }
]

const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'available', label: '有车位' },
  { key: 'nearby', label: '最近' },
  { key: 'cheapest', label: '最便宜' },
  { key: 'favorite', label: '我的收藏' }
]

const HomePage: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentParking, setCurrentParking] = useState(mockCurrentParking)
  const [parkingData, setParkingData] = useState<ParkingLot[]>(parkingLots)

  useDidShow(() => {
    setCurrentParking(mockCurrentParking)
  })

  const filteredParking = useMemo(() => {
    let result = [...parkingData]

    if (searchText) {
      result = result.filter(
        lot => lot.name.includes(searchText) || lot.address.includes(searchText)
      )
    }

    switch (activeFilter) {
      case 'available':
        result = result.filter(lot => lot.availableSpaces > 0)
        break
      case 'nearby':
        result.sort((a, b) => a.distance - b.distance)
        break
      case 'cheapest':
        result.sort((a, b) => a.pricePerHour - b.pricePerHour)
        break
      case 'favorite':
        result = result.filter(lot => lot.isFavorite)
        break
    }

    return result
  }, [parkingData, searchText, activeFilter])

  const handleActionClick = (action: typeof quickActions[0]) => {
    if (action.path) {
      if (action.path.startsWith('/pages/booking')) {
        Taro.switchTab({ url: action.path })
      } else {
        Taro.navigateTo({ url: action.path })
      }
    } else {
      Taro.showToast({ title: '扫码功能开发中', icon: 'none' })
    }
  }

  const handleFindCar = () => {
    Taro.navigateTo({ url: '/pages/find-car/index' })
  }

  const handleFavorite = (id: string) => {
    setParkingData(prev =>
      prev.map(lot =>
        lot.id === id ? { ...lot, isFavorite: !lot.isFavorite } : lot
      )
    )
  }

  const onRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh()
      Taro.showToast({ title: '刷新成功', icon: 'success' })
    }, 1000)
  }

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      onRefresherRefresh={onRefresh}
    >
      <View className={styles.header}>
        <View className={styles.locationBar}>
          <Text className={styles.locationIcon}>📍</Text>
          <Text className={styles.locationText}>北京市 · 朝阳区</Text>
        </View>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder='搜索停车场名称或地址'
            placeholderClass={styles.searchPlaceholder}
            value={searchText}
            onInput={e => setSearchText(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.quickActions}>
        {quickActions.map((action, index) => (
          <View
            key={index}
            className={styles.actionItem}
            onClick={() => handleActionClick(action)}
          >
            <View className={styles.actionIcon}>{action.icon}</View>
            <Text className={styles.actionText}>{action.text}</Text>
          </View>
        ))}
      </View>

      <View className={styles.content}>
        {currentParking && (
          <View className={styles.currentParking}>
            <View className={styles.currentHeader}>
              <Text className={styles.currentIcon}>🚙</Text>
              <Text className={styles.currentTitle}>正在停车中</Text>
            </View>
            <Text className={styles.currentLot}>{currentParking.parkingLotName}</Text>
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
                <Text className={styles.infoLabel}>车位</Text>
                <Text className={styles.infoValue}>{currentParking.parkingPosition || '--'}</Text>
              </View>
            </View>
            <View className={styles.currentAction} onClick={handleFindCar}>
              查看位置 / 找车
            </View>
          </View>
        )}

        <SectionHeader
          title='附近停车场'
          moreText='查看更多'
          onMore={() => Taro.showToast({ title: '查看更多', icon: 'none' })}
        />

        <View className={styles.filterBar}>
          {filterOptions.map(option => (
            <View
              key={option.key}
              className={classnames(styles.filterItem, activeFilter === option.key && styles.active)}
              onClick={() => setActiveFilter(option.key)}
            >
              <Text>{option.label}</Text>
            </View>
          ))}
        </View>

        <View className={styles.list}>
          {filteredParking.map(lot => (
            <ParkingCard
              key={lot.id}
              data={lot}
              onFavorite={() => handleFavorite(lot.id)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default HomePage
