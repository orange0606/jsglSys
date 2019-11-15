<template>
  <div
    v-loading="loading"
     @click="setprint" 
      @keyup.enter="setprint"
      class="box"
    element-loading-text="生成数据中，请稍后..."
    element-loading-spinner="el-icon-loading">
    <el-page-header @back="outPrint" content="打印预览">
    </el-page-header>



    <span>鼠标点击表格区域展开打印设置。为保证打印质量，确定打印之前请先调整表格的列宽为适宜。</span>
    
        <!-- @cell-click ="setprint" -->
 <!-- direction: 'broadwise',//方向
      size: 'A4', //纸张尺寸
      margin: 'default' -->
      <!-- :class="[size+'-'+direction+'-'+margin]" -->
    <div id="printTest" :style="{'max-width':width,margin:'0 auto;'} ">
        <elx-editable
        ref="elxEditable10"
        border
        class="table"
        :data.sync="list"
        size="mini"
        :show-header="showHeader"
        v-if="showHeader"
        show-summary
        :summary-method="getSummaries" :style="{'max-width':width}">
        <!-- 此处使用多级表头嵌套组件 -->
        <column v-for="(item,index) in col" :key="index" :col="item" :hd="hd" ></column>

        </elx-editable>

    </div>
    <el-drawer
        title="我嵌套了 Form !"
        :before-close="handleClose"
        :visible.sync="dialog"
        direction="ltr"
        custom-class="demo-drawer"
        ref="drawer"
        >
        <div class="demo-drawer__content">
          <el-form >
            <el-form-item label="纸张尺寸" :label-width="formLabelWidth">
              <el-select v-model="size" placeholder="">
                <el-option label="A4" value="a4"></el-option>
  
              </el-select>
            </el-form-item>
            <el-form-item label="打印布局" :label-width="formLabelWidth">
              <el-select v-model="direction" @change="changstyle" placeholder="">
                <el-option label="横向" value="broadwise"></el-option>
                <el-option label="纵向" value="endwise"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="边距" :label-width="formLabelWidth">
              <el-select v-model="margin" @change="changstyle" placeholder="">
                <el-option label="默认" value="Default"></el-option>
                <el-option label="无" value="none"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer">
            <el-button @click="dialog = false; $refs.drawer.closeDrawer();">取 消</el-button>
            <el-button type="primary" @click="$refs.drawer.closeDrawer();" v-print="'#printTest'" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
          </div>
        </div>
      </el-drawer>
  </div>
</template>

<script>

import Column from './Column';

export default {
 name: 'printing',
  components: {
    Column
  },
  props: {
      tableData:{},
      print_show:{},
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
       form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '80px',
      dialog: true,
      loading: false,
      direction: 'endwise',//方向
      size: 'a4', //纸张尺寸
      margin: 'Default',


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
      this.changstyle(); //判断类名给定样式
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
    changstyle ( name ) {
        console.log('this.size  ',this.size)
        console.log('this.direction  ',this.direction)
        console.log('this.margin  ',this.margin)
        // let ClassName = this.size+'-'+this.direction+'-'+this.margin;
        let ClassName = `${this.size}-${this.direction}-${this.margin}`;

        this.width = '1075px';
        switch(ClassName) {
        case 'a4-endwise-none':
            this.width= '1150px';
            break;
        case 'a4-broadwise-none':
            this.width= '1627px';
            break;
        case 'a4-endwise-Default':
            this.width= '1075px';
            break;
        case 'a4-broadwise-Default':
            this.width= '1569px';
            break;
        } 
        console.log(this.width)
        console.log(ClassName)
    },
    handleClose(done) { //关闭抽屉
        // console.log(this.size+'-'+this.direction+'-'+this.margin)
        done();     
    },
    // setprint(row, column, cell, event){ //单元格点击编辑事件

    // },
    setprint(){ //单元格点击编辑事件
        this.dialog= true;
    },
    outPrint () { //返回清单
        console.info('this.print_show',this.print_show)
        this.$emit('update:print_show', true)
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

/* 无边距  */
    /* 布局纵向 */
.a4-endwise-none{
   width: 1150px;
   /* height: 1627px;
   border: 1px #000 solid; */
 }
/* 布局横向 */
.a4-broadwise-none{
   width: 1627px;
   /* height: 1149px;
   border: 1px #000 solid; */
   
 }

 /* 默认 */
/* 布局纵向 */
.a4-endwise-Default{
  /* width: 210mm; */
  overflow-x: auto;
  width: 1075px;
  /* height: 1568px; */
  /* border: 1px #000 solid; */
}
/* 布局横向 */

.a4-broadwise-Default{
  /* width: 1560px; */
  width: 1569px;
  overflow-x: auto;
  /* height: 1075px; */
  /* border: 1px #000 solid; */
}

 @import '../../modules/Tablestyle.css';
</style>