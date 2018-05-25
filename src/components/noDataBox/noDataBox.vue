<template>
  <div class="global-no-data-box box-center text-center">
    <img v-if="type == 'coupon'" src="../../assets/images/noDataLabel/label-no-coupon.png" alt="没有优惠券">
    <img v-if="type == 'order'" src="../../assets/images/noDataLabel/label-no-order.png" alt="没有订单">
    <img v-if="type == 'collection'" src="../../assets/images/noDataLabel/label-no-collection.png" alt="没有收藏的商品">
    <img v-if="type == 'group'" src="../../assets/images/noDataLabel/label-no-group.png" alt="没有拼团">
    <div>{{noDataTip}}</div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "coupon"
    }
  },
  computed: {
    // 无数据文案显示
    noDataTip() {
      let tip = {
        coupon: "优惠券",
        order: "订单",
        collection: "收藏的商品",
        group: "拼团"
      }[this.type];
      return `可爱的你还没有${tip}哦~`;
    }
  }
};
</script>

<style lang="less" scoped>
.global-no-data-box {
  width: 100%;
  img {
    width: 60%;
  }
  div {
    color: #bfbfbf;
    font-size: 16px;
    margin-top: 15px;
    margin-bottom: 40px;
  }
}
</style>
