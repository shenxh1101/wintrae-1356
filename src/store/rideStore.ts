import { create } from 'zustand';
import type { RideRecord, MonthlyStats, RidePoint } from '../types/ride';
import { mockRides, mockMonthlyStats } from '../data/rides';
import { storage, generateId } from '../utils/storage';

interface RideState {
  rides: RideRecord[];
  monthlyStats: MonthlyStats;
  currentRide: {
    isRunning: boolean;
    isPaused: boolean;
    startTime: number | null;
    pauseStartTime: number | null;
    totalPauseTime: number;
    elapsedTime: number;
    distance: number;
    maxSpeed: number;
    elevation: number;
    points: RidePoint[];
    currentSpeed: number;
    currentAltitude: number;
  };
  isLoading: boolean;

  initRides: () => Promise<void>;
  addRide: (ride: Omit<RideRecord, 'id'>) => Promise<RideRecord>;
  deleteRide: (id: string) => Promise<void>;

  startRide: () => void;
  pauseRide: () => void;
  resumeRide: () => void;
  updateRideData: (data: Partial<RideState['currentRide']>) => void;
  addRidePoint: (point: Omit<RidePoint, 'timestamp'>) => void;
  endRide: (title?: string) => Promise<RideRecord | null>;
  resetRide: () => void;
}

const STORAGE_KEY_RIDES = 'rides';
const STORAGE_KEY_STATS = 'monthlyStats';

const initialCurrentRide = {
  isRunning: false,
  isPaused: false,
  startTime: null,
  pauseStartTime: null,
  totalPauseTime: 0,
  elapsedTime: 0,
  distance: 0,
  maxSpeed: 0,
  elevation: 0,
  points: [],
  currentSpeed: 0,
  currentAltitude: 0
};

export const useRideStore = create<RideState>((set, get) => ({
  rides: [],
  monthlyStats: mockMonthlyStats,
  currentRide: { ...initialCurrentRide },
  isLoading: false,

  initRides: async () => {
    set({ isLoading: true });
    const savedRides = await storage.get<RideRecord[]>(STORAGE_KEY_RIDES, []);
    const savedStats = await storage.get<MonthlyStats>(STORAGE_KEY_STATS, mockMonthlyStats);
    
    if (savedRides.length > 0) {
      set({ rides: savedRides, monthlyStats: savedStats, isLoading: false });
    } else {
      set({ rides: mockRides, monthlyStats: mockMonthlyStats, isLoading: false });
      await storage.set(STORAGE_KEY_RIDES, mockRides);
      await storage.set(STORAGE_KEY_STATS, mockMonthlyStats);
    }
  },

  addRide: async (rideData) => {
    const newRide: RideRecord = {
      ...rideData,
      id: generateId()
    };
    const rides = [newRide, ...get().rides];
    set({ rides });
    await storage.set(STORAGE_KEY_RIDES, rides);

    const currentStats = get().monthlyStats;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    if (currentStats.month === currentMonth) {
      const updatedStats: MonthlyStats = {
        ...currentStats,
        totalDistance: currentStats.totalDistance + newRide.distance,
        totalDuration: currentStats.totalDuration + newRide.duration,
        totalRides: currentStats.totalRides + 1,
        totalElevation: currentStats.totalElevation + newRide.elevation,
        avgSpeed: Math.max(0, (currentStats.avgSpeed * currentStats.totalRides + newRide.avgSpeed) / (currentStats.totalRides + 1)),
        longestRide: Math.max(currentStats.longestRide, newRide.distance)
      };
      set({ monthlyStats: updatedStats });
      await storage.set(STORAGE_KEY_STATS, updatedStats);
    }

    return newRide;
  },

  deleteRide: async (id) => {
    const rides = get().rides.filter(r => r.id !== id);
    set({ rides });
    await storage.set(STORAGE_KEY_RIDES, rides);
  },

  startRide: () => {
    set({
      currentRide: {
        ...initialCurrentRide,
        isRunning: true,
        startTime: Date.now()
      }
    });
  },

  pauseRide: () => {
    set(state => ({
      currentRide: {
        ...state.currentRide,
        isPaused: true,
        pauseStartTime: Date.now()
      }
    }));
  },

  resumeRide: () => {
    set(state => {
      const pauseDuration = state.currentRide.pauseStartTime 
        ? Date.now() - state.currentRide.pauseStartTime 
        : 0;
      return {
        currentRide: {
          ...state.currentRide,
          isPaused: false,
          pauseStartTime: null,
          totalPauseTime: state.currentRide.totalPauseTime + pauseDuration
        }
      };
    });
  },

  updateRideData: (data) => {
    set(state => ({
      currentRide: { ...state.currentRide, ...data }
    }));
  },

  addRidePoint: (point) => {
    set(state => ({
      currentRide: {
        ...state.currentRide,
        points: [...state.currentRide.points, { ...point, timestamp: Date.now() }]
      }
    }));
  },

  endRide: async (title = '自由骑行') => {
    const { currentRide } = get();
    if (!currentRide.isRunning || !currentRide.startTime) return null;

    const endTime = Date.now();
    const totalPauseTime = currentRide.isPaused && currentRide.pauseStartTime
      ? currentRide.totalPauseTime + (endTime - currentRide.pauseStartTime)
      : currentRide.totalPauseTime;
    
    const totalDuration = endTime - currentRide.startTime;
    const movingDuration = Math.max(0, totalDuration - totalPauseTime);
    const durationInSeconds = Math.floor(movingDuration / 1000);
    const stopTimeInSeconds = Math.floor(totalPauseTime / 1000);

    const avgSpeed = durationInSeconds > 0 
      ? (currentRide.distance / 1000) / (durationInSeconds / 3600) 
      : 0;

    const rideData: Omit<RideRecord, 'id'> = {
      title,
      distance: currentRide.distance,
      duration: durationInSeconds,
      avgSpeed,
      maxSpeed: currentRide.maxSpeed,
      elevation: currentRide.elevation,
      calories: Math.floor(currentRide.distance / 1000 * 30),
      points: currentRide.points,
      startTime: new Date(currentRide.startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      stopTime: stopTimeInSeconds,
      coverImage: `https://picsum.photos/seed/${generateId()}/800/400`
    };

    const newRide = await get().addRide(rideData);
    set({ currentRide: { ...initialCurrentRide } });
    return newRide;
  },

  resetRide: () => {
    set({ currentRide: { ...initialCurrentRide } });
  }
}));
