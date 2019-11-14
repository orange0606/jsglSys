<template>
  <div
    v-loading="loading"
    element-loading-text="生成数据中，请稍后..."
    element-loading-spinner="el-icon-loading">
    <el-button type="success" size="mini" @click="printed">预览打印</el-button>
    <div id="printJS-table" style="margin: 0 auto;">
        <elx-editable
        ref="elxEditable4"
        
        border
        
        :data.sync="list"
        size="small"
        :show-header="showHeader"
        v-if="showHeader"
        show-summary
        :summary-method="getSummaries">
        <!-- <elx-editable-column type="selection" align="center" width="45" :key="$excel.randomkey(this)" ></elx-editable-column>
        <elx-editable-column type="index" width="60" align="center" :key="$excel.randomkey(this)" ></elx-editable-column> -->
        <!-- 此处使用多级表头嵌套组件 -->
        <column v-for="(item,index) in col" :key="index" :col="item" :hd="hd" ></column>

        </elx-editable>

    </div>
  </div>
</template>

<script>
import print from 'print-js'
import Column from './Column';
export default {
 name: 'printing',
  components: {
    Column
  },
  props: {
      tableData:{}
  },
  data () {
    return {
      showHeader:true,//表头显示以及表格显示强制渲染
      loading: false,
      col:[],//多级表头嵌套数据
      PackHeader:[],//表头已组装数据
      list:[],//表格数据
      hd:[],//用作单元格合并
      Height: 500, 
      totalobj:{},

    }
  },
  created () {
      if (this.tableData && this.tableData.list && this.tableData.hd && this.tableData.PackHeader && this.tableData.col) {
          this.list = this.tableData.list;
          this.hd = this.tableData.hd;
          this.PackHeader = this.tableData.PackHeader;
          this.col = this.tableData.col;
          this.totalobj = this.tableData.totalobj;
             
      }
  },
  mounted(){
  },
  watch: {
       tableData ( newVal, oldVal ) {
            if (newVal && newVal.list && newVal.hd && newVal.PackHeader && newVal.col) {
                this.list = newVal.list;
                this.hd = newVal.hd;
                this.PackHeader = newVal.PackHeader;
                this.col = newVal.col;
                this.totalobj = newVal.totalobj;
             
            }
       }
  },
  methods: {
    printed () {
        console.log('没反应吗')
        console.log(print)
        print('printJS-table', 'html');
    },
    refreshTable () {  //刷新表格布局
        this.$nextTick(() => {  //强制重新渲染
          this.startTime = Date.now(); 
          this.showHeader = false;
          setTimeout(()=>{
              this.showHeader = true;
          },100);
        })
    },
    getSummaries (param) {  //合计
        // if (this.$root.state && this.list && this.list.length >0) {
        //     console.log('调用了合计');
        //     this.totalobj = this.$excel.Total(this.list, this.PackHeader); //调用合计计算
        //     this.$root.state = false;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
        // }
        let { columns, data } = param,
        sums = [];
        if (!this.totalobj) return sums;
        columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '合计'
                // return
            }else if(index >2){
                sums[index] = this.totalobj[column.property];
            }
        })
        return sums;
    },
  },

}
</script>



<style scoped>
    @import '../../modules/Tablestyle.css';
</style>