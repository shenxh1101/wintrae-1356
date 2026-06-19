import type { Route } from '../types/route';

export const mockRoutes: Route[] = [
  {
    id: '1',
    name: '滨江绿道经典线',
    description: '沿着滨江绿道骑行，欣赏江景，路况平坦，适合休闲骑行。',
    distance: 15200,
    duration: 5400,
    elevation: 45,
    difficulty: 'easy',
    scenery: 'riverside',
    coverImage: 'https://picsum.photos/id/1015/600/400',
    startPoint: { latitude: 31.2304, longitude: 121.4737 },
    endPoint: { latitude: 31.2504, longitude: 121.5037 },
    points: [
      { latitude: 31.2304, longitude: 121.4737 },
      { latitude: 31.2350, longitude: 121.4800 },
      { latitude: 31.2400, longitude: 121.4850 },
      { latitude: 31.2450, longitude: 121.4950 },
      { latitude: 31.2504, longitude: 121.5037 }
    ],
    supplyPoints: [
      { id: 's1', name: '滨江饮水站', type: 'water', latitude: 31.2350, longitude: 121.4800, description: '免费直饮水' },
      { id: 's2', name: '河畔咖啡馆', type: 'food', latitude: 31.2400, longitude: 121.4850, description: '咖啡和简餐' }
    ],
    dangerSections: [
      { id: 'd1', type: 'traffic', latitude: 31.2380, longitude: 121.4830, description: '十字路口车流量大' }
    ],
    likes: 328,
    isFavorite: false,
    creator: {
      id: 'u1',
      name: '骑行达人小王',
      avatar: 'https://picsum.photos/id/64/200/200'
    },
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: '佘山爬坡挑战',
    description: '挑战佘山爬坡路线，适合有一定基础的骑行爱好者，山顶风景绝佳。',
    distance: 28500,
    duration: 7200,
    elevation: 320,
    difficulty: 'hard',
    scenery: 'mountain',
    coverImage: 'https://picsum.photos/id/1018/600/400',
    startPoint: { latitude: 31.0954, longitude: 121.1937 },
    endPoint: { latitude: 31.0954, longitude: 121.1937 },
    points: [
      { latitude: 31.0954, longitude: 121.1937 },
      { latitude: 31.1050, longitude: 121.2000 },
      { latitude: 31.1100, longitude: 121.2050 },
      { latitude: 31.1050, longitude: 121.2100 },
      { latitude: 31.0954, longitude: 121.1937 }
    ],
    supplyPoints: [
      { id: 's3', name: '山脚便利店', type: 'food', latitude: 31.0954, longitude: 121.1937, description: '补给饮料零食' }
    ],
    dangerSections: [
      { id: 'd2', type: 'steep', latitude: 31.1050, longitude: 121.2050, description: '坡度约12%，注意安全' },
      { id: 'd3', type: 'pothole', latitude: 31.1000, longitude: 121.2000, description: '部分路段有坑洼' }
    ],
    likes: 512,
    isFavorite: true,
    creator: {
      id: 'u2',
      name: '爬坡爱好者',
      avatar: 'https://picsum.photos/id/91/200/200'
    },
    createdAt: '2024-02-20T14:00:00Z'
  },
  {
    id: '3',
    name: '城市夜骑环线',
    description: '夜晚城市骑行，欣赏城市夜景，路况良好，适合夜骑爱好者。',
    distance: 20000,
    duration: 4800,
    elevation: 30,
    difficulty: 'easy',
    scenery: 'urban',
    coverImage: 'https://picsum.photos/id/1036/600/400',
    startPoint: { latitude: 31.2304, longitude: 121.4737 },
    endPoint: { latitude: 31.2304, longitude: 121.4737 },
    points: [
      { latitude: 31.2304, longitude: 121.4737 },
      { latitude: 31.2350, longitude: 121.4850 },
      { latitude: 31.2400, longitude: 121.4900 },
      { latitude: 31.2350, longitude: 121.5000 },
      { latitude: 31.2304, longitude: 121.4737 }
    ],
    supplyPoints: [
      { id: 's4', name: '24小时便利店', type: 'water', latitude: 31.2350, longitude: 121.4850, description: '全天候营业' }
    ],
    dangerSections: [
      { id: 'd4', type: 'traffic', latitude: 31.2380, longitude: 121.4880, description: '夜间注意行车安全' }
    ],
    likes: 256,
    isFavorite: false,
    creator: {
      id: 'u3',
      name: '夜骑一族',
      avatar: 'https://picsum.photos/id/177/200/200'
    },
    createdAt: '2024-03-10T20:00:00Z'
  },
  {
    id: '4',
    name: '郊野公园休闲骑',
    description: '穿越郊野公园，呼吸新鲜空气，路况平缓，适合周末全家出游。',
    distance: 12000,
    duration: 3600,
    elevation: 20,
    difficulty: 'easy',
    scenery: 'nature',
    coverImage: 'https://picsum.photos/id/1039/600/400',
    startPoint: { latitude: 31.1504, longitude: 121.4037 },
    endPoint: { latitude: 31.1504, longitude: 121.4037 },
    points: [
      { latitude: 31.1504, longitude: 121.4037 },
      { latitude: 31.1550, longitude: 121.4100 },
      { latitude: 31.1600, longitude: 121.4150 },
      { latitude: 31.1550, longitude: 121.4200 },
      { latitude: 31.1504, longitude: 121.4037 }
    ],
    supplyPoints: [
      { id: 's5', name: '公园休息亭', type: 'rest', latitude: 31.1550, longitude: 121.4100, description: '长椅和遮阳棚' },
      { id: 's6', name: '公园餐厅', type: 'food', latitude: 31.1600, longitude: 121.4150, description: '特色农家菜' }
    ],
    dangerSections: [],
    likes: 189,
    isFavorite: true,
    creator: {
      id: 'u4',
      name: '户外探索者',
      avatar: 'https://picsum.photos/id/338/200/200'
    },
    createdAt: '2024-03-25T09:00:00Z'
  },
  {
    id: '5',
    name: '古镇文化骑行',
    description: '探访江南古镇，感受历史文化，路线经过多个古镇景点。',
    distance: 35000,
    duration: 9000,
    elevation: 80,
    difficulty: 'medium',
    scenery: 'nature',
    coverImage: 'https://picsum.photos/id/1044/600/400',
    startPoint: { latitude: 31.1204, longitude: 121.3537 },
    endPoint: { latitude: 31.1204, longitude: 121.3537 },
    points: [
      { latitude: 31.1204, longitude: 121.3537 },
      { latitude: 31.1300, longitude: 121.3600 },
      { latitude: 31.1400, longitude: 121.3700 },
      { latitude: 31.1350, longitude: 121.3800 },
      { latitude: 31.1204, longitude: 121.3537 }
    ],
    supplyPoints: [
      { id: 's7', name: '古镇茶馆', type: 'food', latitude: 31.1300, longitude: 121.3600, description: '品茶休息' },
      { id: 's8', name: '骑行驿站', type: 'repair', latitude: 31.1400, longitude: 121.3700, description: '简易维修工具' }
    ],
    dangerSections: [
      { id: 'd5', type: 'construction', latitude: 31.1350, longitude: 121.3750, description: '部分路段施工，请绕行' }
    ],
    likes: 423,
    isFavorite: false,
    creator: {
      id: 'u5',
      name: '文化骑行者',
      avatar: 'https://picsum.photos/id/1027/200/200'
    },
    createdAt: '2024-04-05T08:30:00Z'
  },
  {
    id: '6',
    name: '大学城青春线',
    description: '经过多所大学，感受青春气息，路况好，适合学生党和年轻骑行者。',
    distance: 18000,
    duration: 4200,
    elevation: 25,
    difficulty: 'easy',
    scenery: 'urban',
    coverImage: 'https://picsum.photos/id/3/600/400',
    startPoint: { latitude: 31.2904, longitude: 121.5037 },
    endPoint: { latitude: 31.2904, longitude: 121.5037 },
    points: [
      { latitude: 31.2904, longitude: 121.5037 },
      { latitude: 31.2950, longitude: 121.5100 },
      { latitude: 31.3000, longitude: 121.5150 },
      { latitude: 31.2950, longitude: 121.5200 },
      { latitude: 31.2904, longitude: 121.5037 }
    ],
    supplyPoints: [
      { id: 's9', name: '校园超市', type: 'water', latitude: 31.2950, longitude: 121.5100, description: '饮料零食' }
    ],
    dangerSections: [],
    likes: 167,
    isFavorite: false,
    creator: {
      id: 'u6',
      name: '学生骑士',
      avatar: 'https://picsum.photos/id/64/200/200'
    },
    createdAt: '2024-04-15T16:00:00Z'
  },
  {
    id: '7',
    name: '滨江大道竞速',
    description: '平坦的滨江大道，适合竞速训练，风阻小，速度快。',
    distance: 25000,
    duration: 4500,
    elevation: 15,
    difficulty: 'medium',
    scenery: 'riverside',
    coverImage: 'https://picsum.photos/id/1015/600/400',
    startPoint: { latitude: 31.2004, longitude: 121.5237 },
    endPoint: { latitude: 31.2004, longitude: 121.5237 },
    points: [
      { latitude: 31.2004, longitude: 121.5237 },
      { latitude: 31.2100, longitude: 121.5300 },
      { latitude: 31.2200, longitude: 121.5400 },
      { latitude: 31.2100, longitude: 121.5500 },
      { latitude: 31.2004, longitude: 121.5237 }
    ],
    supplyPoints: [
      { id: 's10', name: '运动补给站', type: 'food', latitude: 31.2100, longitude: 121.5300, description: '运动饮料和能量棒' }
    ],
    dangerSections: [
      { id: 'd6', type: 'traffic', latitude: 31.2150, longitude: 121.5350, description: '注意避让行人' }
    ],
    likes: 298,
    isFavorite: false,
    creator: {
      id: 'u7',
      name: '速度狂人',
      avatar: 'https://picsum.photos/id/91/200/200'
    },
    createdAt: '2024-05-01T07:00:00Z'
  },
  {
    id: '8',
    name: '森林公园穿越',
    description: '穿越森林公园，享受大自然，部分路段为土路，建议使用宽胎。',
    distance: 22000,
    duration: 6600,
    elevation: 120,
    difficulty: 'medium',
    scenery: 'nature',
    coverImage: 'https://picsum.photos/id/1018/600/400',
    startPoint: { latitude: 31.3504, longitude: 121.4537 },
    endPoint: { latitude: 31.3504, longitude: 121.4537 },
    points: [
      { latitude: 31.3504, longitude: 121.4537 },
      { latitude: 31.3600, longitude: 121.4600 },
      { latitude: 31.3700, longitude: 121.4700 },
      { latitude: 31.3650, longitude: 121.4800 },
      { latitude: 31.3504, longitude: 121.4537 }
    ],
    supplyPoints: [
      { id: 's11', name: '南门小卖部', type: 'water', latitude: 31.3504, longitude: 121.4537, description: '补给点' }
    ],
    dangerSections: [
      { id: 'd7', type: 'pothole', latitude: 31.3650, longitude: 121.4700, description: '土路不平，注意安全' }
    ],
    likes: 234,
    isFavorite: false,
    creator: {
      id: 'u8',
      name: '山林探险家',
      avatar: 'https://picsum.photos/id/177/200/200'
    },
    createdAt: '2024-05-20T06:30:00Z'
  }
];
