<template>
  <!-- <div>
      <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
        <el-radio-button label="top">top</el-radio-button>
        <el-radio-button label="right">right</el-radio-button>
        <el-radio-button label="bottom">bottom</el-radio-button>
        <el-radio-button label="left">left</el-radio-button>
      </el-radio-group> -->

      <el-tabs :tab-position="tabPosition" style="height: 100%;">
        <el-tab-pane label="清单审批单">
              <el-select v-model="value" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

        </el-tab-pane>
        <el-tab-pane label="清单">清单</el-tab-pane>
        <el-tab-pane label="审批节点">审批节点</el-tab-pane>
        <el-tab-pane label="全览">全览</el-tab-pane>
      </el-tabs>
  <!-- </div> -->
</template>
<script>
  export default {
    name: 'newInventory',
    data() {
      return {
        tabPosition: 'right',
        options: [{
          value: '选项1',
          label: 'JD1标合同'
        }, {
          value: '选项2',
          label: 'JD2标合同'
        }, {
          value: '选项3',
          label: 'JD3标合同'
        }, {
          value: '选项4',
          label: 'JD4标合同'
        }, {
          value: '选项5',
          label: 'JD5标合同'
        }],
        value: '',

      };
    }
  };
</script>
<style scope>

</style>
