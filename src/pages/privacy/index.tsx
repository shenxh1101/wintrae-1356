import React from 'react';
import { View, Text, ScrollView, Switch } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useUserStore } from '../../store/userStore';
import type { PrivacySettings } from '../../types/user';

interface SettingItem {
  key: keyof PrivacySettings;
  icon: string;
  title: string;
  desc: string;
  color: string;
}

const settingItems: SettingItem[] = [
  {
    key: 'showProfile',
    icon: '👤',
    title: '公开个人资料',
    desc: '允许其他用户查看你的个人资料信息',
    color: '#3b82f6'
  },
  {
    key: 'showRides',
    icon: '🚴',
    title: '公开骑行记录',
    desc: '允许其他用户查看你的骑行记录',
    color: '#07c160'
  },
  {
    key: 'showLocation',
    icon: '📍',
    title: '显示位置信息',
    desc: '在骑行记录中显示你的位置信息',
    color: '#f59e0b'
  },
  {
    key: 'allowFriendRequests',
    icon: '👥',
    title: '允许好友请求',
    desc: '允许其他用户向你发送好友请求',
    color: '#8b5cf6'
  }
];

const PrivacyPage: React.FC = () => {
  const { privacySettings, updatePrivacySettings } = useUserStore();

  const handleSwitchChange = async (key: keyof PrivacySettings, checked: boolean) => {
    await updatePrivacySettings({ [key]: checked });
    Taro.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });
  };

  return (
    <ScrollView className={styles.privacyPage} scrollY>
      <View className={styles.tipCard}>
        <View className={styles.tipIcon}>🔒</View>
        <View className={styles.tipContent}>
          <Text className={styles.tipTitle}>隐私设置</Text>
          <Text className={styles.tipDesc}>
            我们非常重视您的隐私安全。您可以在这里管理您的隐私权限，控制哪些信息对其他用户可见。
          </Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>隐私选项</Text>
        <View className={styles.settingsList}>
          {settingItems.map((item) => (
            <View key={item.key} className={styles.settingItem}>
              <View
                className={styles.settingIcon}
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                <Text>{item.icon}</Text>
              </View>
              <View className={styles.settingInfo}>
                <Text className={styles.settingTitle}>{item.title}</Text>
                <Text className={styles.settingDesc}>{item.desc}</Text>
              </View>
              <Switch
                className={styles.settingSwitch}
                checked={privacySettings[item.key]}
                onChange={(e) => handleSwitchChange(item.key, e.detail.value)}
                color="#07c160"
              />
            </View>
          ))}
        </View>
      </View>

      <View className={styles.footer}>
        <Text className={styles.footerText}>
          您的隐私设置会自动保存，修改后立即生效
        </Text>
      </View>
    </ScrollView>
  );
};

export default PrivacyPage;
