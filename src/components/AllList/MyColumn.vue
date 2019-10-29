<template>
  <el-table-column :prop="col.colNum+'.td'" :label="col.td+col.colNum+ '-'+col.attribute+'='+col.attributeValue" :min-width="$excel.Setwidth(col.td)" :width="$excel.Setwidth(col.td, hd)" :fit="true" :key="$excel.randomkey(this)" :align="col.textAlign">
    <template slot-scope="scope">
      <span>{{scope.row.data[col.colNum].td}}</span>
      <!-- <span>{{scope.row.data}}</span> -->
    </template>
    <template v-if="col.children">
      <my-column  v-for="(item, index) in col.children"
        :key="index"
        :col="item"
        :hd="hd">
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
    hd: {}

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
