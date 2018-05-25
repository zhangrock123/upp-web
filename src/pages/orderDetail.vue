<template>
  <app-page>
    <app-header :is-force-index="isFromPay" title="订单详情"></app-header>
    <app-body>
      <header class="order-status-box">
          <div class="warpper">
            <div class="app-flex app-flex-center app-flex-full">
              <div class="col-1 order-status-info">
                <header>{{headerInfo.title}}</header>
                <section v-if="headerInfo.subTitle">{{headerInfo.subTitle}}</section>
              </div>
              <div>
                <i class="font-36" :class="headerInfo.icon"></i>
              </div>
            </div>
          </div>
      </header>
      <section class="order-detail-box">
        <section class="paddingLR-15 paddingBT-5">
          <div class="section-cell borderB-dot">
            <span class="color-gray">订单编号:</span>
            {{orderData.id}}
          </div>
          <good-cell-box class="marginBT-10" is-order :no-display="{'orderTime': true,'groupNum':true,'saleNum':true}" :good-data="orderData"></good-cell-box>
        </section>
        <section class="borderT borderB">
          <div class="paddingLR-15 paddingT-5">
            <div class="section-cell">
              <div class="app-flex app-flex-center">
                <div class="col-1 color-gray">总金额:</div>
                <div>¥{{orderData.total_price/100}}</div>
              </div>
            </div>
            <div class="section-cell" v-if="orderData.coupon_price > 0">
              <div class="app-flex app-flex-center">
                <div class="col-1 color-gray">优惠金额:</div>
                <div>¥{{orderData.coupon_price/100}}</div>
              </div>
            </div>
            <div class="paddingT-5"></div>
            <div class="paddingBT-5 borderT-dot">
              <div class="section-cell ">
                <div class="app-flex app-flex-center">
                  <div class="col-1 font-14 text-bold color-black">实付金额:</div>
                  <div class="font-15 text-bold color-orange">¥{{orderData.pay_price/100}}</div>
                </div>
              </div>
            </div>

          </div>
        </section>
        <section class="paddingLR-15 paddingBT-5" v-if="orderData.member_mobile">
          <div class="section-cell">
            <div class="app-flex app-flex-center">
              <div class="col-1 color-gray">联系电话:</div>
              <div>{{orderData.member_mobile}}</div>
            </div>
          </div>
          <div class="section-cell">
            <div class="app-flex app-flex-center">
              <div class="col-1 color-gray">支付方式:</div>
              <div>微信</div>
            </div>
          </div>
          <div class="section-cell">
            <div class="app-flex app-flex-center">
              <div class="col-1 color-gray">下单时间:</div>
              <div>{{orderData.create_time}}</div>
            </div>
          </div>
          <div class="section-cell" v-if="orderData.group_time">
            <div class="app-flex app-flex-center">
              <div class="col-1 color-gray">成团时间:</div>
              <div>{{orderData.group_time}}</div>
            </div>
          </div>
          <div class="section-cell" v-if="orderData.refund_time">
            <div class="app-flex app-flex-center">
              <div class="col-1 color-gray">退款时间:</div>
              <div>{{orderData.refund_time}}</div>
            </div>
          </div>
          <div class="section-cell" v-if="orderData.appoint_time">
            <div class="app-flex app-flex-center">
              <div class="col-1 color-gray">预约时间:</div>
              <div>{{orderData.appoint_time}}</div>
            </div>
          </div>
          <div class="section-cell" v-if="orderData.used_time">
            <div class="app-flex app-flex-center">
              <div class="col-1 color-gray">使用时间:</div>
              <div>{{orderData.used_time}}</div>
            </div>
          </div>
          <div class="section-cell" v-if="orderData.express">
            <div class="app-flex app-flex-center">
              <div class="col-1 color-gray">快递方式:</div>
              <div>{{orderData.express.type}}</div>
            </div>
          </div>
          <div class="section-cell" v-if="orderData.express">
            <div class="app-flex app-flex-center">
              <div class="col-1 color-gray">运单编号:</div>
              <div>{{orderData.express.sn}}</div>
            </div>
          </div>
        </section>
      </section>
    </app-body>
    <app-box class="bg-white">
      <div class="marginLF-15 marginBT-10 text-right btn-space-box">
          <order-btns :order-data="orderData"></order-btns>
      </div>
    </app-box>
  </app-page>
</template>

<script>
import {
  appPage,
  appHeader,
  appBox,
  appBody,
  GoodCellBox,
  OrderBtns
} from "@/components";
import service from "@/service";

export default {
  data() {
    return {
      isFromPay: this.$route.query.check == "1",
      headerInfo: {
        title: "",
        subTitle: "",
        icon: ""
      },
      orderId: this.$route.params.id,
      orderData: {}
    };
  },
  watch: {},
  components: {
    GoodCellBox,
    OrderBtns,
    appPage,
    appHeader,
    appBox,
    appBody
  },
  beforeDestroy() {},
  methods: {
    // 获取订单详情
    getOrderData(isCheck = false) {
      let isSuccess = false;
      let loadingMsg = isCheck ? "校验中..." : "";
      return new Promise(resolve => {
        this.$loading.open(loadingMsg);
        service
          .orderDetail({
            id: this.orderId
          })
          .then(
            res => {
              if (res.success) {
                this.orderData = res.data.data || {};
                isSuccess = true;
                this.checkPayCallbackStatus();
              } else {
                this.$toast(res.data.msg || "数据异常，请刷新重试！");
              }
            },
            err => {}
          )
          .finally(() => {
            this.$loading.close();
            resolve(isSuccess);
          });
      });
    },
    // 检查是否是支付回调
    checkPayCallbackStatus() {
      /*
        逻辑：
          当支付回调页面获得query的check值为1
          则判断订单的状态
            状态为 1(未支付) => 弹框提示用户("请确认支付是否完成") => 点击‘已完成支付’则继续校验订单状态；点击‘重新支付’则关闭当前弹窗
            状态为 2(已支付) => 跳转组团详情页面
          其他状态无视
      */
      if (this.isFromPay) {
        if (this.orderData.order_status == 1) {
          this.$msgBox({
            title: "",
            message: "请确认支付是否完成？",
            showCancelButton: true,
            confirmButtonText: "已完成支付",
            cancelButtonText: "重新支付"
          }).then(confirm => {
            if (confirm == "confirm") {
              this.getOrderData(true).then(isSuccess => {
                isSuccess && this.setHeaderInfo();
              });
            } else {
            }
          });
        } else if (this.orderData.order_status == 2) {
          if (!this.orderData.is_group) {
            return;
          }
          this.$router.push({
            name: "groupDetail",
            params: { id: this.orderData.id },
            query: { check: 1 }
          });
        }
      }
    },
    // 设置头部状态信息
    setHeaderInfo() {
      let orderStatus = this.orderData.order_status;
      this.headerInfo.title = this.orderData.order_status__NAME;
      switch (orderStatus) {
        // 未支付
        case 1:
          this.headerInfo.subTitle = "请在1小时内完成支付，超时订单将自动取消";
          this.headerInfo.icon = "icon-order-status-pay";
          break;
        // 已支付
        case 2:
          this.headerInfo.subTitle = `还差${this.orderData.left_num}人拼团成功`;
          this.headerInfo.icon = "icon-order-status-ungroup";
          break;
        // 订单成功
        case 3:
          this.headerInfo.subTitle = "预祝您入住愉快！";
          this.headerInfo.icon = "icon-order-status-group";
          break;
        // 团购失败
        case 4:
          this.headerInfo.subTitle = "";
          this.headerInfo.icon = "icon-order-status-close";
          break;
        // 已取消
        case 5:
          this.headerInfo.subTitle = "";
          this.headerInfo.icon = "icon-order-status-close";
          break;
        // 已退款
        case 6:
          this.headerInfo.subTitle = "";
          this.headerInfo.icon = "icon-order-status-refund";
          break;
      }
    }
  },
  mounted() {
    this.getOrderData().then(isSuccess => {
      isSuccess && this.setHeaderInfo();
    });
  }
};
</script>


<style lang="less" scoped>
.order-status-box {
  height: 80px;
  padding-bottom: 40px;
  box-sizing: content-box;
  background: linear-gradient(to right, #fc4f4f, #ff7753);
  .warpper {
    height: inherit;
    padding: 0 40px;
    color: #fff;
    .order-status-info {
      header,
      section {
        font-size: 18px;
        line-height: 1.4;
      }
      section {
        font-size: 14px;
        margin-top: 5px;
      }
    }
  }
}
.order-detail-box {
  background-color: #fff;
  margin: -40px 15px 0;
  border-radius: 4px;
  box-shadow: 0 0 5px 0 rgba(129, 78, 78, 0.18);
  .section-cell {
    padding: 5px 0;
  }
}
</style>
