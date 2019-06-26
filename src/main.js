// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { Button, Select,Row,Col,Menu,Submenu,MenuItem,MenuItemGroup,Input,Checkbox,Radio,Switch,DatePicker,TimePicker,Form,FormItem,Option,OptionGroup,Message,Table,TableColumn} from 'element-ui';
import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Select)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Radio)
Vue.use(Switch)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Table)
Vue.use(TableColumn)

Vue.prototype.$message = Message;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
