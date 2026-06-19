export interface Equipment {
  id: string;
  name: string;
  type: 'bike' | 'helmet' | 'shoes' | 'accessory';
  brand: string;
  model: string;
  totalDistance: number;
  lastMaintenance: string;
  nextMaintenance: string;
  maintenanceInterval: number;
  purchaseDate: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  totalDistance: number;
  totalRides: number;
  totalDuration: number;
  totalElevation: number;
  joinedAt: string;
  level: number;
  badges: string[];
}

export interface PrivacySettings {
  showProfile: boolean;
  showRides: boolean;
  showLocation: boolean;
  allowFriendRequests: boolean;
}

export interface DataExportOptions {
  format: 'gpx' | 'csv' | 'json';
  includePhotos: boolean;
  dateRange: {
    start: string;
    end: string;
  };
}
