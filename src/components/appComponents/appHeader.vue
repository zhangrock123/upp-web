<template>
  <div class="app-header app-flex app-flex-center">
    <div class="app-header-left">
      <slot name="left" v-if="!hideLeft">
        <mt-button @click="pageBack">
          <i class="backIcon icon-angle-left"></i>
        </mt-button>
      </slot>
    </div>
    <div class="app-header-title col-1">
      {{title}}
    </div>
    <div class="app-header-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-header",
  props: {
    title: {
      type: String,
      default: ""
    },
    hideLeft: {
      type: Boolean
    },
    leftFn: {
      type: Function
    },
    // 是否强制回到首页
    isForceIndex: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    pageBack() {
      if (this.leftFn) {
        return this.leftFn();
      }
      if (this.isForceIndex) {
        this.$router.push("/");
      } else {
        if (window.history.length <= 1) {
          this.$router.push("/");
        } else {
          this.$router.go(-1);
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.app-header {
  height: 50px;
  background-color: #fff;
  color: #333;
  -webkit-box-shadow: 0 0 5px #dfdfdf;
  box-shadow: 0 0 5px #dfdfdf;
  border-bottom: 0.04rem solid #dfdfdf;
  font-size: 14px;
  line-height: 1;
  padding: 0 10px;
  position: relative;
  text-align: center;
  white-space: nowrap;
  .app-header-left {
    padding-left: 10px;
    text-align: left;
    .mint-button {
      text-align: left;
    }
  }
  .app-header-right {
    padding-right: 10px;
    text-align: right;
    .mint-button {
      text-align: right;
    }
  }
  .app-header-left,
  .app-header-right {
    min-width: 60px;
    .mint-button {
      width: 100%;
      background-color: transparent;
      border: 0;
      -webkit-box-shadow: none;
      box-shadow: none;
      color: inherit;
      display: inline-block;
      padding: 0;
      font-size: inherit;
      i {
        font-size: 24px;
        vertical-align: middle;
        &.drawerIcon {
          font-size: 22px;
        }
        &.backIcon {
          font-size: 32px;
          color: #808080;
        }
      }
    }
  }
  .app-header-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: inherit;
    font-weight: 400;
    font-size: 18px;
    text-align: center;
  }
}
</style>


