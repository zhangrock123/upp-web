<template>
  <app-page>
    <app-header title="登录椰子来了"></app-header>
    <app-body class="bg-white">
      <login-box @submit="loginCallback"></login-box>
    </app-body>
  </app-page>
</template>
<script>
import { appPage, appHeader, appBody, LoginBox } from "@/components";
import { trackEvent } from "@/utils/track";

export default {
  data() {
    return {
      redirectPageName: this.$route.query.redirect || "index",
      query: this.$route.query.query,
      params: this.$route.query.params
    };
  },
  components: {
    LoginBox,
    appPage,
    appHeader,
    appBody
  },
  methods: {
    loginCallback() {
      trackEvent(`${this.$route.name}`, "click", "success");
      this.$router.replace({
        name: this.redirectPageName,
        query: JSON.parse(this.query),
        params: JSON.parse(this.params)
      });
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>

</style>
