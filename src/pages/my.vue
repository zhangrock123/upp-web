<template>
  <app-page>
    <app-body>
      <header class="user-info-box">
        <div class="box-center text-center">
          <div v-if="userData.avatar_url" class="coverImg" :style="{'backgroundImage': `url('${userData.avatar_url}')`}"></div>
          <div v-else class="coverImg"></div>
          <div>{{userData.nick_name ||userData.name || userData.mobile || "未知用户"}}</div>
        </div>
      </header>
      <section>
        <header class="order-header-box common-link" @click="pathTo('/my-order')">
          <div class="app-flex app-flex-center app-flex-full">
            <div class="col-1">
              我的订单
            </div>
            <div>
              查看全部
              <i class="icon-angle-right"></i>
            </div>
          </div>
        </header>
        <section class="order-type-box">
          <div class="app-flex app-flex-center app-flex-full col-1 text-center">
            <div @click="pathToOrder(menu.orderType)" class="order-type-item" v-for="(menu, $menuIndex) in orderMenu" :key="$menuIndex">
              <span class="box-center">
                <i :class="menu.icon">
                  <sup v-show="menu.count" class="badge">{{menu.count}}</sup>
                </i>
                {{menu.title}}
              </span>
            </div>
          </div>
        </section>
        <section class="marginT-10">
          <mt-cell is-link title="我的拼团" to="/my-group">
            <span class="cell-icon-box" slot="icon">
              <i class="icon-bag"></i>
            </span>
          </mt-cell>
          <mt-cell is-link title="我的手机" @click.native="changeMobile">
            <span class="cell-icon-box" slot="icon">
              <i class="icon-mobile pL-3"></i>
            </span>
          </mt-cell>
          <mt-cell is-link title="我的收藏" to="/my-collection">
            <span class="cell-icon-box" slot="icon">
              <i class="icon-heart-o"></i>
            </span>
          </mt-cell>
          <mt-cell is-link title="我的优惠券" to="/my-coupon">
            <span class="cell-icon-box" slot="icon">
              <i class="icon-coupon"></i>
            </span>
          </mt-cell>
        </section>
        <section class="marginT-10 marginB-10">
          <mt-cell is-link title="客服电话 400-1888-733" to="tel:4001888733">
            <span class="cell-icon-box" slot="icon">
              <i class="icon-call"></i>
            </span>
          </mt-cell>
        </section>
        <section v-if="!isWechat" class="padding-15 marginB-10 marginT-20">
          <mt-button @click="loginOut" class="full-width" size="small" plain type="danger">
            <span class="font-14">退出登录</span>
          </mt-button>
        </section>
      </section>
    </app-body>
    <app-footer active="my"></app-footer>
  </app-page>
</template>

<script>
import { appPage, appFooter, appBody } from "@/components";
import { mapMutations, mapActions, mapGetters } from "vuex";
import service from "@/service";
import utils from "@/utils";

export default {
  data() {
    return {
      isWechat: this.$root.isWechat,
      orderMenu: [],
      orderCount: {},
      userData: {}
    };
  },
  computed: {
    ...mapGetters(["userInfo", "bindMobileType"])
  },
  watch: {
    bindMobileType() {
      !this.bindMobileType &&
        this.userData.mobile != this.userInfo.mobile &&
        (this.userData = this.userInfo);
    }
  },
  components: {
    appPage,
    appFooter,
    appBody
  },
  beforeDestroy() {},
  methods: {
    ...mapMutations(["CLEAR_USER_INFO", "UPDATE_BIND_MOBILE_TYPE"]),
    ...mapActions(["getUserInfoAction"]),
    changeMobile() {
      this.UPDATE_BIND_MOBILE_TYPE(3);
    },
    // 设置订单菜单
    setOrderMenu() {
      this.orderMenu = [
        {
          type: 1,
          title: "待付款",
          count: 0,
          icon: "icon-order-status-pay",
          orderType: "pay"
        },
        {
          type: 2,
          title: "待成团",
          count: 0,
          icon: "icon-order-status-ungroup",
          orderType: "ungroup"
        },
        {
          type: 3,
          title: "已成团",
          count: 0,
          icon: "icon-order-status-group",
          orderType: "group"
        },
        {
          type: 4,
          title: "已退款",
          count: 0,
          icon: "icon-order-status-refund",
          orderType: "refund"
        }
      ];
    },
    // 重置订单菜单数量
    resetOrderMenuCount() {
      this.orderMenu.forEach(menu => {
        menu.count = this.orderCount[menu.type] || 0;
      });
    },
    pathTo(path) {
      this.$router.push(path);
    },
    // 去往某一个订单菜单
    pathToOrder(type = "all") {
      this.$router.push({ name: "myOrder", query: { type } });
    },
    // 获取订单数量
    getOrderCount() {
      return new Promise(resolve => {
        service
          .orderCount()
          .then(
            res => {
              if (res.success) {
                this.orderCount = res.data.data || {};
              } else {
                this.$toast(res.data.msg || "数据异常，请刷新重试！");
              }
            },
            err => {}
          )
          .finally(resolve);
      });
    },
    // 获取用户信息
    getUserInfo() {
      return new Promise(resolve => {
        this.getUserInfoAction(true).then(res => {
          this.userData = res;
          resolve();
        });
      });
    },
    // 登出操作
    loginOut() {
      if (this.isWechat) {
        return;
      }
      this.$confirm("是否确认退出登录？").then(
        confirm => {
          utils.setCookie("_token", "", null, "-1");
          this.CLEAR_USER_INFO();
          this.$router.push("/index");
        },
        cancel => {}
      );
    }
  },
  mounted() {
    this.setOrderMenu();
    this.$loading.open();
    Promise.all([this.getUserInfo(), this.getOrderCount()])
      .then(
        () => {
          this.resetOrderMenuCount();
        },
        () => {}
      )
      .finally(this.$loading.close);
  }
};
</script>


<style lang="less" scoped>
.user-info-box {
  height: 180px;
  position: relative;
  background-color: #fd704c;
  color: #fff;
  font-size: 14px;
  font-weight: 300;
  .coverImg {
    display: inline-block;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin-bottom: 10px;
    background-image: url("../assets/images/default-avatar.png");
  }
}
.order-header-box {
  background-color: #fff;
  padding: 12px 15px;
  border-bottom: 0.04rem solid #ccc;
}
.cell-icon-box {
  i {
    display: inline-block;
    font-size: 18px;
    vertical-align: middle;
    width: 22px;
    color: #898989;
    &.pL-3 {
      padding-left: 3px;
    }
  }
}
.order-type-box {
  background-color: #fff;
  height: 70px;
  border-bottom: 0.04rem solid #ccc;
  .order-type-item {
    height: inherit;
    position: relative;
    span {
      font-size: 12px;
      i {
        font-size: 20px;
        display: block;
        margin-bottom: 5px;
        color: #666;
        position: relative;
        .badge {
          position: absolute;
          top: 0;
          right: 14px;
          transform: translateY(-50%) translateX(100%);
          border-radius: 10px;
          display: inline-block;
          font-size: 12px;
          height: 16px;
          line-height: 1.2;
          padding: 0 5px;
          text-align: center;
          white-space: nowrap;
          background-color: #f95959;
          color: #fff;
        }
      }
    }
  }
}
</style>
