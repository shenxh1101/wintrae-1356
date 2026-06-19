import { create } from 'zustand';
import type { UserProfile, Equipment, PrivacySettings, DataExportOptions } from '../types/user';
import { mockUserProfile, mockEquipments } from '../data/user';
import type { RideRecord } from '../types/ride';
import { storage, generateId } from '../utils/storage';

interface UserState {
  profile: UserProfile;
  equipments: Equipment[];
  privacySettings: PrivacySettings;
  isLoading: boolean;

  initUser: () => Promise<void>;

  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;

  addEquipment: (equipment: Omit<Equipment, 'id'>) => Promise<Equipment>;
  updateEquipment: (id: string, updates: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  recordMaintenance: (id: string) => Promise<void>;

  updatePrivacySettings: (updates: Partial<PrivacySettings>) => Promise<void>;

  exportData: (options: DataExportOptions, rides: RideRecord[]) => Promise<string>;
}

const STORAGE_KEY_PROFILE = 'userProfile';
const STORAGE_KEY_EQUIPMENT = 'equipments';
const STORAGE_KEY_PRIVACY = 'privacySettings';

const defaultPrivacySettings: PrivacySettings = {
  showProfile: true,
  showRides: true,
  showLocation: true,
  allowFriendRequests: true
};

export const useUserStore = create<UserState>((set, get) => ({
  profile: mockUserProfile,
  equipments: [],
  privacySettings: defaultPrivacySettings,
  isLoading: false,

  initUser: async () => {
    set({ isLoading: true });
    const savedProfile = await storage.get<UserProfile>(STORAGE_KEY_PROFILE, mockUserProfile);
    const savedEquipments = await storage.get<Equipment[]>(STORAGE_KEY_EQUIPMENT, []);
    const savedPrivacy = await storage.get<PrivacySettings>(STORAGE_KEY_PRIVACY, defaultPrivacySettings);

    set({
      profile: savedProfile,
      equipments: savedEquipments.length > 0 ? savedEquipments : mockEquipments,
      privacySettings: savedPrivacy,
      isLoading: false
    });

    if (savedEquipments.length === 0) {
      await storage.set(STORAGE_KEY_EQUIPMENT, mockEquipments);
    }
  },

  updateProfile: async (updates) => {
    const profile = { ...get().profile, ...updates };
    set({ profile });
    await storage.set(STORAGE_KEY_PROFILE, profile);
  },

  addEquipment: async (equipmentData) => {
    const newEquipment: Equipment = {
      ...equipmentData,
      id: generateId()
    };
    const equipments = [...get().equipments, newEquipment];
    set({ equipments });
    await storage.set(STORAGE_KEY_EQUIPMENT, equipments);
    return newEquipment;
  },

  updateEquipment: async (id, updates) => {
    const equipments = get().equipments.map(e => 
      e.id === id ? { ...e, ...updates } : e
    );
    set({ equipments });
    await storage.set(STORAGE_KEY_EQUIPMENT, equipments);
  },

  deleteEquipment: async (id) => {
    const equipments = get().equipments.filter(e => e.id !== id);
    set({ equipments });
    await storage.set(STORAGE_KEY_EQUIPMENT, equipments);
  },

  recordMaintenance: async (id) => {
    const equipment = get().equipments.find(e => e.id === id);
    if (!equipment) return;

    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + equipment.maintenanceInterval);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    await get().updateEquipment(id, {
      lastMaintenance: formatDate(today),
      nextMaintenance: formatDate(nextDate)
    });
  },

  updatePrivacySettings: async (updates) => {
    const privacySettings = { ...get().privacySettings, ...updates };
    set({ privacySettings });
    await storage.set(STORAGE_KEY_PRIVACY, privacySettings);
  },

  exportData: async (options, rides) => {
    const { format, dateRange } = options;
    const filteredRides = rides.filter(ride => {
      const rideDate = new Date(ride.startTime);
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      return rideDate >= start && rideDate <= end;
    });

    let content = '';
    let mimeType = 'text/plain';

    if (format === 'gpx') {
      content = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="RideApp">
  <metadata>
    <name>Ride Records Export</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
${filteredRides.map(ride => `  <trk>
    <name>${ride.title}</name>
    <desc>Distance: ${ride.distance}m, Duration: ${ride.duration}s</desc>
    <trkseg>
${ride.points.map(p => `      <trkpt lat="${p.latitude}" lon="${p.longitude}">
        <ele>${p.altitude}</ele>
        <time>${new Date(p.timestamp).toISOString()}</time>
        <speed>${p.speed}</speed>
      </trkpt>`).join('\n')}
    </trkseg>
  </trk>`).join('\n')}
</gpx>`;
      mimeType = 'application/gpx+xml';
    } else if (format === 'csv') {
      const headers = ['id', 'title', 'distance(km)', 'duration(min)', 'avgSpeed(km/h)', 'maxSpeed(km/h)', 'elevation(m)', 'calories(kcal)', 'startTime', 'endTime', 'stopTime(min)'];
      const rows = filteredRides.map(ride => [
        ride.id,
        ride.title,
        (ride.distance / 1000).toFixed(2),
        Math.round(ride.duration / 60),
        ride.avgSpeed.toFixed(1),
        ride.maxSpeed.toFixed(1),
        ride.elevation.toFixed(0),
        ride.calories,
        ride.startTime,
        ride.endTime,
        Math.round(ride.stopTime / 60)
      ]);
      content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      mimeType = 'text/csv';
    } else if (format === 'json') {
      content = JSON.stringify({
        exportTime: new Date().toISOString(),
        totalRides: filteredRides.length,
        totalDistance: filteredRides.reduce((sum, r) => sum + r.distance, 0),
        rides: filteredRides
      }, null, 2);
      mimeType = 'application/json';
    }

    return content;
  }
}));
