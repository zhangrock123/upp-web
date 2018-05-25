import utils from "@/utils";
import store from "@/store";

export default (vueRouter, to, from, next) => {
  document.getElementsByTagName('title')[0].innerHTML = to && to.meta && to.meta.title ? to.meta.title : '椰子来了';
  // return next();
  if (to.meta.auth) {
    let token = utils.getCookie('_token');
    if (!token) {
      if (utils.getOS().wechat()) {
        // 追加来源信息数据
        let trackInfo = store.getters.trackInfo;
        let trackStr = '';
        if (trackInfo) {
          trackStr = `&scene=${encodeURIComponent(trackInfo.scene)}&data=${encodeURIComponent(trackInfo.data)}`;
        }
        // 跳转union授权，并传递来源信息
        window.location.replace(`${window.location.origin}/union?redirect=${encodeURIComponent(to.fullPath)}${trackStr}`);
      } else {
        vueRouter.push({
          name: 'login',
          query: {
            redirect: to.name,
            params: JSON.stringify(to.params),
            query: JSON.stringify(to.query)
          }
        });
      }
    } else {
      next();
    }
  } else {
    next();
  }
};
