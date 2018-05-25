<template>
  <div class="order-item-box card-shadow">
    <header class="marginLF-10 borderB-dot">
      <div class="app-flex app-flex-center app-flex-full">
        <div v-if="!isGroup" class="col-1 order-no">
          <span>订单编号:</span>
          {{order.id}}
        </div>
        <div v-else class="col-1 order-no"></div>
        <div class="order-status">
          {{order.order_status__NAME}}
        </div>
      </div>
    </header>
    <section class="marginLF-15 marginBT-10" @click="toOrderDetail">
      <good-cell-box is-order :good-data="order" :no-display="displayCtrl"></good-cell-box>
    </section>
    <footer>
      <div>
        <div class="app-flex app-flex-center app-flex-full">
          <div class="col-1 order-price">
            <span>{{order.is_pay==1?'实':'应'}}付:</span>
            <span>¥</span>{{order.pay_price/100}}
          </div>
          <div class="order-action btn-space-box">
            <order-btns :is-group="isGroup" :order-data="order"></order-btns>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { GoodCellBox, OrderBtns } from "@/components";

export default {
  props: {
    order: {
      type: Object,
      required: true
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      displayCtrl: {}
    };
  },
  watch: {},
  components: {
    GoodCellBox,
    OrderBtns
  },
  beforeDestroy() {},
  methods: {
    toOrderDetail() {
      this.$emit("click", this.order);
    }
  },
  mounted() {
    if (this.isGroup) {
      this.displayCtrl = {
        orderTime: true
      };
    } else {
      this.displayCtrl = {
        groupNum: true,
        saleNum: true
      };
    }
  }
};
</script>

<style lang="less" scoped>
.order-item-box {
  border-radius: 4px;
  background-color: #fff;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
  > header {
    padding: 8px 0;
    .order-no {
      span {
        color: #808080;
      }
    }
    .order-status {
      color: #f1524e;
    }
  }
  > footer {
    padding: 8px 15px;
    border-top: 0.04rem solid #ccc;
    .order-price {
      color: #f60;
      font-size: 18px;
      span:first-child {
        color: #808080;
      }
    }
  }
}
</style>

