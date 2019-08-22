<template>
  <div class="hello">
    <header >
    <el-row>
        <el-col :span="6" :xs="24" style="min-width:300px;">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" size="small" class="demo-ruleForm">
                <el-form-item label="表头标段" prop="region">
                    <el-select v-model="ruleForm.region" clearable @change="tenChange" placeholder="请选择表头标段" style=" width:100%;">
                        <el-option v-for="(val,i) in regionList" :key="i" :label="val.name" :value="val.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="表头类型" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择表头类型" @change="typeChange" clearable size="small" style=" width:100%;">
                        <el-option label="原清单" value="original"></el-option>
                        <el-option label="变更清单" value="change"></el-option>
                        <!-- <el-option label="变更后的（新清单）" value="update"></el-option> -->
                        <el-option label="计量清单" value="meterage"></el-option>
                        <el-option label="累计计量清单" value="totalmeterage"></el-option>
                        <el-option label="支付清单" value="pay"></el-option>
                        <el-option label="累计支付清单" value="totalpay"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="ruleForm.type=='change'" label="选择表头" prop="tOriginalHeadId">
                    <el-select v-model="ruleForm.tOriginalHeadId" placeholder="请选择原清单表头" @change="torigChang" clearable size="small" style=" width:100%;">
                        <el-option v-for="(val,i) in HeadList" :key="i+1" :label="val.name" :value="val.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="ruleForm.type=='meterage'" label="选择表头" prop="tOriginalHeadId">
                    <el-select v-model="ruleForm.tOriginalHeadId" placeholder="请选择变更后新清单表头" @change="torigChang" clearable size="small" style=" width:100%;">
                        <el-option v-for="(val,i) in HeadList" :key="i+1" :label="val.name" :value="val.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="表头编号" prop="number">
                    <el-input v-model="ruleForm.number"></el-input>
                </el-form-item>
                <el-form-item label="表头名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item v-if="!dialogVisible">
                    <el-button type="primary" @click="submitHeader">立即创建</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        
    </el-row>
    </header>
  </div>
</template>

<script>

  // 引入表头属性设置组件
  // import headeratt from './header-att';

  // import inven from '../../modules/inventory';
  export default {
    name: 'headerForm',
    props: {
      Form:{  //表单数据
        type: Object,
      },
    },
    // components: {headeratt},
    data () {
      return {
        regionList:[],
        table:null,
        HeadList:[],//请求全部（原/变更后新）清单表头数据
        ruleForm: {
          name: '',    //表头名字
          region: '',   //表头标段
          number: '',   //表头编号
          type: '',  //表头类型
          tOriginalHeadId:null, //原清单表头ID，建变更清单和变更后清单表头时传
          tUpdateHeadId:null,   //变更后新清单表头ID，建计量清单表头时需要
        },

        multipleSelection: [],

        rules: {  //input 反馈错误
          name: [
            { required: true, message: '请输入表头名称', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change' }
          ],
          region: [
            { required: true, message: '请选择表头标段', trigger: 'change' }
          ],
          number: [
            { required: true, message: '请输入表头编号', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择表头类型', trigger: 'change' }
          ],
          tOriginalHeadId: [
            { required: true, message: '请选择原清单表头', trigger: 'change' }
          ]
        },
        dialogVisible: false,  //弹窗显示表头属性设置
        
      }
    },
     created () { //2
      this.ruleForm.region = this.Form.tenderId;   //标段id 
      this.ruleForm.number = this.Form.num;    //表头编号
      this.ruleForm.name = this.Form.name;           //表名
      this.ruleForm.type = this.Form.type;          //类别 original原清单change变更清单update变更后的清单meterage计量清单 totalmeterage累计计量清单 pay支付清单 totalpay累计支付清单
      this.ruleForm.tOriginalHeadId = this.Form.tOriginalHeadId;    //原清单表头ID，建变更清单和变更后清单表头时传
      this.ruleForm.tUpdateHeadId = this.Form.tUpdateHeadId;   //变更后新清单表头ID，建计量清单表头时需要

      this.findList();//发起请求全部表头标段
    },
   watch: {
        ruleForm:{  
            handler(New, Old) {
                // console.log("---nnn---")
                // console.log('传值给父组件')
                // console.log(New)
                this.Form.tenderId = New.region;   //标段id 
                this.Form.num = New.number;    //表头编号
                this.Form.name = New.name;           //表名
                this.Form.type = New.type;          //类别 original原清单change变更清单update变更后的清单meterage计量清单 totalmeterage累计计量清单 pay支付清单 totalpay累计支付清单
                this.Form.tOriginalHeadId = New.tOriginalHeadId;    //原清单表头ID，建变更清单和变更后清单表头时传
                this.Form.tUpdateHeadId = New.tUpdateHeadId;   //变更后新清单表头ID，建计量清单表头时需要
            },
            deep: true
        }

   },
    methods: {
        findList () {   //请求标段函数
            //发起网络请求
          this.$post('/tender/getall',{})
            .then((response) => {
            // console.log('请求标段数据')
            // console.log(response)
            this.regionList = response.data.tenderList;
          })
         
        },
        saveForm() {  //保存数据传到父组件中去（引用赋值）
            this.Form.tenderId = this.ruleForm.region;   //标段id 
            this.Form.num = this.ruleForm.number;    //表头编号
            this.Form.name = this.ruleForm.name;           //表名
            this.Form.type = this.ruleForm.type;          //类别 original原清单change变更清单update变更后的清单meterage计量清单 totalmeterage累计计量清单 pay支付清单 totalpay累计支付清单
            this.Form.tOriginalHeadId = this.ruleForm.tOriginalHeadId;    //原清单表头ID，建变更清单和变更后清单表头时传
            this.Form.tUpdateHeadId = this.ruleForm.tUpdateHeadId;   //变更后新清单表头ID，建计量清单表头时需要
        },
        alloriginal () {  //所有该标段的原清单的id和名字
            this.ruleForm.tOriginalHeadId = null, //原清单表头ID，建变更清单和变更后清单表头时传
            this.HeadList = [];//清空数据
             this.$post('/head/alloriginal',{tenderId:this.ruleForm.region})
            .then((response) => {
            console.log('所有原清单的id和名字')
            console.log(response)
            this.HeadList = response.data.originalHeadList;
          })
        },
        allupdate () {
            this.ruleForm.tUpdateHeadId = null, //原清单表头ID，建变更清单和变更后清单表头时传
            this.HeadList = [];//清空数据
             this.$post('/head/allupdate',{tenderId:this.ruleForm.region})
            .then((response) => {
            console.log('所有变更后清单的id和名字')
            console.log(response)
            this.HeadList = response.data.updateHeadList;
          })
        },
        typeChange (req) {  //选择清单的类型
            if (req == 'change') {
                // console.log('请求该标段的所有的原清单数据')
                this.alloriginal();
            }else if(req == 'meterage') {
                this.allupdate();
            }
            //将用户选择的表头类型发回父组件
            let succre = req;
            this.$emit("update:type", succre);
            console.log('sssssssssssssssssssssssssssssssssssssss')
        },
        tenChange (req) {
             if (this.ruleForm.type == 'change') {
                // console.log('请求该标段的所有的原清单数据')
                this.alloriginal();
            }else if(req == 'meterage') {
                this.allupdate();
            }
        },
        torigChang (req) {
                // console.log('打印一下所要请求的原清单id')
                // console.log(req)
        },
        queryHeader () {  //查询用户当前输入的表头名之类的是否已存在数据库
            let url = '/head/'+this.ruleForm.type;
            if (this.ruleForm.type == 'update') {
                url = '/head/one/'+this.ruleForm.type;
            }
            let params = {
              tenderId: this.ruleForm.region,
              num: this.ruleForm.number,
              name: this.ruleForm.name,
              type: this.ruleForm.type
            }
            this.$post(url,params)
            .then((response) => {
              if (response.data.head.id) {
                  return this.$message({ message: '该表头已存在，请换个表名试试吧。', type: 'error' })
              }
          })

        },
        submitHeader () {  //校验表头选择表单 
            if ((this.ruleForm.type=='change' || this.ruleForm.type=='update') && this.HeadList.length <1) {
                return this.$message({ message: '请先建立原清单', type: 'error' })
            }
            this.$refs.ruleForm.validate(valid => {
              if (valid) {
                    let url = '/head/'+this.ruleForm.type;
                    if (this.ruleForm.type == 'update') {
                        url = '/head/one/'+this.ruleForm.type;
                    }
                    let params = {
                      tenderId: this.ruleForm.region,
                      num: this.ruleForm.number,
                      name: this.ruleForm.name,
                      type: this.ruleForm.type
                    }
                    this.$post(url,params)
                    .then((response) => {
                        if (response.data.head) {
                            return this.$message({ message: '该表头已存在，请换个表名试试吧。', type: 'error' });
                        }
                        //此处传值给父组件
                        this.saveForm()
                        console.log(this.Form)
                    })
                    

              } else {
                this.$message({ message: '校验不通过', type: 'error' })
              }
            })
          }

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-dialog__body {
  padding: 10px 20px;
}
</style>
