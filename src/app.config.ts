export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/user/index',
    'pages/user/personaldata/personaldata',
    'pages/plant/index',
    'pages/article/index',
    'pages/discover/find',
    'pages/shop/shop',
    'pages/shopcar/shopcar',
    'pages/shopcar2/shopcar2',
    'pages/goodsdetail/gooddetail',
    'pages/orderlist/order',
    'pages/orderdetail/orderdetail',
    'pages/test/test',
    'pages/yhrecord/record',
    'pages/yhballs/balls',
    'pages/ytrees/mytree',
    'pages/yhach/achieve',
    'pages/subscribe/sub',
    'pages/yysubscribe/mysub',
    'pages/confirmorder/confirmorder',
    'pages/plantadd/plantadd',
    'pages/waitpay/waitpay',
    'pages/gpwaitpay/gpwaitpay',
    'pages/paysuccess/paysuccess',
    'pages/grouppayconfirmorder/gpconfirmorder',
    'pages/memberorder/memberorder',
    'pages/memberorder/memorderdetail/memorderdetail',
    'pages/memberorder/memorderdetail/ticketdetail/ticketdetail',
    'pages/memberorder/memorderdetail/applyforbackprice/applyforbackprice',
    'pages/memberorder/memorderdetail/backpricedetail/backpricedetail',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#51B897',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    "color": "#51b897",
    "selectedColor": "#07ad67",
    "backgroundColor": "#ffffff",
    "borderStyle": "white",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "assets/home-outline.png",
        "selectedIconPath": "assets/home.png",
      },
      {
        "pagePath": "pages/shop/shop",
        "text": "商城",
        "iconPath": "assets/icons/storefront-outline.png",
        "selectedIconPath": "assets/icons/storefront.png"
      },
      {
        "pagePath": "pages/plant/index",
        "text": "种树",
        "iconPath": "assets/leaf-outline.png",
        "selectedIconPath": "assets/leaf.png"
      },
      {
        "pagePath": "pages/shopcar/shopcar",
        "text": "购物车",
        "iconPath": "assets/icons/cart-outline.png",
        "selectedIconPath": "assets/icons/cart.png"
      },
      {
        "pagePath": "pages/user/index",
        "text": "我的",
        "iconPath": "assets/person-circle-outline.png",
        "selectedIconPath": "assets/person-circle.png"
      }
    ]
  }
})
