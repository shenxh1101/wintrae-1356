import { create } from 'zustand';
import type { Activity, Announcement, Participant } from '../types/activity';
import { mockActivities } from '../data/activities';
import { storage, generateId } from '../utils/storage';
import { mockUserProfile } from '../data/user';

interface ActivityState {
  activities: Activity[];
  isLoading: boolean;

  initActivities: () => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id' | 'currentParticipants' | 'participants' | 'organizer' | 'announcements' | 'status' | 'createdAt'>) => Promise<Activity>;
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;

  joinActivity: (activityId: string) => Promise<boolean>;
  leaveActivity: (activityId: string) => Promise<boolean>;
  hasJoined: (activityId: string) => boolean;

  addAnnouncement: (activityId: string, content: string) => Promise<Announcement | null>;
}

const STORAGE_KEY = 'activities';
const CURRENT_USER_ID = mockUserProfile.id;

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  isLoading: false,

  initActivities: async () => {
    set({ isLoading: true });
    const savedActivities = await storage.get<Activity[]>(STORAGE_KEY, []);
    if (savedActivities.length > 0) {
      set({ activities: savedActivities, isLoading: false });
    } else {
      set({ activities: mockActivities, isLoading: false });
      await storage.set(STORAGE_KEY, mockActivities);
    }
  },

  addActivity: async (activityData) => {
    const newActivity: Activity = {
      ...activityData,
      id: generateId(),
      currentParticipants: 1,
      participants: [{
        id: CURRENT_USER_ID,
        name: mockUserProfile.name,
        avatar: mockUserProfile.avatar,
        joinedAt: new Date().toISOString()
      }],
      organizer: {
        id: mockUserProfile.id,
        name: mockUserProfile.name,
        avatar: mockUserProfile.avatar
      },
      announcements: [],
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };
    const activities = [newActivity, ...get().activities];
    set({ activities });
    await storage.set(STORAGE_KEY, activities);
    return newActivity;
  },

  updateActivity: async (id, updates) => {
    const activities = get().activities.map(a => 
      a.id === id ? { ...a, ...updates } : a
    );
    set({ activities });
    await storage.set(STORAGE_KEY, activities);
  },

  deleteActivity: async (id) => {
    const activities = get().activities.filter(a => a.id !== id);
    set({ activities });
    await storage.set(STORAGE_KEY, activities);
  },

  joinActivity: async (activityId) => {
    const activity = get().activities.find(a => a.id === activityId);
    if (!activity) return false;
    
    if (activity.currentParticipants >= activity.maxParticipants) {
      return false;
    }

    if (activity.participants.some(p => p.id === CURRENT_USER_ID)) {
      return false;
    }

    const newParticipant: Participant = {
      id: CURRENT_USER_ID,
      name: mockUserProfile.name,
      avatar: mockUserProfile.avatar,
      joinedAt: new Date().toISOString()
    };

    const activities = get().activities.map(a => 
      a.id === activityId 
        ? { 
            ...a, 
            currentParticipants: a.currentParticipants + 1,
            participants: [...a.participants, newParticipant]
          }
        : a
    );
    set({ activities });
    await storage.set(STORAGE_KEY, activities);
    return true;
  },

  leaveActivity: async (activityId) => {
    const activity = get().activities.find(a => a.id === activityId);
    if (!activity) return false;

    if (!activity.participants.some(p => p.id === CURRENT_USER_ID)) {
      return false;
    }

    if (activity.organizer.id === CURRENT_USER_ID) {
      return false;
    }

    const activities = get().activities.map(a => 
      a.id === activityId 
        ? { 
            ...a, 
            currentParticipants: a.currentParticipants - 1,
            participants: a.participants.filter(p => p.id !== CURRENT_USER_ID)
          }
        : a
    );
    set({ activities });
    await storage.set(STORAGE_KEY, activities);
    return true;
  },

  hasJoined: (activityId) => {
    const activity = get().activities.find(a => a.id === activityId);
    return activity ? activity.participants.some(p => p.id === CURRENT_USER_ID) : false;
  },

  addAnnouncement: async (activityId, content) => {
    const activity = get().activities.find(a => a.id === activityId);
    if (!activity) return null;

    if (activity.organizer.id !== CURRENT_USER_ID) {
      return null;
    }

    const newAnnouncement: Announcement = {
      id: generateId(),
      content,
      createdAt: new Date().toISOString(),
      creatorId: CURRENT_USER_ID,
      creatorName: mockUserProfile.name
    };

    const activities = get().activities.map(a => 
      a.id === activityId 
        ? { ...a, announcements: [...a.announcements, newAnnouncement] }
        : a
    );
    set({ activities });
    await storage.set(STORAGE_KEY, activities);
    return newAnnouncement;
  }
}));
