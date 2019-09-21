/*
 * @Author: xu.long
 * @Date: 2019-07-20 17:22:08
 * @Last Modified by: xu.long
 * @Last Modified time: 2019-09-21 15:36:24
 */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store();
}
