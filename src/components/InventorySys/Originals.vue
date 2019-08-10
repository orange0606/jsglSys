<template>
<el-row :gutter="0">
  <!-- <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"><div class="grid-content bg-purple"></div></el-col> -->
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    <el-collapse-transition>
    <div v-loading="loading" element-loading-text="飞速加载中">
        <h3>全部原清单</h3>
        <div class="manual-table2-oper">
            <p style="color: red;font-size: 12px;">按条件进行筛选</p>
            <!-- 清单搜索 -->
            <el-form ref="tableform" class="click-table6-form" size="mini" :inline="true" :model="formData">
              <el-form-item label="清单名称" prop="name1">
                <el-input v-model="formData.name" placeholder="清单名称" clearable ></el-input>
              </el-form-item>
              <el-form-item label="标段" prop="tenderId">
                <el-select clearable v-model="formData.tenderId" placeholder="请选择标段">
                  <!-- <el-option v-for="(item, index) in sexList" :key="index" :label="item.label" :value="item.value"></el-option> -->
                  <el-option
                    v-for="item in tenderList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    <span style="float: left">{{ item.num }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="录入状态" prop="enter">
                <el-select clearable v-model="formData.enter" placeholder="请选择录入状态">
                  <el-option label="未录入" value="0"></el-option>
                  <el-option label="已录入" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="流水号" prop="number">
                  <el-input v-model="formData.number" placeholder="流水号" clearable ></el-input>
              </el-form-item>
 
              <el-form-item label="选择发起时间" prop="rows">
                <el-date-picker
                  v-model="formData.data"
                  type="datetimerange"
                  align="right"
                  size="mini"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
              
              <el-form-item label="表格内容" prop="rows">
                <el-input v-model="formData.rows" placeholder="请输入内容" clearable ></el-input>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="searchEvent">查询</el-button>
                <el-button @click="$refs.tableform.resetFields()">重置</el-button>
              </el-form-item>
            </el-form>
        </div>
        

        <!-- 业务按钮 -->
        <div class="manual-table2-oper">
            <el-button type="success" size="mini" ><router-link to="/newInventory">新增</router-link></el-button>
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
                
        <!-- <elx-editable-column prop="originalHead.num" label="原清单表头编号" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <!-- <elx-editable-column prop="originalHead.name" label="原清单表头名称" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <!-- <elx-editable-column prop="process.num" label="审批单编号" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <!-- <elx-editable-column prop="process.name" label="审批单名称" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <elx-editable-column prop="num" label="原清单编号" min-width="110" align="center" fixed="left" show-overflow-tooltip :edit-render="{name: 'ElInput'}" ></elx-editable-column>     
        <elx-editable-column prop="name" label="原清单名称" min-width="110" align="center" fixed="left" show-overflow-tooltip :edit-render="{name: 'ElInput'}" ></elx-editable-column>
        <elx-editable-column prop="tender.num" label="标段编号" align="center" show-overflow-tooltip ></elx-editable-column>
        <elx-editable-column prop="tender.name" label="标段名称" align="center" show-overflow-tooltip ></elx-editable-column>
        <elx-editable-column prop="type" label="审批单类别" min-width="110" align="center" show-overflow-tooltip :formatter="formatterType" ></elx-editable-column>
        <elx-editable-column prop="enter" label="录入状态" align="center" show-overflow-tooltip >
            <template slot-scope="scope">
                <!-- 1已录入 0未录入 其他出错-->
                <i v-if="scope.row.enter ==0" style="color:orange;width:20px;" class="el-icon-circle-close"></i>
                <i v-if="scope.row.enter ==1" style="color:#67c23a;width:20px;" class="el-icon-circle-check"></i>
                <i v-if="scope.row.enter ==2" style="color:red;width:20px;" class="el-icon-warning-outline"></i>
            </template>
        </elx-editable-column>
        <elx-editable-column prop="startTime" label="发起时间" min-width="120" align="center" show-overflow-tooltip sortable :formatter="formatterDate" ></elx-editable-column>
        <elx-editable-column prop="saveEmployee.name" width="90" label="创建人" align="center" ></elx-editable-column>
        <elx-editable-column prop="saveTime" label="创建时间" min-width="120" align="center" show-overflow-tooltip sortable :formatter="formatterDate" ></elx-editable-column>
        <elx-editable-column prop="updateEmployee.name" width="90" label="更改人" align="center" ></elx-editable-column>
        <elx-editable-column prop="updateTime" label="更新时间" min-width="120" align="center" show-overflow-tooltip sortable  :formatter="formatterDate"></elx-editable-column>
        
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

        <!-- 引入表格预览组件 -->
        <!-- <transition name="el-fade-in">
          <el-dialog title="清单预览" width="85%" top="10vh" :center="false" :visible.sync="">
              <edit :tableList.sync="update" :heads="head" ></edit>
          </el-dialog>
        </transition> -->

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
    </div>
    </el-collapse-transition>
  </el-col>

</el-row>

</template>

<script>
import XEUtils from 'xe-utils'

  export default {
  name: 'Originals',
  components: {},
  data () {
    return {
      loading: false,
      list: null,
      tenderList:null,  //全部标段
      dialogVisible:false,//显示隐藏
      pageVO: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      formData: {
        name: null,
        tenderId: null,
        rows: null,
        date: null,
        number: null,
        enter: null,
      },
      allTender: [],
      isClearActiveFlag: true,
      rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
    }
  },
  created () {
    this.findList();  //发起请求所有已录入原清单
    this.tenList();  //发起请求所有标段

  },
  watch: {

  },
  computed: {
    // enter: function () {
    // }
  },
  methods: {
    
    findList () {   //请求所有已建表头数据函数
      this.loading = true
      // 发起网络请求
      this.$post('/original/all',{current:this.pageVO.currentPage,pageSize:this.pageVO.pageSize})
        .then((response) => {
          this.list = response.data.originalList.list;
          this.pageVO.totalResult = response.data.originalList.total;
          this.loading = false;
      }).catch(e => {
          this.loading = false;
          this.$message({
            type: 'info',
            message: '发生错误！'
          });
          this.findList();
      })

    },
    tenList (){   //请求所有标段
        this.$post('/tender/getall',{})
          .then((response) => {
          this.tenderList = response.data.tenderList;
        }).catch(e => {
          this.tenList();
      })
    },
    see (row) {
        console.log('预览清单')
    },
    searchEvent () {
      //条件搜索
      this.loading = true;
      this.pageVO.currentPage = 1;
      let data = new Object();
      let startEmployeeId = this.$store.state.token;
      let fromTimeStart = this.formData.date!=null && this.formData.date.length >2?this.formData.date[0]:'';
      let toTimeStart = this.formData.date!=null && this.formData.date.length >2?this.formData.date[1]:'';
      data = {
        name: this.formData.name , //清单名称
        tenderId: this.formData.tenderId, //标段id
        startEmployeeId, //发起人ID
        fromTimeStart, //时间段开始时间（发起时间）
        toTimeStart, //时间段结束时间（发起时间）
        number: this.formData.number, //流水号（年月+清单ID）      
        enter: this.formData.enter,   // 录入状态
        rows: [ this.formData.rows ], //表格内容搜索
        current: this.pageVO.currentPage,  //当前页码
        pageSize: this.pageVO.pageSize,   //每页数量

      }
      console.log(this.formData);
      console.log(data);
      this.$post('/original/all',data)
        .then((response) => {
          this.list = response.data.originalList.list;
          this.pageVO.totalResult = response.data.originalList.total;
          this.loading = false;
      }).catch(e => {
          this.loading = false;
          this.$message({
            type: 'info',
            message: '发生错误！'
          })
      })

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
    enterIcon (row, column, cellValue, index) {
      let obj = new Object();
      obj = {
        "0" :'',
        "1" :''
      }
      return cellValue ? obj[cellValue] : cellValue
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
      row.tender.select = true; //显示标段选择下拉框
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
      delete row.tender.select  //隐藏标段选择下拉框
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
          this.loading = true
          // 进行发起请求删除
          this.$post('/original/del',{id:row.id})
              .then((response) => {
              //删除成功
              this.loading = false
              this.findList()
              this.$message({
                type: 'success',
                message: '删除所选选项成功!'
              })
            }).catch(e => {
                this.loading = false;
                this.$message({
                type: 'info',
                message: '删除失败，请重试！'
                })
            })
        }).catch(action => action).then(() => {
          this.isClearActiveFlag = true
        })
      } else {
        this.$refs.elxEditable.remove(row)
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
          this.loading = true
            // 进行发起请求删除
            let data= new Object();
            data.originalIdList=[];
            for (let index = 0; index < removeRecords.length; index++) {
                data.originalIdList.push({id:removeRecords[index].id})
            };
            console.log(data)
            this.loading = true
            // 进行发起请求删除
            this.$post('/original/delarray',data)
              .then((response) => {
              //删除成功
              this.loading = false
              this.findList()
              this.$message({
                type: 'success',
                message: '删除所选选项成功!'
              })
            }).catch(e => {
                this.loading = false;
                this.$message({
                type: 'info',
                message: '删除失败，请重试！'
                })
            })
          })
        
        //   this.isClearActiveFlag = true

      } else {
        this.$message({
          type: 'info',
          message: '请至少选择一条数据！'
        })
      }
    },
    saveRowEvent (row) {  //网络保存(修改表头)
      delete row.tender.select
      this.$refs.elxEditable.validateRow(row, valid => {
        if (valid) {
          console.log('row')
          console.log(row)
          let data = new Object();
          data = {
              id: row.id,                                    //原清单id
              originalHeadId: originalHead.id,               //原清单表头id
              processId:  process.id,                         //审批单流程id
              sysOrder: null,                    //系统序号  预留，暂不使用
              sysNum: null,                     //系统编号  预留，暂不使用
              name: row.name,                       //原清单名称
              num:  row.num,                        //原清单编号
              tender_id: row.tender.id,                    //标段id
              type: row.type,                 //原清单类别为”original”
              originalRowList:null,          
          };
          this.loading = true;
          this.$refs.elxEditable.clearActive();
          // console.log('正在保存当前行数据')
          // console.log(row)
          //进行网路请求保存
          this.$post('/original/update',row)
            .then((response) => {
            // console.log(response)
            this.loading = false
            this.findList()
            this.$message({ message: '保存成功', type: 'success' })
          }).catch(e => {
                this.loading = false;
                this.$message({
                type: 'info',
                message: '删除失败，请重试！'
                })
          })
            
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