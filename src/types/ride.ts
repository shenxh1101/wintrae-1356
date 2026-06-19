export interface RidePoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed: number;
  altitude: number;
}

export interface RideRecord {
  id: string;
  title: string;
  distance: number;
  duration: number;
  avgSpeed: number;
  maxSpeed: number;
  elevation: number;
  calories: number;
  points: RidePoint[];
  startTime: string;
  endTime: string;
  stopTime: number;
  routeId?: string;
  routeName?: string;
  coverImage?: string;
  notes?: string;
}

export interface MonthlyStats {
  month: string;
  totalDistance: number;
  totalDuration: number;
  totalRides: number;
  totalElevation: number;
  avgSpeed: number;
  longestRide: number;
}
