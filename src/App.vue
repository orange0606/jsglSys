
<template>
  <div id="app">
    <!-- 头部 -->
    <header class="top">
        <el-row >
            <el-col :span="3" :xs="6" :sm="6" :md="6" :lg="3">
                <div class="top-left">
                    <span>主页</span>
                    <i class="el-icon-sunny"></i>
                </div>
            </el-col>
            <el-col :span="18" :xs="12" :sm="12" :md="12" :lg="18">
                <div class="top-main">建设管理系统</div>
            </el-col>
            <el-col :span="3" :xs="6" :sm="6" :md="6" :lg="3">
                <div v-if="this.$store.state.token" class="top-right">
                    <i class="el-icon-chat-line-round"></i>
                    <span>{{this.$store.state.username}}</span>
                    <i class="el-icon-user"></i>
                    <span @click="outlogin">注销</span>
                </div>
                <div v-else class="top-right">
                    <i class="el-icon-chat-line-round"></i>
                    <span>未登录</span>
                    <i class="el-icon-user"></i>
                </div>
            </el-col>
        </el-row>
    </header>
    <section class="main">
          <div class="nav">
                <!-- 引入侧边栏组件 -->
              <sidebar></sidebar>
          </div>
          <div class="box">
              <!-- 此处为显示区 -->
                <router-view/>
          </div>

    </section>
    <footer>

    </footer>
  </div>
</template>

<script>
import sidebar from '@/components/sidebar'
export default {
  name: 'App',
  components: { sidebar },
  methods:{
    outlogin(){
      sessionStorage.clear();
      this.$store.commit("clearToken",{"username": this.$store.state.username,"token":this.$store.state.token});
      this.$router.push({path:"/login"})
    }
  }
}
</script>

<style>
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin:0; padding:0; } 
body, button, input, select, textarea { font:12px/1.5tahoma, arial, \5b8b\4f53; } 
h1, h2, h3, h4, h5, h6{ font-size:100%; } 
address, cite, dfn, em, var { font-style:normal; } 
code, kbd, pre, samp { font-family:couriernew, courier, monospace; } 
small{ font-size:12px; } 
ul, ol { list-style:none; } 
a { text-decoration:none; } 
a:hover { text-decoration:underline; } 
sup { vertical-align:text-top; } 
sub{ vertical-align:text-bottom; } 
legend { color:#000; } 
fieldset, img { border:0; } 
button, input, select, textarea { font-size:100%; } 
table { border-collapse:collapse; border-spacing:0; }
body, html, #app{
    width: 100%;
    height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 10px; */
  /* padding: 10px; */
}
.top {
  width: 100%;
  height: 50px;
  line-height: 50px;
  /* padding: 0 10px 0 10px; */
  background: #66B1FF;
  text-align: center;
}
.top span {
  margin: 0 5px 0 5px;
}
.main {
  width: 100%;
  height: 87%;
  display: inline-flex;
}
.main .nav {
    width: 12.5%;
    min-width: 100px;
    height: 100%;
}
.main .box {
    width: 82.5%;
    height: 100%;
    padding: 10px 2.5% 10px 2.5% ;
    overflow: auto;
}

*{
    margin: 0;
    padding: 0;
}


/* ************************各清单表格内容样式开始********************** */

.el-table {
  scroll-snap-align: start;
  
 /* position: sticky; 
 position: -webkit-sticky; 
  scroll-behavior: auto;
  scroll-behavior: smooth;
 position: sticky;

 scroll-behavior: -webkit-smooth;
 position: -webkit-sticky;
 overflow: hidden;

  -webkit-overflow-y: auto;
 -moz-overflow-y: auto; */
  scroll-behavior: smooth;
 position: sticky;
 /* overflow-y: auto;  */
}
.el-table--border th.gutter:last-of-type{
 display: table-cell !important; 
 width:50px !important; 
}
.scroll-table4 .cell {
 -webkit-box-sizing: border-box;
 box-sizing: border-box;
 white-space: normal;
 word-break: break-all;
 line-height: 17px;
}
/* 去除单元格内的内边距 */
.el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
 padding-left: 0px;
}
.el-table .cell, .el-table th div {
 text-overflow: ellipsis;
 padding-right: 0px;
 overflow: hidden;
}
/* .el-table__body, .el-table__footer, .el-table__header {
 scroll-behavior: smooth;
 position: sticky;
 position: -webkit-sticky;
 -moz-scroll-behavior: smooth;
 -moz-position: sticky;
 scroll-behavior: smooth;
 position: sticky;
} */
/* table.el-table__body tbody{
 scroll-behavior: smooth;
 overflow-y: auto;
} */
/* tbody {
 scroll-behavior: smooth;
 overflow-y: auto;
 position: sticky;
} */
.click-table11-oper {
 height: 30px;
 margin-bottom: 10px;
 /* border: 1px solid pink; */
 text-align: left;
 position: relative;
}
.click-table11-oper .right {
 position: absolute;
}
.click-table11-pagination {
 margin-top: 18px;
 text-align: right;
}
.click-table11 .drag-btn {
 font-size: 16px;
 cursor: move;
}

.scroll-table4-oper {
 margin-bottom: 15px;
}


/* 合计尾行不显示兼容问题 */
/* .el-table{
   overflow:visible !important;
}
body .el-table th.gutter{
   display: table-cell!important;
} */
.el-table--border th.gutter:last-of-type{
 display: table-cell !important; 
 width:50px !important; 
}
/* 表格行高input等高度设置 */
.scroll-table4.el-table--mini .elx-editable-column {
   padding: 0;
   height: 23px !important;
   line-height: 23px;
   min-height: 5px;
}
/* 修复在其他项目中的显示问题 */
/* .elx-editable.el-table--mini .elx-editable-column {
   height: 23px;
} */
/* .elx-editable.el-table--mini .elx-editable-column {
   padding: 0;
   height: 22px;
} */
.el-table--border, .el-table--group {
 border: 1px solid#909399 !important;
}
.el-table--border th, .el-table__fixed-right-patch {
 border-bottom: 1px solid#909399 !important;
}

.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
 border-right: 1px solid #909399 !important;
}
.el-table td, .el-table th.is-leaf {
 border-bottom: 1px solid #909399 !important;
}

.scroll-table4 .cell {
   -webkit-box-sizing: border-box;
   box-sizing: border-box;
   white-space: normal;
   word-break: break-all;
   line-height: 17px;
}
.scroll-table4 .el-input--mini .el-input__inner {
   margin: 0;
   height: 22px;
   line-height: 22px;
}
.scroll-table4 th, .scroll-table4 td { padding: 0; margin: 0; line-height: 0%; }

/* 清单显示弹出框 */
.el-dialog__body {
 padding: 0 20px;
 margin: 0;
 font-size:12px;
 border:1px solid transparent;
}

.el-table th > .cell.gutter {
   display: table-cell !important;
}
/* 表头错乱 */
.el-table.el-table--border th.gutter {
 display: table-cell !important;
}

.el-table.el-table--border colgroup.gutter {
 display: table-cell !important;
}

/* 清单选择导入按钮 */
.btn {
 text-align: right;
 margin: 15px 20px 10px 0;
}

/* //滚动条的宽度 */
::-webkit-scrollbar {
 width: 10px;
 height: 10px;
}
::-webkit-scrollbar-thumb {
 height: 30px;
 background-color: #E3FBFE;
 border-radius: 2px;
 scroll-behavior: auto;
}
::-webkit-scrollbar-track{
 box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
 border-radius: 2px;
 background: rgba(0,0,0,0.1);
 scroll-behavior: auto;
} 


/* 打印表格样式开始 */
.Print_table_a4 .cell {
   -webkit-box-sizing: border-box;
   box-sizing: border-box;
   white-space: normal;
   word-break: break-all;
   line-height: 17px !important;
   color: #000;
   font-size: 10pt !important;
   font-family: 'SimSun' !important;
  }
  /* 表格行高设置 */
  .Print_table_a4.el-table--mini .elx-editable-column {
   padding: 0;
   height: 17px !important;
   line-height: 17px !important;
   min-height: 5px;
  }
  .Print_table_a4.el-table--mini td, .Print_table_a4.el-table--mini th {
    padding: 2px 0;
}
  .Print_table_a4.el-table--border, .Print_table_a4.el-table--group {
   border: 1px solid#000 !important;
  }
  .Print_table_a4.el-table--border th, .Print_table_a4.el-table__fixed-right-patch {
   border-bottom: 1px solid#000 !important;
  }
  
  .Print_table_a4.el-table--border td, .Print_table_a4.el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
   border-right: 1px solid #000 !important;
  }
  .Print_table_a4.el-table td, .Print_table_a4.el-table th.is-leaf {
   border-bottom: 1px solid #000 !important;
  }
  
  .Print_table_a4 .el-table__footer-wrapper td {
      border-top: 1px solid #24262b !important;
  }


/* ************************各清单表格内容样式结束********************** */
.el-drawer.ltr, .el-drawer.rtl, .el-drawer__container {
    top: 0;
    bottom: 0;
    height: 100%;
    overflow-y: auto !important;
}
</style>
