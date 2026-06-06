import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import StatusTag from '@/components/StatusTag'
import EmptyState from '@/components/EmptyState'
import { myFeedbacks } from '@/data/user'
import type { Feedback } from '@/types/user'
import styles from './index.module.scss'

const tabs = [
  { key: 'list', label: '我的反馈' },
  { key: 'submit', label: '提交反馈' }
]

const typeOptions = [
  { key: 'suggestion', label: '意见建议' },
  { key: 'complaint', label: '投诉' },
  { key: 'praise', label: '表扬' }
]

const FeedbackPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list')
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(myFeedbacks)
  const [selectedType, setSelectedType] = useState('suggestion')
  const [content, setContent] = useState('')

  const typeTextMap: Record<string, string> = {
    suggestion: '意见建议',
    complaint: '投诉',
    praise: '表扬'
  }

  const handleSubmit = () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请输入反馈内容', icon: 'none' })
      return
    }
    const newFeedback: Feedback = {
      id: `f${Date.now()}`,
      type: selectedType as any,
      content: content.trim(),
      status: 'pending',
      createTime: new Date().toISOString().split('T')[0]
    }
    setFeedbacks(prev => [newFeedback, ...prev])
    setContent('')
    Taro.showToast({ title: '提交成功', icon: 'success' })
    setActiveTab('list')
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

      {activeTab === 'list' ? (
        <ScrollView scrollY className={styles.list}>
          {feedbacks.length === 0 ? (
            <EmptyState title='暂无反馈记录' />
          ) : (
            feedbacks.map(feedback => (
              <View key={feedback.id} className={styles.feedbackItem}>
                <View className={styles.feedbackHeader}>
                  <Text className={styles.feedbackType}>
                    {typeTextMap[feedback.type]}
                  </Text>
                  <StatusTag status={feedback.status} />
                </View>
                <Text className={styles.feedbackContent}>{feedback.content}</Text>
                <Text className={styles.feedbackTime}>{feedback.createTime}</Text>
                {feedback.reply && (
                  <View className={styles.replyBox}>
                    <Text className={styles.replyLabel}>官方回复：</Text>
                    <Text className={styles.replyContent}>{feedback.reply}</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      ) : (
        <View className={styles.submitSection}>
          <View className={styles.typeSelector}>
            {typeOptions.map(option => (
              <View
                key={option.key}
                className={classnames(
                  styles.typeBtn,
                  selectedType === option.key && styles.typeBtnActive
                )}
                onClick={() => setSelectedType(option.key)}
              >
                <Text>{option.label}</Text>
              </View>
            ))}
          </View>
          <Textarea
            className={styles.textarea}
            placeholder='请输入您的反馈内容...'
            value={content}
            onInput={e => setContent(e.detail.value)}
          />
          <View className={styles.submitBtn} onClick={handleSubmit}>
            提交反馈
          </View>
        </View>
      )}
    </View>
  )
}

export default FeedbackPage
