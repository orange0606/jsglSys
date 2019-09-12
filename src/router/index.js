import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: ()=>import('@/components/Login.vue'),
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
      path: '/Originals',
      name: 'Originals',
      component: ()=>import('@/components/InventorySys/OriginalList.vue'),
      meta:{
        "requireAuth": true
      }
    }, 
    
    {
      path: '/ChangeList',
      name: 'ChangeList',
      component: ()=>import('@/components/ChangeSys/ChangeList.vue'),
      meta:{
        "requireAuth": true
      }
    },
    {
      path: '/ShowChangeList',
      name: 'ShowChangeList',
      component: ()=>import('@/components/ChangeSys/ShowChangeList.vue'),
      meta:{
        "requireAuth": true
      }
    },
    {
      path: '/MeterageList',
      name: 'MeterageList',
      component: ()=>import('@/components/MeterageSys/MeterageList.vue'),
      meta:{
        "requireAuth": true
      }
    },
    {
      path: '/ReadOnlyList',
      name: 'ReadOnlyList',
      component: ()=>import('@/components/AllList/ReadOnlyList.vue'),
      meta:{
        "requireAuth": true
      }
    },
    {
      path: '/PayList',
      name: 'PayList',
      component: ()=>import('@/components/PaySys/PayList.vue'),
      meta:{
        "requireAuth": true
      }
    }
  ]
})
