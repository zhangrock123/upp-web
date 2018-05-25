<template>
  <app-page>
    <app-box>
      <mt-navbar v-model="groupType">
        <mt-tab-item id="all">
          全部
        </mt-tab-item>
        <mt-tab-item id="pending">
          待成团
        </mt-tab-item>
        <mt-tab-item id="success">
          已成团
        </mt-tab-item>
        <mt-tab-item id="fail">
          拼团失败
        </mt-tab-item>
      </mt-navbar>
    </app-box>
    <app-load-more :method="loadMore" :all-loaded="allLoaded" :is-empty="!groupData.length">
      <div class="padding-15" v-if="groupData.length">
        <template v-for="(order, $orderIndex) in groupData" >
          <order-item is-group :key="$orderIndex" :order="order"></order-item>
        </template>
      </div>
      <no-data-box v-else type="group"></no-data-box>
    </app-load-more>
    <app-footer active="group"></app-footer>
  </app-page>
</template>

<script>
import {
  appPage,
  appBox,
  appLoadMore,
  appFooter,
  OrderItem,
  NoDataBox
} from "@/components";
import service from "@/service";

export default {
  data() {
    return {
      groupType: "all",
      cid: 0,
      groupData: [],
      page: 0,
      allLoaded: false,
      limitLoadedCount: 10,
      isFirstLoaded: false
    };
  },
  watch: {
    groupType(v) {
      this.init();
    }
  },
  components: {
    OrderItem,
    NoDataBox,
    appPage,
    appBox,
    appLoadMore,
    appFooter
  },
  beforeDestroy() {},
  methods: {
    // 初始化
    init() {
      this.cid = {
        all: 0,
        pending: 1,
        success: 2,
        fail: 3
      }[this.groupType];
      this.getGroupData(true);
    },
    // 获取团购列表
    getGroupData(isInit = false) {
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
          .groupList({
            page: this.page,
            cid: this.cid
          })
          .then(
            res => {
              if (res.success) {
                dataList = res.data.data || [];
                this.groupData = isInit
                  ? dataList
                  : this.groupData.concat(dataList);
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
    // 加载更多
    loadMore() {
      if (!this.isFirstLoaded) {
        return new Promise(resolve => {
          resolve();
        });
      }
      this.page++;
      return this.getGroupData();
    }
  },
  mounted() {
    this.init();
  }
};
</script>


<style lang="less" scoped>

</style>
