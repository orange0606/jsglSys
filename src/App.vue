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
                <div class="top-right">
                    <i class="el-icon-chat-line-round"></i>
                    <span>张三</span>
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
.el-menu-item, .el-submenu__title{
    font-size: 0.8em;
    height: 40px;
    line-height: 40px;
    list-style: none;
    position: relative;
    white-space: nowrap;
}

.el-dialog__body {
  padding: 0 20px;
  font-size:12px;
}

.el-table--border, .el-table--group {
    border: 1px solid #CCCCCC;
}
.el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #CCCCCC;
}
.el-table--border td, .el-table--border th {
    border-right: 1px solid #CCCCCC;
}

</style>
