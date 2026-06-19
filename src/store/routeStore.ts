import { create } from 'zustand';
import type { Route, SupplyPoint, DangerSection } from '../types/route';
import { mockRoutes } from '../data/routes';
import { storage, generateId } from '../utils/storage';
import { mockUserProfile } from '../data/user';

interface RouteState {
  routes: Route[];
  currentRoute: Partial<Route> | null;
  isLoading: boolean;
  initRoutes: () => Promise<void>;
  addRoute: (route: Omit<Route, 'id' | 'createdAt' | 'likes' | 'isFavorite' | 'creator'>) => Promise<Route>;
  updateRoute: (id: string, updates: Partial<Route>) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  setCurrentRoute: (route: Partial<Route> | null) => void;
  addSupplyPointToCurrent: (point: Omit<SupplyPoint, 'id'>) => void;
  addDangerSectionToCurrent: (section: Omit<DangerSection, 'id'>) => void;
  removeSupplyPointFromCurrent: (index: number) => void;
  removeDangerSectionFromCurrent: (index: number) => void;
  updateCurrentRoute: (updates: Partial<Route>) => void;
  saveCurrentRoute: () => Promise<Route | null>;
}

const STORAGE_KEY = 'routes';

export const useRouteStore = create<RouteState>((set, get) => ({
  routes: [],
  currentRoute: null,
  isLoading: false,

  initRoutes: async () => {
    set({ isLoading: true });
    const savedRoutes = await storage.get<Route[]>(STORAGE_KEY, []);
    if (savedRoutes.length > 0) {
      set({ routes: savedRoutes, isLoading: false });
    } else {
      set({ routes: mockRoutes, isLoading: false });
      await storage.set(STORAGE_KEY, mockRoutes);
    }
  },

  addRoute: async (routeData) => {
    const newRoute: Route = {
      ...routeData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isFavorite: false,
      creator: {
        id: mockUserProfile.id,
        name: mockUserProfile.name,
        avatar: mockUserProfile.avatar
      }
    };
    const routes = [...get().routes, newRoute];
    set({ routes });
    await storage.set(STORAGE_KEY, routes);
    return newRoute;
  },

  updateRoute: async (id, updates) => {
    const routes = get().routes.map(r => 
      r.id === id ? { ...r, ...updates } : r
    );
    set({ routes });
    await storage.set(STORAGE_KEY, routes);
  },

  deleteRoute: async (id) => {
    const routes = get().routes.filter(r => r.id !== id);
    set({ routes });
    await storage.set(STORAGE_KEY, routes);
  },

  toggleFavorite: async (id) => {
    const routes = get().routes.map(r => 
      r.id === id ? { 
        ...r, 
        isFavorite: !r.isFavorite,
        likes: !r.isFavorite ? r.likes + 1 : r.likes - 1
      } : r
    );
    set({ routes });
    await storage.set(STORAGE_KEY, routes);
  },

  setCurrentRoute: (route) => {
    set({ currentRoute: route });
  },

  addSupplyPointToCurrent: (point) => {
    const current = get().currentRoute || {};
    const supplyPoints = [...(current.supplyPoints || []), { ...point, id: generateId() }];
    set({ currentRoute: { ...current, supplyPoints } });
  },

  addDangerSectionToCurrent: (section) => {
    const current = get().currentRoute || {};
    const dangerSections = [...(current.dangerSections || []), { ...section, id: generateId() }];
    set({ currentRoute: { ...current, dangerSections } });
  },

  removeSupplyPointFromCurrent: (index) => {
    const current = get().currentRoute;
    if (!current?.supplyPoints) return;
    const supplyPoints = current.supplyPoints.filter((_, i) => i !== index);
    set({ currentRoute: { ...current, supplyPoints } });
  },

  removeDangerSectionFromCurrent: (index) => {
    const current = get().currentRoute;
    if (!current?.dangerSections) return;
    const dangerSections = current.dangerSections.filter((_, i) => i !== index);
    set({ currentRoute: { ...current, dangerSections } });
  },

  updateCurrentRoute: (updates) => {
    const current = get().currentRoute || {};
    set({ currentRoute: { ...current, ...updates } });
  },

  saveCurrentRoute: async () => {
    const current = get().currentRoute;
    if (!current || !current.name || !current.startPoint || !current.endPoint) {
      return null;
    }

    const routeData: Omit<Route, 'id' | 'createdAt' | 'likes' | 'isFavorite' | 'creator'> = {
      name: current.name,
      description: current.description || '',
      distance: current.distance || 0,
      duration: current.duration || 0,
      elevation: current.elevation || 0,
      difficulty: current.difficulty || 'medium',
      scenery: current.scenery || 'urban',
      coverImage: current.coverImage || `https://picsum.photos/seed/${generateId()}/800/400`,
      startPoint: current.startPoint,
      endPoint: current.endPoint,
      points: current.points || [],
      supplyPoints: current.supplyPoints || [],
      dangerSections: current.dangerSections || []
    };

    const newRoute = await get().addRoute(routeData);
    set({ currentRoute: null });
    return newRoute;
  }
}));
