<template>
  <mt-popup
    v-model="visible"
    class="full-screen"
    position="bottom"
    :closeOnClickModal="false"
    :modal="false">
    <app-page>
      <app-header :title="bindMobileType==2?'绑定手机号':'更换手机号'" hide-left>
        <mt-button @click.native="closeBindPopup" slot="right">
          关闭
        </mt-button>
      </app-header>
      <app-body class="bg-white">
        <div v-if="userInfo && userInfo.mobile" class="origin-mobile">
          当前绑定手机号: {{userInfo.mobile}}
        </div>
        <login-box :action-type.sync="bindMobileType" @submit="closeBindPopup" ref="loginBox"></login-box>
      </app-body>
    </app-page>
  </mt-popup>
</template>
<script>
import { appPage, appHeader, appBody, LoginBox } from "@/components";
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      visible: false
    };
  },
  watch: {
    bindMobileType() {
      this.visible = !!this.bindMobileType;
    }
  },
  components: {
    LoginBox,
    appPage,
    appHeader,
    appBody
  },
  computed: {
    ...mapGetters(["bindMobileType", "userInfo"])
  },
  methods: {
    ...mapMutations(["UPDATE_BIND_MOBILE_TYPE"]),
    // 关闭登录弹窗
    closeBindPopup() {
      this.UPDATE_BIND_MOBILE_TYPE(0);
      this.$refs.loginBox.init();
    }
  },
  mounted() {
    this.visible = !!this.bindMobileType;
  }
};
</script>
<style lang="less" scoped>
.origin-mobile {
  margin: 15px 30px -15px;
  padding-bottom: 10px;
  font-size: 15px;
  color: #808080;
  text-align: center;
  border-bottom: 1px dashed #eee;
}
</style>

