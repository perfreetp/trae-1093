import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import EmptyState from '@/components/EmptyState'
import { useAppStore } from '@/store'
import { formatPrice } from '@/utils/format'
import type { Coupon } from '@/types/coupon'
import styles from './index.module.scss'

const tabs = [
  { key: 'claim', label: '可领取' },
  { key: 'available', label: '可使用' },
  { key: 'used', label: '已使用' },
  { key: 'expired', label: '已过期' }
]

const CouponsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('claim')
  const { coupons, availableCoupons, claimCoupon } = useAppStore()

  const filteredCoupons = useMemo(() => {
    switch (activeTab) {
      case 'claim':
        return availableCoupons
      case 'available':
        return coupons.filter(c => c.status === 'available')
      case 'used':
        return coupons.filter(c => c.status === 'used')
      case 'expired':
        return coupons.filter(c => c.status === 'expired')
      default:
        return []
    }
  }, [activeTab, coupons, availableCoupons])

  const handleClaim = (coupon: Coupon) => {
    claimCoupon(coupon)
    Taro.showToast({ title: '领取成功', icon: 'success' })
  }

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
          <EmptyState
            title={activeTab === 'claim' ? '暂无可领取优惠券' : '暂无优惠券'}
          />
        ) : (
          filteredCoupons.map(coupon => (
            <View
              key={coupon.id}
              className={classnames(
                styles.couponCard,
                (coupon.status !== 'available' && activeTab !== 'claim') && styles.usedCoupon
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
                  {activeTab === 'claim' ? (
                    <View className={styles.claimBtn} onClick={() => handleClaim(coupon)}>
                      立即领取
                    </View>
                  ) : coupon.status === 'available' ? (
                    <View className={styles.useBtn} onClick={() => handleUse(coupon.id)}>
                      立即使用
                    </View>
                  ) : coupon.status === 'used' ? (
                    <Text className={styles.usedTag}>已使用</Text>
                  ) : (
                    <Text className={styles.expiredTag}>已过期</Text>
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
