<template>
  <el-table-column :prop="col.colNum+'.td'" :label="col.td" :key="$excel.randomkey(this)+'a'" :min-width="$excel.Setwidth(col.td)" :width="$excel.Setwidth(col.td, hd)" :fit="true" :align="col.textAlign">
    <template slot-scope="scope">
      <span>{{scope.row.data[col.colNum].td}}</span>
    </template>
    <template v-if="col.children">
      <column  v-for="(item, index) in col.children"
        :key="index"
        :col="item"
        :hd="hd">
      </column> 
    </template>
  </el-table-column> 
</template>
<script>
export default {
  name: 'Column',
  // props:['col'],
  props: {
    col: {
      type: Object
    },
    hd: {}
  },
  data() {
    return {
     
    }
  },
}
</script>

