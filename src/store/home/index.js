/** @Author: xu.long
 * @Date: 2019-09-20 09:30:54
 * @Last Modified by: xu.long
 * @Last Modified time: 2019-11-19 22:15:01
 */
let BREADCRUMB = {
  '/home/brand': [
    {
      path: '',
      text: '车辆管理'
    },
    {
      path: '/home/brand',
      text: '品牌管理',
      query: ''
    }
  ],
  '/home/brandAddition': [
    {
      path: '',
      text: '车辆管理'
    },
    {
      path: '/home/brand',
      text: '品牌管理'
    },
    {
      path: '/home/brandAddition',
      text: '新增品牌',
      query: ''
    }
  ],
  '/home/vehicleModel': [
    {
      path: '',
      text: '车辆管理'
    },
    {
      path: '/home/vehicleModel',
      text: '车型管理',
      query: ''
    }
  ],
  '/home/modelAddition': [
    {
      path: '',
      text: '车辆管理'
    },
    {
      path: '/home/vehicleModel',
      text: '车型管理'
    },
    {
      path: '/home/modelAddition',
      text: '新增车型',
      query: ''
    }
  ],
  '/home/modelDetail': [
    {
      path: '',
      text: '车辆管理'
    },
    {
      path: '/home/vehicleModel',
      text: '车型管理'
    },
    {
      path: '/home/modelDetail',
      text: '车型详情',
      query: ''
    }
  ],
  '/home/vehicle': [
    {
      path: '',
      text: '车辆管理'
    },
    {
      path: '/home/vehicle',
      text: '车辆管理',
      query: ''
    }
  ],
  '/home/vehicleAddition': [
    {
      path: '',
      text: '车辆管理'
    },
    {
      path: '/home/vehicle',
      text: '车辆管理'
    },
    {
      path: '/home/vehicleAddition',
      text: '新增车辆',
      query: ''
    }
  ],
  '/home/vehicleDetail': [
    {
      path: '',
      text: '车辆管理'
    },
    {
      path: '/home/vehicle',
      text: '车辆管理'
    },
    {
      path: '/home/vehicleDetail',
      text: '车辆详情',
      query: ''
    }
  ],
  '/home/mgOrder': [
    {
      path: '',
      text: '订单管理'
    },
    {
      path: '/home/mgOrder',
      text: '订单管理',
      query: ''
    }
  ],
  '/home/orderDetail': [
    {
      path: '',
      text: '订单管理'
    },
    {
      path: '/home/mgOrder',
      text: '订单管理'
    },
    {
      path: '/home/orderDetail',
      text: '订单详情',
      query: ''
    }
  ]
};
export default {
  namespaced: true,
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: () => ({
    title: 'Hello',
    total: 0,
    breadcrumbList: []
  }),
  actions: {
    inc: ({ commit }) => commit('inc'),
    sub: ({ commit }) => commit('sub'),
    initBreadcrumbList: ({ commit }, url) => commit('breadcrumb', url)
  },
  mutations: {
    inc: state => state.total++,
    sub: state => state.total--,
    breadcrumb: (state, url) => {
      let queryTemp = url.split('?')[1];
      let temp = url.split('?')[0].split('/');
      let strTemp = '/' + temp.slice(temp.length - 2, temp.length).join('/');
      let index = BREADCRUMB[strTemp].length - 1;
      BREADCRUMB[strTemp][index].query = '?' + queryTemp;
      state.breadcrumbList = BREADCRUMB[strTemp];
    }
  }
};
