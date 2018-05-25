import utils from '@/utils';
import service from '@/service';

// 检查是否在微信环境运行
const wechatInit = (callback) => {
  if (!utils.getOS().wechat()) {
    return;
  }
  if (window.wxIsReady) {
    if (callback) {
      callback();
    }
    return;
  }
  if (!window.wx) {
    return;
  }
  let param = {};
  let curLink = window.location.href;
  if (curLink) {
    if (curLink.indexOf('#') != -1) {
      param.url = curLink.split('#')[0];
    } else {
      param.url = curLink;
    }
  } else {
    param.url = window.entryUrl || `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}`;
  }

  service.getWechatConfig(param)
    .then((res) => {
      /* eslint-disable */
      if (!res.success) {
        return;
      }
      var config = res.data || {};
      wx.config({
        debug: false,
        appId: config.appId,
        timestamp: config.timestamp,
        nonceStr: config.nonceStr,
        signature: config.signature,
        jsApiList: [
          'getLocation',
          'previewImage',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'chooseWXPay'
        ],
      });

      wx.ready(() => {
        window.wxIsReady = true;
        callback && callback();
      });

      wx.error((err) => {
        window.wxIsReady = false;
      });
      /* eslint-enable */
    });
};

// 从浏览器获取地理位置
const getLocationFromBOM = (success, fail) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((data) => {
      success(data.coords);
    }, (error) => {
      /* eslint-disable */
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log('用户拒绝位置请求.');
          break;
        case error.POSITION_UNAVAILABLE:
          console.log('地理位置不可用.');
          break;
        case error.TIMEOUT:
          console.log('请求地理位置超时.');
          break;
        case error.UNKNOWN_ERROR:
          console.log('未知错误.');
          break;
        default:
          console.log('未知错误.');
      }
      /* eslint-enable */
      fail('获取地理位置失败！');
    }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 * 60 });
  }
};

// 调用微信sdk获取位置信息，失败则用浏览器获取位置
const getCoords = (success, fail) => {
  if (utils.getOS().wechat()) {
    wechatInit(() => {
      /* eslint-disable */
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success(data) {
          success && success(data.res || data);
        },
        fail(err) {
          fail && fail('error');
        },
      });
      /* eslint-enable */
    });
  } else {
    getLocationFromBOM(success, fail);
  }
};

// 分享给朋友
const shareAppMessage = (settings, success, cancel) => {
  if (!utils.getOS().wechat()) {
    return;
  }
  wechatInit(() => {
    /* eslint-disable */
    wx.onMenuShareAppMessage({
      ...settings,
      success,
      cancel
    });
    /* eslint-enable */
  });
};

// 分享到朋友圈
const shareTimeline = (settings, success, cancel) => {
  if (!utils.getOS().wechat()) {
    return;
  }
  wechatInit(() => {
    /* eslint-disable */
    wx.onMenuShareTimeline({
      ...settings,
      success,
      cancel
    });
    /* eslint-enable */
  });
};

// 微信支付
const wxPay = (params, success, fail) => {
  // 服务器创建完订单将配置传入
  function onBridgeReady() {
    WeixinJSBridge.invoke('getBrandWCPayRequest', {
      'appId': params.appId,
      'timeStamp': params.timeStamp,
      'nonceStr': params.nonceStr,
      'package': params.package,
      'signType': params.signType,
      'paySign': params.paySign,
    }, function (res) {
      console.log(res.err_msg);
      if (res.err_msg == "get_brand_wcpay_request:ok") {
        success && success();
      } else {
        fail && fail();
      }
    });
  }
  if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
  } else {
    onBridgeReady();
  }
};

export {
  wechatInit,
  getCoords,
  getLocationFromBOM,
  wxPay,
  shareAppMessage,
  shareTimeline
};
