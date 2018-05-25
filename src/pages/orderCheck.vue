<template>
  <app-page>
    <app-header title="订单确认">
    </app-header>
    <app-body>
      <div class="paddingBT-10 paddingLR-15">
        <good-cell-box :is-order="false" :no-display="{'groupNum':true,'saleNum':true}" :is-group="isGroup" :good-data="goodData"></good-cell-box>
      </div>
      <div>
        <mt-cell>
          <span slot="title" class="color-gray">购买数量</span>
            <inline-number @change="matchSuitableCoupon" class="inline-number-box" :min="goodData.min_num*1 || 1" :max="goodData.max_num*1 || 9999" v-model="count"></inline-number>
        </mt-cell>
        <mt-cell @click.native="showCouponPopup">
          <span slot="title" class="color-gray">优惠券</span>
          <div class="app-flex app-flex-center">
            <div class="col-1 color-black font-15">
            {{selectedCoupon.couponName}}
            </div>
            <div>
              <i class="icon-angle-right marginL-10 font-22 v-center color-gray"></i>
            </div>
          </div>
        </mt-cell>
      </div>
      <div class="marginT-10">
        <mt-cell>
          <span slot="title" class="color-gray">联系电话</span>
          <input type="text" @click="checkUserMobile" readonly v-model="contact" class="text-right color-black font-15" placeholder="（必填，用于订单核验）">
        </mt-cell>
        <mt-cell v-if="findArrayColumns(checkTypeList, 1)">
          <span slot="title" class="color-gray">联系人</span>
          <input type="text" v-model="contactName" class="text-right color-black font-15" placeholder="请输入联系人姓名">
        </mt-cell>
        <mt-cell v-if="findArrayColumns(checkTypeList, 2)">
          <span slot="title" class="color-gray">身份证号</span>
          <input type="number" v-model="idCardNo" class="text-right color-black font-15" placeholder="请输入身份证号">
        </mt-cell>
        <mt-cell v-if="findArrayColumns(checkTypeList, 3)" @click.native="showCalendar">
          <span slot="title" class="color-gray">选择日期</span>
          <div class="app-flex app-flex-center">
            <div class="col-1 color-black font-15">
            {{dateInfo}}
            </div>
            <div>
              <i class="icon-angle-right marginL-10 font-22 v-center color-gray"></i>
            </div>
          </div>
        </mt-cell>
      </div>
    </app-body>
    <app-box>
      <div class="action-box app-flex app-flex-center app-flex-full">
        <div class="col-1 text-right">
          实付款：<span>¥{{totalPrice}}</span>
        </div>
        <div class="action-btn">
          <a href="javascript:;" @click="confirmPayOrder">
            <span class="box-center full-width text-center">立即支付</span>
          </a>
        </div>
      </div>
    </app-box>
    <choose-coupon-popup ref="couponPopup" @change="changeCouponId" :unmatch-coupon.sync="couponList.unmatched" :match-coupon.sync="couponList.matched" :coupon-id.sync="selectedCoupon.couponId"></choose-coupon-popup>
    <calendar-popup :limit-day="calendar.limit" :select-type="calendar.type" :visible="calendar.visible" @close="calendar.visible=false" v-model="calendar.value"></calendar-popup>
  </app-page>
</template>

<script>
import {
  appPage,
  appHeader,
  appBox,
  appBody,
  GoodCellBox,
  InlineNumber,
  ChooseCouponPopup,
  CalendarPopup
} from "@/components";
import { mapMutations, mapGetters, mapActions } from "vuex";
import service from "@/service";
import utils from "@/utils";
import reg from "@/utils/reg";
import widgetDate from "@/utils/widgetDate";
import { trackEvent } from "@/utils/track";

export default {
  data() {
    return {
      groupId: this.$route.query.groupid || 0,
      goodsId: this.$route.params.id,
      goodData: {},
      isGroup: !!(this.$route.query.group * 1),
      count: 1,
      unitPrice: 1,
      contactName: "",
      contact: "",
      idCardNo: "",
      allCouponList: [],
      couponList: {
        matched: [],
        unmatched: []
      },
      selectedCoupon: {
        couponId: "",
        couponName: "",
        couponPrice: 0
      },
      calendar: {
        visible: false,
        type: 1,
        value: [],
        limit: 1
      },
      checkTypeList: 0 // 从商品详情数据的idcard_flag字段来； 1  姓名 2 身份证  3 日期
    };
  },
  computed: {
    ...mapGetters(["userInfo", "bindMobileType"]),
    totalPrice() {
      return (
        (this.unitPrice * this.count - this.selectedCoupon.couponPrice) / 100
      );
    },
    dateInfo() {
      if (!this.calendar.value || !this.calendar.value.length) {
        return "请选择日期";
      }
      if (!this.calendar.type) {
        return widgetDate._plainDateStr(this.calendar.value[0], "yyyy/MM/dd");
      } else {
        return `${widgetDate._plainDateStr(
          this.calendar.value[0]
        )}至${widgetDate._plainDateStr(this.calendar.value[1])}`;
      }
    }
  },
  watch: {
    bindMobileType() {
      /*
        逻辑：
          1. 判断是否绑定手机号的弹窗隐藏了
          2. 如果用户信息有手机号，并且不等于页面显示的手机号
          3. 更改显示的手机号信息
          4. 重置选择的卡券信息
          5. 重新读取卡券信息
          6. 重新得到匹配的卡券信息
      */
      if (!this.bindMobileType) {
        if (
          this.userInfo &&
          this.userInfo.mobile &&
          this.userInfo.mobile != this.contact
        ) {
          this.contact = this.userInfo.mobile;
          this.selectedCoupon = {
            couponId: "",
            couponName: "",
            couponPrice: 0
          };
          this.$loading.open();
          this.getAvailibleCouponData().then(() => {
            this.matchSuitableCoupon();
            this.$loading.close();
          });
        }
      }
    }
  },
  components: {
    GoodCellBox,
    InlineNumber,
    ChooseCouponPopup,
    appPage,
    appHeader,
    appBox,
    appBody,
    CalendarPopup
  },
  beforeDestroy() {},
  methods: {
    ...mapMutations(["UPDATE_USER_INFO", "UPDATE_BIND_MOBILE_TYPE"]),
    ...mapActions(["getUserInfoAction", "orderPayAction"]),
    findArrayColumns(resource, ...columns) {
      return utils.findArrayColumns(resource, ...columns);
    },
    // findArrayColumns: utils.findArrayColumns,
    // 获取服务器或者缓存的手机信息
    getPhoneNo(isForce = false) {
      return new Promise(resolve => {
        this.getUserInfoAction(isForce).then(res => {
          res.mobile && (this.contact = res.mobile);
          return resolve(res);
        });
      });
    },
    // 点击手机号进行验证，有手机号跳更换手机号弹窗，没有手机号跳绑定手机号弹窗
    checkUserMobile() {
      this.UPDATE_BIND_MOBILE_TYPE(this.contact ? 3 : 2);
    },
    showCalendar() {
      this.calendar.visible = true;
      // console.log(this.calendar)
    },
    // 获取商品信息
    setGoodData() {
      return new Promise((resolve, reject) => {
        service
          .goodsDetail({
            gid: this.goodsId
          })
          .then(
            res => {
              if (res.success) {
                this.goodData = res.data.data || {};
                this.setCalendarArgs();
                this.unitPrice = this.isGroup
                  ? this.goodData.gprice
                  : this.goodData.price;
              }
              resolve();
            },
            err => {
              reject(err);
            }
          );
      });
    },
    // 设置时间插件的参数
    setCalendarArgs() {
      this.checkTypeList = (this.goodData.require_flag || "").split(/,|，/g);
      if (utils.findArrayColumns(this.checkTypeList, 3)) {
        this.calendar.type =
          this.goodData.require_day && this.goodData.require_day * 1 > 1
            ? 1
            : 0;
        this.calendar.limit = this.goodData.require_day || 1;
      }
    },
    // 获取可用优惠券信息
    getAvailibleCouponData() {
      return new Promise((resolve, reject) => {
        service.orderCoupon().then(
          res => {
            res.success && (this.allCouponList = res.data.data || {});
            resolve();
          },
          err => {
            reject(err);
          }
        );
      });
    },
    // 是否符合使用规则
    isMatchRule(scriptRule = "") {
      if (!scriptRule) {
        return false;
      }
      let matchRegStr = scriptRule.replace(/(#pid#)|(#totalPrice#)/g, $1 => {
        let matchRes = $1;
        switch ($1) {
          case "#pid#":
            matchRes = this.groupId;
            break;
          case "#totalPrice#":
            matchRes = this.unitPrice * this.count;
            break;
        }
        return matchRes;
      });
      return eval(matchRegStr);
    },
    // 优惠券分类（可用/不可用）
    classifyCouponData() {
      this.couponList = {
        matched: [],
        unmatched: []
      };
      if (!this.allCouponList || !this.allCouponList.length) {
        return;
      }
      let matchRegStr = "";
      this.allCouponList.forEach(coupon => {
        this.couponList[
          this.isMatchRule(coupon.script) ? "matched" : "unmatched"
        ].push(coupon);
      });
    },
    // 显示选择优惠券弹框
    showCouponPopup() {
      this.$refs.couponPopup.showPopup(this.selectedCoupon.couponId);
    },
    // 根据选中卡券id查找优惠券信息
    findCoupon() {
      let couponRes = {
        id: this.selectedCoupon.couponId || "",
        name: "不使用优惠券",
        money: 0
      };
      if (this.selectedCoupon.couponId) {
        let matchedCoupon = this.couponList.matched.filter(coupon => {
          return coupon.id == this.selectedCoupon.couponId;
        });
        matchedCoupon.length && (couponRes = matchedCoupon[0]);
      }
      return couponRes;
    },
    // 匹配优惠券
    matchSuitableCoupon() {
      this.classifyCouponData();
      let selectCoupon = this.findCoupon();
      let matchedCoupon = this.couponList.matched.length
        ? this.couponList.matched[0]
        : null;

      if (this.isMatchRule(selectCoupon.script)) {
        let finalCouponInfo = {};
        if (matchedCoupon) {
          finalCouponInfo =
            selectCoupon.money > matchedCoupon.money
              ? selectCoupon
              : matchedCoupon;
        } else {
          finalCouponInfo = selectCoupon;
        }
        return (this.selectedCoupon = {
          couponId: finalCouponInfo.id,
          couponName: finalCouponInfo.name,
          couponPrice: finalCouponInfo.money
        });
      }
      if (matchedCoupon) {
        return (this.selectedCoupon = {
          couponId: matchedCoupon.id,
          couponName: matchedCoupon.name,
          couponPrice: matchedCoupon.money
        });
      }
      this.selectedCoupon = {
        couponId: 0,
        couponName: "暂无可用优惠券",
        couponPrice: 0
      };
    },
    // 选择卡券回调
    changeCouponId(id) {
      let couponInfo = this.findCoupon((this.selectedCoupon.couponId = id));
      this.selectedCoupon.couponName = couponInfo.name;
      this.selectedCoupon.couponPrice = couponInfo.money;
    },
    // 确认支付
    confirmPayOrder() {
      if (reg.regEmpty(this.contact)) {
        return this.$infoToast("手机号码不能为空！");
      }
      if (!reg.regTest(this.contact, "mobile")) {
        return this.$infoToast("手机号码不合法！");
      }
      if (
        this.findArrayColumns(this.checkTypeList, 1) &&
        reg.regEmpty(this.contactName)
      ) {
        return this.$infoToast("联系人不能为空！");
      }
      if (
        this.findArrayColumns(this.checkTypeList, 2) &&
        reg.regEmpty(this.idCardNo)
      ) {
        return this.$infoToast("身份证号码不能为空！");
      }
      if (this.idCardNo && !reg.regTest(this.idCardNo, "idCard")) {
        return this.$infoToast("身份证号码不合法！");
      }
      if (
        this.findArrayColumns(this.checkTypeList, 3) &&
        !this.calendar.value.length
      ) {
        return this.$infoToast("请选择日期！");
      }
      this.$confirm("是否确认支付？").then(this.doOrderPay, () => {});
    },
    // 支付方法
    doOrderPay() {
      trackEvent(`${this.$route.name}`, "click", "pay");
      service
        .orderCreate({
          pid: this.groupId,
          isGroup: this.$route.query.group,
          gid: this.goodsId,
          goodsNum: this.count,
          address: {
            telNumber: this.contact,
            userName: this.contactName,
            idcard: this.idCardNo || "",
            appointBeginDate: widgetDate._plainDateStr(
              this.calendar.value[0]
            ),
            appointEndDate: widgetDate._plainDateStr(this.calendar.value[1])
          },
          totalPrice: this.totalPrice * 100,
          goodsProp: {},
          couponId: this.selectedCoupon.couponId || ""
        })
        .then(res => {
          if (res.success) {
            let orderId = res.data.data;
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
          } else {
            this.$alert(res.data.errmsg);
          }
        });
    }
  },
  mounted() {
    this.$loading.open();
    Promise.all([
      this.setGoodData(),
      this.getAvailibleCouponData(),
      this.getPhoneNo(true)
    ])
      .then(
        () => {
          this.matchSuitableCoupon();
        },
        () => {}
      )
      .finally(this.$loading.close);
  }
};
</script>


<style lang="less" scoped>
.inline-number-box {
  width: 110px;
}
.action-box {
  height: 50px;
  background-color: #fff;
  .col-1 {
    font-size: 14px;
    span {
      color: #f00;
      font-size: 18px;
    }
  }
  .action-btn {
    height: 50px;
    width: 35%;
    margin-left: 10px;
    a {
      text-decoration: none;
      display: block;
      width: 100%;
      height: 50px;
      position: relative;
      background-color: #f95959;
      color: #fff;
      transition: all 0.2s ease;
      * {
        font-size: 16px;
      }
      &:active {
        background-color: #ea3d3d;
        transition: all 0.2s ease;
      }
    }
  }
}
</style>
