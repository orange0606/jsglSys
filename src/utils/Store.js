import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookies'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username:  Cookie.get("username"),
    token:  Cookie.get("token"),
    //定义全局屏幕宽度、高度变量
    clientSize:{
      width:400, //初始值
      height:300,  //初始值
    },
  },
  mutations: {
    saveToken: function (state, userToken) {
      state.username = userToken.username;
      state.token = userToken.token;
      Cookie.set("username", userToken.username, "20min");
      Cookie.set("token", userToken.token, "20min");
    },
    clearToken: function (state) {
      state.username = null;
      state.token = null;
      Cookie.remove("username");
      Cookie.remove("token");
      // this.$router.push({name: "micro"});
    },
    setClientHeight(state,height){
      state.clientSize.height=height;
    },
    setClientWidth(state,width){
      state.clientSize.width=width;
    },
  }
})