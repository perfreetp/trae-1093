import React, { useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { parkingLots } from '@/data/parking'
import { useAppStore } from '@/store'
import { formatPrice, formatPlateNumber } from '@/utils/format'
import dayjs from 'dayjs'
import styles from './index.module.scss'

const BookingConfirmPage: React.FC = () => {
  const router = useRouter()
  const { parkingId, date, slot } = router.params
  const addBooking = useAppStore(state => state.addBooking)
  const vehicles = useAppStore(state => state.vehicles)

  const parking = useMemo(
    () => parkingLots.find(p => p.id === parkingId) || parkingLots[0],
    [parkingId]
  )

  const defaultVehicle = useMemo(
    () => vehicles.find(v => v.isDefault) || vehicles[0],
    [vehicles]
  )

  const startTime = slot || '09:00'
  const endTime = useMemo(() => {
    const [hour, minute] = startTime.split(':').map(Number)
    return `${String(hour + 2).padStart(2, '0')}:${minute}`
  }, [startTime])

  const duration = 2
  const price = parking.pricePerHour * duration

  const handleSubmit = () => {
    const newBooking = {
      id: `booking_${Date.now()}`,
      parkingLotId: parking.id,
      parkingLotName: parking.name,
      parkingLotAddress: parking.address,
      plateNumber: defaultVehicle?.plateNumber || '京A12345',
      startTime: `${date} ${startTime}`,
      endTime: `${date} ${endTime}`,
      duration,
      price,
      status: 'confirmed' as const,
      createTime: dayjs().format('YYYY-MM-DD HH:mm')
    }

    addBooking(newBooking)
    Taro.showToast({ title: '预约成功', icon: 'success' })
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/booking/index' })
    }, 1500)
  }

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>停车场信息</Text>
          <View className={styles.infoCard}>
            <Text className={styles.parkingName}>{parking.name}</Text>
            <Text className={styles.parkingAddress}>📍 {parking.address}</Text>
            <View className={styles.parkingTags}>
              {parking.tags.map((tag, idx) => (
                <View key={idx} className={styles.tag}>
                  <Text>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>预约信息</Text>
          <View className={styles.infoCard}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>预约日期</Text>
              <Text className={styles.infoValue}>
                {dayjs(date).format('YYYY年MM月DD日')}
              </Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>预约时段</Text>
              <Text className={styles.infoValue}>{startTime} - {endTime}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>停车时长</Text>
              <Text className={styles.infoValue}>{duration} 小时</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>车牌号码</Text>
              <Text className={styles.infoValue}>
                {defaultVehicle ? formatPlateNumber(defaultVehicle.plateNumber) : '--'}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>费用明细</Text>
          <View className={styles.infoCard}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>单价</Text>
              <Text className={styles.infoValue}>{formatPrice(parking.pricePerHour)}/小时</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>时长</Text>
              <Text className={styles.infoValue}>{duration} 小时</Text>
            </View>
            <View className={styles.divider} />
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>预计费用</Text>
              <Text className={styles.priceValue}>{formatPrice(price)}</Text>
            </View>
          </View>
        </View>

        <View className={styles.tips}>
          <Text className={styles.tipsText}>
            💡 请在预约开始前 15 分钟到场，超时 30 分钟未入场预约将自动取消。
          </Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View>
          <Text className={styles.totalPrice}>预计费用</Text>
          <Text className={styles.priceValue}>{formatPrice(price)}</Text>
        </View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          确认预约
        </View>
      </View>
    </View>
  )
}

export default BookingConfirmPage
