import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { Activity } from '../../types/activity';
import { getDifficultyLabel, getDifficultyColor, getActivityStatusLabel, getActivityStatusColor, getPaceLabel } from '../../utils/format';

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${activity.id}`
    });
  };

  return (
    <View className={styles.activityCard} onClick={handleClick}>
      <Image 
        className={styles.cover} 
        src={activity.coverImage} 
        mode="aspectFill"
      />
      <View 
        className={styles.statusBadge}
        style={{ backgroundColor: getActivityStatusColor(activity.status) }}
      >
        {getActivityStatusLabel(activity.status)}
      </View>
      <View className={styles.content}>
        <Text className={styles.title}>{activity.title}</Text>
        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>时间</Text>
            <Text className={styles.infoValue}>{activity.date} {activity.startTime}</Text>
          </View>
        </View>
        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>集合</Text>
            <Text className={styles.infoValue}>{activity.meetupPoint}</Text>
          </View>
        </View>
        <View className={styles.footer}>
          <View className={styles.tags}>
            <View 
              className={styles.tag}
              style={{ 
                backgroundColor: getDifficultyColor(activity.difficulty) + '20',
                color: getDifficultyColor(activity.difficulty)
              }}
            >
              {getDifficultyLabel(activity.difficulty)}
            </View>
            <View className={styles.tagLight}>
              {getPaceLabel(activity.pace)}
            </View>
            <View className={styles.tagLight}>
              {activity.distance}km
            </View>
          </View>
          <View className={styles.participants}>
            <Text className={styles.participantCount}>
              <Text className={styles.current}>{activity.currentParticipants}</Text>
              <Text className={styles.separator}>/</Text>
              <Text className={styles.max}>{activity.maxParticipants}</Text>
            </Text>
            <Text className={styles.participantLabel}>人参与</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
