import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
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
import MgPrice from '@/pages/home/MgPrice';

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
      path: '/welcome',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        path: '/home',
        name: ''
      },
      children: [
        {
          path: 'brand',
          component: MgBrand,
          meta: {
            path: '/home/brand',
            name: '品牌管理'
          }
        }, {
          path: 'brandAddition',
          component: BrandAddition,
          meta: {
            path: '/home/brandAddition',
            name: '新增品牌'
          }
        },
        {
          // 当 /home/vehicle 匹配成功，
          // vehicle 会被渲染在 home/Index.vue 的 <router-view> 中
          path: 'vehicle',
          component: MgVehicle,
          meta: {
            path: '/home/vehicle',
            name: '车辆管理'
          }
        },
        {
          path: 'vehicleAddition',
          component: VehicleAddition,
          meta: {
            path: '/home/vehicleAddition',
            name: '新增车辆'
          }
        },
        {
          path: 'vehicleDetail',
          component: VehicleDetail,
          meta: {
            path: '/home/vehicleDetail',
            name: '车辆详情'
          }
        },
        {
          path: 'vehicleModel',
          component: MgVehicleModel,
          meta: {
            path: '/home/vehicleModel',
            name: '车型管理'
          }
        },
        {
          path: 'modelAddition',
          component: ModelAddition,
          meta: {
            path: '/home/modelAddition',
            name: '新增车型'
          }
        },
        {
          path: 'modelDetail',
          component: ModelDetail,
          meta: {
            path: '/home/modelDetail',
            name: '车型详情'
          }
        },
        {
          path: 'mgOrder',
          component: MgOrder,
          meta: {
            path: '/home/mgOrder',
            name: '订单管理'
          }
        },
        {
          path: 'orderDetail',
          component: OrderDetail,
          meta: {
            path: '/home/orderDetail',
            name: '订单详情'
          }
        },
        {
          path: 'mgPrice',
          component: MgPrice
        }
      ]
    }
  ]
});
