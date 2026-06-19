import React, { useState, useEffect } from 'react';
import { View, Text, Input, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useRouteStore } from '../../store/routeStore';
import type { RoutePoint, SupplyPoint, DangerSection } from '../../types/route';
import { getSupplyPointLabel, getDangerSectionLabel } from '../../utils/format';
import classnames from 'classnames';

const supplyPointTypes: Array<{ value: SupplyPoint['type']; label: string; icon: string; color: string }> = [
  { value: 'water', label: '饮水点', icon: '💧', color: '#3b82f6' },
  { value: 'food', label: '餐饮', icon: '🍜', color: '#f59e0b' },
  { value: 'rest', label: '休息区', icon: '🏪', color: '#8b5cf6' },
  { value: 'repair', label: '维修站', icon: '🔧', color: '#07c160' }
];

const dangerSectionTypes: Array<{ value: DangerSection['type']; label: string; icon: string; color: string }> = [
  { value: 'construction', label: '施工路段', icon: '🚧', color: '#ef4444' },
  { value: 'traffic', label: '车流大', icon: '🚗', color: '#f59e0b' },
  { value: 'steep', label: '陡坡', icon: '⛰️', color: '#8b5cf6' },
  { value: 'pothole', label: '坑洼路面', icon: '⚠️', color: '#f59e0b' }
];

const sceneryOptions = [
  { value: 'urban', label: '城市', color: '#3b82f6' },
  { value: 'nature', label: '自然', color: '#07c160' },
  { value: 'riverside', label: '滨江', color: '#06b6d4' },
  { value: 'mountain', label: '山地', color: '#8b5cf6' }
];

const difficultyOptions = [
  { value: 'easy', label: '休闲', color: '#07c160' },
  { value: 'medium', label: '中等', color: '#f59e0b' },
  { value: 'hard', label: '挑战', color: '#ef4444' }
];

const PlanRoutePage: React.FC = () => {
  const router = useRouter();
  const routeId = router.params.routeId;

  const { currentRoute, setCurrentRoute, updateCurrentRoute, addSupplyPointToCurrent, addDangerSectionToCurrent, removeSupplyPointFromCurrent, removeDangerSectionFromCurrent, saveCurrentRoute, routes } = useRouteStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [routeName, setRouteName] = useState('');
  const [routeDescription, setRouteDescription] = useState('');
  const [selectedScenery, setSelectedScenery] = useState<'urban' | 'nature' | 'riverside' | 'mountain'>('urban');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showAddSupply, setShowAddSupply] = useState(false);
  const [showAddDanger, setShowAddDanger] = useState(false);
  const [selectedSupplyType, setSelectedSupplyType] = useState<SupplyPoint['type']>('water');
  const [selectedDangerType, setSelectedDangerType] = useState<DangerSection['type']>('construction');
  const [markerName, setMarkerName] = useState('');
  const [markerDesc, setMarkerDesc] = useState('');

  useEffect(() => {
    if (routeId) {
      const existingRoute = routes.find(r => r.id === routeId);
      if (existingRoute) {
        setCurrentRoute(existingRoute);
        setRouteName(existingRoute.name);
        setRouteDescription(existingRoute.description);
        setSelectedScenery(existingRoute.scenery);
        setSelectedDifficulty(existingRoute.difficulty);
        setStep(3);
      }
    } else if (!currentRoute) {
      setCurrentRoute({
        supplyPoints: [],
        dangerSections: [],
        points: []
      });
    }
  }, [routeId, routes, currentRoute, setCurrentRoute]);

  const handleSelectPoint = (type: 'start' | 'end') => {
    Taro.showModal({
      title: '选择地点',
      editable: true,
      placeholderText: '请输入地址或地标名称',
      success: (res) => {
        if (res.confirm && res.content) {
          const point: RoutePoint = {
            latitude: 31.2304 + Math.random() * 0.1,
            longitude: 121.4737 + Math.random() * 0.1
          };
          if (type === 'start') {
            setStartAddress(res.content);
            updateCurrentRoute({ startPoint: point });
          } else {
            setEndAddress(res.content);
            updateCurrentRoute({ endPoint: point });
            const distance = 10 + Math.random() * 40;
            const duration = distance / 20 * 3600;
            updateCurrentRoute({
              distance: distance * 1000,
              duration: Math.floor(duration),
              elevation: Math.floor(Math.random() * 200)
            });
          }
        }
      }
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!currentRoute?.startPoint || !currentRoute?.endPoint) {
        Taro.showToast({ title: '请选择起点和终点', icon: 'none' });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleAddSupply = () => {
    if (!markerName.trim()) {
      Taro.showToast({ title: '请输入名称', icon: 'none' });
      return;
    }
    addSupplyPointToCurrent({
      name: markerName,
      type: selectedSupplyType,
      latitude: 31.2304 + Math.random() * 0.05,
      longitude: 121.4737 + Math.random() * 0.05,
      description: markerDesc
    });
    setShowAddSupply(false);
    setMarkerName('');
    setMarkerDesc('');
    Taro.showToast({ title: '补给点已添加', icon: 'success' });
  };

  const handleAddDanger = () => {
    if (!markerDesc.trim()) {
      Taro.showToast({ title: '请输入描述', icon: 'none' });
      return;
    }
    addDangerSectionToCurrent({
      type: selectedDangerType,
      latitude: 31.2304 + Math.random() * 0.05,
      longitude: 121.4737 + Math.random() * 0.05,
      description: markerDesc
    });
    setShowAddDanger(false);
    setMarkerName('');
    setMarkerDesc('');
    Taro.showToast({ title: '危险路段已添加', icon: 'success' });
  };

  const handleSave = async () => {
    if (!routeName.trim()) {
      Taro.showToast({ title: '请输入路线名称', icon: 'none' });
      return;
    }

    updateCurrentRoute({
      name: routeName,
      description: routeDescription,
      scenery: selectedScenery,
      difficulty: selectedDifficulty
    });

    Taro.showLoading({ title: '保存中...' });
    const savedRoute = await saveCurrentRoute();
    Taro.hideLoading();

    if (savedRoute) {
      Taro.showToast({
        title: '保存成功',
        icon: 'success',
        success: () => {
          setTimeout(() => {
            Taro.redirectTo({
              url: `/pages/route-detail/index?id=${savedRoute.id}`
            });
          }, 1500);
        }
      });
    } else {
      Taro.showToast({ title: '保存失败，请检查信息', icon: 'none' });
    }
  };

  const renderMap = () => (
    <View className={styles.mapContainer}>
      <View className={styles.mapPlaceholder}>
        <Text className={styles.mapIcon}>🗺️</Text>
        <Text className={styles.mapText}>路线预览</Text>
        {startAddress && endAddress && (
          <View className={styles.routeInfo}>
            <Text className={styles.routeText}>
              📍 {startAddress} → {endAddress}
            </Text>
            {currentRoute?.distance && (
              <Text className={styles.routeDistance}>
                距离 {(currentRoute.distance / 1000).toFixed(1)} km
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );

  if (showAddSupply) {
    return (
      <View className={styles.modalPage}>
        <View className={styles.modalContent}>
          <Text className={styles.modalTitle}>添加补给点</Text>
          <Text className={styles.formLabel}>补给点名称</Text>
          <Input
            className={styles.formInput}
            placeholder="例如：XX便利店"
            value={markerName}
            onInput={(e) => setMarkerName(e.detail.value)}
          />
          <Text className={styles.formLabel}>补给点类型</Text>
          <View className={styles.typeGrid}>
            {supplyPointTypes.map(type => (
              <View
                key={type.value}
                className={classnames(
                  styles.typeItem,
                  selectedSupplyType === type.value && styles.typeItemActive
                )}
                style={selectedSupplyType === type.value ? { borderColor: type.color, backgroundColor: type.color + '15' } : {}}
                onClick={() => setSelectedSupplyType(type.value)}
              >
                <Text className={styles.typeIcon}>{type.icon}</Text>
                <Text style={{ color: selectedSupplyType === type.value ? type.color : '#64748b' }}>{type.label}</Text>
              </View>
            ))}
          </View>
          <Text className={styles.formLabel}>备注说明</Text>
          <Input
            className={styles.formInput}
            placeholder="可选，例如：24小时营业"
            value={markerDesc}
            onInput={(e) => setMarkerDesc(e.detail.value)}
          />
          <View className={styles.modalActions}>
            <Button className={styles.cancelBtn} onClick={() => setShowAddSupply(false)}>取消</Button>
            <Button className={styles.confirmBtn} onClick={handleAddSupply}>确认添加</Button>
          </View>
        </View>
      </View>
    );
  }

  if (showAddDanger) {
    return (
      <View className={styles.modalPage}>
        <View className={styles.modalContent}>
          <Text className={styles.modalTitle}>添加危险路段</Text>
          <Text className={styles.formLabel}>危险类型</Text>
          <View className={styles.typeGrid}>
            {dangerSectionTypes.map(type => (
              <View
                key={type.value}
                className={classnames(
                  styles.typeItem,
                  selectedDangerType === type.value && styles.typeItemActive
                )}
                style={selectedDangerType === type.value ? { borderColor: type.color, backgroundColor: type.color + '15' } : {}}
                onClick={() => setSelectedDangerType(type.value)}
              >
                <Text className={styles.typeIcon}>{type.icon}</Text>
                <Text style={{ color: selectedDangerType === type.value ? type.color : '#64748b' }}>{type.label}</Text>
              </View>
            ))}
          </View>
          <Text className={styles.formLabel}>详细描述</Text>
          <Input
            className={styles.formInput}
            placeholder="描述具体位置和注意事项"
            value={markerDesc}
            onInput={(e) => setMarkerDesc(e.detail.value)}
          />
          <View className={styles.modalActions}>
            <Button className={styles.cancelBtn} onClick={() => setShowAddDanger(false)}>取消</Button>
            <Button className={styles.confirmBtn} onClick={handleAddDanger}>确认添加</Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.planRoutePage}>
      <View className={styles.stepIndicator}>
        {[1, 2, 3].map(s => (
          <React.Fragment key={s}>
            <View className={classnames(
              styles.stepDot,
              step >= s && styles.stepDotActive
            )}>
              {step > s ? '✓' : s}
            </View>
            {s < 3 && <View className={classnames(
              styles.stepLine,
              step > s && styles.stepLineActive
            )} />}
          </React.Fragment>
        ))}
      </View>
      <View className={styles.stepLabels}>
        <Text className={classnames(step >= 1 && styles.stepLabelActive)}>起终点</Text>
        <Text className={classnames(step >= 2 && styles.stepLabelActive)}>标记</Text>
        <Text className={classnames(step >= 3 && styles.stepLabelActive)}>保存</Text>
      </View>

      <ScrollView scrollY>
        {renderMap()}

        {step === 1 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>选择起终点</Text>
            
            <View 
              className={styles.pointCard}
              onClick={() => handleSelectPoint('start')}
            >
              <View className={styles.pointIconStart}>📍</View>
              <View className={styles.pointInfo}>
                <Text className={styles.pointLabel}>起点</Text>
                <Text className={classnames(styles.pointValue, !startAddress && styles.placeholder)}>
                  {startAddress || '点击选择起点'}
                </Text>
              </View>
              <Text className={styles.pointArrow}>›</Text>
            </View>

            <View 
              className={styles.pointCard}
              onClick={() => handleSelectPoint('end')}
            >
              <View className={styles.pointIconEnd}>🏁</View>
              <View className={styles.pointInfo}>
                <Text className={styles.pointLabel}>终点</Text>
                <Text className={classnames(styles.pointValue, !endAddress && styles.placeholder)}>
                  {endAddress || '点击选择终点'}
                </Text>
              </View>
              <Text className={styles.pointArrow}>›</Text>
            </View>
          </View>
        )}

        {step === 2 && (
          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>补给点</Text>
              <Button className={styles.addBtn} onClick={() => setShowAddSupply(true)}>+ 添加</Button>
            </View>
            {currentRoute?.supplyPoints?.length ? (
              currentRoute.supplyPoints.map((point, index) => (
                <View key={point.id} className={styles.markerItem}>
                  <View className={styles.markerIcon}>💧</View>
                  <View className={styles.markerInfo}>
                    <Text className={styles.markerName}>{point.name}</Text>
                    <Text className={styles.markerType}>{getSupplyPointLabel(point.type)}</Text>
                  </View>
                  <Button 
                    className={styles.deleteBtn}
                    onClick={() => removeSupplyPointFromCurrent(index)}
                  >删除</Button>
                </View>
              ))
            ) : (
              <View className={styles.emptyMarkers}>
                <Text>暂无补给点，点击上方添加</Text>
              </View>
            )}

            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>危险路段</Text>
              <Button className={styles.addBtn} onClick={() => setShowAddDanger(true)}>+ 添加</Button>
            </View>
            {currentRoute?.dangerSections?.length ? (
              currentRoute.dangerSections.map((section, index) => (
                <View key={section.id} className={styles.markerItem}>
                  <View className={styles.markerIconDanger}>⚠️</View>
                  <View className={styles.markerInfo}>
                    <Text className={styles.markerName}>{getDangerSectionLabel(section.type)}</Text>
                    <Text className={styles.markerDesc}>{section.description}</Text>
                  </View>
                  <Button 
                    className={styles.deleteBtn}
                    onClick={() => removeDangerSectionFromCurrent(index)}
                  >删除</Button>
                </View>
              ))
            ) : (
              <View className={styles.emptyMarkers}>
                <Text>暂无危险路段标记</Text>
              </View>
            )}
          </View>
        )}

        {step === 3 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>路线信息</Text>
            
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>路线名称 *</Text>
              <Input
                className={styles.formInput}
                placeholder="给路线起个名字"
                value={routeName}
                onInput={(e) => setRouteName(e.detail.value)}
                maxlength={30}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>路线描述</Text>
              <Input
                className={styles.formInput}
                placeholder="简要描述这条路线的特点"
                value={routeDescription}
                onInput={(e) => setRouteDescription(e.detail.value)}
                maxlength={100}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>风景类型</Text>
              <View className={styles.optionRow}>
                {sceneryOptions.map(opt => (
                  <View
                    key={opt.value}
                    className={classnames(
                      styles.optionTag,
                      selectedScenery === opt.value && styles.optionTagActive
                    )}
                    style={selectedScenery === opt.value ? { borderColor: opt.color, color: opt.color } : {}}
                    onClick={() => setSelectedScenery(opt.value as any)}
                  >
                    {opt.label}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>难度等级</Text>
              <View className={styles.optionRow}>
                {difficultyOptions.map(opt => (
                  <View
                    key={opt.value}
                    className={classnames(
                      styles.optionTag,
                      selectedDifficulty === opt.value && styles.optionTagActive
                    )}
                    style={selectedDifficulty === opt.value ? { borderColor: opt.color, color: opt.color } : {}}
                    onClick={() => setSelectedDifficulty(opt.value as any)}
                  >
                    {opt.label}
                  </View>
                ))}
              </View>
            </View>

            {currentRoute && (
              <View className={styles.summaryCard}>
                <Text className={styles.summaryTitle}>路线预览</Text>
                <View className={styles.summaryGrid}>
                  <View className={styles.summaryItem}>
                    <Text className={styles.summaryValue}>{((currentRoute.distance || 0) / 1000).toFixed(1)} km</Text>
                    <Text className={styles.summaryLabel}>距离</Text>
                  </View>
                  <View className={styles.summaryItem}>
                    <Text className={styles.summaryValue}>{Math.floor((currentRoute.duration || 0) / 60)} min</Text>
                    <Text className={styles.summaryLabel}>预计时长</Text>
                  </View>
                  <View className={styles.summaryItem}>
                    <Text className={styles.summaryValue}>{currentRoute.elevation || 0} m</Text>
                    <Text className={styles.summaryLabel}>累计爬升</Text>
                  </View>
                </View>
                {currentRoute.supplyPoints?.length > 0 && (
                  <Text className={styles.summaryInfo}>
                    💧 补给点：{currentRoute.supplyPoints.length} 处
                  </Text>
                )}
                {currentRoute.dangerSections?.length > 0 && (
                  <Text className={styles.summaryInfo}>
                    ⚠️ 危险路段：{currentRoute.dangerSections.length} 处
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        <View style={{ height: '180rpx' }} />
      </ScrollView>

      <View className={styles.bottomBar}>
        {step > 1 && (
          <Button className={styles.prevBtn} onClick={handlePrevStep}>上一步</Button>
        )}
        {step < 3 ? (
          <Button className={styles.nextBtn} onClick={handleNextStep}>下一步</Button>
        ) : (
          <Button className={styles.saveBtn} onClick={handleSave}>保存路线</Button>
        )}
      </View>
    </View>
  );
};

export default PlanRoutePage;
