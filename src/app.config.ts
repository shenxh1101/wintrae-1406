export default defineAppConfig({
  pages: [
    'pages/trip/index',
    'pages/gear/index',
    'pages/camp/index',
    'pages/crew/index',
    'pages/review/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2D6A4F',
    navigationBarTitleText: '露营行程',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F5F0'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#2D6A4F',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/trip/index',
        text: '行程'
      },
      {
        pagePath: 'pages/gear/index',
        text: '物资'
      },
      {
        pagePath: 'pages/camp/index',
        text: '营地'
      },
      {
        pagePath: 'pages/crew/index',
        text: '同行'
      },
      {
        pagePath: 'pages/review/index',
        text: '复盘'
      }
    ]
  }
})
