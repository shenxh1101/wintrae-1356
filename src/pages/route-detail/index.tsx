import React, { useEffect, useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useRouteStore } from '../../store/routeStore';
import { formatDistance, formatDurationShort, getDifficultyLabel, getDifficultyColor, getSceneryLabel, getSupplyPointLabel, getDangerSectionLabel } from '../../utils/format';
import classnames from 'classnames';

const RouteDetailPage: React.FC = () => {
  const router = useRouter();
  const routeId = router.params.id;
  const { routes, toggleFavorite, initRoutes } = useRouteStore();

  useEffect(() => {
    initRoutes();
  }, [initRoutes]);

  const route = useMemo(() => {
    if (!routeId) return null;
    return routes.find(r => r.id === routeId) || null;
  }, [routes, routeId]);

  const handleFavorite = () => {
    if (!route || !routeId) return;
    const wasFavorite = route.isFavorite;
    toggleFavorite(routeId);
    Taro.showToast({
      title: wasFavorite ? '已取消收藏' : '收藏成功',
      icon: 'none'
    });
  };

  const handleStartRide = () => {
    Taro.showToast({
      title: '开始骑行此路线',
      icon: 'none'
    });
    setTimeout(() => {
      Taro.switchTab({
        url: '/pages/record/index'
      });
    }, 1000);
  };

  if (!route) {
    return (
      <View className={styles.routeDetailPage}>
        <View style={{ padding: '100rpx', textAlign: 'center' }}>
          <Text>路线不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.routeDetailPage}>
      <ScrollView scrollY>
        {/* 封面图 */}
        <Image 
          className={styles.coverImage} 
          src={route.coverImage}
          mode="aspectFill"
        />

        {/* 路线基本信息 */}
        <View className={styles.routeInfo}>
          <Text className={styles.routeTitle}>{route.name}</Text>
          <Text className={styles.routeDesc}>{route.description}</Text>
          
          <View className={styles.routeMeta}>
            <Image 
              className={styles.creatorAvatar}
              src={route.creator.avatar}
              mode="aspectFill"
            />
            <Text className={styles.creatorName}>{route.creator.name}</Text>
            <Text className={styles.likesInfo}>❤ {route.likes}</Text>
          </View>

          <View className={styles.statsRow}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{formatDistance(route.distance)}</Text>
              <Text className={styles.statLabel}>距离</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{formatDurationShort(route.duration)}</Text>
              <Text className={styles.statLabel}>预计时长</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{route.elevation} m</Text>
              <Text className={styles.statLabel}>累计爬升</Text>
            </View>
          </View>
        </View>

        {/* 标签 */}
        <View className={styles.section}>
          <View className={styles.tags}>
            <View 
              className={classnames(styles.tag, styles.tagPrimary)}
              style={{ 
                backgroundColor: getDifficultyColor(route.difficulty) + '20',
                color: getDifficultyColor(route.difficulty)
              }}
            >
              {getDifficultyLabel(route.difficulty)}
            </View>
            <View className={styles.tag}>
              {getSceneryLabel(route.scenery)}
            </View>
          </View>
        </View>

        {/* 路线地图 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🗺️</Text>
            路线地图
          </Text>
          <View className={styles.mapPreview}>
            <Text className={styles.mapIcon}>📍</Text>
            <Text className={styles.mapText}>点击查看完整路线地图</Text>
          </View>
        </View>

        {/* 补给点 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>💧</Text>
            补给点 ({route.supplyPoints.length})
          </Text>
          {route.supplyPoints.length > 0 ? (
            <View className={styles.pointList}>
              {route.supplyPoints.map(point => (
                <View key={point.id} className={styles.pointItem}>
                  <View className={classnames(styles.pointIcon, styles.pointIconSupply)}>
                    💧
                  </View>
                  <View className={styles.pointInfo}>
                    <Text className={styles.pointName}>
                      {point.name}
                      <Text style={{ color: '#8b5cf6', marginLeft: '8rpx', fontSize: '22rpx' }}>
                        {getSupplyPointLabel(point.type)}
                      </Text>
                    </Text>
                    {point.description && (
                      <Text className={styles.pointDesc}>{point.description}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>💧</Text>
              <Text className={styles.emptyText}>暂无补给点信息</Text>
            </View>
          )}
        </View>

        {/* 危险路段 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>⚠️</Text>
            危险路段 ({route.dangerSections.length})
          </Text>
          {route.dangerSections.length > 0 ? (
            <View className={styles.pointList}>
              {route.dangerSections.map(section => (
                <View key={section.id} className={styles.pointItem}>
                  <View className={classnames(styles.pointIcon, styles.pointIconDanger)}>
                    ⚠️
                  </View>
                  <View className={styles.pointInfo}>
                    <Text className={styles.pointName}>
                      {getDangerSectionLabel(section.type)}
                    </Text>
                    {section.description && (
                      <Text className={styles.pointDesc}>{section.description}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>✅</Text>
              <Text className={styles.emptyText}>路线安全，无危险路段</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.bottomBar}>
        <Button 
          className={classnames(styles.favoriteButton, route.isFavorite && styles.active)}
          onClick={handleFavorite}
        >
          {route.isFavorite ? '★' : '☆'}
        </Button>
        <Button className={styles.startButton} onClick={handleStartRide}>
          开始骑行
        </Button>
      </View>
    </View>
  );
};

export default RouteDetailPage;
