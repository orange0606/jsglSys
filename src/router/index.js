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
      path: '/login',
      name: 'login',
      component: ()=>import('@/components/Login.vue'),
    },
    {
      path: '/newheader',
      name: 'newheader',
      component: ()=>import('@/components/System/NewHeader.vue'),
      meta:{
        "requireAuth": true
      }
    },
    {
      path: '/headers',
      name: 'headers',
      component: ()=>import('@/components/System/Allheader.vue'),
      meta:{
        "requireAuth": true
      }
    },
    {
      path: '/marks',
      name: 'marks',
      component: ()=>import('@/components/System/Mark.vue'),
      meta:{
        "requireAuth": true
      }
    },
    {
      path: '/newInventory',
      name: 'newInventory',
      component: ()=>import('@/components/InventorySys/NewInventory.vue'),
      meta:{
        "requireAuth": true
      }
    },
    {
      path: '/Originals',
      name: 'Originals',
      component: ()=>import('@/components/InventorySys/Originals.vue'),
      meta:{
        "requireAuth": true
      }
    },    
    {
      path: '/NewChange',
      name: 'NewChange',
      component: ()=>import('@/components/ChangeSys/NewChange.vue'),
      meta:{
        "requireAuth": true
      }
    }
  ]
})
