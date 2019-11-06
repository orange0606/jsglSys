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
      path: '/AllOriginals',
      name: 'AllOriginalList',
      component: ()=>import('@/components/InventorySys/AllOriginalList.vue'),
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
      path: '/AllChangeList',
      name: 'AllChangeList',
      component: ()=>import('@/components/ChangeSys/AllChangeList.vue'),
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
      path: '/AllMeterageList',
      name: 'AllMeterageList',
      component: ()=>import('@/components/MeterageSys/AllMeterageList.vue'),
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
    },
    {
      path: '/AllPayList',
      name: 'AllPayList',
      component: ()=>import('@/components/PaySys/AllPayList.vue'),
      meta:{
        "requireAuth": true
      }
    },
    {
      path: '/AllHead',
      name: 'AllHead',
      component: ()=>import('@/components/OptHead/AllHead.vue'),
      meta:{
        "requireAuth": true
      }
    },
    {
      path: '/ExcelStyle',
      name: 'ExcelStyle',
      component: ()=>import('@/components/Excel/exportstyle.vue'),
      meta:{
        "requireAuth": false
      }
    },
  ]
})
