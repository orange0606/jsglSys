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
            <el-button plain size="small" @click="add" >内容</el-button>
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
  <div v-loading="loading">
    <p style="color: red;font-size: 12px;">合并行或列</p>


    <!-- <p style="color: red;font-size: 12px;">name字段（校验必填，校验最少3个字符）</p>
    <p style="color: red;font-size: 12px;">多级属性：由于 v-model 必须明确指定双向绑定的路径，所以需要配合自定义渲染使用</p>
    <p style="color: red;font-size: 12px;">上下左右方向键切换列、Tab 键切换列、选中后可直接输入值覆盖旧值</p> -->

    <p>
      <el-button type="danger" size="mini" @click="pendingRemoveEvent">标记/取消删除</el-button>
      <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>

      <el-button type="success" size="mini" @click="insertEvent(0)">新增一行</el-button>
      <el-button type="success" size="mini" @click="insertEvent(list[1])">在第二行插入一行</el-button>
      <el-button type="success" size="mini" @click="insertEvent(-1)">在最后新增一行</el-button>
      <el-button type="danger" size="mini" @click="deleteSelectedEvent">删除选中</el-button>
      <el-button type="info" size="mini" @click="$refs.elxEditable.revert()">放弃更改</el-button>
      <!-- <el-button type="info" size="mini" @click="$refs.elxEditable.clear()">清空表格</el-button> -->
      <!-- <el-button type="info" size="mini" @click="$refs.elxEditable.clearFilter()">清空筛选条件</el-button> -->
      <!-- <el-button type="info" size="mini" @click="$refs.elxEditable.clearSort()">清空排序条件</el-button> -->
      <!-- <el-button type="success" size="mini" @click="$refs.elxEditable.toggleRowSelection(table.sheet[0][2])">选中第2个</el-button> -->
      <el-button type="warning" size="mini" @click="submitEvent">校验&保存</el-button>
      <el-button type="primary" size="mini" @click="getInsertEvent">获取新增数据</el-button>
      <el-button type="primary" size="mini" @click="getUpdateEvent">获取已修改数据</el-button>
      <el-button type="primary" size="mini" @click="getRemoveEvent">获取已删除数据</el-button>
      <el-button type="primary" size="mini" @click="getSelectedEvent">获取已选中数据</el-button>
      <el-button type="primary" size="mini" @click="getAllEvent">获取所有数据</el-button>
    </p>



    <elx-editable
      ref="elxEditable"
      class="click-table8"
      border
      height="466"
      size="mini"
      :data.sync="table.sheet[0]"
      :span-method="arraySpanMethod"
      :row-class-name="tableRowClassName"
      :edit-rules="validRules"
      :edit-config="{trigger: 'click', mode: 'cell'}"
      style="width: 100%">
      <elx-editable-column type="selection" width="55"></elx-editable-column>

      <elx-editable-column :prop="val+'.value'" :label="'标题'+(i+1)" show-overflow-tooltip v-for="(val,i) in table.hd[0]" :key="i" :edit-render="{name: 'ElInput'}" ></elx-editable-column>
      <!-- <elx-editable-column prop="name" label="内容" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="language" label="语言" width="160" :edit-render="{name: 'ElSelect', options: languageList}"></elx-editable-column>
      <elx-editable-column prop="updateTime" label="更新时间" width="160" :formatter="formatterDate"></elx-editable-column>
      <elx-editable-column prop="createTime" label="创建时间" width="160" :formatter="formatterDate"></elx-editable-column> -->
    </elx-editable>

    <el-pagination
      class="click-table8-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageVO.currentPage"
      :page-sizes="[5, 10, 15, 20, 50, 100, 150, 200]"
      :page-size="pageVO.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageVO.totalResult">
    </el-pagination>
  </div>
     



  </div>
</template>

<script>
  import XEUtils from 'xe-utils'
  // import XEAjax from 'xe-ajax'


  import excelmodel from '../excel/proces';

  export default {
    name: 'newheader',
    data () {
      return {
        table:{sheet:[null],hd:[null]},
        ruleForm: {
          name: '',    //表头名字
          region: '',   //表头标段
          number: '',   //表头编号
          type: '',   //表头类型
          range:'', //显示范围
          hd_obj:[], //用来存储  处理饿了么单元格合并该行中的所有列

        },
        showipt:false,

       
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




        loading: false, //2
        languageList: [],
        list: [],
        formData: {
          key: null,
          name: null,
          language: null
        },
        pageVO: {
          currentPage: 1,
          pageSize: 10,
          totalResult: 0
        },
        validRules: {
          key: [
            { required: true, message: '请输入键值', trigger: 'change' }
          ],
          language: [
            { required: true, message: '请选择语言', trigger: 'change' }
          ]
        },
        pendingRemoveList: []
  

        
      }
    },
     created () { //2
    // this.findLanguageList()
    // this.findList()
    },

    methods: {
        add(){
          console.log('表头名字 ： '+this.ruleForm.name+'  表头标段 ： '+this.ruleForm.region+'   表头编号 ： '+this.ruleForm.number+'   表头类型  ：  '+this.ruleForm.type+'   显示范围 ： '+this.ruleForm.range)
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
              this.table = {sheet:[null],hd:[null]}; //归为初始化状态
              let _this = this;

              excelmodel.Imports(data=>{
                  console.log('最终处理完成的数据')
                  console.log(data)
                  _this.table = data;   // 存储表格数据

                  _this.hd_obj = data.hd[0];  //用来存储表格的所有列（对象的key值）
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


      
        handleSizeChange (pageSize) { //2
          this.pageVO.pageSize = pageSize
          this.findList()
        },
        handleCurrentChange (currentPage) {
          this.pageVO.currentPage = currentPage
          this.findList()
        },
        formatterDate (row, column, cellValue, index) {
          return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
        },
        tableRowClassName ({ row, rowIndex }) {
          if (this.pendingRemoveList.some(item => item === row)) {
            return 'delete-row'
          }
          return ''
        },
       

        pendingRemoveEvent () { //标记/取消
          let selection = this.$refs.elxEditable.getSelecteds()
          if (selection.length) {
            let plus = []
            let minus = []
            selection.forEach(data => {
              if (this.pendingRemoveList.some(item => data === item)) {
                minus.push(data)
              } else {
                plus.push(data)
              }
            })
            if (minus.length) {
              this.pendingRemoveList = this.pendingRemoveList.filter(item => minus.some(data => data !== item)).concat(plus)
            } else if (plus) {
              this.pendingRemoveList = this.pendingRemoveList.concat(plus)
            }
            this.$refs.elxEditable.clearSelection()
          } else {
            this.$message({
              type: 'info',
              message: '请至少选择一条数据！'
            })
          }
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {   //单元格合并处理
            // if (columnIndex <= this.hd_obj.length) {   // 不带选择框的情况
            //     return [row[this.hd_obj[columnIndex]].row, row[this.hd_obj[columnIndex]].cos]
            // }
            // return [1, 1]

            if (columnIndex !=0) {  //带选择框的情况
                if (columnIndex <= this.hd_obj.length) {
                    return [row[this.hd_obj[columnIndex-1]].row, row[this.hd_obj[columnIndex-1]].cos]
                }
            }
                return [1, 1]
        },       
        exportCsvEvent () { //导出表格
          this.$refs.elxEditable.exportCsv()
        },

        insertEvent (index) { //新增一行
            console.log('ssssssssssssssssssssss')
          this.$refs.elxEditable.insertAt({
            
            hd0: {
              value:789,
              row:1,
              cos:1
            },

          }, index)

          // .then(({ row }) => {
          //   // this.$refs.elxEditable.setActiveCell(row, 'name')
          // })

        },
        
        deleteSelectedEvent () {    //删除选中
          let selection = this.$refs.elxEditable.getSelecteds()
          if (selection.length) {
            this.$refs.elxEditable.removeSelecteds()
            this.$message({ message: '删除成功', type: 'success' })
          } else {
            this.$message({
              type: 'info',
              message: '请至少选择一条数据！'
            })
          }
        },
        submitEvent () {  //校验保存  即可提交数据
          this.$refs.elxEditable.validate(valid => {
            if (valid) {
                console.log(this.table.sheet[0])
                console.log('tbtbtb')
                this.$message({ message: '保存成功', type: 'success' })
              // alert('成功1')
            } else {
              this.$message({ message: '校验不通过', type: 'error' })
            }
          })
        },
        getInsertEvent () { //获取新增数据
          let rest = this.$refs.elxEditable.getInsertRecords()
          this.$msgbox({ message: JSON.stringify(rest), title: `获取新增数据(${rest.length}条)` }).catch(e => e)
          console.log(rest)
        },
        getUpdateEvent () { //获取已修改数据
          let rest = this.$refs.elxEditable.getUpdateRecords()
          this.$msgbox({ message: JSON.stringify(rest), title: `获取已修改数据(${rest.length}条)` }).catch(e => e)
        },
        getRemoveEvent () { //获取已删除数据
          let rest = this.$refs.elxEditable.getRemoveRecords()
          this.$msgbox({ message: JSON.stringify(rest), title: `获取已删除数据(${rest.length}条)` }).catch(e => e)
        },
        getSelectedEvent () { //获取已选中数据
          let rest = this.$refs.elxEditable.getSelecteds()
          this.$msgbox({ message: JSON.stringify(rest), title: `获取已选中数据(${rest.length}条)` }).catch(e => e)
        },
        getAllEvent () {   //获取所有数据
          let rest = this.$refs.elxEditable.getRecords()
          this.$msgbox({ message: JSON.stringify(rest), title: `获取所有数据(${rest.length}条)` }).catch(e => e)
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
