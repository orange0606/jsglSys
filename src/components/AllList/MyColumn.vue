<template>
  <el-table-column :prop="col.colNum+'.td'" :label="col.td+col.colNum+ '-'+col.attribute+'='+col.attributeValue" :fit="true" :key="$excel.randomkey()" :align="col.textAlign">
    <template slot-scope="scope">
      <span>{{scope.row.data[col.colNum].td}}</span>
      <!-- <span>{{scope.row.data}}</span> -->
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
      background: #FFEEDD;

      /* line-height: 100%; */

  }
  .colornull {
      /* color: #409EFF; */
      width: 100%;
      height: 100%;
      background: #DFFFDF;
  }
</style>
