<template>
  <mt-popup
    v-model="visible"
    class="full-screen"
    position="bottom"
    :closeOnClickModal="false"
    :modal="false">
    <app-page>
      <app-header title="日期选择" hide-left>
        <mt-button @click.native="closePopup" slot="right">
          关闭
        </mt-button>
      </app-header>
      <app-box class="calendar-header bg-white paddingLR-10">
        <div class="app-flex app-flex-full app-flex-center col-1">
          <div v-for="(workDay, $workDayIndex) in dayList" class="text-center" :key="$workDayIndex">{{workDay}}</div>
        </div>
      </app-box>
      <app-body class="bg-white paddingLR-10">
        <div class="app-content calendar-content">
            <div class="calendar-body bg-card">
                <div v-for="(list, $listIndex) in dateList" :key="$listIndex">
                    <header class="text-header">{{list.title}}</header>
                    <section>
                        <div v-for="(dateOption, $dateOptionIndex) in list.dateDetail" :key="$dateOptionIndex" class="text-nav">
                            <span v-if="selectType==1" class="" :class="{'disabled':dateOption.disabled, 'start':dateOption.checkStateCode==2,'on':dateOption.checkStateCode==3,'end':dateOption.checkStateCode==4 }" @click="setRangeDate(dateOption)">{{dateOption.day || '&nbsp;'}}</span>
                            <span v-if="!selectType" :class="{'disabled':dateOption.disabled, 'checked': dateOption.checkStateCode ==5}" @click="setSingleDate(dateOption)">{{dateOption.day || '&nbsp;'}}</span>
                        </div>
                        <i></i>
                    </section>
                </div>
            </div>
        </div>
      </app-body>
    </app-page>
  </mt-popup>
</template>
<script>
import { appPage, appHeader, appBody, appBox } from "@/components";
import widgetDate from "@/utils/widgetDate";

export default {
  props: {
    selectType: {
      type: Number,
      default: 1 // 0 单选  1 区间选
    },
    value: {
      required: true,
      type: Array
    },
    visible: {
      type: Boolean,
      default: false
    },
    limitDay: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      showCalendarCount: 12, //设置月份数
      curDate: new Date(),
      dateList: [],
      dayList: widgetDate._dicts.workDayName.cn_1,
      curDateStr: "",
      curStartDate: null,
      curEndDate: null,
      defaultDate: this.value || []
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this.initDefaultDate();
      }
    },
    value() {},
    defaultDate(v) {
      this.$emit("input", v);
      this.$emit("close");
    }
  },
  components: {
    appPage,
    appHeader,
    appBody,
    appBox
  },
  computed: {},
  methods: {
    closePopup() {
      this.$emit("close");
    },
    initDefaultDate() {
      this.curStartDate = this.curEndDate = "";
      if (this.defaultDate && this.defaultDate.length) {
        let _d = [...this.defaultDate];
        this.curStartDate = _d[0];
        this.curEndDate = _d[1] || _d[0];
        this[
          this.selectType == 1
            ? "setRangeDataCheckStateCode"
            : "setSingleDataCheckStateCode"
        ]();
      } else {
        this.setSingleDataCheckStateCode();
      }
    },
    // 设置用于显示的数据列表
    setDateList() {
      let dateDict = {};
      let startDate = new Date(this.curDate);
      let startDateFirstDay = widgetDate._curMonth(startDate);
      let _dateList = [];
      for (let i = 0; i < this.showCalendarCount; i++) {
        i > 0 && (startDateFirstDay = widgetDate._nextMonth(startDateFirstDay));
        dateDict = {
          firstDay: startDateFirstDay,
          days: widgetDate._monthHaveDays(startDateFirstDay),
          dateDay: startDateFirstDay.getDay(),
          year: startDateFirstDay.getFullYear(),
          month: startDateFirstDay.getMonth() + 1,
          title: "",
          loopDays: 0,
          dateDetail: []
        };
        dateDict.loopDays =
          dateDict.days +
            (dateDict.dateDay > 0 && dateDict.dateDay < 7
              ? dateDict.dateDay
              : 0) <=
          35
            ? 35
            : 42;
        dateDict.title = `${widgetDate._monthName(startDateFirstDay, "cn_1")} ${
          dateDict.year
        }`;
        dateDict.dateDetail = this._getListDateDetail(dateDict);
        _dateList.push(dateDict);
        dateDict = {};
      }
      this.dateList = _dateList;
    },
    // 获取用于显示的时间的列表
    _getListDateDetail(dateObj) {
      let dateResource = 0;
      let resList = [];
      let resDict = {};
      let diff = dateObj.dateDay;
      7 == diff && (diff = 0);
      for (let i = 0; i < dateObj.loopDays; i++) {
        if (i >= diff && dateResource < dateObj.days) {
          dateResource++;
          resDict = {
            day: widgetDate._dateTwoNum(dateResource),
            date: `${dateObj.year}${widgetDate._dateTwoNum(
              dateObj.month
            )}${widgetDate._dateTwoNum(dateResource)}`,
            checkStateCode: 1, //checkStateCode => 1 normal 2 start  3 on  4 end 5 checked
            disabled: false
          };
          resDict.disabled = resDict.date * 1 < this.curDateStr * 1;
        }
        resList.push(resDict);
        resDict = {};
      }
      return resList;
    },
    // 点击设置单个日期
    setSingleDate(obj) {
      if (obj.disabled || !obj.date || obj.checkStateCode == 5) return;
      this.curStartDate = this.curEndDate = obj.date;
      this.setSingleDataCheckStateCode();
      if (this.curStartDate && this.curEndDate) {
        this.emitSubmitData();
      }
    },
    // 设置单个显示状态
    setSingleDataCheckStateCode() {
      let vm = this;
      this.dateList.forEach(function(dateOptionList, i) {
        dateOptionList.dateDetail.forEach(function(dateOption, j) {
          dateOption.checkStateCode =
            dateOption.date == vm.curStartDate ? 5 : 1;
        });
      });
    },
    // 点击设置日期区间
    setRangeDate(obj) {
      if (obj.disabled || (!obj.date && !obj.checkStateCode)) return;
      if (
        !this.curEndDate &&
        this.curStartDate &&
        this.curStartDate < obj.date
      ) {
        if (this.isLargerThanLimit(this.curStartDate, obj.date)) {
          return this.$infoToast(`您只能选不超过${this.limitDay}天的日期！`);
        }
        this.curEndDate = obj.date;
      } else {
        this.curStartDate = obj.date;
        this.curEndDate = "";
      }
      this.setRangeDataCheckStateCode();
      if (this.curStartDate && this.curEndDate) {
        this.emitSubmitData();
      }
    },
    // 判断区间选择是否超过限制的最大天数
    isLargerThanLimit(startStr, endStr) {
      let startDate = widgetDate._plainDate(startStr);
      let endDate = widgetDate._plainDate(endStr);
      let diffDays = widgetDate._diff(startDate, endDate, "d");
      return diffDays+1 > this.limitDay;
    },
    // 设置区间显示状态
    setRangeDataCheckStateCode() {
      if (!this.curStartDate) return;
      var stateCode = 0;
      this.dateList.forEach((dateOptionList, i) => {
        dateOptionList.dateDetail.forEach((dateOption, j) => {
          if (!dateOption.disabled && dateOption.date) {
            //checkStateCode => 1 normal 2 start  3 on  4 end
            if (dateOption.date == this.curStartDate) {
              //开始时间
              stateCode = 2;
            } else if (dateOption.date == this.curEndDate) {
              //结束时间
              stateCode = 4;
            } else if (
              this.curStartDate &&
              this.curStartDate &&
              dateOption.date > this.curStartDate &&
              dateOption.date < this.curEndDate
            ) {
              //开始/结束之间的
              stateCode = 3;
            } else {
              //正常状态
              stateCode = 1;
            }
            this.dateList[i].dateDetail[j].checkStateCode = stateCode;
          }
        });
      });
    },
    emitSubmitData() {
      this.defaultDate = [this.curStartDate, this.curEndDate];
    }
  },
  mounted() {
    // this.showPopup();
    this.curDateStr = widgetDate._dateToStr(this.curDate, "yyyyMMdd", true);
    this.setDateList();
    this.initDefaultDate();
  }
};
</script>
<style lang="less" scoped>
.calendar-header {
  height: 50px;
  border-bottom: 0.05rem solid #eee;
}
.calendar-content .calendar-body {
  * {
    text-align: center;
  }
  header {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: 400;
  }
  section {
    width: 100%;
    div {
      float: left;
      width: 14.285714285714286%;
      margin-bottom: 5px;
      span {
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 14px;
        &.start,
        &.end {
          background-color: #f95959;
          color: #fff;
          line-height: 18px;
          border-radius: 6px 0 0 6px;
          font-size: 12px;
          &:before {
            content: "开始";
            display: block;
            line-height: 20px;
            padding-top: 6px;
            font-size: 14px;
          }
        }
        &.end {
          border-radius: 0 6px 6px 0;
          &:before {
            content: "结束";
          }
        }
        &.on {
          color: #f00;
          background-color: RGBA(254, 89, 92, 0.1);
        }
        &.checked {
          background-color: #f95959;
          color: #fff;
          border-radius: 6px;
        }
        &.disabled {
          color: #ccc;
        }
      }
    }
    i {
      display: block;
      width: 1px;
      height: 1px;
      clear: both;
    }
  }
}
</style>

