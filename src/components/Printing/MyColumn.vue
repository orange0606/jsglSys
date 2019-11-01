<template>
  <el-table-column :prop="col.colNum+'.td'" :label="col.td" :fit="true" :min-width="$excel.Setwidth(col.td)" :width="$excel.Setwidth(col.td, hd)" :align="col.textAlign">
    <template slot-scope="scope">
      <span>{{scope.row.data[col.colNum].td}}</span>
    </template>
    <template v-if="col.children">
      <my-column  v-for="(item, index) in col.children"
        :key="index"
        :col="item"  >
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
    },
    Formula: {
      type: Object
    },
    type: {
    },
    lastHeader: {
    },
    hd: {
    },
  },
  data() {
    return {
    }
  },
  created (){
  },
  methods:{
  }

}
</script>
<style scoped>
  .color  {
      /* color: #67C23A; */
      width: 100%;
      height: 100%;
      line-height: 100%;
      text-align:center;
      display: block;
      color: red;
      background: #FFEEDD;
  }
  .colornull {
      /* color: #409EFF; */
      width: 100%;
      height: 100%;
      background: #DFFFDF;
  }
</style>