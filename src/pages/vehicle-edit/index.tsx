import React, { useState, useMemo } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store'
import type { Vehicle } from '@/types/user'
import styles from './index.module.scss'

const provinces = ['京', '沪', '粤', '浙', '苏', '鲁', '冀', '豫', '川', '鄂']
const colors = ['白色', '黑色', '银色', '灰色', '红色', '蓝色', '棕色', '其他']
const brands = ['奥迪', '宝马', '奔驰', '丰田', '本田', '大众', '别克', '比亚迪', '特斯拉', '其他']

const VehicleEditPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.params
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useAppStore()

  const editingVehicle = useMemo(
    () => vehicles.find(v => v.id === id),
    [vehicles, id]
  )

  const [plateProvince, setPlateProvince] = useState(editingVehicle?.plateNumber?.charAt(0) || '京')
  const [plateNumber, setPlateNumber] = useState(editingVehicle?.plateNumber?.slice(1) || '')
  const [brand, setBrand] = useState(editingVehicle?.brand || '')
  const [model, setModel] = useState(editingVehicle?.model || '')
  const [color, setColor] = useState(editingVehicle?.color || '')
  const [isDefault, setIsDefault] = useState(editingVehicle?.isDefault || false)

  const handleProvinceSelect = () => {
    Taro.showActionSheet({
      itemList: provinces,
      success: res => {
        setPlateProvince(provinces[res.tapIndex])
      }
    })
  }

  const handleBrandSelect = () => {
    Taro.showActionSheet({
      itemList: brands,
      success: res => {
        setBrand(brands[res.tapIndex])
      }
    })
  }

  const handleColorSelect = () => {
    Taro.showActionSheet({
      itemList: colors,
      success: res => {
        setColor(colors[res.tapIndex])
      }
    })
  }

  const handleSave = () => {
    const fullPlate = plateProvince + plateNumber.toUpperCase()

    if (!plateNumber) {
      Taro.showToast({ title: '请输入车牌号', icon: 'none' })
      return
    }
    if (plateNumber.length < 6) {
      Taro.showToast({ title: '请输入完整车牌号', icon: 'none' })
      return
    }

    const vehicleData: Vehicle = {
      id: editingVehicle?.id || `vehicle_${Date.now()}`,
      plateNumber: fullPlate,
      brand,
      model,
      color,
      isDefault
    }

    if (editingVehicle) {
      updateVehicle(vehicleData)
    } else {
      addVehicle(vehicleData)
    }

    Taro.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  const handleDelete = () => {
    if (!editingVehicle) return

    Taro.showModal({
      title: '删除车辆',
      content: '确定要删除这个车辆吗？',
      success: res => {
        if (res.confirm) {
          deleteVehicle(editingVehicle.id)
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
      <View className={styles.form}>
        <View className={styles.formItem}>
          <Text className={styles.label}>车牌号码</Text>
          <View className={styles.provinceSelector} onClick={handleProvinceSelect}>
            <Text className={styles.provinceText}>{plateProvince} {plateProvince ? '▼' : '请选择省份'}</Text>
          </View>
          <Input
            className={classnames(styles.input, styles.plateInput)}
            placeholder='请输入车牌号'
            placeholderClass={styles.placeholder}
            value={plateNumber}
            maxLength={6}
            onInput={e => setPlateNumber(e.detail.value)}
          />
        </View>

        <View className={styles.row}>
          <View className={classnames(styles.formItem, styles.half)}>
            <Text className={styles.label}>车辆品牌</Text>
            <View onClick={handleBrandSelect}>
              <Input
                className={styles.input}
                placeholder='请选择品牌'
                value={brand}
                disabled
              />
            </View>
          </View>
          <View className={classnames(styles.formItem, styles.half)}>
            <Text className={styles.label}>车型</Text>
            <Input
              className={styles.input}
              placeholder='如：A6L、Model 3'
              value={model}
              onInput={e => setModel(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>车身颜色</Text>
          <View onClick={handleColorSelect}>
            <Input
              className={styles.input}
              placeholder='请选择颜色'
              value={color}
              disabled
            />
          </View>
        </View>

        <View className={styles.defaultSwitch}>
          <Text className={styles.switchLabel}>设为默认车辆</Text>
          <View
            className={classnames(styles.switchBtn, isDefault && styles.active)}
            onClick={() => setIsDefault(!isDefault)}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.saveBtn} onClick={handleSave}>
          保存
        </View>
        {editingVehicle && (
          <View className={styles.deleteBtn} onClick={handleDelete}>
            删除车辆
          </View>
        )}
      </View>
    </View>
  )
}

export default VehicleEditPage
