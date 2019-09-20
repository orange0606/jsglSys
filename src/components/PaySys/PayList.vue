<template>
    <el-collapse-transition>
    <div v-loading="loading" element-loading-text="飞速加载中">
        <h3>支付清单列表</h3>
        <!-- 业务按钮 -->
        <div class="manual-table2-oper" v-if="joinParent && mode==='show'?false:true">
            <span v-if="edit">
                <el-button :disabled="approval.state === 1?true:false" type="success" size="mini" @click="see({})" >新增</el-button>
                <el-button :disabled="approval.state === 1?true:false" type="danger" size="mini" @click="deleteSelectedEvent">删除选中</el-button>
                <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
            </span>
            <span v-if="!joinParent && mode==='show'?true:false" style="position: absolute; right:0;top:10px;">
                <el-switch
                v-model="edit"
                active-text="开启操作"> 
                </el-switch>   
            </span>
        </div>
        <!-- 主体表格 --> 
        <elx-editable
        ref="elxEditable"
        class="manual-table2"
        border
        size="mini"
        :data.sync="list"
        :edit-config="{trigger: 'manual', mode: 'row', autoClearActive: false}"
        style="width: 100%">
        <elx-editable-column type="selection" width="50" align="center" ></elx-editable-column>
        <elx-editable-column type="index" width="50" align="center" > </elx-editable-column>
        <!-- <elx-editable-column prop="id" label="ID" width="80"></elx-editable-column> -->
                
        <elx-editable-column prop="payHead.name" min-width="110" label="表头名称" align="center" show-overflow-tooltip ></elx-editable-column>
        <!-- <elx-editable-column prop="process.num" label="审批单编号" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <!-- <elx-editable-column prop="process.name" label="审批单名称" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <elx-editable-column prop="num" label="支付清单编号" min-width="110" align="center" show-overflow-tooltip :edit-render="{name: 'ElInput'}" ></elx-editable-column>     
        <elx-editable-column prop="name" label="支付清单名称" min-width="110" align="center" show-overflow-tooltip :edit-render="{name: 'ElInput'}" ></elx-editable-column>
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
        
        <elx-editable-column label="操作" :width="edit?'180':'70'" align="center" >
            <template v-slot="scope">
            <template v-if="$refs.elxEditable.hasActiveRow(scope.row)">
                <el-tooltip v-if="edit" content="保存" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="success" icon="el-icon-document-checked" @click="saveRowEvent(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip v-if="edit" content="取消" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="info" icon="el-icon-close" @click="cancelRowEvent(scope.row)"></el-button>
                </el-tooltip>
            </template>
            <template v-else>
                <el-tooltip v-if="edit" content="修改" placement="top" :enterable="false" effect="light">
                    <el-button :disabled="approval.state === 1?true:false" size="mini" type="primary" icon="el-icon-edit" @click="openActiveRowEvent(scope.row)" ></el-button>
                </el-tooltip>
                <el-tooltip content="查看" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="success" icon="el-icon-monitor" @click="see(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip v-if="edit" content="删除" placement="top" :enterable="false" effect="light">
                    <el-button :disabled="approval.state === 1?true:false" size="mini" type="danger" icon="el-icon-delete" @click="removeEvent(scope.row)"></el-button>
                </el-tooltip>
            </template>
            </template>
        </elx-editable-column>
        </elx-editable>
        <!-- 引入计量清单组件 -->
        <transition name="el-fade-in">
          <el-dialog :title="EditTitle" width="95%" top="4vh" height="100%" :fullscreen="false" :lock-scroll="false" :visible.sync="visibleNew">
              <new-pay :tender="tender" :refresh.sync="visibleNew" :uplist="uprow" :approval="approval" :payList="payList" :mode="mode" :joinParent="joinParent" ></new-pay>
              <br>
          </el-dialog>
        </transition>
    </div>
    </el-collapse-transition>
</template>

<script>
import NewPay from './NewPay';
import XEUtils from 'xe-utils';
  export default {
  name: 'PayList',
  components: {
    NewPay
  },
  props: {
    payList:{    //变更清单数据列表，这个数据用于返回给父组件
      type: Array,
      required: false,
      default: () => []
    },
    mode:{  //子组件的展示模式
      type: String,
      required: false,
      default: "show"  //new:新建模式 ，show:展示模式   ，alter:更改模式      
    },
    joinParent:{   //接入父组件标记，当joinParent标记为true时表示连接到父组件并接受父组件的参数；当joinParent为false时组件独立调试使用。
      // type:Array,
      required:false,
      default:false   
    },
    approval:{
      type: Object,
      required: false,
      default: () => ({id:301, name:"支付审批单-支付审批单1",state: 0}) //state=1为已通过的审批单
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
      edit: false, // 是否开启编辑
      uprow: null, //修改清单传入保存清单组组件的数据
      tenderList: null,  //全部标段
      EditTitle: '查看支付清单', //清单子组件的标题文字内容
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
      //此处判断父组件传来的展示模式类型
      this.modeType ( this.mode );
  },
  watch: {
    payList: function ( newVal,oldVal ) {
        //此处判断父组件传来的展示模式类型
        this.modeType ( this.mode );
    },
    visibleNew: function ( newVal,oldVal ) {
        if (!newVal) {
            if (this.mode === 'show') {
                 this.edit = false;
                 if (!this.joinParent) {  //是否接受父组件的值
                    this.findList();  //请求该审批id的所有清单
                    this.edit = true;
                }
            }else{
                this.edit = true;
                this.$nextTick(() => {
                    this.list = this.payList;
                }); // 强制刷新
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
    modeType ( type ) {
        if (this.joinParent) { //判断父组件是否传来数据
            //此处设置不需要分页
            this.list = this.payList;
        }
        this.edit = true;
        switch(type) {
            case 'new': //此处为新建模式处理
                break;
            case 'show': //此处为显示模式处理
                this.edit = false;
                if (!this.joinParent) {  //是否接受父组件的值
                    this.findList();  //请求该审批id的所有清单
                    this.edit = true;
                }
                break;
            case 'alter': //此处为修改模式处理
                break;
        } 
    },
    findList () {
            // 发起网络请求
        this.$post('/pay/getall',{id: this.approval.id})
            .then((response) => {
            this.list = response.data.payList;
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
        if (row.id || row.saveTime) {
            this.EditTitle = '查看支付清单';
        }else{
            this.EditTitle = '新建支付清单';
        }
        this.uprow = row;
        // console.log(this.uprow,' this.uprow')
        // console.log(this.payList,' payList')
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

    removeEvent (row) {
        if (row.id && this.mode === 'show') {   //展示模式才能进行网路保存
          this.isClearActiveFlag = false
          this.$confirm('确定永久删除该数据?', '温馨提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              this.loading = true
              // 进行发起请求删除
              var payIdList = [row.id];
              this.$post('/pay/delarray',{ payIdList })
                .then((response) => {
                //删除成功
                this.loading = false;
                this.findList();
//                 let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
//                 if (!this.joinParent) {  //是否接受父组件的值
//                     this.findList();  //请求该审批id的所有清单
//                 }else{
//                     this.$refs.elxEditable.remove(row);
//                     this.$refs.elxEditable.remove(removeRecords);
//                     this.$refs.elxEditable.remove(row);
//                     let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
//                     this.payList.length = 0;
//                     for (let index = 0; index < rest.length; index++) {
//                         this.payList.push(rest[index]); 
//                     }
//                 }
                this.$message({type: 'success', message: '删除所选选项成功!'})
              }).catch(e => {
                  this.$message({
                      type: 'info',
                      message: '删除失败！'+e
                  });
              })
          }).catch(action => action).then(() => {
            this.isClearActiveFlag = true
          })
        } else {    //新建模式与修改模式，仅进行数组的引用赋值修改
            //存储该条数据的创建时间，然后原数据进行删除
            this.$refs.elxEditable.remove(row);
            let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
            this.payList.length = 0;
            for (let index = 0; index < rest.length; index++) {
                this.payList.push(rest[index]); 
            }
            this.$message({type: 'success', message: '删除所选选项成功!'})
        }
    },
    deleteSelectedEvent () {    //删除选中
      let removeRecords = this.$refs.elxEditable.getSelecteds()
      if (removeRecords.length) {
        this.isClearActiveFlag = false;
       this.$confirm('确定删除所选数据?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.loading = true
            // 进行发起请求删除
            if ( this.mode === 'show') {    //展示模式执行的网络请求批量删除
                var payIdList = [];
                for (let index = 0; index < removeRecords.length; index++) {
                    payIdList.push(removeRecords[index].id)
                }
                // 进行发起请求删除
                this.$post('/pay/delarray',{ payIdList })
                .then((response) => {
                //删除成功
                this.loading = false
                this.findList()
                this.$message({
                    type: 'success',
                    message: '删除所选选项成功!'
                })
                }).catch(e => {
                    this.$message({
                        type: 'info',
                        message: '删除失败！'+e
                    });
                })
            }else {   //此处为新建模式与修改模式所需要的引用赋值操作
                this.$refs.elxEditable.remove(removeRecords);
                let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
                this.payList.length = 0;
                for (let index = 0; index < rest.length; index++) {
                    this.payList.push(rest[index]); 
                }
                this.loading = false;
                this.$message({
                    type: 'success',
                    message: '删除所选选项成功!'
                })
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
            if (this.mode === 'show') {
                var obj = {
                id: row.id,                                    //原清单id
                name: row.name,                     //原清单名称
                num: row.num,                    //原清单编号
                payRowList: null                 //原清单内容，如果为null表示无内容修改，如果为空数组，表示删除全部内容
                },
                payList = [],
                url = '/pay/update';
                payList.push(obj);
                this.$post(url,{ payList })
                    .then((response) => {   
                    this.$refs.elxEditable.clearActive();//清除所有单元格编辑状态
                    if (!this.joinParent) {  //是否接受父组件的值
                        this.findList();  //请求该审批id的所有清单
                    }else{

                    }
                    this.$message({ message: `修改成功`, type: 'success', duration: 3000, showClose: true })
                }).catch(e => {
                    this.$refs.elxEditable.clearActive();//清除所有单元格编辑状态
                    this.$message({
                        type: 'info',
                        message: '修改失败！'+e
                    });
                })
            }else { //此处为新建模式与修改模式所需要的引用赋值操作
                let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
                this.payList.length = 0;
                for (let index = 0; index < rest.length; index++) {
                this.payList.push(rest[index]); 
                }
                this.$message({ message: `修改成功`, type: 'success', duration: 3000, showClose: true });
                this.$refs.elxEditable.clearActive();//清除所有单元格编辑状态
            }
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
  width: 100%;
  height: 25px;
  position: relative;
  margin: 4px 0 15px 0;
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