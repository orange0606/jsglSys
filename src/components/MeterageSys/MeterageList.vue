<template>
    <el-collapse-transition>
    <div v-loading="loading" element-loading-text="飞速加载中">
        <h3>计量清单列表</h3>
        <!-- 业务按钮 -->
        <div class="manual-table2-oper">
            <el-button type="success" size="mini" @click="visibleNew = true" >新增</el-button>
            <el-button type="danger" size="mini" @click="deleteSelectedEvent">删除选中</el-button>
            <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
        </div>
        <!-- 主体表格 -->
        <elx-editable
        ref="elxEditable"
        class="manual-table2"
        border
        size="mini"
        :data.sync="list"
        :cell-style ="cell_select"
        :edit-config="{trigger: 'manual', mode: 'row', autoClearActive: false}"
        style="width: 100%">
        <elx-editable-column type="selection" width="50" align="center" fixed="left" ></elx-editable-column>
        <elx-editable-column type="index" width="50" align="center" fixed="left" > </elx-editable-column>
        <!-- <elx-editable-column prop="id" label="ID" width="80"></elx-editable-column> -->
                
        <!-- <elx-editable-column prop="changeHead.num" label="原清单表头编号" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <elx-editable-column prop="meterageHead.name" min-width="110" label="表头名称" align="center" fixed="left" show-overflow-tooltip ></elx-editable-column>
        <!-- <elx-editable-column prop="process.num" label="审批单编号" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <!-- <elx-editable-column prop="process.name" label="审批单名称" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <elx-editable-column prop="num" label="原清单编号" min-width="110" align="center" fixed="left" show-overflow-tooltip :edit-render="{name: 'ElInput'}" ></elx-editable-column>     
        <elx-editable-column prop="name" label="原清单名称" min-width="110" align="center" fixed="left" show-overflow-tooltip :edit-render="{name: 'ElInput'}" ></elx-editable-column>
        <elx-editable-column prop="tender.num" label="标段编号" min-width="110" align="center" show-overflow-tooltip ></elx-editable-column>
        <elx-editable-column prop="tender.name" label="标段名称"  min-width="110" align="center" show-overflow-tooltip ></elx-editable-column>
        <elx-editable-column prop="type" label="审批单类别" min-width="110" align="center" show-overflow-tooltip :formatter="formatterType" ></elx-editable-column>
        <elx-editable-column prop="enter" label="录入状态" align="center" show-overflow-tooltip >
            <template slot-scope="scope">
                <!-- 1已录入 0未录入 其他出错-->
                <i v-if="scope.row.enter ==0" style="color:orange;width:20px;" class="el-icon-circle-close"></i>
                <i v-if="scope.row.enter ==1" style="color:#67c23a;width:20px;" class="el-icon-circle-check"></i>
                <i v-if="scope.row.enter ==2" style="color:red;width:20px;" class="el-icon-warning-outline"></i>
            </template>
        </elx-editable-column>
        <!-- <elx-editable-column prop="startTime" label="发起时间" min-width="150" align="center" show-overflow-tooltip sortable :formatter="formatterDate" ></elx-editable-column> -->
        <elx-editable-column prop="saveEmployee.name" width="90" label="创建人" align="center" ></elx-editable-column>
        <elx-editable-column prop="saveTime" label="创建时间" min-width="150" align="center" show-overflow-tooltip sortable :formatter="formatterDate" ></elx-editable-column>
        <elx-editable-column prop="updateEmployee.name" width="90" label="更改人" align="center" ></elx-editable-column>
        <elx-editable-column prop="updateTime" label="更新时间" min-width="150" align="center" show-overflow-tooltip sortable  :formatter="formatterDate"></elx-editable-column>
        
        <elx-editable-column label="操作" fixed="right" width="185" align="center" >
            <template v-slot="scope">
            <template v-if="$refs.elxEditable.hasActiveRow(scope.row)">
                <el-tooltip content="保存" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="success" icon="el-icon-document-checked" @click="saveRowEvent(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="取消" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="info" icon="el-icon-close" @click="cancelRowEvent(scope.row)"></el-button>
                </el-tooltip>

            </template>
            <template v-else>
                <el-tooltip content="修改" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="openActiveRowEvent(scope.row)" ></el-button>
                </el-tooltip>
                <el-tooltip content="查看" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="success" icon="el-icon-monitor" @click="see(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeEvent(scope.row)"></el-button>
                </el-tooltip>
            </template>
            </template>
        </elx-editable-column>
        </elx-editable>

        <el-pagination
          class="manual-table4-pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageVO.currentPage"
          :page-sizes="[5, 10, 15, 20, 50, 100, 150, 200]"
          :page-size="pageVO.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageVO.totalResult">
        </el-pagination>

         <!-- 引入计量清单组件 -->
        <transition name="el-fade-in">
          <el-dialog title="新建计量清单" width="100%" top="0vh" height="100%" :fullscreen="true" destroy-on-close :lock-scroll="false" :visible.sync="visibleNew">
              <new-meterage :tender="tender" :refresh.sync="visibleNew" :meterageList="list" :uplist.sync="uprow" ></new-meterage>
          </el-dialog>
        </transition>

    </div>
    </el-collapse-transition>

</template>

<script>
import NewMeterage from './NewMeterage';
import XEUtils from 'xe-utils'
  export default {
  name: 'MeterageList',
  components: {
      NewMeterage
  },
  props: {
      meterageList:{    //变更清单数据列表，这个数据用于返回给父组件
      type: Array,
      required: false,
      default: () => []
    },
    tender:{
      type: Object,
      required: false,
      default: () => ({id:37, name:"机电标段"})
    }
  },
  data () {
    return {
      list: this. meterageList,
      visibleNew:false,
      refresh:false,
      loading: false,
      list: null,
      uprow:  null,//修改清单（传入子组件的数据）
      tenderList:null,  //全部标段
      dialogVisible:false,//显示隐藏
      pageVO: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      isClearActiveFlag: true,
      rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
    }
  },
  created () {
    // this.findList();  //发起请求所有已录入原清单
    // this.  meterageList = this.list;
  },
  watch: {
    
    visibleNew: function(newVal,oldVal){
        if (!newVal && this.list.length >0) { //把数据返回到父组件
          this. meterageList.length = 0;
          for (let index = 0; index < this.list.length; index++) {
              this. meterageList.push(this.list[index]); 
          }
          this.visibleNew = false; //关闭显示
        }
    },

  },
  computed: {
    // enter: function () {
    // }
  },
  methods: {
    see (row) { //预览和修改清单
        this.uprow = row;
        this.visibleNew = true; //显示建立清单组件
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.findList()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.findList()
    },
    formatterType (row, column, cellValue, index) {
      let obj = {
        original: '原清单',
        change: '变更清单',
        update: '变更后的清单',
        meterage: '计量清单',
        totalmeterage: '累计计量清单',	
        pay: '支付清单',
        totalpay: '累计支付清单'
      }
      return cellValue ? obj[cellValue] : '未知'
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
    
    // 点击表格外面处理
    checkOutSave (row) {
      if (!row.id) {
        this.isClearActiveFlag = false;
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
          this.isClearActiveFlag = true;
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
            this.$refs.elxEditable.remove(row)
            // console.log('移除数据')
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
    removeEvent (row) {     //删除单个清单
      if (row.id) {
        this.isClearActiveFlag = false
       this.$confirm('确定永久删除该数据?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.loading = true
          this.$refs.elxEditable.remove(row);
        }).catch(action => action).then(() => {
          this.isClearActiveFlag = true;
        })
      } else {
        this.$refs.elxEditable.remove(row);
        let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
        this. meterageList.length = 0;
        for (let index = 0; index < rest.length; index++) {
          this. meterageList.push(rest[index]); 
        }
      }
    },
    deleteSelectedEvent () {    //删除选中
      let removeRecords = this.$refs.elxEditable.getSelecteds()
      if (removeRecords.length) {
        this.isClearActiveFlag = false
       this.$confirm('确定删除所选数据?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs.elxEditable.remove(removeRecords);
          let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
          this. meterageList.length = 0;
          for (let index = 0; index < rest.length; index++) {
            this. meterageList.push(rest[index]); 
          }
        })
          // this.isClearActiveFlag = true;
      } else {
        this.$message({
          type: 'info',
          message: '请至少选择一条数据！'
        })
      }
    },
    saveRowEvent (row) {  //保存
      this.$refs.elxEditable.validateRow(row, valid => {
        if (valid) {
            let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
            this. meterageList.length = 0;
            for (let index = 0; index < rest.length; index++) {
              this. meterageList.push(rest[index]); 
            }
            this.$refs.elxEditable.clearActive();//清除所有单元格编辑状态
        }
      })
    },
    exportCsvEvent () {
      this.$refs.elxEditable.exportCsv();
    },
    cell_select ({row, column, rowIndex, columnIndex}){ //单元格样式
        if (columnIndex >0) { //带选择框的情况
            //  return {'text-align': 'center'}
        }
    }
        
  }
}
</script>

<style scoped>
.manual-table2-oper {
  margin-bottom: 18px;
  text-align: left;
}
.manual-table2-oper a{
color: #fff;
}
.manual-table2-pagination {
  margin-top: 18px;
  text-align: right;
}
.manual-table4-pagination {
  margin-top: 18px;
  text-align: right;
}

.manual-table2.elx-editable .elx-editable-row.new-insert,
.manual-table2.elx-editable .elx-editable-row.new-insert:hover>td {
  background-color: #f0f9eb;
}
</style>