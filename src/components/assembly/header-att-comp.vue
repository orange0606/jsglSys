<template>
        <!-- 
            **************弹窗属性选择设置**************
        -->
    <el-form :model="scope.row[val]" :rules="rules" ref="scope.row[val]" label-width="120" size="small">
        <el-form-item label="设置属性" prop="attribute">
            <el-select v-model="scope.row[val].attribute" placeholder="请选择属性" clearable size="small" style=" width:100%;">
                <el-option label="原清单" value="1"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="属性值" prop="attribute_value">
            <el-input v-model="scope.row[val].attribute_value"></el-input>
        </el-form-item>
        <el-form-item v-if="'attribute_value_id' in scope.row[val]" label="（属性id）对应新清单表头内容id" prop="attribute_value_id">
            <el-input v-model="scope.row[val].attribute_value_id"></el-input>
        </el-form-item>
        <el-form-item label="列宽" prop="col_width">
            <el-input v-model="scope.row[val].col_width"></el-input>
        </el-form-item>
        <el-form-item label="行高" prop="tr_high">
            <el-input v-model="scope.row[val].tr_high"></el-input>
        </el-form-item>
        <el-form-item v-if="'limit' in scope.row[val]" label="限制单元格大小值" prop="limit">
        <el-select v-model="scope.row[val].limit" placeholder="请选择限制类型" clearable size="small" style=" width:100%;">
                <el-option label="原清单" value="1"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if="'limit_value' in scope.row[val]" label="限制值" prop="limit_value">
            <el-input v-model="scope.row[val].limit_value"></el-input>
        </el-form-item>
        <el-form-item v-if="'limit_id' in scope.row[val]" label="（限制id）对应原清单表头内容id" prop="limit_id">
            <el-input v-model="scope.row[val].limit_id"></el-input>
        </el-form-item>
        <el-form-item v-if="'update_time' in scope.row[val]" label="更新时间" prop="update_time">
            <el-input v-model="scope.row[val].update_time"></el-input>
        </el-form-item>

    </el-form>                 
</template>

<script>
import XEUtils from 'xe-utils'

  export default {
    name: 'edit',
    props:["tableList"],
    data () {
      return {
        btn: {  //按钮的名称,与存储信息事件
            next:'下一步',
            cancel: '取 消',
            edit: true,    //true开启单元格编辑，false开启属性设置，默认true。
        },
        loading: true, //  div  加载中的样式
        list:[], //用来存储导入的数据
        hd:[],//用来存储数据中对象的所有（列）的key值 (处理饿了么单元格合并该行中的所有列)
        attribute:{}, //用来存储特殊属性的所有类
        limits:[],  //用来存储限制单元格大小的所有类

        rules: {  //input 反馈错误
          attribute_value: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' },
          ],
          attribute_value_id: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' },
          ],
          limit_value: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' },
          ],
          limit_id: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' },
          ],
          col_width: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' },
          ],
          tr_high: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' },
          ],
          update_time: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' },
          ],
          attribute: [
            { required: true, message: '请选择属性', trigger: 'change' }
          ],
          limit: [
            { required: true, message: '请选择限制类型', trigger: 'change' }
          ]
        },
        pendingRemoveList: [] //存储已标记的行数
  

        
      }
    },
     created () { //2
        console.log('this.tableList')
        console.log(this.tableList)
        if(this.tableList != null){
            this.list = this.tableList.sheet;
            this.loading =false;
            this.list[0] ? this.hd = Object.keys(this.list[0]) :this.hd = null; //用来所需要的所有列（属性）名
        }
    },
    watch: {
        tableList: function(newVal,oldVal){
            if (newVal == null ) {    //当没有数据的时候div 为加载中状态
                this.loading = true;
            }else{
                this.list = newVal.sheet
                this.hd = Object.keys(newVal.sheet[0])
                this.loading = false;
            }

        }
    },


    methods: {

          next(){  //编辑完成点击下一步
              if (this.btn.edit) {
                  this.btn.edit = false;
                  this.btn.next ='完  成';
                  this.btn.cancel ='上一步';

              }else{
                  alert('直接完成')
                  //此处调用提交数据到父组件
              }
          },
          back(){
            if (this.btn.edit) {
                alert('直接取消')
                //此处取消弹窗显示
    
              }else{
                  this.btn.edit = true
                  this.btn.next ='下一步';
                  this.btn.cancel ='取  消';
              }
          },
          getSelectLabel (value, valueProp, labelProp, list) {
            let item = XEUtils.find(list, item => item[valueProp] === value)
            return item ? item[labelProp] : null
          },
        
          selectEvent (selection, row) {
            console.log(selection)
          },
          currentChangeEvent (currentRow, oldCurrentRow) {
            console.log(currentRow)
          },
          deleteSelectedEvent () {  //删除选中数据
            let selection = this.$refs.elxEditable.getSelecteds()
            if (selection.length) {
              this.$refs.elxEditable.removeSelecteds()
              Message({ message: '删除成功', type: 'success' })
            } else {
              Message({
                type: 'info',
                message: '请至少选择一条数据！'
              })
            }
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
              // if (columnIndex <= this.hd.length) {   // 不带选择框的情况
              //     return [row[this.hd[columnIndex]].td_rowspan, row[this.hd[columnIndex]].td_colspan]
              // }
              // return [1, 1]

              if (columnIndex >0) {  //带选择框的情况
                  if(row[this.hd[columnIndex-1]].dele !=1){
                    if (columnIndex <= this.hd.length) {
                        return [row[this.hd[columnIndex-1]].td_rowspan, row[this.hd[columnIndex-1]].td_colspan]
                    }
                  }
              }
                  return [1, 1]

          },       
          exportCsvEvent () { //导出表格
            this.$refs.elxEditable.exportCsv()
          },

          insertEvent (index) { //新增一行

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
                  console.log(this.list.sheet[0])
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
          },
          postJSON (data) {
          // 提交请求
          return new Promise(resolve => {
            setTimeout(() => {
              resolve('保存成功')
            }, 300)
          })
        }
              
      }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.click-table12 .el-table__body .el-table__row>td.elx_checked {
  box-shadow: inset 0 0 6px #409EFF;
}
</style>
    