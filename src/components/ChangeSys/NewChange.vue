<template>
  <!-- <div>
      <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
        <el-radio-button label="top">top</el-radio-button>
        <el-radio-button label="right">right</el-radio-button>
        <el-radio-button label="bottom">bottom</el-radio-button>
        <el-radio-button label="left">left</el-radio-button>
      </el-radio-group> -->

      <el-tabs :tab-position="tabPosition" style="height: 100%;">
        <el-tab-pane label="变更审批单">
            <h3>变更审批单</h3> 

        </el-tab-pane>
        <el-tab-pane label="清单列表">
          <!-- 清单模块开始编写 -->
              <h3>清单列表</h3>
              <!-- <InvenEdit></InvenEdit> -->



        </el-tab-pane>
        <el-tab-pane label="附件">
          <!-- 清单模块开始编写 -->
              <h3>附件模块</h3>




        </el-tab-pane>
        <el-tab-pane label="审批节点">审批节点</el-tab-pane>
        <el-tab-pane label="全览">全览</el-tab-pane>
      </el-tabs>
  <!-- </div> -->
</template>
<script>
  export default {
    name: 'NewChange',
    data() {
      return {
        tabPosition: 'right',
    
      };
    }
  };
</script>
<style scope>

</style>
