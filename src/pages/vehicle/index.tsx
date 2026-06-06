import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store'
import styles from './index.module.scss'

const VehiclePage: React.FC = () => {
  const { vehicles, setDefaultVehicle, deleteVehicle } = useAppStore()

  const handleSetDefault = (id: string) => {
    setDefaultVehicle(id)
    Taro.showToast({ title: '已设为默认', icon: 'success' })
  }

  const handleEdit = (id: string) => {
    Taro.navigateTo({
      url: `/pages/vehicle-edit/index?id=${id}`
    })
  }

  const handleDelete = (id: string) => {
    Taro.showModal({
      title: '删除车辆',
      content: '确定要删除这个车辆吗？',
      success: res => {
        if (res.confirm) {
          deleteVehicle(id)
          Taro.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  }

  const handleAdd = () => {
    Taro.navigateTo({ url: '/pages/vehicle-edit/index' })
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
