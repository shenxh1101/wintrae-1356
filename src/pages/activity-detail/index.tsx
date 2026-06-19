import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { mockActivities } from '../../data/activities';
import type { Activity } from '../../types/activity';
import { getDifficultyLabel, getDifficultyColor, getPaceLabel, getActivityStatusLabel, getActivityStatusColor, formatDate } from '../../utils/format';
import classnames from 'classnames';

const ActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const activityId = router.params.id;
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const foundActivity = mockActivities.find(a => a.id === activityId);
    if (foundActivity) {
      setActivity(foundActivity);
      const hasJoined = foundActivity.participants.some(p => p.id === 'u1');
      setIsJoined(hasJoined);
    }
  }, [activityId]);

  const handleJoin = () => {
    if (!activity) return;
    
    if (isJoined) {
      Taro.showModal({
        title: '退出活动',
        content: '确定要退出此活动吗？',
        success: (res) => {
          if (res.confirm) {
            setIsJoined(false);
            setActivity({
              ...activity,
              currentParticipants: activity.currentParticipants - 1
            });
            Taro.showToast({
              title: '已退出活动',
              icon: 'none'
            });
          }
        }
      });
    } else {
      if (activity.currentParticipants >= activity.maxParticipants) {
        Taro.showToast({
          title: '名额已满',
          icon: 'none'
        });
        return;
      }
      
      setIsJoined(true);
      setActivity({
        ...activity,
        currentParticipants: activity.currentParticipants + 1
      });
      Taro.showToast({
        title: '报名成功',
        icon: 'success'
      });
    }
  };

  if (!activity) {
    return (
      <View className={styles.activityDetailPage}>
        <View style={{ padding: '100rpx', textAlign: 'center' }}>
          <Text>活动不存在</Text>
        </View>
      </View>
    );
  }

  const isFull = activity.currentParticipants >= activity.maxParticipants;
  const isCancelled = activity.status === 'cancelled';
  const isCompleted = activity.status === 'completed';

  return (
    <View className={styles.activityDetailPage}>
      <ScrollView scrollY>
        {/* 封面图 */}
        <Image 
          className={styles.coverImage} 
          src={activity.coverImage}
          mode="aspectFill"
        />

        {/* 活动基本信息 */}
        <View className={styles.activityInfo}>
          <View 
            className={styles.statusBadge}
            style={{ backgroundColor: getActivityStatusColor(activity.status) }}
          >
            {getActivityStatusLabel(activity.status)}
          </View>
          <Text className={styles.activityTitle}>{activity.title}</Text>
          <Text className={styles.activityDesc}>{activity.description}</Text>
          
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>活动时间</Text>
              <Text className={styles.infoValue}>
                {activity.date} {activity.startTime}-{activity.endTime}
              </Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>集合地点</Text>
              <Text className={styles.infoValue}>{activity.meetupPoint}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>骑行距离</Text>
              <Text className={styles.infoValue}>{activity.distance} km</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>难度/节奏</Text>
              <Text className={styles.infoValue}>
                <Text style={{ color: getDifficultyColor(activity.difficulty) }}>
                  {getDifficultyLabel(activity.difficulty)}
                </Text>
                {' · '}
                {getPaceLabel(activity.pace)}
              </Text>
            </View>
          </View>
        </View>

        {/* 组织者 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👤</Text>
            组织者
          </Text>
          <View className={styles.organizerInfo}>
            <Image 
              className={styles.organizerAvatar}
              src={activity.organizer.avatar}
              mode="aspectFill"
            />
            <View>
              <Text className={styles.organizerName}>{activity.organizer.name}</Text>
              <Text className={styles.organizerLabel}>活动发起者</Text>
            </View>
          </View>
        </View>

        {/* 参与人员 */}
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>👥</Text>
              参与人员 ({activity.currentParticipants}/{activity.maxParticipants})
            </Text>
            <Text className={styles.sectionMore}>查看全部 ›</Text>
          </View>
          {activity.participants.length > 0 ? (
            <View className={styles.participantsList}>
              {activity.participants.slice(0, 6).map(participant => (
                <View key={participant.id} className={styles.participantItem}>
                  <Image 
                    className={styles.participantAvatar}
                    src={participant.avatar}
                    mode="aspectFill"
                  />
                  <Text className={styles.participantName}>{participant.name}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>👥</Text>
              <Text className={styles.emptyText}>暂无参与者，快来报名吧</Text>
            </View>
          )}
        </View>

        {/* 临时公告 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📢</Text>
            临时公告
          </Text>
          {activity.announcements.length > 0 ? (
            <View className={styles.announcementList}>
              {activity.announcements.map(announcement => (
                <View key={announcement.id} className={styles.announcementItem}>
                  <View className={styles.announcementHeader}>
                    <View className={styles.announcementBadge}>公告</View>
                    <Text className={styles.announcementTime}>
                      {formatDate(announcement.createdAt)}
                    </Text>
                  </View>
                  <Text className={styles.announcementContent}>
                    {announcement.content}
                  </Text>
                  <Text style={{ fontSize: '22rpx', color: '#94a3b8', marginTop: '8rpx' }}>
                    — {announcement.creatorName}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📢</Text>
              <Text className={styles.emptyText}>暂无公告</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.bottomBar}>
        <Text className={styles.participantsCount}>
          <Text className={styles.countHighlight}>{activity.currentParticipants}</Text>
          <Text>/{activity.maxParticipants}人参与</Text>
        </Text>
        <Button 
          className={classnames(
            styles.joinButton,
            isJoined && styles.joined,
            (isFull || isCancelled || isCompleted) && styles.disabled
          )}
          onClick={handleJoin}
          disabled={isCancelled || isCompleted}
        >
          {isCancelled ? '活动已取消' : 
           isCompleted ? '活动已结束' :
           isJoined ? '已报名' :
           isFull ? '名额已满' : '立即报名'}
        </Button>
      </View>
    </View>
  );
};

export default ActivityDetailPage;
