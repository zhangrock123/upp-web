// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import FastClick from 'fastclick';
import * as filters from './filters';
import ComponentsInstallation from './components-installation';
ComponentsInstallation();

import VuePreview from 'vue2-preview'
Vue.use(VuePreview)
// require('./utils/rem')
import 'mint-ui/lib/style.css';
import './assets/styles/index.less';

FastClick.attach(document.body);


Vue.config.productionTip = false;

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

// 引入px与rem的换算
(function () {
  window.onresize = infinite;
  var html = document.documentElement;
  function infinite() {
    var htmlWidth = html.clientWidth;
    if (htmlWidth <= 320) {
      html.style.fontSize = 12 + 'px';
    } else if (htmlWidth >= 720) {
      html.style.fontSize = 28.8 + 'px';
    } else {
      html.style.fontSize = 28.8 / 720 * htmlWidth + "px";
    }
  }
  infinite();
})();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  data: {
    imagePreview: null,
    isWechat: false,
    shareMsg: null
  },
  methods: {
  },
  template: '<App/>'
});
