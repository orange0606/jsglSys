<template>
  <el-table-column :prop="col.colNum+'.td'" :label="col.td+'-'+col.colNum" :fit="true" :min-width="$excel.Setwidth(col.td)" :width="$excel.Setwidth(col.td, hd)" :align="col.textAlign">
    <template slot-scope="scope">
          

      <el-tooltip v-if="scope.row.data[col.colNum].edit && scope.row.data[col.colNum].edit ==='N' && scope.row.data[col.colNum].formula " class="item" effect="light" :content="scope.row.data[col.colNum].formula" placement="top">
          <span class="color" >{{scope.row.data[col.colNum].td}}</span>
      </el-tooltip>
      
      <span v-if="scope.row.data[col.colNum].edit && scope.row.data[col.colNum].edit ==='N' && !scope.row.data[col.colNum].formula" class="" >{{scope.row.data[col.colNum].td}}</span>
      <el-input v-if="scope.row.data[col.colNum].edit && scope.row.data[col.colNum].edit ==='Y'" style="margin: 0; width:100%; height:100%;" v-model="scope.row.data[col.colNum].td" @change="Rowchange(lastHeader, type, F, fkeys, scope.row.data,scope.row.data[col.colNum], list, hd, collect)" :autofocus="true" size="mini" ></el-input> 
     
      <!-- <span class="" >{{scope.row.data[col.colNum].td}}</span> -->
    </template>
    <template v-if="col.children">
      <my-column  v-for="(item, index) in col.children"
        :key="index"
        :col="item" :Formula="Formula" :type="type" :lastHeader="lastHeader" :hd="hd" :list="list" :collect="collect">
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
    list: {},
    collect: {}

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
      Rowchange (lastHeader, type, F, fkeys, row,col, list, hd, collect) {
          this.$root.state = true;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
          this.$excel.Calculation(lastHeader, type, F, fkeys, row,col, list, hd, collect)
          
      }

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
  .span {
    width: 100%;
    height: 100%;
    background: pink;
    padding: 0;
    margin: 0;
    display: block;
  }
</style>