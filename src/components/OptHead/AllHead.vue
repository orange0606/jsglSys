<template>
<el-row :gutter="0">
  <!-- <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"><div class="grid-content bg-purple"></div></el-col> -->
  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
    <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>已选择的单元格</span>
          <el-button style="float: right; padding: 3px 0" type="text">完成</el-button>
        </div>
        <ul class="text item" >
            <li class="ul_li" style="width:40px">#</li>
            <li class="ul_li">表头类型</li>
            <li class="ul_li">表头名称</li>
            <li class="ul_li">表头标段</li>
            <li class="ul_li">单元格位置</li>
            <li class="ul_li" style="width:60px">操作</li>
        </ul>
        <div class="cardbody">
            <!-- <div v-for="o in 10" :key="o" class="text item">
              {{'列表内容 ' + o }}
            </div> -->
            
            
            <ul class="text item" v-for="(val,i) in 10" :key="i" style="overflow:auto">
                <li class="ul_li" style="width:40px">{{i}}</li>
                <li class="ul_li">change2222222222222</li>
                <li class="ul_li">name222222222</li>
                <li class="ul_li">表标段1</li>
                <li class="ul_li">A{{i}}</li>
                <li class="ul_li" style="width:60px"><i class="el-icon-delete"></i></li>
            </ul>
        </div>
        
    </el-card>
    <el-collapse-transition>
    
    <div >
        <h3 style="text-align:left;margin:15px 0;">请选择相关表头进行选取单元格</h3>

        <elx-editable
        ref="elxEditable"
        class="manual-table2"
        border
        size="mini"
        max-height="400"
        :data.sync="list"
        :edit-config="{trigger: 'manual', mode: 'row'}"
        v-loading="loading" 
        element-loading-text="飞速加载中"
        style="width: 100%">
        <elx-editable-column type="index" align="center" width="50"> </elx-editable-column>
        <!-- <elx-editable-column prop="id" label="ID" width="80"></elx-editable-column> -->
        <elx-editable-column prop="tender.num" width="120" align="center" show-overflow-tooltip label="标段编号" >
        </elx-editable-column>
        <elx-editable-column prop="tender.name" label="标段名称" align="center" show-overflow-tooltip >
        </elx-editable-column>
        <elx-editable-column prop="num" label="表头编号" align="center" show-overflow-tooltip></elx-editable-column>
        <elx-editable-column prop="name" label="表头名称" align="center" show-overflow-tooltip >
            <template slot-scope="scope">
                <el-link :underline="true" style="font-size:12px;" type="success" @click="seeTbale(scope.row)" >{{scope.row.name}}</el-link>
            </template>
        </elx-editable-column>
        
        <elx-editable-column prop="type" label="类别" align="center" show-overflow-tooltip :formatter="formatterType">
        </elx-editable-column>
        <elx-editable-column prop="saveEmployee.name" align="center" width="80" label="创建人" >
        </elx-editable-column>
        <elx-editable-column prop="saveTime" label="创建时间" align="center" show-overflow-tooltip sortable :formatter="formatterDate" ></elx-editable-column>
        <elx-editable-column prop="updateEmployee.name" align="center" width="80" label="更改人" >
        </elx-editable-column>
        <elx-editable-column prop="updateTime" label="更新时间" align="center" show-overflow-tooltip sortable  :formatter="formatterDate"></elx-editable-column>
        
        <elx-editable-column label="操作" align="center" fixed="right" width="70">
            <template v-slot="scope">
                <el-tooltip content="查看" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="success" icon="el-icon-monitor" @click="seeTbale(scope.row)"></el-button>
                </el-tooltip>
            </template>
        </elx-editable-column>
        </elx-editable>

        <!-- 引入建立表头组件 -->
        <!-- <el-dialog title="表头预览" width="95%" top="4vh" :center="false" :destroy-on-close="false" :visible.sync="editShow">
            <headeratt :Form="Form" :visible.sync="editShow" ></headeratt>
        </el-dialog> -->

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
// import headeratt from './NewHeader'
  export default {
  name: 'AllHead',
//   components: {headeratt},
  props: {
    joinParent:{   //接入父组件标记，当joinParent标记为true时表示连接到父组件并接受父组件的参数；当joinParent为false时组件独立调试使用。
      // type:Array,
      required:false,
      default:false   
    },
    tenderId:{    //标段id
      required: false,
      default: null
    },
    type:{   //类型，当joinParent标记为true时表示连接到父组件并接受父组件的参数；
      // type:Array,
      required:false,
      default: null   
    },

    headRowSelected:{ //选定的单元格
      type: Object,
      required: false,
      default: () => ({headRowStr:''}) //记录多个表头，如“-original-27-93-AC10-,-change-29-98-AC10-”。
    },
  },
  data () {
    return {
      loading: false,
      list: [
      ],
      tenderList:[],//全部标段
      editShow:false,//显示隐藏修改表头
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
    tenList (){   //请求所有标段
        this.$post('/tender/getall',{})
          .then((response) => {
          this.tenderList = response.data.tenderList;
        })
    },
    findList () {   //请求所有已建表头数据函数
        let parameter = {page:{current:this.pageVO.currentPage,pageSize:this.pageVO.pageSize}}
        if (!this.joinParent) {
            parameter = {tenderId: this.tenderId, type: this.type, page:{current:this.pageVO.currentPage,pageSize:this.pageVO.pageSize}}
        }
        this.loading = true
        //发起网络请求
        this.$post('/head/getall',parameter)
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
        }else if (type == 'totalchange'){
          key = 'totalchangeHeadRows';
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
        let headRowList = [];
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
        update: '新清单',
        totalchange: '累计变更清单',
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
  }
}
</script>

<style scoped>
.text {
    font-size: 14px;
    display: block;
  }

.item {
    margin-bottom: 13px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;

}
.box-card {
    width: 100%;
    text-align: left;
    /* height: 200px; */

}
.cardbody {
    height: 150px;
    overflow-y:scroll; 

}
.ul_li {
    width: 150px;
    padding: 0 10px;
    overflow: hidden;
    text-align: center;
    font-size: 13px;
    display: inline-block;
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