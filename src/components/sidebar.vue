<template>
    
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        unique-opened 
        collapse-transition
        @open="handleOpen"
        @close="handleClose">
        <el-submenu index="1">
            <template slot="title">
            <span>其他功能组件</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="1-1"><router-link to="/AllHead" >选择表头，单击单元格</router-link></el-menu-item>
            <el-menu-item index="1-2"><router-link to="/ExcelStyle" >导出xlsx</router-link></el-menu-item>


        </el-submenu>
        <el-submenu index="2">
            <template slot="title">
            <!-- <i class="el-icon-location"></i> -->
            <span>清单管理</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="2-1"><router-link to="/Originals" >原清单</router-link></el-menu-item>
            <el-menu-item index="2-2"><router-link to="/AllOriginals" >所有原清单</router-link></el-menu-item>
            <el-menu-item index="2-3"><router-link to="/NewList" >新组件原清单</router-link></el-menu-item>
        </el-submenu>
        <el-submenu index="3">
            <template slot="title">
            <span>变更管理</span>
            </template>
            <el-menu-item index="3-1"><router-link to="/ChangeList" >变更清单</router-link></el-menu-item>
            <el-menu-item index="3-2"><router-link to="/AllChangeList" >所有变更清单</router-link></el-menu-item>
            
        </el-submenu>
        <el-submenu index="4">
            <template slot="title">
            <span>计量管理</span>
            </template>
            <el-menu-item index="4-1"><router-link to="/MeterageList" >计量清单</router-link></el-menu-item>
            <el-menu-item index="4-2"><router-link to="/AllMeterageList" >所有计量清单</router-link></el-menu-item>

        </el-submenu>
        <el-submenu index="5">
            <template slot="title">
            <span>支付管理</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="5-1"><router-link to="/PayList" >支付清单列表</router-link></el-menu-item>
            <el-menu-item index="5-2"><router-link to="/AllPayList" >所有计量清单</router-link></el-menu-item>

        </el-submenu>
        <el-submenu index="6">
            <template slot="title">
            <span>新清单、累计计量、累计支付</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="6-1"><router-link to="/ReadOnlyList">预览清单</router-link></el-menu-item>

        </el-submenu>
        <el-submenu index="7">
            <template slot="title">
            <span>系统管理</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="7-1"><router-link to="/headers">全部表头</router-link></el-menu-item>
            <el-menu-item index="7-2"><router-link to="/marks">标段管理</router-link></el-menu-item>

        </el-submenu>


    </el-menu>
</template>

<script>
  export default {
  name: 'sidebar',
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-menu{
    min-height: 100%;
    /* height: 100%; */
}
.el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
    /* padding: 0 45px; */
    /* text-align: center; */
    min-width: 80%;
    padding: 0 20% 0 0;
}

</style>
