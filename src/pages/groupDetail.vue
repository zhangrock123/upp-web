<template>
  <app-page>
    <app-header :is-force-index="isFromPay" title="拼团详情"></app-header>
    <app-body>
      <header class="bg-white padding-15 marginB-10 borderB">
        <good-cell-box is-link is-order :no-display="{'orderTime': true,'num':true}" :good-data="groupData"></good-cell-box>
      </header>
      <section class="bg-white borderT borderB padding-15 marginB-10 text-center">
        <header class="marginB-10">
          <div class="text-center">
            <template v-for="groupIndex in groupData.group_num">
              <div :key="groupIndex" class="memberAvatar coverImg" :style="{'backgroundImage':`url('${groupData.groupMember && groupData.groupMember[groupIndex-1]?groupData.groupMember[groupIndex-1].avatar_url:''}')`}"></div>
            </template>
          </div>
          <div class="marginT-5" v-if="groupData.order_status == 2">
            <span v-if="countDownSecond && groupData.left_num">
              仅剩<span class="color-ui">{{groupData.left_num}}</span>个名额，{{countDownTime}}后结束
            </span>
            <span v-if="!countDownSecond && groupData.left_num">
              拼团失效
            </span>
            <span v-if="!groupData.left_num">
              拼团人数已满
            </span>
          </div>
          <div class="marginT-5" v-if="groupData.order_status == 3">
            <span>拼团成功</span>
          </div>
          <div class="marginT-5" v-if="groupData.order_status == 4 ||groupData.order_status == 5||groupData.order_status == 6">
            <span>拼团失败</span>
          </div>
        </header>
        <section v-if="groupData.order_status == 2">
          <template v-if="isJoin">
            <mt-button @click.native="shareFriend" class="block full-width marginB-10" type="danger" size="large">分享给好友</mt-button>
            <mt-button @click.native="shareTimeLine" class="block full-width marginB-10" type="danger" size="large">分享到朋友圈</mt-button>
          </template>
          <template v-else>
            <mt-button v-if="groupData.left_num" @click.native="openGroup(this,true)" class="block full-width marginB-10" type="danger" size="large">一键参团</mt-button>
            <mt-button @click.native="openGroup(this,false)" class="block full-width"  type="danger" size="large">
              <span v-if="!groupData.left_num">我要开团</span>
              <span v-else>一键开团</span>
            </mt-button>
          </template>
        </section>
        <section v-if="groupData.order_status == 3">
          <template v-if="isJoin">
            <mt-button @click.native="pathToIndex" class="block full-width marginB-10" type="danger" size="large">去首页逛逛</mt-button>
            <mt-button @click.native="dateToCall" class="block full-width marginB-10" type="danger" size="large">预约打电话</mt-button>
          </template>
          <template v-else>
            <mt-button @click.native="openGroup(this,false)" class="block full-width marginB-10" type="danger" size="large">一键开团</mt-button>
          </template>
        </section>
        <section v-if="groupData.order_status == 4 || groupData.order_status == 5 || groupData.order_status == 6">
            <mt-button @click.native="openGroup(this,false)" class="block full-width marginB-10" type="danger" size="large">一键开团</mt-button>
        </section>
      </section>
      <section class="good-section bg-white borderT borderB">
        <header class="paddingLR-15 paddingB-10 paddingT-10">商品详情</header>
        <section class="goods-detail-section" ref="previewImg" v-html="groupData.goodsInfo && groupData.goodsInfo.intro?groupData.goodsInfo.intro:''">
        </section>
      </section>
    </app-body>
  </app-page>
</template>

<script>
import { appPage, appHeader, appBody, GoodCellBox } from "@/components";
import service from "@/service";
import { appShareMessage, appShareTimeline } from "@/utils/shareSdk";

export default {
  data() {
    return {
      isFromPay: this.$route.query.check == "1",
      groupData: {},
      groupId: this.$route.params.id,
      countDownSecond: 0,
      countDownInstance: null,
      isJoin: false
    };
  },
  computed: {
    // 格式化拼团倒计时时间
    countDownTime() {
      let h = this.limitTimeLen(~~(this.countDownSecond / 60 / 60));
      let m = this.limitTimeLen(~~((this.countDownSecond - h * 60 * 60) / 60));
      let s = this.limitTimeLen(~~(this.countDownSecond % 60));
      return `${h}:${m}:${s}`;
    }
  },
  components: {
    GoodCellBox,
    appPage,
    appHeader,
    appBody
  },
  methods: {
    // 获取拼团信息
    getGroupData() {
      let isSuccess = false;
      return new Promise(resolve => {
        this.$loading.open();
        service
          .groupDetail({
            oid: this.groupId
          })
          .then(
            res => {
              if (res.success) {
                this.groupData = res.data.data || {};
                this.isJoin = !!this.groupData.is_self;
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
    // 倒计时
    countDown() {
      this.countDownSecond > 0 &&
        (this.countDownInstance = setTimeout(this.setCountDownTime, 1000));
    },
    // 设置倒计时时间
    setCountDownTime() {
      if (this.countDownSecond > 0) {
        this.countDownSecond--;
        this.countDown();
      } else {
        clearTimeout(this.countDownInstance);
        this.countDownInstance = null;
        this.countDownSecond = 0;
      }
    },
    // 长度截取
    limitTimeLen(str) {
      return ((str + "").length < 2 ? "0" : "") + str;
    },
    // 开团／参团跳转
    openGroup(e, isJoin = false) {
      let query = { group: 1 };
      isJoin && (query.groupid = this.groupId);
      this.$router.push({
        name: "orderCheck",
        params: { id: this.groupData.good_id },
        query
      });
    },
    // 分享公用方法
    baseShare(isShareTimeline = false) {
      let vm = this;
      let shareService = isShareTimeline ? appShareTimeline : appShareMessage;
      shareService(
        {
          title: vm.groupData.good_name,
          desc: `[${vm.groupData.good_price / 100}元]还差${
            vm.groupData.left_num
          }人，快来和我一起拼吧！`,
          link: window.location.href,
          imgUrl: vm.groupData.good_img
        },
        () => {
          this.$toast("分享成功");
        },
        () => {
          this.$toast("取消分享");
        }
      );
    },
    // 分享好友
    shareFriend() {
      this.$root.shareMsg(
        `还差${this.groupData.left_num}人，点击右上角分享给小伙伴一起拼团吧！`,
        null,
        "appMessage"
      );
    },
    // 分享朋友圈
    shareTimeLine() {
      this.$root.shareMsg(
        `还差${this.groupData.left_num}人，点击右上角分享给小伙伴一起拼团吧！`,
        null,
        "timeline"
      );
    },
    // 拨打预约电话
    dateToCall() {
      window.location.href = "tel://4001888733";
    },
    // 跳转主页
    pathToIndex() {
      this.$router.push("/");
    }
  },
  beforeDestroy() {
    this.countDownInstance && clearTimeout(this.countDownInstance);
  },
  mounted() {
    this.getGroupData().then(isSuccess => {
      if (!isSuccess || !this.groupData || !this.groupData.id) {
        return;
      }
      this.$refs.previewImg.onclick = e => {
        if (e.target.tagName == "IMG" && e.target.src) {
          this.$root.imagePreview(0, [e.target.src]);
        }
      };
      if (this.groupData.order_status == 2 && this.groupData.left_num) {
        this.countDownSecond = Math.abs(this.groupData.left_time * 1);
        this.countDownSecond && this.countDown();
      }
      if (this.groupData.order_status == 2 && this.isJoin) {
        this.baseShare(true);
        this.baseShare(false);
      }
    });
  }
};
</script>

<style lang="less" scoped>
.memberAvatar {
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 0.04rem solid #ccc;
  margin: 0 5px;
  position: relative;
  &:first-child:after {
    content: "团长";
    position: absolute;
    left: -5px;
    top: -5px;
    display: inline-block;
    padding: 1px 6px;
    background-color: #f60;
    color: #fff;
    border-radius: 4px;
    font-size: 10px;
  }
}
</style>
