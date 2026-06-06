import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import StatusTag from '@/components/StatusTag'
import EmptyState from '@/components/EmptyState'
import { generateTimeSlots } from '@/data/booking'
import { parkingLots } from '@/data/parking'
import { useAppStore } from '@/store'
import { formatPrice } from '@/utils/format'
import dayjs from 'dayjs'
import styles from './index.module.scss'

const tabs = [
  { key: 'new', label: '新建预约' },
  { key: 'my', label: '我的预约' }
]

const BookingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('new')
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedParkingId, setSelectedParkingId] = useState<string | null>(null)
  const { bookings, vehicles, cancelBooking } = useAppStore()

  const timeSlots = useMemo(() => generateTimeSlots(selectedDate), [selectedDate])
  const defaultVehicle = vehicles.find(v => v.isDefault) || vehicles[0]
  const selectedParking = parkingLots.find(p => p.id === selectedParkingId)
  const availableParkings = parkingLots.filter(p => p.availableSpaces > 0)

  const handleDateSelect = () => {
    Taro.showActionSheet({
      itemList: [
        dayjs().format('MM月DD日 今天'),
        dayjs().add(1, 'day').format('MM月DD日 明天'),
        dayjs().add(2, 'day').format('MM月DD日 后天')
      ],
      success: res => {
        const dates = [
          dayjs().format('YYYY-MM-DD'),
          dayjs().add(1, 'day').format('YYYY-MM-DD'),
          dayjs().add(2, 'day').format('YYYY-MM-DD')
        ]
        setSelectedDate(dates[res.tapIndex])
        setSelectedSlot(null)
      }
    })
  }

  const handleSlotSelect = (slot: typeof timeSlots[0]) => {
    if (!slot.available) return
    setSelectedSlot(slot.start)
  }

  const handleParkingSelect = () => {
    Taro.showActionSheet({
      itemList: availableParkings.map(p => p.name),
      success: res => {
        setSelectedParkingId(availableParkings[res.tapIndex].id)
      }
    })
  }

  const handleSubmitBooking = () => {
    if (!selectedParkingId) {
      Taro.showToast({ title: '请选择停车场', icon: 'none' })
      return
    }
    if (!selectedSlot) {
      Taro.showToast({ title: '请选择预约时段', icon: 'none' })
      return
    }
    Taro.navigateTo({
      url: `/pages/booking-confirm/index?parkingId=${selectedParkingId}&date=${selectedDate}&slot=${selectedSlot}`
    })
  }

  const handleCancelBooking = (id: string) => {
    Taro.showModal({
      title: '取消预约',
      content: '确定要取消这个预约吗？',
      success: res => {
        if (res.confirm) {
          cancelBooking(id)
          Taro.showToast({ title: '已取消', icon: 'success' })
        }
      }
    })
  }

  const handleBookingAction = (id: string, status: string) => {
    if (status === 'pending') {
      Taro.showToast({ title: '预约确认中...', icon: 'loading' })
    }
  }

  const displayBookings = useMemo(() => {
    if (activeTab === 'my') return bookings
    return []
  }, [activeTab, bookings])

  const onRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      onRefresherRefresh={onRefresh}
    >
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

      <View className={styles.content}>
        {activeTab === 'new' ? (
          <View className={styles.newBooking}>
            <Text className={styles.bookingTitle}>选择停车场</Text>
            <View className={styles.dateSelector} onClick={handleParkingSelect}>
              <Text className={styles.dateIcon}>🅿️</Text>
              <Text className={styles.dateText}>
                {selectedParking ? selectedParking.name : '请选择停车场'}
              </Text>
              <Text className={styles.dateArrow}>▼</Text>
            </View>
            {selectedParking && (
              <Text className={styles.selectedParkingInfo}>
                📍 {selectedParking.address} · 剩余 {selectedParking.availableSpaces} 位
              </Text>
            )}

            <Text className={styles.bookingTitle}>选择预约时间</Text>
            <View className={styles.dateSelector} onClick={handleDateSelect}>
              <Text className={styles.dateIcon}>📅</Text>
              <Text className={styles.dateText}>
                {dayjs(selectedDate).format('YYYY年MM月DD日')}
              </Text>
              <Text className={styles.dateArrow}>▼</Text>
            </View>

            <View className={styles.timeSlots}>
              {timeSlots.map((slot, index) => (
                <View
                  key={index}
                  className={classnames(
                    styles.slotItem,
                    !slot.available && styles.slotUnavailable,
                    selectedSlot === slot.start && styles.slotSelected
                  )}
                  onClick={() => handleSlotSelect(slot)}
                >
                  <Text className={styles.slotTime}>
                    {slot.start}-{slot.end}
                  </Text>
                  <Text className={styles.slotPrice}>
                    {slot.available ? `${formatPrice(slot.price)}` : '已约满'}
                  </Text>
                </View>
              ))}
            </View>

            <View className={styles.quickButton} onClick={handleSubmitBooking}>
              确认预约信息
            </View>
          </View>
        ) : (
          <View className={styles.bookingList}>
            {displayBookings.length === 0 ? (
              <EmptyState title='暂无预约记录' description='快去预约一个车位吧~' />
            ) : (
              displayBookings.map(booking => (
                <View key={booking.id} className={styles.bookingCard}>
                  <View className={styles.bookingHeader}>
                    <Text className={styles.bookingLot}>{booking.parkingLotName}</Text>
                    <StatusTag status={booking.status} size='md' />
                  </View>
                  <View className={styles.bookingInfo}>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>预约时间</Text>
                      <Text className={styles.infoValue}>
                        {booking.startTime} ~ {booking.endTime}
                      </Text>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>车牌号码</Text>
                      <Text className={styles.infoValue}>{booking.plateNumber}</Text>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>预计时长</Text>
                      <Text className={styles.infoValue}>{booking.duration}小时</Text>
                    </View>
                  </View>
                  <View className={styles.bookingFooter}>
                    <Text className={styles.bookingPrice}>
                      预约费 {formatPrice(booking.price)}
                    </Text>
                    <View className={styles.bookingActions}>
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <View
                          className={classnames(styles.actionBtn, styles.secondaryBtn)}
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          <Text>取消预约</Text>
                        </View>
                      )}
                      {booking.status === 'pending' && (
                        <View
                          className={classnames(styles.actionBtn, styles.primaryBtn)}
                          onClick={() => handleBookingAction(booking.id, booking.status)}
                        >
                          <Text>确认</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default BookingPage
