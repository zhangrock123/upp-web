<template>
  <div class="group-card-item card-shadow" :class="{'disabled': !goodData.is_begin}">
    <header class="coverImg" :style="{'backgroundImage': `url(${goodData.index_img})`}">
      <div class="card-title-box">
        <span class="text-cut2">{{goodData.sub_name || ''}}</span>
      </div>
      <div class="card-price-box">
        <div class="app-flex app-flex-center app-flex-full">
          <div class="card-origin-price">
            <span>¥</span>{{goodData.gprice/100}}
          </div>
          <div class="col-1">
            <div class="del-line">¥{{goodData.mprice/100}}</div>
            <div>已拼{{goodData.sale_num}}{{goodData.unit}}</div>
          </div>
          <div class="card-arrow-left"></div>
          <div class="card-expire">
            <div v-if="goodData.is_begin" class="box-center">
              <header>结束时间</header>
              <section>{{goodData.end_date}}</section>
            </div>
            <div v-else class="box-center">
              即将上线
            </div>
          </div>
        </div>
      </div>
    </header>
    <section>
      <div class="app-flex app-flex-full app-flex-center">
        <div class="col-1 text-cut3">
          {{goodData.name}}
        </div>
        <div class="paddingL-5">
          <mt-button v-if="goodData.is_begin" class="mint-button--ui" size="small" type="danger">我要开团</mt-button>
          <mt-button v-else class="mint-button--disabled" size="small" type="disabled">我要开团</mt-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    goodData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {
  }
};
</script>

<style lang="less" scoped>
.group-card-item {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
  > header {
    height: 185px;
    position: relative;
    .card-title-box {
      padding: 7px 15px;
      min-height: 30px;
      color: #fff;
      background: linear-gradient(#272727, transparent);
      * {
        font-size: 14px;
        line-height: 1.4;
      }
    }
    .card-price-box {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 50px;
      color: #fff;
      background-color: rgba(253, 146, 46, 0.88);
      * {
        font-size: 14px;
        line-height: 1.4;
      }
      .card-origin-price {
        padding: 0 15px;
        font-size: 30px;
        span {
          display: inline-block;
          padding-right: 3px;
          font-size: 14px;
        }
      }
      .card-arrow-left {
        width: 0;
        height: 0;
        border-top: 25px solid transparent;
        border-right: 12px solid #ffad00;
        border-bottom: 25px solid transparent;
      }
      .card-expire {
        height: 50px;
        width: 35%;
        background-color: #ffad00;
        position: relative;
        text-align: center;
        div {
          width: 100%;
        }
        section {
          background-color: rgba(0, 0, 0, 0.6);
          padding: 0px 8px;
          border-radius: 5px;
          display: inline-block;
        }
      }
    }
  }
  > section {
    padding: 10px 15px;
    background-color: #fff;
  }
  &.disabled {
    > header {
      .card-price-box {
        .card-arrow-left {
          border-right: 12px solid #bfbfbf;
        }
        .card-expire {
          background-color: #bfbfbf;
          div {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>


