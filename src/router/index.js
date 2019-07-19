import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: ()=>import('@/components/Home')
    },
    {
      path: '/',
      name: 'newheader',
      component: ()=>import('@/components/System/NewHeader.vue')
    },
    {
      path: '/newheader',
      name: 'newheader',
      component: ()=>import('@/components/System/NewHeader.vue')
    },
    {
      path: '/marks',
      name: 'marks',
      component: ()=>import('@/components/System/Mark.vue')
    }
  ]
})
