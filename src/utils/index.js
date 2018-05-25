class utils {
  constructor() { }

  /**
   * 用于时间一位数前面自动补0，（eg: 输入'5',输出'05'）
   * @param {String} str
   */
  limitTimeLen(str) {
    return ((str + '').length < 2 ? '0' : '') + str;
  }

  /**
   * [设置某个cookie的值]
   * @param  {String}   name
   * @param  {String/Object}  value
   * @param {String}    path
   * @param  {String}   days
  */
  setCookie(name, value, path, days) {
    if (!name) return;
    let Days = days || 90, exp = new Date(), Path = path ? path : '/';
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    'object' == typeof (value) && (value = JSON.stringify(value));
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};path=${Path}`;
  }

  /**
   * [获得某个cookie的值]
   * @param {String}   name
  */
  getCookie(name) {
    const cookieReg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    let arr;
    if (arr = document.cookie.match(cookieReg)) {
      let resStr = unescape(arr[2]);
      if (/(^\{.+\}$)|(^\[.+\]$)/.test(resStr)) {
        return JSON.parse(resStr);
      }
      return resStr;
    }
    return null;
  }

  /**
   * 获取os信息
   * @param {String} platform
   */
  getOS() {
    let ua = navigator.userAgent;
    return {
      ua() { return ua; },
      wechat() { return ua.match(/(MicroMessenger)\/([\d.]+)/i); },
      android() { return ua.match(/(Android);?[\s/]+([\d.]+)?/); },
      ios() { return ua.match(/(iPhone\sOS)\s([\d_]+)/); },
    };
  }

  /**
   * 获取url上面的传参
   * @param {String} name
   */
  getQueryString(name) {
    var reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i'); // 匹配目标参数
    var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
    if (result != null) {
      return decodeURIComponent(result[2]);
    } else {
      return null;
    }
  }

  /**
   * 将事件格式的字符串转为时间（默认传当前时间）
   * @param {String} dateString // yyyy/MM/dd hh:mm:ss 或者 yyyy-MM-dd hh:mm:ss 时分秒不传默认 00:00:00
   */
  convertToDate(dateString) {
    if (!dateString) {
      return new Date();
    }
    let dateArr = dateString.split(/\/|-|\s|:/g);
    return new Date(dateArr[0], dateArr[1] - 1, dateArr[2] || 0, dateArr[3] || 0, dateArr[4] || 0, dateArr[5] || 0);
  }

  // 查找column数组中至少有一个值在res中
  findArrayColumns(res, ...columns) {
    if (!res || !res.length || !columns || !columns.length) {
      return false;
    }
    return columns.some(c => {
      return res.indexOf(c.toString()) != -1;
    });
  }

}

export default new utils();
