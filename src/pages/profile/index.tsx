import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockUserProfile, mockEquipments } from '../../data/user';
import { mockMonthlyStats } from '../../data/rides';
import type { UserProfile, Equipment } from '../../types/user';
import type { MonthlyStats } from '../../types/ride';

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [needsMaintenance, setNeedsMaintenance] = useState(0);

  useEffect(() => {
    setUserProfile(mockUserProfile);
    setMonthlyStats(mockMonthlyStats);
    
    const needMaintenance = mockEquipments.filter(e => {
      const nextDate = new Date(e.nextMaintenance);
      const today = new Date();
      return nextDate <= today;
    }).length;
    setNeedsMaintenance(needMaintenance);
  }, []);

  const handleEquipment = () => {
    Taro.navigateTo({
      url: '/pages/equipment/index'
    });
  };

  const handlePrivacy = () => {
    Taro.showToast({
      title: '隐私设置',
      icon: 'none'
    });
  };

  const handleDataExport = () => {
    Taro.showActionSheet({
      itemList: ['导出为 GPX 格式', '导出为 CSV 格式', '导出为 JSON 格式'],
      success: (res) => {
        const formats = ['gpx', 'csv', 'json'];
        Taro.showToast({
          title: `正在导出 ${formats[res.tapIndex].toUpperCase()} 文件...`,
          icon: 'none'
        });
      }
    });
  };

  const handleSettings = () => {
    Taro.showToast({
      title: '设置',
      icon: 'none'
    });
  };

  const handleAbout = () => {
    Taro.showToast({
      title: '关于我们',
      icon: 'none'
    });
  };

  const menuItems = [
    { 
      icon: '⚙️', 
      label: '装备管理', 
      desc: `${mockEquipments.length} 件装备`,
      badge: needsMaintenance > 0 ? `${needsMaintenance}项待保养` : null,
      onClick: handleEquipment,
      color: '#3b82f6'
    },
    { 
      icon: '🔒', 
      label: '隐私设置', 
      desc: '管理你的隐私权限',
      onClick: handlePrivacy,
      color: '#8b5cf6'
    },
    { 
      icon: '📤', 
      label: '数据导出', 
      desc: '导出骑行记录数据',
      onClick: handleDataExport,
      color: '#f59e0b'
    },
    { 
      icon: '⚡', 
      label: '通用设置', 
      desc: '应用偏好设置',
      onClick: handleSettings,
      color: '#64748b'
    },
    { 
      icon: 'ℹ️', 
      label: '关于我们', 
      desc: '版本 1.0.0',
      onClick: handleAbout,
      color: '#07c160'
    }
  ];

  if (!userProfile || !monthlyStats) {
    return <View className={styles.profilePage} />;
  }

  return (
    <ScrollView className={styles.profilePage} scrollY>
      {/* 用户信息头部 */}
      <View className={styles.profileHeader}>
        <View className={styles.profileInfo}>
          <Image 
            className={styles.avatar} 
            src={userProfile.avatar}
            mode="aspectFill"
          />
          <View className={styles.userInfo}>
            <Text className={styles.userName}>{userProfile.name}</Text>
            <Text className={styles.userBio}>{userProfile.bio}</Text>
            <Text className={styles.userLocation}>📍 {userProfile.location}</Text>
            <View className={styles.levelBadge}>
              <Text>Lv.{userProfile.level} 骑行达人</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 总统计概览 */}
      <View className={styles.statsOverview}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{userProfile.totalDistance.toFixed(0)} km</Text>
          <Text className={styles.statLabel}>总里程</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{userProfile.totalRides}</Text>
          <Text className={styles.statLabel}>骑行次数</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{(userProfile.totalDuration / 3600).toFixed(0)} h</Text>
          <Text className={styles.statLabel}>总时长</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{userProfile.totalElevation.toFixed(0)} m</Text>
          <Text className={styles.statLabel}>累计爬升</Text>
        </View>
      </View>

      {/* 本月统计 */}
      <View className={styles.monthlySection}>
        <View className={styles.monthlyCard}>
          <View className={styles.monthlyHeader}>
            <Text className={styles.monthlyTitle}>本月统计</Text>
            <Text className={styles.monthlySubtitle}>6月</Text>
          </View>
          <View className={styles.monthlyStats}>
            <View className={styles.monthlyStat}>
              <Text className={styles.monthlyStatValue}>{monthlyStats.totalDistance.toFixed(1)} km</Text>
              <Text className={styles.monthlyStatLabel}>总里程</Text>
            </View>
            <View className={styles.monthlyStat}>
              <Text className={styles.monthlyStatValue}>{monthlyStats.totalRides} 次</Text>
              <Text className={styles.monthlyStatLabel}>骑行次数</Text>
            </View>
            <View className={styles.monthlyStat}>
              <Text className={styles.monthlyStatValue}>{monthlyStats.avgSpeed.toFixed(1)} km/h</Text>
              <Text className={styles.monthlyStatLabel}>平均速度</Text>
            </View>
            <View className={styles.monthlyStat}>
              <Text className={styles.monthlyStatValue}>{monthlyStats.totalElevation.toFixed(0)} m</Text>
              <Text className={styles.monthlyStatLabel}>累计爬升</Text>
            </View>
            <View className={styles.monthlyStat}>
              <Text className={styles.monthlyStatValue}>{monthlyStats.longestRide.toFixed(1)} km</Text>
              <Text className={styles.monthlyStatLabel}>最长单次</Text>
            </View>
            <View className={styles.monthlyStat}>
              <Text className={styles.monthlyStatValue}>{Math.round(monthlyStats.totalDuration / 3600)} h</Text>
              <Text className={styles.monthlyStatLabel}>总时长</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 我的徽章 */}
      <View className={styles.badgesSection}>
        <View className={styles.badgesCard}>
          <Text className={styles.badgesTitle}>我的徽章</Text>
          <View className={styles.badgesList}>
            {userProfile.badges.map((badge, index) => (
              <View key={index} className={styles.badgeItem}>
                <View className={styles.badgeIcon}>🏆</View>
                <Text className={styles.badgeName}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 功能菜单 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>功能设置</Text>
        <View className={styles.menuList}>
          {menuItems.map((item, index) => (
            <View 
              key={index} 
              className={styles.menuItem}
              onClick={item.onClick}
            >
              <View 
                className={styles.menuIcon}
                style={{ backgroundColor: item.color + '15', color: item.color }}
              >
                {item.icon}
              </View>
              <View className={styles.menuContent}>
                <Text className={styles.menuLabel}>{item.label}</Text>
                <Text className={styles.menuDesc}>{item.desc}</Text>
              </View>
              {item.badge && (
                <View className={styles.menuBadge}>{item.badge}</View>
              )}
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
