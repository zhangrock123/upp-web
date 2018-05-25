import {
  UPDATE_COUPON_INFO,
  UPDATE_USER_INFO,
  CLEAR_USER_INFO,
  UPDATE_BIND_MOBILE_TYPE,
  UPDATE_TRACK_INFO,
  CLEAR_TRACK_INFO
} from './mutationTypes';

export default {
  [UPDATE_COUPON_INFO](state, value) {
    state.couponInfo = value || null;
  },
  [UPDATE_USER_INFO](state, value = {}) {
    if (!state.userInfo) {
      state.userInfo = {};
    }
    for (let key in value) {
      state.userInfo[key] = value[key];
    }
  },
  [CLEAR_USER_INFO](state) {
    state.userInfo = null;
  },
  [UPDATE_BIND_MOBILE_TYPE](state, value = 0) {
    state.bindMobileType = value;
  },
  [UPDATE_TRACK_INFO](state, value = null) {
    state.trackInfo = value || null;
  },
  [CLEAR_TRACK_INFO](state) {
    state.trackInfo = null;
  }
};
