import type { UserProfile, Equipment } from '../types/user';

export const mockUserProfile: UserProfile = {
  id: 'u1',
  name: '骑行达人小王',
  avatar: 'https://picsum.photos/id/64/200/200',
  bio: '热爱骑行，享受在路上的感觉 | 公路车爱好者',
  location: '上海市',
  totalDistance: 1256.8,
  totalRides: 68,
  totalDuration: 218400,
  totalElevation: 8520,
  joinedAt: '2023-03-15T00:00:00Z',
  level: 8,
  badges: ['首骑勋章', '百公里骑士', '月度冠军', '爬坡达人']
};

export const mockEquipments: Equipment[] = [
  {
    id: 'e1',
    name: 'TCR Advanced Pro',
    type: 'bike',
    brand: 'Giant',
    model: 'TCR Advanced Pro 2024',
    totalDistance: 2856.5,
    lastMaintenance: '2024-05-15',
    nextMaintenance: '2024-06-25',
    maintenanceInterval: 500,
    purchaseDate: '2023-06-01',
    notes: '碳架公路车，日常训练主力'
  },
  {
    id: 'e2',
    name: 'Escape 1',
    type: 'bike',
    brand: 'Giant',
    model: 'Escape 1 2023',
    totalDistance: 1203.2,
    lastMaintenance: '2024-04-20',
    nextMaintenance: '2024-07-20',
    maintenanceInterval: 500,
    purchaseDate: '2023-02-15',
    notes: '平把公路车，通勤休闲骑'
  },
  {
    id: 'e3',
    name: 'MET Trenta 头盔',
    type: 'helmet',
    brand: 'MET',
    model: 'Trenta 3K Carbon',
    totalDistance: 2856.5,
    lastMaintenance: '2024-05-01',
    nextMaintenance: '2025-05-01',
    maintenanceInterval: 365,
    purchaseDate: '2023-06-10',
    notes: '轻量气动头盔'
  },
  {
    id: 'e4',
    name: 'RC7 骑行鞋',
    type: 'shoes',
    brand: 'Shimano',
    model: 'RC702',
    totalDistance: 2100.8,
    lastMaintenance: '2024-05-10',
    nextMaintenance: '2024-12-10',
    maintenanceInterval: 180,
    purchaseDate: '2023-08-20',
    notes: '碳底公路锁鞋'
  }
];
