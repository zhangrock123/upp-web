<template>
  <div class="relative">
    <div class="global-app-footer-box">
      <mt-tabbar v-model="selected">
        <mt-tab-item id="index" @click.native="pathTo('/index')">
          <i slot="icon" :class="{'icon-house':selected=='index','icon-house-o':selected!='index'}"></i>
          首页
        </mt-tab-item>
        <mt-tab-item id="group" @click.native="pathTo('/my-group')">
          <i slot="icon" :class="{'icon-order-book':selected=='group','icon-order-book-o':selected!='group'}"></i>
          我的团
        </mt-tab-item>
        <mt-tab-item id="my" @click.native="pathTo('/my')">
          <i slot="icon" :class="{'icon-user':selected=='my','icon-user-o':selected!='my'}"></i>
          个人中心
        </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-footer",
  props: {
    active: {
      type: String,
      default: "index"
    }
  },
  data() {
    const vm = this;
    return {
      selected: vm.active,
      tabMenu: []
    };
  },
  methods: {
    pathTo(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style lang="less" scoped>
.global-app-footer-box {
  height: 50px;
  position: relative;
  overflow: hidden;
}
</style>


