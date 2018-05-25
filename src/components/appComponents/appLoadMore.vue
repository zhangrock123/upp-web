<template>
  <div
    class="global-app-body"
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="moreLoading"
    :infinite-scroll-distance="scrollDistance"
    :infinite-scroll-immediate-check="immediateCheck">
    <slot></slot>
    <div class="global-loading-footer" v-show="!isEmpty">
      <div class="text-center color-gray" v-show="moreLoading&&!allLoaded">
        <mt-spinner type="fading-circle" color="#ddd" :size="20"></mt-spinner>
        <span class="font-14">加载中...</span>
      </div>
      <div class="divider" v-show="allLoaded"><span class="color-gray">已全部加载</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-load-more",
  props: {
    scrollDistance: {
      type: Number,
      default: 10
    },
    method: {
      type: Function,
      default() {
        return new Promise(resolve => {
          resolve();
        });
      }
    },
    isEmpty:{
      type: Boolean,
      default: false
    },
    allLoaded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      moreLoading: false,
      immediateCheck: !true
    };
  },
  methods: {
    loadMore() {
      if (this.allLoaded) {
        this.moreLoading = false;
        return;
      }
      if (this.moreLoading) {
        return;
      }
      this.moreLoading = true;
      this.method().then(() => {
        this.moreLoading = false;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.global-app-body {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  -moz-flex: 1;
  -ms-flex: 1;
  flex: 1;
  overflow: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  position: relative;
}
.global-loading-footer {
  margin-bottom: 15px;
}
</style>


