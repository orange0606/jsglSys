<template>
  <!-- <elx-editable-column :prop="col.prop"
   :label="col.label" min-width="80" show-overflow-tooltip :edit-render="{name: 'ElInput'}">
    <template v-if="col.children">
      <my-column v-for="(item, index) in col.children"
        :key="index"
        :col="item">
      </my-column>
    </template>
  </elx-editable-column> -->

  <el-table-column :prop="col.prop" :label="col.label">
    <template v-if="col.children">
      <my-column v-for="(item, index) in col.children"
        :key="index"
        :col="item">
      </my-column>   
    </template>
  </el-table-column> 


</template>

<script>
export default {
  name: 'MyColumn',
  // props:['col'],
  props: {
    col: {
      type: Object
    }
  }
}
</script>
<style scoped>
</style>
