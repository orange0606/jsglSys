<template>
  <div v-loading="loading">
    <!-- <p style="color: red;font-size: 12px;">关闭自动清除：如果 autoClearActive=false 当点击其它地方后，则不会自动清除最后活动行或列</p> -->
      <div v-if="all.tender" class="title">标段名称：<span class="demonstration" v-text="all.tender.name"></span></div>  
      <div class="title">表头编号：<span class="demonstration" v-text="all.num"></span></div>
      <div class="title">表头名称：<span class="demonstration" v-text="all.name"></span></div>
      <div class="title">类别：<span class="demonstration" v-text="type"></span></div>
      <div v-if="all.saveEmployee" class="title">创建人：<span class="demonstration" v-text="all.saveEmployee.name"></span></div>
      <div class="title">创建时间：<span class="demonstration" v-text="all.saveTime"></span></div>
     
    <div class="manual-table4-oper">
       <el-button type="success" size="mini" @click="upfun">修改</el-button>
      <!--<el-button type="danger" size="mini" @click="deleteSelectedEvent">删除选中</el-button> -->
      <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
      <span class="switch">
         <el-switch
            v-model="attShow"
            active-text="显示属性"
            >
        </el-switch>
      </span>
    </div>
    
    <elx-editable
      ref="elxEditable"
      class="manual-table4"
      border
      height="400"
      :data.sync="list"
      :span-method="arraySpanMethod"
      :cell-style ="cell_select"
      style="width: 100%">
      <!-- <elx-editable-column type="selection" width="55"></elx-editable-column> -->
     <elx-editable-column type="index" width="50"> </elx-editable-column>
      <elx-editable-column :prop="val+'.td'" :label="columnName[i]" show-overflow-tooltip v-for="(val,i) in hd" :key="i"  > 
           <template v-if="attShow" slot-scope="scope" >
                <span style="width:100%;height:100%;display:block;">{{scope.row[val].td}}</span>
                <el-badge  v-if="scope.row[val].attribute !=null" type="warning" :value="badge_name[scope.row[val].attribute]" class="new"></el-badge>
                <el-badge  v-if="scope.row[val].tLimit !=null" type="success" :value="badge_name[scope.row[val].tLimit]" class="new"></el-badge>
            </template>      
      </elx-editable-column>
    </elx-editable>
     <div v-if="Form" class="form2">
        <h3 >关联的清单</h3>
        <div v-if="Form.tender" class="title">标段名称：<span class="demonstration" v-text="Form.tender.name"></span></div>  
        <div class="title">表头编号：<span class="demonstration" v-text="Form.num"></span></div>
        <div class="title">表头名称：<span class="demonstration" v-text="Form.name"></span></div>
        <div class="title">类别：<span class="demonstration" >原清单</span></div>
        <div v-if="Form.saveEmployee" class="title">创建人：<span class="demonstration" v-text="Form.saveEmployee.name"></span></div>
        <div class="title">创建时间：<span class="demonstration" v-text="Form.saveTime"></span></div>
      </div>
 
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import inven from '../../modules/inventory';
export default {
  name: 'edit',
  props:['heads','tableList'],
  data () {
    return {
      loading: false,
      list: [],
      headObj:{},
      hd:[],
      packaList:[],
      all:{},
      attShow:true,
      badge_name:inven.badge_name, //属性标记名对象
      columnName:[],//列的名  A B C
      key:'',//请求清单的清单类型
      Form:{},//关联的清单

    }
  },
  created () {
    // console.log('这里打印一下父组件传来的 id，type  对象')
    // console.log(this.heads)
    if (this.headObj!=null) {
        this.headObj = this.heads;
        this.findList(this.headObj.id,this.headObj.type)
        // this.packaList = this.tableList;
    }
    
  },
  watch: {
    heads: function(newVal,oldVal){
      if (this.headObj!=null) {
        this.headObj = newVal;
        this.findList(this.headObj.id,this.headObj.type)
      } 
    }
  },
  computed: {
    // 计算属性的 getter
    type: function () {
      // `this` 指向 vm 实例
      let obj = {
        original: '原清单',
        change: '变更清单',
        update: '变更后的清单',
        meterage: '计量清单',
        totalmeterage: '累计计量清单',	
        pay: '支付清单',
        totalpay: '累计支付清单'
      }
      return this.all.type ? obj[this.all.type ] : '未知'
    }
  },
  methods: {
    upfun () {  //修改数据函数（传值给父组件）
          if (this.hd.length >0 ) {
              // this.$emit("update:tableList", this.packaList)
              let arr = XEUtils.clone(this.all, true)
              delete arr[this.key]
              let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
              arr.headRowList = rest;
              this.$emit("update:tableList",arr)
          }

    },
    findList (id,type) {
      this.loading = true
        //发起网络请求
      // console.log('发起网络请求 id')
      this.$post('/head/getone',{id, type})
        .then((response) => {
        // console.log('请求成功')
        // console.log(response)
        // this.list = response.data.oneh.headRowList;
        this.Form = response.data.onehead.tOriginalHead
        this.all = response.data.onehead;
        let data = response.data.onehead;
        this.key = '';
        if (type == 'original') {
          this.key = 'tOriginalHeadRows';
        }else if (type == 'change'){
          this.key = 'tChangeHeadRows';
        }else if (type == 'update'){
          this.key = 'tUpdateHeadRows';
        }else if (type == 'totalmeterage'){
          this.key = 'tTotalmeterageHeadRows';
        }else if (type == 'meterage'){
          this.key = 'tMeterageHeadRows';
        }else if (type == 'totalpay'){
          this.key = 'tTotalpayHeadRows';
        }else if (type == 'pay'){
          this.key = 'tPayHeadRows';
        }
        console.log('行号列好=======edit')
        console.log(data.refCol,data.refRow)

        //调用表格组装函数（返回的是个数组对象）
        let arr = this.$excel.Package(data[this.key],data.refCol,data.refRow);
        this.hd = Object.keys(arr[0]);
        console.log('edit colllllllllllll')
        console.log(this.hd)

        //调用表格列名函数  （返回的是一个包括excel基本所有列的数组)
        let AZ = this.$excel.AZ()
        this.columnName = AZ.slice(0,data.refCol);
        this.loading = false;
        this.list = arr;
        // this.packaList = arr;

      })
     
    },
    cell_select ({row, column, rowIndex, columnIndex}){ //单元格样式
          if (columnIndex !=0 && columnIndex < this.hd.length) {
              return {'text-align': row[this.hd[columnIndex]].textAlign,'height':row[this.hd[columnIndex]].trHigh+'px'}
          }
          return {'text-align': 'center'}
     },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {   //单元格合并处理
          if (columnIndex >0) {  //带选择框的情况
              if (columnIndex <= this.hd.length) {
                  return [row[this.hd[columnIndex-1]].tdRowspan, row[this.hd[columnIndex-1]].tdColspan]
              }
          }
          // if (columnIndex < this.hd.length) {   //不带选择框的情况
          //     return [row[this.hd[columnIndex]].tdRowspan, row[this.hd[columnIndex]].tdColspan]
          // }
          return [1, 1]
      }, 
    exportCsvEvent () {
      this.$refs.elxEditable.exportCsv()
    }
  }
}
</script>

<style scoped>
.title{
  display: inline;
  margin-right: 10px;
  color: cadetblue;
}
.demonstration {
  /* color: #606266; */
  color: pink;

}
.switch {
  /* text-align: right; */
  position: absolute;
  right: 0px;
}
/* .el-switch {
  right: 0px;
} */
.manual-table4-oper {
  margin: 15px 0 18px 0;
  text-align: left;
  position: relative;
}
.manual-table4-pagination {
  margin-top: 18px;
  text-align: right;

}
.manual-table4.elx-editable .elx-editable-row.new-insert,
.manual-table4.elx-editable .elx-editable-row.new-insert:hover>td {
  background-color: #f0f9eb;
}
.text {
  font-size: 14px;
  
}

.new {
  margin-top: -5px;
  font-size: 5px;
  color: #409EFF;
  /* margin-right: 40px; */
}
.form2 {
  margin: 30px 0 0 0;
  height: 100px;
}
</style>