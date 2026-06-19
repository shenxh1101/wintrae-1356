import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import RouteCard from '../../components/RouteCard';
import StatCard from '../../components/StatCard';
import { useRouteStore } from '../../store/routeStore';
import { useRideStore } from '../../store/rideStore';
import type { Route } from '../../types/route';
import classnames from 'classnames';

const HomePage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { routes, toggleFavorite } = useRouteStore();
  const { monthlyStats } = useRideStore();

  useEffect(() => {
  }, []);

  const recommendedRoutes = routes.slice(0, 3);

  const onPullDownRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  const handleStartRide = () => {
    Taro.switchTab({
      url: '/pages/record/index'
    });
  };

  const handlePlanRoute = () => {
    Taro.navigateTo({
      url: '/pages/plan-route/index'
    });
  };

  const handleViewActivities = () => {
    Taro.switchTab({
      url: '/pages/activities/index'
    });
  };

  const handleViewMoreRoutes = () => {
    Taro.switchTab({
      url: '/pages/routes/index'
    });
  };

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
    Taro.showToast({
      title: '收藏状态已更新',
      icon: 'none'
    });
  };

  return (
    <ScrollView 
      className={styles.homePage}
      scrollY
      refresherEnabled
      refresherTriggered={isRefreshing}
      onRefresherRefresh={onPullDownRefresh}
    >
      {/* 地图区域 */}
      <View className={styles.mapSection}>
        <View className={styles.mapPlaceholder}>
          <Text className={styles.mapIcon}>🗺️</Text>
          <Text className={styles.mapText}>点击开始探索路线</Text>
        </View>
        <View className={styles.mapOverlay}>
          <View className={styles.locationInfo}>
            <Text className={styles.locationIcon}>📍</Text>
            <Text>上海市 · 浦东新区</Text>
          </View>
        </View>
      </View>

      {/* 开始骑行按钮 */}
      <View className={styles.startButtonContainer}>
        <Button className={styles.startButton} onClick={handleStartRide}>
          <Text className={styles.startButtonTitle}>开始骑行</Text>
          <Text className={styles.startButtonSubtitle}>记录你的骑行轨迹</Text>
        </Button>
      </View>

      {/* 快捷操作 */}
      <View className={styles.section}>
        <View className={styles.quickActions}>
          <View className={styles.quickAction} onClick={handlePlanRoute}>
            <View className={classnames(styles.actionIcon, styles.actionIconGreen)}>
              🛣️
            </View>
            <Text className={styles.actionLabel}>规划路线</Text>
          </View>
          <View className={styles.quickAction} onClick={handleViewActivities}>
            <View className={classnames(styles.actionIcon, styles.actionIconBlue)}>
              👥
            </View>
            <Text className={styles.actionLabel}>约骑活动</Text>
          </View>
          <View className={styles.quickAction}>
            <View className={classnames(styles.actionIcon, styles.actionIconPurple)}>
              ⚡
            </View>
            <Text className={styles.actionLabel}>补给点</Text>
          </View>
        </View>
      </View>

      {/* 本月统计 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>本月统计</Text>
          <Text className={styles.sectionMore}>查看详情 ›</Text>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <StatCard 
              value={monthlyStats.totalDistance.toFixed(1) + ' km'} 
              label="总里程"
              color="#07c160"
            />
          </View>
          <View className={styles.statCard}>
            <StatCard 
              value={monthlyStats.totalRides + ' 次'} 
              label="骑行次数"
              color="#3b82f6"
            />
          </View>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <StatCard 
              value={monthlyStats.totalElevation + ' m'} 
              label="累计爬升"
              color="#f59e0b"
            />
          </View>
          <View className={styles.statCard}>
            <StatCard 
              value={monthlyStats.avgSpeed.toFixed(1) + ' km/h'} 
              label="平均速度"
              color="#8b5cf6"
            />
          </View>
        </View>
      </View>

      {/* 补给点与危险路段 */}
      <View className={classnames(styles.section, styles.supplyDangerSection)}>
        <View className={styles.markersGrid}>
          <View className={styles.markerCard}>
            <View className={styles.markerHeader}>
              <View className={classnames(styles.markerIcon, styles.markerIconSupply)}>💧</View>
              <Text className={styles.markerTitle}>补给点</Text>
            </View>
            <Text className={styles.markerCount}>12</Text>
            <Text className={styles.markerLabel}>附近饮水/餐饮点</Text>
          </View>
          <View className={styles.markerCard}>
            <View className={styles.markerHeader}>
              <View className={classnames(styles.markerIcon, styles.markerIconDanger)}>⚠️</View>
              <Text className={styles.markerTitle}>危险路段</Text>
            </View>
            <Text className={styles.markerCount}>3</Text>
            <Text className={styles.markerLabel}>施工/陡坡路段</Text>
          </View>
        </View>
      </View>

      {/* 推荐路线 */}
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>推荐路线</Text>
          <Text className={styles.sectionMore} onClick={handleViewMoreRoutes}>全部路线 ›</Text>
        </View>
        <View className={styles.routeList}>
          {recommendedRoutes.map(route => (
            <RouteCard 
              key={route.id} 
              route={route} 
              onFavorite={handleFavorite}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
