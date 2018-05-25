<template>
  <app-page>
    <app-header title="我的收藏"></app-header>
    <app-body>
      <div class="padding-15" v-if="collectionList.length">
        <div class="good-item card-shadow padding-10" v-for="(collection, $collectionIndex) in collectionList" :key="$collectionIndex">
          <header class="paddingB-10">
            <good-cell-box is-link is-group :good-data="collection"></good-cell-box>
          </header>
          <footer class="borderT paddingT-10 text-right btn-space-box">
            <mt-button type="default" size="small" class="mini-size order-cancel-btn" @click="cancelCollection($collectionIndex)">取消收藏</mt-button>
            <mt-button type="danger" size="small" class="mini-size order-pay-btn" @click.native="pathToGoodsDetail(collection.id)">一键开团</mt-button>
          </footer>
        </div>
      </div>
      <no-data-box v-else type="collection"></no-data-box>
    </app-body>
  </app-page>
</template>

<script>
import {
  appPage,
  appHeader,
  appBody,
  GoodCellBox,
  NoDataBox
} from "@/components";
import service from "@/service";

export default {
  data() {
    return {
      collectionList: []
    };
  },

  watch: {},
  components: {
    GoodCellBox,
    NoDataBox,
    appPage,
    appHeader,
    appBody
  },
  beforeDestroy() {},
  methods: {
    // 获取收藏列表
    getCollectionList() {
      this.$loading.open();
      service
        .collectionList()
        .then(
          res => {
            if (res.success) {
              this.collectionList = res.data.data || [];
            } else {
              this.$toast(res.data.msg || "数据异常，请刷新重试！");
            }
          },
          err => {}
        )
        .finally(this.$loading.close);
    },
    // 去往商品详情
    pathToGoodsDetail(id) {
      if (!id) {
        return;
      }
      this.$router.push({
        name: "orderCheck",
        params: { id },
        query: { group: 1 }
      });
    },
    // 取消收藏
    cancelCollection(collectIndex) {
      this.$confirm("是否确认删除收藏？").then(() => {
        let collectionData = this.collectionList[collectIndex];
        this.$loading.open("数据更新中...");
        service
          .collectGoods({ gid: collectionData.id })
          .then(
            res => {
              if (res.success) {
                this.$successToast("已取消收藏");
                this.collectionList.splice(collectIndex, 1);
              } else {
                this.$toast(res.data.msg || "操作失败！");
              }
            },
            err => {}
          )
          .finally(this.$loading.close);
      });
    }
  },
  mounted() {
    this.getCollectionList();
  }
};
</script>


<style lang="less" scoped>
.good-item {
  background-color: #fff;
  margin-bottom: 15px;
  border-radius: 4px;
}
</style>
