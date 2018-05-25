// 正则方法，请在regDict中配置更多所需要的正则
let regDict = {
  mobile: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
  idCard: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
};

// 验证是否为空
let regEmpty = (str) => {
  return !str || !str.replace(/\s+/g, '');
};

/**
 * 正则验证
 * @param {String} str
 * @param {any} regNameOrReg // regDict中的正则的key值或自定义正则表达式
 */
let regTest = (str, regNameOrReg) => {
  let reg = typeof (regNameOrReg) == 'object' ? regNameOrReg : regDict[regNameOrReg];
  if (!reg || !str) {
    return false;
  }
  if (regNameOrReg == 'idCard') {
    return idCardNoTest(str);
  } else {
    return reg.test(str);
  }
};

// 身份证号码强验证
let idCardNoTest = (idCard) => {
  // 参考地址 https://blog.csdn.net/qq_30638831/article/details/76912771
  let isMatch = false;
  //如果通过该验证，说明身份证格式正确，但准确性还需计算
  if (regDict.idCard.test(idCard)) {
    if (idCard.length == 18) {
      let idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
      let idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
      let idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
      for (let i = 0; i < 17; i++) {
        idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
      }

      let idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
      let idCardLast = idCard.substring(17);//得到最后一位身份证号码

      //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
      if (idCardMod == 2) {
        isMatch = idCardLast == "X" || idCardLast == "x";
      } else {
        //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
        isMatch = idCardLast == idCardY[idCardMod];
      }
    }
  }
  return isMatch;
};

export default {
  regDict,
  regEmpty,
  regTest
};
