import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useUserStore } from '../../store/userStore';
import { useRideStore } from '../../store/rideStore';
import { mockEquipments } from '../../data/user';

const ProfilePage: React.FC = () => {
  const { profile, exportData } = useUserStore();
  const { rides, monthlyStats } = useRideStore();
  const [needsMaintenance, setNeedsMaintenance] = useState(0);

  useEffect(() => {
    const needMaintenance = mockEquipments.filter(e => {
      const nextDate = new Date(e.nextMaintenance);
      const today = new Date();
      return nextDate <= today;
    }).length;
    setNeedsMaintenance(needMaintenance);
  }, []);

  const handleExport = async (format: 'gpx' | 'csv' | 'json') => {
    let startDate = '2000-01-01';
    let endDate = '2099-12-31';
    
    if (rides.length > 0) {
      const allDates = rides.flatMap(r => [r.startTime, r.endTime]);
      const minDate = new Date(Math.min(...allDates.map(d => new Date(d).getTime())));
      const maxDate = new Date(Math.max(...allDates.map(d => new Date(d).getTime())));
      
      const formatDateStr = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      startDate = formatDateStr(minDate);
      endDate = formatDateStr(maxDate);
    }
    
    const options = {
      format,
      includePhotos: false,
      dateRange: { start: startDate, end: endDate }
    };
    
    try {
      const content = await exportData(options, rides);
      Taro.showModal({
        title: `导出${format.toUpperCase()}成功`,
        content: `共导出 ${rides.length} 条骑行记录\n\n` + content.substring(0, 400) + (content.length > 400 ? '\n...(内容已截断)' : ''),
        showCancel: false
      });
    } catch (e) {
      Taro.showToast({ title: '导出失败', icon: 'none' });
    }
  };

  const handleEquipment = () => {
    Taro.navigateTo({
      url: '/pages/equipment/index'
    });
  };

  const handlePrivacy = () => {
    Taro.navigateTo({
      url: '/pages/privacy/index'
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

  if (!profile || !monthlyStats) {
    return <View className={styles.profilePage} />;
  }

  return (
    <ScrollView className={styles.profilePage} scrollY>
      {/* 用户信息头部 */}
      <View className={styles.profileHeader}>
        <View className={styles.profileInfo}>
          <Image 
            className={styles.avatar} 
            src={profile.avatar}
            mode="aspectFill"
          />
          <View className={styles.userInfo}>
            <Text className={styles.userName}>{profile.name}</Text>
            <Text className={styles.userBio}>{profile.bio}</Text>
            <Text className={styles.userLocation}>📍 {profile.location}</Text>
            <View className={styles.levelBadge}>
              <Text>Lv.{profile.level} 骑行达人</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 总统计概览 */}
      <View className={styles.statsOverview}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{profile.totalDistance.toFixed(0)} km</Text>
          <Text className={styles.statLabel}>总里程</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{profile.totalRides}</Text>
          <Text className={styles.statLabel}>骑行次数</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{(profile.totalDuration / 3600).toFixed(0)} h</Text>
          <Text className={styles.statLabel}>总时长</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{profile.totalElevation.toFixed(0)} m</Text>
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
            {profile.badges.map((badge, index) => (
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

      {/* 数据导出 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>数据导出</Text>
        <View className={styles.menuList}>
          <View 
            className={styles.menuItem}
            onClick={() => handleExport('gpx')}
          >
            <View 
              className={styles.menuIcon}
              style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}
            >
              📄
            </View>
            <View className={styles.menuContent}>
              <Text className={styles.menuLabel}>导出 GPX</Text>
              <Text className={styles.menuDesc}>GPS 轨迹格式，支持导入其他运动 App</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View 
            className={styles.menuItem}
            onClick={() => handleExport('csv')}
          >
            <View 
              className={styles.menuIcon}
              style={{ backgroundColor: '#07c16015', color: '#07c160' }}
            >
              📊
            </View>
            <View className={styles.menuContent}>
              <Text className={styles.menuLabel}>导出 CSV</Text>
              <Text className={styles.menuDesc}>表格格式，适合数据分析</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View 
            className={styles.menuItem}
            onClick={() => handleExport('json')}
          >
            <View 
              className={styles.menuIcon}
              style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}
            >
              📋
            </View>
            <View className={styles.menuContent}>
              <Text className={styles.menuLabel}>导出 JSON</Text>
              <Text className={styles.menuDesc}>结构化数据，开发者友好</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
