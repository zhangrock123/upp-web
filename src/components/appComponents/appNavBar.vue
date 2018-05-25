<template>
  <div class="swipe-nav-box bg-white">
    <ul class="swipe-nav ">
      <li  v-for="(nav, $navIndex) in src" :key="$navIndex" :class="{'active': nav.type == activeType}">
        <a href="javascript:;" @click="setNav(nav.type)">{{nav.title}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "app-nav-bar",
  props: {
    src: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      required: true,
      type: String
    }
  },
  watch: {
    activeType(v) {
      this.$emit("input", v);
      this.$emit("change");
    }
  },
  data() {
    return {
      activeType: this.value
    };
  },
  methods: {
    setNav(type) {
      this.activeType = type;
    }
  }
};
</script>

<style lang="less" scoped>
.swipe-nav-box {
  white-space: nowrap;
  overflow: hidden;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  border-bottom: 0.04rem solid #ccc;
  &::-webkit-scrollbar {
    display: none;
  }
  .swipe-nav {
    font-size: 0;
    > li {
      box-sizing: border-box;
      display: inline-block;
      position: relative;
      &.active {
        &:after {
          content: "";
          display: block;
          width: 100%;
          height: 0.08rem;
          position: absolute;
          left: 0;
          bottom: 0;
          background-color: #f95959;
        }
        a {
          box-sizing: border-box;
          color: #f95959;
          font-weight: 400;
        }
      }
      > a {
        display: inherit;
        padding: 17px 15px;
        min-width: 66px;
        text-align: center;
        text-decoration: none;
        color: #808080;
        font-size: 15px;
      }
    }
  }
}
</style>


