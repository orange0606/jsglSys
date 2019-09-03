<template>
    <el-collapse-transition>
    <div v-loading="loading" element-loading-text="飞速加载中">
        <h3>原清单列表</h3>
        <!-- 业务按钮 -->
        <div class="manual-table2-oper">
            <el-button type="success" size="mini" @click="see({})" >新增</el-button>
            <el-button :disabled="approval.state === 1?true:false" type="danger" size="mini" @click="deleteSelectedEvent">删除选中</el-button>
            <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
        </div>
         <p style="color: red;font-size: 12px;margin:15px 0 15px 0;text-align:left;">审批通过后禁止修改与删除原清单！</p>

        <!-- 主体表格 -->
        <elx-editable
        ref="elxEditable"
        class="manual-table2"
        border
        size="mini"
        :data.sync="list"
        :edit-config="{trigger: 'manual', mode: 'row', autoClearActive: false}"
        style="width: 100%">
        <elx-editable-column type="selection" width="50" align="center" fixed="left" ></elx-editable-column>
        <elx-editable-column type="index" width="50" align="center" fixed="left" > </elx-editable-column>
        <!-- <elx-editable-column prop="id" label="ID" width="80"></elx-editable-column> -->
                
        <!-- <elx-editable-column prop="originalHead.num" label="原清单表头编号" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <elx-editable-column prop="originalHead.name" min-width="110" label="表头名称" align="center" fixed="left" show-overflow-tooltip ></elx-editable-column>
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
                    <el-button :disabled="approval.state === 1?true:false" size="mini" type="primary" icon="el-icon-edit" @click="openActiveRowEvent(scope.row)" ></el-button>
                </el-tooltip>
                <el-tooltip content="查看" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="success" icon="el-icon-monitor" @click="see(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" :enterable="false" effect="light">
                    <el-button :disabled="approval.state === 1?true:false" size="mini" type="danger" icon="el-icon-delete" @click="removeEvent(scope.row)"></el-button>
                </el-tooltip>
            </template>
            </template>
        </elx-editable-column>
        </elx-editable>
         <!-- 引入新建原清单组件 -->
        <transition name="el-fade-in">
          <el-dialog :title="EditTitle" width="85%" top="4vh" custom-class="dialogs" :lock-scroll="false" :visible.sync="visibleNew">
              <show-edit :tender="tender" :refresh.sync="visibleNew" :uplist="uprow" :approval="approval" ></show-edit>
              <br><br><br>
          </el-dialog>
        </transition>
    </div>
    </el-collapse-transition>
</template>

<script>
import ShowEdit from './ShowEdit';
import XEUtils from 'xe-utils'
  export default {
  name: 'OriginalList',
  components: {
    ShowEdit
  },
  props: {
    originalList:{    //原清单数据列表，这个数据用于返回给父组件
      type: Array,
      required: false,
      default: () => []
    },
    approval:{
      type: Object,
      required: false,
      default: () => ({id:93, name:"清单审批单",state: 0}) //state=1为已通过的审批单
    },
    tender:{
      type: Object,
      required: false,
      default: () => ({id:37, name:"机电标段"})
    }
  },
  data () {
    return {
      list: [],
      visibleNew:false,
      refresh:false,
      loading: false,
      list: null,
      uprow: null, //修改清单传入保存清单组组件的数据
      tenderList: null,  //全部标段
      EditTitle: '查看原清单', //清单子组件的标题文字内容
      dialogVisible:false,//显示隐藏
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
        if (this.originalList.length === 0) {
            this.findList();  //发起请求所有已录入原清单
        }else{
            this.list = this.originalList;
        }
    // this.originalList = this.list;
  },
  watch: {
    originalList: function ( newVal,oldVal ) {
        if (newVal.length === 0) {
            this.findList();  //发起请求所有已录入原清单
        }else{
            this.list = newVal;
        }
    },
    visibleNew: function ( newVal,oldVal ) {
        if (!newVal) {
            this.findList();  //发起请求所有已录入原清单
            this.visibleNew = false; //关闭显示
        }
    },
  },
  computed: {
    // enter: function () {
    // }
  },
  methods: {
    findList () {
            // 发起网络请求
        this.$post('/original/getall',{id: this.approval.id})
            .then((response) => {
            this.list = response.data.originalList;
            this.loading = false;
        }).catch(e => {
            this.loading = false;
            this.$message({
                type: 'info',
                message: '发生错误！'
            });
        })
    },
    see (row) { //预览和修改清单
        if (row.id) {
            this.EditTitle = '查看原清单';
        }else{
            this.EditTitle = '新建原清单';
        }
        this.uprow = row;
        console.log(this.uprow,' this.uprow')
        this.visibleNew = true; //显示建立清单组件
    },
    formatterType (row, column, cellValue, index) {
      let obj = {
        original: '原清单',
        change: '变更清单',
        update: '新清单',
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
        this.isClearActiveFlag = false
        this.$confirm('该数据未保存，请确认操作?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存数据',
          cancelButtonText: '移除数据',
          type: 'warning'
        }).then(action => {
          this.$refs.elxEditable.clearActive();
          this.saveRowEvent(row);
        }).catch(action => {
          if (action === 'cancel') {
            this.$refs.elxEditable.remove(row);
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
          this.$refs.elxEditable.clearActive();
          this.saveRowEvent(row)
        }).catch(action => {
          if (action === 'cancel') {
            this.$refs.elxEditable.revert(row)
            this.$refs.elxEditable.clearActive();
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
        this.originalList.length = 0;
        for (let index = 0; index < rest.length; index++) {
          this.originalList.push(rest[index]); 
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
          this.originalList.length = 0;
          for (let index = 0; index < rest.length; index++) {
            this.originalList.push(rest[index]); 
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
            this.originalList.length = 0;
            for (let index = 0; index < rest.length; index++) {
              this.originalList.push(rest[index]); 
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
.dialogs {
    height: 90%;
}
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