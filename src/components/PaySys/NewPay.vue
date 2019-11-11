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
    <div class="click-table11-oper" >
      <el-button v-if="joinParent && mode==='show' || (approval.state === 1)?false:true" type="warning" size="mini" @click="submitEvent">完成</el-button>
      <el-button type="success" size="mini" @click="exportList">导出</el-button>
      <!-- <el-button v-if="joinParent && mode==='show' || (approval.state === 1)?false:true" type="success" size="mini" @click="insertEvent">新增</el-button>
      <el-button v-if="joinParent && mode==='show' || (approval.state === 1)?false:true" type="danger" size="mini" @click="$refs.elxEditable1.removeSelecteds()">删除选中</el-button> -->
                <el-button v-if="joinParent && mode==='show' || (approval.state === 1)?false:true" type="info" size="mini" @click="Abandon">放弃更改</el-button>
      <!--  -->
    </div>
          <!-- show-summary
      :summary-method="getSummaries" -->
         <!-- :data.sync="list" -->
           <!-- :cell-style ="cell_select" -->
    <!-- :edit-config="{trigger: 'click', mode: 'cell', render: 'scroll', renderSize: 80, useDefaultValidTip: true}" -->
    <div :style="{ height: Height+'px' }">
        <elx-editable
          ref="elxEditable1"
          class="scroll-table4 click-table11"
          border
          height="100%"
          :show-header="showHeader"
          v-if="showHeader"
          @cell-click ="cell_click"
          :header-cell-style="getRowClass"
          :row-style="RowCss"
          size="small"
          :edit-config="{render: 'scroll', renderSize: 80}">
          <elx-editable-column type="selection" align="center" width="45" :key="$excel.randomkey(this)" ></elx-editable-column>
          <elx-editable-column type="index" width="60" align="center" :key="$excel.randomkey(this)" ></elx-editable-column>
          <!-- 此处使用多级表头嵌套组件 -->
          <my-column v-for="(item,index) in col" :key="index" :col="item" :Formula="formula" type="pay" :lastHeader="lastHeader"></my-column>
        </elx-editable>
          <p style="color: red;font-size: 12px;margin:18px 0 0px 0;text-align:left;">注意：淡黄色区为可编辑区域</p>
    </div>
  </div>
</template>

<script>
import MyColumn from './MyColumn';
import XEUtils from 'xe-utils';


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
    organizationId:{   //部门id
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
      RowDelList:[],// 删除集合
      totalobj: {},//合计尾行计算结果存储
      ResetList: [], //清单初始值（重置数据时用）
      new: false, //判断是否新建清单 默认为否（重置数据时候用来判断是否要存储备用数据）
      Height: 400,
      Width:99.9
    }
  },

 watch: {
    uplist: function(newVal,oldVal){  //子组件返回来的数据
        //此处可进行判断，然后进行清单导入
        this.upif( newVal );//此处调用父组件传来的清单数据判断处理函数
    },
    '$store.state.clientSize': {
        handler: function() {
        this.tViewSize();
        }
    },
  },
  computed: {
  },
  created () {
    this.allHeader( this.tender.id );//调用请求一个标段的所有变更表头
    this.upif( this.uplist );//此处调用父组件传来的清单数据判断处理函数
    this.$root.state = true;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
  },
  mounted(){
      this.tViewSize();
  },
  beforeDestroy () {
      this.list.length = this.hd.length = this.col.length = this.PackHeader.length = 0;
  },
  methods: {
    getRowClass ({ row, column, rowIndex, columnIndex }) {  //表头样式
            // console.log('row, column, rowIndex, columnIndex')
        if (column.property) {
            // console.log(rowIndex, columnIndex)
                // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
                let str = column.property,
                colName = str.substr(0,str.indexOf(".td"));
                //判断是否哪种属性类型允许单元格编辑
                if (this.lastHeader[colName].attribute !== 'pay') {
                    return {}
                }
                return {'background':'#FFFFE0'} //编辑区颜色
            }  
    },
    RowCss({row, rowIndex}) {     // 定义RowCss函数，这样当表格中的相应行满足自己设定的条件是就可以将该行css样式改变
        if (!row['A'].id ) {
            return 'background:#f5ffe5';
        }
        return '';
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
        let obj = this.$store.state.clientSize;
        this.$nextTick(() => {
            this.Height = this.Height;
            setTimeout(()=>{
              this.Height = obj.height-300;
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
            this.form.headerId = newVal.payHead.id;
            this.new = false; //不需要在清单导入时备份
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
            this.new = true; //需要在清单导入时备份
        }
    },
    updates (row) {  //新建模式与修改模式的预览修改数据呈现函数
          this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;

          try {
              let headsArr = this.$excel.Package(row.payHead.tPayHeadRows,row.payHead.refCol,row.payHead.refRow);
              this.PackHeader = [...headsArr]; //深拷贝
              this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
              this.refreshTable(); //刷新表格布局
              //调用表格公式解析 存储
              this.formula = this.$excel.FormulaAnaly([...this.col]);
              //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
              this.lastHeader = this.$excel.BikoFoArr([...this.col]);
              this.hd = Object.keys(this.lastHeader); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
          } catch (error) {
              console.log(error)
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
              this.list = this.$excel.ListAssemble(row.payRowList	); //组装清单表格数据
              this.findList(); //调用滚动渲染数据
              this.ResetList = XEUtils.clone(this.list, true); //深拷贝 用来重置使用
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
        this.$post('/head/allpay',{tenderId, judge:0})
        .then((response) => {
            this.form.headerList = response.data.payHeadList;
            console.log('this.form.headerList')
            console.log(this.form.headerList)
            console.log('this.payList')
            console.log(this.payList)
            //此处调用限制选择表头函数参数（清单类型,全部清单列表，全部表头列表） 表头列表返回（limit）属性 
            this.$excel.limitHeader('tPay', this.payList, this.form.headerList); 

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
          let data = response.data.onehead,
          headsArr = this.$excel.Package(data['tPayHeadRows'],data.refCol,data.refRow);
          this.PackHeader = [...headsArr]; //拷贝
          this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
          //调用表格公式解析 存储
          this.formula = this.$excel.FormulaAnaly([...this.col]);

          //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
          this.lastHeader = this.$excel.BikoFoArr([...this.col]);
          this.hd = Object.keys(this.lastHeader); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
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
          this.refreshTable(); //刷新表格布局
          this.loading = false;
          this.list.length = 0;

          //调用表格公式解析 存储
          this.ResetList = null; //更换表头时需清空备份数据
          this.RowDelList = null; //清空存放删除集合数据
          this.new = true; //需备份数据
          this.OneToPay( data.id ); // 调用相对应的累计支付清单内容
      })
    },
    OnePay (id) { //支付清单id
        //此处请求一个审批单的一个支付清单
        this.$post('/pay/getonerow',{ id })
            .then((response) => {
              console.log(response)
            let data = response.data.pay;
            if (!data && !data.payRowList && !data.payHead.tPayHeadRows ) return this.loading = false;
            let headsArr = this.$excel.Package(data['payHead'].tPayHeadRows,data['payHead'].refCol,data['payHead'].refRow);
            this.PackHeader = [...headsArr];
            this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
            this.refreshTable(); //刷新表格布局
            //调用表格公式解析 存储
            this.formula = this.$excel.FormulaAnaly([...this.col]);

            //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
            this.lastHeader = this.$excel.BikoFoArr([...this.col]);
            this.hd = Object.keys(this.lastHeader); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）

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
            this.list = this.$excel.ListAssemble(data.payRowList); //组装清单表格数据;
            this.findList(); //调用滚动渲染数据
            this.ResetList = XEUtils.clone(this.list, true); //深拷贝 用来重置使用
            
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
          console.log('/totalpay/by/payheadid请求关联的一个累计支付清单')
          console.log(response)
          let data = response.data.totalpay,
          arr = []; 
          if (data && data.totalpayRowList && data.totalpayRowList.length >0 ) {
              arr = this.$excel.ListAssemble(data.totalpayRowList);  //组装清单
          }else{
              this.OneTometerage(id); //调用请求相关累计计量清单内容组装函数
              return this.totalpayRowList = arr;
          }
          this.totalpayRowList = arr;
          if (data && data.totalpayHead && data.totalpayHead.tTotalpayHeadRows && data.totalpayHead.tTotalpayHeadRows.length >0 ) {
              let headsArr = this.$excel.Package(data['totalpayHead'].tTotalpayHeadRows,data['totalpayHead'].refCol,data['totalpayHead'].refRow),
              Col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
              // //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
              this.totalpayCol = this.$excel.BikoFoArr([...Col]);
          }
            this.OneTometerage(id); //调用请求相关累计计量清单内容组装函数
        }).catch(e => {
            console.log('/totalpay/by/payheadid请求关联的一个累计支付清单----出错')
            console.log(e)
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
          console.log('/totalmeterage/by/payheadid请求相对应的累计计量清单数据')
          console.log(response)
          let data = response.data.totalmeterage,
          arr = []; 
          if (!data) {
              this.tometerageRowList = arr;
              return this.importfxx(); //调用支付清单内容组装函数
          }
          this.tTotalmeterageId = data.id; //累计计量清单id
          if (data && data.totalmeterageRowList && data.totalmeterageRowList.length >0 ) {
              arr = this.$excel.ListAssemble(data.totalmeterageRowList);  //组装清单
          }
          this.tometerageRowList = arr;

          this.importfxx(); //调用支付清单内容组装函数
        }).catch(e => {
            this.importfxx(); //调用支付清单内容组装函数
            console.log('/totalmeterage/by/payheadid请求相对应的累计计量清单数据------出错')
            console.log(e)
            this.$message({
              type: 'info',
              message: '请求相对应的累计计量清单数据发生错误！'+e
            });
        });
    },

    importfxx() { //清单导入函数
        this.loading = true;
        this.hd.length = this.list.length = 0; //归为初始化状态
        this.startTime = Date.now(); 
        // 先生成一个完整表格数据
        this.list = [];
        let hd = Object.keys(this.PackHeader[0]), //用来所需要的所有列(obj)（属性）名
        patt1=/[A-Z+]*/g;
        for (let index =0; index < 1; index++) {   //生成一行支付清单
            this.list[index] = {};
            for (let i = 0; i < hd.length; i++) {
              this.list[index][hd[i]] = {attribute: null,colNum: hd[i],edit: "N",formula:null,td:'',tdColspan: 1,tdRowspan: 1,trNum:index+1,upload: 1 };
            }
        }
        let cols = [...this.col],
        sumArr = this.$excel.BikoFoArr(cols); //截取获取表格实际对应所有列最后一层的表头列 object
        let header = Object.keys(sumArr); //用来所需要的所有列(obj)（属性）名
        for (let index = header.length -1; index >= 0; index--) { //将对应列数据加到空数组数据那里
            let row = sumArr[header[index]];
            if (row.attribute && row.attributeValue && row.attributeValue !=="" && (row.attribute === "totalpay-pay" || row.attribute === "totalmeterage-head-total") ) {
                let str = row.attributeValue,
                colName = str.match(patt1)[0],
                Rlist = this.list[0][row.colNum];
             
                if (row.attribute === "totalpay-pay" ) {
                    try {
                          // console.log('进来了totalpay-pay++++++++++++')
                          // console.log(this.totalpayCol)
                          // console.log(this.totalpayRowList)
                          // this.list[a][row.colNum] = {...data[a][colName]};
                          let topayheader = Object.keys(this.totalpayCol); //用来所需要的所有列(obj)（属性）名
                          if (topayheader && topayheader.length>0 && this.totalpayRowList && this.totalpayRowList.length && this.totalpayRowList.length > 0) {
                              console.log('有没有进去这个if判断-----------topayheader && topayheader.length>0--------')
                              for (let index = topayheader.length -1; index >= 0; index--){
                                  // let ToPayrow = this.totalpayCol[topayheader[index]],
                                  // Tostr = ToPayrow.attributeValue,
                                  // TocolName = str.match(patt1)[0];
                                    let ToPayrow = this.totalpayCol[topayheader[index]],
                                    Tostr = ToPayrow.attributeValue;
                                    if (ToPayrow.attribute!== "pay-total") {
                                        console.log('属性不对')
                                        continue;
                                    }
                                    let TocolName = Tostr.match(patt1)[0];
                                  if (Tostr && Tostr !=="" ) {
                                      // console.log('有没有进去这个if判断----------ToPayrow.attribute === "pay-total" -====TocolName +++ colName')
                                      // console.log(TocolName,'   ',colName)
                                      if (TocolName === colName) {  //属性值两对应
                                          console.log(TocolName,' 进来值相等了  ',colName)
                                          this.list[0][row.colNum] = this.totalpayRowList[0][ToPayrow.colNum];
                                          if (!this.list[0][row.colNum].td) this.list[0][row.colNum].td='0';
                                          console.log(this.totalpayRowList[0][ToPayrow.colNum])
                                          delete this.list[0][row.colNum].id;
                                          break;
                                      }
              
                                  }
                              }
                            
                              console.log('进来了totalpay-pay-----Rlist')
                              console.log(this.totalpayRowList,this.totalpayCol)
                          }else{  //无数据默认为0
                              Rlist.td = 0;
                              console.log('进来了totalpay-pay-----Rlist ----为0')
                              // console.log(this.totalpayRowList,this.totalpayCol)
                          }
                      } catch (error) {
                          this.$message({ message: `row.attribute === "totalpay-pay" 处理的时候数据出错 默认单元格为0处理。${e}`, type: 'error', duration: 4000, showClose: true })
                          console.log('row.attribute === "totalpay-pay" 处理的时候数据出错'+e)
                          Rlist.td = 0;
                      }
                    
                  }else if (row.attribute === "totalmeterage-head-total") {
                      try { 
                            console.log('进来了totalmeterage-head-total')
                            //当属性值等于累计计量对应的计量清单。目的是对应累计计量清单的值，但通过计量清单做对应。此处因查询有无累计计量清单无的话，为0；
                            if (this.tometerageRowList  && this.tometerageRowList.length && this.tometerageRowList.length>0) {

                                let sumTd = [];
                                for (let d = this.tometerageRowList.length -1; d >= 0; d--) {
                                    // console.log('this.tometerageRowList[d][colName].td')
                                    // console.log(this.tometerageRowList[d][colName].td)
                                    sumTd.push(this.tometerageRowList[d][colName])
                                }
                                Rlist.td = XEUtils.sum(sumTd, 'td');
                                Rlist.td = this.$excel.Count(Rlist.td);
                               
                            }else{  //无数据默认为0
                                Rlist.td = 0;
                                // console.log('进来了totalpay-pay-----Rlist ----为0')
                                // console.log(this.tometerageRowList,colName)
                            }
                      } catch (e) {   //如果数据对不上直接为0
                            console.log('totalmeterage-head-total 处理的时候数据出错'+e)
                            this.$message({ message: `row.attribute === totalmeterage-head-total 处理的时候数据出错 默认单元格为0处理。${e}`, type: 'error', duration: 4000, showClose: true })

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
            console.log('this.list---------------');
            console.log(this.list);
            this.$excel.Formula(this, this.list, this.formula);  //调用公式计算
            this.findList(); //调用滚动渲染数据
            if (this.new) { //需要在新建清单时才需要备份数据
                this.ResetList = XEUtils.clone(this.list, true); //深拷贝 用来重置使用
                this.new = false;
            }
        } catch (e) {
            this.loading =false;
            this.$message({ message: `遇到问题了呀,清单导入失败,请重试。${e}`, type: 'error', duration: 6000, showClose: true })
        }
    },
    cell_click(row, column, cell, event){ //单元格点击编辑事件
        this.$root.state = false;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
        if(this.approval.state === 1 && this.uplist.id )return false; //审批单已通过，并且不是新建清单的话不许做修改。
        this.editRow !== null && this.editRow ? this.editRow.edit = "N" :this.editRow; //清除上一个单元格编辑状态
        if (column.property) {
        // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
            let str = column.property,
            colName = str.substr(0,str.indexOf(".td"));
            //判断是否哪种属性类型允许单元格编辑
            if (this.lastHeader[colName].attribute !== 'pay') return false;
            this.editRow = row[colName];
            row[colName].edit = "Y";  //Y为编辑模式N为只读状态     
        }  
    },
    // cell_select ({row, column, rowIndex, columnIndex}){ //单元格样式
    //     if (column.property) {
    //         let str = column.property,
    //         colName = str.substr(0,str.indexOf(".td"));

    //         //判断是否哪种属性类型允许单元格编辑
    //         if (this.lastHeader[colName].attribute !== 'pay') return false;
    //         return {'background':'#FFFACD'}
    //     }  
    //     return {};
    // },
    // arraySpanMethod({ row, column, rowIndex, columnIndex }) {   //单元格合并处理
    //     if (columnIndex >1) {  //带选择框的情况
    //         if (row[this.hd[columnIndex-2]]) {
    //             return [row[this.hd[columnIndex-2]].tdRowspan, row[this.hd[columnIndex-2]].tdColspan]
    //         }
    //     }
    //     return [1, 1]
    // }, 
    findList () { //表格滚动渲染函数
        this.loading = true;
        this.$nextTick(() => {
            this.$refs.elxEditable1.reload([])
            setTimeout(() => {
                this.$refs.elxEditable1.reload(this.list);
                this.$root.state = true;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
                
                this.loading = false;
                this.$message({ message: `成功导入 ${this.list.length} 条数据 耗时 ${Date.now() - this.startTime} ms `, type: 'success', duration: 6000, showClose: true })
                this.tViewSize();
            }, 300)
        });

    },
    getSummaries (param) {  //合计
        // if (!this.$refs.elxEditable1 || !this.showHeader) return [];
        // let list = this.$refs.elxEditable1.getRecords();//获取表格的全部数据;
        // if (this.PackHeader.length ===0 && list.length ===0) return [];
        // return this.$excel.getSummaries(this.PackHeader, list, param,this.totalobj);//调用合计尾行。
        
        if (this.$root.state && this.list && this.list.length >0) {
            console.log('调用了合计');
            this.totalobj = this.$excel.Total(this.list, this.PackHeader); //调用合计计算
            this.$root.state = false;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
        }
        let { columns, data } = param,
        sums = [];
        if (!this.totalobj) return sums;
        columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '合计'
                // return
            }else if(index >2){
                sums[index] = this.totalobj[column.property];
            }
        })
        return sums;
    },
    Abandon () {  //放弃更改
        this.list = XEUtils.clone(this.ResetList, true); //深拷贝
        this.$nextTick(() => {
            this.$refs.elxEditable1.reload([]);
            this.$refs.elxEditable1.reload(this.list);
            this.RowDelList = []; //放弃更改后  删除数组清空
            this.$root.state = true;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
        })
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
            payHead = this.payHead, //表头数据
            payRowList = [], //清单内容
            payRowAddList = [],  //增
            payRowDelList = [], //删
            payRowAltList = [];  //改

            //查询上一次修改有无这个集合  ，有的话合并两个数组
            if (this.uplist['payRowDelList'] && this.uplist['payRowDelList'].length >0) {
                  console.log('已经开始二次修改删除操作 this.RowDelList,   this.uplist[payRowDelList]----------')
                  console.log(this.RowDelList,this.uplist['payRowDelList'])
                  payRowDelList = this.RowDelList.concat(this.uplist['payRowDelList']);  //删
             }else{
                  payRowDelList = this.RowDelList;
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
                            listRows['attribute'] = '';                  
                            listRows['upload'] = 1;    
                            if (!listRows.id) {  //无id则视为新增，新增到payRowAddList
  
                                payRowAddList.push(listRows);
                            }else if ( listRows['id'] && (list[index]['alter'] || listRows['alter']) ) {   //有id 与 alter 视为已修改过的数据 新增到payRowAddList
                                listRows['alter'] = "Y";
                                payRowAltList.push(listRows);
                            }
                            payRowList.push(listRows);
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
                tPayHeadId: this.form.headerId,    //清单表头id
                processId: this.approval.id,         //审批单流程id
                sysOrder: '',                   //系统序号  预留，暂不使用
                sysNum: '',                    //系统编号  预留，暂不使用
                name: this.form.name,               //清单名称
                num: this.form.num,                 //清单编号
                tenderId: this.tender.id,           //标段id
                type: 'pay',                 //清单类别为”pay”
                payRowAddList,  //增
                payRowDelList,  //删
                payRowAltList,  //改
                enter:list.length>0?1:0,
                tender:this.tender,
                saveTime:new Date(),
                organizationId: this.organizationId,  //部门id
                saveEmployee:{name:this.$store.state.username}
            };
            if (this.uplist.id)obj.saveTime = this.uplist.saveTime; //设置时间
            if (this.mode !=='show') {
                obj['payHead'] = payHead; //表头数据
                obj['payRowList'] = payRowList; //清单内容
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
                            this.payList.push(obj);
                            this.list.length =0;
                            this.$message({ message: `已为你保存 ${payRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                            return this.saveShow();                      
                    } 
                }else if (this.uplist && (this.uplist.id || this.uplist.saveTime)) {  //当前属于修改清单====
                    switch(this.mode) {
                        case 'show':  //为 show模式
                            this.loading = false;
                            return this.$message({ type: 'success',message: '当前为show模式，在joinParent=true 时 不支持更改清单！' })
                            break;
                        default:  //为 alter模式与 new模式 
                            for (let index = this.payList.length -1; index >=0; index--) {
                                let ListRow = this.payList[index];
                                if(ListRow.saveTime === this.uplist.saveTime){
                                    ListRow.tPayHeadId = this.form.headerId;
                                    ListRow.payRowList = payRowList;
                                    ListRow.payRowAddList = payRowAddList;  //增
                                    ListRow.payRowDelList = payRowDelList;  //删
                                    ListRow.payRowAltList = payRowAltList;  //改
                                    ListRow.name = this.form.name;
                                    ListRow.num = this.form.num;
                                    ListRow.payHead = payHead;
                                    ListRow.updateTime = new Date();
                                    if (ListRow.id && ListRow.id === this.uplist.id && this.mode === 'alter') { //此时要把修改后的有id的清单放入修改清单列表
                                        ListRow.alter ='Y'; //标记为修改
                                    }
                                    this.list.length =0;
                                    this.$message({ message: `已为你修改---保存 ${payRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                                    return this.saveShow();
                                }
                                
                            }
                            
                    } //switch的 }
                }
                
            }else{    //不接入父组件的情况
                  let parameter = {
                      payAddList: [], //增清单
                      payDelList: [],   //删清单
                      payAltList: []  //改清单
                  } 
                  if (this.uplist && !this.uplist.id ) {  //当前为新建清单
                      switch(this.mode) {
                          case 'show':  //为show模式
                              parameter.payAddList.push(obj);
                              this.saveOneList( parameter ); //调用网络保存函数
                              this.list.length =0;
                              break;
                          default:  //为 alter模式与 new模式    
                              this.loading = false;
                              return this.$message({ type: 'success',message: '当前为'+this.mode+'模式，在joinParent=false 时 不支持新建清单！' })
                                                 
                      } 
                  }else{  //当前为修改清单
                      switch(this.mode) {
                          case 'show':  //为show模式
                              obj.id = this.uplist.id;
                              parameter.payAltList.push(obj);
                              this.saveOneList( parameter ); //调用网络保存函数
                              this.list.length =0;

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
        this.$post('/pay/update',obj )
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
    exportList () {
        /*
        将清单导出为表格
        param tableData: 清单内容this.list 
        param headerData: 表头内容this.PackHeader
        param totalobj: 例如this.totalobj,  合计尾行计算结果若无则 传false
        param lastHeader: 例如this.lastHeader, 表头最后一层 对象嵌套对象{A:{}}
        param filterVal: 所有列 例如this.hd  
        param filename: 文件名
        */
        this.$excel.exportTable(this.list, this.PackHeader, false, this.lastHeader, this.hd, 'filename')
    },


  }
}
</script>

<style scoped>
@import '../../modules/Tablestyle.css';
</style>