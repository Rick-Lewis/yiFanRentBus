import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Home from '@/pages/home';
import MgVehicle from '@/pages/home/MgVehicle';
import Long from '@/pages/home/Mr.long';
import Wang from '@/pages/home/Mr.wang';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home/'
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
          path: 'long',
          component: Long
        },
        {
          path: 'wang',
          component: Wang
        }
      ]
    }
  ]
});
