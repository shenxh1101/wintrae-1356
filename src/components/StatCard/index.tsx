import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface StatCardProps {
  value: string;
  label: string;
  color?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, color = '#07c160', icon }) => {
  return (
    <View className={styles.statCard}>
      {icon && <View className={styles.icon} style={{ color }}>{icon}</View>}
      <Text className={styles.value} style={{ color }}>{value}</Text>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

export default StatCard;
