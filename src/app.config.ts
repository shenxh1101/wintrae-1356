export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/routes/index',
    'pages/record/index',
    'pages/activities/index',
    'pages/profile/index',
    'pages/route-detail/index',
    'pages/ride-result/index',
    'pages/activity-detail/index',
    'pages/create-activity/index',
    'pages/equipment/index',
    'pages/plan-route/index',
    'pages/privacy/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '骑行圈',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f8fafc'
  },
  tabBar: {
    color: '#94a3b8',
    selectedColor: '#07c160',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/routes/index',
        text: '路线库'
      },
      {
        pagePath: 'pages/record/index',
        text: '记录'
      },
      {
        pagePath: 'pages/activities/index',
        text: '活动'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
