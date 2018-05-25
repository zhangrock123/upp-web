<template>
  <div class="global-app-box">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "app-box"
};
</script>

<style lang="less" scoped>
.global-app-box {
  display: block;
  position: relative;
}
</style>


