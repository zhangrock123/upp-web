<template>
  <div class="padding-15">
    <div class="login-section padding-15">
      <div class="app-flex app-flex-center app-flex-full">
        <div class="section-icon">
          <i class="icon-mobile"></i>
        </div>
        <div class="col-1 section_input">
          <input type="number" v-model="loginInfo.mobile" placeholder="请输入手机号">
        </div>
      </div>
    </div>
    <div class="login-section padding-15">
      <div class="app-flex app-flex-center app-flex-full">
        <div class="section-icon">
          <i class="icon-key"></i>
        </div>
        <div class="col-1 section_input">
          <div class="app-flex app-flex-center app-flex-full">
            <div class="col-1">
              <input type="text" v-model="loginInfo.code" placeholder="请输入验证码">
            </div>
            <div class="section-verify-btn">
              <a href="javascript:;" class="font-15" :class="{'disabled':countDown.existSecond}" @click="getCode">
                {{countDown.btnName}}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="marginT-30">
      <mt-button @click.native="doSubmit" type="danger" size="large" class="width-full">
        <span class="font-18  block">{{actionData.submitBtnName}}</span>
      </mt-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import service from "@/service";
import md5 from "js-md5";
import reg from "@/utils/reg";
import utils from "@/utils";

export default {
  props: {
    actionType: {
      type: Number,
      default: 1 // 1 登录； 2 微信环境绑定手机号； 3 重新绑定手机号
    }
  },
  data() {
    return {
      countDownInstance: null,
      loginInfo: {
        mobile: "",
        code: ""
      },
      countDown: {
        limitSecond: 60,
        existSecond: 0,
        isDuringSending: false,
        btnName: "获取验证码"
      },
      actionData: {
        submitBtnName: "",
        submitService: ""
      }
    };
  },
  computed: {
    ...mapGetters(["trackInfo", "userInfo"])
  },
  watch: {
    actionType() {
      this.initActionData();
    }
  },
  methods: {
    ...mapActions(["fetchUnreadCouponAction"]),
    ...mapMutations(["UPDATE_USER_INFO"]),
    // 初始化
    init() {
      this.loginInfo = {
        mobile: "",
        code: ""
      };
      this.countDown.existSecond = 0;
      this.countDown.isDuringSending = false;
      this.countDown.btnName = "获取验证码";
      this.destroy();
    },
    // 检查输入字段合法性
    checkColumn(columnList) {
      // columnList => ['mobile','code']
      let res = { status: false, msg: "" };
      if (columnList.indexOf("mobile") != -1) {
        if (reg.regEmpty(this.loginInfo.mobile)) {
          res.msg = "手机号码不能为空！";
          return res;
        }
        if (!reg.regTest(this.loginInfo.mobile, "mobile")) {
          res.msg = "手机号码不合法！";
          return res;
        }
        if (
          this.actionType == 3 &&
          this.userInfo.mobile == this.loginInfo.mobile
        ) {
          res.msg = "输入手机号码和当前绑定号码一致！";
          return res;
        }
      }
      if (columnList.indexOf("code") != -1) {
        if (reg.regEmpty(this.loginInfo.code)) {
          res.msg = "验证码不能为空！";
          return res;
        }
      }
      res.status = true;
      return res;
    },
    // 获取验证码，进行倒计时
    getCode() {
      if (this.countDown.isDuringSending) {
        return;
      }
      if (this.countDown.existSecond) {
        return;
      }
      let checkStatus = this.checkColumn(["mobile"]);
      if (!checkStatus.status) {
        return this.$infoToast(checkStatus.msg);
      }
      this.countDown.existSecond = this.countDown.limitSecond;
      this.sendCode().then(this.doCountDown, () => {});
    },
    // 获取发送验证码的auth code
    getAuthCode() {
      // 手机号后9位做md5 => 取前6位 => 再做md5 返回
      let _base = (this.loginInfo.mobile + "").substr(2, 9);
      let _process = md5(_base).substr(0, 6);
      return md5(_process);
    },
    // 发送验证码
    sendCode() {
      this.countDown.isDuringSending = true;
      this.$loading.open("短信发送中...");
      return new Promise((resolve, reject) => {
        service
          .sendVerificationCode({
            mobile: this.loginInfo.mobile,
            auth: this.getAuthCode()
          })
          .then(
            res => {
              if (res.success) {
                this.$toast(`短信发送成功！`);
                res.data &&
                  res.data.data &&
                  res.data.data.code &&
                  this.setVerifyCode(res.data.data.code);
                resolve();
              } else {
                this.countDown.existSecond = 0;
                this.$toast(res.data.msg || "短信发送失败！");
                reject();
              }
            },
            err => {
              this.countDown.existSecond = 0;
              reject();
            }
          )
          .finally(() => {
            this.$loading.close();
            this.countDown.isDuringSending = false;
          });
      });
    },
    setVerifyCode(code) {
      if (!code) {
        return;
      }
      this.loginInfo.code = code;
    },
    // 设置倒计时文案
    doCountDown() {
      if (this.countDown.existSecond > 0) {
        this.countDown.btnName = `${this.countDown.existSecond}s后重新获取`;
        this.countDownInstance = setTimeout(this.setCountDownTime, 1000);
      } else {
        this.countDown.btnName = `获取验证码`;
      }
    },
    // 设置倒计时时间
    setCountDownTime() {
      if (this.countDown.existSecond > 0) {
        this.countDown.existSecond--;
        this.doCountDown();
      } else {
        clearTimeout(this.countDownInstance);
        this.countDownInstance = null;
        this.countDown.existSecond = 0;
      }
    },
    // 点击底部按钮
    doSubmit() {
      let checkStatus = this.checkColumn(["mobile", "code"]);
      if (!checkStatus.status) {
        return this.$infoToast(checkStatus.msg);
      }
      this[this.actionData.submitService]({
        mobile: this.loginInfo.mobile,
        code: this.loginInfo.code
      });
    },
    // 用户登录
    userLogin(param) {
      this.$loading.open("登录中...");
      this.trackInfo &&
        (param = {
          ...param,
          track_scene: this.trackInfo.scene,
          track_data: this.trackInfo.data
        });
      service
        .userLogin(param)
        .then(
          res => {
            if (res.success) {
              if (res.data.data.token) {
                this.UPDATE_USER_INFO({ ...res.data.data });
                utils.setCookie("_token", res.data.data.token);
                this.fetchUnreadCouponAction();
              }
              this.$emit("submit");
            } else {
              this.$toast(res.data.msg || "登录失败！");
            }
          },
          err => {}
        )
        .finally(this.$loading.close);
    },
    // 绑定或变更手机号
    bindOrChangeMobile(param) {
      this.$loading.open("绑定中...");
      service
        .modifyUserData(param)
        .then(
          res => {
            if (res.success) {
              if (res.data.data.token) {
                this.UPDATE_USER_INFO({ ...res.data.data });
                utils.setCookie("_token", res.data.data.token);
              }
              this.$toast("绑定成功！");
              this.$emit("submit");
            } else {
              this.$toast(res.data.msg || "登录失败！");
            }
          },
          err => {}
        )
        .finally(this.$loading.close);
    },
    // 销毁定时器
    destroy() {
      this.countDownInstance && clearTimeout(this.countDownInstance);
      this.countDownInstance = null;
    },
    // 初始化按钮名称和服务名
    initActionData() {
      // 1 登录； 2 微信环境绑定手机号； 3 重新绑定手机号
      switch (this.actionType) {
        case 2:
          this.actionData = {
            submitBtnName: "确认绑定",
            submitService: "bindOrChangeMobile"
          };
          break;
        case 3:
          this.actionData = {
            submitBtnName: "确认更换",
            submitService: "bindOrChangeMobile"
          };
          break;
        default:
          this.actionData = {
            submitBtnName: "登录",
            submitService: "userLogin"
          };
          break;
      }
    }
  },
  beforeDestroy() {
    this.destroy();
  },
  mounted() {
    this.init();
    this.initActionData();
  }
};
</script>

<style lang="less" scoped>
.login-section {
  height: 40px;
  box-sizing: content-box;
  .section-icon {
    padding-top: 10px;
    width: 30px;
    text-align: center;
    i {
      font-size: 20px;
      color: #bfbfbf;
    }
  }
  .section_input {
    padding-bottom: 1px;
    border-bottom: 0.04rem solid #cecccc;
    .section-verify-btn {
      border-left: 0.04rem solid #ddd;
      a {
        display: block;
        height: 30px;
        line-height: 30px;
        color: #f95959;
        text-align: center;
        text-decoration: none;
        min-width: 120px;
        &.disabled {
          color: #999;
        }
      }
    }
  }
  input {
    height: 40px;
    border: 0;
    margin: 0 10px;
    display: block;
    box-sizing: border-box;
    width: 100%;
    font-size: 15px;
  }
}
</style>

