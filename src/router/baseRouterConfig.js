const INDEX = r => require.ensure([], () => r(require('@/pages/index.vue')), 'index');
const GOODS_DETAIL = r => require.ensure([], () => r(require('@/pages/goodsDetail.vue')), 'goodsDetail');
const ORDER_CHECK = r => require.ensure([], () => r(require('@/pages/orderCheck.vue')), 'orderCheck');
const MY = r => require.ensure([], () => r(require('@/pages/my.vue')), 'my');
const MY_COUPON = r => require.ensure([], () => r(require('@/pages/myCoupon.vue')), 'myCoupon');
// const MY_PHONE = r => require.ensure([], () => r(require('@/pages/myPhone.vue')), 'myPhone');
const MY_ORDER = r => require.ensure([], () => r(require('@/pages/myOrder.vue')), 'myOrder');
const ORDER_DETAIL = r => require.ensure([], () => r(require('@/pages/orderDetail.vue')), 'orderDetail');
const MY_GROUP = r => require.ensure([], () => r(require('@/pages/myGroup.vue')), 'myGroup');
const GROUP_DETAIL = r => require.ensure([], () => r(require('@/pages/groupDetail.vue')), 'groupDetail');
const MY_COLLECTION = r => require.ensure([], () => r(require('@/pages/myCollection.vue')), 'myCollection');
const LOGIN = r => require.ensure([], () => r(require('@/pages/login.vue')), 'login');

export default [
  // 缺省页面重定向主页面
  {
    path: '/',
    redirect: { name: 'index' }
  },
  // 主页面
  {
    path: '/index',
    name: 'index',
    meta: {
      auth: false,
      title: '首页',
      template: ''
    },
    component: INDEX
  },
  {
    path: '/goods-detail/:id',
    name: 'goodsDetail',
    meta: {
      auth: false,
      title: '商品详情',
      template: ''
    },
    component: GOODS_DETAIL
  },
  {
    path: '/order-check/:id',
    name: 'orderCheck',
    meta: {
      auth: true,
      title: '订单确认',
      template: ''
    },
    component: ORDER_CHECK
  },
  {
    path: '/my',
    name: 'my',
    meta: {
      auth: true,
      title: '个人中心',
      template: ''
    },
    component: MY
  },
  {
    path: '/my-coupon',
    name: 'myCoupon',
    meta: {
      auth: true,
      title: '我的优惠券',
      template: ''
    },
    component: MY_COUPON
  },
  // 用弹框实现了 ->  bindMobilePopup
  // {
  //   path: '/my-phone',
  //   name: 'myPhone',
  //   meta: {
  //     auth: true,
  //     title: '修改手机号',
  //     template: ''
  //   },
  //   component: MY_PHONE
  // },
  {
    path: '/my-order',
    name: 'myOrder',
    meta: {
      auth: true,
      title: '我的订单',
      template: ''
    },
    component: MY_ORDER
  },
  {
    path: '/order-detail/:id',
    name: 'orderDetail',
    meta: {
      auth: true,
      title: '订单详情',
      template: ''
    },
    component: ORDER_DETAIL
  },
  {
    path: '/my-group',
    name: 'myGroup',
    meta: {
      auth: true,
      title: '我的团',
      template: ''
    },
    component: MY_GROUP
  },
  {
    path: '/my-collection',
    name: 'myCollection',
    meta: {
      auth: true,
      title: '我的收藏',
      template: ''
    },
    component: MY_COLLECTION
  },
  {
    path: '/group-detail/:id',
    name: 'groupDetail',
    meta: {
      auth: false,
      title: '拼团详情',
      template: ''
    },
    component: GROUP_DETAIL
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      auth: false,
      title: '登录椰子来了',
      template: ''
    },
    component: LOGIN
  }
];
