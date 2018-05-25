<template>
  <div class="coupon-tip-mask" v-show="visible">
    <div class="coupon-tip-box box-center">
      <div class="coupon-tip-container">
        <header>
          <img src="../../assets/images/coupon-dialog-bg.png" alt="">
          <div>
            <header>恭喜您!</header>
            <section>
              获得价值<span>{{couponData.coupon_amount/100}}</span>元礼包
            </section>
          </div>
        </header>
        <section>
          <img src="../../assets/images/coupon-card-bg.png" alt="">
          <div class="box-center">
            <span>¥</span>{{couponData.coupon_amount/100}}
          </div>
        </section>
        <footer>
            <mt-button type="danger" size="large" @click.native="previewCoupon">
              <span class="coupon-preview-btn">去查看大礼包</span>
            </mt-button>
        </footer>
      </div>
      <a href="javascript:;" @click="closeCoupon" class="coupon-tip-close">
        <span class="box-center">×</span>
      </a>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      visible: false
    };
  },
  watch: {
    couponInfo() {
      this.visible = !!this.couponInfo;
    }
  },
  computed: {
    ...mapGetters(["couponInfo"]),
    couponData() {
      return this.couponInfo || { coupon_amount: 0 };
    }
  },
  methods: {
    ...mapMutations(["UPDATE_COUPON_INFO"]),
    ...mapActions(["setCouponReadAction"]),
    // 关闭优惠券到账弹窗
    closeCoupon() {
      this.UPDATE_COUPON_INFO();
      this.setCouponReadAction();
    },
    // 点击“查看”按钮事件
    previewCoupon() {
      this.closeCoupon();
      this.$router.push("/my-coupon");
    }
  },
  mounted() {
    this.visible = !!this.couponInfo;
  }
};
</script>

<style lang="less" scoped>
.coupon-tip-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 500;
  transition: all 0.3s ease-in;
  .coupon-tip-box {
    width: 80%;
    height: auto;
    .coupon-tip-container {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-radius: 6px;
      > header {
        > img {
          width: 100%;
        }
        > div {
          position: absolute;
          left: 0;
          top: 11%;
          width: 100%;
          color: #fff;
          text-align: center;
          line-height: 1.4;

          header {
            font-size: 26px;
            margin-bottom: 10px;
          }
          section {
            font-size: 18px;

            span {
              font-size: 20px;
            }
          }
        }
      }
      > section {
        width: 60%;
        margin: -28% auto 0;
        position: relative;
        > img {
          width: 100%;
        }
        div {
          line-height: 1.4;
          font-size: 36px;
          color: #fff;
          span {
            font-size: 20px;
          }
        }
      }
      > footer {
        padding: 0 8%;
        margin: 30px 0;
        .coupon-preview-btn {
          display: inline-block;
          padding: 5px 0;
          font-size: 16px;
          line-height: 1.4;
        }
      }
    }
    .coupon-tip-close {
      display: block;
      text-decoration: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #fff;
      margin: 20px auto 0;
      position: relative;
      span {
        font-size: 40px;
        color: #fff;
        margin-top: -3px;
      }
      &:after {
        content: "";
        position: absolute;
        left: 50%;
        top: -22px;
        width: 2px;
        height: 20px;
        background-color: #fff;
        margin-left: -1px;
      }
    }
  }
}
</style>

