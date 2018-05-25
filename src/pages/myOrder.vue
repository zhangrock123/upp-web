<template>
  <app-page>
    <app-header title="我的订单"></app-header>
    <app-box>
      <app-nav-bar @change="init" v-model="orderType" :src="orderNav"></app-nav-bar>
    </app-box>
    <app-load-more :method="loadMore" :all-loaded="allLoaded" :is-empty="!orderList.length">
      <div class="padding-15" v-if="orderList.length">
        <template v-for="(order, $orderIndex) in orderList" >
          <order-item @click="toOrderDetail" :key="$orderIndex" :order="order"></order-item>
        </template>
      </div>
      <no-data-box v-else type="order"></no-data-box>
    </app-load-more>
  </app-page>
</template>

<script>
import {
  appPage,
  appHeader,
  appBox,
  appLoadMore,
  appNavBar,
  OrderItem,
  NoDataBox
} from "@/components";
import service from "@/service";

export default {
  data() {
    return {
      orderType: this.$route.query.type || "all",
      orderNav: [],
      orderList: [],
      sid: 0,
      page: 0,
      allLoaded: false,
      limitLoadedCount: 10,
      isFirstLoaded: false
    };
  },
  components: {
    OrderItem,
    NoDataBox,
    appPage,
    appHeader,
    appBox,
    appLoadMore,
    appNavBar
  },
  beforeDestroy() {},
  methods: {
    // 初始化
    init() {
      this.sid = {
        all: 0,
        pay: 1,
        ungroup: 2,
        group: 3,
        refund: 4,
        done: 5
      }[this.orderType];
      this.getOrderList(true);
    },
    // 获取订单列表
    getOrderList(isInit = false) {
      let dataList = [];
      if (isInit) {
        this.page = 0;
        this.allLoaded = false;
        this.groupData = [];
        this.isFirstLoaded = false;
      }
      return new Promise(resolve => {
        isInit && this.$loading.open();
        service
          .orderList({
            page: this.page,
            sid: this.sid
          })
          .then(
            res => {
              if (res.success) {
                dataList = res.data.data || [];
                this.orderList = isInit
                  ? dataList
                  : this.orderList.concat(dataList);
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
    // 去往订单详情
    toOrderDetail(order) {
      if (!order || !order.id) {
        return;
      }
      this.$router.push({ name: "orderDetail", params: { id: order.id } });
    },
    // 加载更多
    loadMore() {
      if (!this.isFirstLoaded) {
        return new Promise(resolve => {
          resolve();
        });
      }
      this.page++;
      return this.getOrderList();
    },
    setOrderNav() {
      this.orderNav = [
        {
          title: "全部",
          type: "all"
        },
        {
          title: "待付款",
          type: "pay"
        },
        {
          title: "待成团",
          type: "ungroup"
        },
        {
          title: "已成团",
          type: "group"
        },
        {
          title: "已退款",
          type: "refund"
        },
        {
          title: "已完成",
          type: "done"
        }
      ];
    }
  },
  mounted() {
    this.setOrderNav();
    this.init();
  }
};
</script>


<style lang="less" scoped>

</style>
