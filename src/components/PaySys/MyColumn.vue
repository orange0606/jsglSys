<template>
  <el-table-column :prop="col.colNum+'.td'" :label="col.td" show-overflow-tooltip :align="col.textAlign">
    <template slot-scope="scope">
      <span v-if="scope.row.data[col.colNum].edit && scope.row.data[col.colNum].edit ==='N'">{{scope.row.data[col.colNum].td}}</span>
      <el-input v-else style="margin: 0; width:100%; height:100%;" v-model="scope.row.data[col.colNum].td" @change="Calculation(scope.row.data,scope.row.data[col.colNum])" :autofocus="true" size="mini" ></el-input>
    </template>
    <template v-if="col.children">
      <my-column  v-for="(item, index) in col.children"
        :key="index"
        :col="item" :Formula="Formula">
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
    }
  },
  data() {
    return {
      F:this.Formula,
      fkeys : Object.keys(this.Formula)
    }
  },
  created (){
        // console.log(row, this.F)
      //  console.log(this.Formula)
      // console.log(this.approval)
  },
  methods:{
    Calculation (row,col) { //单元格值发生改变后进行行公式计算
        var patt1 = /[\u4e00-\u9fa5]/g,
        strArr = col['td'].match(patt1);
        if (strArr !=null) {  //检测有中文的话，就不进行公式计算
            return false;
        }
        col.td = this.filterStr(col['td']); //去除多余特殊字符串
        try {
            for (let index = 0; index < this.fkeys.length; index++) {
                setTimeout(()=>{
                    let sum = this.F[this.fkeys[index]];
                    let Eval = eval(sum);
                    Eval || Eval==0 ? row[this.fkeys[index]].td = Eval: row[this.fkeys[index]].td;  //字符串转代码计算
                },100)
            }
        } catch (error) {
            console.log(error)
            return this.$message({ message: '这边出现了点问题，貌似是公式错误，请先去检查一下表头。再进行录入吧！', type: 'warning', duration: 3000, showClose: true });
        }
    },
    filterStr (str) {  //去除空白以及特殊字符串
        str = str.replace(/\s*/g,"");
        var pattern = new RegExp("[`~!@#$^&（）|{}':;',\\[\\]<>?~！@#￥……&——|{}【】‘；：”“'。，、？_]"),
        specialStr = "";  
        for(var i=0;i<str.length;i++){  
            specialStr += str.substr(i, 1).replace(pattern, '');   
        }  
        return specialStr;  
    },
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
