export interface SupplyPoint {
  id: string;
  name: string;
  type: 'water' | 'food' | 'rest' | 'repair';
  latitude: number;
  longitude: number;
  description?: string;
}

export interface DangerSection {
  id: string;
  type: 'construction' | 'traffic' | 'steep' | 'pothole';
  latitude: number;
  longitude: number;
  description?: string;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp?: number;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  distance: number;
  duration: number;
  elevation: number;
  difficulty: 'easy' | 'medium' | 'hard';
  scenery: 'urban' | 'nature' | 'riverside' | 'mountain';
  coverImage: string;
  startPoint: RoutePoint;
  endPoint: RoutePoint;
  points: RoutePoint[];
  supplyPoints: SupplyPoint[];
  dangerSections: DangerSection[];
  likes: number;
  isFavorite: boolean;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type SceneryType = 'urban' | 'nature' | 'riverside' | 'mountain';
