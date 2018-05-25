<template>
  <app-page>
    <app-header title="修改手机号"></app-header>
    <app-body>
      <div class="marginT-10">
        <mt-cell title="手机号">
          <div>
            <input v-model="phoneNo" class="text-right" type="number" placeholder="请输入手机号">
          </div>
        </mt-cell>
      </div>
    </app-body>
    <app-box class="padding-10 bg-white">
      <mt-button size="small" @click.native="confirmEdit" type="danger" class="full-width"><span class="font-16">确定修改</span></mt-button>
    </app-box>
  </app-page>
</template>

<script>
import { appPage, appHeader, appBox, appBody } from "@/components";
import { mapMutations, mapGetters, mapActions } from "vuex";
import service from "@/service";
import reg from "@/utils/reg";

export default {
  data() {
    return {
      phoneNo: ""
    };
  },
  components: {
    appPage,
    appHeader,
    appBox,
    appBody
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    ...mapMutations(["UPDATE_USER_INFO"]),
    ...mapActions(["getUserInfoAction"]),
    // 确认更新
    confirmEdit() {
      if (reg.regEmpty(this.phoneNo)) {
        return this.$infoToast("手机号码不能为空！");
      }
      if (!reg.regTest(this.phoneNo, "mobile")) {
        return this.$infoToast("手机号码不合法！");
      }
      this.$confirm("是否更新手机号？").then(this.updateUserInfo, () => {});
    },
    // 更新手机号码
    updateUserInfo() {
      this.$loading.open("数据更新中...");
      service
        .modifyUserData({
          mobile: this.phoneNo
        })
        .then(
          res => {
            if (res.success) {
              this.$successToast("修改成功");
              this.phoneNo && this.UPDATE_USER_INFO({ mobile: this.phoneNo });
              this.$router.go(-1);
            } else {
              this.$errorToast(res.data.msg || "修改失败");
            }
          },
          err => {
            this.$alert(err);
          }
        )
        .finally(this.$loading.close);
    },
    // 获取服务器或者缓存的手机信息
    getPhoneNo() {
      return new Promise(resolve => {
        this.$loading.open("信息获取中...");
        this.getUserInfoAction(false).then(res => {
          this.$loading.close();
          if (res.mobile) {
            this.phoneNo = res.mobile;
            return resolve();
          }
        });
      });
    }
  },
  mounted() {
    this.getPhoneNo();
  }
};
</script>


<style lang="less" scoped>

</style>
