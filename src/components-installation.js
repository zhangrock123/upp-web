import Vue from 'vue';
import {
  InfiniteScroll,
  Spinner,
  Toast,
  Indicator,
  MessageBox,
  Popup,
  Button,
  Navbar,
  Tabbar,
  TabItem,
  Cell,
  Swipe,
  SwipeItem
} from 'mint-ui';


export default () => {
  // Toast
  Vue.prototype.$toast = Toast;
  Vue.prototype.$successToast = (successMsg) => {
    return Toast({
      message: successMsg,
      iconClass: 'icon-check_circle',
      className: 'toast-min-width'
    });
  };
  Vue.prototype.$infoToast = (infoMsg) => {
    return Toast({
      message: infoMsg,
      className: 'toast-min-width',
      iconClass: 'icon-info'
    });
  };
  Vue.prototype.$errorToast = (failMsg) => {
    return Toast({
      message: failMsg,
      className: 'toast-min-width',
      iconClass: 'icon-cancel'
    });
  };

  // Indicator
  Vue.prototype.$loading = {
    open(msg) {
      return Indicator.open({
        text: msg || '加载中...',
        spinnerType: 'fading-circle'
      });
    },
    close() {
      return Indicator.close();
    }
  };

  // MessageBox
  Vue.prototype.$alert = (msg, title = '') => {
    return MessageBox.alert(msg, title);
  };
  Vue.prototype.$confirm = (msg, title = '') => {
    return MessageBox.confirm(msg, title);
  };
  Vue.prototype.$prompt = (msg, title = '') => {
    return MessageBox.prompt(msg, title);
  };
  Vue.prototype.$msgBox = (settings) => {
    return MessageBox({ ...settings });
  };

  Vue.use(InfiniteScroll);
  Vue.component(Spinner.name, Spinner);
  Vue.component(Popup.name, Popup);
  Vue.component(Button.name, Button);
  Vue.component(Navbar.name, Navbar);
  Vue.component(Tabbar.name, Tabbar);
  Vue.component(TabItem.name, TabItem);
  Vue.component(Cell.name, Cell);
  Vue.component(Swipe.name, Swipe);
  Vue.component(SwipeItem.name, SwipeItem);
};
