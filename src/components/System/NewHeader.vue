<template>
  <div class="hello">
    <el-row>
        <el-col :span="6" :xs="24" style="min-width:300px;">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" size="small" class="demo-ruleForm">

                <el-form-item label="表头标段" prop="region">
                    <el-select v-model="ruleForm.region" clearable placeholder="请选择表头标段" style=" width:100%;">
                        <el-option label="路线（Lx）" value="1"></el-option>
                        <el-option label="路基（LJ）" value="2"></el-option>
                        <el-option label="路面（LM）" value="3"></el-option>
                        <el-option label="机电（JD）" value="4"></el-option>


                    </el-select>
                </el-form-item>
                <el-form-item label="表头类型" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择表头类型" clearable size="small" style=" width:100%;">
                        <el-option label="原清单" value="1"></el-option>
                        <el-option label="变更清单" value="2"></el-option>
                        <el-option label="变更后的（新清单）" value="3"></el-option>
                        <el-option label="计量清单" value="4"></el-option>
                        <el-option label="累计计量清单" value="5"></el-option>
                        <el-option label="支付清单" value="6"></el-option>
                        <el-option label="累计支付清单" value="7"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="表头编号" prop="number">
                    <el-input v-model="ruleForm.number"></el-input>
                </el-form-item>
                <el-form-item label="表头名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
            </el-form>
        </el-col>
        
    </el-row>
  
   <el-row style="text-anlign">
        <el-col :span="1" :xs="3">
            <el-button plain size="small" @click="impt" >导入表头</el-button>
            <input id="upload" type="file" @change="importfxx()" ref="input" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        </el-col>
        <el-col :span="4" :offset="1" :xs="7" >
            <el-form  label-width="90px" size="small" class="demo-ruleForm">

                <el-form-item label="显示范围" prop="region">
                    <el-select v-model="ruleForm.range"  placeholder="请选择显示范围" style=" width:100%;">
                        <el-option label="1-1" value="1"></el-option>
                        <el-option label="1-2" value="2"></el-option>
                        <el-option label="1-3" value="3"></el-option>

                    </el-select>
                </el-form-item>

            </el-form>
        </el-col>

        <el-col :span="1" :offset="1" :xs="3">
            <el-button plain size="small" >合并/拆开</el-button>
       </el-col>
        <el-col :span="1" :offset="1" :xs="3">
            <el-button plain size="small"  >删除</el-button>
       </el-col>

       <el-col :span="1" :offset="1" :xs="3">
            <el-button plain size="small" @click="expor" >导出表头</el-button>
       </el-col>
    </el-row>

    <el-row>
      <el-col :span="14" :xs="24" :sm="20" :md="18" :lg="16">
          <el-alert title="表格数据导入后系统给予默认宽高与单元格内文字居中显示，与原表格格式有些偏差，请进行手动调整。" type="info"></el-alert>
          <br>
      </el-col>

    </el-row>

    <!-- <div class="tbbox">

        <table id="table" ref="table">
          <tr v-for="(val,index) in table.sheet[0]" :key="index" >
                <td v-for="(item, i) in val" :key="i" :colspan="item.cos" :rowspan="item.row">{{item.value}}</td>
          </tr>
        </table>

    </div> -->


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

  </div>
</template>

<script>
  import edits from '@/components/assembly/edit'
   import excelmodel from '../../excel/proces';
  export default {
    name: 'newheader',
    components: { edits },
    data () {
      return {
        table:{sheet:[null],hd:[null]},
        ruleForm: {
          name: '',    //表头名字
          region: '',   //表头标段
          number: '',   //表头编号
          type: '',   //表头类型
          range:'', //显示范围

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
        
      }
    },
     created () { //2
    // this.findLanguageList()
    // this.findList()
    },

    methods: {
      

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
              this.table = {sheet:[null],hd:[null]}; //归为初始化状态
              let _this = this;

              excelmodel.Imports(data=>{
                  console.log('最终处理完成的数据')
                  console.log(data)

                  _this.dialogVisible = true;  //调用显示表格编辑确认弹窗

                  _this.table = data;   // 存储表格数据
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
h1, h2 {
  color: orange;
  /* font-weight: normal; */
  }
table,table tr th, table tr td { border:1px solid #000000; }
td {
  min-width: 20px;
  text-align: center;
  font-size:0.8rem; 
  padding: 5px 5px;

  
}

table {
  width: 100%;
  height: 100%;
  font-size: 0.9rem;
  /* border:1px solid red; */
}

.tbbox{
  max-width: 100%;
  max-height: 100%;
}
.btn-import{
    width: 100%;
    display: inline-flex;
     -webkit-box-pack:justify;
    -webkit-justify-content:space-between;
    -ms-flex-pack:justify;
    justify-content:space-between;
    justify-content: center;

    /* align-items: center; */
    border: 1px solid orange;
}



.click-table8-oper {
  margin-bottom: 18px;
}
.click-table8 .delete-row {
  color: #f56c6c;
  text-decoration: line-through;
}
.click-table8-pagination {
  margin-top: 18px;
  text-align: right;
}
.click-table8.elx-editable .elx-editable-row.new-insert,
.click-table8.elx-editable .elx-editable-row.new-insert:hover>td {
  background-color: #f0f9eb;
}

.click-table12 .el-table__body .el-table__row>td.elx_checked {
  box-shadow: inset 0 0 6px #409EFF;
}
</style>
