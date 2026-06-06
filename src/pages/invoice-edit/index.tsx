import React, { useState, useMemo } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store'
import type { Invoice } from '@/types/user'
import styles from './index.module.scss'

const InvoiceEditPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.params
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useAppStore()

  const editingInvoice = useMemo(
    () => invoices.find(v => v.id === id),
    [invoices, id]
  )

  const [type, setType] = useState<'personal' | 'company'>(editingInvoice?.type || 'personal')
  const [title, setTitle] = useState(editingInvoice?.title || '')
  const [taxNumber, setTaxNumber] = useState(editingInvoice?.taxNumber || '')
  const [address, setAddress] = useState(editingInvoice?.address || '')
  const [phone, setPhone] = useState(editingInvoice?.phone || '')
  const [bank, setBank] = useState(editingInvoice?.bank || '')
  const [bankAccount, setBankAccount] = useState(editingInvoice?.bankAccount || '')
  const [isDefault, setIsDefault] = useState(editingInvoice?.isDefault || false)

  const handleSave = () => {
    if (!title) {
      Taro.showToast({ title: '请输入发票抬头', icon: 'none' })
      return
    }

    const invoiceData: Invoice = {
      id: editingInvoice?.id || `invoice_${Date.now()}`,
      type,
      title,
      taxNumber: type === 'company' ? taxNumber : '',
      address: type === 'company' ? address : '',
      phone: type === 'company' ? phone : '',
      bank: type === 'company' ? bank : '',
      bankAccount: type === 'company' ? bankAccount : '',
      isDefault
    }

    if (editingInvoice) {
      updateInvoice(invoiceData)
    } else {
      addInvoice(invoiceData)
    }

    Taro.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  const handleDelete = () => {
    if (!editingInvoice) return

    Taro.showModal({
      title: '删除抬头',
      content: '确定要删除这个发票抬头吗？',
      success: res => {
        if (res.confirm) {
          deleteInvoice(editingInvoice.id)
          Taro.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
        }
      }
    })
  }

  return (
    <View className={styles.page}>
      <View className={styles.typeSelector}>
        <View
          className={classnames(styles.typeTab, type === 'personal' && styles.active)}
          onClick={() => setType('personal')}
        >
          <Text className={styles.typeIcon}>👤</Text>
          <Text className={styles.typeText}>个人/非企业</Text>
        </View>
        <View
          className={classnames(styles.typeTab, type === 'company' && styles.active)}
          onClick={() => setType('company')}
        >
          <Text className={styles.typeIcon}>🏢</Text>
          <Text className={styles.typeText}>企业单位</Text>
        </View>
      </View>

      <View className={styles.form}>
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>发票抬头
          </Text>
          <Input
            className={styles.input}
            placeholder='请输入发票抬头'
            value={title}
            onInput={e => setTitle(e.detail.value)}
          />
        </View>

        {type === 'company' && (
          <>
            <View className={styles.formItem}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>税号
              </Text>
              <Input
                className={styles.input}
                placeholder='请输入纳税人识别号'
                value={taxNumber}
                onInput={e => setTaxNumber(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>单位地址</Text>
              <Input
                className={styles.input}
                placeholder='请输入单位地址（选填）'
                value={address}
                onInput={e => setAddress(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>电话号码</Text>
              <Input
                className={styles.input}
                placeholder='请输入电话号码（选填）'
                value={phone}
                onInput={e => setPhone(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>开户银行</Text>
              <Input
                className={styles.input}
                placeholder='请输入开户银行（选填）'
                value={bank}
                onInput={e => setBank(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>银行账号</Text>
              <Input
                className={styles.input}
                placeholder='请输入银行账号（选填）'
                value={bankAccount}
                onInput={e => setBankAccount(e.detail.value)}
              />
            </View>
          </>
        )}
      </View>

      <View className={styles.defaultSwitch}>
        <Text className={styles.switchLabel}>设为默认抬头</Text>
        <View
          className={classnames(styles.switchBtn, isDefault && styles.active)}
          onClick={() => setIsDefault(!isDefault)}
        />
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.saveBtn} onClick={handleSave}>
          保存
        </View>
        {editingInvoice && (
          <View className={styles.deleteBtn} onClick={handleDelete}>
            删除抬头
          </View>
        )}
      </View>
    </View>
  )
}

export default InvoiceEditPage
