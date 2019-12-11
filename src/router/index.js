import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/pages/login';
import Home from '@/pages/home';
import Workspace from '@/pages/home/Workspace';
import FetchVehicle from '@/pages/home/Workspace/FetchVehicle';
import ReturnVehicle from '@/pages/home/Workspace/ReturnVehicle';
import MgVehicle from '@/pages/home/MgVehicle/MgVehicle';
import VehicleAddition from '@/pages/home/MgVehicle/MgVehicle/VehicleAddition';
import VehicleDetail from '@/pages/home/MgVehicle/MgVehicle/VehicleDetail';
import MgBrand from '@/pages/home/MgVehicle/MgBrand';
import BrandAddition from '@/pages/home/MgVehicle/MgBrand/BrandAddition';
import MgVehicleModel from '@/pages/home/MgVehicle/MgVehicleModel';
import ModelAddition from '@/pages/home/MgVehicle/MgVehicleModel/ModelAddition';
import ModelDetail from '@/pages/home/MgVehicle/MgVehicleModel/ModelDetail';
import MgMaintenance from '@/pages/home/MgVehicle/MgMaintenance';
import MaintenanceAddition from '@/pages/home/MgVehicle/MgMaintenance/MaintenanceAddition';
import MaintenanceDetail from '@/pages/home/MgVehicle/MgMaintenance/MaintenanceDetail';
import MgOrder from '@/pages/home/OrderCenter/MgOrder';
import OrderDetail from '@/pages/home/OrderCenter/MgOrder/OrderDetail';
import MgAd from '@/pages/home/ActivityCenter/MgAd';
import AdAddition from '@/pages/home/ActivityCenter/MgAd/AdAddition';
import MgStore from '@/pages/home/MgStore/MgStore';
import StoreAddition from '@/pages/home/MgStore/MgStore/StoreAddition';
import StoreDetail from '@/pages/home/MgStore/MgStore/StoreDetail';
import ModelAssociated from '@/pages/home/MgStore/ModelAssociated';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home/workspace'
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
          path: 'workspace',
          component: Workspace,
          meta: {
            breadcrumb: [
              {
                submenuName: '',
                menuItemName: 'workspace',
                path: '/home/workspace',
                text: '工作台'
              }
            ]
          }
        },
        {
          path: 'fetchVehicle',
          component: FetchVehicle,
          meta: {
            breadcrumb: [
              {
                path: '/home/workspace',
                text: '工作台'
              },
              {
                submenuName: '',
                menuItemName: 'workspace',
                path: '/home/fetchVehicle',
                text: '取车'
              }
            ]
          }
        },
        {
          path: 'returnVehicle',
          component: ReturnVehicle,
          meta: {
            breadcrumb: [
              {
                path: '/home/workspace',
                text: '工作台'
              },
              {
                submenuName: '',
                menuItemName: 'workspace',
                path: '/home/returnVehicle',
                text: '还车'
              }
            ]
          }
        },
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
          path: 'adAddition',
          component: AdAddition,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '活动中心'
              },
              {
                path: '/home/ad',
                text: '首页广告位'
              },
              {
                submenuName: 'activity-center',
                menuItemName: 'mg-ad',
                path: '/home/adAddition',
                text: '新增广告/编辑广告'
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
                text: '新增品牌/编辑品牌'
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
                text: '新增车辆/编辑车辆'
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
                text: '新增车型/编辑车型'
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
          path: 'mgMaintenance',
          component: MgMaintenance,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '车辆管理'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-maintenance',
                path: '/home/mgMaintenance',
                text: '维保工单'
              }
            ]
          }
        },
        {
          path: 'maintenanceAddition',
          component: MaintenanceAddition,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '车辆管理'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-maintenance',
                path: '/home/mgMaintenance',
                text: '维保工单'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-maintenance',
                path: '/home/maintenanceAddition',
                text: '新增工单/编辑工单'
              }
            ]
          }
        },
        {
          path: 'maintenanceDetail',
          component: MaintenanceDetail,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '车辆管理'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-maintenance',
                path: '/home/mgMaintenance',
                text: '维保工单'
              },
              {
                submenuName: 'vehicle',
                menuItemName: 'mg-maintenance',
                path: '/home/maintenanceDetail',
                text: '工单详情'
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
        },
        {
          path: 'mgStore',
          component: MgStore,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '门店管理'
              },
              {
                submenuName: 'store',
                menuItemName: 'mg-store',
                path: '/home/mgStore',
                text: '门店列表'
              }
            ]
          }
        },
        {
          path: 'storeAddition',
          component: StoreAddition,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '门店管理'
              },
              {
                path: '/home/mgStore',
                text: '门店列表'
              },
              {
                submenuName: 'store',
                menuItemName: 'mg-store',
                path: '/home/storeAddition',
                text: '新增门店/编辑门店'
              }
            ]
          }
        },
        {
          path: 'storeDetail',
          component: StoreDetail,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '门店管理'
              },
              {
                path: '/home/mgStore',
                text: '门店列表'
              },
              {
                submenuName: 'store',
                menuItemName: 'mg-store',
                path: '/home/storeDetail',
                text: '门店详情'
              }
            ]
          }
        },
        {
          path: 'modelAssociated',
          component: ModelAssociated,
          meta: {
            breadcrumb: [
              {
                path: '',
                text: '门店管理'
              },
              {
                path: '/home/mgStore',
                text: '门店列表'
              },
              {
                submenuName: 'store',
                menuItemName: 'mg-store',
                path: '/home/modelAssociated',
                text: '关联车型'
              }
            ]
          }
        }
      ]
    }
  ]
});
