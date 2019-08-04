import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/home',
    //   name: 'Home',
    //   component: ()=>import('@/components/Home')
    // },
    // {
    //   path: '/',
    //   name: 'newheader',
    //   component: ()=>import('@/components/System/NewHeader.vue')
    // },
    {
      path: '/newheader',
      name: 'newheader',
      component: ()=>import('@/components/System/NewHeader.vue')
    },
    {
      path: '/headers',
      name: 'headers',
      component: ()=>import('@/components/System/Allheader.vue')
    },
    {
      path: '/marks',
      name: 'marks',
      component: ()=>import('@/components/System/Mark.vue')
    },
    {
      path: '/newInventory',
      name: 'newInventory',
      component: ()=>import('@/components/InventorySys/NewInventory.vue')
    },
    {
      path: '/Originals',
      name: 'Originals',
      component: ()=>import('@/components/InventorySys/Originals.vue')
    }
  ]
})
