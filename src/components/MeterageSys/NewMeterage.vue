
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
                :disabled="item.limit?true:false"
                :label="item.name"
                :value="item.id">
              </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="click-table11-oper">
      <el-dialog
      width="95%"
      title="选择清单"
      top="4vh"
      :visible.sync="innerVisible"
      append-to-body>
      <div v-if="showList">
          <p style="color: red;font-size: 12px;margin:5px 0 10px 0;text-align:left;">请单击选择你要导入的清单</p>
          <el-table
            border
            :height="UpHeight"
            size="small"
            :data.sync="update"
            @cell-click ="selectupdate"
            style="width: 100%">
            <el-table-column type="index" width="80" fixed="left" ></el-table-column>
            <el-table-column prop="updateHead.num" label="新清单表头编号" align="center" show-overflow-tooltip ></el-table-column>
            <el-table-column prop="updateHead.name" min-width="110" label="表头名称" align="center" show-overflow-tooltip ></el-table-column>
            <el-table-column prop="process.num" label="审批单编号" align="center" min-width="110" show-overflow-tooltip ></el-table-column>
            <el-table-column prop="process.name" label="审批单名称" align="center" min-width="110" show-overflow-tooltip ></el-table-column>
            <el-table-column prop="num" label="新清单编号" min-width="110" align="center" fixed="left" show-overflow-tooltip ></el-table-column>     
            <el-table-column prop="name" label="新清单名称" min-width="110" align="center" fixed="left" show-overflow-tooltip >
                <template slot-scope="scope">
                    <el-link :underline="true" style="font-size:12px;" type="success" >{{scope.row.name}}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="tender.num" label="标段编号" min-width="110" align="center" show-overflow-tooltip ></el-table-column>
            <el-table-column prop="tender.name" label="标段名称"  min-width="110" align="center" show-overflow-tooltip ></el-table-column>
            <el-table-column prop="type" label="审批单类别" min-width="110" align="center" show-overflow-tooltip :formatter="formatterType" ></el-table-column>
            <el-table-column prop="enter" label="录入状态" align="center" show-overflow-tooltip >
              <template slot-scope="scope">
                <!-- 1已录入 0未录入 其他出错-->
                <i v-if="scope.row.enter ==0" style="color:orange;width:20px;" class="el-icon-circle-close"></i>
                <i v-if="scope.row.enter ==1" style="color:#67c23a;width:20px;" class="el-icon-circle-check"></i>
                <i v-if="scope.row.enter ==2" style="color:red;width:20px;" class="el-icon-warning-outline"></i>
              </template>
            </el-table-column>
            <el-table-column prop="saveEmployee.name" width="90" label="创建人" align="center" ></el-table-column>
            <el-table-column prop="saveTime" label="创建时间" min-width="150" align="center" show-overflow-tooltip sortable :formatter="formatterDate" ></el-table-column>
            <el-table-column prop="updateEmployee.name" width="90" label="更改人" align="center" ></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" min-width="150" align="center" show-overflow-tooltip sortable  :formatter="formatterDate"></el-table-column>
          </el-table>
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

        <!-- 此处引入新清单数据选择组件（最终返回集合，选中的数据列表） -->
        <choice-row v-else :inventory.sync="updateList" :innerVisible.sync="innerVisible" ></Choice-row>

    </el-dialog>
    <div class="click-table11-oper" v-if="joinParent && mode==='show'?false:true">
        <el-button :disabled="approval.state === 1?true:false" type="primary" size="mini" @click="OneToTalmeterage" >选择清单</el-button>
        <el-button :disabled="approval.state === 1?true:false" type="warning" size="mini" @click="submitEvent">完成</el-button>
        <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
        <!-- <el-button :disabled="approval.state === 1?true:false" type="success" size="mini" @click="insertEvent">新增</el-button> -->
        <el-button :disabled="approval.state === 1?true:false" type="danger" size="mini" @click="RemoveSelecteds">删除选中</el-button>
        <el-button :disabled="approval.state === 1?true:false" type="info" size="mini" @click="Abandon">放弃更改</el-button>
        <!-- <el-button :disabled="approval.state === 1?true:false" type="info" size="mini" @click="$refs.elxEditable1.clear()">清空表格</el-button> -->
        <el-button :disabled="approval.state === 1?true:false" type="info" size="mini" @click="consoles">打印一下</el-button>
      </div>
      
    </div>
          <!-- show-summary
      :summary-method="getSummaries" -->
         <!-- :data.sync="list" -->
           <!-- :cell-style="cellStyle":span-method="arraySpanMethod" -->
    <!-- :edit-config="{trigger: 'click', mode: 'cell', render: 'scroll', renderSize: 80, useDefaultValidTip: true}" -->
    <div :style="{ height: Height+'px' }">
        <elx-editable
          ref="elxEditable1"
          class="scroll-table4 click-table11"
          border
          height="100%"
          size="mini"
          :show-header="showHeader" 
          v-if="showHeader"
          @cell-click ="cell_click"
          :cell-style ="cell_select"
          show-summary
          :summary-method="getSummaries"
          :edit-config="{render: 'scroll', renderSize: 110}">
          <elx-editable-column type="selection" align="center" width="45" :key="$excel.randomkey()" ></elx-editable-column>
          <elx-editable-column type="index" width="60" align="center" :key="$excel.randomkey()" ></elx-editable-column>
          <!-- 此处使用多级表头嵌套组件 -->
          <my-column v-for="(item,index) in col" :key="index" :col="item" :Formula="formula" type="meterage" :lastHeader="lastHeader" :hd="hd" ></my-column>
        </elx-editable>
        <p style="color: red;font-size: 12px;margin:18px 0 0px 0;text-align:left;">注意：淡黄色区为编辑区请输入相关数字。</p>
      </div>
  </div>
</template>

<script>
import MyColumn from './MyColumn';
import ChoiceRow from '../MultiplexCom/ChoiceRow';
import XEUtils from 'xe-utils';
export default {
  name: 'NewMeterage',
  components: {
    MyColumn,
    ChoiceRow
  },
  props: {
    uplist:{  //查看和修改清单数据
      type: Object,
    },
    meterageList: { //所有计量清单列表
      type: Array,
    },
    mode:{  //子组件的展示模式
      type: String, 
    },
    joinParent:{   //接入父组件标记，当joinParent标记为true时表示连接到父组件并接受父组件的参数；当joinParent为false时组件独立调试使用。   
    },
    approval:{
      type: Object,
    },
    tender:{
      type: Object,
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
      innerVisible: false,//弹窗显示相对应新清单的两个表格
      showList: true,//显示可导入的相关清单列表表格（为fasle显示清单数据选择组件）
      update:[],//所有对应的新清单列表
      updateList: null,//新清单内容(传给子组件，然后返回回来数据)
      pageVO: { //所有对应的新清单列表数据分页
          currentPage: 1,
          pageSize: 10,
          totalResult: 0
      },
      showHeader:true,  //是否显示表头以及表格强制渲染
      meterageHead:null, //保存表头信息
      hd:[],  //表格单元格用来合并的所有列数数据（列名，对象的属性名集合）
      startTime:null,
      loading: false,
      dialogVisible: true,
      editRow:null, //单元格编辑的存储上一个已点击单元格数据
      lastHeader: [], //最后一层表头数据（用来单元格点击编辑判断）
      formula:{}, //存储表头的公式数据
      col: [],//已对PackHeader再次组装的多级表头数据.
      PackHeader:[],//已组装的表头数据
      list: [
      ], //计量清单表格数据
      tomeRowList:null,//对应累计计量清单数据
      totalmeterageCol:null,    //截取获取实际累计计量表头对应所有列最后一层的表头列 object(用来单元格点击判断)
      pendingRemoveList:[],
      RowDelList: [],//记录被删除有id的单元格
      Height: 400,
      Width:  99.9,
      UpHeight:300,
    }
  },
 watch: {
    updateList: function(newVal,oldVal){  //ChoiceRow子组件返回来的数据
        //此处可进行判断，然后进行清单导入
        if (Array.isArray(newVal)) {  //判断返回的是不是一个数组
          //  console.log('最终用户选择的需要引入的清单数据在这里返回啦沙雕');
          //  console.log(newVal);
          //  this.importfxx(newVal);//这里调用表格处理函数
          this.packupdata(newVal); //这里调用根据已选择的新清单数据寻找相对应的累计计量清单数据
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
    // this.rowDrop();//调用表格行拖拽函数/
  },
  mounted(){
      this.tViewSize();
      window.onresize = () => {
        return (() => {
            this.tViewSize();
        })();
      }
  },
  beforeDestroy () {
      this.list.length = this.hd.length = this.col.length = this.PackHeader.length = 0;
  },
  methods: {
    keyRow( row ) {
        // console.log(row.seq)
        return row.seq
    },
    refreshTable () {  //刷新表格布局
        this.$nextTick(() => {  //强制重新渲染
          this.startTime = Date.now(); 
          this.showHeader = false;
          setTimeout(()=>{
              this.showHeader = true;
          },100);
        })
    },
    tViewSize () {  //动态调整表格的高度
        this.loading = true;
        let obj = this.$getViewportSize();
        this.$nextTick(() => {
            this.Height = this.Height;
            setTimeout(()=>{
               this.Height = obj.height-200;
              this.UpHeight = obj.height-320;
              this.loading = false;
            },100)
            
        });
    },
     upif ( newVal ) {   //处理父组件传来的值
        this.allHeader(this.tender.id); //请求该标段的全部计量清单表头列表
        if (newVal && (newVal.id || newVal.saveTime) ) {  //此处为预览修改
            this.loading = true;
            this.form.name = newVal.name;
            this.form.num = newVal.num;
            this.form.headerId = newVal.meterageHead.id;
            this.tomeRowList = this.totalmeterageCol = null;
            switch(this.mode) {
                case 'new': //此处为新建模式处理
                    return this.updates(newVal);
                    break;
                case 'show': //此处为显示模式处理
                    return this.OneMeterage(newVal.id);
                    break;
                case 'alter': //此处为修改模式处理
                    if (newVal.meterageHead && newVal.meterageHead.tMeterageHeadRows && newVal.meterageRowList) {
                        return this.updates(newVal);
                    }else if (newVal.id){
                        return this.OneMeterage(newVal.id);
                    }
                    break;
            } 
        }else if(newVal && (!newVal.id && !newVal.saveTime)){ //此处为新建
            this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
            this.form.name = this.form.num = this.form.headerId = this.headerList =null;
            this.$nextTick(() => {
                this.$refs.elxEditable1.reload([]);
            });
        }
    },
    updates (row) {  //新建模式与修改模式的预览修改数据呈现函数
          this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
          console.log('row-----------------------')
          console.log(row)
          try {
              let headsArr = this.$excel.Package(row.meterageHead.tMeterageHeadRows,row.meterageHead.refCol,row.meterageHead.refRow);
              this.PackHeader = [...headsArr]; //拷贝
              
              this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
              this.refreshTable(); //刷新表格布局
              //调用表格公式解析 存储
              this.formula = this.$excel.FormulaAnaly([...this.col]);
              //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
              this.lastHeader = this.$excel.BikoFoArr([...this.col]);
              this.hd = Object.keys(this.lastHeader); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
          } catch (error) {
              this.$message({
                type: 'info',
                message: '发生错误！ 当前为子组件 '+this.mode+' 模式  应该是表头内容出错'+error
            });
              this.loading = false;
          }
          this.meterageHead = { //保存表头信息
              id: row.meterageHead.id,
              name:row.meterageHead.name,
              num: row.meterageHead.num
          }
          if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
              this.meterageHead.refCol = row.meterageHead.refCol;
              this.meterageHead.refRow = row.meterageHead.refRow;
              this.meterageHead.tMeterageHeadRows = row.meterageHead.tMeterageHeadRows;
          }
          try {
              let arr = this.$excel.ListAssemble(row.meterageRowList); //组装清单表格数据
              this.list = [...arr];
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
    allHeader (tenderId) {  //请求该标段的全部计量清单表头列表
        this.$post('/head/allmeterage',{tenderId, judge:0})
        .then((response) => {
          this.form.headerList = response.data.meterageHeadList;
           //此处调用限制选择表头函数参数（清单类型,全部清单列表，全部表头列表） 表头列表返回（limit）属性 
            this.$excel.limitHeader('meterage', this.meterageList, this.form.headerList); 
        }).catch(e => {
            this.$message({
              type: 'info',
              message: '发生错误！'
            });
        });
    },
    oneHeader (id) {  //请求单个表头 表头id  表头类型
       this.$post('/head/getone',{id,type:'meterage'})
        .then((response) => {
          this.list.length = this.hd.length = 0;
          let data = response.data.onehead,
          headsArr = this.$excel.Package(data['tMeterageHeadRows'],data.refCol,data.refRow);
          this.PackHeader = XEUtils.clone(headsArr, true); //深拷贝
          this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
          this.refreshTable(); //刷新表格布局
          
          //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
          this.lastHeader = this.$excel.BikoFoArr([...this.col]);
          this.hd = Object.keys(this.lastHeader);
          this.meterageHead = { //保存表头信息
              id: data.id,
              name:data.name,
              num: data.num
          }
          if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
              this.meterageHead.refCol = data.refCol;
              this.meterageHead.refRow = data.refRow;
              this.meterageHead.tMeterageHeadRows = data.tMeterageHeadRows;
          }
          this.loading = false;
          
          //调用表格公式解析 存储
          this.formula = this.$excel.FormulaAnaly([...this.col]);
      })
    },
    OneMeterage (id) { //计量清单id
        //此处请求一个审批单的一个计量清单
        this.$post('/meterage/getonerow',{ id })
            .then((response) => {
            let data = response.data.meteragerow;
            if (!data && !data.meterageRowList) return this.loading = false;
            let headsArr = this.$excel.Package(data['meterageHead'].tMeterageHeadRows,data['meterageHead'].refCol,data['meterageHead'].refRow);
            this.PackHeader = [...headsArr];
            this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
            this.refreshTable(); //刷新表格布局
            
            //调用表格公式解析 存储
            this.formula = this.$excel.FormulaAnaly([...this.col]);
            //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
            this.lastHeader = this.$excel.BikoFoArr([...this.col]);
            this.hd = Object.keys(this.lastHeader); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
            this.meterageHead = { //保存表头信息
                id: data.meterageHead.id,
                name: data.meterageHead.name,
                num: data.meterageHead.num
            };
            if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
                this.meterageHead.refCol = data.meterageHead.refCol;
                this.meterageHead.refRow = data.meterageHead.refRow;
                this.meterageHead.tMeterageHeadRows = data.meterageHead.tMeterageHeadRows;
            };
            this.loading = false;
            let arr = this.$excel.ListAssemble(data.meterageRowList); //组装清单表格数据
            this.list = [...arr];
            
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
    allRelationUpdate () {  //请求可导入的对应的新清单列表  
        this.$post('/update/byMeterageHeadId',{ meterageHeadId: this.meterageHead.id,current:this.pageVO.currentPage,pageSize:this.pageVO.pageSize})
        .then((response) => {
            console.log(response)
            this.update = response.data.updateCustomList.list;
            this.innerVisible = true;
            this.showList =true;
      }).catch(e => {
          console.log('请求可导入的对应的新清单列表发生错误')
          console.log(e)
          this.$message({
            type: 'info',
            message: '请求可导入的对应的新清单列表发生错误！'
          });
      });
    },
    OneToTalmeterage () { //请求一个相对应的累计计量清单数据(根据计量清单表头id)
        if (!this.meterageHead || !this.meterageHead.id) return this.$message({type: 'info',message: '表头错误，请检查，或者重新选择！'});
        this.$post('/totalmeterage/by/meterageheadid',{ id:this.meterageHead.id })
        .then((response) => {
            let data = response.data.totalmeterage,
            arr = []; 
            console.log('打印一下请求到的相关累计计量清单response')
            console.log(response)
            if (!data) {
                this.allRelationUpdate(); //调用请求可导入所有对应的新清单列表
                this.tomeRowList = arr;
                return this.$message({type: 'info',message: '暂无查询到有相关累计计量清单信息'});
            }
            
            if (data.totalmeterageRowList && data.totalmeterageRowList.length >0 ) {
                arr = this.$excel.ListAssemble(data.totalmeterageRowList);  //组装清单
            }else{
                this.allRelationUpdate(); //调用请求可导入所有对应的新清单列表
                this.tomeRowList = arr;
                return this.$message({type: 'info',message: '累计计量清单内容为空或者异常'});
            }
            this.tomeRowList = arr;
            if (data && data.totalmeterageHead && data.totalmeterageHead.tTotalmeterageHeadRows && data.totalmeterageHead.tTotalmeterageHeadRows.length >0 ) {
                console.log('进来表头组装了')
                let headsArr = this.$excel.Package(data['totalmeterageHead'].tTotalmeterageHeadRows,data['totalmeterageHead'].refCol,data['totalmeterageHead'].refRow),
                col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
                // //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
                this.totalmeterageCol = this.$excel.BikoFoArr([...col]);
            }else{
                this.$message({type: 'info',message: '累计计量清单表头内容为空或者异常'});
            }
            this.allRelationUpdate(); //调用请求可导入所有对应的新清单列表
        }).catch(e => {
            this.allRelationUpdate(); //调用请求可导入所有对应的新清单列表
            this.$message({
              type: 'info',
              message: '请求相对应的累计计量清单数据发生错误！'+e
            });
        });
    },
    oneUpatde (id) {  //请求选择可导入新清单内容
        this.$post('/update/row/getone',{ id })
        .then((response) => {
            let list = this.$refs.elxEditable1.getRecords(),//获取表格的全部数据;
            res = response.data.update,
            obj = null;
            for(let key  in this.lastHeader){
                let item = this.lastHeader[key];
                console.log(key + '---')
                console.log(item)
                if (item.attribute && item.attribute==='update' && item.attributeValue && item.attributeValue !=='') {
                    let patt1=/[A-Z+]*/g;
                    obj = {
                        father: item.colNum,
                        son: item.attributeValue.match(patt1)[0]
                    }
                    console.log('跳出循环')
                    console.log(obj)
                    break;
                }
            };
            res['filTerList'] = list;
            res['filTerCol'] = obj;
            this.updateList = res;
      }).catch(e => {
          this.$message({
            type: 'info',
            message: '请求选择可导入新清单内容发生错误！'
          });
      });
    },
    selectupdate (row, column, cell, event) { //新清单列表数据表格单击事件
        this.oneUpatde(row.id); //调用请求清单
        //关闭显示对应清单列表页面
        this.showList = false;
    },
    handleSizeChange (pageSize) { 
      this.pageVO.pageSize = pageSize;
      this.allRelationUpdate();
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.allRelationUpdate();
    },
    formatterDate (row, column, cellValue, index) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    formatterType (row, column, cellValue, index) {
      let obj = {
        original: '新清单',
        change: '变更清单',
        update: '新清单',
        meterage: '计量清单',
        totalmeterage: '累计计量清单',	
        pay: '支付清单',
        totalpay: '累计支付清单'
      }
      return cellValue ? obj[cellValue] : '未知'
    },
    // tableRowClassName ({ row, rowIndex }) {
    //   if (this.pendingRemoveList.some(item => item === row)) {
    //     return 'delete-row';
    //   }
    //   return ''
    // },
    consoles () {
        let rest = this.$refs.elxEditable1.getRecords();//获取表格的全部数据
        console.log('检验一下数据对不对 rest list')
        console.log(rest);
        console.log(this.list);
    },
    packupdata (update) { //根据已选择的新清单数据选择对应累计计量清单数据
        if (!this.tomeRowList) this.tomeRowList=[];
        this.startTime = Date.now(); 
        let uplen = update.length,
        tolen = this.tomeRowList.length,
        todate = [];  //用来存储与选择对应的清单数据的累计计量清单数据
        if (!uplen || uplen === 0) return false;
        if (this.tomeRowList===null || !tolen || tolen === 0 || this.totalmeterageCol ==='') {   //直接调用数据组装函数
            console.log('累计计量无数据')
            return this.importfxx(update, todate, uplen);
        }
        console.log('累计计量有数据')
        for (let index = update.length -1; index >= 0; index--) {
            let upRowA = update[index]['A']['trNum'];
            // console.log('update当前的下标index  '+index)
            for (let to = this.tomeRowList.length -1; to >=0; to--) {
                // console.log('this.tomeRowList当前的下标to  '+to)
                let toRow = this.tomeRowList[to];
                if (upRowA === toRow['A']['trNum']) {
                    todate[index] = toRow;
                    // console.log('结束最内层的循环，执行下一循环index---to',index,'    ', to )
                    break;  //结束最内层的循环，执行下一循环
                }
            }
        }
        // console.log('最后的结果')
        // console.log(update)
        // console.log(todate)
        this.importfxx(update, todate, uplen);
    },
    importfxx(up, to, len) { //表头导入函数 up 新清单数据  to 累计计量清单数据 len 本次导入数据的数量
        let list = this.$refs.elxEditable1.getRecords(),//获取表格的全部数据;
        listlen = list.length,
        rest = [],    //存储本次新增清单的数据
        patt1=/[A-Z+]*/g,
        sumArr = this.lastHeader; //截取获取表格实际对应所有列最后一层的表头列 object
        listlen === 0? this.list = []: listlen;
        // 先生成一个完整表格数据
        console.log('this.hd-----------')
        console.log(this.hd)
        for (let index = len -1; index >= 0; index--) {
            rest[index] = {};
            rest[index]['seq'] = index+listlen;
            for (let i = this.hd.length -1; i >= 0; i--) {
                rest[index][this.hd[i]] = {attribute: null,colNum: this.hd[i],edit: "N",formula:null,td:'',tdColspan: 1,tdRowspan: 1,trNum:listlen+index+1,upload: 1 };
            }
        }
        for (let index = this.hd.length -1; index >= 0; index--) { //将对应列数据加到空数组数据那里
            let row = sumArr[this.hd[index]];
            if (row.attribute && row.attributeValue && row.attributeValue !=="" && (row.attribute === "update" || row.attribute === "totalmeterage-meterage") ) {
                let str = row.attributeValue;
                let colName = str.match(patt1)[0]; 
                
                for (let r = len -1; r >= 0; r--) {
                    // let RowTd = rest[r][row.colNum];
                    if (row.attribute === "update" ) {
                        rest[r][row.colNum] = XEUtils.clone(up[r][colName], true);
                        rest[r][row.colNum].tUpdateRowId = rest[r][row.colNum].id;
                    }else if (row.attribute === "totalmeterage-meterage") {
                        // console.log('正在设置哪一列  '+row.colNum)
                        try {
                            let totmheader = null;
                            if (this.totalmeterageCol) {
                                totmheader = Object.keys(this.totalmeterageCol); //用来所需要的所有列(obj)（属性）名
                            }
                            if (to.length===0 || !totmheader || totmheader.length===0 ) {
                                console.log('to.length设置上期累计数量默认为0');
                                rest[r][row.colNum]['td'] = 0;
                            } else {
                                // console.log('进来了这里>=0')
                                for (let index = totmheader.length -1; index >= 0; index--){
                                    let Totorow = this.totalmeterageCol[totmheader[index]],
                                    Tostr = Totorow.attributeValue;
                                    // console.log('Totorow.attribute')
                                    // console.log(Totorow.attribute)
                                    if (Totorow.attribute!== "meterage-total") {
                                        // console.log('属性不对')
                                        continue;
                                    }
                                    let TocolName = Tostr.match(patt1)[0];
                                    if (Tostr && Tostr !=="" ) {
                                        // console.log('有没有进去这个if判断----------Totorow.attribute === "meterage-total" -====TocolName +++ colName')
                                        // // console.log(TocolName,'   ',colName)
                                        // console.log('累计计量的当前列:  '+Totorow.colNum+'  累计计量的当前属性:  '+Totorow.attribute+'  累计计量的当前属性值:  '+Totorow.attributeValue+' 正在设置的当前列:  '+row.colNum+' 正在设置的当前属性:  '+row.attribute+' 正在设置的当前属性值:  '+row.attributeValue)
                                        // console.log('Totorow.colNum + TocolName', Totorow.colNum,TocolName)
                                        if (TocolName === colName) {  //属性值两对应
                                            // console.log(TocolName,' 进来值相等了  ',colName)
                                            rest[r][row.colNum] = to[r][Totorow.colNum];
                                            // console.log('设置上期累计数量  ==='+rest[r][row.colNum].td)
                                            break;
                                        }
                                    }
                                }
                            }
                        } catch (error) {
                            this.$message({ message: '设置上期累计数量报错默认为0', type: 'success', duration: 2000, showClose: true })
                            console.log('设置上期累计数量报错默认为0'+error)
                            console.log(error)
                            rest[r][row.colNum].td = 0;
                        }
                    }
                    rest[r][row.colNum]['colNum'] = row['colNum'];
                    rest[r][row.colNum]['trNum'] = r;
                    rest[r][row.colNum]['tdColspan'] = rest[r][row.colNum]['tdRowspan'] = 1;
                    delete rest[r][row.colNum]['id'];
                }
            }
        }
        console.log('看一下生成的数据ya')
        console.log(rest)
        console.log(this, rest, this.formula)
        this.$excel.Formula(this, rest, this.formula);  //调用公式计算
        try {  //把数据载入表格
            // rest = rest.concat([]);
            // this.$nextTick(() => {
            //     for (let index = 0; index < len; index++) {
            //         this.$refs.elxEditable1.insertAt(rest[index], -1); 
            //     }
            // })
            // this.list = this.$refs.elxEditable1.getRecords();
            rest = rest.concat([]);
            
            this.list = this.list.concat(rest);
            this.findList();
            // up = to = null;
        } catch (e) {
            console.log('出错了')
            console.log(e)
            rest.length =0;
            up = to = null;
            this.loading =false;
            this.$message({ message: `遇到问题了呀,清单导入失败,请重试。${e}`, type: 'error', duration: 6000, showClose: true })
        }
    },
    cell_click(row, column, cell, event){ //单元格点击编辑事件
        if(this.approval.state === 1 && this.uplist.id )return false; //审批单已通过，并且不是新建清单的话不许做修改。
        this.editRow !== null && this.editRow ? this.editRow.edit = "N" :this.editRow; //清除上一个单元格编辑状态
        if (column.property) {
            // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
            let str = column.property,
            colName = str.substr(0,str.indexOf(".td")),
            patt1=/[A-Z+]*/g,
            sumArr = this.lastHeader; //截取获取表格实际对应所有列最后一层的表头列 object
            //判断是否哪种属性类型允许单元格编辑
            if (this.lastHeader[colName].attribute !== 'meterage') {
                 if (!row[colName].attribute) return false;
                if (row[colName].attribute !=='add') return false;
            };
            //现在进行遍历属性把原数量，禁止修改
            for (let c = this.hd.length -1; c >= 0; c--) {
                let hederRow = sumArr[this.hd[c]];
                if (hederRow.attribute && hederRow.attribute === "totalmeterage-meterage" ) {
                    if (hederRow.colNum === colName)  return false;
                }
            }
            this.editRow = row[colName];
            row[colName].edit = "Y";  //Y为编辑模式N为只读状态     
        }  
    },
    cell_select ({row, column, rowIndex, columnIndex}){ //单元格样式
        if (column.property) {
            // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
            let str = column.property,
            colName = str.substr(0,str.indexOf(".td"));
            //判断是否哪种属性类型允许单元格编辑
            if (this.lastHeader[colName].attribute !== 'meterage') {
                // if (row[colName].attribute && row[colName].attribute==='add') {
                //     return {'background':'#99ff005c'} //新增一行的颜色
                // }
                if (!row[colName].id ) {
                    return {'background':'#f5ffe5'}; //没有id的颜色
                }
                return {}
            }
            return {'background':'#FFFFE0'} //编辑区颜色
        }  
        return {'background':'#FFFFFF'};
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {   //单元格合并处理
        if (columnIndex >1) {  //带选择框的情况
            let Row = row[this.hd[columnIndex-2]];
            if (Row) {
                return [Row.tdRowspan, Row.tdColspan]
            }
        }
        return [1, 1]
    }, 
    findList () { //表格滚动渲染函数
        this.loading = true;
         this.$nextTick(() => {
        this.$refs.elxEditable1.reload([]);
        setTimeout(() => {
            this.$refs.elxEditable1.reload(this.list);
            this.loading = false;
            this.$nextTick(() => {
                this.$message({ message: `成功导入 ${this.list.length} 条数据 耗时 ${Date.now() - this.startTime} ms `, type: 'success', duration: 6000, showClose: true })
            });
            this.tViewSize();
        }, 300)
      });
    },
    getSummaries (param) {  //合计
        if (!this.$refs.elxEditable1 || !this.showHeader) return [];
        let list = this.$refs.elxEditable1.getRecords();//获取表格的全部数据;
        if (this.PackHeader.length ===0 || list.length ===0) return [];
        return this.$excel.getSummaries(this.PackHeader, list, param);//调用合计尾行。
    },
    // insertEvent () {
    //     console.log('this.hd-----------------p')
    //     console.log(this.hd)
    //     if (!this.hd.length || this.hd.length===0) return false;
    //     let rest = this.$refs.elxEditable1.getRecords(),//获取表格的全部数据;
    //     restLen = rest.length,
    //     NewRow = {},
    //     patt1=/[A-Z+]*/g,
    //     sumArr = this.lastHeader; //截取获取表格实际对应所有列最后一层的表头列 object
    //     for (let index = this.hd.length -1; index >= 0; index--) {
    //         NewRow['seq'] = restLen;
    //         NewRow[this.hd[index]]= {attribute: 'add',colNum: this.hd[index],edit: "N",formula:null,td: null, tdColspan: 1,tdRowspan: 1,trNum:restLen+1,upload: 1 };
    //     }
    
    //     //现在进行遍历属性把原清单数据加入进去
    //       for (let c = this.hd.length -1; c >= 0; c--) {
    //           let row = sumArr[this.hd[c]],
    //           str = row.attributeValue;
    //           if (row.attribute && row.attribute === "totalmeterage-meterage" ) {
    //               NewRow[row.colNum].td = 0;
    //           }
    //       }
    //     console.log('打印一下NewRow 新增的一行')
    //     console.log(NewRow);
    //     this.$refs.elxEditable1.insertAt(NewRow, -1);
  
    // },
    Abandon () {  //放弃更改
        // this.$refs.elxEditable1.revert();
        this.$nextTick(() => {
            this.$refs.elxEditable1.reload([]);
            this.$refs.elxEditable1.reload(this.list);
            this.RowDelList = []; //放弃更改后  删除数组清空
        })
    },
    RemoveSelecteds () {  //删除选中
      let selection = this.$refs.elxEditable1.getSelecteds(),
      seleLen = selection.length;
      // console.log('seleLen')
      // console.log(selection)
      if (seleLen && seleLen > 0) {
          this.$refs.elxEditable1.removeSelecteds();
          let number = selection[0]['seq'];; //表格列表的下标
          this.Rowsort( number );  //调用表格重新排序函数
          for (let index = seleLen -1; index >= 0; index--) { //解构已删除的单元格，将有id的单元格放入删除集合中
              for (let a = this.hd.length-1; a >= 0; a--) {
                  let item = selection[index][this.hd[a]];
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
                    let item = list[index][this.hd[a]];
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
            console.log('list----------------');
            console.log(list);
            if (list.length === 0) return this.$message({ type: 'success',message: '请先导入数据!' });
            //解构数据进行提交
            this.loading = true;
            let header = Object.keys(this.lastHeader), //用来所需要的所有列(obj)（属性）名
            meterageHead = this.meterageHead, //表头数据
            meterageRowList = [], //清单内容
            meterageRowAddList = [],  //增
            meterageRowDelList = [], //删
            meterageRowAltList = [];  //改
            console.log('header-------------------------')
            console.log(header)
            //查询上一次修改有无这个集合  ，有的话合并两个数组
            if (this.uplist['meterageRowDelList'] && this.uplist['meterageRowDelList'].length >0) {
                  console.log('已经开始二次修改删除操作 this.RowDelList,   this.uplist[meterageRowDelList]----------')
                  console.log(this.RowDelList,this.uplist['meterageRowDelList'])
                  meterageRowDelList = this.RowDelList.concat(this.uplist['meterageRowDelList']);  //删
             }else{
                  meterageRowDelList = this.RowDelList;
             }
          // XEUtils.clone(up[r][colName], true);
            try {
                for (let index = list.length -1; index >=0 ; index--) {
                    for (let i = header.length -1; i >=0; i--) {
                        let listRows = list[index][header[i]];
                        if (listRows && listRows.colNum) {
                            // delete listRows.edit;
                            listRows['formula'] = '';
                            listRows['trNum'] = index+1;                  
                            // listRows['attribute'] = '';                  
                            listRows['upload'] = 1;    
                            if (!listRows['id']) {  //无id则视为新增，新增到meterageRowAddList
                                meterageRowAddList.push(listRows);
                            }else if ( listRows['id'] && (list[index]['alter'] || listRows['alter']) ) {   //有id 与 alter 视为已修改过的数据 新增到meterageRowAltList+
                                listRows['alter'] = "Y";
                                meterageRowAltList.push(listRows);
                            }
                            meterageRowList.push(listRows);
                        }
                    }
                }
            } catch (error) {
                this.loading = false;
                console.log('保存数据遇到错误  :'+error)
                return this.$message({ type: 'success',message: '存储失败，请联系相关技术人员!' });
            }
            // return false;
            let obj = { //新建清单的时候需要用
                meterageHeadId: this.form.headerId,    //清单表头id
                processId: this.approval.id,         //审批单流程id
                sysOrder: '',                   //系统序号  预留，暂不使用
                sysNum: '',                    //系统编号  预留，暂不使用
                name: this.form.name,               //清单名称
                num: this.form.num,                 //清单编号
                tenderId: this.tender.id,           //标段id
                type: 'meterage',                 //清单类别为”meterage”
                meterageRowAddList,  //增
                meterageRowDelList,  //删
                meterageRowAltList,  //改
                enter:list.length>0?1:0,
                tender:this.tender,
                saveTime:new Date(),
                saveEmployee:{name:this.$store.state.username}
            };
            if (this.mode !=='show') {
                obj['meterageHead'] = meterageHead; //表头数据
                obj['meterageRowList'] = meterageRowList; //清单内容
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
                            this.meterageList.push(obj);
                            this.$message({ message: `已为你保存 ${meterageRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                            return this.saveShow();                      
                    } 
                }else if (this.uplist && (this.uplist.id || this.uplist.saveTime)) {  //当前属于修改清单====
                    switch(this.mode) {
                        case 'show':  //为 show模式
                            this.loading = false;
                            return this.$message({ type: 'success',message: '当前为show模式，在joinParent=true 时 不支持更改清单！' })
                            break;
                        default:  //为 alter模式与 new模式 
                            for (let index = this.meterageList.length -1; index >=0; index--) {
                                let ListRow = this.meterageList[index];
                                if((ListRow.saveTime === this.uplist.saveTime) || (ListRow.id === this.uplist.id)){
                                    ListRow.meterageHeadId = this.form.headerId;
                                    ListRow.meterageRowList = meterageRowList;
                                    ListRow.meterageRowAddList = meterageRowAddList;  //增
                                    ListRow.meterageRowDelList = meterageRowDelList;  //删
                                    ListRow.meterageRowAltList = meterageRowAltList;  //改
                                    ListRow.name = this.form.name;
                                    ListRow.num = this.form.num;
                                    ListRow.meterageHead = meterageHead;
                                    ListRow.updateTime = new Date();
                                    if (ListRow.id && ListRow.id === this.uplist.id && this.mode === 'alter') { //此时要把修改后的有id的清单放入修改清单列表
                                        ListRow.alter ='Y'; //标记为修改
                                    }
                                    this.$message({ message: `已为你修改---保存 ${meterageRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                                    return this.saveShow();
                                }
                                
                            }
                            
                    } //switch的 }
                }
                
            }else{    //不接入父组件的情况
                  let parameter = {
                      meterageAddList: [], //增清单
                      meterageDelList: [],   //删清单
                      meterageAltList: []  //改清单
                  } 
                  if (this.uplist && !this.uplist.id ) {  //当前为新建清单
                      switch(this.mode) {
                          case 'show':  //为show模式
                              parameter.meterageAddList.push(obj);
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
                              parameter.meterageAltList.push(obj);
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
        this.$post('/meterage/update',obj )
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


<style scoped>
@import '../../modules/Tablestyle.css';
</style>
