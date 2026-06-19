import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, Button, ScrollView, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useActivityStore } from '../../store/activityStore';
import { mockUserProfile } from '../../data/user';
import type { Activity } from '../../types/activity';
import { getDifficultyLabel, getDifficultyColor, getPaceLabel, getActivityStatusLabel, getActivityStatusColor, formatDate } from '../../utils/format';
import classnames from 'classnames';

const ActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const activityId = router.params.id;
  const { activities, joinActivity, leaveActivity, hasJoined, addAnnouncement } = useActivityStore();
  const [showAnnouncementInput, setShowAnnouncementInput] = useState(false);
  const [announcementContent, setAnnouncementContent] = useState('');
  const [showParticipantsList, setShowParticipantsList] = useState(false);

  const activity = useMemo(() => {
    return activities.find(a => a.id === activityId) || null;
  }, [activities, activityId]);

  const isJoined = useMemo(() => {
    return activity ? hasJoined(activity.id) : false;
  }, [activity, hasJoined]);

  const isOrganizer = useMemo(() => {
    return activity?.organizer.id === mockUserProfile.id;
  }, [activity]);

  const handleJoin = async () => {
    if (!activity) return;
    
    if (isOrganizer) {
      return;
    }
    
    if (isJoined) {
      Taro.showModal({
        title: '退出活动',
        content: '确定要退出此活动吗？',
        success: async (res) => {
          if (res.confirm) {
            const success = await leaveActivity(activity.id);
            if (success) {
              Taro.showToast({
                title: '已退出活动',
                icon: 'success'
              });
            } else {
              Taro.showToast({
                title: '退出失败',
                icon: 'none'
              });
            }
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
      
      const success = await joinActivity(activity.id);
      if (success) {
        Taro.showToast({
          title: '报名成功',
          icon: 'success'
        });
      } else {
        Taro.showToast({
          title: '报名失败',
          icon: 'none'
        });
      }
    }
  };

  const handleAddAnnouncement = async () => {
    if (!activity || !announcementContent.trim()) return;
    
    const result = await addAnnouncement(activity.id, announcementContent.trim());
    if (result) {
      Taro.showToast({
        title: '公告发布成功',
        icon: 'success'
      });
      setAnnouncementContent('');
      setShowAnnouncementInput(false);
    } else {
      Taro.showToast({
        title: '发布失败',
        icon: 'none'
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
        <Image 
          className={styles.coverImage} 
          src={activity.coverImage}
          mode="aspectFill"
        />

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

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>👥</Text>
              参与人员 ({activity.currentParticipants}/{activity.maxParticipants})
            </Text>
            <Text 
              className={styles.sectionMore} 
              onClick={() => setShowParticipantsList(true)}
            >
              查看全部 ›
            </Text>
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

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📢</Text>
              临时公告
            </Text>
            {isOrganizer && !isCompleted && !isCancelled && (
              <Text 
                className={styles.sectionMore}
                onClick={() => setShowAnnouncementInput(true)}
              >
                + 发布公告
              </Text>
            )}
          </View>

          {showAnnouncementInput && (
            <View style={{ 
              backgroundColor: '#f1f5f9', 
              padding: '24rpx', 
              borderRadius: '16rpx',
              marginBottom: '24rpx'
            }}>
              <Input
                placeholder="请输入公告内容..."
                value={announcementContent}
                onInput={(e) => setAnnouncementContent(e.detail.value)}
                style={{
                  backgroundColor: '#fff',
                  padding: '20rpx',
                  borderRadius: '12rpx',
                  marginBottom: '16rpx',
                  fontSize: '28rpx'
                }}
              />
              <View style={{ display: 'flex', gap: '16rpx' }}>
                <Button 
                  size="mini"
                  style={{ flex: 1, backgroundColor: '#cbd5e1', color: '#475569' }}
                  onClick={() => {
                    setShowAnnouncementInput(false);
                    setAnnouncementContent('');
                  }}
                >
                  取消
                </Button>
                <Button 
                  size="mini"
                  style={{ flex: 1 }}
                  onClick={handleAddAnnouncement}
                >
                  发布
                </Button>
              </View>
            </View>
          )}

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

      {showParticipantsList && (
        <View style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-end'
        }} onClick={() => setShowParticipantsList(false)}>
          <View 
            style={{
              width: '100%',
              maxHeight: '70vh',
              backgroundColor: '#fff',
              borderTopLeftRadius: '24rpx',
              borderTopRightRadius: '24rpx',
              padding: '32rpx'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24rpx' }}>
              <Text style={{ fontSize: '32rpx', fontWeight: '600' }}>
                报名名单 ({activity.currentParticipants}人)
              </Text>
              <Text 
                style={{ color: '#64748b', fontSize: '28rpx' }}
                onClick={() => setShowParticipantsList(false)}
              >
                关闭
              </Text>
            </View>
            <ScrollView scrollY style={{ maxHeight: '50vh' }}>
              {activity.participants.map(participant => (
                <View 
                  key={participant.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20rpx 0',
                    borderBottom: '1rpx solid #f1f5f9'
                  }}
                >
                  <Image 
                    src={participant.avatar}
                    mode="aspectFill"
                    style={{
                      width: '80rpx',
                      height: '80rpx',
                      borderRadius: '50%',
                      marginRight: '20rpx'
                    }}
                  />
                  <View>
                    <Text style={{ fontSize: '28rpx', color: '#1e293b', fontWeight: '500' }}>
                      {participant.name}
                    </Text>
                    <Text style={{ fontSize: '22rpx', color: '#94a3b8' }}>
                      报名时间: {formatDate(participant.joinedAt)}
                    </Text>
                  </View>
                  {participant.id === activity.organizer.id && (
                    <View style={{
                      marginLeft: 'auto',
                      backgroundColor: '#10b981',
                      padding: '6rpx 16rpx',
                      borderRadius: '8rpx',
                      fontSize: '20rpx',
                      color: '#fff'
                    }}>
                      组织者
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

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
          disabled={isCancelled || isCompleted || (isOrganizer && !isJoined)}
        >
          {isCancelled ? '活动已取消' : 
           isCompleted ? '活动已结束' :
           isOrganizer ? '我是组织者' :
           isJoined ? '退出报名' :
           isFull ? '名额已满' : '立即报名'}
        </Button>
      </View>
    </View>
  );
};

export default ActivityDetailPage;
