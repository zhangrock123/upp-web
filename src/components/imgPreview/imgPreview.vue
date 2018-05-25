<template>
  <div class="global-image-preview-box">
    <img class="preview-img" v-for="(src, $srcIndex) in srcList" :key="$srcIndex" :src="src">
  </div>
</template>
<script>
export default {
  data() {
    return {
      srcList: []
    };
  },
  methods: {
    renderImg(index = 0, srcList = []) {
      // 添加微信环境图片预览支持
      if (typeof window.WeixinJSBridge !== "undefined") {
        return window.WeixinJSBridge.invoke("imagePreview", {
          current: srcList[index],
          urls: srcList
        });
      }
      // 非微信环境读取图片大小信息后加载preview组件预览
      this.initImgList(srcList, imgList => {
        setTimeout(() => {
          this.$preview.open(index, imgList);
        }, 300);
      });
    },
    // 初始化配置图片信息
    initImgList(imgSrcList, callback) {
      let imgList = [];
      if (!imgSrcList || !imgSrcList.length) {
        return;
      }
      (async () => {
        for (let i = 0, len = imgSrcList.length; i < len; i++) {
          imgList.push(await this.getImgSize(imgSrcList[i]));
        }
        this.srcList = imgList;
        callback && callback(imgList);
      })();
    },
    // 获取图片大小
    getImgSize(imgSrc) {
      let initSize = {
        src: imgSrc,
        w: 600,
        h: 600
      };
      return new Promise(resolve => {
        if (!imgSrc) {
          return resolve(initSize);
        }
        let img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          resolve({
            src: imgSrc,
            w: img.width,
            h: img.height
          });
        };
        img.onerror = () => {
          resolve(initSize);
        };
      });
    }
  }
};
</script>

<style lang="less" scoped>
.global-image-preview-box {
  position: fixed;
  left: 50%;
  top: 50%;
  display: block;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>

