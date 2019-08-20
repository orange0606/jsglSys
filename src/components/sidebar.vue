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
            <span>合同管理</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
            <el-menu-item index="1-3">选项3</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
            <template slot="title">
            <!-- <i class="el-icon-location"></i> -->
            <span>清单管理</span>
            </template>
            <!-- <template slot="title">分组一</template> -->

            <el-menu-item index="2-2"><router-link to="/Originals" >原清单</router-link></el-menu-item>

        </el-submenu>
        <el-submenu index="3">
            <template slot="title">
            <span>变更管理</span>
            </template>
            <el-menu-item index="3-1"><router-link to="/ChangeList" >新建变更</router-link></el-menu-item>
            <el-menu-item index="3-2"><router-link to="/ChangeList" >待审变更</router-link></el-menu-item>
            <el-menu-item index="3-3"><router-link to="/ChangeList" >正审变更</router-link></el-menu-item>
            <el-menu-item index="3-4"><router-link to="/ChangeList" >已审变更</router-link></el-menu-item>
            <el-menu-item index="3-3"><router-link to="/ChangeList" >全部变更</router-link></el-menu-item>
        </el-submenu>
        <el-submenu index="4">
            <template slot="title">
            <span>计量管理</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="4-1">选项1</el-menu-item>
            <el-menu-item index="4-2">选项2</el-menu-item>
            <el-menu-item index="4-3">选项3</el-menu-item>
        </el-submenu>
        <el-submenu index="5">
            <template slot="title">
            <span>支付管理</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="5-1">选项1</el-menu-item>
            <el-menu-item index="5-2">选项2</el-menu-item>
            <el-menu-item index="5-3">选项asdasd3</el-menu-item>
        </el-submenu>
        <el-submenu index="6">
            <template slot="title">
            <span>系统管理</span>
            </template>
            <!-- <template slot="title">分组一</template> -->
            <el-menu-item index="6-1"><router-link to="/newheader">新建表头</router-link></el-menu-item>
            <el-menu-item index="6-2"><router-link to="/headers">已建表头</router-link></el-menu-item>
            <el-menu-item index="6-3"><router-link to="/marks">标段管理</router-link></el-menu-item>
            <el-menu-item index="6-1"><router-link to="/newhd">新建表头</router-link></el-menu-item>

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
