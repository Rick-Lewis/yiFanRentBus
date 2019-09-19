import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/pages/home'
import Li from '@/pages/home/Mr.li'
import Long from '@/pages/home/Mr.long'
import Wang from '@/pages/home/Mr.wang'

Vue.use(Router)

export default new Router({
  routes: [
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
          // 当 /home/li 匹配成功，
          // Li 会被渲染在 home/Index.vue 的 <router-view> 中
          path: 'li',
          component: Li
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
})
