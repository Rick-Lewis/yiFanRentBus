import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/pages/login';
import Home from '@/pages/home';
import MgVehicle from '@/pages/home/MgVehicle/MgVehicle';
import VehicleAddition from '@/pages/home/MgVehicle/MgVehicle/VehicleAddition';
import VehicleDetail from '@/pages/home/MgVehicle/MgVehicle/VehicleDetail';
import MgBrand from '@/pages/home/MgVehicle/MgBrand';
import BrandAddition from '@/pages/home/MgVehicle/MgBrand/BrandAddition';
import MgVehicleModel from '@/pages/home/MgVehicle/MgVehicleModel';
import ModelAddition from '@/pages/home/MgVehicle/MgVehicleModel/ModelAddition';
import ModelDetail from '@/pages/home/MgVehicle/MgVehicleModel/ModelDetail';
import MgOrder from '@/pages/home/OrderCenter/MgOrder';
import OrderDetail from '@/pages/home/OrderCenter/MgOrder/OrderDetail';
import MgAd from '@/pages/home/ActivityCenter/MgAd';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home/brand'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        path: '/login',
        name: '登录页'
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'ad',
          component: MgAd,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '活动中心'
              },
              {
                submenuName: 'activity-center',
                menuItemName: 'mg-ad',
                path: '/home/ad',
                text: '首页广告位'
              }
            ]
          }
        },
        {
          path: 'brand',
          component: MgBrand,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '车辆管理'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-brand',
                path: '/home/brand',
                text: '品牌管理'
              }
            ]
          }
        },
        {
          path: 'brandAddition',
          component: BrandAddition,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '车辆管理'
              },
              {
                path: '/home/brand',
                text: '品牌管理'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-brand',
                path: '/home/brandAddition',
                text: '新增品牌'
              }
            ]
          }
        },
        {
          // 当 /home/vehicle 匹配成功，
          // vehicle 会被渲染在 home/Index.vue 的 <router-view> 中
          path: 'vehicle',
          component: MgVehicle,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '车辆管理'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-vehicle',
                path: '/home/vehicle',
                text: '车辆管理'
              }
            ]
          }
        },
        {
          path: 'vehicleAddition',
          component: VehicleAddition,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '车辆管理'
              },
              {
                path: '/home/vehicle',
                text: '车辆管理'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-vehicle',
                path: '/home/vehicleAddition',
                text: '新增车辆'
              }
            ]
          }
        },
        {
          path: 'vehicleDetail',
          component: VehicleDetail,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '车辆管理'
              },
              {
                path: '/home/vehicle',
                text: '车辆管理'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-vehicle',
                path: '/home/vehicleDetail',
                text: '车辆详情'
              }
            ]
          }
        },
        {
          path: 'vehicleModel',
          component: MgVehicleModel,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '车辆管理'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-vehicle-model',
                path: '/home/vehicleModel',
                text: '车型管理'
              }
            ]
          }
        },
        {
          path: 'modelAddition',
          component: ModelAddition,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '车辆管理'
              },
              {
                path: '/home/vehicleModel',
                text: '车型管理'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-vehicle-model',
                path: '/home/modelAddition',
                text: '新增车型'
              }
            ]
          }
        },
        {
          path: 'modelDetail',
          component: ModelDetail,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '车辆管理'
              },
              {
                path: '/home/vehicleModel',
                text: '车型管理'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-vehicle-model',
                path: '/home/modelDetail',
                text: '车型详情'
              }
            ]
          }
        },
        {
          path: 'mgOrder',
          component: MgOrder,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '订单管理'
              },
              {
                submenuName: 'order',
                menuItemName: 'mg-order',
                path: '/home/mgOrder',
                text: '订单管理'
              }
            ]
          }
        },
        {
          path: 'orderDetail',
          component: OrderDetail,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '订单管理'
              },
              {
                path: '/home/mgOrder',
                text: '订单管理'
              },
              {
                submenuName: 'order',
                menuItemName: 'mg-order',
                path: '/home/orderDetail',
                text: '订单详情'
              }
            ]
          }
        }
      ]
    }
  ]
});
