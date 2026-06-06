import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import EmptyState from '@/components/EmptyState'
import { myCoupons } from '@/data/coupon'
import { formatPrice } from '@/utils/format'
import styles from './index.module.scss'

const tabs = [
  { key: 'available', label: '可使用' },
  { key: 'used', label: '已使用' },
  { key: 'expired', label: '已过期' }
]

const CouponsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('available')

  const filteredCoupons = useMemo(() => {
    return myCoupons.filter(c => c.status === activeTab)
  }, [activeTab])

  const handleUse = (couponId: string) => {
    Taro.showToast({ title: '去使用', icon: 'none' })
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

      <ScrollView scrollY className={styles.list}>
        {filteredCoupons.length === 0 ? (
          <EmptyState />
        ) : (
          filteredCoupons.map(coupon => (
            <View
              key={coupon.id}
              className={classnames(
                styles.couponCard,
                coupon.status !== 'available' && styles.usedCoupon
              )}
            >
              <View className={styles.couponLeft}>
                {coupon.type === 'amount' ? (
                  <>
                    <Text className={styles.couponValue}>{coupon.value}</Text>
                    <Text className={styles.couponUnit}>元</Text>
                  </>
                ) : (
                  <>
                    <Text className={styles.couponValue}>{coupon.value * 10}</Text>
                    <Text className={styles.couponUnit}>折</Text>
                  </>
                )}
                {coupon.minAmount > 0 && (
                  <Text className={styles.couponCondition}>
                    满{formatPrice(coupon.minAmount)}可用
                  </Text>
                )}
              </View>
              <View className={styles.couponRight}>
                <View>
                  <Text className={styles.couponName}>{coupon.name}</Text>
                  <Text className={styles.couponDesc}>{coupon.description}</Text>
                </View>
                <View className={styles.couponBottom}>
                  <Text className={styles.couponExpire}>有效期至 {coupon.expireTime}</Text>
                  {coupon.status === 'available' && (
                    <View className={styles.useBtn} onClick={() => handleUse(coupon.id)}>
                      立即使用
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default CouponsPage
