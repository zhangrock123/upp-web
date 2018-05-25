<template>
  <div class="global-app-body">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "app-body"
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
</style>


