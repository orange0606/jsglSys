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
    <div class="click-table11-oper" v-if="joinParent && mode==='show'?false:true" >
      <el-button :disabled="approval.state === 1?true:false" type="warning" size="mini" @click="submitEvent">完成</el-button>
      <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
      <el-button :disabled="approval.state === 1?true:false" type="success" size="mini" @click="insertEvent">新增</el-button>
      <el-button :disabled="approval.state === 1?true:false" type="danger" size="mini" @click="$refs.elxEditable1.removeSelecteds()">删除选中</el-button>
      <el-button :disabled="approval.state === 1?true:false" type="info" size="mini" @click="$refs.elxEditable1.revert()">放弃更改</el-button>
      <el-button :disabled="approval.state === 1?true:false" type="info" size="mini" @click="$refs.elxEditable1.clear()">清空表格</el-button>
    </div>
          <!-- show-summary
      :summary-method="getSummaries" -->
         <!-- :data.sync="list" -->
           <!-- :cell-style="cellStyle" -->
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
      :summary-method="getSummaries"
      size="small"
      :edit-config="{render: 'scroll', renderSize: 80}"
      style="width: 100%">
      <elx-editable-column type="selection" align="center" width="55"></elx-editable-column>
      <elx-editable-column width="40" align="center" >
        <template v-slot:header="scope">
          <el-tooltip class="item" placement="top">
            <div slot="content">按住后可以上下拖动排序，<br>完成后点击保存即可！</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template>
          <i class="el-icon-rank drag-btn"></i>
        </template>
      </elx-editable-column>
      <elx-editable-column type="index" width="60" align="center" >
        <template v-slot:header>
          <i class="el-icon-setting" @click="dialogVisible = true"></i>
        </template>
      </elx-editable-column>
      <!-- 此处使用多级表头嵌套组件 -->
      <my-column v-for="(item,index) in col" :key="index" :col="item" :Formula="formula" type="pay"></my-column>
    </elx-editable>
      <p style="color: red;font-size: 12px;margin:5px 0 15px 0;text-align:left;">注意：淡黄色区为可编辑区域</p>

  </div>
</template>

<script>
import MyColumn from './MyColumn';
import XEUtils from 'xe-utils';
import Sortable from 'sortablejs';

export default {
  name: 'NewPay',
  components: {
    MyColumn
  },
  props: {
    uplist:{  //查看和修改清单数据
      type: Object,
    },
    payList: { //所有计量清单列表
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
      showHeader:true,  //是否显示表头以及表格强制渲染
      payHead:null, //保存表头信息
      hd:[],  //表格单元格用来合并的所有列数数据（列名，对象的属性名集合）
      startTime:null,
      loading: false,
      dialogVisible: true,
      editRow:null, //单元格编辑的存储上一个已点击单元格数据
      lastHeader: [], //最后一层表头数据（用来单元格点击编辑判断）
      formula:{}, //存储表头的公式数据
      col: [],//已对PackHeader再次组装的多级表头数据.
      PackHeader:[],//已组装的表头数据
      list: [], //支付清单表格数据
      tometerageRowList: [], //累计计量清单内容
      totalpayRowList: [], //累计支付清单内容已组装好的数据
      totalpayCol:'', //累计支付表头内关联支付表头的属性值
      pendingRemoveList:[],
      tTotalmeterageId:null, //累计计量清单id
    }
  },

 watch: {
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
    this.rowDrop();//调用表格行拖拽函数

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
            this.loading = true;
            this.startTime = Date.now(); 
            this.form.name = newVal.name;
            this.form.num = newVal.num;
            this.form.headerId = newVal.tPayHead.id;
            switch(this.mode) {
                case 'new': //此处为新建模式处理
                    return this.updates(newVal);
                    break;
                case 'show': //此处为显示模式处理
                    return this.OnePay(newVal.id);
                    break;
                case 'alter': //此处为修改模式处理
                    if (newVal.payHead && newVal.payHead.tPayHeadRows && newVal.payRowList) {
                        return this.updates(newVal);
                    }else if (newVal.id){
                        return this.OnePay(newVal.id);
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

          try {
              var headsArr = this.$excel.Package(row.tPayHead.tPayHeadRows,row.tPayHead.refCol,row.tPayHead.refRow);
              this.PackHeader = XEUtils.clone(headsArr, true); //深拷贝
              this.$nextTick(() => {
                    this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
                    //调用表格公式解析 存储
                    this.formula = this.$excel.FormulaAnaly([...this.col]);
                    //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
                    this.lastHeader = this.$excel.BikoFoArr([...this.col]);
                }); // 强制刷新
          } catch (error) {
              this.$message({
                type: 'info',
                message: '发生错误！ 当前为子组件 '+this.mode+' 模式  应该是表头内容出错'+error
            });
              this.loading = false;
          }

          this.payHead= { //保存表头信息
              id: row.payHead.id,
              name:row.payHead.name,
              num: row.payHead.num
          }
          if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
              this.payHead.refCol = row.payHead.refCol;
              this.payHead.refRow = row.payHead.refRow;
              this.payHead.tPayHeadRows = row.payHead.tPayHeadRows;
          }
          this.tTotalmeterageId = row.tTotalmeterageId; //累计计量清单id
          try {
              var arr = this.$excel.ListAssemble(row.payRowList	); //组装清单表格数据
              this.list = [...arr];
              this.findList(); //调用滚动渲染数据
              this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
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
        this.$post('/head/allpay',{tenderId})
        .then((response) => {
          // console.log('response')
          // console.log(response)
          this.form.headerList = response.data.payHeadList;
        }).catch(e => {
            this.$message({
              type: 'info',
              message: '发生错误！'
            });
        });
    },
    oneHeader (id) {  //请求单个表头 表头id  表头类型
       this.$post('/head/getone',{id,type:'pay'})
        .then((response) => {
          var data = response.data.onehead,
          headsArr = this.$excel.Package(data['tPayHeadRows'],data.refCol,data.refRow);
          this.PackHeader = XEUtils.clone(headsArr, true); //深拷贝
          this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
          //调用表格公式解析 存储
          this.formula = this.$excel.FormulaAnaly([...this.col]);

          //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
          this.lastHeader = this.$excel.BikoFoArr([...this.col]);
          this.payHead= { //保存表头信息
              id: data.id,
              name:data.name,
              num: data.num
          }
          if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
              this.payHead.refCol = data.refCol;
              this.payHead.refRow = data.refRow;
              this.payHead.tPayHeadRows = data.tPayHeadRows;
          }
          this.showHeader = false;
          this.$nextTick(() => {  //强制重新渲染
            this.showHeader = true;
          })
          this.loading = false;
          this.list.length = this.hd.length = 0;

          //调用表格公式解析 存储
    
          this.OneToPay( data.id ); // 调用相对应的累计支付清单内容
      })
    },
    OnePay (id) { //支付清单id
        //此处请求一个审批单的一个支付清单
        this.$post('/pay/getonerow',{ id })
            .then((response) => {
              console.log(response)
            var data = response.data.pay;
            if (!data && !data.payRowList && !data.payHead.tPayHeadRows ) return this.loading = false;
            var headsArr = this.$excel.Package(data['payHead'].tPayHeadRows,data['payHead'].refCol,data['payHead'].refRow);
            this.PackHeader = [...headsArr];
            this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
            //调用表格公式解析 存储
            this.formula = this.$excel.FormulaAnaly([...this.col]);

            //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
            this.lastHeader = this.$excel.BikoFoArr([...this.col]);
            this.payHead= { //保存表头信息
                name:data.payHead.name,
                num: data.payHead.num,
                id: data.payHead.id,
            }
            if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
              this.payHead.refCol = data.payHead.refCol;
              this.payHead.refRow = data.payHead.refRow;
              this.payHead.tPayHeadRows = data.payHead.tPayHeadRows;
            }
            this.tTotalmeterageId = data.tTotalmeterageId; //累计计量清单id
            this.loading = false;
            this.list.length = this.hd.length = 0;

            var arr = this.$excel.ListAssemble(data.payRowList	); //组装清单表格数据
            this.list = [...arr];
            this.findList(); //调用滚动渲染数据
            this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
        }).catch(e => {
            this.loading = false;
            console.log(e)
            this.$message({
                type: 'info',
                message: '发生错误！'+e
            });
        })
    },
    OneToPay (id) { //请求关联的一个累计支付清单
        this.$post('/totalpay/by/payheadid',{ id })
        .then((response) => {
          console.log('/totalpay/by/payheadid')
          console.log(response)
          var data = response.data.totalpay,
          arr = []; 
          if (data && data.totalpayRowList && data.totalpayRowList.length >0 ) {
              arr = this.$excel.ListAssemble(data.totalpayRowList);  //组装清单
          }else{
              this.OneTometerage(id); //调用请求相关累计计量清单内容组装函数
              return this.totalpayRowList = arr;
          }
          this.totalpayRowList = arr;
          if (data && data.totaltPayHead&& data.totaltPayHead.length >0 ) {
              var headsArr = this.$excel.Package(data['payHead'].tPayHeadRows,data['payHead'].refCol,data['payHead'].refRow),
              col = this.$excel.Nesting(headsArr),   //调用多级表头嵌套组装函数
              //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
              lastHeader = this.$excel.BikoFoArr([...col]),
              header = Object.keys(lastHeader); //用来所需要的所有列(obj)（属性）名
              for (let index = header.length -1; index >= 0; index--){
                  var row = lastHeader[header[index]];
                  // str = row.attributeValue,
                  // colName = str.match(patt1)[0];
                  if (row.attribute && row.attributeValue && row.attributeValue !=="" && row.attribute === "pay-total" ) {
                      this.OneTometerage(id); //调用请求相关累计计量清单内容组装函数
                      return this.totalpayCol = row.trNum;
                  }
              }
          }
            this.OneTometerage(id); //调用请求相关累计计量清单内容组装函数
        }).catch(e => {
            this.OneTometerage(id); //调用请求相关累计计量清单内容组装函数
            this.$message({
              type: 'info',
              message: '请求相对应的累计支付清单数据发生错误！'+e
            });
        });
    },
    OneTometerage (id) {  //请求相对应的累计计量清单数据
        this.$post('/totalmeterage/by/payheadid',{ id })
        .then((response) => {
          console.log('/totalmeterage/by/payheadid')
          console.log(response)
          var data = response.data.totalmeterage,
          arr = []; 
          this.tTotalmeterageId = data.id; //累计计量清单id
          if (data && data.totalmeterageRowList && data.totalmeterageRowList.length >0 ) {
              arr = this.$excel.ListAssemble(data.totalmeterageRowList);  //组装清单
          }
          this.tometerageRowList = arr;

          this.importfxx(); //调用支付清单内容组装函数
        }).catch(e => {
            this.importfxx(); //调用支付清单内容组装函数
            this.$message({
              type: 'info',
              message: '请求相对应的累计计量清单数据发生错误！'+e
            });
        });
    },

    handleSizeChange (pageSize) { 
      this.pageVO.pageSize = pageSize;
      this.allRelationUpdate();
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.allRelationUpdate();
    },

    importfxx() { //表头导入函数
        this.loading = true;
        this.hd.length = this.list.length = 0; //归为初始化状态
        this.startTime = Date.now(); 
        // 先生成一个完整表格数据
        this.list = [];
        var hd = Object.keys(this.PackHeader[0]), //用来所需要的所有列(obj)（属性）名
        patt1=/[A-Z+]*/g;
        for (let index =0; index < 1; index++) {   //生成一行支付清单
            this.list[index] = {};
            for (let i = 0; i < hd.length; i++) {
              this.list[index][hd[i]] = {attribute: null,colNum: hd[i],edit: "N",formula:null,td:'',tdColspan: 1,tdRowspan: 1,trNum:index+1,upload: 1 };
            }
        }
        var cols = [...this.col],
        sumArr = this.$excel.BikoFoArr(cols); //截取获取表格实际对应所有列最后一层的表头列 object
        var header = Object.keys(sumArr); //用来所需要的所有列(obj)（属性）名
        for (let index = header.length -1; index >= 0; index--) { //将对应列数据加到空数组数据那里
            var row = sumArr[header[index]];
            if (row.attribute && row.attributeValue && row.attributeValue !=="" && (row.attribute === "totalpay-pay" || row.attribute === "totalmeterage-head-total") ) {
                console.log('进来了吗')
                var str = row.attributeValue,
                colName = str.match(patt1)[0],
                Rlist = this.list[0][row.colNum];
                  if (row.attribute === "totalpay-pay" ) {
                      // console.log('进来了totalpay-pay')
                      // this.list[a][row.colNum] = {...data[a][colName]};
                      if (this.totalpayCol!='' && this.totalpayRowList && this.totalpayRowList.length && this.totalpayRowList.length > 0) {
                          Rlist = {...this.totalpayRowList[0][this.totalpayCol]};
                          // console.log('进来了totalpay-pay-----Rlist')
                          // console.log(this.totalpayRowList,this.totalpayCol)
                      }else{  //无数据默认为0
                          Rlist.td = 0;
                          // console.log('进来了totalpay-pay-----Rlist ----为0')
                          // console.log(this.totalpayRowList,this.totalpayCol)
                      }
                  }else if (row.attribute === "totalmeterage-head-total") {
                      try { 
                            // console.log('进来了totalmeterage-head-total')
                            //当属性值等于累计计量对应的计量清单。目的是对应累计计量清单的值，但通过计量清单做对应。此处因查询有无累计计量清单无的话，为0；
                            if (this.tometerageRowList  && this.tometerageRowList.length && this.tometerageRowList.length>0) {
                                // var tohd = Object.keys(this.tometerageRowList[0]);
                                // console.log('this.tometerageRowList---------')
                                // console.log(this.tometerageRowList,colName)
                                var number = null;
                                for (let d = this.tometerageRowList.length -1; d >= 0; d--) {
                                    number += (this.tometerageRowList[d][colName].td)*1;
                                }
                                Rlist.td = number;
                                // console.log('进来了totalmeterage-head-total ----Rlist.td = number   ==number',number)
                                // console.log('进来了totalmeterage-head-total----Rlist')
                                // console.log(this.tometerageRowList,colName)
                            }else{  //无数据默认为0
                                Rlist.td = 0;
                                // console.log('进来了totalpay-pay-----Rlist ----为0')
                                // console.log(this.tometerageRowList,colName)
                            }
                      } catch (e) {   //如果数据对不上直接为0
                            console.log('totalmeterage-head-total 处理的时候数据出错'+e)
                            // this.$message({ message: `遇到问题了呀,清单导入失败,请重试。${e}`, type: 'error', duration: 6000, showClose: true })
                            Rlist.td = 0;
                      }
                  }
                  Rlist.colNum = row.colNum;
                  Rlist.trNum = 1;
                  Rlist.tdColspan = Rlist.tdRowspan = 1;
               
            }
        }
        try {  //把数据载入表格
                this.findList(); //调用滚动渲染数据
                this.$excel.Formula(this, this.list, this.formula);  //调用公式计算
            this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
        } catch (e) {
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
            colName = str.substr(0,str.indexOf(".td"));
            //判断是否哪种属性类型允许单元格编辑
            if (this.lastHeader[colName].attribute !== 'pay') return false;
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
            if (this.lastHeader[colName].attribute !== 'pay') return false;
            return {'background':'#FFFACD'}
        }  
        return {};
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {   //单元格合并处理
        if (columnIndex >2) {  //带选择框的情况
            if (row[this.hd[columnIndex-3]]) {
                return [row[this.hd[columnIndex-3]].tdRowspan, row[this.hd[columnIndex-3]].tdColspan]
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
        if (this.PackHeader.length ===0 && list.length ===0) return [];
        return this.$excel.getSummaries(this.PackHeader, list, param);//调用合计尾行。
    },
    insertEvent () {
      // console.log('进来了吗')
      this.$refs.elxEditable1.insert({
        '0': `New ${Date.now()}`,
      }).then(({ row }) => {
        this.$refs.elxEditable1.setActiveCell(row);
      })
      this.$refs.elxEditable1.clearActive();
    },

    rowDrop () {
      this.$nextTick(() => {
        Sortable.create(this.$el.querySelector('.el-table__body-wrapper tbody'), {
          handle: '.drag-btn',
          onEnd: ({ newIndex, oldIndex }) => {
            let currRow = this.list.splice(oldIndex, 1)[0];
            this.list.splice(newIndex, 0, currRow);
          }
        })
      })

    },
    submitEvent () {
      this.$refs.elxEditable1.validate(valid => {
        if (valid) {
            let list = this.$refs.elxEditable1.getRecords();//获取表格的全部数据;
            list.forEach((item, index) => {
                if (XEUtils.isDate(item.date)) {
                item.date = item.date.getTime();
                }
                // 重新生成排序后的序号
                item.seq = index;
            })
            if (list.length === 0) {
                this.$message({
                    type: 'success',
                    message: '请先导入数据!'
                })
                return false;
            }
            //解构数据进行提交
          this.loading = true;
          var header = Object.keys(this.PackHeader[0]), //用来所需要的所有列(obj)（属性）名
          payRowList = [];
          for (let index = list.length -1; index >=0 ; index--) {
              for (let i = header.length -1; i >=0; i--) {
                  if (list[index][header[i]] && list[index][header[i]].colNum) {
                      // delete list[index][header[i]].edit;
                      list[index][header[i]].formula = '';
                      list[index][header[i]].trNum = index+1;                  
                      list[index][header[i]].attribute = '';                  
                      list[index][header[i]].upload = 1;    
                      payRowList.push(list[index][header[i]]);
                  }
              }
          }
          //此处做个判断，判断是新建还是修改。
          switch(this.mode) {
              case 'show': //此处为展示模式处理
                  console.log('进入了show模式')
                   var obj = {
                      // id:                                    //计量清单id
                      tPayHeadId: this.form.headerId,    //计量清单表头id
                      processId: this.approval.id,         //审批单流程id
                      sysOrder: '',                   //系统序号  预留，暂不使用
                      sysNum: '',                    //系统编号  预留，暂不使用
                      name: this.form.name,                     //计量清单名称
                      num: this.form.num,                    //计量清单编号
                      tenderId: this.tender.id,                     //标段id
                      tTotalmeterageId : this.tTotalmeterageId, //累计计量清单id
                      type: 'pay',                 //计量清单类别为”pay”
                      payRowList                 //计量清单内容，如果为null表示无内容修改，如果为空数组，表示删除全部内容
                  },
                  payList = [];
                  var url = '';
                  if (this.uplist && !this.uplist.id ) { //此处是新建清单
                      url = '/pay/save';
                  }else if (this.uplist && this.uplist.id) {    //此处是修改,先删除，再保存。二次请求
                      obj.id = this.uplist.id;
                      url = '/pay/update';
                      console.log('这里保存')
                  }
                  if (url === '') return false;
                  payList.push(obj);
                  this.$post(url,{ payList })
                      .then((response) => {   
                      this.$message({ message: `已为你保存 ${payRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                      this.saveShow();
                  }).catch(e => {
                      this.loading = false;
                      payRowList.length = 0;
                      this.$message({
                          type: 'info',
                          message: '发生错误！'+e
                      });
                  })
                  break;
              default:    //此处为新建模式与修改模式
                  console.log('此处为新建模式与修改模式')
                  var payHead= this.payHead;
                 
                  if (this.uplist && (this.uplist.id || this.uplist.saveTime) ) {  //此处是修改清单
                        console.log('此处是修改清单')
                        if (!payHead.id || !payHead.tPayHeadRows) {
                            payHead = this.uplist.payHead;
                        }
                        for (let index = this.payList.length -1; index >=0; index--) {
                            var PayIndex = this.payList[index];
                            if((PayIndex.saveTime === this.uplist.saveTime) || (PayIndex.id === this.uplist.id)){
                                PayIndex.tPayHeadId = this.form.headerId;
                                PayIndex.tTotalmeterageId = this.tTotalmeterageId;
                                PayIndex.payRowList	 = [];
                                PayIndex.payRowList	 = payRowList;
                                PayIndex.name = this.form.name;
                                PayIndex.num = this.form.num;
                                PayIndex.payHead = payHead;
                                PayIndex.updateTime = new Date();
                                this.$message({ message: `已为你修改---保存 ${payRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                                return this.saveShow();
                            }
                        }
                  }else if (this.uplist) {  //此处是新建清单
                        var obj = {
                            tPayHeadId:this.form.headerId,
                            processId: this.approval.id,
                            sysOrder:'',
                            sysNum:'',
                            name:this.form.name,
                            num:this.form.num,
                            tenderId:this.tender.id,
                            tTotalmeterageId: this.tTotalmeterageId,
                            type:'pay',
                            payRowList,
                            payHead,//表头数据
                            enter:this.list.length>0?1:0,
                            tender:this.tender,
                            saveTime:new Date(),
                            saveEmployee:{name:this.$store.state.username}
                        };
                        this.payList.push(obj);
                        this.$message({ message: `已为你保存 ${payRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                        return this.saveShow();
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
    exportCsvEvent () {
      this.$refs.elxEditable1.exportCsv();
    },


  }
}
</script>

<style scope>
.click-table11-oper {
  margin-bottom: 5px;
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