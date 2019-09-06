<template>
    <el-collapse-transition>
    <div v-loading="loading" element-loading-text="飞速加载中">
        <h3>{{text}}列表</h3>
        <!-- 主体表格 -->
        <elx-editable
        ref="elxEditable"
        class="click-table10"
        border
        height="466"
        size="small"
        :data.sync="list"
        :row-class-name="tableRowClassName"
        :edit-config="{}"
        style="width: 100%">
        <elx-editable-column type="selection" width="50" align="center" fixed="left" ></elx-editable-column>
        <elx-editable-column type="index" width="50" align="center" fixed="left" > </elx-editable-column>
        <!-- <elx-editable-column prop="id" label="ID" width="80"></elx-editable-column> -->
                
        <!-- <elx-editable-column prop="originalHead.num" label="原清单表头编号" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <elx-editable-column :prop="type+'Head.name'" min-width="110" label="表头名称" align="center" fixed="left" show-overflow-tooltip ></elx-editable-column>
        <!-- <elx-editable-column prop="process.num" label="审批单编号" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <!-- <elx-editable-column prop="process.name" label="审批单名称" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <elx-editable-column prop="num" :label="text+'编号'" min-width="110" align="center" fixed="left" show-overflow-tooltip :edit-render="{name: 'ElInput'}" ></elx-editable-column>     
        <elx-editable-column prop="name" :label="text+'名称'" min-width="110" align="center" fixed="left" show-overflow-tooltip :edit-render="{name: 'ElInput'}" ></elx-editable-column>
        <elx-editable-column prop="tender.num" label="标段编号" min-width="110" align="center" show-overflow-tooltip ></elx-editable-column>
        <elx-editable-column prop="tender.name" label="标段名称"  min-width="110" align="center" show-overflow-tooltip ></elx-editable-column>
        
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
                <el-tooltip content="查看" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="success" icon="el-icon-monitor" @click="see(scope.row)"></el-button>
                </el-tooltip>


            </template>
        </elx-editable-column>
        </elx-editable>
        <el-pagination
            :hide-on-single-page="!joinParent"
            class="click-table10-pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageVO.currentPage"
            :page-sizes="[5, 10, 15, 20, 50, 100, 150, 200]"
            :page-size="pageVO.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageVO.totalResult">
        </el-pagination>
         <!-- 引入新建原清单组件 -->
        <transition name="el-fade-in">
          <el-dialog :title="EditTitle" width="85%" top="4vh" custom-class="dialogs" :lock-scroll="false" :visible.sync="visibleNew">

              <!-- 此处引入预览清单组件 -->
              <row-list ></row-list>
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
  name: 'ReadOnlyList',
  components: {
    ShowEdit
  },
  props: {
    updateList:{  //新清单列表
      type:Array,
      required:false      
    },
    totalmeterageList:{  //新清单列表
      type:Array,
      required:false      
    },
    totalpayList:{  //新清单列表
      type:Array,
      required:false      
    },
    joinParent:{   //接入父组件标记，当joinParent标记为true时表示连接到父组件并接受父组件的参数；当joinParent为false时组件独立调试使用。
      type:Array,
      required:false,
      default:false   
    },
    type:{  //新清单、累计计量、累计支付的类型
      type: String,
      required: false,
      default: "update" //"update":新清单，“totalmeterage”:累计计量，totalpay:累计支付          
    },


  },
  data () {
    return {
      list: [],
      visibleNew:false,
      refresh:false,
      loading: false,
      list: null,
      uprow: null, //修改清单传入保存清单组组件的数据
      txet: '新清单',   //判断清单类型显示文字
      tenderList: null,  //全部标段
      dialogVisible:false,//显示隐藏
      isClearActiveFlag: true,
     
    }
  },
  created () {
      this.typeSwitch(this.type);   //判断是哪种清单
  },
  watch: {
    type: function ( newVal,oldVal ) {
        this.typeSwitch(newVal);   //判断是哪种清单
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
    typeSwitch ( newVal ) {    //判断是哪种清单
        switch(newVal) {
            case 'update':
                if (this.updateList.length == 0) {  //请求新清单列表
                    this.findList(newVal);
                }else{
                    this.list = this.updateList;
                }
                break;
            case 'totalmeterage':
                if (this.totalmeterage.length == 0) {  //请求新清单列表
                    this.findList(newVal);
                }else{
                    this.list = this.totalmeterage;
                }
                break;
            case 'totalpay':
                if (this.totalpay.length == 0) {  //请求新清单列表
                    this.findList(newVal);
                }else{
                    this.list = this.totalpay;
                }
                break;
        } 
    },
    findList ( type ) {
            // 发起网络请求
        switch(表达式) {
            case n:
                代码块
                break;
            case n:
                代码块
                break;
            default:
                默认代码块
        } 
        this.$post('/update/all',{id: this.approval.id})
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
        this.uprow = row;
        // console.log(this.uprow,' this.uprow')
        this.visibleNew = true; //显示建立清单组件
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

    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
   
    exportCsvEvent () {
      this.$refs.elxEditable.exportCsv();
    },
        
  }
}
</script>

<style scoped>
.click-table10-oper {
  margin-bottom: 18px;
}
.click-table10 .delete-row {
  color: #f56c6c;
  text-decoration: line-through;
}
.click-table10-pagination {
  margin-top: 18px;
  text-align: right;
}
.click-table10.elx-editable .elx-editable-row.new-insert,
.click-table10.elx-editable .elx-editable-row.new-insert:hover>td {
  background-color: #f0f9eb;
}
</style>