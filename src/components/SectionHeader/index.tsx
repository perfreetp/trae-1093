import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface SectionHeaderProps {
  title: string
  moreText?: string
  onMore?: () => void
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, moreText, onMore }) => {
  return (
    <View className={styles.header}>
      <Text className={styles.title}>{title}</Text>
      {moreText && (
        <View className={styles.more} onClick={onMore}>
          <Text>{moreText}</Text>
          <Text className={styles.arrow}>{'>'}</Text>
        </View>
      )}
    </View>
  )
}

export default SectionHeader
