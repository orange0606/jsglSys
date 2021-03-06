// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'babel-polyfill';

import Vue from 'vue';
import { Button, Select,Row,Col,Menu,Submenu,MenuItem,MenuItemGroup,Input,Checkbox,Radio,Switch,
  DatePicker,TimePicker,Form,FormItem,Option,OptionGroup,Message,MessageBox,Notification, Tabs, TabPane,
  Popover,Dialog,Table,TableColumn,Alert,Pagination,Loading,Tag, Slider, Card, Cascader,Badge,Tooltip, Link,Collapse,CollapseItem, PageHeader, Drawer} from 'element-ui';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import App from './App';
import router from './router';
// Table,TableColumn,
Vue.config.productionTip = false;
// Vue.use(Loading);


Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Select);
Vue.use(Row);
Vue.use(Col);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Switch);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Badge);
Vue.use(Link);
// Vue.use(TableColumn);
Vue.use(Alert);
Vue.use(Loading.directive);
Vue.use(Popover);
Vue.use(Tag);
Vue.use(Slider);
Vue.use(Card);
Vue.use(Cascader);
Vue.use(Tooltip);
Vue.use(Alert);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(PageHeader);
Vue.use(Drawer);



Vue.component(CollapseTransition.name, CollapseTransition)

import {
  Editable,
  EditableColumn
} from 'vue-element-extends'
import 'vue-element-extends/lib/index.css'

// import XLSX from "xlsx"

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Editable)
Vue.use(EditableColumn)

Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.prototype.$alert = MessageBox.alert;

//挂载一个原型，表格el-table-column 的key值 用于表头错乱修正 
Vue.prototype.$keys = 0;


// import axios from "axios"
// // //将axios挂载到原型上
// Vue.prototype.$axios = axios;

// 引入excel 表格导入js处理函数模块
import excelmodel from './modules/proces';
Vue.prototype.$excel = excelmodel;
import xlsxstyle from './modules/xlsxstyle';
Vue.prototype.$xlsxstyle = xlsxstyle;

import Print from 'vue-print-nb'
Vue.use(Print); 

import XLSX from 'xlsx-style';
import XLSX2 from 'xlsx';
Vue.use(XLSX)
Vue.use(XLSX2)
//取窗口可视范围的高度
Vue.prototype.$getClientHeight=function(){
  var clientHeight=0;
  if(window.innerHeight && document.documentElement.clientHeight)
  {
    clientHeight = window.innerHeight > document.documentElement.clientHeight ? window.innerHeight : document.documentElement.clientHeight;
  }
  else
  {
    clientHeight = window.innerHeight || document.documentElement.clientHeight;
  }
  return clientHeight;
}
//取窗口可视范围的宽度
Vue.prototype.$getClientWidth=function(){
  var clientWidth=0;
  if(window.innerWidth && document.documentElement.clientWidth)
  {
    clientWidth = window.innerWidth > document.documentElement.clientWidth ? window.innerWidth : document.documentElement.clientWidth;
  }
  else
  {
    clientWidth = window.innerWidth || document.documentElement.clientWidth;
  }

  return clientWidth;
}

// 引入工具类-目录自定义
import store from '@/utils/Store'
Vue.prototype.$store = store;
import {post,fetch,patch,put} from '@/utils/request'
//挂载在原型
Vue.prototype.$post=post;
Vue.prototype.$fetch=fetch;
Vue.prototype.$patch=patch;
Vue.prototype.$put=put;

// Vue.prototype.HOST = '/api'


// 路由拦截器
router.beforeEach(function (to, from, next) {
  if (to.meta.requireAuth){
    if (store.state.token){
      next()
    }else {
      next({name: "login",query:{backUrl:to.fullPath}})
    }
  } else {
    next()
  }

});
new Vue({
  el: '#app',
  router,
  data() {
    return {
        state: true,  //定义一个全局变量，作为清单合计尾行是否计算的状态值，true为是
    };
  },
  mounted () {
    var self= this;
    self.$store.commit("setClientHeight",self.$getClientHeight());
    self.$store.commit("setClientWidth",self.$getClientWidth());
    window.onresize = function(){ 
      self.$store.commit("setClientHeight",self.$getClientHeight());
      self.$store.commit("setClientWidth",self.$getClientWidth());
    }     
  },
  components: { App },
  template: '<App/>'
})
