import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { CreateActivityForm } from '../../types/activity';

const difficultyOptions = [
  { value: 'easy', label: '休闲', color: '#07c160' },
  { value: 'medium', label: '中等', color: '#f59e0b' },
  { value: 'hard', label: '挑战', color: '#ef4444' }
];

const paceOptions = [
  { value: 'leisurely', label: '休闲骑', desc: '15-20 km/h' },
  { value: 'moderate', label: '匀速骑', desc: '20-25 km/h' },
  { value: 'fast', label: '竞速骑', desc: '25+ km/h' }
];

const CreateActivityPage: React.FC = () => {
  const [form, setForm] = useState<CreateActivityForm>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    meetupPoint: '',
    distance: 0,
    maxParticipants: 20,
    difficulty: 'easy',
    pace: 'leisurely'
  });

  const handleInputChange = (field: keyof CreateActivityForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!form.title.trim()) {
      Taro.showToast({ title: '请输入活动标题', icon: 'none' });
      return false;
    }
    if (!form.date) {
      Taro.showToast({ title: '请选择活动日期', icon: 'none' });
      return false;
    }
    if (!form.startTime || !form.endTime) {
      Taro.showToast({ title: '请选择活动时间', icon: 'none' });
      return false;
    }
    if (!form.meetupPoint.trim()) {
      Taro.showToast({ title: '请输入集合地点', icon: 'none' });
      return false;
    }
    if (form.distance <= 0) {
      Taro.showToast({ title: '请输入骑行距离', icon: 'none' });
      return false;
    }
    if (form.maxParticipants <= 0) {
      Taro.showToast({ title: '请设置活动人数', icon: 'none' });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    Taro.showModal({
      title: '确认发布',
      content: '确定要发布此活动吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '发布中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({
              title: '发布成功',
              icon: 'success',
              success: () => {
                setTimeout(() => {
                  Taro.navigateBack();
                }, 1500);
              }
            });
          }, 1000);
        }
      }
    });
  };

  const handleDatePick = () => {
    Taro.showActionSheet({
      itemList: ['今天', '明天', '后天', '选择日期'],
      success: (res) => {
        const date = new Date();
        if (res.tapIndex === 0) {
          // 今天
        } else if (res.tapIndex === 1) {
          date.setDate(date.getDate() + 1);
        } else if (res.tapIndex === 2) {
          date.setDate(date.getDate() + 2);
        } else {
          Taro.showToast({ title: '请选择日期', icon: 'none' });
          return;
        }
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        handleInputChange('date', `${y}-${m}-${d}`);
      }
    });
  };

  const handleTimePick = (field: 'startTime' | 'endTime') => {
    const times = ['06:00', '07:00', '08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    Taro.showActionSheet({
      itemList: times,
      success: (res) => {
        handleInputChange(field, times[res.tapIndex]);
      }
    });
  };

  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return '请选择';
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${month}月${day}日 ${weekDays[date.getDay()]}`;
  };

  return (
    <View className={styles.createActivityPage}>
      <ScrollView scrollY>
        {/* 基本信息 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📝</Text>
            基本信息
          </Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>活动标题</Text>
            <Input
              className={styles.formInput}
              placeholder="给活动起个响亮的名字"
              value={form.title}
              onInput={(e) => handleInputChange('title', e.detail.value)}
              maxlength={30}
            />
            <Text className={styles.formHint}>{form.title.length}/30</Text>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>活动描述</Text>
            <Textarea
              className={styles.formTextarea}
              placeholder="介绍一下活动亮点、注意事项..."
              value={form.description}
              onInput={(e) => handleInputChange('description', e.detail.value)}
              maxlength={200}
            />
            <Text className={styles.formHint}>{form.description.length}/200</Text>
          </View>
        </View>

        {/* 时间地点 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📍</Text>
            时间地点
          </Text>

          <View className={styles.formItem} onClick={handleDatePick}>
            <Text className={styles.formLabel}>活动日期</Text>
            <View className={styles.formSelect}>
              <Text className={classnames(styles.selectValue, !form.date && styles.placeholder)}>
                {formatDateDisplay(form.date)}
              </Text>
              <Text className={styles.selectArrow}>›</Text>
            </View>
          </View>

          <View className={styles.formRow}>
            <View className={styles.formItem} style={{ flex: 1 }} onClick={() => handleTimePick('startTime')}>
              <Text className={styles.formLabel}>开始时间</Text>
              <View className={styles.formSelect}>
                <Text className={classnames(styles.selectValue, !form.startTime && styles.placeholder)}>
                  {form.startTime || '请选择'}
                </Text>
                <Text className={styles.selectArrow}>›</Text>
              </View>
            </View>
            <View className={styles.formItem} style={{ flex: 1 }} onClick={() => handleTimePick('endTime')}>
              <Text className={styles.formLabel}>结束时间</Text>
              <View className={styles.formSelect}>
                <Text className={classnames(styles.selectValue, !form.endTime && styles.placeholder)}>
                  {form.endTime || '请选择'}
                </Text>
                <Text className={styles.selectArrow}>›</Text>
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>集合地点</Text>
            <Input
              className={styles.formInput}
              placeholder="输入集合地点"
              value={form.meetupPoint}
              onInput={(e) => handleInputChange('meetupPoint', e.detail.value)}
            />
          </View>
        </View>

        {/* 骑行参数 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🚴</Text>
            骑行参数
          </Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>骑行距离 (km)</Text>
            <Input
              className={styles.formInput}
              type="digit"
              placeholder="例如：30"
              value={form.distance ? String(form.distance) : ''}
              onInput={(e) => handleInputChange('distance', Number(e.detail.value))}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>活动人数</Text>
            <View className={styles.stepper}>
              <View 
                className={classnames(styles.stepperBtn, form.maxParticipants <= 1 && styles.stepperDisabled)}
                onClick={() => form.maxParticipants > 1 && handleInputChange('maxParticipants', form.maxParticipants - 1)}
              >
                <Text>－</Text>
              </View>
              <Text className={styles.stepperValue}>{form.maxParticipants}人</Text>
              <View 
                className={classnames(styles.stepperBtn, form.maxParticipants >= 100 && styles.stepperDisabled)}
                onClick={() => form.maxParticipants < 100 && handleInputChange('maxParticipants', form.maxParticipants + 1)}
              >
                <Text>＋</Text>
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>难度等级</Text>
            <View className={styles.optionGroup}>
              {difficultyOptions.map(option => (
                <View
                  key={option.value}
                  className={classnames(
                    styles.optionItem,
                    form.difficulty === option.value && styles.optionActive
                  )}
                  style={form.difficulty === option.value ? { borderColor: option.color, color: option.color } : {}}
                  onClick={() => handleInputChange('difficulty', option.value)}
                >
                  <Text style={{ color: form.difficulty === option.value ? option.color : '#64748b' }}>
                    {option.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>骑行节奏</Text>
            <View className={styles.paceGroup}>
              {paceOptions.map(option => (
                <View
                  key={option.value}
                  className={classnames(
                    styles.paceItem,
                    form.pace === option.value && styles.paceActive
                  )}
                  onClick={() => handleInputChange('pace', option.value)}
                >
                  <Text className={styles.paceLabel}>{option.label}</Text>
                  <Text className={styles.paceDesc}>{option.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.bottomBar}>
        <Button className={styles.submitButton} onClick={handleSubmit}>
          发布活动
        </Button>
      </View>
    </View>
  );
};

export default CreateActivityPage;
