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
import qs from 'qs';
import global_ from './Global';

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    console.log('axios.interceptors.request config', config);
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    console.log('axios.interceptors.request error', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    console.log('axios.interceptors.response response', response, global_.path.baseUrl);
    if (response.config.url && response.config.url.indexOf(global_.path.baseUrl) !== -1) {
      if (
        response.data.code === -1 &&
        response.data.data === '登录超时，请重新登陆'
      ) {
        window.location.assign(window.location.origin + '/#/login');
      }
    }
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    console.log('axios.interceptors.response error', error);
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false;
Vue.use(ViewUI);
Vue.use(VueAxios, axios);

// 创建 store 实例
const store = createStore();
Vue.prototype.$moment = moment;
Vue.prototype.$qs = qs;
Vue.prototype.global_ = global_;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});
