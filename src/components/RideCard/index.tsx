import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { RideRecord } from '../../types/ride';
import { formatDistance, formatDuration, formatSpeed, formatDate, formatTime } from '../../utils/format';

interface RideCardProps {
  ride: RideRecord;
  showRouteName?: boolean;
}

const RideCard: React.FC<RideCardProps> = ({ ride, showRouteName = true }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/ride-result/index?id=${ride.id}`
    });
  };

  return (
    <View className={styles.rideCard} onClick={handleClick}>
      {ride.coverImage && (
        <Image 
          className={styles.cover} 
          src={ride.coverImage} 
          mode="aspectFill"
        />
      )}
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{ride.title}</Text>
          <Text className={styles.date}>{formatDate(ride.startTime)}</Text>
        </View>
        {showRouteName && ride.routeName && (
          <Text className={styles.routeName}>路线：{ride.routeName}</Text>
        )}
        <View className={styles.stats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: '#07c160' }}>
              {formatDistance(ride.distance)}
            </Text>
            <Text className={styles.statLabel}>距离</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: '#3b82f6' }}>
              {formatDuration(ride.duration)}
            </Text>
            <Text className={styles.statLabel}>时长</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: '#f59e0b' }}>
              {formatSpeed(ride.avgSpeed)}
            </Text>
            <Text className={styles.statLabel}>均速</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ color: '#8b5cf6' }}>
              {ride.elevation}m
            </Text>
            <Text className={styles.statLabel}>爬升</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RideCard;
