import axios from 'axios';
import qs from 'qs';
import config from '@/config';
import store from '@/store';
import utils from '@/utils';

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = config.apiHost;
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

// POST传参序列化
axios.interceptors.request.use(config => {
  let defaultParam = {};
  if (store.getters.userInfo && store.getters.userInfo.token) {
    defaultParam = {
      _token: store.getters.userInfo.token,
      currentMember: store.getters.userInfo.token
    };
  }
  if (config.method === 'post') {
    config.data = { ...(config.data || {}), ...defaultParam };
    config.data = qs.stringify(config.data);
  } else {
    config.params = { ...(config.params || {}), ...defaultParam };
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 返回状态判断
axios.interceptors.response.use(res => {
  res.success = res.status == 200 && res.data && res.data.code == 'success';
  errorProcessor(res);
  return res;
}, error => {
  return Promise.reject(error);
});

// 根据错误号处理信息
let errorProcessor = (res) => {
  if (!res || res.success || !res.data || !res.data.errcode) {
    return;
  }
  switch (res.data.errcode) {
    case 401:
      store.commit('CLEAR_USER_INFO');
      utils.setCookie("_token", "", null, "-1");
      break;
  }
};

import baseService from './baseService';

export default {
  ...baseService(axios, config)
}
