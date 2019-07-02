// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { Button, Select,Row,Col,Menu,Submenu,MenuItem,MenuItemGroup,Input,Checkbox,Radio,Switch,
  DatePicker,TimePicker,Form,FormItem,Option,OptionGroup,Message,MessageBox,Notification,
  Popover,Dialog,Table,TableColumn,Alert,Pagination,Loading} from 'element-ui';
import App from './App'
import router from './router'
// Table,TableColumn,
Vue.config.productionTip = false
// Vue.use(Loading);
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
// Vue.use(Table);
// Vue.use(TableColumn);
Vue.use(Alert);
Vue.use(Loading.directive);
Vue.use(Popover);

import {

  Editable,
  EditableColumn
} from 'vue-element-extends'
import 'vue-element-extends/lib/index.css'

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Editable)
Vue.use(EditableColumn)



Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
