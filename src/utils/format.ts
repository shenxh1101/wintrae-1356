export const formatDistance = (distance: number): string => {
  if (distance >= 1000) {
    return (distance / 1000).toFixed(1) + ' km';
  }
  return distance.toFixed(0) + ' m';
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}小时${minutes}分`;
  }
  if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  }
  return `${secs}秒`;
};

export const formatDurationShort = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
  }
  return `${minutes}分钟`;
};

export const formatSpeed = (speed: number): string => {
  return speed.toFixed(1) + ' km/h';
};

export const formatElevation = (elevation: number): string => {
  return elevation.toFixed(0) + ' m';
};

export const formatCalories = (calories: number): string => {
  return calories.toFixed(0) + ' kcal';
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

export const formatDateFull = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const getDifficultyLabel = (difficulty: string): string => {
  const map: Record<string, string> = {
    easy: '休闲',
    medium: '中等',
    hard: '挑战'
  };
  return map[difficulty] || difficulty;
};

export const getDifficultyColor = (difficulty: string): string => {
  const map: Record<string, string> = {
    easy: '#07c160',
    medium: '#f59e0b',
    hard: '#ef4444'
  };
  return map[difficulty] || '#94a3b8';
};

export const getSceneryLabel = (scenery: string): string => {
  const map: Record<string, string> = {
    urban: '城市',
    nature: '自然',
    riverside: '滨江',
    mountain: '山地'
  };
  return map[scenery] || scenery;
};

export const getSupplyPointLabel = (type: string): string => {
  const map: Record<string, string> = {
    water: '饮水点',
    food: '餐饮',
    rest: '休息区',
    repair: '维修站'
  };
  return map[type] || type;
};

export const getDangerSectionLabel = (type: string): string => {
  const map: Record<string, string> = {
    construction: '施工路段',
    traffic: '车流大',
    steep: '陡坡',
    pothole: '坑洼路面'
  };
  return map[type] || type;
};

export const getPaceLabel = (pace: string): string => {
  const map: Record<string, string> = {
    leisurely: '休闲骑',
    moderate: '匀速骑',
    fast: '竞速骑'
  };
  return map[pace] || pace;
};

export const getActivityStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    upcoming: '即将开始',
    ongoing: '进行中',
    completed: '已结束',
    cancelled: '已取消'
  };
  return map[status] || status;
};

export const getActivityStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    upcoming: '#07c160',
    ongoing: '#3b82f6',
    completed: '#94a3b8',
    cancelled: '#ef4444'
  };
  return map[status] || '#94a3b8';
};
