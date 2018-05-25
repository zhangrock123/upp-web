<template>
  <div class="global-app-page-box">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "app-page"
};
</script>

<style lang="less" scoped>
.global-app-page-box {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-flow: row;
  -ms-flex-flow: row;
  flex-flow: row;
  width: 100%;
  height: 100%;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  overflow: hidden;
  background-color: #f7f6f5;
}
</style>


