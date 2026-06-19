import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import RideCard from '../../components/RideCard';
import { mockRides } from '../../data/rides';
import type { RideRecord } from '../../types/ride';
import classnames from 'classnames';

type RideStatus = 'idle' | 'recording' | 'paused';

const RecordPage: React.FC = () => {
  const [status, setStatus] = useState<RideStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [recentRides, setRecentRides] = useState<RideRecord[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setRecentRides(mockRides.slice(0, 3));
  }, []);

  useEffect(() => {
    if (status === 'recording') {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
        setDistance(prev => prev + Math.random() * 5 + 2);
        const speed = Math.random() * 10 + 15;
        setCurrentSpeed(speed);
        setMaxSpeed(prev => Math.max(prev, speed));
        setElevation(prev => prev + Math.random() * 2);
        
        const totalSeconds = duration + 1;
        if (totalSeconds > 0) {
          setAvgSpeed(distance / (totalSeconds / 3600) / 1000);
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, duration, distance]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setStatus('recording');
    setDuration(0);
    setDistance(0);
    setCurrentSpeed(0);
    setMaxSpeed(0);
    setAvgSpeed(0);
    setElevation(0);
    Taro.showToast({
      title: '开始记录骑行',
      icon: 'none'
    });
  };

  const handlePause = () => {
    setStatus('paused');
    Taro.showToast({
      title: '已暂停',
      icon: 'none'
    });
  };

  const handleResume = () => {
    setStatus('recording');
    Taro.showToast({
      title: '继续记录',
      icon: 'none'
    });
  };

  const handleStop = () => {
    Taro.showModal({
      title: '结束骑行',
      content: '确定要结束本次骑行记录吗？',
      confirmText: '结束',
      confirmColor: '#ef4444',
      success: (res) => {
        if (res.confirm) {
          setStatus('idle');
          Taro.navigateTo({
            url: `/pages/ride-result/index?id=new&distance=${distance.toFixed(0)}&duration=${duration}`
          });
        }
      }
    });
  };

  return (
    <ScrollView className={styles.recordPage} scrollY>
      {/* 地图区域 */}
      <View className={styles.mapContainer}>
        <View className={styles.mapPlaceholder}>
          <Text className={styles.mapIcon}>🚴</Text>
          <Text className={styles.mapText}>
            {status === 'idle' ? '点击开始记录骑行' : '正在记录你的轨迹...'}
          </Text>
        </View>
      </View>

      {/* 数据统计卡片 */}
      <View className={styles.statsSection}>
        <View className={styles.statsCard}>
          {status === 'idle' ? (
            <View>
              <View className={styles.mainStats}>
                <View className={styles.mainStat}>
                  <Text className={styles.mainStatValue}>0.0</Text>
                  <Text className={styles.mainStatLabel}>公里</Text>
                </View>
                <View className={styles.mainStat}>
                  <Text className={styles.mainStatValue}>0:00</Text>
                  <Text className={styles.mainStatLabel}>时长</Text>
                </View>
                <View className={styles.mainStat}>
                  <Text className={styles.mainStatValue}>0</Text>
                  <Text className={styles.mainStatLabel}>千卡</Text>
                </View>
              </View>
              <View className={styles.subStats}>
                <View className={styles.subStat}>
                  <Text className={styles.subStatValue}>0.0 km/h</Text>
                  <Text className={styles.subStatLabel}>当前速度</Text>
                </View>
                <View className={styles.subStat}>
                  <Text className={styles.subStatValue}>0 m</Text>
                  <Text className={styles.subStatLabel}>爬升</Text>
                </View>
                <View className={styles.subStat}>
                  <Text className={styles.subStatValue}>0 km/h</Text>
                  <Text className={styles.subStatLabel}>最高速度</Text>
                </View>
              </View>
            </View>
          ) : (
            <View>
              {/* 计时显示 */}
              {status === 'recording' && (
                <View className={styles.recordingIndicator}>
                  <View className={styles.recordingDot}></View>
                  <Text className={styles.recordingText}>正在记录</Text>
                </View>
              )}
              {status === 'paused' && (
                <View className={styles.recordingIndicator}>
                  <Text className={styles.recordingText} style={{ color: '#f59e0b' }}>已暂停</Text>
                </View>
              )}
              
              <View className={styles.timerDisplay}>
                <Text className={styles.timerValue}>{formatTime(duration)}</Text>
                <Text className={styles.timerLabel}>骑行时长</Text>
              </View>

              <View className={styles.mainStats}>
                <View className={styles.mainStat}>
                  <Text className={styles.mainStatValue}>{(distance / 1000).toFixed(2)}</Text>
                  <Text className={styles.mainStatLabel}>公里</Text>
                </View>
                <View className={styles.mainStat}>
                  <Text className={styles.mainStatValue}>{currentSpeed.toFixed(1)}</Text>
                  <Text className={styles.mainStatLabel}>km/h</Text>
                </View>
              </View>

              <View className={styles.subStats}>
                <View className={styles.subStat}>
                  <Text className={styles.subStatValue}>{maxSpeed.toFixed(1)} km/h</Text>
                  <Text className={styles.subStatLabel}>最高速度</Text>
                </View>
                <View className={styles.subStat}>
                  <Text className={styles.subStatValue}>{avgSpeed.toFixed(1)} km/h</Text>
                  <Text className={styles.subStatLabel}>平均速度</Text>
                </View>
                <View className={styles.subStat}>
                  <Text className={styles.subStatValue}>{elevation.toFixed(0)} m</Text>
                  <Text className={styles.subStatLabel}>爬升</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* 控制按钮 */}
      <View className={styles.controlSection}>
        <View className={styles.controlButtons}>
          {status === 'idle' ? (
            <Button 
              className={classnames(styles.controlButton, styles.startButton)}
              onClick={handleStart}
            >
              <Text className={styles.startButtonIcon}>▶</Text>
              <Text className={styles.startButtonText}>开始骑行</Text>
            </Button>
          ) : (
            <>
              {status === 'recording' ? (
                <Button 
                  className={classnames(styles.controlButton, styles.pauseButton)}
                  onClick={handlePause}
                >
                  <Text className={styles.controlButtonIcon}>⏸</Text>
                  <Text className={styles.controlButtonText}>暂停</Text>
                </Button>
              ) : (
                <Button 
                  className={classnames(styles.controlButton, styles.startButton)}
                  onClick={handleResume}
                >
                  <Text className={styles.controlButtonIcon}>▶</Text>
                  <Text className={styles.controlButtonText}>继续</Text>
                </Button>
              )}
              <Button 
                className={classnames(styles.controlButton, styles.stopButton)}
                onClick={handleStop}
              >
                <Text className={styles.controlButtonIcon}>■</Text>
                <Text className={styles.controlButtonText}>结束</Text>
              </Button>
            </>
          )}
        </View>
      </View>

      {/* 历史记录 */}
      <View className={styles.historySection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>最近骑行</Text>
          <Text className={styles.sectionMore}>查看全部 ›</Text>
        </View>
        {recentRides.length > 0 ? (
          recentRides.map(ride => (
            <RideCard key={ride.id} ride={ride} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>还没有骑行记录</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default RecordPage;
