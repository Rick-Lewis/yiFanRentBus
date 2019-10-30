import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Login from '@/pages/login';
import Home from '@/pages/home';
import MgVehicle from '@/pages/home/MgVehicle/MgVehicle';
import VehicleAddition from '@/pages/home/MgVehicle/MgVehicle/VehicleAddition';
import VehicleDetail from '@/pages/home/MgVehicle/MgVehicle/VehicleDetail';
import MgBrand from '@/pages/home/MgVehicle/MgBrand';
import MgVehicleModel from '@/pages/home/MgVehicle/MgVehicleModel';
import ModelAddition from '@/pages/home/MgVehicle/MgVehicleModel/ModelAddition';
import ModelDetail from '@/pages/home/MgVehicle/MgVehicleModel/ModelDetail';
import MgOrder from '@/pages/home/OrderCenter/MgOrder';
import OrderDetail from '@/pages/home/OrderCenter/OrderDetail';
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
      component: Login
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
      children: [
        {
          path: 'brand',
          component: MgBrand
        },
        {
          // 当 /home/vehicle 匹配成功，
          // vehicle 会被渲染在 home/Index.vue 的 <router-view> 中
          path: 'vehicle',
          component: MgVehicle
        },
        {
          path: 'vehicleAddition',
          component: VehicleAddition
        },
        {
          path: 'vehicleDetail',
          component: VehicleDetail
        },
        {
          path: 'vehicleModel',
          component: MgVehicleModel
        },
        {
          path: 'modelAddition',
          component: ModelAddition
        },
        {
          path: 'modelDetail',
          component: ModelDetail
        },
        {
          path: 'mgOrder',
          component: MgOrder
        },
        {
          path: 'orderDetail',
          component: OrderDetail
        },
        {
          path: 'mgPrice',
          component: MgPrice
        }
      ]
    }
  ]
});
