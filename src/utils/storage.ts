import Taro from '@tarojs/taro';

const STORAGE_PREFIX = 'ride_app_';

export const storage = {
  get: async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      const res = await Taro.getStorage({ key: STORAGE_PREFIX + key });
      if (res.data) {
        return JSON.parse(res.data) as T;
      }
      return defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: async (key: string, value: any): Promise<void> => {
    try {
      await Taro.setStorage({
        key: STORAGE_PREFIX + key,
        data: JSON.stringify(value)
      });
    } catch (e) {
      console.error('Storage set error:', e);
    }
  },

  remove: async (key: string): Promise<void> => {
    try {
      await Taro.removeStorage({ key: STORAGE_PREFIX + key });
    } catch (e) {
      console.error('Storage remove error:', e);
    }
  },

  getSync: <T>(key: string, defaultValue: T): T => {
    try {
      const res = Taro.getStorageSync(STORAGE_PREFIX + key);
      if (res) {
        return JSON.parse(res) as T;
      }
      return defaultValue;
    } catch {
      return defaultValue;
    }
  },

  setSync: (key: string, value: any): void => {
    try {
      Taro.setStorageSync(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage setSync error:', e);
    }
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};
