<template>
    <div style="width:400px;" v-loading="loading" >
   <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
            <el-input v-model="form.username" width="200px" ></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="form.password" show-password width="200px"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
            <el-button>取消</el-button>
        </el-form-item>
    </el-form>
    </div>
</template>
<script>
export default {
    name:'Login',
    data() {
        return {
            form: {
                username: '',
                password: '',
            },
            loading:false,
        }
    },
    methods: {
      onSubmit() {
        var that = this;     
        this.loading = true;
        
        // this.$refs.form.resetFields();
        console.log('submit!');
        console.log(this.form)
        let username = this.form.username;
        let password = this.form.password;
        this.$post('/login',{ username,password})
            .then((arg) => {
            this.loading = false;
            this.$message({
            type: 'success',
            message: `登陆成功!`
            })
            this.loading = false;
            var person = {id:arg.data.user.id,'姓名':arg.data.user.name};
            // 第一个参数saveToken为这里调用的全局变量文件中定义的方法，第二个参数为传入的变量
            // arg.data.token
            //路由拦截器
            that.$store.commit("saveToken",{"username": that.form.username,"token":arg.data.user.id});
            sessionStorage.setItem('user', JSON.stringify(arg.data.user));
            sessionStorage.setItem('positions', JSON.stringify(arg.data.positions));
            sessionStorage.setItem('login', JSON.stringify(true));
            sessionStorage.setItem('person', JSON.stringify(person));  
            var url = that.$route.query.backUrl;
                // console.log(url)
                if (url){
                    that.$router.push({path:url})
                }else {
                    that.$router.push({path:"/"})
            }

        })
        

      }
    }
  }
</script>
