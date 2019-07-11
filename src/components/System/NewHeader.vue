<template>
  <div class="hello">
    <el-row>
        <el-col :span="6" :xs="24" style="min-width:300px;">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" size="small" class="demo-ruleForm">

                <el-form-item label="表头标段" prop="region">
                    <el-select v-model="ruleForm.region" clearable placeholder="请选择表头标段" style=" width:100%;">
                        <el-option label="路线（LX）" value="LX"></el-option>
                        <el-option label="路基（LJ）" value="LJ"></el-option>
                        <el-option label="路面（LM）" value="LM"></el-option>
                        <el-option label="机电（JD）" value="JD"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="表头类型" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择表头类型" clearable size="small" style=" width:100%;">
                        <el-option label="原清单" value="orginal"></el-option>
                        <el-option label="变更清单" value="change"></el-option>
                        <el-option label="变更后的（新清单）" value="update"></el-option>
                        <el-option label="计量清单" value="meterage"></el-option>
                        <el-option label="累计计量清单" value="totalmeteragge"></el-option>
                        <el-option label="支付清单" value="pay"></el-option>
                        <el-option label="累计支付清单" value="totalpay"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="ruleForm.type=='change' || ruleForm.type=='totalmeteragge' || ruleForm.type=='totalpay' " label="选择表头" prop="type">
                    <el-select v-model="ruleForm.value" placeholder="请选择清单表头" clearable size="small" style=" width:100%;">
                        <el-option label="公路清单" value="公路清单"></el-option>
                        <el-option label="2号公路清单" value="2号公路清单"></el-option>
                        <el-option label="2号公路清单" value="2号公路清单"></el-option>
                        <el-option label="路面清单" value="路面清单"></el-option>
                        <el-option label="2号路面清单" value="2号路面清单"></el-option>
                        <el-option label="3号清单" value="3号清单"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="表头编号" prop="number">
                    <el-input v-model="ruleForm.number"></el-input>
                </el-form-item>
                <el-form-item label="表头名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitHeader">立即创建</el-button>
                    <input id="upload" type="file" @change="importfxx()" ref="input" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        
    </el-row>
    <el-row>
      <el-col :span="14" :xs="24" :sm="20" :md="18" :lg="16">
          <el-alert title="表格数据导入后系统给予默认宽高与单元格内文字居中显示，与原表格格式有些偏差，请进行手动调整。" type="info"></el-alert>
          <br>
      </el-col>

    </el-row>

  <!-- 表格编辑弹窗显示====== -->
  <el-dialog
    title="请进行修改确认"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="handleClose">

    <!-- 引入表格编辑组件 -->
    <edits :tableList="table"></edits>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">下一步</el-button>
    </span>
  </el-dialog>

<!-- 表格编辑弹窗显示====== -->
  <el-dialog
    title="请进行设置表头每个单元格属性"
    :visible.sync="dialogVisible2"
    width="90%"
    :append-to-body="false" 
    top="8vh"
    :before-close="handleClose">

    <!-- 引入表格编辑组件 -->
    <headeratt :tableList="table"></headeratt>
    <span slot="footer" class="dialog-footer">
     <!--    <el-button @click="dialogVisible2 = false">取 消</el-button>
         <el-button type="primary" @click="dialogVisible2 = false">下一步</el-button>
        -->
    </span>
  </el-dialog>

  </div>
</template>

<script>
  // 引入单元格列编辑组件
  import edits from '@/components/assembly/edit'
  // 引入表头属性设置组件
  import headeratt from '@/components/assembly/header-att'

  // 引入excel 表格导入js处理函数模块
  import excelmodel from '../../modules/proces';

  import inven from '../../modules/inventory';
  export default {
    name: 'newheader',
    components: { edits, headeratt},
    data () {
      return {
        table:null,
        ruleForm: {
          name: '',    //表头名字
          region: '',   //表头标段
          number: '',   //表头编号
          type: '',  //表头类型
          value: null, //可引入的表头清单


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
          ]
        },
        dialogVisible: false,  //弹窗显示表格编辑
        dialogVisible2: false,  //弹窗显示表头属性设置
        
      }
    },
     created () { //2
    // this.findLanguageList()
    // this.findList()
    },
    methods: {
        submitHeader () {  //校验表头选择表单  
            this.$refs.ruleForm.validate(valid => {
              if (valid) {
                    if(this.ruleForm.type!='change' || this.ruleForm.type!='totalmeteragge' || this.ruleForm.type!='totalpay'){
                        console.log('这里保存表头类型标段数据')
                        console.log(this.ruleForm)
                        this.$message({ message: '输入正确哦', type: 'success' })
                        //button 按钮调用input文件选择事件
                        this.$refs.input.click()
                    }else if(this.ruleForm.value!= null){ //按用户选择清单导入数据 

                    }
              } else {
                this.$message({ message: '校验不通过', type: 'error' })
              }
            })
          },

        impt(){ //button 按钮调用input文件选择事件
            this.$refs.input.click()
        },

        importfxx() { //表头导入函数
              this.loading = true
              this.$notify.info({
                  title: '提示',
                  duration: 800,
                  message: '正在努力导入表格噢，请稍等片刻。'
              });
              this.table = null; //归为初始化状态
              let _this = this;

              excelmodel.Imports(data=>{
                  console.log('最终处理完成的数据')
                  console.log(data)

                  // _this.dialogVisible = true;  //调用显示表格编辑确认弹窗
                  _this.dialogVisible2 = true;  //调用显示表头属性设置确认弹窗

                    //inven.Assemble(data)数据添加属性组装函数
                  _this.table = inven.Assemble(data,_this.ruleForm.type);   // 存储表格数据
                //   _this.table = data  // 存储表格数据
                  _this.loading = false
                  _this.$notify({
                    title: '提示',
                    duration: 3000,
                    message: '表格成功导入啦hhh',
                    type: 'success'
                  });

              })
        },
        expor() {  //导出表格============
          var XLSX = require('xlsx');
          // let table = document.getElementById('table');
          // let worksheet = XLSX.utils.table_to_sheet(table);
          // let workbook = XLSX.utils.book_new();
          // XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');
          // 以上四行也可以直接一行搞定，如果不需要对表格数据进行修改的话
          let table = this.$refs.table;

          let workbook = XLSX.utils.table_to_book(table)
          try {
              XLSX.writeFile(workbook, 'text.xlsx');
              // 饿了么弹窗提示文件导出
        
          } catch(e) {
              console.log(e, workbook);
              // 饿了么弹窗提示文件导出失败
          }

        },
        handleClose(done) {   //弹窗关闭确认
          this.$confirm('确认关闭？ 直接关闭将不保存任何数据噢。')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        }
        
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
