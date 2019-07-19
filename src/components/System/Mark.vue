<template>
<el-row :gutter="10">
  <!-- <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"><div class="grid-content bg-purple"></div></el-col> -->
  <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="18">
    <div v-loading="loading">
        <p style="color: red;font-size: 12px;">带分页、条件筛选</p>

        <div class="manual-table2-oper">
        <el-button type="success" size="mini" @click="insertEvent">新增</el-button>
        <el-button type="danger" size="mini" @click="deleteSelectedEvent">删除选中</el-button>
        <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
        </div>

        <elx-editable
        ref="elxEditable"
        class="manual-table2"
        border
        height="466"
        :default-sort="{prop: 'updateTime', order: 'descending'}"
        :data.sync="list"
        :cell-style ="cell_select"
        :edit-config="{trigger: 'manual', mode: 'row', clearActiveMethod}"
        style="width: 100%">
        <elx-editable-column type="selection" width="55"></elx-editable-column>
        <elx-editable-column prop="id" label="ID" width="80"></elx-editable-column>
        <elx-editable-column prop="num" label="标段编号" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
        <elx-editable-column prop="name" label="标段名称" :edit-render="{name: 'ElInput'}"></elx-editable-column>
        
        <elx-editable-column prop="updateTime" label="更新时间" sortable  :formatter="formatterDate"></elx-editable-column>
        <elx-editable-column prop="createTime" label="创建时间"  :formatter="formatterDate"></elx-editable-column>

        <elx-editable-column label="操作" width="150">
            <template v-slot="scope">
            <template v-if="$refs.elxEditable.hasActiveRow(scope.row)">
                <el-button size="mini" type="success" @click="saveRowEvent(scope.row)">保存</el-button>
                <el-button size="mini" type="warning" @click="cancelRowEvent(scope.row)">取消</el-button>
            </template>
            <template v-else>
                <el-button size="mini" type="primary" @click="openActiveRowEvent(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="removeEvent(scope.row)">删除</el-button>
            </template>
            </template>
        </elx-editable-column>
        </elx-editable>
    </div>
  </el-col>

</el-row>

</template>

<script>
    import XEUtils from 'xe-utils'
  export default {
  name: 'marks',
  data () {
    return {
      loading: false,
      list: [
          {id:1,num:'aaa1',name:'标段名称'},
          {id:2,num:'aaa2',name:'标段名称'},
          {id:3,num:'aaa3',name:'标段名称'},
          {id:4,num:'aaa4',name:'标段名称'},

      ],
      formData: {
        name: null,
        sex: null,
        role: null
      },
      pageVO: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      isClearActiveFlag: true
    }
  },
  created () {
    // this.findList()  //发起请求标段
  },
  methods: {
    findList () {   //请求标段函数
      this.loading = true
        //发起网络请求

        // 请求成功
        this.list = result

        // 请求不成功或者没数据
        this.loading = false

    },

    searchEvent () {
      this.pageVO.currentPage = 1
      this.findList()
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.findList()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.findList()
    },
    formatterFlag (row, column, cellValue, index) {
      return cellValue ? '是' : '否'
    },
    formatterDate (row, column, cellValue, index) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    clearActiveMethod ({ type, row }) {
      return this.isClearActiveFlag && type === 'out' ? this.checkOutSave(row) : this.isClearActiveFlag
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    insertEvent () {    //新增标段
      let activeInfo = this.$refs.elxEditable.getActiveRow()
      let { insertRecords } = this.$refs.elxEditable.getAllRecords()
      console.log(this.$refs.elxEditable.getAllRecords())
      if (!activeInfo && !insertRecords.length) {
        this.$refs.elxEditable.insert({
        //   name: `New ${Date.now()}`,
 
        }).then(({ row }) => {
          this.$refs.elxEditable.setActiveRow(row)
        })
      }
    },
    // 点击表格外面处理
    checkOutSave (row) {
      if (!row.id) {
        this.isClearActiveFlag = false
        this.$confirm('该数据未保存，请确认操作?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存数据',
          cancelButtonText: '移除数据',
          type: 'warning'
        }).then(action => {
          this.$refs.elxEditable.clearActive()
          this.saveRowEvent(row)
        }).catch(action => {
          if (action === 'cancel') {
            this.$refs.elxEditable.remove(row)
          }
        }).then(() => {
          this.isClearActiveFlag = true
        })
      } else if (this.$refs.elxEditable.hasRowChange(row)) {
        this.isClearActiveFlag = false
        this.$confirm('检测到未保存的内容，请确认操作?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存数据',
          cancelButtonText: '取消修改',
          type: 'warning'
        }).then(() => {
          this.$refs.elxEditable.clearActive()
          this.saveRowEvent(row)
        }).catch(action => {
          if (action === 'cancel') {
            this.$refs.elxEditable.revert(row)
            this.$refs.elxEditable.clearActive()
          }
        }).then(() => {
          this.isClearActiveFlag = true
        })
        return false
      }
      return this.isClearActiveFlag
    },
    // 编辑处理
    openActiveRowEvent (row) {
      this.$nextTick(() => {
        let activeInfo = this.$refs.elxEditable.getActiveRow()
        if (activeInfo && activeInfo.isUpdate) {
          this.isClearActiveFlag = false
          this.$confirm('检测到未保存的内容，请确认操作?', '温馨提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '保存数据',
            cancelButtonText: '取消修改',
            type: 'warning'
          }).then(() => {
            this.$refs.elxEditable.setActiveRow(row)
            this.saveRowEvent(activeInfo.row)
          }).catch(action => {
            if (action === 'cancel') {
              this.$refs.elxEditable.revert(activeInfo.row)
              this.$refs.elxEditable.setActiveRow(row)
            }
          }).then(() => {
            this.isClearActiveFlag = true
          })
        } else {
          this.$refs.elxEditable.setActiveRow(row)
        }
      })
    },
    // 取消处理
    cancelRowEvent (row) {
      if (!row.id) {
        this.isClearActiveFlag = false
        this.$confirm('该数据未保存，是否移除?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '移除数据',
          cancelButtonText: '返回继续',
          type: 'warning'
        }).then(action => {
          if (action === 'confirm') {
              console.log(row)
            this.$refs.elxEditable.remove(row)
            console.log('移除数据')
            
          }
        }).catch(e => e).then(() => {
          this.isClearActiveFlag = true
        })
      } else if (this.$refs.elxEditable.hasRowChange(row)) {
        this.isClearActiveFlag = false
       this.$confirm('检测到未保存的内容，是否取消修改?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '取消修改',
          cancelButtonText: '返回继续',
          type: 'warning'
        }).then(action => {
          this.$refs.elxEditable.clearActive()
          this.$refs.elxEditable.revert(row)
        }).catch(action => {
          if (action === 'cancel') {
            this.$refs.elxEditable.setActiveRow(row)
          }
        }).then(() => {
          this.isClearActiveFlag = true
        })
      } else {
        this.$refs.elxEditable.clearActive()
      }
    },
    removeEvent (row) {
      if (row.id) {
        this.isClearActiveFlag = false
       this.$confirm('确定永久删除该数据?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
        //   进行删除数据

        //删除成功
        this.loading = false
        //删除失败
        //  this.loading = false
  
        }).catch(action => action).then(() => {
          this.isClearActiveFlag = true
        })
      } else {
        this.$refs.elxEditable.remove(row)
      }
    },
    deleteSelectedEvent () {    //删除选中
      let removeRecords = this.$refs.elxEditable.getSelecteds()
      console.log('deleteSelectedEvent')
      console.log(removeRecords)//选中的对象
      if (removeRecords.length) {
        this.isClearActiveFlag = false
       this.$confirm('确定删除所选数据?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
            // 进行发起请求删除
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // this.findList()
            //删除成功

            this.loading = false
            //删除不成功
            
          })
        
        //   this.isClearActiveFlag = true

      } else {
        this.$message({
          type: 'info',
          message: '请至少选择一条数据！'
        })
      }
    },
    saveRowEvent (row) {
      this.$refs.elxEditable.validateRow(row, valid => {
        if (valid) {
          let url = '/api/user/add'
          if (row.id) {
            url = '/api/user/update'
            console.log('这id是什么梗')
            console.log(row)
            console.log(row.id)
          }
          if (XEUtils.isDate(row.date)) {
            row.date = row.date.getTime()
          }
          this.loading = true
          this.$refs.elxEditable.clearActive()
          //进行网路请求保存
            // this.findList()
           this.$message({ message: '保存成功', type: 'success' })
            this.loading = false
            //保存不成功
        
           // this.loading = false
          
        }
      })
    },
    exportCsvEvent () {
      this.$refs.elxEditable.exportCsv()
    },
    cell_select ({row, column, rowIndex, columnIndex}){ //单元格样式
        if (columnIndex >0) { //带选择框的情况
             return {'text-align': 'center'}
        }
    }
        
  }
}
</script>

<style scoped>
.manual-table2-oper {
  margin-bottom: 18px;
}
.manual-table2-pagination {
  margin-top: 18px;
  text-align: right;
}
.manual-table2.elx-editable .elx-editable-row.new-insert,
.manual-table2.elx-editable .elx-editable-row.new-insert:hover>td {
  background-color: #f0f9eb;
}
</style>