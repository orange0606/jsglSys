<template>
    <el-collapse-transition>
    <div v-loading="loading"  element-loading-text="飞速加载中">
      <div class="typeOption">
            <template>
          <span>切换类型：仅用于不接入父组件测试</span>
          <el-select v-model="type" :disabled="false" size="mini" placeholder="切换类型：仅用于测试">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </div>
       

        <h3>{{text}}列表</h3>
        <!-- 主体表格 -->
        <elx-editable
        ref="elxEditable"
        class="click-table10"
        border
        height="400"
        size="small"
        :data.sync="list"
        :edit-config="{}"
        style="width: 100%">
        <elx-editable-column :key="$excel.randomkey()" type="index" width="50" align="center" fixed="left" > </elx-editable-column>
        <!-- <elx-editable-column :key="$excel.randomkey()" prop="id" label="ID" width="80"></elx-editable-column> -->
        <elx-editable-column :key="$excel.randomkey()" :prop="type+'Head.name'" min-width="110" label="表头名称" align="center" fixed="left" show-overflow-tooltip ></elx-editable-column>
        <elx-editable-column :key="$excel.randomkey()" prop="num" :label="text+'编号'" min-width="110" align="center" fixed="left" show-overflow-tooltip ></elx-editable-column>     
        <elx-editable-column :key="$excel.randomkey()" prop="name" :label="text+'名称'" min-width="120" align="center" fixed="left"  >
            <template slot-scope="scope">
              <el-link :underline="true" style="font-size:12px;" type="success" @click="see(scope.row)" >{{scope.row.name}}</el-link>
            </template>
        </elx-editable-column>
        
        
        <elx-editable-column :key="$excel.randomkey()" prop="tender.num" label="标段编号" min-width="110" align="center" show-overflow-tooltip ></elx-editable-column>
        <elx-editable-column :key="$excel.randomkey()" prop="tender.name" label="标段名称"  min-width="110" align="center" show-overflow-tooltip ></elx-editable-column>
       <elx-editable-column :key="$excel.randomkey()" prop="type" label="审批单类别" min-width="110" align="center" show-overflow-tooltip :formatter="formatterType" ></elx-editable-column>
        <elx-editable-column :key="$excel.randomkey()" prop="enter" label="录入状态" align="center" show-overflow-tooltip >
            <template slot-scope="scope">
                <!-- 1已录入 0未录入 其他出错-->
                <i v-if="scope.row.enter ==0" style="color:orange;width:20px;" class="el-icon-circle-close"></i>
                <i v-if="scope.row.enter ==1" style="color:#67c23a;width:20px;" class="el-icon-circle-check"></i>
                <i v-if="scope.row.enter ==2" style="color:red;width:20px;" class="el-icon-warning-outline"></i>
            </template>
        </elx-editable-column>
        <!-- <elx-editable-column :key="$excel.randomkey()" prop="startTime" label="发起时间" min-width="150" align="center" show-overflow-tooltip sortable :formatter="formatterDate" ></elx-editable-column> -->
        <elx-editable-column :key="$excel.randomkey()" prop="saveEmployee.name" width="90" label="创建人" align="center" ></elx-editable-column>
        <!-- <elx-editable-column :key="$excel.randomkey()" prop="saveTime" label="创建时间" min-width="150" align="center" show-overflow-tooltip sortable :formatter="formatterDate" ></elx-editable-column> -->
        <!-- <elx-editable-column :key="$excel.randomkey()" prop="updateEmployee.name" width="90" label="更改人" align="center" ></elx-editable-column> -->
        <elx-editable-column :key="$excel.randomkey()" prop="updateTime" label="更新时间" min-width="150" align="center" show-overflow-tooltip sortable  :formatter="formatterDate"></elx-editable-column>
        <elx-editable-column :key="$excel.randomkey()" label="操作" fixed="right" width="100" align="center" >
            <template v-slot="scope">
                <el-tooltip content="查看" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="success" icon="el-icon-monitor" @click="see(scope.row)"></el-button>
                </el-tooltip>
            </template>
        </elx-editable-column>
        </elx-editable>
        <el-pagination
            
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
          <el-dialog :title="EditTitle" width="97%" top="3vh" custom-class="dialogs" :lock-scroll="false" :visible.sync="visibleNew">
              <div style="width:100%;height:100%;">
                  <!-- 此处引入预览清单组件 -->
                  <row-list :refresh.sync="visibleNew" :uplist="uprow" :type="type"></row-list>
                  <br><br><br>
              </div>
              
          </el-dialog>
        </transition>
    </div>
    </el-collapse-transition>
</template>

<script>
import RowList from './RowList';
import XEUtils from 'xe-utils';
  export default {
  name: 'ReadOnlyList',
  components: {
    RowList
  },
  props: {
    updateList:{  //新清单列表
      type:Array,
      required:false,
      default: () => []
    },
    totalchangeList:{  //累计变更清单列表
      type:Array,
      required:false,
      default: () => []   
    },
    totalmeterageList:{  //累计计量清单列表
      type:Array,
      required:false,
      default: () => []
    },
    totalpayList:{  //累计支付清单列表
      type:Array,
      required:false,
      default: () => []   
    },
    
    joinParent:{   //接入父组件标记，当joinParent标记为true时表示连接到父组件并接受父组件的参数；当joinParent为false时组件独立调试使用。
      // type:Array,
      required:false,
      default:false   
    },
    type:{  //新清单、累计计量、累计支付的类型
      type: String,
      required: false,
      default: "totalchange" //"update":新清单，totalchange:累计变更 “totalmeterage”:累计计量，totalpay:累计支付        
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
      text: '新清单',   //判断清单类型显示文字
      EditTitle: '查看清单',
      tenderList: null,  //全部标段
      dialogVisible:false,//显示隐藏
      isClearActiveFlag: true,
      pageVO: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      options: [{
          value: 'update',
          label: '新清单'
        }, {
          value: 'totalchange',
          label: '累计变更清单'
        }, {
          value: 'totalmeterage',
          label: '累计计量清单'
        }, {
          value: 'totalpay',
          label: '累计支付清单'
        }],
      
     
    } 
  },
  created () {
      this.loading = true;
      this.typeSwitch(this.type );   //判断是哪种清单
  },
  watch: {
      type: function ( newVal,oldVal ) {
          this.loading = true;
          this.typeSwitch(newVal);   //判断是哪种清单
      },
      visibleNew: function ( newVal,oldVal ) {
          if (!newVal) {
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
                if (!this.joinParent) {  //请求新清单列表
                    this.findList(newVal);
                }else{
                    this.list = this.updateList;
                    this.loading = false;
                };
                this.text = '新清单';
                break;
            case 'totalchange':
                if (!this.joinParent) {  //请求累计计量清单列表
                    this.findList(newVal);
                }else{
                    this.list = this.totalchangeList;
                    this.loading = false;
                };
                this.text = '累计变更清单';
                break;
            case 'totalmeterage':
                if (!this.joinParent) {  //请求累计计量清单列表
                    this.findList(newVal);
                }else{
                    this.list = this.totalmeterageList;
                    this.loading = false;
                };
                this.text = '累计计量清单';
                break;
            case 'totalpay':
                if (!this.joinParent) {  //请求累计支付清单列表
                    this.findList(newVal);
                }else{
                    this.list = this.totalpayList;
                    this.loading = false;
                };
                this.text = '累计支付清单';
                break;
        } 
        
    },
    findList ( type ) {
        // 发起网络请求
        var url = '',
        key = '';
        switch(type) {
            case 'update':
                url = '/update/all';
                key = 'updateList';
                break;
            case 'totalchange':
                url = '/totalchange/all';
                key = 'totalchangeList';
                break;
            case 'totalmeterage':
                url = '/totalmeterage/all';
                key = 'totalmeterageList';
                break;
            case 'totalpay':
                url = '/totalpay/all';
                key = 'totalpayList';
                break;
        } 
        if( url === '' ) return false;
        this.$post(url,{ current:this.pageVO.currentPage,pageSize:this.pageVO.pageSize })
            .then((response) => {
            this.list = response.data[key].list;
            //暂定------------------------
            this.pageVO.totalResult = response.data[key].total;
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
      this.pageVO.currentPage = 1;
      this.findList( this.type );
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize;
      this.findList( this.type )
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage;
      this.findList( this.type );
    },
    formatterType (row, column, cellValue, index) {
      let obj = {
        original: '原清单',
        change: '变更清单',
        update: '新清单',
        meterage: '计量清单',
        totalchange: '累计变更清单',
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

.typeOption {
  text-align: left;
  font-size: 13px;
}

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