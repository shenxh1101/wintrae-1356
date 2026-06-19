import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import ActivityCard from '../../components/ActivityCard';
import { useActivityStore } from '../../store/activityStore';
import { mockUserProfile } from '../../data/user';
import classnames from 'classnames';

type ActivityTab = 'upcoming' | 'joined' | 'organized';

const ActivitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActivityTab>('upcoming');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { activities, initActivities, joinActivity, leaveActivity, hasJoined } = useActivityStore();

  useEffect(() => {
    initActivities();
  }, []);

  const onPullDownRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      initActivities();
      setIsRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  const currentUserId = mockUserProfile.id;
  const filteredActivities = activities.filter(activity => {
    if (activeTab === 'upcoming') {
      return activity.status === 'upcoming';
    }
    if (activeTab === 'joined') {
      return activity.participants.some(p => p.id === currentUserId);
    }
    if (activeTab === 'organized') {
      return activity.organizer.id === currentUserId;
    }
    return true;
  });

  const handleCreate = () => {
    Taro.navigateTo({
      url: '/pages/create-activity/index'
    });
  };

  const tabs = [
    { key: 'upcoming' as const, label: '即将开始' },
    { key: 'joined' as const, label: '我报名的' },
    { key: 'organized' as const, label: '我发起的' }
  ];

  return (
    <View className={styles.activitiesPage}>
      {/* 顶部 Header */}
      <View className={styles.header}>
        <Text className={styles.headerTitle}>约骑活动</Text>
        <Text className={styles.headerSubtitle}>发现附近的骑行活动，结识志同道合的骑友</Text>
      </View>

      {/* Tab 切换 */}
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View 
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {activeTab === tab.key && <View className={styles.tabIndicator}></View>}
          </View>
        ))}
      </View>

      {/* 活动列表 */}
      <ScrollView
        scrollY
        refresherEnabled
        refresherTriggered={isRefreshing}
        onRefresherRefresh={onPullDownRefresh}
      >
        <View className={styles.activityList}>
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🚴‍♂️</Text>
              <Text className={styles.emptyText}>
                {activeTab === 'upcoming' 
                  ? '暂无即将开始的活动' 
                  : activeTab === 'joined' 
                    ? '你还没有报名任何活动'
                    : '你还没有发起任何活动'
                }
              </Text>
              <Button className={styles.emptyButton} onClick={handleCreate}>
                发起活动
              </Button>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 发起活动按钮 */}
      <Button className={styles.createButton} onClick={handleCreate}>
        <Text className={styles.createButtonIcon}>+</Text>
        <Text className={styles.createButtonText}>发起</Text>
      </Button>
    </View>
  );
};

export default ActivitiesPage;
