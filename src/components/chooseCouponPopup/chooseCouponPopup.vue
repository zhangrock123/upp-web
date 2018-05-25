<template>
<mt-popup
    v-model="visible"
    class="full-screen"
    position="bottom"
    :closeOnClickModal="false"
    :modal="false">
  <app-page>
    <app-header title="选择优惠券" hide-left>
      <mt-button @click="visible=false" slot="right">
        关闭
      </mt-button>
    </app-header>
    <template v-if="matchCoupon.length || unmatchCoupon.length">
      <app-body>
        <div class="coupon-list-box marginT-10" v-if="matchCoupon.length">
          <coupon-item is-link action-type="checkbox" :coupon-id="selectedCouponId" @click="setCouponId" :coupon="defaultCoupon"></coupon-item>
          <coupon-item v-for="(coupon, $couponIndex) in matchCoupon" :key="$couponIndex" is-link action-type="checkbox" :coupon-id="selectedCouponId" @click="setCouponId" :coupon="coupon"></coupon-item>
        </div>
        <div class="divider marginBT-10 font-14" v-if="unmatchCoupon.length">不可用优惠券</div>
        <div class="coupon-list-box" v-if="unmatchCoupon.length">
          <coupon-item v-for="(coupon, $couponIndex) in unmatchCoupon" :key="$couponIndex" disabled  :coupon="coupon"></coupon-item>
        </div>
      </app-body>
      <app-box v-if="matchCoupon.length" class="padding-10 bg-white">
        <mt-button @click="confirmUse" size="small" type="danger" class="full-width"><span class="font-16">确认</span></mt-button>
      </app-box>
    </template>
    <app-body v-else>
      <no-data-box type="coupon"></no-data-box>
    </app-body>
  </app-page>
</mt-popup>

</template>

<script>
import {
  appPage,
  appHeader,
  appBox,
  appBody,
  CouponItem,
  NoDataBox
} from "@/components";
import { trackEvent } from "@/utils/track";

export default {
  props: {
    matchCoupon: {
      default() {
        return [];
      },
      type: Array
    },
    unmatchCoupon: {
      default() {
        return [];
      },
      type: Array
    },
    couponId: {
      required: true
    }
  },
  components: {
    CouponItem,
    NoDataBox,
    appPage,
    appHeader,
    appBox,
    appBody
  },
  data() {
    return {
      visible: false,
      selectedCouponId: this.couponId,
      defaultCoupon: {
        id: 0,
        name: "有钱任性不使用优惠券",
        end_time: ""
      }
    };
  },
  methods: {
    // 显示
    showPopup(couponId) {
      trackEvent(`${this.$route.name}`, "click", "choose-coupon");
      this.setCouponId(couponId);
      this.visible = true;
    },
    // 设置卡券id
    setCouponId(id) {
      this.selectedCouponId = id;
    },
    // 立即使用
    confirmUse() {
      this.visible = false;
      this.$emit("change", this.selectedCouponId);
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.coupon-list-box {
  padding: 0 15px;
}
</style>


