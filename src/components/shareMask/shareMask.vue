<template>
  <div class="share-box" v-show="visible">
    <div class="share-mask" @click="hideShare"></div>
    <div class="share-content">
      <div class="share-warpper" :class="{'arrow': arrowVisible}">
        <header class="share-title text-center">{{title}}</header>
        <header class="share-subTitle text-center">{{subTitle}}</header>
      </div>
    </div>
  </div>
</template>
<script>
import utils from "@/utils";
import { trackEvent } from "@/utils/track";

export default {
  data() {
    return {
      visible: false,
      title: "",
      subTitle: "",
      arrowVisible: true
    };
  },
  methods: {
    render(title = "", subTitle = "", shareType = "appMessage") {
      trackEvent(`${this.$route.name}-share`, "click", shareType);
      let defaultSubTitle = "";
      this.title = title;
      if (utils.getOS().wechat()) {
        if ("appMessage" == shareType) {
          defaultSubTitle = "点击右上角，选择［发送给朋友］";
        } else if ("timeline" == shareType) {
          defaultSubTitle = "点击右上角，选择［分享到朋友圈］";
        }
        this.subTitle = subTitle || defaultSubTitle;
        this.arrowVisible = true;
      } else {
        this.subTitle = "请选择浏览器自带的分享功能或用微信打开本页";
        this.arrowVisible = false;
      }
      this.visible = true;
    },
    hideShare() {
      this.visible = false;
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.share-box {
  .share-mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 8000;
    background-color: rgba(0, 0, 0, 0.8);
    transition: all 0.3s ease;
  }
  .share-content {
    position: fixed;
    left: 0;
    top: 160px;
    width: 100%;
    z-index: 8001;
    .share-warpper {
      position: relative;
      margin: 0 30px;
      color: #fff;
      &.arrow:before {
        content: "";
        display: block;
        position: absolute;
        right: 10px;
        top: -140px;
        background-image: url("../../assets/images/share-arrow.png");
        width: 100px;
        background-position: top center;
        height: 140px;
        background-repeat: no-repeat;
        background-size: 100%;
      }
      .share-title {
        font-size: 20px;
        font-weight: 400;
      }
      .share-subTitle {
        margin-top: 10px;
        font-size: 15px;
        color: #eee;
      }
    }
  }
}
</style>
