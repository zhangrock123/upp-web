<template>
  <app-page>
    <app-load-more :method="loadMore" :all-loaded="allLoaded" :is-empty="!goodsList.length">
      <div class="padding-15 paddingB-0">
          <div v-for="(goodData, $goodIndex) in goodsList" :key="$goodIndex" @click="pathToDetail(goodData)">
            <group-card-item :good-data="goodData"></group-card-item>
          </div>
      </div>
    </app-load-more>
    <app-footer active="index"></app-footer>
  </app-page>
</template>

<script>
import { appPage, appFooter, appLoadMore, GroupCardItem } from "@/components";
import service from "@/service";

export default {
  data() {
    return {
      goodsList: [],
      page: 0,
      allLoaded: false,
      limitLoadedCount: 5,
      isFirstLoaded: false
    };
  },
  computed: {},
  components: {
    GroupCardItem,
    appPage,
    appFooter,
    appLoadMore
  },
  beforeDestroy() {},
  methods: {
    // 去往商品详情
    pathToDetail(goodData) {
      if (!goodData.is_begin) {
        return;
      }
      this.$router.push({ name: "goodsDetail", params: { id: goodData.id } });
    },
    // 获取商品列表
    getGoodsList(isInit = false) {
      let dataList = [];
      if (isInit) {
        this.page = 0;
        this.allLoaded = false;
        this.goodsList = [];
        this.isFirstLoaded = false;
      }
      return new Promise(resolve => {
        isInit && this.$loading.open();
        service
          .goodsList({
            page: this.page
          })
          .then(
            res => {
              if (res.success) {
                dataList = res.data.data || [];
                this.goodsList = isInit
                  ? dataList
                  : this.goodsList.concat(dataList);
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
      return this.getGoodsList();
    }
  },
  mounted() {
    this.getGoodsList(true);
  }
};
</script>


<style lang="less" scoped>

</style>
