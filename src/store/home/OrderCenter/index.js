/** @Author: xu.long
 * @Date: 2019-09-20 09:30:54
 * @Last Modified by: xu.long
 * @Last Modified time: 2019-11-18 22:14:37
 */

export default {
  namespaced: true,
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: () => ({
    orderStatusList: []
  }),
  actions: {
    initrOderStatusList: ({ commit }, data) => commit('initrOderStatusList', data)
  },
  mutations: {
    initrOderStatusList: (state, data) => state.orderStatusList.push(...data)
  }
};
