import axios from 'axios';
import Vue from 'vue';
import store from './store'

const global = window.global;
let config = {
  //请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
  //url: 'http:\/\/192.168.0.245:8080',

  // 请求方法同上
  method: 'post',

  // 基础url前缀
  baseURL: global && global.url ? global.url : 'http://192.168.0.187:8080',
  // baseURL: global && global.url ? global.url : 'http://192.168.0.221:8080',
  // baseURL: global && global.url ? global.url : 'http://192.168.0.207:8080',
  // baseURL: global && global.url ? global.url : 'http://192.168.0.188:8080',
//baseURL: global && global.url ? global.url : 'http://guangzhouhuayu.com/oajsp',

  // domainNameURL:global && global.domainNameURL ? global.domainNameURL : 'http://192.168.0.207:8080',

  //在线Office预览网址
  onlineOffice: global && global.onlineOffice ? global.onlineOffice : 'https://view.officeapps.live.com/op/view.aspx?src=',
  //  onlineOffice: global && global.onlineOffice ? global.onlineOffice : '',
  //设置超时时间
  timeout: 65000,

  //返回数据类型
  responseType: 'json',

  //启用cookie
  withCredentials: true,


};

let instance = axios.create(config);

/* instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    Vue.prototype.$Message.error("请求超时,请检查您的网络!");
    return Promise.reject(error);
}); */

instance.interceptors.response.use(
  function (res) {
    if (res && res.data && res.data.status && res.data.status != 'SUCCESS') {
      Vue.prototype.$Message.error(res.data.message);
      if (res.data.message === '您当前未登录') {
        store.commit('logout')
      }
    }
    return res;
  },
  function (error) {
    // Do something with response error
    if (error.response) {
      Vue.prototype.$Message.error(error.response.data.message);
      if (error.response.data.message === '您当前未登录') {
        store.commit('logout')
      }
    }
    if (!error.response) {
      // else {
      if (error.config.url.indexOf('unread') > 0 || error.config.url.indexOf('count') > 0) {

      } else if (error.message.indexOf('timeout') != -1) {
        Vue.prototype.$Message.error('请求超时，请检查网络设置');
      } else if (error.message.indexOf('Network Error') != -1) {
        Vue.prototype.$Message.error('网络出问题了，请联系相关工作人员。');
      }
    }

    return Promise.reject(error);
  });

export default {instance: instance, config: config};

