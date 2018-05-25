<template>
  <div class="group-cell-item">
    <div class="app-flex app-flex-center app-flex-full">
      <div>
        <div class="coverImg" :style="{'backgroundImage': `url(${groupData.avatar_url})`}"></div>
      </div>
      <div class="col-1">
        <div class="">{{groupData.nick_name}}</div>
        <div class="group-info">还差{{groupCount - groupData.now_num}}人，剩余{{countDownTime}}</div>
      </div>
      <div>
        <mt-button type="danger" size="small" class="mini-size" plain @click="pathToJoinGroup">去参团</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    groupData: {
      type: Object,
      default() {
        return {};
      }
    },
    groupCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      countDownInstance: null,
      countDownSecond: 0
    };
  },
  computed: {
    countDownTime() {
      let h = this.limitTimeLen(~~(this.countDownSecond / 60 / 60));
      let m = this.limitTimeLen(~~((this.countDownSecond - h * 60 * 60) / 60));
      let s = this.limitTimeLen(~~(this.countDownSecond % 60));
      return `${h}:${m}:${s}`;
    }
  },
  methods: {
    // 跳转组团详情页面
    pathToJoinGroup() {
      this.$router.push({
        name: "groupDetail",
        params: { id: this.groupData.order_id }
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
    // 长度限制
    limitTimeLen(str) {
      return ((str + "").length < 2 ? "0" : "") + str;
    }
  },
  beforeDestroy() {
    this.countDownInstance && clearTimeout(this.countDownInstance);
    this.countDownInstance = null;
  },
  mounted() {
    this.countDownSecond = Math.abs(this.groupData.left_time * 1);
    this.countDown();
  }
};
</script>

<style lang="less" scoped>
.group-cell-item {
  padding: 10px 15px;
  border-bottom: 0.04rem solid #ccc;
  &:last-child {
    border-bottom: 0;
  }
  .coverImg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .col-1 {
    padding: 0 15px;
    font-size: 14px;
    .group-info {
      color: #666;
      margin-top: 3px;
      font-size: 12px;
    }
  }
}
</style>


