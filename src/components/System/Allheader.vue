<template>
<el-row :gutter="0">
  <!-- <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"><div class="grid-content bg-purple"></div></el-col> -->
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    <el-collapse-transition>
    <div >
        <h3>已建表头</h3>
        <div class="manual-table2-oper">
            <el-button type="success" size="mini" @click="newHeader">新增</el-button>
            <el-button type="danger" size="mini" @click="deleteSelectedEvent">删除选中</el-button>
            <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
        </div>

        <elx-editable
        ref="elxEditable"
        class="manual-table2"
        border
        size="mini"
        max-height="600"
        :data.sync="list"
        :cell-style ="cell_select"
        :edit-config="{trigger: 'manual', mode: 'row', autoClearActive: false}"
        v-loading="loading" 
        element-loading-text="飞速加载中"
        style="width: 100%">
        <elx-editable-column type="selection" align="center" width="50"></elx-editable-column>
        <elx-editable-column type="index" align="center" width="50"> </elx-editable-column>
        <!-- <elx-editable-column prop="id" label="ID" width="80"></elx-editable-column> -->
        <elx-editable-column prop="tender.num" width="120" align="center" show-overflow-tooltip label="标段编号" >
        </elx-editable-column>
        <elx-editable-column prop="tender.name" label="标段名称" align="center" show-overflow-tooltip >
            <template slot-scope="scope" v-if="scope.row.tender.select ==true">
                <el-select v-model="scope.row.tender.name" @change="tenderUp(scope.row)" placeholder="请选择标段" size="small" style=" width:100%;">
                      <el-option v-for="(val,i) in tenderList" :key="i" :label="val.name" :value="val.id"></el-option>
                </el-select>
            </template>
        </elx-editable-column>
        <elx-editable-column prop="num" label="表头编号" align="center" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
        <elx-editable-column prop="name" label="表头名称" align="center" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
        <elx-editable-column prop="type" label="类别" align="center" show-overflow-tooltip :formatter="formatterType">
        </elx-editable-column>
        <elx-editable-column prop="saveEmployee.name" align="center" width="80" label="创建人" >
        </elx-editable-column>
        <elx-editable-column prop="saveTime" label="创建时间" align="center" show-overflow-tooltip sortable :formatter="formatterDate" ></elx-editable-column>
        <elx-editable-column prop="updateEmployee.name" align="center" width="80" label="更改人" >
        </elx-editable-column>
        <elx-editable-column prop="updateTime" label="更新时间" align="center" show-overflow-tooltip sortable  :formatter="formatterDate"></elx-editable-column>
        
        <elx-editable-column label="操作" align="center" fixed="right" width="185">
            <template v-slot="scope">
            <template v-if="$refs.elxEditable.hasActiveRow(scope.row)">
                <!-- <el-button size="mini" type="success" @click="saveRowEvent(scope.row)">保存</el-button>
                <el-button size="mini" type="warning" @click="cancelRowEvent(scope.row)">取消</el-button> -->
                <el-tooltip content="保存" placement="top" :enterable="false" effect="light">
                    <el-button :disabled="scope.row.type=='update'?true:false" size="mini" type="success" icon="el-icon-document-checked" @click="saveRowEvent(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="取消" placement="top" :enterable="false" effect="light">
                    <el-button :disabled="scope.row.type=='update'?true:false" size="mini" type="info" icon="el-icon-close" @click="cancelRowEvent(scope.row)"></el-button>
                </el-tooltip>

            </template>
            <template v-else>
                <!-- <el-button size="mini" type="primary" @click="openActiveRowEvent(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="removeEvent(scope.row)">删除</el-button> -->
                <el-tooltip content="修改" placement="top" :enterable="false" effect="light">
                    <el-button :disabled="scope.row.type=='update'?true:false" size="mini" type="primary" icon="el-icon-edit" @click="openActiveRowEvent(scope.row)" ></el-button>
                </el-tooltip>
                <el-tooltip content="查看" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="success" icon="el-icon-monitor" @click="seeTbale(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" :enterable="false" effect="light">
                    <el-button :disabled="scope.row.type=='update'?true:false" size="mini" type="danger" icon="el-icon-delete" @click="removeEvent(scope.row)"></el-button>
                </el-tooltip>
            </template>
            </template>
        </elx-editable-column>
        </elx-editable>

        <!-- 引入建立表头组件 -->
        <el-dialog title="表头预览" width="95%" top="10vh" :center="false" :destroy-on-close="true" :visible.sync="editShow">
            <headeratt :Form="Form" :visible.sync="editShow" ></headeratt>
        </el-dialog>

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
//引入表头组件
import headeratt from './NewHeader'
  export default {
  name: 'headers',
  components: {headeratt},
  data () {
    return {
      loading: false,
      list: [
      ],
      tenderid:null,
      tenderList:[],//全部标段
      tenderName:[],
      Form:{  //表单数据
          sysOrder: null,          //系统序号 预留，暂时不用
          sysNum: null,           //系统编号 预留，暂时不用
          tenderId: null,   //标段id 
          num: null,    //表头编号
          name: null,           //表名
          type: null,          //类别 original原清单change变更清单update变更后的清单meterage计量清单 totalmeterage累计计量清单 pay支付清单 totalpay累计支付清单
          tOriginalHeadId: null,    //原清单表头ID 建变更清单和变更后清单表头时传
          tUpdateHeadId: null,   //变更后（新）清单表ID  建计量清单和累计计量清单表头时传
          tTotalmeterageHeadId: null, //累计计量清单表头ID 建支付清单和累计支付清单表头时传
          tMeterageHeadId: null,         //计量清单表头id     建累计计量清单表头时传
          payHeadId: null,    ////支付清单表头ID    建累计支付清单表头时传
          refCol:null,   //多少列
          refRow:null,   //多少行
          headRowList:[],           //表头单元格内容   
      },
      editShow:false,//显示隐藏修改表头
      textShow:'新建表头',
      pageVO: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      isClearActiveFlag: true
    }
  },
  created () {
    this.tenList()  //发起请求所有标段
    this.findList()  //发起请求所有已建表头数据
  },
  watch: {
      editShow: function(New, Old){  //监听子组件传来的是否隐藏组件的布尔值
          if(!New){
              this.findList();  //发起请求所有已建表头数据
          }
      },
  },
  methods: {
    newHeader () {
      this.Form = {  //表单数据
          sysOrder: null,          //系统序号 预留，暂时不用
          sysNum: null,           //系统编号 预留，暂时不用
          tenderId: null,   //标段id 
          num: null,    //表头编号
          name: null,           //表名
          type:  null,          //类别 original原清单change变更清单update变更后的清单meterage计量清单 totalmeterage累计计量清单 pay支付清单 totalpay累计支付清单
          tOriginalHeadId: null,    //原清单表头ID 建变更清单和变更后清单表头时传
          tUpdateHeadId: null,   //变更后（新）清单表ID  建计量清单和累计计量清单表头时传
          tTotalmeterageHeadId:  null, //累计计量清单表头ID 建支付清单和累计支付清单表头时传
          payHeadId: null,    ////支付清单表头ID    建累计支付清单表头时传
          refCol:null,   //多少列
          refRow:null,   //多少行
          headRowList:[],           //表头单元格内容   
      }
      this.editShow = true; //显示表头组件
      this.textShow = '新建表头';
    },
    queryHeader (rows) {  //查询用户当前输入的表头名之类的是否已存在数据库
        let url = '/head/'+rows.type;
        if (rows.type == 'update') {
            url = '/head/one/'+rows.type;
        }
        let params = {
          tenderId: rows.tender.id,
          num: rows.num,
          name: rows.name,
          type: rows.type
        }
        this.$post(url,params)
        .then((response) => {
            if (response.data.head) {
                this.$message({ message: '当前未作出变动', type: 'error' })
                return false;
            }
            // console.log('正在保存当前行数据')
            //进行网路请求保存
            this.$refs.elxEditable.clearActive(); //清除编辑状态
            this.$post('/head/update',rows)
              .then((response) => {
              // console.log(response)
              this.loading = false
              this.findList()
              this.$message({ message: '保存成功', type: 'success' })
            })
            
         })

    },
    updatas (row) {

    },
    tenList (){   //请求所有标段
        this.$post('/tender/getall',{})
          .then((response) => {
          this.tenderList = response.data.tenderList;
          this.tenderName = [];
          for (let index = 0; index < this.tenderList.length; index++) {
              this.tenderName.push({label:this.tenderList[index].name,value:this.tenderList[index].name})
          }

        })
    },
    tenderUp(row){
        row.tenderId = row.tender.id = row.tender.name;
        for (let index = 0; index < this.tenderList.length; index++) {
          if (row.tender.name == this.tenderList[index].id ) {
              row.tender.name = this.tenderList[index].name;
              row.tender.num = this.tenderList[index].num;
              break;
          } 
        }
    },
    findList () {   //请求所有已建表头数据函数
      this.loading = true
        //发起网络请求
      this.$post('/head/getall',{page:{current:this.pageVO.currentPage,pageSize:this.pageVO.pageSize}})
        .then((response) => {
        this.list = response.data.headList.list;
        this.pageVO.totalResult = response.data.headList.total;
        this.loading = false;

      })

    },
    seeTbale (row) {
        let id = row.id;
        let type = row.type;
        this.editShow = true;
        this.$post('/head/getone',{id, type})
        .then((response) => {
            console.log('response')
            console.log(response)
        let data = response.data.onehead;
        this.Form = {...data};
        // let form = response.data.onehead.tOriginalHead
        let key = '';
        if (type == 'original') {
          key = 'tOriginalHeadRows';
        }else if (type == 'change'){
          key = 'tChangeHeadRows';
        }else if (type == 'update'){
          key = 'tUpdateHeadRows';
        }else if (type == 'totalmeterage'){
          key = 'tTotalmeterageHeadRows';
        }else if (type == 'meterage'){
          key = 'tMeterageHeadRows';
        }else if (type == 'totalpay'){
          key = 'tTotalpayHeadRows';
        }else if (type == 'pay'){
          key = 'tPayHeadRows';
        }
        let headRowList = new Array();
        headRowList = [...data[key]];

        delete this.Form[key];
        this.Form.headRowList = headRowList;
        this.textShow = '预览表头';
        
      })


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
          // 进行发起请求删除
          let data = {};
          data.headList = [];
          data.headList.push({id:row.id,type:row.type})
          this.$post('/head/delarray',data)
              .then((response) => {
              //删除成功
              this.loading = false
              this.findList()
              this.$message({
                type: 'success',
                message: '删除所选选项成功!'
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
            let data= {}
            data.headList=[];
            for (let index = 0; index < removeRecords.length; index++) {
                data.headList.push({id:removeRecords[index].id,type:removeRecords[index].type})
            }
            // 进行发起请求删除
            this.$post('/head/delarray',data)
              .then((response) => {
              //删除成功
              this.loading = false
              this.findList()
              this.$message({
                type: 'success',
                message: '删除所选选项成功!'
              })
            })
            // this.loading = false
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
    saveRowEvent (row) {  //网络保存(修改表头)
      delete row.tender.select
      this.$refs.elxEditable.validateRow(row, valid => {
        if (valid) {
          
           //查询修改表头的数据是否已存在
          this.queryHeader(row);
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