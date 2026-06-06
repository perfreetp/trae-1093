import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { currentParking } from '@/data/order'
import styles from './index.module.scss'

const FindCarPage: React.FC = () => {
  const parking = currentParking

  const handleNavigate = () => {
    Taro.showToast({ title: '导航功能开发中', icon: 'none' })
  }

  const handleRecord = () => {
    Taro.showToast({ title: '已记录停车位置', icon: 'success' })
  }

  if (!parking) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100 }}>
          <Text style={{ textAlign: 'center', color: '#86909C' }}>暂无正在进行的停车</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.positionCard}>
        <Text className={styles.parkingLot}>{parking.parkingLotName}</Text>
        <View className={styles.mapPlaceholder}>
          <Text className={styles.mapIcon}>🗺️</Text>
          <Text className={styles.mapText}>停车场平面图</Text>
        </View>
        <View className={styles.infoSection}>
          <View className={styles.infoBlock}>
            <Text className={styles.infoLabel}>停车区域</Text>
            <Text className={styles.infoValue}>{parking.parkingPosition?.split('-')[0] || 'B2层'}</Text>
          </View>
          <View className={styles.infoBlock}>
            <Text className={styles.infoLabel}>车位编号</Text>
            <Text className={styles.infoValue}>{parking.parkingPosition?.split('-').slice(-1)[0] || '088'}</Text>
          </View>
        </View>
        <View className={styles.actionBtns}>
          <View className={styles.actionBtn} style={{ background: '#E8F3FF', color: '#1677FF' }} onClick={handleRecord}>
            更新位置
          </View>
          <View className={styles.actionBtn} style={{ background: 'linear-gradient(135deg, #1677FF 0%, #4096FF 100%)', color: '#fff' }} onClick={handleNavigate}>
            导航找车
          </View>
        </View>
      </View>

      <View className={styles.tips}>
        <Text className={styles.tipsTitle}>找车小贴士</Text>
        <View className={styles.tipsList}>
          <Text>1. 停车后记得拍照记录车位编号和区域</Text>
          <Text>2. 记住附近的立柱编号或店铺名称</Text>
          <Text>3. 使用蓝牙寻车功能可更精准定位</Text>
          <Text>4. 如遇困难可联系停车场工作人员</Text>
        </View>
      </View>
    </View>
  )
}

export default FindCarPage
