import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { mockRides } from '../../data/rides';
import type { RideRecord } from '../../types/ride';
import { formatDistance, formatDuration, formatSpeed, formatDate, formatTime, formatCalories } from '../../utils/format';

const RideResultPage: React.FC = () => {
  const router = useRouter();
  const rideId = router.params.id;
  const [ride, setRide] = useState<RideRecord | null>(null);

  useEffect(() => {
    if (rideId === 'new') {
      const distance = parseFloat(router.params.distance || '0');
      const duration = parseInt(router.params.duration || '0');
      
      setRide({
        id: 'new',
        title: '自由骑行',
        distance: distance,
        duration: duration,
        avgSpeed: duration > 0 ? (distance / 1000) / (duration / 3600) : 0,
        maxSpeed: 28.5,
        elevation: Math.round(distance / 1000 * 5),
        calories: Math.round(distance / 1000 * 30),
        points: [],
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        stopTime: 0,
        coverImage: 'https://picsum.photos/id/1015/600/400'
      });
    } else {
      const foundRide = mockRides.find(r => r.id === rideId);
      if (foundRide) {
        setRide(foundRide);
      }
    }
  }, [rideId, router.params]);

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
    Taro.navigateBack();
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
        {/* 头部 */}
        <View className={styles.header}>
          <Text className={styles.title}>🎉 骑行完成！</Text>
          <Text className={styles.subtitle}>{ride.title}</Text>
        </View>

        {/* 主要数据 */}
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

        {/* 轨迹地图 */}
        <View className={styles.mapSection}>
          <Text className={styles.sectionTitle}>骑行轨迹</Text>
          <View className={styles.mapPreview}>
            <Text className={styles.mapIcon}>📍</Text>
            <Text className={styles.mapText}>查看完整轨迹地图</Text>
          </View>
        </View>

        {/* 详细信息 */}
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

      {/* 底部操作栏 */}
      <View className={styles.bottomBar}>
        <Button className={styles.secondaryButton} onClick={handleShare}>
          分享
        </Button>
        <Button className={styles.primaryButton} onClick={handleSave}>
          保存记录
        </Button>
      </View>
    </View>
  );
};

export default RideResultPage;
