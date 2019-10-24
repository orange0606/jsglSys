<template>
   <el-table-column :prop="col.colNum+'.td'" :label="col.td+' ( '+col.colNum+' ) '+col.attribute" :fit="true" :key="$excel.randomkey()" :width="$excel.Setwidth(col.td)" :align="col.textAlign">
    <template slot-scope="scope">
      <!-- <span>{{scope.row.data[col.colNum].td}}</span> -->
      <span v-if="scope.row.data[col.colNum].edit ==='N'">{{scope.row.data[col.colNum].td}}</span>
      <el-input v-if="(col.attribute === 'meterage' && scope.row.data[col.colNum].edit ==='Y') || scope.row.data[col.colNum].edit ==='Y'" style="margin: 0; width:100%; height:100%;" v-model="scope.row.data[col.colNum].td" @change="$excel.Calculation(lastHeader, type, F, fkeys, scope.row.data,scope.row.data[col.colNum])" :autofocus="true" size="mini" ></el-input>
    </template>
    <template v-if="col.children">
      <my-column  v-for="(item, index) in col.children"
        :key="index"
        :col="item" :Formula="Formula" :type="type" :lastHeader="lastHeader">
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
  input{
      /* width: 50px; */
      padding: 0 10px;
      /* border:none; */
      /* outline: none; */
      /* line-height: 30px; */
      float: left;
      text-align: center;
      color: #666;
      border-color: #66afe9;
      outline: 0;
      -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
      box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
  }

</style>
