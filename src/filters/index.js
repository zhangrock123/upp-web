/**
 * 字符截取
 * @param  {any} 原值
 * @param  {any} 截取长度
 * @returns val
 */
export function limit(val, max, isDot) {
  if (!val) {
    return '';
  }
  isDot = isDot || false;
  return val.length > max ? val.substring(0, max) + (isDot ? '...' : '') : val;
}

/**
 * 分割空格获取第一个元素
 * @param {String} val
 */
export function getSplitFirst(val) {
  return ((val || '') + '').split(' ')[0];
}
