import React from 'react'
import { View, Text } from '@tarojs/components'
import { getStatusText, getStatusColor } from '@/utils/format'
import styles from './index.module.scss'

interface StatusTagProps {
  status: string
  customText?: string
  size?: 'sm' | 'md'
}

const StatusTag: React.FC<StatusTagProps> = ({ status, customText, size = 'sm' }) => {
  const color = getStatusColor(status)
  const text = customText || getStatusText(status)

  return (
    <View
      className={size === 'md' ? styles.tagMd : styles.tagSm}
      style={{ backgroundColor: `${color}15`, color }}
    >
      <Text>{text}</Text>
    </View>
  )
}

export default StatusTag
