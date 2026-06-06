import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useAppStore } from '@/store'
import { formatPrice, formatDuration, formatPlateNumber } from '@/utils/format'
import dayjs from 'dayjs'
import styles from './index.module.scss'

const InvoiceApplyPage: React.FC = () => {
  const router = useRouter()
  const { orderId } = router.params
  const { orders, invoices, updateOrder } = useAppStore()
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  const order = useMemo(() => orders.find(o => o.id === orderId), [orders, orderId])
  const selectedInvoice = useMemo(
    () => invoices.find(i => i.id === selectedInvoiceId),
    [invoices, selectedInvoiceId]
  )

  const handleInvoiceSelect = () => {
    if (invoices.length === 0) {
      Taro.showModal({
        title: '提示',
        content: '您还没有添加发票抬头，请先添加',
        confirmText: '去添加',
        success: res => {
          if (res.confirm) {
            Taro.navigateTo({ url: '/pages/invoice-edit/index' })
          }
        }
      })
      return
    }
    Taro.showActionSheet({
      itemList: invoices.map(i => `${i.title}${i.isDefault ? ' (默认)' : ''}`),
      success: res => {
        setSelectedInvoiceId(invoices[res.tapIndex].id)
      }
    })
  }

  const handleAddInvoice = () => {
    Taro.navigateTo({ url: '/pages/invoice-edit/index' })
  }

  const handleSubmit = () => {
    if (!selectedInvoiceId) {
      Taro.showToast({ title: '请选择发票抬头', icon: 'none' })
      return
    }
    if (!order) return

    updateOrder(order.id, {
      ...order,
      invoiceStatus: 'applied'
    })

    Taro.showToast({ title: '发票申请已提交', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  if (!order) {
    return (
      <View className={styles.page}>
        <Text className={styles.empty}>订单不存在</Text>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>开票订单</Text>
          <View className={styles.card}>
            <View className={styles.orderRow}>
              <Text className={styles.orderLabel}>停车场</Text>
              <Text className={styles.orderValue}>{order.parkingLotName}</Text>
            </View>
            <View className={styles.orderRow}>
              <Text className={styles.orderLabel}>车牌号码</Text>
              <Text className={styles.orderValue}>{formatPlateNumber(order.plateNumber)}</Text>
            </View>
            <View className={styles.orderRow}>
              <Text className={styles.orderLabel}>入场时间</Text>
              <Text className={styles.orderValue}>{order.entryTime}</Text>
            </View>
            {order.exitTime && (
              <View className={styles.orderRow}>
                <Text className={styles.orderLabel}>离场时间</Text>
                <Text className={styles.orderValue}>{order.exitTime}</Text>
              </View>
            )}
            <View className={styles.orderRow}>
              <Text className={styles.orderLabel}>停车时长</Text>
              <Text className={styles.orderValue}>
                {order.duration ? formatDuration(order.duration) : '--'}
              </Text>
            </View>
            <View className={styles.divider} />
            <View className={styles.orderRow}>
              <Text className={styles.orderLabel}>开票金额</Text>
              <Text className={styles.priceValue}>{formatPrice(order.paidAmount)}</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>发票抬头</Text>
          <View className={styles.card}>
            {selectedInvoice ? (
              <View className={styles.invoiceInfo}>
                <View className={styles.invoiceType}>
                  {selectedInvoice.type === 'personal' ? '个人/非企业' : '企业单位'}
                </View>
                <View className={styles.invoiceRow}>
                  <Text className={styles.invoiceLabel}>抬头名称</Text>
                  <Text className={styles.invoiceValue}>{selectedInvoice.title}</Text>
                </View>
                {selectedInvoice.type === 'enterprise' && selectedInvoice.taxNumber && (
                  <View className={styles.invoiceRow}>
                    <Text className={styles.invoiceLabel}>税号</Text>
                    <Text className={styles.invoiceValue}>{selectedInvoice.taxNumber}</Text>
                  </View>
                )}
              </View>
            ) : (
              <View className={styles.selectInvoice} onClick={handleInvoiceSelect}>
                <Text className={styles.selectIcon}>📄</Text>
                <Text className={styles.selectText}>请选择发票抬头</Text>
                <Text className={styles.selectArrow}>›</Text>
              </View>
            )}
          </View>
          <View className={styles.changeInvoice}>
            <Text onClick={handleInvoiceSelect}>选择其他抬头</Text>
            <Text className={styles.dividerText}> | </Text>
            <Text onClick={handleAddInvoice}>添加新抬头</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>开票说明</Text>
          <View className={styles.tips}>
            <Text className={styles.tipItem}>• 发票申请提交后，预计1-3个工作日开具</Text>
            <Text className={styles.tipItem}>• 电子发票将发送至您的预留邮箱</Text>
            <Text className={styles.tipItem}>• 如需纸质发票请联系客服</Text>
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.amountBox}>
          <Text className={styles.amountLabel}>开票金额</Text>
          <Text className={styles.amountValue}>{formatPrice(order.paidAmount)}</Text>
        </View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          提交申请
        </View>
      </View>
    </View>
  )
}

export default InvoiceApplyPage
