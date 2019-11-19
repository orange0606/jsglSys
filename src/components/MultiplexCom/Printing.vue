<template>
  <div
    v-loading="loading"
      class="container"
    element-loading-text="生成数据中，请稍后..."
    element-loading-spinner="el-icon-loading">
    <el-page-header @back="outPrint" content="打印预览">
    </el-page-header>

    <h5 style="text-align:cenetr;">为保证打印质量，确定打印之前可拖拽表头调整表格的列宽为适宜。</h5>
    <div id="printTest"  :style="{'width':width, margin:'0 auto;'} ">
        <elx-editable
        ref="elxEditable10"
        border
        class="Print_table_a4"
        :data.sync="list"
        size="mini"
        :show-header="showHeader"
        v-if="showHeader"
        show-summary
        :summary-method="getSummaries">

        <column v-for="(item,index) in col" :key="index" :col="item" :hd="hd" ></column>

        </elx-editable>

    </div>
    <el-drawer
        title="打印预览设置"
        :before-close="handleClose"
        :visible.sync="dialog"
        :modal="false"
        direction="rtl"
        size="18%"
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
            <el-button type="primary" @click="$refs.drawer.closeDrawer();" v-print="'#printTest'" :loading="loading">{{ loading ? '打印中 ...' : '开 始' }}</el-button>
          </div>
        </div>
      </el-drawer>
      <div class="backup">
        <el-tooltip  content="打印" placement="top" :enterable="false" effect="light">
          <el-button type="primary" class="backup_item" icon="el-icon-printer" @click.stop="setprint" ></el-button>
        </el-tooltip>
        <el-tooltip v-if="btnFlag" content="回到顶部" placement="top" :enterable="false" effect="light">
            <el-button type="primary" class="backup_item" icon="el-icon-arrow-up" ></el-button>
        </el-tooltip>
      </div>
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
      formLabelWidth: '80px',
      dialog: false,
      loading: false,
      direction: 'broadwise',//方向
      size: 'a4', //纸张尺寸
      margin: 'Default',
      width: '277mm',
      btnFlag: false, //回到顶不按钮
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        borderRadius: '4px',
        lineHeight: '45px', // 请保持与高度一致以垂直居中
        background: '#e7eaf1'// 按钮的背景颜色
      }
    }
  },
  created () {
      this.loading = true;
      if (this.tableData && this.tableData.list && this.tableData.hd && this.tableData.PackHeader && this.tableData.col) {
          this.list = this.tableData.list;
          this.hd = this.tableData.hd;
          this.PackHeader = this.tableData.PackHeader;
          this.col = this.tableData.col;
          this.totalobj = this.tableData.totalobj; 
          this.loading = false;
      }


  },
  watch: {
       tableData ( newVal, oldVal ) {
            this.loading = true;
            if (newVal && newVal.list && newVal.hd && newVal.PackHeader && newVal.col) {
                this.list = newVal.list;
                this.hd = newVal.hd;
                this.PackHeader = newVal.PackHeader;
                this.col = newVal.col;
                this.totalobj = newVal.totalobj;
                this.changstyle(); //判断类名给定样式
                this.loading = false;
            }

       }
  },
  mounted () {
  let that = this;
  window.addEventListener('scroll', that.scrollToTop, true)
},
destroyed () {
  let that = this;

  window.removeEventListener('scroll', that.scrollToTop, true)
},

  methods: {
    changstyle ( name ) {
        console.log('this.size  ',this.size)
        console.log('this.direction  ',this.direction)
        console.log('this.margin  ',this.margin)
        // let ClassName = this.size+'-'+this.direction+'-'+this.margin;
        let ClassName = `${this.size}-${this.direction}-${this.margin}`;

        this.width = '277mm';
        switch(ClassName) {
        case 'a4-endwise-none':
            this.width= '210mm';
            break;
        case 'a4-broadwise-none':
            this.width= '297mm';
            break;
        case 'a4-endwise-Default':
            this.width= '190mm';
            break;
        case 'a4-broadwise-Default':
            this.width= '277mm';
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
    // 点击图片回到顶部方法，加计时器是为了过渡顺滑
  backTop () {
      const that = this
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5)
        window.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
        if (that.scrollTop === 0) {
          clearInterval(timer)
        }
      }, 16)
  },
 
  // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
  scrollToTop () {
      const that = this

      that.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;  
          
      if(document.body.scrollTop)
          {
          that.scrollTop= document.body.scrollTop;
          }
          else{
          that.scrollTop= document.documentElement.scrollTop
          }
    // let scrollTop = window.scrollTop || window.pageYOffset || document.body.scrollTop || 0;
    // that.scrollTop = scrollTop
    if (that.scrollTop >= 0) {
      that.btnFlag = true
    } else {
      that.btnFlag = false
    }
  },
  



  },

}
</script>



<style scoped>

/* 确认打印按钮水平居中 */
.demo-drawer__footer{ 
  display: flex;
  justify-content: center;
}
.container {
    background: none;
    /* position:relative; */
    /* display: flex;
    justify-content: center; */
    /* flex-direction: column; */
    /* align-items: center; */
    /* flex-wrap:wrap; */

}
#printTest {
  /* position:absolute;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0;
  margin:auto; */
  margin: 0 auto 200px auto;
  min-height: 500px;
}

.backup {
  width: 80px;
  height: 250px;
  /* background: pink; */
  position: fixed;
  display: flex;
  flex-direction:column;
  right: 50px;

  bottom: 50px;
  z-index: 888;
}
.backup_item {
  width: 50px;
  margin: 15px auto;
}


/* 无边距  */
    /* 布局纵向 */
.a4-endwise-none{
   width: 210mm;
   /* height: 1627px;
   border: 1px #000 solid; */
 }
/* 布局横向 */
.a4-broadwise-none{
   width: 297mm;
   /* height: 1149px;
   border: 1px #000 solid; */
   
 }

 /* 默认 */
/* 布局纵向 */
.a4-endwise-Default{
  width: 190mm;
  /* overflow-x: auto; */
  /* width: 1075px; */
  /* height: 1568px; */
  /* border: 1px #000 solid; */
}
/* 布局横向 */

.a4-broadwise-Default{
  /* width: 1560px; */
  width: 277mm;
  /* overflow-x: auto; */
  /* height: 1075px; */
  /* border: 1px #000 solid; */
}

 @import '../../modules/Tablestyle.css';
</style>