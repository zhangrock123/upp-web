<template>
  <div class="good-cell-box app-flex app-flex-center app-flex-full" @click="pathToDetail">
    <div>
      <div class="coverImg" :style="{'backgroundImage': `url(${goodInfo.image})`}"></div>
    </div>
    <div class="col-1 good-detail-info">
      <header class="text-cut2">
        {{displayCtrl('title')}}
      </header>
      <section class="text-cut font-12 color-gray">
        {{displayCtrl('groupNum')}}{{displayCtrl('saleNum')}}
      </section>
      <footer>
        <div v-if="isOrder" class="app-flex app-flex-center app-flex-full">
          <div class="col-1 order-time">
            {{displayCtrl('orderTime')}}
          </div>
          <div>
            {{displayCtrl('price')}}
            <span v-if="!noDisplay.num" class="order-num">x{{goodInfo.num}}</span>
          </div>
        </div>
        <div v-else class="app-flex app-flex-center app-flex-full">
          <div class="col-1"></div>
          <div>
            {{displayCtrl('price')}}{{displayCtrl('unit')}}
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLink: {
      type: Boolean,
      default: false
    },
    isGroup: {
      type: Boolean,
      default: false
    },
    goodData: {
      type: Object,
      default() {
        return {};
      }
    },
    isOrder: {
      type: Boolean,
      default: false
    },
    noDisplay: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    goodInfo() {
      return this[
        this.isOrder ? "formatGoodOrderData" : "formatGoodNormalData"
      ]();
    }
  },
  methods: {
    // 跳转商品详情
    pathToDetail() {
      if (this.isLink) {
        this.$router.push({
          name: "goodsDetail",
          params: { id: this.goodInfo.id }
        });
      }
    },
    // 抽离订单数据中的商品信息做格式化
    formatGoodOrderData() {
      return {
        id: this.goodData.good_id,
        title: this.goodData.good_name || "",
        image: this.goodData.good_img,
        price: this.goodData.good_price * 1 / 100,
        unit: "人",
        num: this.goodData.good_num,
        groupNum: this.goodData.group_num,
        curGroupNum: this.goodData.now_num,
        leftGroupNum: this.goodData.left_num,
        saleNum: this.goodData.now_num,
        orderId: this.goodData.id,
        orderTime: this.goodData.create_time
      };
    },
    // 抽离商品数据中的商品信息做格式化
    formatGoodNormalData() {
      return {
        id: this.goodData.id,
        title: this.goodData.name,
        image: this.goodData.index_img,
        price:
          (this.isGroup ? this.goodData.gprice : this.goodData.price) / 100,
        unit: this.goodData.unit,
        num: 1,
        groupNum: this.goodData.need_num,
        curGroupNum: 0,
        leftGroupNum: this.goodData.need_num,
        saleNum: this.goodData.sale_num,
        orderId: "",
        orderTime: ""
      };
    },
    // 显示／隐藏字段控制
    displayCtrl(columnName) {
      let res = "";
      let columnData = this.goodInfo[columnName];
      switch (columnName) {
        case "price":
          this.isDisplay(columnName) && (res = `¥${columnData}`);
          break;
        case "unit":
          this.isDisplay(columnName) && (res = `/${columnData}`);
          break;
        case "saleNum":
          this.isDisplay(columnName) &&
            (res = `已团${columnData}${this.goodInfo.unit}`);
          break;
        case "groupNum":
          this.isDisplay(columnName) && (res = `${columnData}人团 · `);
          break;
        default:
          this.isDisplay(columnName) && (res = columnData);
          break;
      }
      return res;
    },
    isDisplay(columnName) {
      return !this.noDisplay[columnName];
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.good-cell-box {
  .coverImg {
    width: 70px;
    height: 70px;
    margin-right: 10px;
    border-radius: 4px;
  }
  .good-detail-info {
    font-size: 14px;
    line-height: 1.3;
    > header {
      height: 36px;
    }
    > section {
      height: 18px;
    }
    > footer {
      height: 16px;
      .order-time {
        color: #808080;
        font-size: 14px;
      }
      .order-num {
        color: #bfbfbf;
        font-size: 14px;
        margin-left: 5px;
      }
    }
  }
}
</style>


