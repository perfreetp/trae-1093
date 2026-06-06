import React, { useState, useMemo, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
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
  const router = useRouter()
  const { parkingId, tab } = router.params
  const [activeTab, setActiveTab] = useState(tab || 'new')

  React.useEffect(() => {
    if (tab) {
      setActiveTab(tab)
    }
  }, [tab])
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [selectedStartSlot, setSelectedStartSlot] = useState<string | null>(null)
  const [selectedEndSlot, setSelectedEndSlot] = useState<string | null>(null)
  const [selectedParkingId, setSelectedParkingId] = useState<string | null>(parkingId || null)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const { bookings, vehicles, cancelBooking } = useAppStore()

  const timeSlots = useMemo(() => generateTimeSlots(selectedDate), [selectedDate])
  const defaultVehicle = vehicles.find(v => v.isDefault)
  const selectedParking = parkingLots.find(p => p.id === selectedParkingId)
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || defaultVehicle
  const availableParkings = parkingLots.filter(p => p.availableSpaces > 0)

  useEffect(() => {
    if (defaultVehicle && !selectedVehicleId) {
      setSelectedVehicleId(defaultVehicle.id)
    }
  }, [defaultVehicle, selectedVehicleId])

  const getEndSlotOptions = () => {
    if (!selectedStartSlot) return []
    const startIndex = timeSlots.findIndex(s => s.start === selectedStartSlot)
    return timeSlots.slice(startIndex + 1)
  }

  const endSlotOptions = getEndSlotOptions()

  const calculateDuration = () => {
    if (!selectedStartSlot || !selectedEndSlot) return 0
    const start = dayjs(`${selectedDate} ${selectedStartSlot}`)
    const end = dayjs(`${selectedDate} ${selectedEndSlot}`)
    return end.diff(start, 'hour', true)
  }

  const calculatePrice = () => {
    const duration = calculateDuration()
    if (!selectedParking || duration <= 0) return 0
    return Math.ceil(duration * selectedParking.pricePerHour * 100) / 100
  }

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
        setSelectedStartSlot(null)
        setSelectedEndSlot(null)
      }
    })
  }

  const handleStartSlotSelect = (slot: typeof timeSlots[0]) => {
    if (!slot.available) return
    setSelectedStartSlot(slot.start)
    setSelectedEndSlot(null)
  }

  const handleEndSlotSelect = (slot: typeof timeSlots[0]) => {
    if (!slot.available) return
    setSelectedEndSlot(slot.start)
  }

  const handleParkingSelect = () => {
    Taro.showActionSheet({
      itemList: availableParkings.map(p => p.name),
      success: res => {
        setSelectedParkingId(availableParkings[res.tapIndex].id)
      }
    })
  }

  const handleVehicleSelect = () => {
    if (vehicles.length === 0) {
      Taro.showModal({
        title: '提示',
        content: '您还没有添加车辆，请先添加车辆',
        confirmText: '去添加',
        success: res => {
          if (res.confirm) {
            Taro.navigateTo({ url: '/pages/vehicle-edit/index' })
          }
        }
      })
      return
    }
    Taro.showActionSheet({
      itemList: vehicles.map(v => `${v.plateNumber}${v.isDefault ? ' (默认)' : ''}`),
      success: res => {
        setSelectedVehicleId(vehicles[res.tapIndex].id)
      }
    })
  }

  const handleSubmitBooking = () => {
    if (!selectedParkingId) {
      Taro.showToast({ title: '请选择停车场', icon: 'none' })
      return
    }
    if (!selectedStartSlot) {
      Taro.showToast({ title: '请选择开始时间', icon: 'none' })
      return
    }
    if (!selectedEndSlot) {
      Taro.showToast({ title: '请选择结束时间', icon: 'none' })
      return
    }
    if (!selectedVehicle) {
      Taro.showToast({ title: '请选择车辆', icon: 'none' })
      return
    }
    const start = dayjs(`${selectedDate} ${selectedStartSlot}`)
    const end = dayjs(`${selectedDate} ${selectedEndSlot}`)
    if (end.diff(start, 'minute') <= 0) {
      Taro.showToast({ title: '结束时间必须晚于开始时间', icon: 'none' })
      return
    }

    const duration = calculateDuration()
    const price = calculatePrice()

    Taro.navigateTo({
      url: `/pages/booking-confirm/index?parkingId=${selectedParkingId}&date=${selectedDate}&startSlot=${selectedStartSlot}&endSlot=${selectedEndSlot}&vehicleId=${selectedVehicle.id}&duration=${duration}&price=${price}`
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
            <View className={styles.selector} onClick={handleParkingSelect}>
              <Text className={styles.selectorIcon}>🅿️</Text>
              <Text className={styles.selectorText}>
                {selectedParking ? selectedParking.name : '请选择停车场'}
              </Text>
              <Text className={styles.selectorArrow}>▼</Text>
            </View>
            {selectedParking && (
              <Text className={styles.selectedInfo}>
                📍 {selectedParking.address} · 剩余 {selectedParking.availableSpaces} 位
              </Text>
            )}

            <Text className={styles.bookingTitle}>选择预约日期</Text>
            <View className={styles.selector} onClick={handleDateSelect}>
              <Text className={styles.selectorIcon}>📅</Text>
              <Text className={styles.selectorText}>
                {dayjs(selectedDate).format('YYYY年MM月DD日')}
              </Text>
              <Text className={styles.selectorArrow}>▼</Text>
            </View>

            <Text className={styles.bookingTitle}>选择开始时段</Text>
            <View className={styles.timeSlots}>
              {timeSlots.map((slot, index) => (
                <View
                  key={index}
                  className={classnames(
                    styles.slotItem,
                    !slot.available && styles.slotUnavailable,
                    selectedStartSlot === slot.start && styles.slotSelected
                  )}
                  onClick={() => handleStartSlotSelect(slot)}
                >
                  <Text className={styles.slotTime}>{slot.start}</Text>
                  <Text className={styles.slotPrice}>
                    {slot.available ? `${formatPrice(slot.price)}/时` : '已约满'}
                  </Text>
                </View>
              ))}
            </View>

            {selectedStartSlot && (
              <>
                <Text className={styles.bookingTitle}>选择结束时段</Text>
                <View className={styles.timeSlots}>
                  {endSlotOptions.map((slot, index) => (
                    <View
                      key={index}
                      className={classnames(
                        styles.slotItem,
                        !slot.available && styles.slotUnavailable,
                        selectedEndSlot === slot.start && styles.slotSelected
                      )}
                      onClick={() => handleEndSlotSelect(slot)}
                    >
                      <Text className={styles.slotTime}>{slot.start}</Text>
                      <Text className={styles.slotPrice}>
                        {slot.available ? '可选' : '已约满'}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <Text className={styles.bookingTitle}>选择车牌</Text>
            <View className={styles.selector} onClick={handleVehicleSelect}>
              <Text className={styles.selectorIcon}>🚗</Text>
              <Text className={styles.selectorText}>
                {selectedVehicle ? selectedVehicle.plateNumber : '请选择车辆'}
              </Text>
              <Text className={styles.selectorArrow}>▼</Text>
            </View>

            {selectedStartSlot && selectedEndSlot && selectedParking && (
              <View className={styles.summaryCard}>
                <Text className={styles.summaryTitle}>预约信息</Text>
                <View className={styles.summaryRow}>
                  <Text className={styles.summaryLabel}>停车时长</Text>
                  <Text className={styles.summaryValue}>{calculateDuration()}小时</Text>
                </View>
                <View className={styles.summaryRow}>
                  <Text className={styles.summaryLabel}>预计费用</Text>
                  <Text className={styles.summaryPrice}>{formatPrice(calculatePrice())}</Text>
                </View>
              </View>
            )}

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
