<template>
  <el-table-column :prop="col.colNum+'.td'" :label="col.td" show-overflow-tooltip :align="col.textAlign">
    <template v-if="!col.children" slot-scope="scope">
      <span v-if="scope.row.data[col.colNum].edit =='N'">{{scope.row.data[col.colNum].td}}</span>
      <el-input v-else style="margin: 0; width:100%; height:100%;" v-model="scope.row.data[col.colNum].td" :autofocus="true" size="mini" ></el-input>
    </template>
    <template v-if="col.children">
      <my-column  v-for="(item, index) in col.children"
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
