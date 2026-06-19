import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import RouteCard from '../../components/RouteCard';
import { useRouteStore } from '../../store/routeStore';
import type { DifficultyLevel, SceneryType } from '../../types/route';
import classnames from 'classnames';

type FilterTab = 'all' | 'favorite';
type DistanceFilter = 'all' | 'short' | 'medium' | 'long';

const RoutesPage: React.FC = () => {
  const { routes, toggleFavorite, initRoutes } = useRouteStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [sceneryFilter, setSceneryFilter] = useState<SceneryType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'popular'>('popular');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    initRoutes();
  }, [initRoutes]);

  const onPullDownRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      initRoutes();
      setIsRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  const filteredRoutes = routes.filter(route => {
    if (activeTab === 'favorite' && !route.isFavorite) return false;
    
    if (distanceFilter !== 'all') {
      const km = route.distance / 1000;
      if (distanceFilter === 'short' && km > 15) return false;
      if (distanceFilter === 'medium' && (km <= 15 || km > 30)) return false;
      if (distanceFilter === 'long' && km <= 30) return false;
    }
    
    if (difficultyFilter !== 'all' && route.difficulty !== difficultyFilter) return false;
    if (sceneryFilter !== 'all' && route.scenery !== sceneryFilter) return false;
    
    return true;
  });

  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    if (sortBy === 'distance') {
      return a.distance - b.distance;
    }
    return b.likes - a.likes;
  });

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  const toggleDistanceFilter = (filter: DistanceFilter) => {
    setDistanceFilter(distanceFilter === filter ? 'all' : filter);
  };

  const toggleDifficultyFilter = (filter: DifficultyLevel) => {
    setDifficultyFilter(difficultyFilter === filter ? 'all' : filter);
  };

  const toggleSceneryFilter = (filter: SceneryType) => {
    setSceneryFilter(sceneryFilter === filter ? 'all' : filter);
  };

  return (
    <View className={styles.routesPage}>
      {/* 筛选栏 */}
      <View className={styles.filterBar}>
        {/* 主标签 */}
        <View className={styles.filterTabs}>
          <View 
            className={classnames(styles.filterTab, activeTab === 'all' && styles.active)}
            onClick={() => setActiveTab('all')}
          >
            全部路线
          </View>
          <View 
            className={classnames(styles.filterTab, activeTab === 'favorite' && styles.active)}
            onClick={() => setActiveTab('favorite')}
          >
            <View className={styles.favoriteTab}>
              <Text className={styles.favoriteIcon}>★</Text>
              <Text>我的收藏</Text>
            </View>
          </View>
        </View>

        {/* 距离筛选 */}
        <Text className={styles.sectionTitle}>距离</Text>
        <View className={styles.filterChips}>
          {[
            { key: 'short' as const, label: '15km以内' },
            { key: 'medium' as const, label: '15-30km' },
            { key: 'long' as const, label: '30km以上' }
          ].map(item => (
            <View
              key={item.key}
              className={classnames(styles.filterChip, distanceFilter === item.key && styles.active)}
              onClick={() => toggleDistanceFilter(item.key)}
            >
              {item.label}
            </View>
          ))}
        </View>

        {/* 难度筛选 */}
        <Text className={styles.sectionTitle}>难度</Text>
        <View className={styles.filterChips}>
          {[
            { key: 'easy' as const, label: '休闲' },
            { key: 'medium' as const, label: '中等' },
            { key: 'hard' as const, label: '挑战' }
          ].map(item => (
            <View
              key={item.key}
              className={classnames(styles.filterChip, difficultyFilter === item.key && styles.active)}
              onClick={() => toggleDifficultyFilter(item.key)}
            >
              {item.label}
            </View>
          ))}
        </View>

        {/* 风景筛选 */}
        <Text className={styles.sectionTitle}>风景类型</Text>
        <View className={styles.filterChips}>
          {[
            { key: 'urban' as const, label: '城市' },
            { key: 'nature' as const, label: '自然' },
            { key: 'riverside' as const, label: '滨江' },
            { key: 'mountain' as const, label: '山地' }
          ].map(item => (
            <View
              key={item.key}
              className={classnames(styles.filterChip, sceneryFilter === item.key && styles.active)}
              onClick={() => toggleSceneryFilter(item.key)}
            >
              {item.label}
            </View>
          ))}
        </View>
      </View>

      {/* 排序栏 */}
      <View className={styles.sortBar}>
        <Text className={styles.sortLabel}>共 {sortedRoutes.length} 条路线</Text>
        <View className={styles.sortOptions}>
          <Text 
            className={classnames(styles.sortOption, sortBy === 'popular' && styles.active)}
            onClick={() => setSortBy('popular')}
          >
            最热门
          </Text>
          <Text 
            className={classnames(styles.sortOption, sortBy === 'distance' && styles.active)}
            onClick={() => setSortBy('distance')}
          >
            距离
          </Text>
        </View>
      </View>

      {/* 路线列表 */}
      <ScrollView
        scrollY
        refresherEnabled
        refresherTriggered={isRefreshing}
        onRefresherRefresh={onPullDownRefresh}
      >
        <View className={styles.routeList}>
          {sortedRoutes.length > 0 ? (
            sortedRoutes.map(route => (
              <RouteCard 
                key={route.id} 
                route={route} 
                onFavorite={handleFavorite}
              />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🛣️</Text>
              <Text className={styles.emptyText}>暂无符合条件的路线</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default RoutesPage;
