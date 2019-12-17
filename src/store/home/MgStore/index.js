/** @Author: xu.long
 * @Date: 2019-09-20 09:30:54
 * @Last Modified by: xu.long
 * @Last Modified time: 2019-12-17 19:08:32
 */
export default {
  namespaced: true,
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: () => ({
    selStoreList: []
  }),
  actions: {
    setSelStoreList: ({ commit }, data) => commit('setSelStoreList', data)
  },
  mutations: {
    setSelStoreList: (state, data) => state.selStoreList.push(...data)
  }
};
