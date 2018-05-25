<template>
<div class="global-app-page">
  <transition v-if="!$route.meta.template" name="slide-fade" mode="out-in">
      <router-view></router-view>
  </transition>
  <global-coupon-tip></global-coupon-tip>
  <img-preview ref="imgBox"></img-preview>
  <share-mask ref="shareMask"></share-mask>
  <bind-mobile-popup></bind-mobile-popup>
</div>
</template>

<script>
import {
  GlobalCouponTip,
  BindMobilePopup,
  ImgPreview,
  ShareMask
} from "@/components";
import { mapMutations, mapActions } from "vuex";
import utils from "@/utils";
import { wechatInit } from "@/utils/wechatSdk";

export default {
  data() {
    return {};
  },
  computed: {},
  components: {
    GlobalCouponTip,
    BindMobilePopup,
    ImgPreview,
    ShareMask
  },
  methods: {
    ...mapMutations([
      "UPDATE_USER_INFO",
      "UPDATE_TRACK_INFO",
      "UPDATE_BIND_MOBILE_TYPE"
    ]),
    ...mapActions(["fetchUnreadCouponAction"]),
    // 设置token并获取优惠券信息
    setToken() {
      let token = utils.getCookie("_token");
      token && this.UPDATE_USER_INFO({ token });
      this.fetchUnreadCouponAction();
    },
    // root绑定图片预览方法
    setRootImagePreview() {
      this.$root.imagePreview = (idx = 0, srcList = []) => {
        if (!srcList.length) {
          return;
        }
        this.$refs.imgBox.renderImg(idx, srcList);
      };
    },
    // root绑定分享提示
    setRootShareMask() {
      this.$root.shareMsg = (title = "", subTitle = "", msgType = "") => {
        this.$refs.shareMask.render(title, subTitle, msgType);
      };
    },
    // （如果是微信环境）初始化微信sdk
    initWechatSDK() {
      window.entryUrl = window.location.href;
      setTimeout(wechatInit, 500);
    },
    // 记录来源信息
    setTrackInfo() {
      let scene = utils.getQueryString("scene");
      if (!scene) {
        return;
      }
      let data = utils.getQueryString("data");
      this.UPDATE_TRACK_INFO({
        scene,
        data
      });
    }
  },
  mounted() {
    this.$root.isWechat = !!utils.getOS().wechat();
    this.setToken();
    this.setRootImagePreview();
    this.setRootShareMask();
    this.initWechatSDK();
    this.setTrackInfo();
  }
};
</script>
<style lang="less" scoped>
.global-app-page {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>

