import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useRideStore } from '../../store/rideStore';
import type { RideRecord } from '../../types/ride';
import { formatDistance, formatDuration, formatSpeed, formatDate, formatTime, formatCalories } from '../../utils/format';

const RideResultPage: React.FC = () => {
  const router = useRouter();
  const rideId = router.params.id;
  const { rides } = useRideStore();
  const [ride, setRide] = useState<RideRecord | null>(null);

  useEffect(() => {
    const foundRide = rides.find(r => r.id === rideId);
    if (foundRide) {
      setRide(foundRide);
    }
  }, [rideId, rides]);

  const handleShare = () => {
    Taro.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  };

  const handleSave = () => {
    Taro.showToast({
      title: '已保存到记录',
      icon: 'success'
    });
    setTimeout(() => {
      Taro.switchTab({
        url: '/pages/record/index'
      });
    }, 1500);
  };

  const handleBack = () => {
    Taro.switchTab({
      url: '/pages/record/index'
    });
  };

  if (!ride) {
    return (
      <View className={styles.rideResultPage}>
        <View style={{ padding: '100rpx', textAlign: 'center' }}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.rideResultPage}>
      <ScrollView scrollY>
        <View className={styles.header}>
          <Text className={styles.title}>🎉 骑行完成！</Text>
          <Text className={styles.subtitle}>{ride.title}</Text>
        </View>

        <View className={styles.mainStats}>
          <View className={styles.distanceStat}>
            <Text className={styles.distanceValue}>{(ride.distance / 1000).toFixed(2)}</Text>
            <Text className={styles.distanceUnit}>公里</Text>
          </View>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{formatDuration(ride.duration)}</Text>
              <Text className={styles.statLabel}>骑行时长</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{formatSpeed(ride.avgSpeed)}</Text>
              <Text className={styles.statLabel}>平均速度</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{formatSpeed(ride.maxSpeed)}</Text>
              <Text className={styles.statLabel}>最高速度</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{ride.elevation} m</Text>
              <Text className={styles.statLabel}>累计爬升</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{formatCalories(ride.calories)}</Text>
              <Text className={styles.statLabel}>消耗热量</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{formatDuration(ride.stopTime)}</Text>
              <Text className={styles.statLabel}>停留时间</Text>
            </View>
          </View>
        </View>

        <View className={styles.mapSection}>
          <Text className={styles.sectionTitle}>骑行轨迹</Text>
          <View className={styles.mapPreview}>
            <Text className={styles.mapIcon}>📍</Text>
            <Text className={styles.mapText}>轨迹共 {ride.points.length} 个记录点</Text>
          </View>
        </View>

        <View className={styles.infoSection}>
          <Text className={styles.sectionTitle}>详细信息</Text>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>开始时间</Text>
            <Text className={styles.infoValue}>{formatDate(ride.startTime)} {formatTime(ride.startTime)}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>结束时间</Text>
            <Text className={styles.infoValue}>{formatDate(ride.endTime)} {formatTime(ride.endTime)}</Text>
          </View>
          {ride.stopTime > 0 && (
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>停留时间</Text>
              <Text className={styles.infoValue} style={{ color: '#f59e0b' }}>
                {formatDuration(ride.stopTime)}
              </Text>
            </View>
          )}
          {ride.routeName && (
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>使用路线</Text>
              <Text className={styles.infoValue}>{ride.routeName}</Text>
            </View>
          )}
          {ride.notes && (
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>骑行笔记</Text>
              <Text className={styles.infoValue}>{ride.notes}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button className={styles.secondaryButton} onClick={handleShare}>
          分享
        </Button>
        <Button className={styles.primaryButton} onClick={handleSave}>
          完成
        </Button>
      </View>
    </View>
  );
};

export default RideResultPage;
