import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import RideCard from '../../components/RideCard';
import { useRideStore } from '../../store/rideStore';
import classnames from 'classnames';

const RecordPage: React.FC = () => {
  const { rides, currentRide, startRide, pauseRide, resumeRide, endRide, updateRideData, addRidePoint } = useRideStore();
  const [, forceUpdate] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pausedTimeRef = useRef(0);

  useEffect(() => {
    if (currentRide.isRunning && !currentRide.isPaused) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - (currentRide.startTime || now) - currentRide.totalPauseTime) / 1000);
        
        const newDistance = currentRide.distance + (Math.random() * 5 + 2);
        const speed = Math.random() * 10 + 15;
        const newMaxSpeed = Math.max(currentRide.maxSpeed, speed);
        const newElevation = currentRide.elevation + Math.random() * 2;
        
        updateRideData({
          elapsedTime: elapsed,
          distance: newDistance,
          currentSpeed: speed,
          maxSpeed: newMaxSpeed,
          elevation: newElevation
        });

        addRidePoint({
          latitude: 31.2304 + Math.random() * 0.01,
          longitude: 121.4737 + Math.random() * 0.01,
          speed: speed,
          altitude: newElevation
        });

        forceUpdate(prev => prev + 1);
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
  }, [currentRide.isRunning, currentRide.isPaused, currentRide.startTime, currentRide.totalPauseTime, updateRideData, addRidePoint]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStopTimeDisplay = (): string => {
    let pauseTime = currentRide.totalPauseTime;
    if (currentRide.isPaused && currentRide.pauseStartTime) {
      pauseTime += Date.now() - currentRide.pauseStartTime;
    }
    return formatTime(Math.floor(pauseTime / 1000));
  };

  const handleStart = () => {
    startRide();
    pausedTimeRef.current = 0;
    Taro.showToast({
      title: '开始记录骑行',
      icon: 'none'
    });
  };

  const handlePause = () => {
    pauseRide();
    Taro.showToast({
      title: '已暂停',
      icon: 'none'
    });
  };

  const handleResume = () => {
    resumeRide();
    Taro.showToast({
      title: '继续记录',
      icon: 'none'
    });
  };

  const handleStop = async () => {
    const pauseTime = currentRide.isPaused && currentRide.pauseStartTime
      ? currentRide.totalPauseTime + (Date.now() - currentRide.pauseStartTime)
      : currentRide.totalPauseTime;

    Taro.showModal({
      title: '结束骑行',
      content: `骑行时长: ${formatTime(currentRide.elapsedTime)}\n停留时间: ${formatTime(Math.floor(pauseTime / 1000))}\n距离: ${(currentRide.distance / 1000).toFixed(2)} km\n\n确定要结束本次骑行记录吗？`,
      confirmText: '结束',
      confirmColor: '#ef4444',
      success: async (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '保存中...' });
          const savedRide = await endRide();
          Taro.hideLoading();
          
          if (savedRide) {
            Taro.redirectTo({
              url: `/pages/ride-result/index?id=${savedRide.id}`
            });
          }
        }
      }
    });
  };

  const recentRides = rides.slice(0, 3);
  const avgSpeed = currentRide.elapsedTime > 0 
    ? (currentRide.distance / 1000) / (currentRide.elapsedTime / 3600) 
    : 0;
  const calories = Math.floor(currentRide.distance / 1000 * 30);

  return (
    <ScrollView className={styles.recordPage} scrollY>
      <View className={styles.mapContainer}>
        <View className={styles.mapPlaceholder}>
          <Text className={styles.mapIcon}>🚴</Text>
          <Text className={styles.mapText}>
            {!currentRide.isRunning ? '点击开始记录骑行' : '正在记录你的轨迹...'}
          </Text>
        </View>
      </View>

      <View className={styles.statsSection}>
        <View className={styles.statsCard}>
          {!currentRide.isRunning ? (
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
              {currentRide.isRunning && !currentRide.isPaused && (
                <View className={styles.recordingIndicator}>
                  <View className={styles.recordingDot}></View>
                  <Text className={styles.recordingText}>正在记录</Text>
                </View>
              )}
              {currentRide.isPaused && (
                <View className={styles.recordingIndicator}>
                  <Text className={styles.recordingText} style={{ color: '#f59e0b' }}>已暂停</Text>
                </View>
              )}
              
              <View className={styles.timerDisplay}>
                <Text className={styles.timerValue}>{formatTime(currentRide.elapsedTime)}</Text>
                <Text className={styles.timerLabel}>骑行时长</Text>
              </View>

              {currentRide.totalPauseTime > 0 || currentRide.isPaused ? (
                <View style={{ textAlign: 'center', marginBottom: '16rpx' }}>
                  <Text style={{ fontSize: '24rpx', color: '#f59e0b' }}>
                    ⏸️ 停留时间: {getStopTimeDisplay()}
                  </Text>
                </View>
              ) : null}

              <View className={styles.mainStats}>
                <View className={styles.mainStat}>
                  <Text className={styles.mainStatValue}>{(currentRide.distance / 1000).toFixed(2)}</Text>
                  <Text className={styles.mainStatLabel}>公里</Text>
                </View>
                <View className={styles.mainStat}>
                  <Text className={styles.mainStatValue}>{currentRide.currentSpeed.toFixed(1)}</Text>
                  <Text className={styles.mainStatLabel}>km/h</Text>
                </View>
              </View>

              <View className={styles.subStats}>
                <View className={styles.subStat}>
                  <Text className={styles.subStatValue}>{currentRide.maxSpeed.toFixed(1)} km/h</Text>
                  <Text className={styles.subStatLabel}>最高速度</Text>
                </View>
                <View className={styles.subStat}>
                  <Text className={styles.subStatValue}>{avgSpeed.toFixed(1)} km/h</Text>
                  <Text className={styles.subStatLabel}>平均速度</Text>
                </View>
                <View className={styles.subStat}>
                  <Text className={styles.subStatValue}>{currentRide.elevation.toFixed(0)} m</Text>
                  <Text className={styles.subStatLabel}>爬升</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      <View className={styles.controlSection}>
        <View className={styles.controlButtons}>
          {!currentRide.isRunning ? (
            <Button 
              className={classnames(styles.controlButton, styles.startButton)}
              onClick={handleStart}
            >
              <Text className={styles.startButtonIcon}>▶</Text>
              <Text className={styles.startButtonText}>开始骑行</Text>
            </Button>
          ) : (
            <>
              {!currentRide.isPaused ? (
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
