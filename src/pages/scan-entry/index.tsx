import React, { useState, useRef, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { parkingLots } from '@/data/parking'
import { useAppStore } from '@/store'
import { formatPlateNumber } from '@/utils/format'
import dayjs from 'dayjs'
import styles from './index.module.scss'

const ScanEntryPage: React.FC = () => {
  const [scanned, setScanned] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const addOrder = useAppStore(state => state.addOrder)
  const vehicles = useAppStore(state => state.vehicles)
  const pendingScanRef = useRef(false)

  const availableParkings = useMemo(
    () => parkingLots.filter(p => p.availableSpaces > 0),
    []
  )

  const randomParking = useMemo(
    () => availableParkings[Math.floor(Math.random() * availableParkings.length)],
    [availableParkings]
  )

  const defaultVehicle = useMemo(
    () => vehicles.find(v => v.isDefault) || vehicles[0],
    [vehicles]
  )

  useDidShow(() => {
    if (pendingScanRef.current && vehicles.length > 0) {
      pendingScanRef.current = false
      const vehicle = vehicles.find(v => v.isDefault) || vehicles[0]
      if (vehicle) {
        doMockScan(vehicle)
      }
    }
  })

  const doMockScan = (vehicle: any) => {
    Taro.showLoading({ title: '识别中...' })
    setTimeout(() => {
      Taro.hideLoading()
      const entryTime = dayjs().format('YYYY-MM-DD HH:mm')
      setScanResult({
        parkingLot: randomParking,
        plateNumber: vehicle?.plateNumber || '京A12345',
        entryTime,
        parkingPosition: `B${Math.floor(Math.random() * 3) + 1}-${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}区-${String(Math.floor(Math.random() * 200) + 1).padStart(3, '0')}`
      })
      setScanned(true)
    }, 1500)
  }

  const handleMockScan = () => {
    if (vehicles.length === 0) {
      Taro.showModal({
        title: '提示',
        content: '您还没有添加车辆，请先添加车辆后再扫码进场',
        confirmText: '去添加',
        success: res => {
          if (res.confirm) {
            pendingScanRef.current = true
            Taro.navigateTo({ url: '/pages/vehicle-edit/index' })
          }
        }
      })
      return
    }
    doMockScan(defaultVehicle)
  }

  const handleConfirm = () => {
    if (!scanResult) return

    const newOrder = {
      id: `order_${Date.now()}`,
      parkingLotId: scanResult.parkingLot.id,
      parkingLotName: scanResult.parkingLot.name,
      parkingLotAddress: scanResult.parkingLot.address,
      plateNumber: scanResult.plateNumber,
      entryTime: scanResult.entryTime,
      duration: 0,
      totalAmount: 0,
      paidAmount: 0,
      status: 'parking' as const,
      parkingPosition: scanResult.parkingPosition,
      createTime: scanResult.entryTime
    }

    addOrder(newOrder)
    Taro.showToast({ title: '进场成功', icon: 'success' })
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/order/index' })
    }, 1500)
  }

  return (
    <View className={styles.page}>
      {!scanned ? (
        <>
          <View className={styles.scanArea}>
            <Text className={styles.scanTitle}>扫一扫进场</Text>
            <Text className={styles.scanDesc}>将二维码对准扫描框</Text>
            <View className={styles.scanFrame}>
              <Text className={styles.scanIcon}>📷</Text>
              <View className={styles.scanLine} />
            </View>
          </View>
          <View className={styles.mockBtn} onClick={handleMockScan}>
            模拟扫码进场
          </View>
        </>
      ) : (
        <View className={styles.resultCard}>
          <View className={styles.resultHeader}>
            <Text className={styles.successIcon}>✅</Text>
            <Text className={styles.resultTitle}>扫码成功</Text>
          </View>
          <View className={styles.resultInfo}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>停车场</Text>
              <Text className={styles.infoValue}>{scanResult.parkingLot.name}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>车牌号码</Text>
              <Text className={styles.infoValue}>{formatPlateNumber(scanResult.plateNumber)}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>入场时间</Text>
              <Text className={styles.infoValue}>{scanResult.entryTime}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>推荐车位</Text>
              <Text className={styles.infoValue}>{scanResult.parkingPosition}</Text>
            </View>
          </View>
          <View className={styles.tips}>
            <Text className={styles.tipsText}>
              💡 请按照场内指示牌前往指定区域停车。离场时可通过无感支付快速出场。
            </Text>
          </View>
          <View className={styles.confirmBtn} onClick={handleConfirm}>
            确认进场
          </View>
        </View>
      )}
    </View>
  )
}

export default ScanEntryPage
