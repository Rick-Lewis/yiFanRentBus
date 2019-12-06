/** @Author: xu.long
 * @Date: 2019-09-20 09:30:54
 * @Last Modified by: xu.long
 * @Last Modified time: 2019-12-06 10:54:37
 */
export default {
  namespaced: true,
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: () => ({
    userInfo: null
  }),
  actions: {
    setUser: ({ commit }, data) => commit('setUser', data)
  },
  mutations: {
    setUser: (state, data) => {
      state.userInfo = Object.assign({}, state.userInfo, data);
    }
  }
};
