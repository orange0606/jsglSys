
import axios from 'axios';
import store from '@/utils/Store'

import Cookie from 'vue-cookies'


// import { Message } from 'element-ui';

axios.defaults.withCredentials = true;  //axios  请求带上cookie
axios.defaults.timeout = 5000;
// axios.defaults.baseURL = global && global.url ? global.url : 'http://192.168.0.226:8080';
axios.defaults.baseURL = global && global.url ? global.url : 'http://192.168.0.196:8080';
// axios.defaults.baseURL ='http://192.168.0.226:8080';
// axios.defaults.baseURL ='http://192.168.0.196:8080';

// console.log(store.state.username)

//http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = Cookie.get("token");  //注意使用的时候需要引入cookie方法，js-cookie
    config.data = JSON.stringify(config.data);

    config.headers = {
      'Content-Type':'application/json;charset=UTF-8',
    }
    // if(token){
    //   config.params = {'token':token}
    // }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);


//http response 拦截器
// axios.interceptors.response.use(
//   response => {
//     if(response.data.errCode ==2){
//       router.push({
//         path:"/login",
//         querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
//       })
//     }
//     return response;
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url,params={}){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url,data = {}){
   return new Promise((resolve,reject) => {
     axios.post(url,data)
          .then(response => {
            resolve(response.data);
          },err => {
            reject(err)
          })
   })
 }

 /**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}