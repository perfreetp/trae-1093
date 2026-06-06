import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import EmptyState from '@/components/EmptyState'
import { monthlyCards } from '@/data/coupon'
import { formatPrice } from '@/utils/format'
import styles from './index.module.scss'

const tabs = [
  { key: 'all', label: '全部卡' },
  { key: 'owned', label: '我的卡' }
]

const MonthlyCardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [cards, setCards] = useState(monthlyCards)

  const filteredCards = useMemo(() => {
    if (activeTab === 'owned') {
      return cards.filter(c => c.status === 'owned')
    }
    return cards
  }, [activeTab, cards])

  const handleBuy = (cardId: string) => {
    Taro.showModal({
      title: '购买确认',
      content: '确定要购买该月卡吗？',
      success: res => {
        if (res.confirm) {
          setCards(prev =>
            prev.map(c =>
              c.id === cardId
                ? { ...c, status: 'owned' as const, expireTime: '2025-07-07' }
                : c
            )
          )
          Taro.showToast({ title: '购买成功', icon: 'success' })
        }
      }
    })
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
        {filteredCards.length === 0 ? (
          <EmptyState title='暂无月卡' />
        ) : (
          filteredCards.map(card => (
            <View
              key={card.id}
              className={classnames(styles.cardItem, card.status === 'owned' && styles.owned)}
            >
              <View className={styles.cardHeader}>
                <Text className={styles.cardName}>{card.name}</Text>
                {card.status === 'owned' && (
                  <View className={styles.cardTag}>
                    <Text>已购买</Text>
                  </View>
                )}
              </View>
              <Text className={styles.cardDesc}>{card.description}</Text>
              <Text className={styles.cardDuration}>有效期：{card.duration}天</Text>
              <View className={styles.cardFooter}>
                <View style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Text className={styles.cardPrice}>{formatPrice(card.price)}</Text>
                  {card.expireTime && (
                    <Text className={styles.expireText}>有效期至 {card.expireTime}</Text>
                  )}
                </View>
                {card.status !== 'owned' ? (
                  <View className={styles.buyBtn} onClick={() => handleBuy(card.id)}>
                    立即购买
                  </View>
                ) : (
                  <View className={classnames(styles.buyBtn, styles.ownedBtn)}>
                    使用中
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default MonthlyCardPage
