<template>
<div
    v-loading="loading"
    element-loading-text="正在加速处理数据"
    element-loading-spinner="el-icon-loading"
  >
    <div class="click-table11-oper">
      <el-form :inline="true" :model="form" size="mini" class="demo-form-inline">
        <el-form-item label="清单编号">
          <el-input :disabled="approval.state === 1 || (joinParent && mode==='show')?true:false" v-model="form.num" placeholder="请输入清单编号"></el-input>
        </el-form-item>
        <el-form-item label="清单名称">
          <el-input :disabled="approval.state === 1 || (joinParent && mode==='show')?true:false" v-model="form.name" placeholder="请输入清单名称"></el-input>
        </el-form-item>
        <el-form-item label="表头">
          <el-select :disabled="approval.state === 1 || (joinParent && mode==='show')?true:false" v-model="form.headerId" @change="oneHeader" placeholder="请选择表头">
              <el-option
                v-for="item in form.headerList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="click-table11-oper">
      <el-dialog
      width="85%"
      title="选择清单"
      top="8vh"
      :visible.sync="innerVisible"
      
      append-to-body>
      <div v-if="showList">
          <p style="color: red;font-size: 12px;margin:20px 0 15px 0;text-align:left;">请单击选择你要导入的清单</p>
          <elx-editable
            ref="elxEditable"
            class="click-table2"
            border
            height="300"
            size="small"
            :default-sort="{prop: 'updateTime', order: 'descending'}"
            :data.sync="original"
            @cell-click ="selectOriginal"
            :row-class-name="tableRowClassName"
            :edit-config="{trigger: 'click', mode: 'row'}"
            style="width: 100%">
            <elx-editable-column type="index" width="80" fixed="left" ></elx-editable-column>
            <elx-editable-column prop="originalHead.num" label="原清单表头编号" align="center" show-overflow-tooltip ></elx-editable-column>
            <elx-editable-column prop="originalHead.name" min-width="110" label="表头名称" align="center" show-overflow-tooltip ></elx-editable-column>
            <elx-editable-column prop="process.num" label="审批单编号" align="center" min-width="110" show-overflow-tooltip ></elx-editable-column>
            <elx-editable-column prop="process.name" label="审批单名称" align="center" min-width="110" show-overflow-tooltip ></elx-editable-column>
            <elx-editable-column prop="num" label="原清单编号" min-width="110" align="center" fixed="left" show-overflow-tooltip ></elx-editable-column>     
            <elx-editable-column prop="name" label="原清单名称" min-width="110" align="center" fixed="left" show-overflow-tooltip ></elx-editable-column>
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
            <elx-editable-column prop="saveEmployee.name" width="90" label="创建人" align="center" ></elx-editable-column>
            <elx-editable-column prop="saveTime" label="创建时间" min-width="150" align="center" show-overflow-tooltip sortable :formatter="formatterDate" ></elx-editable-column>
            <elx-editable-column prop="updateEmployee.name" width="90" label="更改人" align="center" ></elx-editable-column>
            <elx-editable-column prop="updateTime" label="更新时间" min-width="150" align="center" show-overflow-tooltip sortable  :formatter="formatterDate"></elx-editable-column>
          </elx-editable>
          <el-pagination
            class="click-table2-pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageVO.currentPage"
            :page-sizes="[5, 10, 15, 20, 50, 100, 150, 200]"
            :page-size="pageVO.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageVO.totalResult">
          </el-pagination>
        </div>

        <!-- 此处引入原清单数据选择组件（最终返回集合，选中的数据列表） -->
        <choice-row v-else :inventory.sync="originalList" :innerVisible.sync="innerVisible" ></Choice-row>

    </el-dialog>
        <div class="click-table11-oper" v-if="joinParent && mode==='show'?false:true" >
          <el-button :disabled="approval.state === 1?true:false" type="primary" size="mini" @click="innerVisible = true;showList =true;" >选择清单</el-button>
          <el-button :disabled="approval.state === 1?true:false" type="warning" size="mini" @click="submitEvent">完成</el-button>
          <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
          <el-button :disabled="approval.state === 1?true:false" type="success" size="mini" @click="insertEvent">新增</el-button>
          <el-button :disabled="approval.state === 1?true:false" type="danger" size="mini" @click="RemoveSelecteds">删除选中</el-button>
          <el-button :disabled="approval.state === 1?true:false" type="info" size="mini" @click="Abandon">放弃更改</el-button>
          <el-button :disabled="approval.state === 1?true:false" type="info" size="mini" @click="$refs.elxEditable1.clear()">清空表格</el-button>
        </div>
    </div>
          <!-- show-summary
      :summary-method="getSummaries" -->
         <!-- :data.sync="list" -->
    <!-- :edit-config="{trigger: 'click', mode: 'cell', render: 'scroll', renderSize: 80, useDefaultValidTip: true}" -->
    <elx-editable
      ref="elxEditable1"
      class="scroll-table4 click-table11"
      border
      height="500"
      :show-header="showHeader"
      v-if="showHeader"
      :span-method="arraySpanMethod"
      @cell-click ="cell_click"
      :cell-style ="cell_select"
      show-summary
      size="mini"
      :summary-method="getSummaries"
      :edit-config="{render: 'scroll', renderSize: 80}"
      style="width: 100%">
      <elx-editable-column type="selection" align="center" width="55"></elx-editable-column>
     
      <elx-editable-column type="index" width="60" align="center" >
        <template v-slot:header>
          <i class="el-icon-setting" @click="dialogVisible = true"></i>
        </template>
      </elx-editable-column>
      <!-- 此处使用多级表头嵌套组件 -->
      <my-column v-for="(item,index) in col" :key="index" :col="item" :Formula="formula" type="change" ></my-column>
    </elx-editable>
    <p style="color: red;font-size: 12px;margin:10px 0 10px 0;text-align:left;">注意：淡黄色区为编辑区请输入相关数字。</p>
    <br>
  </div>
</template>

<script>
import MyColumn from './MyColumn';
import ChoiceRow from '../MultiplexCom/ChoiceRow';
import XEUtils from 'xe-utils';
import Sortable from 'sortablejs';

export default {
  name: 'NewChange',
  components: {
    MyColumn,
    ChoiceRow
  },
  props: {
    uplist:{  //查看和修改清单数据
      type: Object,
    },
    approval:{
      type: Object,
    },
    mode:{  //子组件的展示模式
      type: String, 
    },
    tender:{  //标段数据
      type: Object,
    },
    changeList:{  //父组件的清单列表
      type: Array,
    },
    joinParent:{   //接入父组件标记，当joinParent标记为true时表示连接到父组件并接受父组件的参数；当joinParent为false时组件独立调试使用。
    },
    refresh:{ //显示此组件的变量
    }
  },
  data () {
    return {
      form:{  //选择表头输入清单名称与编号
        name:'',
        num:'',
        headerId:'',
        headerList:[],//表头列表
      },
      innerVisible: false,//弹窗显示相关联原清单的两个表格
      showList: true,//显示可导入的相关清单列表表格（为fasle显示清单数据选择组件）
      original:[],//所有关联的原清单列表
      originalList: null,//原清单内容(传给子组件，然后返回回来数据)
      pageVO: { //所有关联的原清单列表数据分页
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      showHeader:true,  //是否显示表头以及表格强制渲染
      changeHead:null, //保存表头信息
      hd:[],  //表格单元格用来合并的所有列数数据（列名，对象的属性名集合）
      startTime:null,
      loading: false,
      dialogVisible: true,
      lastHeader: [], //最后一层表头数据（用来单元格点击编辑判断）
      editRow:null, //单元格编辑的存储上一个已点击单元格数据
      formula:{}, //存储表头的公式数据
      row:null,//公式字符串转代码的全局变量
      col: [],//已对PackHeader再次组装的多级表头数据.
      PackHeader:[],//已组装的表头数据
      list: [
      ], //表格数据
      pendingRemoveList:[],
      RowDelList: [],//记录被删除有id的单元格
    }
  },

 watch: {
    originalList: function(newVal,oldVal){  //ChoiceRow子组件返回来的数据
        //此处可进行判断，然后进行清单导入
        if (Array.isArray(newVal)) {  //判断返回的是不是一个数组
          //  console.log('最终用户选择的需要引入的清单数据在这里返回啦沙雕');
          //  console.log(newVal);
           this.importfxx(newVal);//这里调用表格处理函数
          //这里进行处理
        }
    },
    uplist: function(newVal,oldVal){  //子组件返回来的数据
        //此处可进行判断，然后进行清单导入
        this.upif( newVal );//此处调用父组件传来的清单数据判断处理函数
    }
  },
  computed: {
      
  },
  created () {
    this.allHeader( this.tender.id );//调用请求一个标段的所有变更表头
    this.upif( this.uplist );//此处调用父组件传来的清单数据判断处理函数
  },
  mounted () {

  },
  beforeDestroy () {
      this.list.length = this.hd.length = this.col.length = this.PackHeader.length = 0;
  },
  methods: {
     upif ( newVal ) {   //处理父组件传来的值
        this.allHeader(this.tender.id); //请求该标段的全部计量清单表头列表
        if (newVal && (newVal.id || newVal.saveTime) ) {  //此处为预览修改
            console.log('进来预览修改了')
            this.loading = true;
            this.startTime = Date.now(); 
            this.form.name = newVal.name;
            this.form.num = newVal.num;
            this.form.headerId = newVal.changeHead.id;
            console.log('this.mode')
            console.log(this.mode )
            switch(this.mode) {
                case 'new': //此处为新建模式处理
                    return this.updates(newVal);
                    break;
                case 'show': //此处为显示模式处理
                    return this.OneChange(newVal.id);
                    break;
                case 'alter': //此处为修改模式处理
                    if (newVal.changeHead && newVal.changeHead.tChangeHeadRows && newVal.changeRowList) {
                        return this.updates(newVal);
                    }else if (newVal.id){
                        return this.OneChange(newVal.id);
                    }
                    break;
            } 
            return false;
        }else if(newVal && (!newVal.id && !newVal.saveTime)){ //此处为新建
            console.log('此处为新建')
            this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
            this.form.name = this.form.num = this.form.headerId = this.headerList =null;
            this.$nextTick(() => {
                this.$refs.elxEditable1.reload([]);
            });
            return false;
        }
        console.log('啥都没进来')
    },
    updates (row) {  //新建模式与修改模式的预览修改数据呈现函数
          console.log('有进来这里吗预览修改数据呈现函数');
          this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;

          try {
              var headsArr = this.$excel.Package(row.changeHead.tChangeHeadRows,row.changeHead.refCol,row.changeHead.refRow);
              this.PackHeader = XEUtils.clone(headsArr, true); //深拷贝
              
              this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
              //调用表格公式解析 存储
              this.formula = this.$excel.FormulaAnaly([...this.col]);
              //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
              this.lastHeader = this.$excel.BikoFoArr([...this.col]);
                
          } catch (error) {
              this.$message({
                type: 'info',
                message: '发生错误！ 当前为子组件 '+this.mode+' 模式  应该是表头内容出错'+error
            });
              this.loading = false;
          }

          this.changeHead = { //保存表头信息
              id: row.changeHead.id,
              name:row.changeHead.name,
              num: row.changeHead.num
          }

          if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
              this.changeHead.refCol = row.changeHead.refCol;
              this.changeHead.refRow = row.changeHead.refRow;
              this.changeHead.tChangeHeadRows = row.changeHead.tChangeHeadRows;
          }
          this.allRelationOriginal( this.changeHead.id );//根据一个变更表头id请求原清单列表
          try {
              var arr = this.$excel.ListAssemble(row.changeRowList); //组装清单表格数据
              this.list = [...arr];
              this.hd = Object.keys(this.lastHeader); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
              for (let index = this.list.length -1; index >=0; index--) { //给行数据加上索引
                  this.list[index]['seq'] = index;
              }
              this.findList(); //调用滚动渲染数据
          } catch (error) {
              this.$message({
                  type: 'info',
                  message: '发生错误！ 当前为子组件 '+this.mode+'  模式  应该是清单内容出错'+error
              });
                console.log(error)
                this.loading = false;
          }
         
    },
    allHeader (tenderId) {  //请求该标段的全部变更清单表头列表
        this.$post('/head/allchange',{tenderId})
        .then((response) => {
          this.form.headerList = response.data.changeHeadList;
          // console.log('this.form.headerList')
          // console.log(this.form.headerList)
        }).catch(e => {
            this.$message({
              type: 'info',
              message: '发生错误！'
            });
        });
    },
    oneHeader (id) {  //请求单个表头 表头id  表头类型
       this.$post('/head/getone',{id,type:'change'})
        .then((response) => {
          var data = response.data.onehead,
          headsArr = this.$excel.Package(data['tChangeHeadRows'],data.refCol,data.refRow);
          this.PackHeader = XEUtils.clone(headsArr, true); //深拷贝
          this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
          //调用表格公式解析 存储
          this.formula = this.$excel.FormulaAnaly([...this.col]);

           //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
          this.lastHeader = this.$excel.BikoFoArr([...this.col]);

          this.changeHead = { //保存表头信息
              id: data.id,
              name:data.name,
              num: data.num
          }
          if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
              this.changeHead.refCol = data.refCol;
              this.changeHead.refRow = data.refRow;
              this.changeHead.tChangeHeadRows = data.tChangeHeadRows;
          }
          this.showHeader = false;
          this.$nextTick(() => {  //强制重新渲染
              this.showHeader = true;
          })
          this.loading = false;
          this.list.length = this.hd.length = 0;
          //调用表格公式解析 存储
          this.formula = this.$excel.FormulaAnaly([...this.col]);
          this.allRelationOriginal(data.id); //3.35.	读取一个标段的对应变更表头id的原清单列表
        
      })
    },
     OneChange (id) { //变更清单id
        //此处请求一个审批单的一个变更清单
        this.$post('/change/row/getone',{ id })
            .then((response) => {
            console.log('response--------')
            console.log(response)
            
            var data = response.data.change;
            if (!data && !data.changeRowList) return this.loading = false;
            var headsArr = this.$excel.Package(data['changeHead'].tChangeHeadRows,data['changeHead'].refCol,data['changeHead'].refRow);
            this.PackHeader = [...headsArr];
            this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
            //调用表格公式解析 存储
            this.formula = this.$excel.FormulaAnaly([...this.col]);
            //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
            this.lastHeader = this.$excel.BikoFoArr([...this.col]);
            this.changeHead = { //保存表头信息
                name: data.changeHead.name,
                num: data.changeHead.num
            }
            this.allRelationOriginal( data.changeHead.id );//根据一个变更表头id请求原清单列表

            if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
                this.changeHead.refCol = data.changeHead.refCol;
                this.changeHead.refRow = data.changeHead.refRow;
                this.changeHead.tChangeHeadRows = data.changeHead.tChangeHeadRows;
            }
            this.loading = false;
            this.list.length = this.hd.length = 0;

            var arr = this.$excel.ListAssemble(data.changeRowList); //组装清单表格数据
            this.list = [...arr];
            this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
            for (let index = this.list.length -1; index >=0; index--) { //给行数据加上索引
                this.list[index]['seq'] = index;
            }
            this.findList(); //调用滚动渲染数据
            
        }).catch(e => {
            this.loading = false;
            console.log(e)
            this.$message({
                type: 'info',
                message: '发生错误！'+e
            });
        })
    },
    allRelationOriginal (id) {  //3.38.	读取原清单列表（根据变更表头id）
        this.$post('/original/byChangeHeadId',{ changeHeadId:id, current:this.pageVO.currentPage,pageSize:this.pageVO.pageSize})
        .then((response) => {
          console.log('/original/byChangeHeadId')
          console.log(response)
          this.original = response.data.originalList.list;
      }).catch(e => {
          this.$message({
            type: 'info',
            message: '发生错误！'
          });
      });
    },
    oneOriginal (id) {  //请求选择可导入原清单内容
        this.$post('/original/row/getone',{ id })
        .then((response) => {
          this.originalList = response.data.original;
      }).catch(e => {
          this.$message({
            type: 'info',
            message: '发生错误！'
          });
      });
    },
    selectOriginal (row, column, cell, event) { //原清单列表数据表格单击事件
        // console.log('row, column, cell, event22')
        // console.log(row, column, cell, event);
        let id = row.id;
        this.oneOriginal(id); //调用请求清单
        //关闭显示关联清单列表页面
        this.showList = false;
    },
    handleSizeChange (pageSize) { 
      this.pageVO.pageSize = pageSize;
      this.allRelationOriginal();
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.allRelationOriginal();
    },
    formatterDate (row, column, cellValue, index) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    formatterType (row, column, cellValue, index) {
      var obj = {
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
    tableRowClassName ({ row, rowIndex }) {
      if (this.pendingRemoveList.some(item => item === row)) {
        return 'delete-row'
      }
      return ''
    },
    
    consoles () {
        let rest = this.$refs.elxEditable1.getRecords();//获取表格的全部数据
        // console.log('检验一下数据对不对 rest list')
        // console.log(rest);
        // console.log(this.list);
    },

    importfxx(data) { //新建导入数据
        // this.loading = true;
        this.startTime = Date.now(); 
        var list = this.$refs.elxEditable1.getRecords(),//获取表格的全部数据;
        listlen = list.length,
        rest = [],
        patt1=/[A-Z+]*/g,
        sumArr = this.lastHeader; //截取获取表格实际对应所有列最后一层的表头列 object
        this.hd = Object.keys(sumArr); //用来所需要的所有列(obj)（属性）名
        listlen === 0? this.list = []: listlen;
        // 先生成一个完整表格数据

        for (let index = data.length -1; index >= 0; index--) {
            rest[index] = {};
            rest[index]['seq'] = index+listlen;
            for (let i = this.hd.length -1; i >= 0; i--) {
                rest[index][this.hd[i]] = {attribute: null,colNum: this.hd[i],edit: "N",formula:null,td:'',tdColspan: 1,tdRowspan: 1,trNum:listlen+index+1,upload: 1 };
            }
        }
        console.log('打印一下1rest1---')
        console.log(rest)
        //现在进行遍历属性把原清单数据加入进去
        for (let c = this.hd.length -1; c >= 0; c--) {
            var row = sumArr[this.hd[c]],
            str = row.attributeValue;
            if (row.attribute && row.attribute === "original" && row.attributeValue && row.attributeValue !="") {
                let colName = str.match(patt1)[0];
                for (let a = rest.length -1; a >= 0 ; a--) {
                    rest[a][row.colNum] = {...data[a][colName]};
                    rest[a][row.colNum].colNum = row.colNum;
                    rest[a][row.colNum].trNum = rest[a]['seq']+1;
                    rest[a][row.colNum].originalRowId = rest[a][row.colNum].id;
                    rest[a][row.colNum].tdColspan = rest[a][row.colNum].tdRowspan = 1;
                    delete rest[a][row.colNum].id;
                }
            }
        }
        console.log('打印一下rest2---')
        console.log(rest)
        try {  //把数据载入表格
            // this.findList(); //调用滚动渲染数据
            this.$nextTick(() => {
                for (let index = 0; index < rest.length; index++) {
                    this.$refs.elxEditable1.insertAt(rest[index], -1); 
                }
            })
            this.list = this.$refs.elxEditable1.getRecords();
            this.$excel.Formula(this, this.list, this.formula);  //调用公式计算
            data = null; //内存释放
        } catch (e) {
            console.log('出错了')
            console.log(e)
            data.length = 0;
            this.loading =false;
            this.$message({ message: `遇到问题了呀,清单导入失败,请重试。${e}`, type: 'error', duration: 6000, showClose: true })
        }

    },
    cell_click(row, column, cell, event){ //单元格点击编辑事件
        if(this.approval.state === 1 && this.uplist.id )return false; //审批单已通过，并且不是新建清单的话不许做修改。
        this.editRow !== null && this.editRow ? this.editRow.edit = "N" :this.editRow; //清除上一个单元格编辑状态
        if (column.property) {
            // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）

            var str = column.property,
            colName = str.substr(0,str.indexOf(".td")),
            patt1=/[A-Z+]*/g,
            sumArr = this.lastHeader; //截取获取表格实际对应所有列最后一层的表头列 object
            //判断是否哪种属性类型允许单元格编辑

            if (this.lastHeader[colName].attribute !== 'fluctuate') {
                 if (!row[colName].attribute) return false;
                if (row[colName].attribute !=='add') return false;
            };

            //现在进行遍历属性把原数量，禁止修改
            for (let c = this.hd.length -1; c >= 0; c--) {
                var hederRow = sumArr[this.hd[c]],
                Atr = hederRow.attributeValue;
                if (hederRow.attribute && hederRow.attribute === "fluctuate" && hederRow.attributeValue && hederRow.attributeValue !="") {
                    let col = Atr.match(patt1)[0];
                    if (col === colName)  return false;
                }
            }

            this.editRow = row[colName];
            row[colName].edit = "Y";  //Y为编辑模式N为只读状态     
        }  
    },
    cell_select ({row, column, rowIndex, columnIndex}){ //单元格样式
        if (column.property) {
            // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
            var str = column.property,
            colName = str.substr(0,str.indexOf(".td"));

            //判断是否哪种属性类型允许单元格编辑
            if (this.lastHeader[colName].attribute !== 'fluctuate') {
                if (row[colName].attribute && row[colName].attribute==='add') {
                    return {'background':'#99ff005c'} //新增一行的颜色
                }
                return {}
            }
            return {'background':'#FFFFE0'} //编辑区颜色
        }  
        return {'background':'#FFFFFF'};
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {   //单元格合并处理
        if (columnIndex >1) {  //带选择框的情况
            if (row[this.hd[columnIndex-2]]) {
                return [row[this.hd[columnIndex-2]].tdRowspan, row[this.hd[columnIndex-2]].tdColspan]
            }
        }
        return [1, 1]
    }, 
    findList () { //表格滚动渲染函数
        this.loading = true;
        this.$nextTick(() => {
        this.$refs.elxEditable1.reload([])
        this.$refs.elxEditable1.reload(this.list);
        this.loading = false;
        this.$message({ message: `成功导入 ${this.list.length} 条数据 耗时 ${Date.now() - this.startTime} ms `, type: 'success', duration: 6000, showClose: true })

        })
    },
    getSummaries (param) {  //合计
        if (!this.$refs.elxEditable1) return [];
        let list = this.$refs.elxEditable1.getRecords();//获取表格的全部数据;
        if (this.PackHeader.length ===0 || list.length ===0) return [];
        return this.$excel.getSummaries(this.PackHeader, list, param);//调用合计尾行。
    },
    
    insertEvent () {
      this.lastHeader = this.$excel.BikoFoArr([...this.col]);
      this.hd = Object.keys(this.lastHeader); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
      if (!this.hd.length || this.hd.length===0) return false;
      // console.log('进来了吗')
      var rest = this.$refs.elxEditable1.getRecords(),//获取表格的全部数据;
      restLen = rest.length,
      NewRow = {},
      patt1=/[A-Z+]*/g,
      sumArr = this.lastHeader; //截取获取表格实际对应所有列最后一层的表头列 object
      
      for (let index = this.hd.length -1; index >= 0; index--) {
          NewRow['seq'] = restLen;
          NewRow[this.hd[index]]= {attribute: 'add',colNum: this.hd[index],edit: "N",formula:null,td: null, tdColspan: 1,tdRowspan: 1,trNum:restLen+1,upload: 1 };
      }

      //现在进行遍历属性把原清单数据加入进去
        for (let c = this.hd.length -1; c >= 0; c--) {
            var row = sumArr[this.hd[c]],
            str = row.attributeValue;
            if (row.attribute && row.attribute === "fluctuate" && row.attributeValue && row.attributeValue !="") {
                let colName = str.match(patt1)[0];
                NewRow[colName].td = 0;
            }
        }
      console.log('打印一下NewRow 新增的一行')
      console.log(NewRow);
      this.$refs.elxEditable1.insertAt(NewRow, -1)
        // this.$refs.elxEditable1.setActiveCell(NewRow);
   
      // this.$refs.elxEditable1.clearActive();
      // 滚动到第一行：
      // this.$refs.elxEditable1.bodyWrapper.scrollTop =0;
      // 滚动到最后一行：
      // console.log(this.$refs.elxEditable1)
      // console.log('this.$refs.elxEditable1..scrollTop1')
      // console.log(this.$refs.elxEditable1.bodyWrappe)
  
      // console.log('this.$refs.elxEditable1.scrollTop2')
      // console.log(this.$refs.elxEditable1.bodyWrappe)
      // this.$refs.elxEditable1.bodyWrapper.scrollTop =this.$refs.elxEditable1.bodyWrapper.scrollHeight;
    },
    Abandon () {  //放弃更改
        // this.$refs.elxEditable1.revert();
        this.$nextTick(() => {
            this.$refs.elxEditable1.reload([]);
            this.$refs.elxEditable1.reload(this.list);
            this.RowDelList = []; //放弃更改后  删除数组清空
        })

    },
    RemoveSelecteds () {  //删除选中
      this.hd = Object.keys(this.lastHeader);
      var selection = this.$refs.elxEditable1.getSelecteds(),
      seleLen = selection.length;
      // console.log('seleLen')
      // console.log(selection)
      if (seleLen && seleLen > 0) {
          this.$refs.elxEditable1.removeSelecteds();
          var number = selection[0]['seq'];; //表格列表的下标
          this.Rowsort( number );  //调用表格重新排序函数

          for (let index = seleLen -1; index >= 0; index--) { //解构已删除的单元格，将有id的单元格放入删除集合中
              for (let a = this.hd.length-1; a >= 0; a--) {
                  var item = selection[index][this.hd[a]];
                  if (item['id']) this.RowDelList.push(item);
              }
          }
      }
      console.log('获取已选中数据'+seleLen,'----',selection)
      console.log(this.RowDelList)
    },
    Rowsort( sub ) { //删除清单表格单元格行内的时候对清单表格被影响行列号的有id的作修改标记与重新排列
        let list = this.$refs.elxEditable1.getRecords();//获取表格的全部数据;
        try {
            for (let index = list.length -1; index >= 0; index--) {
                if (sub > index) break;
                list[index]['seq']=index;  //更新索引
                for (let a = this.hd.length -1; a >= 0; a--) {
                    var item = list[index][this.hd[a]];
                    item.trNum = index+1;
                    // console.log('item.trNum--'+item.trNum)
                    if (item['id']) list[index]['alter'] = 'Y';   
                }
            }
            this.$nextTick(() => {
                this.$refs.elxEditable1.reload([]);
                this.$refs.elxEditable1.reload(list);
            })
        } catch (error) {
            console.log('删除后重新排序出了问题'+error);
            return this.$message({ type: 'success',message: '删除后重新排序出了问题，请联系相关技术人员!' });
        }

    },
  submitEvent () {
      this.$refs.elxEditable1.validate(valid => {
        if (valid) {
            let list = this.$refs.elxEditable1.getRecords();//获取表格的全部数据;
            if (list.length === 0) return this.$message({ type: 'success',message: '请先导入数据!' });
            //解构数据进行提交
            this.loading = true;
            var header = Object.keys(this.PackHeader[0]), //用来所需要的所有列(obj)（属性）名
            changeHead = this.changeHead, //表头数据
            changeRowList = [], //清单内容
            changeRowAddList = [],  //增
            changeRowDelList = [], //删
            changeRowAltList = [];  //改

            //查询上一次修改有无这个集合  ，有的话合并两个数组
            if (this.uplist['changeRowDelList'] && this.uplist['changeRowDelList'].length >0) {
                  console.log('已经开始二次修改删除操作 this.RowDelList,   this.uplist[changeRowDelList]----------')
                  console.log(this.RowDelList,this.uplist['changeRowDelList'])
                  changeRowDelList = this.RowDelList.concat(this.uplist['changeRowDelList']);  //删
             }else{
                  changeRowDelList = this.RowDelList;
             }

          
            try {
                for (let index = list.length -1; index >=0 ; index--) {
                    for (let i = header.length -1; i >=0; i--) {
                        var listRows = list[index][header[i]];
                        if (listRows && listRows.colNum) {
                            // delete listRows.edit;
                            listRows['formula'] = '';
                            listRows['trNum'] = index+1;                  
                            // listRows['attribute'] = '';                  
                            listRows['upload'] = 1;    
                            if (!listRows['id']) {  //无id则视为新增，新增到changeRowAddList
                                changeRowAddList.push(listRows);
                            }else if ( listRows['id'] && (list[index]['alter'] || listRows['alter'])) {  //有id 与 alter 视为已修改过的数据 新增到changeRowAltList+
                                listRows['alter'] = "Y";
                                changeRowAltList.push(listRows);
                            }
                            changeRowList.push(listRows);
                        }
                    }
                }
            } catch (error) {
                this.loading = false;
                console.log('保存数据遇到错误  :'+error)
                return this.$message({ type: 'success',message: '存储失败，请联系相关技术人员!' });
            }
            var obj = { //新建清单的时候需要用
                changeHeadId: this.form.headerId,    //清单表头id
                processId: this.approval.id,         //审批单流程id
                sysOrder: '',                   //系统序号  预留，暂不使用
                sysNum: '',                    //系统编号  预留，暂不使用
                name: this.form.name,               //清单名称
                num: this.form.num,                 //清单编号
                tenderId: this.tender.id,           //标段id
                type: 'change',                 //清单类别为”change”
                changeRowAddList,  //增
                changeRowDelList,  //删
                changeRowAltList,  //改
                enter:list.length>0?1:0,
                tender:this.tender,
                saveTime:new Date(),
                saveEmployee:{name:this.$store.state.username}
            };
            if (this.mode !=='show') {
                obj['changeHead'] = changeHead; //表头数据
                obj['changeRowList'] = changeRowList; //清单内容
            }
            console.log('打印一下即将提交的参数obj')
            console.log(obj)
            //此处做个判断，判断是新建还是修改。
            if (this.joinParent) {  //接入父组件的情况
                if (this.uplist && !this.uplist.id && !this.uplist.saveTime ) {  //当前属于新建清单====
                    switch(this.mode) {
                        case 'show':  //为show模式
                            this.loading = false;
                            return this.$message({ type: 'success',message: '当前为show模式，在joinParent=true 时 不支持新建清单！' })
                            break;
                        default:  //为 alter模式与 new模式    
                            this.changeList.push(obj);
                            this.$message({ message: `已为你保存 ${changeRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                            return this.saveShow();                      
                    } 
                }else if (this.uplist && (this.uplist.id || this.uplist.saveTime)) {  //当前属于修改清单====
                    switch(this.mode) {
                        case 'show':  //为 show模式
                            this.loading = false;
                            return this.$message({ type: 'success',message: '当前为show模式，在joinParent=true 时 不支持更改清单！' })
                            break;
                        default:  //为 alter模式与 new模式 
                            for (let index = this.changeList.length -1; index >=0; index--) {
                                var ListRow = this.changeList[index];
                                if((ListRow.saveTime === this.uplist.saveTime) || (ListRow.id === this.uplist.id)){
                                    ListRow.changeHeadId = this.form.headerId;
                                    ListRow.changeRowList = changeRowList;
                                    ListRow.changeRowAddList = changeRowAddList;  //增
                                    ListRow.changeRowDelList = changeRowDelList;  //删
                                    ListRow.changeRowAltList = changeRowAltList;  //改
                                    ListRow.name = this.form.name;
                                    ListRow.num = this.form.num;
                                    ListRow.changeHead = changeHead;
                                    ListRow.updateTime = new Date();
                                     if (ListRow.id && ListRow.id === this.uplist.id && this.mode === 'alter') { //此时要把修改后的有id的清单放入修改清单列表
                                        ListRow.alter ='Y'; //标记为修改
                                    }
                                    this.$message({ message: `已为你修改---保存 ${changeRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                                    return this.saveShow();
                                }
                                
                            }
                            
                    } //switch的 }
                }
                
            }else{    //不接入父组件的情况
                  var parameter = {
                      changeAddList: [], //增清单
                      changeDelList: [],   //删清单
                      changeAltList: []  //改清单
                  } 
                  if (this.uplist && !this.uplist.id ) {  //当前为新建清单
                      switch(this.mode) {
                          case 'show':  //为show模式
                              parameter.changeAddList.push(obj);
                              this.saveOneList( parameter ); //调用网络保存函数
                              break;
                          default:  //为 alter模式与 new模式    
                              this.loading = false;
                              return this.$message({ type: 'success',message: '当前为'+this.mode+'模式，在joinParent=false 时 不支持新建清单！' })
                                                 
                      } 
                  }else{  //当前为修改清单
                      switch(this.mode) {
                          case 'show':  //为show模式
                              obj.id = this.uplist.id;
                              parameter.changeAltList.push(obj);
                              this.saveOneList( parameter ); //调用网络保存函数
                              break;
                          default:  //为 alter模式与 new模式    
                              this.loading = false;
                              return this.$message({ type: 'success',message: '当前为'+this.mode+'模式，在joinParent=false 时 不支持修改清单！' })
                                                 
                      } 
                  }

            }
        }
      })
    },
    saveShow () {
        let succre = false;
        this.$emit("update:refresh", succre)  //关闭新建变更清单子组件
        this.loading = false;
        // this.list.length = this.hd.length = 0;
        this.showHeader = false;
        this.$nextTick(() => {  //强制重新渲染
            this.showHeader = true;
        })
    },
    saveOneList ( obj ) {  //保存单个清单 仅show模式 且 this.joinParent=false 时可用
        this.$post('/change/update',obj )
            .then((response) => {   
            this.$message({ message: `已为你保存数据 `, type: 'success', duration: 3000, showClose: true })
            return this.saveShow();   
        }).catch(e => {
            this.loading = false;
            this.$message({
                type: 'info',
                message: '保存清单发生错误！'+e
            });
        })
    },
    exportCsvEvent () {
      this.$refs.elxEditable1.exportCsv();
    },


  }
}
</script>

<style scope>
.click-table11-oper {
  height: 30px;
  margin-bottom: 5px;
  /* border: 1px solid pink; */
  text-align: left;
  position: relative;
}
.click-table11-oper .right {
  position: absolute;
}
.click-table11-pagination {
  margin-top: 18px;
  text-align: right;
}
.click-table11 .drag-btn {
  font-size: 16px;
  cursor: move;
}
.click-table11.elx-editable .elx-editable-row.new-insert,
.click-table11.elx-editable .elx-editable-row.new-insert:hover>td {
  background-color: #f0f9eb;
}
.click-table11 .el-table__body tr.hover-row>td,
.click-table11 .el-table__body .el-table__row:hover>td {
  background-color: inherit;
}
.click-table11.elx-editable .elx-editable-row.sortable-ghost,
.click-table11.elx-editable .elx-editable-row.sortable-chosen {
  background-color: #fff6b2;
}
.scroll-table4-oper {
  margin-bottom: 18px;
}
.scroll-table4.elx-editable .elx-editable-row.new-insert,
.scroll-table4.elx-editable .elx-editable-row.new-insert:hover>td {
  background-color: #f0f9eb;
}
</style>