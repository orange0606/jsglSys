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
                <div class="top-main">公路建设管理系统</div>
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

*{
  margin: 0;
  padding: 0;
}
a, p{
  margin: 0;
  padding: 0;
}
body{
  /* width: 100%; */
  height: 100%; 
  overflow: hidden;
}
html,body,#app{

 height: 100%;

}

#app {
    /* width: 100%;
  height: 100%; */
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
  /* align-items: center; */
  /* background: pink; */
  /* border: 1px solid red; */

}
.main .nav {
    width: 12.5%;
    min-width: 100px;
    height: 100%;
}
.main .box {
    width: 77.5%;
    height: 100%;
    padding: 10px 5% 10px 5% ;
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
</style>
