<template>
  <div class="hello">
    <el-row>
        <el-col :span="14" :offset="1">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" size="small" class="demo-ruleForm">

                <el-form-item label="表头标段" prop="region">
                    <el-select v-model="ruleForm.region" clearable placeholder="请选择表头标段" style=" width:100%;">
                        <el-option label="JD1" value="1"></el-option>
                        <el-option label="JD2" value="2"></el-option>
                        <el-option label="JD3" value="3"></el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="表头类型" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择表头类型" clearable size="small" style=" width:100%;">
                        <el-option label="清单" value="1"></el-option>
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
        <el-col :span="1" :offset="1" :xs="3">
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
      <el-col :span="12">
          <el-button plain size="small" @click="add" >内容</el-button>
      </el-col>
    </el-row>


    <el-table ref="multipleTable" :data="table.sheet[0]" :span-method="arraySpanMethod"
       tooltip-effect="dark" border style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        >
      </el-table-column>
      <el-table-column :label="'标题'+(index+1)" show-overflow-tooltip v-for="(val,index) in table.hd[0]" :key="index"  :prop="'hd'+index+'.value'">
        <!-- <template slot-scope="scope">{{ scope.row['hd0'].key }}</template> -->
      </el-table-column>

    </el-table>


    <div class="tbbox">

        <table id="table" ref="table">
          <tr v-for="(val,index) in table.sheet[0]" :key="index" >
                <td v-for="(item, i) in val" :key="i" :colspan="item.cos" :rowspan="item.row">{{item.value}}</td>
          </tr>
        </table>

    </div>

     



  </div>
</template>

<script>
  import excelmodel from '../../excel/proces';

  export default {
    name: 'newheader',
    data () {
      return {
        msg: 'hello 请导入表格',
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
        }
 

        
      }
    },
    methods: {
        add(){
          console.log('表头名字 ： '+this.ruleForm.name+'  表头标段 ： '+this.ruleForm.region+'   表头编号 ： '+this.ruleForm.number+'   表头类型  ：  '+this.ruleForm.type+'   显示范围 ： '+this.ruleForm.range)
        },

        impt(){ //button 按钮调用input文件选择事件
            this.$refs.input.click()
        },

        arraySpanMethod({ row, column, rowIndex, columnIndex }) { //饿了么表格样式  单元格合并处理

            // if (row.) {
              
            // }
            // if (row.hd1.key=="A1") {
            //   return [2, 1];
            // }else{
            //   // return [0, 0];
            // }
            console.log('  row  :',row,'    column   :',column,'   rowIndex      :  ',rowIndex,'   columnIndex  :  ',columnIndex)
            return [1, 1]

      },


        toggleSelection(rows) {
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          } else {
            this.$refs.multipleTable.clearSelection();
          }
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },







        importfxx() { //表头导入函数
              
              this.table = {sheet:[null],hd:[null]}; //归为初始化状态
              let _this = this;
              excelmodel.Imports(data=>{
                  console.log('最终处理完成的数据')
                  console.log(data)
                  _this.table=data;



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

</style>
