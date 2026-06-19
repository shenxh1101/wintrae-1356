import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { Route } from '../../types/route';
import { formatDistance, formatDurationShort, getDifficultyLabel, getDifficultyColor, getSceneryLabel } from '../../utils/format';
import classnames from 'classnames';

interface RouteCardProps {
  route: Route;
  showFavorite?: boolean;
  onFavorite?: (id: string) => void;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, showFavorite = true, onFavorite }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/route-detail/index?id=${route.id}`
    });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(route.id);
  };

  return (
    <View className={styles.routeCard} onClick={handleClick}>
      <Image 
        className={styles.cover} 
        src={route.coverImage} 
        mode="aspectFill"
      />
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{route.name}</Text>
          {showFavorite && (
            <View 
              className={classnames(styles.favorite, route.isFavorite && styles.active)}
              onClick={handleFavorite}
            >
              {route.isFavorite ? '★' : '☆'}
            </View>
          )}
        </View>
        <Text className={styles.description}>{route.description}</Text>
        <View className={styles.footer}>
          <View className={styles.tags}>
            <View 
              className={styles.tag}
              style={{ 
                backgroundColor: getDifficultyColor(route.difficulty) + '20',
                color: getDifficultyColor(route.difficulty)
              }}
            >
              {getDifficultyLabel(route.difficulty)}
            </View>
            <View className={styles.tagLight}>
              {getSceneryLabel(route.scenery)}
            </View>
          </View>
          <View className={styles.stats}>
            <Text className={styles.statItem}>
              <Text className={styles.statValue}>{formatDistance(route.distance)}</Text>
            </Text>
            <Text className={styles.statDivider}>·</Text>
            <Text className={styles.statItem}>
              {formatDurationShort(route.duration)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RouteCard;
