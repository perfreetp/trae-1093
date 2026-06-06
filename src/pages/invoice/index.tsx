import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { myInvoices } from '@/data/user'
import type { Invoice } from '@/types/user'
import styles from './index.module.scss'

const InvoicePage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(myInvoices)

  const handleSetDefault = (id: string) => {
    setInvoices(prev =>
      prev.map(inv => ({
        ...inv,
        isDefault: inv.id === id
      }))
    )
    Taro.showToast({ title: '已设为默认', icon: 'success' })
  }

  const handleEdit = (id: string) => {
    Taro.showToast({ title: '编辑功能开发中', icon: 'none' })
  }

  const handleDelete = (id: string) => {
    Taro.showModal({
      title: '删除抬头',
      content: '确定要删除这个发票抬头吗？',
      success: res => {
        if (res.confirm) {
          setInvoices(prev => prev.filter(inv => inv.id !== id))
          Taro.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  }

  const handleAdd = () => {
    Taro.showToast({ title: '添加功能开发中', icon: 'none' })
  }

  const typeTextMap: Record<string, string> = {
    company: '企业单位',
    personal: '个人'
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.list}>
        {invoices.map(invoice => (
          <View key={invoice.id} className={styles.invoiceCard}>
            {invoice.isDefault && (
              <View className={styles.defaultBadge}>
                <Text>默认</Text>
              </View>
            )}
            <Text className={styles.invoiceType}>{typeTextMap[invoice.type]}</Text>
            <Text className={styles.invoiceTitle}>{invoice.title}</Text>
            {invoice.taxNumber && (
              <Text className={styles.taxNumber}>税号：{invoice.taxNumber}</Text>
            )}
            <View className={styles.cardActions}>
              {!invoice.isDefault && (
                <View
                  className={classnames(styles.actionBtn, styles.primaryBtn)}
                  onClick={() => handleSetDefault(invoice.id)}
                >
                  设为默认
                </View>
              )}
              <View
                className={classnames(styles.actionBtn, styles.secondaryBtn)}
                onClick={() => handleEdit(invoice.id)}
              >
                编辑
              </View>
              <View
                className={classnames(styles.actionBtn, styles.secondaryBtn)}
                onClick={() => handleDelete(invoice.id)}
              >
                删除
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className={styles.addBtn} onClick={handleAdd}>
        + 添加发票抬头
      </View>
    </View>
  )
}

export default InvoicePage
