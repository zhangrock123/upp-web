<template>
  <div class="coupon-item-box card-shadow" :class="{'disabled': disabled,'common-link': isLink}" @click="selectCoupon">
    <div class="coupon-item-outer">
      <div class="coupon-item-inner">
        <div class="app-flex app-flex-center app-flex-full">
          <div v-if="coupon.id" class="coupon-price">
            <span>¥</span>{{coupon.money/100}}
          </div>
          <div class="col-1 coupon-info">
              <div class="coupon-name text-cut">
                {{coupon.name}}
              </div>
              <div class="coupon-expire text-cut" v-if="coupon.id">
                有效期至 {{coupon.end_time | getSplitFirst}}
              </div>
              <div class="coupon-expire text-cut" v-else>
                长期有效
              </div>
          </div>
          <div class="coupon-action">
            <div v-if="actionType=='checkbox'" class="ico-checkbox" :class="{'checked': coupon.id == couponId}">
              <i class="icon-check2 box-center"></i>
            </div>
            <i v-else-if="actionType=='expired'" class="icon-expired-label font-36 color-slight-gray"></i>
            <i v-else-if="actionType=='used'" class="icon-used-label font-36 color-slight-gray"></i>
            <div v-else-if="actionType=='toUse'" class="to-use-btn">
              立即使用
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    coupon: {
      type: Object,
      default() {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    actionType: {
      type: String,
      default: ""
    },
    couponId: {
      default: ""
    },
    isLink: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  data() {
    return {};
  },
  methods: {
    selectCoupon() {
      this.$emit("click", this.coupon.id);
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.coupon-item-box {
  background-color: #fff;
  padding: 4px;
  margin-bottom: 15px;
  // border-radius: 4px;
  &.disabled .coupon-item-outer {
    border: 2px solid #bfbfbf;
    .coupon-item-inner {
      border: 1px solid #dedede;
      .coupon-price,
      .coupon-info .coupon-name,
      .coupon-info .coupon-expire {
        color: #bfbfbf;
      }
    }
  }
  .coupon-item-outer {
    border: 1.5px solid #f95959;
    padding: 4px;
    .coupon-item-inner {
      border: 1px solid #ffc5c5;
      padding: 10px;
      .coupon-price {
        padding: 10px;
        padding-left: 0;
        font-size: 30px;
        color: #f95959;
        font-weight: 300;
        span {
          font-size: 14px;
        }
      }
      .coupon-info {
        border-left: 1px dotted #dedede;
        padding: 10px 0 10px 10px;
        line-height: 1.4;
        &:first-child {
          border-left: 0;
        }
        .coupon-name {
          font-size: 16px;
          color: #333;
          font-weight: 300;
        }
        .coupon-expire {
          font-size: 12px;
          margin-top: 5px;
          color: #808080;
        }
      }
      .coupon-action {
        padding-left: 5px;
      }
    }
  }
}
.ico-checkbox {
  width: 24px;
  height: 24px;
  border: 1px solid #ccc;
  position: relative;
  border-radius: 50%;
  text-align: center;
  i {
    display: none;
  }
  transition: all 0.2s ease-out;
  &.checked {
    border: 1px solid #f95959;
    background-color: #f95959;
    transition: all 0.2s ease-in;
    i {
      display: inline-block;
      color: #fff;
    }
  }
}
.to-use-btn {
  border: 1px solid #f95959;
  color: #f95959;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 14px;
}
</style>


