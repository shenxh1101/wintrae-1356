export interface Participant {
  id: string;
  name: string;
  avatar: string;
  joinedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  date: string;
  startTime: string;
  endTime: string;
  meetupPoint: string;
  meetupLatitude: number;
  meetupLongitude: number;
  distance: number;
  maxParticipants: number;
  currentParticipants: number;
  participants: Participant[];
  difficulty: 'easy' | 'medium' | 'hard';
  pace: 'leisurely' | 'moderate' | 'fast';
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  announcements: Announcement[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Announcement {
  id: string;
  content: string;
  createdAt: string;
  creatorId: string;
  creatorName: string;
}

export interface CreateActivityForm {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  meetupPoint: string;
  distance: number;
  maxParticipants: number;
  difficulty: 'easy' | 'medium' | 'hard';
  pace: 'leisurely' | 'moderate' | 'fast';
}
