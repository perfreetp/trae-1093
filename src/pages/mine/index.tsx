import React from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { userInfo, myVehicles } from '@/data/user'
import { formatPrice } from '@/utils/format'
import { availableCoupons as couponsList } from '@/data/coupon'
import { arrearsOrders as orderArrears } from '@/data/order'
import styles from './index.module.scss'

const quickMenus = [
  { icon: '🎫', text: '优惠券', path: '/pages/coupons/index', badge: couponsList.length },
  { icon: '💳', text: '月卡', path: '/pages/monthly-card/index' },
  { icon: '🚗', text: '车辆管理', path: '/pages/vehicle/index', badge: myVehicles.length },
  { icon: '⭐', text: '我的收藏', path: '/pages/favorites/index' }
]

const menuLists = [
  {
    section: '停车服务',
    items: [
      { icon: '📋', text: '欠费补缴', path: '/pages/arrears/index', badge: orderArrears.length },
      { icon: '🧾', text: '发票抬头', path: '/pages/invoice/index' },
      { icon: '💬', text: '评价投诉', path: '/pages/feedback/index' }
    ]
  },
  {
    section: '设置',
    items: [
      { icon: '🔔', text: '消息通知' },
      { icon: '⚙️', text: '系统设置' },
      { icon: '❓', text: '帮助中心' },
      { icon: 'ℹ️', text: '关于我们' }
    ]
  }
]

const MinePage: React.FC = () => {
  const handleMenuClick = (path?: string) => {
    if (path) {
      Taro.navigateTo({ url: path })
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' })
    }
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <Image className={styles.avatar} src={userInfo.avatar} mode='aspectFill' />
          <View className={styles.userText}>
            <Text className={styles.nickname}>{userInfo.nickname}</Text>
            <Text className={styles.phone}>{userInfo.phone}</Text>
          </View>
        </View>
        <View className={styles.stats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatPrice(userInfo.balance)}</Text>
            <Text className={styles.statLabel}>账户余额</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{userInfo.points}</Text>
            <Text className={styles.statLabel}>积分</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{couponsList.length}</Text>
            <Text className={styles.statLabel}>优惠券</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <View className={styles.quickMenu}>
          {quickMenus.map((menu, index) => (
            <View
              key={index}
              className={styles.menuItem}
              onClick={() => handleMenuClick(menu.path)}
            >
              <View style={{ position: 'relative' }}>
                <View className={styles.menuIcon}>{menu.icon}</View>
                {menu.badge && menu.badge > 0 && (
                  <View className={styles.badge}>
                    <Text>{menu.badge}</Text>
                  </View>
                )}
              </View>
              <Text className={styles.menuText}>{menu.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {menuLists.map((section, sectionIndex) => (
        <View key={sectionIndex} className={styles.listSection}>
          {section.items.map((item, itemIndex) => (
            <View
              key={itemIndex}
              className={styles.listItem}
              onClick={() => handleMenuClick(item.path)}
            >
              <Text className={styles.itemIcon}>{item.icon}</Text>
              <Text className={styles.itemText}>{item.text}</Text>
              {item.badge && item.badge > 0 && (
                <View className={styles.itemBadge}>
                  <Text>{item.badge}笔待缴</Text>
                </View>
              )}
              <Text className={styles.itemArrow}>{'>'}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

export default MinePage
