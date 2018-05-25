<template>
  <div class="app-flex app-flex-center app-flex-full"><div>
      <a href="javascript:;" class="btn-count-ctrl" :class="{'disabled': isMin}" @click="setCount('-')">
        <i class="icon-remove2 box-center"></i>
      </a>
    </div>
    <div class="col-1">
      <input type="text" class="text-center input-count" :value="inlineNumberValue" readonly>
    </div>
    <div>
      <a href="javascript:;" class="btn-count-ctrl" :class="{'disabled': isMax}" @click="setCount('+')">
        <i class="icon-add box-center"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    max: {
      type: Number
    },
    min: {
      type: Number
    },
    value: {
      default: 0,
      required: true,
      type: Number
    }
  },
  watch: {
    inlineNumberValue(v) {
      this.$emit("input", v);
      this.$emit("change");
    }
  },
  data() {
    return {
      inlineNumberValue: this.value || 0,
      isMin: false,
      isMax: false
    };
  },
  methods: {
    // 数据加减
    setCount(actionType) {
      if (actionType == "+") {
        this.inlineNumberValue < this.max && this.inlineNumberValue++;
      } else {
        this.inlineNumberValue > this.min && this.inlineNumberValue--;
      }
      this.checkMax();
      this.checkMin();
    },
    // 检查是否最小值
    checkMin() {
      this.isMin = false;
      if (this.min != undefined && this.inlineNumberValue <= this.min) {
        this.inlineNumberValue = this.min;
        this.isMin = true;
      }
    },
    // 检查是否最大值
    checkMax() {
      this.isMax = false;
      if (this.max != undefined && this.inlineNumberValue >= this.max) {
        this.inlineNumberValue = this.max;
        this.isMax = true;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.checkMin();
      this.checkMax();
    });
  }
};
</script>

<style lang="less" scoped>
.input-count {
  display: block;
  width: 100%;
}
.btn-count-ctrl {
  display: block;
  width: 26px;
  height: 26px;
  text-decoration: none;
  background-color: #eee;
  position: relative;
  text-align: center;
  transition: all 0.3s ease;
  i {
    font-size: 18px;
    color: #666;
  }
  &:active {
    opacity: 0.8;
    transition: all 0.3s ease;
  }
  &.disabled {
    i {
      color: #ccc;
    }
  }
}
</style>


