// ［百度统计］页面埋点
let trackPageView = (url) => {
  if (!window._hmt) {
    return;
  }
  _hmt.push(['_trackPageview', url]);
};

// ［百度统计］事件埋点
let trackEvent = (category, action, label, value) => {
  if (!window._hmt) {
    return;
  }
  let trackParam = [category, action];
  label && trackParam.push(label);
  value && trackParam.push(value);
  _hmt.push(['_trackEvent', ...trackParam]);
};

module.exports = {
  trackPageView,
  trackEvent
}
