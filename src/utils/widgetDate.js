module.exports = (function () {
  var widgetDate = function () {
    //所用字典
    this._dicts = {
      //毫秒为单位的时间换算数
      convertMs: {
        ms: 1,
        s: 1000,
        m: 1000 * 60,
        h: 1000 * 60 * 60,
        d: 1000 * 60 * 60 * 24
      },
      //涉及日期计算的Date属性(年月日时分秒)
      dateAttr: {
        yyyy: 'getFullYear',
        MM: 'getMonth',
        dd: 'getDate',
        hh: 'getHours',
        mm: 'getMinutes',
        ss: 'getSeconds'
      },
      //涉及日期计算的Date属性(年月日)
      dateYMD: {
        yyyy: 'getFullYear',
        MM: 'getMonth',
        dd: 'getDate'
      },
      //星期名称枚举
      workDayName: {
        cn_1: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        cn_2: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        cn_3: ['一', '二', '三', '四', '五', '六', '日'],
        en_1: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        en_2: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
      },
      //月份名称枚举
      monthName: {
        cn_1: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        cn_2: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        en_1: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        en_2: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
    }
  };

  widgetDate.prototype = {
		/**
		*	获取时间差 _diff
		*	@param	start	Date
		*	@param	end		Date
		*	@param	unit	String  // d =天 h =小时  m = 分钟 s =秒  ms=毫秒  null = ms=毫秒
		*/
    _diff: function (start, end, unit) {
      return (end.getTime() - start.getTime()) / (this._dicts.convertMs[unit || 'ms'] || 1);
    },
		/**
		*	时间串转日期 _strToDate
		*	@param	dateStr	String //支持分割符  年月日 -/ 时分秒 ：  eg：2016-1-1 11:11:11
		*/
    _strToDate: function (dateStr) {
      return this._arrToDate.call(this, dateStr.split(/\/|-|\s|:/g));
    },
		/**
		*	数组转日期 _arrToDate
		*	@param	dateArr	Array //[2016,05,11]
		*/
    _arrToDate: function (dateArr) {
      if (dateArr && !(dateArr instanceof Array)) return '';
      return eval('new Date(' + dateArr.join(',') + ')');
    },
		/**
		*	日期转时间串 _dateToStr
		*	@param	date	Date
		*	@param	format	String	//'yyyy-MM-dd hh:mm:ss'
		*	@param	isForceTwo	Boolean	//是否强制输出两位数
		*/
    _dateToStr: function (date, format, isForceTwo) {
      var self = this, res = '';
      return (format || 'yyyy-MM-dd').replace(/yyyy|MM|dd|hh|mm|ss/g, function ($1) {
        res = date[self._dicts.dateAttr[$1]]();
        if ('MM' == $1) res++;
        if (isForceTwo && $1 != 'yyyy') return self._dateTwoNum(res);
        return res;
      })
    },
		/**
		*	时间戳转时间串 _unixToStr
		*	@param	unixTime	String
		*	@param	format	String	//'yyyy-MM-dd hh:mm:ss'
		*	@param	isForceTwo	Boolean	//是否强制输出两位数
		*/
    _unixToStr: function (unixTime, format, isForceTwo) {
      var date = this._unixToDate.call(this, unixTime);
      return this._dateToStr.call(this, date, format, isForceTwo);
    },
		/**
		*	日期转字典表 _dateToDict
		*	@param	date	Date
		*	@param	isForceTwo	Boolean	//是否强制输出两位数
		*/
    _dateToDict: function (date, isForceTwo) {
      date = date || new Date();
      var dateInfo = {},
        dateAttr = this._dicts.dateAttr;
      for (var i in dateAttr)
        dateInfo[i] = (isForceTwo && 'yyyy' != i) ? this._dateTwoNum(date[dateAttr[i]]()) : date[dateAttr[i]]();
      return dateInfo;
    },
		/**
		*	工作日名称 _workDayName
		*	@param	date	Date
		*	@param	version	String // cn_1 cn_2 en_1 en_2
		*/
    _workDayName: function (date, version) {
      return this._dicts.workDayName[version || 'cn_1'][date.getDay()];
    },
		/**
		*	月份名称	_monthName
		*	@param	date	Date
		*	@param	version	String // cn_1 en_1 en_2
		*/
    _monthName: function (date, version) {
      return this._dicts.monthName[version || 'cn_1'][date.getMonth()];
    },
		/**
		*	时间戳转日期 _unixToDate
		*	@param	unixTime	String
		*/
    _unixToDate: function (unixTime) {
      return new Date((unixTime * 1e+3).toString().slice(0, 13) * 1)
    },
		/**
		*	月份含有的天数 _monthHaveDays
		*	@param date Date
		*/
    _monthHaveDays: function (date) {
      date = date || new Date();
      var self = this, nextMonth = this._nextMonth(date);
      return this._diff(self._curMonth(date), nextMonth, 'd');
    },
		/**
		*	上一个月的第一天 _prevMonth  或可用 _dateCalc
		*	@param date Date
		*/
    _prevMonth: function (date) {
      return this._dateCalc.call(this, date, 1);
    },
		/**
		*	下一个月的第一天 _nextMonth 或可用 _dateCalc
		*	@param date Date
		*/
    _nextMonth: function (date) {
      return this._dateCalc.call(this, date, 2);
    },
		/**
		*	当前月的第一天 _nextMonth 或可用 _dateCalc
		*	@param date Date
		*/
    _curMonth: function (date) {
      return this._dateCalc.call(this, date, null);
    },
		/**
		*	日期计算(上月/下月/当月的第一天) _dateCalc
		*	@param date Date
		*	@param type	number	// 1 上一月  2 下一月  其他 当前月
		*/
    _dateCalc: function (date, type) {
      date = date || new Date();
      var dateInfo = {},
        dateAttr = this._dicts.dateYMD;
      for (var i in dateAttr)
        dateInfo[i] = date[dateAttr[i]]();
      if (type == 1) {
        if (dateInfo.MM <= 0) {
          dateInfo.yyyy--;
          dateInfo.MM = 12;
        } else
          dateInfo.MM--;
      } else if (type == 2) {
        if (dateInfo.MM >= 11) {
          dateInfo.yyyy++;
          dateInfo.MM = 0;
        } else
          dateInfo.MM++;
      }
      return new Date(dateInfo.yyyy, dateInfo.MM, 1);
    },
		/**
		*	取字符串两位 _dateTwoNum
		*	@param	str	String
		*/
    _dateTwoNum: function (str) {
      return ((str + '').length < 2 ? '0' : '') + str;
    },
		/**
		*	当前日期最后一天 _lastDay
		*	@param	date Date
		*/
    _lastDay: function (date) {
      date = date || new Date();
      var dateInfo = {},
        dateAttr = this._dicts.dateYMD;
      for (var i in dateAttr)
        dateInfo[i] = date[dateAttr[i]]();
      dateInfo.dd = this._monthHaveDays(date);
      return new Date(dateInfo.yyyy, dateInfo.MM, dateInfo.dd);
    },
		/**
		*	没有分隔符的时间拆分年月日		_plainDateDict
		*	@param	plainDateStr	String	//20160108
		*/
    _plainDateDict: function (plainDateStr) {
      if (!plainDateStr) return plainDateStr;
      var reg = this._plainStrReg(plainDateStr, ',', true);
      plainDateStr = plainDateStr.toString().replace(reg.reg, reg.matches);
      var plainDateArr = plainDateStr.split(/,/g);
      plainDateArr[1]--;
      return plainDateArr;
    },
		/**
		*	没有分隔符的时间转Date		_plainDate
		*	@param	plainDateStr	String	//20160108
		*/
    _plainDate: function (plainDateStr) {
      plainDateStr += '';
      var plainDateArr = this._plainDateDict(plainDateStr) || '';
      return this._arrToDate.call(this, plainDateArr);
    },
		/**
		*	没有分隔符的时间转时间串		_plainDateStr
		*	@param	plainDateStr	String	//20160108
		*	@param	format			String	//'yyyy-MM-dd'
		*	@param	isNotDefault	boolean	//是否不需要按原拆分长度输出（是否不需要强制输出两位数）
		*/
    _plainDateStr: function (plainDateStr, format, isNotDefault) {
      if (!plainDateStr) return '';
      // if(8 < plainDateStr.length){
      // 	plainDateStr=plainDateStr.match(/^\d{8}/)[0];
      // }
      var self = this, plainDateArr = self._plainDateDict(plainDateStr) || '', res = '';
      if (plainDateArr && !(plainDateArr instanceof Array)) return plainDateStr;
      var plainDateDict = { yyyy: plainDateArr[0], MM: plainDateArr[1], dd: plainDateArr[2], hh: 0, mm: 0, ss: 0 };
      var dictLen = plainDateArr.length;
      if (dictLen == 6) {
        plainDateDict.hh = plainDateArr[3];
        plainDateDict.mm = plainDateArr[4];
        plainDateDict.ss = plainDateArr[5];
      }
      return (format || 'yyyy-MM-dd').replace(/yyyy|MM|dd|hh|mm|ss/g, function ($1) {
        res = plainDateDict[$1];
        'MM' == $1 && res++;
        if (!isNotDefault) return self._dateTwoNum(res);
        return res;
      });
    },
		/**
		*	没有分隔符的时间转时间串		_plainDateStr
		*	@param	plainDateStr	String	//20160108
		*   @param  mask	String //分隔符
		*/
    _plainStr: function (plainDateStr, mask) {
      if (!plainDateStr) return plainDateStr;
      mask = mask || '/';
      var reg = this._plainStrReg(plainDateStr, mask, false);
      return plainDateStr.toString().replace(reg.reg, reg.matches);
    },
		/**
		*   根据没有分隔符的时间得到拆分的正则 和匹配项  _plainStrReg
		*   @param 	plainDateStr	String	//20160108
		*   @param  mask	String //分隔符
		*   @param  isAll   boolean //是否都是基于mask拆分
		*/
    _plainStrReg: function (plainDateStr, mask, isAll) {
      var reg = '', matches = '';
      mask = mask || ',';
      if (8 == plainDateStr.length) {
        reg = /(\d{4})(\d{2})(\d{2})/g;
        matches = '$1' + mask + '$2' + mask + '$3';
      } else {
        reg = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g;
        matches = '$1' + mask + '$2' + mask + '$3 ' + (isAll ? mask + '$4' + mask + '$5' + mask + '$6' : '$4:$5:$6');
      }
      return { reg: reg, matches: matches };
    }
  };
  return new widgetDate();
})();
