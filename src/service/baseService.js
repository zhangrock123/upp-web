export default (axios, config) => {
  return {
    // 获取主页商品列表
    goodsList(data = {}) {
      return axios.get('/api/index', { params: data });
    },
    // 商品详情
    goodsDetail(data = {}) {
      return axios.get('/api/goods-detail', { params: data });
    },
    // 收藏／取消收藏商品
    collectGoods(data = {}) {
      return axios.get('/api/collect', { params: data });
    },
    // 商品可用优惠券
    orderCoupon(data = {}) {
      return axios.get('/api/coupon-order', { params: data });
    },
    // 我的团购列表数据
    groupList(data = {}) {
      return axios.get('/api/group-list', { params: data });
    },
    // 团购详情信息
    groupDetail(data = {}) {
      return axios.get('/api/group-detail', { params: data });
    },
    // 我的页面的各个订单数据
    orderCount(data = {}) {
      return axios.get('/api/member', { params: data });
    },
    // 订单列表数据
    orderList(data = {}) {
      return axios.get('/api/orders-list', { params: data });
    },
    // 订单详情数据
    orderDetail(data = {}) {
      return axios.get('/api/orders-detail', { params: data });
    },
    // 订单创建
    orderCreate(data = {}) {
      return axios.get('/api/create-orders', { params: data });
    },
    // 订单创建支付订单
    orderPay(data = {}) {
      return axios.get('/api/wx-pay', { params: data });
    },
    // 收藏列表数据
    collectionList(data = {}) {
      return axios.get('/api/collection', { params: data });
    },
    // 我的优惠券列表数据
    couponList(data = {}) {
      return axios.get('/api/coupon-list', { params: data });
    },
    // 用户修改个人信息(手机号)
    modifyUserData(data = {}) {
      return axios.post('/api/member-modify', data);
    },
    // 获取用户未读卡券信息（用于显示卡券到账弹框）
    getUnreadCoupon(data = {}) {
      return axios.get('/api/coupon-new', { params: data });
    },
    // 设置用户卡券已读（用于显示卡券到账弹框）
    setCouponRead(data = {}) {
      return axios.post('/api/coupon-read', data);
    },
    // 发送验证码
    sendVerificationCode(data = {}) {
      return axios.post('/api/get-code', data);
    },
    // 获取用户信息
    getUserInfo(data = {}) {
      return axios.get('/api/member-detail', { params: data });
    },
    // 用户登录
    userLogin(data = {}) {
      return axios.post('/api/verify-code', data);
    },
    // 获取微信配置信息
    getWechatConfig(data = {}) {
      return axios.get('/api/wechat-config', { params: data });
    }
  };
};
