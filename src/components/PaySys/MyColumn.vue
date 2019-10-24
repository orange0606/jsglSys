<template>
  <el-table-column :prop="col.colNum+'.td'" :label="col.td+col.attribute+'('+col.attributeValue+')'" :fit="true" :key="$excel.randomkey()" :width="$excel.Setwidth(col.td)" :align="col.textAlign">
    <template slot-scope="scope">
      <!-- <span>{{scope.row.data[col.colNum].td}}</span> -->
      <span v-if="scope.row.data[col.colNum].edit ==='N'">{{scope.row.data[col.colNum].td}}</span>
      <el-input v-if="col.attribute ==='pay' && scope.row.data[col.colNum].edit ==='Y' " style="margin: 0; width:100%; height:100%;" v-model="scope.row.data[col.colNum].td" @change="$excel.Calculation(lastHeader, type, F, fkeys, scope.row.data,scope.row.data[col.colNum])" :autofocus="true" size="mini" ></el-input>
    </template>
    <template v-if="col.children">
      <my-column  v-for="(item, index) in col.children"
        :key="index"
        :col="item" :Formula="Formula" :type="type" :lastHeader="lastHeader" >
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
    lastHeader: {}
  },
  data() {
    return {
      F: this.Formula,
      fkeys: Object.keys(this.Formula),
    }
  },
  created (){
        // console.log(row, this.F)
      //  console.log(this.Formula)
      // console.log(this.approval)
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
