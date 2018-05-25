const appPage = () => import('./appComponents/appPage.vue');
const appHeader = () => import('./appComponents/appHeader.vue');
const appFooter = () => import('./appComponents/appFooter.vue');
const appBox = () => import('./appComponents/appBox.vue');
const appBody = () => import('./appComponents/appBody.vue');
const appLoadMore = () => import('./appComponents/appLoadMore.vue');
const appNavBar = () => import('./appComponents/appNavBar.vue');

const GroupCardItem = () => import('./groupCardItem/groupCardItem.vue');
const GroupItem = () => import("./groupItem/groupItem.vue");
const GoodCellBox = () => import("./goodCell/goodCell.vue");
const LoginBox = () => import("./login/login.vue");
const NoDataBox = () => import("./noDataBox/noDataBox.vue");
const CouponItem = () => import("./couponItem/couponItem.vue");
const OrderItem = () => import("./orderItem/orderItem.vue");
const InlineNumber = () => import("./inlineNumber/inlineNumber.vue");
const OrderBtns = () => import("./orderBtns/orderBtns.vue");
const ChooseCouponPopup = () =>
  import("./chooseCouponPopup/chooseCouponPopup.vue");
const GlobalCouponTip = () => import("./couponTip/couponTip.vue");
const BindMobilePopup = () =>
  import("./bindMobilePopup/bindMobilePopup.vue");
const ImgPreview = () => import("./imgPreview/imgPreview.vue");
const ShareMask = () => import("./shareMask/shareMask.vue");
const CalendarPopup = () => import("./calendarPopup/calendarPopup.vue");


module.exports = {
  appPage,
  appBox,
  appBody,
  appHeader,
  appFooter,
  appLoadMore,
  appNavBar,
  GroupCardItem,
  GroupItem,
  GoodCellBox,
  LoginBox,
  NoDataBox,
  CouponItem,
  OrderItem,
  InlineNumber,
  OrderBtns,
  ChooseCouponPopup,
  GlobalCouponTip,
  BindMobilePopup,
  ImgPreview,
  ShareMask,
  CalendarPopup
};
