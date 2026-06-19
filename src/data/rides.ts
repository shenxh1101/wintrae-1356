import type { RideRecord, MonthlyStats } from '../types/ride';

export const mockRides: RideRecord[] = [
  {
    id: 'r1',
    title: '晨骑滨江绿道',
    distance: 15600,
    duration: 3240,
    avgSpeed: 17.3,
    maxSpeed: 28.5,
    elevation: 42,
    calories: 485,
    points: [
      { latitude: 31.2304, longitude: 121.4737, timestamp: 1717213200000, speed: 0, altitude: 5 },
      { latitude: 31.2350, longitude: 121.4800, timestamp: 1717214100000, speed: 18.2, altitude: 8 },
      { latitude: 31.2400, longitude: 121.4850, timestamp: 1717215000000, speed: 20.1, altitude: 12 },
      { latitude: 31.2450, longitude: 121.4950, timestamp: 1717215900000, speed: 22.5, altitude: 15 },
      { latitude: 31.2504, longitude: 121.5037, timestamp: 1717216800000, speed: 15.8, altitude: 10 }
    ],
    startTime: '2024-06-01T06:00:00Z',
    endTime: '2024-06-01T06:54:00Z',
    stopTime: 180,
    routeId: '1',
    routeName: '滨江绿道经典线',
    coverImage: 'https://picsum.photos/id/1015/600/400',
    notes: '今天状态不错，平均速度比上次快了2km/h'
  },
  {
    id: 'r2',
    title: '周末佘山爬坡',
    distance: 28900,
    duration: 6480,
    avgSpeed: 16.1,
    maxSpeed: 35.2,
    elevation: 318,
    calories: 892,
    points: [
      { latitude: 31.0954, longitude: 121.1937, timestamp: 1717372800000, speed: 0, altitude: 5 },
      { latitude: 31.1050, longitude: 121.2000, timestamp: 1717374600000, speed: 12.5, altitude: 45 },
      { latitude: 31.1100, longitude: 121.2050, timestamp: 1717376400000, speed: 8.2, altitude: 98 },
      { latitude: 31.1050, longitude: 121.2100, timestamp: 1717378200000, speed: 30.1, altitude: 65 },
      { latitude: 31.0954, longitude: 121.1937, timestamp: 1717380000000, speed: 18.5, altitude: 10 }
    ],
    startTime: '2024-06-02T08:00:00Z',
    endTime: '2024-06-02T09:48:00Z',
    stopTime: 600,
    routeId: '2',
    routeName: '佘山爬坡挑战',
    coverImage: 'https://picsum.photos/id/1018/600/400',
    notes: '爬坡真的累，但是山顶风景值得'
  },
  {
    id: 'r3',
    title: '夜骑城市环线',
    distance: 19800,
    duration: 4320,
    avgSpeed: 16.5,
    maxSpeed: 25.8,
    elevation: 28,
    calories: 612,
    points: [
      { latitude: 31.2304, longitude: 121.4737, timestamp: 1717482000000, speed: 0, altitude: 5 },
      { latitude: 31.2350, longitude: 121.4850, timestamp: 1717483200000, speed: 15.2, altitude: 8 },
      { latitude: 31.2400, longitude: 121.4900, timestamp: 1717484400000, speed: 18.6, altitude: 12 },
      { latitude: 31.2350, longitude: 121.5000, timestamp: 1717485600000, speed: 20.1, altitude: 10 },
      { latitude: 31.2304, longitude: 121.4737, timestamp: 1717486800000, speed: 16.8, altitude: 5 }
    ],
    startTime: '2024-06-03T21:00:00Z',
    endTime: '2024-06-03T22:12:00Z',
    stopTime: 120,
    routeId: '3',
    routeName: '城市夜骑环线',
    coverImage: 'https://picsum.photos/id/1036/600/400',
    notes: '夜景很美，晚上骑车很舒服'
  },
  {
    id: 'r4',
    title: '郊野公园休闲骑',
    distance: 11500,
    duration: 3480,
    avgSpeed: 11.9,
    maxSpeed: 18.2,
    elevation: 18,
    calories: 356,
    points: [
      { latitude: 31.1504, longitude: 121.4037, timestamp: 1717556400000, speed: 0, altitude: 5 },
      { latitude: 31.1550, longitude: 121.4100, timestamp: 1717557600000, speed: 10.5, altitude: 8 },
      { latitude: 31.1600, longitude: 121.4150, timestamp: 1717558800000, speed: 12.3, altitude: 12 },
      { latitude: 31.1550, longitude: 121.4200, timestamp: 1717560000000, speed: 9.8, altitude: 10 },
      { latitude: 31.1504, longitude: 121.4037, timestamp: 1717561200000, speed: 11.2, altitude: 5 }
    ],
    startTime: '2024-06-08T07:00:00Z',
    endTime: '2024-06-08T07:58:00Z',
    stopTime: 480,
    routeId: '4',
    routeName: '郊野公园休闲骑',
    coverImage: 'https://picsum.photos/id/1039/600/400',
    notes: '带家人一起骑的，走走停停很惬意'
  },
  {
    id: 'r5',
    title: '滨江竞速训练',
    distance: 24800,
    duration: 4200,
    avgSpeed: 21.3,
    maxSpeed: 38.6,
    elevation: 12,
    calories: 756,
    points: [
      { latitude: 31.2004, longitude: 121.5237, timestamp: 1717642800000, speed: 0, altitude: 5 },
      { latitude: 31.2100, longitude: 121.5300, timestamp: 1717644000000, speed: 22.5, altitude: 6 },
      { latitude: 31.2200, longitude: 121.5400, timestamp: 1717645200000, speed: 25.8, altitude: 8 },
      { latitude: 31.2100, longitude: 121.5500, timestamp: 1717646400000, speed: 28.2, altitude: 7 },
      { latitude: 31.2004, longitude: 121.5237, timestamp: 1717647600000, speed: 20.1, altitude: 5 }
    ],
    startTime: '2024-06-09T06:30:00Z',
    endTime: '2024-06-09T07:40:00Z',
    stopTime: 60,
    routeId: '7',
    routeName: '滨江大道竞速',
    coverImage: 'https://picsum.photos/id/1015/600/400',
    notes: '今天状态爆表，刷新了个人最快速度'
  }
];

export const mockMonthlyStats: MonthlyStats = {
  month: '2024-06',
  totalDistance: 100.6,
  totalDuration: 21720,
  totalRides: 5,
  totalElevation: 418,
  avgSpeed: 16.6,
  longestRide: 28.9
};
