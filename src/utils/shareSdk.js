import utils from '@/utils';
import { shareAppMessage, shareTimeline } from '@/utils/wechatSdk';

// 为了兼容微信外分享
// 分享好友消息
const appShareMessage = (settings, success, cancel) => {
  if (utils.getOS().wechat()) {
    shareAppMessage(settings, success, cancel);
  }
};

// 分享朋友圈消息
const appShareTimeline = (settings, success, cancel) => {
  if (utils.getOS().wechat()) {
    shareTimeline(settings, success, cancel);
  }
};

export {
  appShareMessage,
  appShareTimeline
};
