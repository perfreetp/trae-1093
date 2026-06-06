import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { myVehicles } from '@/data/user'
import type { Vehicle } from '@/types/user'
import styles from './index.module.scss'

const VehiclePage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(myVehicles)

  const handleSetDefault = (id: string) => {
    setVehicles(prev =>
      prev.map(v => ({
        ...v,
        isDefault: v.id === id
      }))
    )
    Taro.showToast({ title: '已设为默认', icon: 'success' })
  }

  const handleEdit = (id: string) => {
    Taro.showToast({ title: '编辑功能开发中', icon: 'none' })
  }

  const handleDelete = (id: string) => {
    Taro.showModal({
      title: '删除车辆',
      content: '确定要删除这个车辆吗？',
      success: res => {
        if (res.confirm) {
          setVehicles(prev => prev.filter(v => v.id !== id))
          Taro.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  }

  const handleAdd = () => {
    Taro.showToast({ title: '添加车辆功能开发中', icon: 'none' })
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.list}>
        {vehicles.map(vehicle => (
          <View key={vehicle.id} className={styles.vehicleCard}>
            {vehicle.isDefault && (
              <View className={styles.defaultBadge}>
                <Text>默认车辆</Text>
              </View>
            )}
            <Text className={styles.plateNumber}>{vehicle.plateNumber}</Text>
            <Text className={styles.vehicleInfo}>
              {vehicle.brand} {vehicle.model} · {vehicle.color}
            </Text>
            <View className={styles.cardActions}>
              {!vehicle.isDefault && (
                <View
                  className={classnames(styles.actionBtn, styles.primaryBtn)}
                  onClick={() => handleSetDefault(vehicle.id)}
                >
                  设为默认
                </View>
              )}
              <View
                className={classnames(styles.actionBtn, styles.secondaryBtn)}
                onClick={() => handleEdit(vehicle.id)}
              >
                编辑
              </View>
              <View
                className={classnames(styles.actionBtn, styles.secondaryBtn)}
                onClick={() => handleDelete(vehicle.id)}
              >
                删除
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className={styles.addBtn} onClick={handleAdd}>
        + 添加车辆
      </View>
    </View>
  )
}

export default VehiclePage
