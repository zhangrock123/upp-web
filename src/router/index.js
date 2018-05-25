import Vue from 'vue';
import Router from 'vue-router';
import baseRouterConfig from './baseRouterConfig';
import routerGuard from './routerGuard';
import { trackPageView } from '@/utils/track';

Vue.use(Router);

let vueRouter = new Router({
  // mode: 'history', // remove '#' of link
  routes: [...baseRouterConfig]
});

vueRouter.beforeEach((to, from, next) => {
  routerGuard(vueRouter, to, from, next);
});

vueRouter.afterEach((to, from, next) => {
  if (window._hmt) {
    let baseUrl = window.location.href.split('#')[0];
    let preUrl = baseUrl.split('/h5/')[1];
    let trackUrl = `/h5/${preUrl}/#${to.fullPath}`;
    trackPageView(trackUrl);
  }
});

export default vueRouter;
