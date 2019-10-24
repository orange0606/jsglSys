<template>
  <el-table-column :prop="col.colNum+'.td'" :label="col.td" :fit="true" :key="$excel.randomkey()" :min-width="$excel.Setwidth(col.td)" :width="$excel.Setwidth(col.td, hd)" :align="col.textAlign">
    <template slot-scope="scope">
      <span v-if="scope.row.data[col.colNum].edit && scope.row.data[col.colNum].edit ==='N'">{{scope.row.data[col.colNum].td}}</span>
      <el-input v-if="scope.row.data[col.colNum].edit && scope.row.data[col.colNum].edit ==='Y'" style="margin: 0; width:100%; height:100%;" v-model="scope.row.data[col.colNum].td" @change="$excel.Calculation(lastHeader, type, F, fkeys, scope.row.data,scope.row.data[col.colNum])" :autofocus="true" size="mini" ></el-input>
    </template>
    <template v-if="col.children">
      <my-column  v-for="(item, index) in col.children"
        :key="index"
        :col="item" :Formula="Formula" :type="type" :lastHeader="lastHeader" :hd="hd">
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

    }
  },
  data() {
    return {
      F:this.Formula,
      fkeys : Object.keys(this.Formula),
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