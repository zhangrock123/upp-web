<template>
  <div class="btn-space-box">
    <!-- 待付款 -->
    <template v-if="!isGroup && orderData.order_status==1">
      <mt-button @click.native="payOrder" class="mini-size order-pay-btn" type="danger" size="small">立即支付</mt-button>
    </template>
    <!-- 待成团 -->
    <template v-if="!isGroup && orderData.order_status==2">
      <mt-button @click.native="shareFriend" class="mini-size order-repeat-btn" type="danger" size="small">邀请好友</mt-button>
    </template>
    <!-- 订单成功 -->
    <template v-if="!isGroup && orderData.order_status==3">
      <mt-button @click.native="orderAgain" class="mini-size order-repeat-btn" type="danger" size="small" >再来一单</mt-button>
    </template>
    <!-- 团购失败 -->
    <template v-if="!isGroup && orderData.order_status==4">
      <mt-button @click.native="reopenGroup" class="mini-size order-pay-btn" type="danger" size="small">重新开团</mt-button>
    </template>
    <!-- 已取消 -->
    <template v-if="!isGroup && orderData.order_status==5">
      <mt-button @click.native="orderAgain" class="mini-size order-repeat-btn" type="danger" size="small">再来一单</mt-button>
    </template>
    <!-- 已退款 -->
    <template v-if="!isGroup && orderData.order_status==6">
      <mt-button @click.native="orderAgain" class="mini-size order-repeat-btn" type="danger" size="small">再来一单</mt-button>
    </template>
    <template v-if="isGroup">
      <mt-button @click.native="toOrderDetail" class="mini-size order-repeat-btn" type="danger" size="small">查看订单详情</mt-button>
    </template>
    <template v-if="isGroup && orderData.order_status!=1 && orderData.order_status!=5">
      <mt-button @click.native="toGroupDetail" class="mini-size order-repeat-btn" type="danger" size="small">查看团详情</mt-button>
    </template>
  </div>
</template>
<script>
import service from "@/service";
import { mapActions } from "vuex";
import utils from "@/utils";
import { appShareMessage, appShareTimeline } from "@/utils/shareSdk";
import { trackEvent } from "@/utils/track";

export default {
  props: {
    orderData: {
      type: Object,
      default() {
        return {};
      }
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions(["orderPayAction"]),
    // 再来一单
    orderAgain() {
      this.$router.push({
        name: "goodsDetail",
        params: { id: this.orderData.good_id }
      });
    },
    // 重新开团
    reopenGroup() {
      this.$router.push("/");
    },
    // 邀请好友
    shareFriend() {
      let vm = this;
      if (vm.orderData.is_group == 1) {
        this.$root.shareMsg(
          `还差${vm.orderData.left_num}人，点击右上角分享给小伙伴一起拼团吧！`,
          null,
          "appMessage"
        );
      } else {
        this.$root.shareMsg(
          "赶紧将椰子来了分享给小伙伴吧！",
          null,
          "appMessage"
        );
      }
    },
    // 设置分享信息
    shareSetting() {
      let vm = this;
      let shareInfo = {};
      let baseUrl = window.location.href.split("#").shift();
      if (vm.orderData.is_group == 1) {
        shareInfo = {
          title: vm.orderData.good_name,
          desc: `[${vm.orderData.good_price / 100}元]还差${
            vm.orderData.left_num
          }人，快来和我一起拼吧！`,
          link: `${baseUrl}#/group-detail/${this.orderData.id}`,
          imgUrl: vm.orderData.good_img
        };
      } else {
        shareInfo = {
          title: "椰子来了-旅游拼团特卖平台",
          desc: "我在看特卖商品，要不要一起拼？",
          link: `${baseUrl}#/index`,
          imgUrl: "https://img.cdn.powerpower.net/yezilaile.jpg"
        };
      }
      appShareMessage(
        shareInfo,
        () => {
          this.$toast("分享成功");
        },
        () => {
          this.$toast("取消分享");
        }
      );
      appShareTimeline(
        shareInfo,
        () => {
          this.$toast("分享成功");
        },
        () => {
          this.$toast("取消分享");
        }
      );
    },
    // 立即支付
    payOrder() {
      trackEvent(`${this.$route.name}`, "click", "pay");
      let orderId = this.orderData.id;
      this.orderPayAction(
        orderId,
        successRes => {
          this.$router.push(successRes);
        },
        failRes => {
          this.$router.push(failRes);
        },
        errMsg => {
          this.$alert(errMsg);
        }
      );
    },
    // 订单详情
    toOrderDetail() {
      this.$router.push({
        name: "orderDetail",
        params: { id: this.orderData.id }
      });
    },
    // 团详情
    toGroupDetail() {
      this.$router.push({
        name: "groupDetail",
        params: { id: this.orderData.id }
      });
    }
  },
  mounted() {
    if (!this.isGroup && this.orderData.order_status == 2) {
      this.shareSetting();
    }
  }
};
</script>
<style lang="less" scoped>

</style>

