import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Login from '@/pages/login';
import Home from '@/pages/home';
import MgVehicle from '@/pages/home/MgVehicle/MgVehicle';
import MgBrand from '@/pages/home/MgVehicle/MgBrand';
import MgVehicleModel from '@/pages/home/MgVehicle/MgVehicleModel';
import ModelAddition from '@/pages/home/MgVehicle/MgVehicleModel/ModelAddition';
import MgOrder from '@/pages/home/MgOrder';
import MgPrice from '@/pages/home/MgPrice';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home/'
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
          // 当 /home/vehicle 匹配成功，
          // vehicle 会被渲染在 home/Index.vue 的 <router-view> 中
          path: 'vehicle',
          component: MgVehicle
        },
        {
          path: 'brand',
          component: MgBrand
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
          path: 'mgOrder',
          component: MgOrder
        },
        {
          path: 'mgPrice',
          component: MgPrice
        }
      ]
    }
  ]
});
