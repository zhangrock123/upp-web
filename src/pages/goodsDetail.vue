<template>
  <app-page>
    <app-header title="商品详情"></app-header>
    <app-body>
      <div class="good-album">
        <mt-swipe :auto="0">
          <mt-swipe-item v-for="(album, $albumIndex) in detailData.album" :key="$albumIndex">
            <div class="coverImg" :style="{'backgroundImage': `url(${album})`}" @click="showBannerList($albumIndex, detailData.album)"></div>
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="good-section">
        <div class="good-price-box">
          <div class="app-flex app-flex-center">
            <div class="col-1">
              <div class="good-price">
                <span>¥</span>{{detailData.gprice/100}}
                <span class="del-line">¥{{detailData.mprice/100}}</span>
              </div>
              <div class="good-group">
                已团{{detailData.sale_num}}{{detailData.unit}} · {{detailData.need_num}}人团
              </div>
            </div>
            <div class="good-share text-center" @click="share">
              <a href="javascript:;">
                <i class="icon-share"></i>
                分享
              </a>
            </div>
          </div>
        </div>

        <div class="good-title">
          {{detailData.name}}
        </div>
        <div class="good-description">
          <pre>{{detailData.brief}}</pre>
        </div>
        <div class="good-label">
          <i class="icon-circle-warpper icon-check2"></i>
          限时秒杀
          <i class="icon-circle-warpper icon-check2"></i>
          限量抢购
          <i class="icon-circle-warpper icon-check2"></i>
          超低折扣
          <i class="icon-circle-warpper icon-check2"></i>
          使用灵活
        </div>
      </div>
      <div class="good-section marginT-10" v-if="(detailData.groupList || []).length">
        <header>小伙伴正在开团</header>
        <section>
          <template v-for="(group, $groupIndex) in detailData.groupList">
            <group-item :key="$groupIndex" :group-count="detailData.need_num*1" :group-data="group"></group-item>
          </template>
        </section>
      </div>
      <div class="good-section marginT-10">
        <header>商品详情</header>
        <section class="goods-detail-section" ref="previewImg" v-html="detailData.intro">
        </section>
      </div>
    </app-body>
    <app-box>
      <div class="bottom-float-buy-box app-flex app-flex-center">
        <div class="text-center nav-btn">
          <a href="javascript:;" @click="pathTo('/index')">
            <span class="box-center">
              <i class="icon-house-o"></i>首页
            </span>
          </a>
        </div>
        <div class="text-center nav-btn">
          <a href="javascript:;" @click="collectGood">
            <span class="box-center">
              <i :class="{'icon-heart-o': !detailData.is_collect,'icon-heart color-btn-ui': detailData.is_collect}"></i>收藏
            </span>
          </a>
        </div>
        <div class="col-1 text-center nav-buy">
          <a href="javascript:;" @click="toCheckOrder(false)">
            <span class="box-center">
              <header>¥{{detailData.price/100}}</header>
              <section>单独购买</section>
            </span>
          </a>
        </div>
        <div class="col-1 text-center nav-group-buy">
          <a href="javascript:;" @click="toCheckOrder(true)">
            <span class="box-center">
              <header>¥{{detailData.gprice/100}}</header>
              <section>一键开团</section>
            </span>
          </a>
        </div>
      </div>
    </app-box>
  </app-page>
</template>

<script>
import { appPage, appHeader, appBox, appBody, GroupItem } from "@/components";
import service from "@/service";
import { appShareMessage, appShareTimeline } from "@/utils/shareSdk";
import { trackEvent } from "@/utils/track";
import utils from "@/utils";

export default {
  data() {
    return {
      detailData: {},
      goodsId: this.$route.params.id,
      isBegin: false
    };
  },
  computed: {},
  components: {
    GroupItem,
    appPage,
    appHeader,
    appBox,
    appBody
  },
  beforeDestroy() {},
  methods: {
    // 获取商品信息
    getDetailData() {
      let resGoods = {};
      let isSuccess = false;
      return new Promise(resolve => {
        this.$loading.open();
        service
          .goodsDetail({
            gid: this.goodsId
          })
          .then(
            res => {
              if (res.success) {
                resGoods = res.data.data || {};
                resGoods.is_collect = resGoods.is_collect || false;
                this.detailData = resGoods;
                isSuccess = true;
              } else {
                this.$toast(res.data.msg || "数据异常，请刷新重试！");
              }
            },
            err => {}
          )
          .finally(() => {
            this.$loading.close();
            resolve(isSuccess);
          });
      });
    },
    // 显示图片预览
    showBannerList(idx, srcList) {
      this.$root.imagePreview(idx, srcList);
    },
    // 去往订单确认页
    toCheckOrder(isGroup) {
      if (!this.isBegin) {
        return this.$toast("活动暂未开始！");
      }
      trackEvent(
        `${this.$route.name}-orderCheck`,
        "click",
        isGroup ? "group" : "buy"
      );
      this.$router.push({
        name: "orderCheck",
        params: { id: this.goodsId },
        query: { group: isGroup ? 1 : 0 }
      });
    },
    pathTo(path) {
      this.$router.push(path);
    },
    // 收藏／取消收藏商品
    collectGood() {
      let isCollect = this.detailData.is_collect;
      service
        .collectGoods({
          gid: this.goodsId
        })
        .then(res => {
          if (res.success) {
            this.$successToast(isCollect ? "已取消收藏" : "收藏成功");
            this.detailData.is_collect = !this.detailData.is_collect;
          } else {
            this.$toast(res.data.msg || "操作失败");
          }
        });
    },
    // 分享
    share() {
      this.$root.shareMsg("把好货分享给小伙伴一起开团吧！", null, "appMessage");
    },
    // 分享设置
    shareSetting() {
      let vm = this;
      let shareInfo = {
        title: vm.detailData.name,
        desc: `[${vm.detailData.gprice / 100}元]${vm.detailData.brief}`,
        link: window.location.href,
        imgUrl: vm.detailData.index_img || vm.detailData.album[0]
      };
      appShareTimeline(
        shareInfo,
        () => {
          this.$toast("分享成功");
        },
        () => {
          this.$toast("取消分享");
        }
      );
      appShareMessage(
        shareInfo,
        () => {
          this.$toast("分享成功");
        },
        () => {
          this.$toast("取消分享");
        }
      );
    },
    // 计算当前活动是否已经开始
    checkBegin() {
      let beginTime = this.detailData.begin_time || "";
      if (!beginTime) {
        return;
      }
      let beginDate = utils.convertToDate(beginTime);
      let nowDate = new Date();
      this.isBegin = beginDate * 1 <= nowDate * 1;
    }
  },
  mounted() {
    this.getDetailData().then(isSuccess => {
      if (!isSuccess) {
        return;
      }
      if (!this.$refs || !this.$refs.previewImg) {
        return;
      }
      this.$refs.previewImg.onclick = e => {
        if (e.target.tagName == "IMG" && e.target.src) {
          this.showBannerList(0, [e.target.src]);
        }
      };
      this.checkBegin();
      this.shareSetting();
    });
  }
};
</script>


<style lang="less" scoped>
.good-price-box {
  padding: 10px 15px;
  .good-price {
    font-size: 28px;
    color: #f60;
    span {
      display: inline-block;
      font-size: 14px;
      padding-right: 3px;
    }
    span.del-line {
      padding-left: 5px;
      color: #999;
      padding-right: 0;
    }
  }
  .good-group {
    font-size: 14px;
    color: #666;
  }
  .good-share {
    a {
      text-decoration: none;
      color: #999;
      i {
        display: block;
        font-size: 20px;
      }
    }
  }
}

.good-title,
.good-description {
  padding: 0 15px;
  border-bottom: 0.04rem solid #ccc;
}
.good-title {
  padding-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}
.good-label {
  padding: 10px 15px;
}
.good-album {
  height: 350px;
  .coverImg {
    width: 100%;
    height: 100%;
  }
}
.good-section {
  background-color: #fff;
  border-top: 0.04rem solid #ccc;
  border-bottom: 0.04rem solid #ccc;
  > header {
    padding: 10px 15px;
    border-bottom: 0.04rem solid #ccc;
  }
}

.icon-circle-warpper {
  display: inline-block;
  width: 15px;
  height: 15px;
  line-height: 1;
  border: 1px solid #e04e3b;
  border-radius: 50%;
  color: #e04e3b;
  font-size: 13px;
  text-align: center;
  vertical-align: middle;
  margin-top: -2px;
  margin-left: 3px;
  &:first-child {
    margin-left: 0;
  }
}

.bottom-float-buy-box {
  border-top: 0.04rem solid #ccc;
  height: 50px;
  > * {
    position: relative;
  }
  .nav-btn,
  .nav-buy,
  .nav-group-buy {
    height: inherit;
    background-color: #fff;
    a {
      display: block;
      color: #fff;
      height: inherit;
      text-decoration: none;
      transition: all 0.2s ease;

      span {
        width: 100%;
      }
      i {
        display: block;
        font-size: 20px;
        margin-bottom: 1px;
      }
    }
  }
  .nav-btn {
    width: 70px;
    a {
      color: #333;
      &:active {
        opacity: 0.6;
        transition: all 0.2s ease;
      }
    }
    &:first-child {
      border-right: 0.04rem solid #ccc;
    }
  }
  .nav-buy {
    background-color: #bfbfbf;
    a:active {
      background-color: #9f9f9f;
      transition: all 0.2s ease;
    }
  }
  .nav-group-buy {
    background-color: #f95959;
    a:active {
      background-color: #ea3d3d;
      transition: all 0.2s ease;
    }
  }
}
</style>


