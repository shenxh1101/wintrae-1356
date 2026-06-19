import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useUserStore } from '../../store/userStore';
import type { Equipment } from '../../types/user';
import { formatDateFull } from '../../utils/format';
import classnames from 'classnames';

const equipmentTypeMap: Record<string, { label: string; icon: string; color: string }> = {
  bike: { label: '自行车', icon: '🚲', color: '#07c160' },
  helmet: { label: '头盔', icon: '⛑️', color: '#3b82f6' },
  shoes: { label: '骑行鞋', icon: '👟', color: '#f59e0b' },
  accessory: { label: '配件', icon: '🔧', color: '#8b5cf6' }
};

const EquipmentPage: React.FC = () => {
  const { equipments, deleteEquipment, recordMaintenance } = useUserStore();
  const [activeType, setActiveType] = useState<string>('all');

  const typeTabs = [
    { value: 'all', label: '全部' },
    { value: 'bike', label: '自行车' },
    { value: 'helmet', label: '头盔' },
    { value: 'shoes', label: '骑行鞋' },
    { value: 'accessory', label: '配件' }
  ];

  const filteredEquipments = activeType === 'all' 
    ? equipments 
    : equipments.filter(e => e.type === activeType);

  const getDaysUntilMaintenance = (nextDateStr: string): number => {
    const nextDate = new Date(nextDateStr);
    const today = new Date();
    const diff = nextDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getMaintenanceStatus = (days: number): { text: string; type: 'normal' | 'warning' | 'overdue' } => {
    if (days < 0) return { text: `已逾期${Math.abs(days)}天`, type: 'overdue' };
    if (days <= 7) return { text: `${days}天后保养`, type: 'warning' };
    return { text: `${days}天后保养`, type: 'normal' };
  };

  const handleEquipmentClick = (equipment: Equipment) => {
    Taro.showActionSheet({
      itemList: ['查看详情', '记录保养', '编辑装备', '删除装备'],
      success: async (res) => {
        switch (res.tapIndex) {
          case 0:
            Taro.showToast({ title: '查看详情', icon: 'none' });
            break;
          case 1:
            Taro.showModal({
              title: '记录保养',
              content: `确认已完成 "${equipment.name}" 的保养吗？`,
              success: async (modalRes) => {
                if (modalRes.confirm) {
                  await recordMaintenance(equipment.id);
                  Taro.showToast({ title: '已记录保养', icon: 'success' });
                }
              }
            });
            break;
          case 2:
            Taro.showToast({ title: '编辑功能开发中', icon: 'none' });
            break;
          case 3:
            Taro.showModal({
              title: '删除装备',
              content: `确定要删除 "${equipment.name}" 吗？`,
              confirmColor: '#ef4444',
              success: async (modalRes) => {
                if (modalRes.confirm) {
                  await deleteEquipment(equipment.id);
                  Taro.showToast({ title: '已删除', icon: 'success' });
                }
              }
            });
            break;
        }
      }
    });
  };

  const handleAddEquipment = () => {
    Taro.showActionSheet({
      itemList: ['添加自行车', '添加头盔', '添加骑行鞋', '添加配件'],
      success: (res) => {
        const types = ['bike', 'helmet', 'shoes', 'accessory'];
        Taro.showToast({ 
          title: `添加${typeTabs[res.tapIndex + 1]?.label || '装备'}功能开发中`, 
          icon: 'none' 
        });
      }
    });
  };

  const totalDistance = equipments.reduce((sum, e) => sum + e.totalDistance, 0);

  return (
    <View className={styles.equipmentPage}>
      <View className={styles.statsCard}>
        <View className={styles.statsItem}>
          <Text className={styles.statsValue}>{equipments.length}</Text>
          <Text className={styles.statsLabel}>装备数量</Text>
        </View>
        <View className={styles.statsDivider} />
        <View className={styles.statsItem}>
          <Text className={styles.statsValue}>{totalDistance.toFixed(1)} km</Text>
          <Text className={styles.statsLabel}>总里程</Text>
        </View>
        <View className={styles.statsDivider} />
        <View className={styles.statsItem}>
          <Text className={classnames(styles.statsValue, styles.warningText)}>
            {equipments.filter(e => getDaysUntilMaintenance(e.nextMaintenance) <= 7).length}
          </Text>
          <Text className={styles.statsLabel}>待保养</Text>
        </View>
      </View>

      <ScrollView className={styles.typeTabs} scrollX>
        {typeTabs.map(tab => (
          <View
            key={tab.value}
            className={classnames(
              styles.typeTab,
              activeType === tab.value && styles.typeTabActive
            )}
            onClick={() => setActiveType(tab.value)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView className={styles.equipmentList} scrollY>
        {filteredEquipments.length > 0 ? (
          filteredEquipments.map(equipment => {
            const days = getDaysUntilMaintenance(equipment.nextMaintenance);
            const status = getMaintenanceStatus(days);
            const typeInfo = equipmentTypeMap[equipment.type];

            return (
              <View 
                key={equipment.id} 
                className={styles.equipmentCard}
                onClick={() => handleEquipmentClick(equipment)}
              >
                <View 
                  className={styles.equipmentIcon}
                  style={{ backgroundColor: `${typeInfo.color}15` }}
                >
                  <Text style={{ fontSize: '48rpx' }}>{typeInfo.icon}</Text>
                </View>

                <View className={styles.equipmentInfo}>
                  <View className={styles.equipmentHeader}>
                    <Text className={styles.equipmentName}>{equipment.name}</Text>
                    <View 
                      className={styles.typeBadge}
                      style={{ backgroundColor: `${typeInfo.color}15`, color: typeInfo.color }}
                    >
                      {typeInfo.label}
                    </View>
                  </View>

                  <Text className={styles.equipmentModel}>
                    {equipment.brand} · {equipment.model}
                  </Text>

                  <View className={styles.equipmentStats}>
                    <View className={styles.statItem}>
                      <Text className={styles.statLabel}>总里程</Text>
                      <Text className={styles.statValue}>{equipment.totalDistance.toFixed(1)} km</Text>
                    </View>
                    <View className={styles.statItem}>
                      <Text className={styles.statLabel}>购入日期</Text>
                      <Text className={styles.statValue}>{formatDateFull(equipment.purchaseDate)}</Text>
                    </View>
                  </View>

                  <View 
                    className={classnames(
                      styles.maintenanceBar,
                      status.type === 'warning' && styles.maintenanceWarning,
                      status.type === 'overdue' && styles.maintenanceOverdue
                    )}
                  >
                    <Text className={styles.maintenanceIcon}>🔧</Text>
                    <Text className={styles.maintenanceText}>
                      下次保养：{formatDateFull(equipment.nextMaintenance)}
                    </Text>
                    <View className={styles.maintenanceStatus}>
                      <Text className={classnames(
                        styles.statusDot,
                        status.type === 'warning' && styles.statusDotWarning,
                        status.type === 'overdue' && styles.statusDotOverdue
                      )} />
                      <Text className={classnames(
                        styles.statusText,
                        status.type === 'warning' && styles.statusTextWarning,
                        status.type === 'overdue' && styles.statusTextOverdue
                      )}>
                        {status.text}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🚲</Text>
            <Text className={styles.emptyTitle}>暂无装备</Text>
            <Text className={styles.emptyDesc}>点击下方按钮添加你的第一件装备</Text>
          </View>
        )}

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button className={styles.addButton} onClick={handleAddEquipment}>
          <Text className={styles.addIcon}>＋</Text>
          添加装备
        </Button>
      </View>
    </View>
  );
};

export default EquipmentPage;
