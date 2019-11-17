// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import { createStore } from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import moment from 'moment';
import global_ from './Global';

Vue.config.productionTip = false;
Vue.use(ViewUI);
Vue.use(VueAxios, axios);

// 创建 store 实例
const store = createStore();
Vue.prototype.$moment = moment;
Vue.prototype.global_ = global_;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});
