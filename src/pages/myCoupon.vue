<template>
  <app-page>
    <app-header title="我的优惠券">

    </app-header>
    <app-box>
      <mt-navbar v-model="couponType">
        <mt-tab-item id="pending">
          未使用({{couponCount.pending}})
        </mt-tab-item>
        <mt-tab-item id="used">
          已使用({{couponCount.used}})
        </mt-tab-item>
        <mt-tab-item id="expired">
          已过期({{couponCount.expired}})
        </mt-tab-item>
      </mt-navbar>
    </app-box>
    <app-load-more :method="loadMore" :all-loaded="allLoaded" :is-empty="!couponList.length">
      <div class="padding-15" v-if="couponList.length">
        <div @click="toUseCoupon" v-for="(coupon, $couponIndex) in couponList" :key="$couponIndex">
          <coupon-item :is-link="couponType=='pending'"  action-type="toUse" :coupon="coupon"></coupon-item>
        </div>
      </div>
      <no-data-box v-else type="coupon"></no-data-box>
    </app-load-more>
  </app-page>
</template>

<script>
import {
  appPage,
  appHeader,
  appBox,
  appLoadMore,
  CouponItem,
  NoDataBox
} from "@/components";
import service from "@/service";

export default {
  data() {
    return {
      couponType: "pending",
      couponList: [],
      couponCount: { pending: 0, used: 0, expired: 0 },
      cat: 0,
      page: 0,
      allLoaded: false,
      limitLoadedCount: 10,
      isFirstLoaded: false
    };
  },
  watch: {
    couponType(v) {
      this.init();
    }
  },
  components: {
    CouponItem,
    NoDataBox,
    appPage,
    appHeader,
    appBox,
    appLoadMore
  },
  beforeDestroy() {},
  methods: {
    // 初始化
    init() {
      this.cat = {
        pending: 1,
        used: 2,
        expired: 3
      }[this.couponType];
      this.getCouponData(true);
    },
    // 获取卡券列表
    getCouponData(isInit = false) {
      let dataList = [];
      if (isInit) {
        this.page = 0;
        this.allLoaded = false;
        this.couponList = [];
        this.isFirstLoaded = false;
      }
      return new Promise(resolve => {
        isInit && this.$loading.open();
        service
          .couponList({
            cat: this.cat,
            page: this.page
          })
          .then(
            res => {
              if (res.success) {
                dataList = res.data.data.couponList || [];
                this.couponCount = res.data.data.couponCount;
                this.couponList = isInit
                  ? dataList
                  : this.couponList.concat(dataList);
                this.allLoaded = dataList.length < this.limitLoadedCount;
              } else {
                this.allLoaded = true;
              }
            },
            err => {
              this.allLoaded = true;
            }
          )
          .finally(() => {
            isInit && this.$loading.close();
            this.isFirstLoaded = true;
            resolve();
          });
      });
    },
    // 点击立即使用跳转主页
    toUseCoupon() {
      this.couponType == "pending" && this.$router.push("/index");
    },
    // 加载更多
    loadMore() {
      if (!this.isFirstLoaded) {
        return new Promise(resolve => {
          resolve();
        });
      }
      this.page++;
      return this.getCouponData();
    }
  },
  mounted() {
    this.init();
  }
};
</script>


<style lang="less" scoped>

</style>
