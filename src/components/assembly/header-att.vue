<template>



    <!-- <div class="tbbox">

        <table id="table" ref="table">
          <tr v-for="(val,index) in table.sheet[0]" :key="index" >
                <td v-for="(item, i) in val" :key="i" :colspan="item.cos" :rowspan="item.row">{{item.value}}</td>
          </tr>
        </table>

    </div> -->
  <div v-loading="loading">

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
      <el-button type="warning" size="mini" @click="submitEvent">保存&提交</el-button>
      <el-button type="primary" size="mini" @click="getInsertEvent">获取新增数据</el-button>
      <el-button type="primary" size="mini" @click="getUpdateEvent">获取已修改数据</el-button>
      <el-button type="primary" size="mini" @click="getRemoveEvent">获取已删除数据</el-button>
      <el-button type="primary" size="mini" @click="getSelectedEvent">获取已选中数据</el-button>
      <el-button type="primary" size="mini" @click="getAllEvent">获取所有数据</el-button>
    </p>
    <br>


    <elx-editable
      ref="elxEditable"
      class="click-table12"
      stripe
      border
      height="480"
      :highlight-current-row="false"
      :data.sync="list.sheet[0]"
      :span-method="arraySpanMethod"
      @select="selectEvent"
      @current-change="currentChangeEvent"
      :edit-rules="validRules"
      :edit-config="{ showIcon: true, showStatus: true, isTabKey: true, isArrowKey: true, isCheckedEdit: true}"
      style="width: 100%">
      <elx-editable-column type="selection" width="55"></elx-editable-column>

      <elx-editable-column :prop="val+'.td'" :label="'标题'+(i+1)" show-overflow-tooltip v-for="(val,i) in list.hd[0]" :key="i"  >
        
       <template  slot-scope="scope">
          <el-input v-if="btn.edit" v-model="scope.row[val].td" > </el-input>

          <el-popover v-else-if="btn.edit ==false" trigger="hover" placement="top">
            <p>属性设置: 叫什么{{scope.row[val].td }}</p>
            <p>属性2: 在哪里{{ scope.row[val].td }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row[val].td }}</el-tag>
            </div>
          </el-popover>
      </template>
      </elx-editable-column>
      <!-- <elx-editable-column prop="name" label="内容" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="language" label="语言" width="160" :edit-render="{name: 'ElSelect', options: languageList}"></elx-editable-column>
      <elx-editable-column prop="updateTime" label="更新时间" width="160" :formatter="formatterDate"></elx-editable-column>
      <elx-editable-column prop="createTime" label="创建时间" width="160" :formatter="formatterDate"></elx-editable-column> -->
    </elx-editable>
    <br>

    <!-- 取消和下一步按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="back">{{ btn.cancel }}</el-button>
      <el-button type="primary" @click="next">{{ btn.next }}</el-button>
    </span>

  </div>
     
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
            edit: true,
        },
          //开启单元格编辑，false开启属性设置，默认true。
        hd_obj:[], //用来存储  处理饿了么单元格合并该行中的所有列
        loading: true, //  div  加载中的样式
        list: {sheet:[null],hd:[null]}, //用来存储数据

        formData: {
          key: null,
          name: null,
          language: null
        },

        validRules: {
          key: [
            { required: true, message: '请输入键值', trigger: 'change' }
          ],
          language: [
            { required: true, message: '请选择语言', trigger: 'change' }
          ]
        },
        pendingRemoveList: [] //存储已标记的行数
  

        
      }
    },
     created () { //2
        this.list = this.tableList;
        this.loading =false;
        this.hd_obj = this.list.hd[0]
    },
    watch: {
        tableList: function(newVal,oldVal){
            console.log('sssssssssssssssssss')
            // if (newVal.sheet[0]==null) {    //当没有数据的时候div 为加载中状态
            //     this.loading = true;
            // }else{
            //     this.loading = false;
            // }
            this.loading =false;
            this.list = newVal;  //newVal即是tablelist
            this.hd_obj = newVal.hd[0] //用来保存单元格合并处理函数所需要的所有列（属性）名
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
              // if (columnIndex <= this.hd_obj.length) {   // 不带选择框的情况
              //     return [row[this.hd_obj[columnIndex]].td_rowspan, row[this.hd_obj[columnIndex]].td_colspan]
              // }
              // return [1, 1]

              if (columnIndex >0) {  //带选择框的情况
                  if(row[this.hd_obj[columnIndex-1]].dele !=1){
                  if (columnIndex <= this.hd_obj.length) {
                      return [row[this.hd_obj[columnIndex-1]].td_rowspan, row[this.hd_obj[columnIndex-1]].td_colspan]
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
