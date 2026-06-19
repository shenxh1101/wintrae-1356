import type { Activity } from '../types/activity';

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    title: '周末滨江休闲骑',
    description: '周六早上一起骑滨江绿道，欣赏江景，适合新手和休闲爱好者。路线平坦，全程约15公里，中途有补给点。',
    coverImage: 'https://picsum.photos/id/1015/600/400',
    date: '2024-06-15',
    startTime: '07:00',
    endTime: '09:30',
    meetupPoint: '滨江公园南门',
    meetupLatitude: 31.2304,
    meetupLongitude: 121.4737,
    distance: 15,
    maxParticipants: 20,
    currentParticipants: 12,
    participants: [
      { id: 'u1', name: '骑行达人小王', avatar: 'https://picsum.photos/id/64/200/200', joinedAt: '2024-06-10T10:00:00Z' },
      { id: 'u2', name: '爬坡爱好者', avatar: 'https://picsum.photos/id/91/200/200', joinedAt: '2024-06-11T14:30:00Z' },
      { id: 'u3', name: '夜骑一族', avatar: 'https://picsum.photos/id/177/200/200', joinedAt: '2024-06-12T09:15:00Z' }
    ],
    difficulty: 'easy',
    pace: 'leisurely',
    organizer: {
      id: 'u1',
      name: '骑行达人小王',
      avatar: 'https://picsum.photos/id/64/200/200'
    },
    announcements: [
      { id: 'ann1', content: '请大家准时到达集合点，带好水和能量补给', createdAt: '2024-06-13T16:00:00Z', creatorId: 'u1', creatorName: '骑行达人小王' },
      { id: 'ann2', content: '天气预报周六多云，适合骑行，注意防晒', createdAt: '2024-06-14T08:00:00Z', creatorId: 'u1', creatorName: '骑行达人小王' }
    ],
    status: 'upcoming',
    createdAt: '2024-06-08T10:00:00Z'
  },
  {
    id: 'a2',
    title: '佘山爬坡挑战活动',
    description: '挑战佘山爬坡，考验你的耐力和技巧。适合有一定骑行基础的爱好者，全程约28公里，累计爬升300+米。',
    coverImage: 'https://picsum.photos/id/1018/600/400',
    date: '2024-06-22',
    startTime: '06:30',
    endTime: '11:00',
    meetupPoint: '佘山森林公园东门',
    meetupLatitude: 31.0954,
    meetupLongitude: 121.1937,
    distance: 28,
    maxParticipants: 15,
    currentParticipants: 8,
    participants: [
      { id: 'u2', name: '爬坡爱好者', avatar: 'https://picsum.photos/id/91/200/200', joinedAt: '2024-06-12T08:00:00Z' },
      { id: 'u7', name: '速度狂人', avatar: 'https://picsum.photos/id/91/200/200', joinedAt: '2024-06-13T10:30:00Z' }
    ],
    difficulty: 'hard',
    pace: 'moderate',
    organizer: {
      id: 'u2',
      name: '爬坡爱好者',
      avatar: 'https://picsum.photos/id/91/200/200'
    },
    announcements: [
      { id: 'ann3', content: '请确保车辆状态良好，刹车灵敏', createdAt: '2024-06-15T12:00:00Z', creatorId: 'u2', creatorName: '爬坡爱好者' }
    ],
    status: 'upcoming',
    createdAt: '2024-06-10T14:00:00Z'
  },
  {
    id: 'a3',
    title: '古镇文化骑行之旅',
    description: '探访江南古镇，感受历史文化底蕴。路线经过多个古镇景点，中途安排休息和品尝当地美食。',
    coverImage: 'https://picsum.photos/id/1044/600/400',
    date: '2024-06-18',
    startTime: '08:00',
    endTime: '17:00',
    meetupPoint: '地铁9号线泗泾站',
    meetupLatitude: 31.1204,
    meetupLongitude: 121.3537,
    distance: 35,
    maxParticipants: 25,
    currentParticipants: 18,
    participants: [
      { id: 'u5', name: '文化骑行者', avatar: 'https://picsum.photos/id/1027/200/200', joinedAt: '2024-06-05T11:00:00Z' },
      { id: 'u4', name: '户外探索者', avatar: 'https://picsum.photos/id/338/200/200', joinedAt: '2024-06-06T09:30:00Z' }
    ],
    difficulty: 'medium',
    pace: 'leisurely',
    organizer: {
      id: 'u5',
      name: '文化骑行者',
      avatar: 'https://picsum.photos/id/1027/200/200'
    },
    announcements: [],
    status: 'upcoming',
    createdAt: '2024-06-01T16:00:00Z'
  },
  {
    id: 'a4',
    title: '周三夜骑常规活动',
    description: '每周三固定夜骑活动，锻炼身体，结识骑友。路线为城市环线，路况良好，全程约20公里。',
    coverImage: 'https://picsum.photos/id/1036/600/400',
    date: '2024-06-12',
    startTime: '20:00',
    endTime: '21:30',
    meetupPoint: '人民广场',
    meetupLatitude: 31.2304,
    meetupLongitude: 121.4737,
    distance: 20,
    maxParticipants: 30,
    currentParticipants: 22,
    participants: [
      { id: 'u3', name: '夜骑一族', avatar: 'https://picsum.photos/id/177/200/200', joinedAt: '2024-06-10T20:00:00Z' },
      { id: 'u6', name: '学生骑士', avatar: 'https://picsum.photos/id/64/200/200', joinedAt: '2024-06-11T18:00:00Z' }
    ],
    difficulty: 'easy',
    pace: 'moderate',
    organizer: {
      id: 'u3',
      name: '夜骑一族',
      avatar: 'https://picsum.photos/id/177/200/200'
    },
    announcements: [
      { id: 'ann4', content: '请务必安装车灯和尾灯，注意安全', createdAt: '2024-06-11T16:00:00Z', creatorId: 'u3', creatorName: '夜骑一族' }
    ],
    status: 'completed',
    createdAt: '2024-06-05T12:00:00Z'
  },
  {
    id: 'a5',
    title: '父亲节亲子骑行活动',
    description: '父亲节特别活动，带上孩子一起骑行，享受亲子时光。路线为公园绿道，安全平缓。',
    coverImage: 'https://picsum.photos/id/1039/600/400',
    date: '2024-06-16',
    startTime: '09:00',
    endTime: '12:00',
    meetupPoint: '世纪公园北门',
    meetupLatitude: 31.2204,
    meetupLongitude: 121.5437,
    distance: 10,
    maxParticipants: 40,
    currentParticipants: 35,
    participants: [],
    difficulty: 'easy',
    pace: 'leisurely',
    organizer: {
      id: 'u4',
      name: '户外探索者',
      avatar: 'https://picsum.photos/id/338/200/200'
    },
    announcements: [],
    status: 'upcoming',
    createdAt: '2024-06-02T10:00:00Z'
  }
];
