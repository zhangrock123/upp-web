import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

let state = {
  couponInfo: null,
  userInfo: null,
  bindMobileType: 0, // 2 微信环境绑定手机号； 3 更换绑定已有手机号
  trackInfo: null
};

let storeState = store => {
  store.subscribe((mutation) => {
    switch (mutation.type) {
      default:
        break;
    }
  });
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [storeState]
});
