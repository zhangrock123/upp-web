import service from '@/service';
import utils from '@/utils';
import { wxPay } from "@/utils/wechatSdk";

export default {
  // 获取未读卡券信息，有卡券则会弹窗提示
  fetchUnreadCouponAction({ commit }) {
    let token = utils.getCookie('_token');
    return new Promise(resolve => {
      if (!token) {
        return resolve();
      }
      service
        .getUnreadCoupon()
        .then(res => {
          if (res.success && res.data.data && res.data.data.coupon_count && res.data.data.coupon_amount) {
            commit('UPDATE_COUPON_INFO', { ...res.data.data });
          }
        }, err => { })
        .finally(resolve);
    });
  },
  // 设置卡券已读状态
  setCouponReadAction({ commit }) {
    let token = utils.getCookie('_token');
    return new Promise(resolve => {
      if (!token) {
        return resolve();
      }
      service
        .setCouponRead()
        .then(res => {
          if (res.success) {
            commit('UPDATE_COUPON_INFO');
          }
        }, err => { })
        .finally(resolve);
    });
  },
  // 获取用户信息
  getUserInfoAction({ commit, state }, isForce) {
    let resData = {};
    return new Promise(resolve => {
      if (!isForce) {
        if (state.userInfo && state.userInfo.id && state.userInfo.token) {
          return resolve(state.userInfo);
        }
      }
      service
        .getUserInfo()
        .then(
          res => {
            if (res.success) {
              resData = res.data.data || {};
              resData.token && commit('UPDATE_USER_INFO', { ...resData });
            }
          },
          err => { }
        )
        .finally(() => {
          resolve(resData);
        });
    });
  },
  // 发起支付
  orderPayAction({ state }, orderId, successCallback, failCallback, errCallback) {
    return new Promise(resolve => {
      if (!orderId) {
        return resolve();
      }
      service
        .orderPay({
          oid: orderId,
          type: utils.getOS().wechat() ? 'JSAPI' : 'MWEB'
        })
        .then(res => {
          if (res.success) {
            if (res.data.data.mwebUrl) {
              //H5支付
              let baseUrl = window.location.href.split('#')[0];
              let backUrl = `${baseUrl}#/order-detail/${res.data.data.orderId}?check=1`;
              window.location.href = `${res.data.data.mwebUrl}&redirect_url=${encodeURIComponent(backUrl)}`;
            } else {
              let baseSettings = {
                params: { id: res.data.data.orderId },
                query: { check: 1 }
              };
              wxPay(
                res.data.data,
                () => {
                  //支付成功,跳转拼团详情页面
                  successCallback && successCallback({ name: !res.data.data.isGroup ? 'orderDetail' : 'groupDetail', ...baseSettings });
                },
                () => {
                  //支付失败,跳转订单详情页面
                  failCallback && failCallback({ name: 'orderDetail', ...baseSettings });
                });
            }
          } else {
            errCallback && errCallback(res.data.errmsg || '未知错误！');
          }
        }, err => {
          errCallback && errCallback(err || '服务器错误！');
        })
        .finally(resolve);
    })
  }
};
