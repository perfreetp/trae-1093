export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/map/index',
    'pages/booking/index',
    'pages/order/index',
    'pages/mine/index',
    'pages/parking-detail/index',
    'pages/booking-confirm/index',
    'pages/payment/index',
    'pages/coupons/index',
    'pages/vehicle/index',
    'pages/monthly-card/index',
    'pages/feedback/index',
    'pages/invoice/index',
    'pages/find-car/index',
    'pages/arrears/index',
    'pages/favorites/index',
    'pages/scan-entry/index',
    'pages/navigation/index',
    'pages/vehicle-edit/index',
    'pages/invoice-edit/index',
    'pages/parking-settle/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1677FF',
    navigationBarTitleText: '智慧停车',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F7FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#1677FF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/map/index',
        text: '地图'
      },
      {
        pagePath: 'pages/booking/index',
        text: '预约'
      },
      {
        pagePath: 'pages/order/index',
        text: '订单'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
