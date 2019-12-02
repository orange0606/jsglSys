
<template>

<div
    v-loading="loading"
    element-loading-text="正在加速处理数据"
    element-loading-spinner="el-icon-loading"
    class="_compbox"
  >
    <div v-if="print_show">
        <div class="click-table11-oper">
        <el-form :inline="true" :model="form" size="mini">
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
            <el-form-item label="表头标志">
                <el-select :disabled="true" v-model="form.collect" @change="oneHeader" placeholder="请选择表头">
                    <el-option label="普通表头" :value="0"></el-option>
                    <el-option label="汇总表头" :value="1"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        </div>

        <input id="upload" type="file" @change="importfxx()" ref="input" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        <div class="click-table11-oper" >
        <el-button v-if="joinParent && mode==='show' || (approval.state === 1)?false:true" type="primary" size="mini" @click="impt">导入表格</el-button>
        <el-button v-if="joinParent && mode==='show' || (approval.state === 1)?false:true" type="warning" size="mini" @click="submitEvent">完成</el-button>
        <el-button v-if="joinParent && mode==='show' || (approval.state === 1)?false:true" type="success" size="mini" @click="insertEvent">新增</el-button>
        <el-button v-if="joinParent && mode==='show' || (approval.state === 1)?false:true" type="success" size="mini" @click="cccconslo">打印一下啊</el-button>
        <el-button v-if="joinParent && mode==='show' || (approval.state === 1)?false:true" type="danger" size="mini" @click="RemoveSelecteds">删除选中</el-button>
        <el-button v-if="joinParent && mode==='show' || (approval.state === 1)?false:true" type="info" size="mini" @click="Abandon">放弃更改</el-button>
        
        <el-button type="success" size="mini" @click="exportList">导出</el-button>
        <el-button type="success" size="mini" @click="preview">预览打印</el-button>
        </div>
           
        <div :style="{height: Height+'px'}" class="table_box">
            <elx-editable
            ref="elxEditable1"
            class="scroll-table4 click-table11"
            height="100%"
            size="mini"
            :show-header="showHeader"
            :header-cell-style="getRowClass"
            v-if="showHeader"
            @cell-click ="cell_click"
            @row-contextmenu="rightClick"
            :row-style="RowCss"
            show-summary
            :summary-method="getSummaries"
            :edit-config="{render: 'scroll', renderSize: 65}">
            
            <elx-editable-column type="selection" align="center" width="45" :key="$excel.randomkey(this)" ></elx-editable-column>
            <elx-editable-column type="index" width="60" align="center" :key="$excel.randomkey(this)" ></elx-editable-column>
            <!-- 此处使用多级表头嵌套组件 -->
            <my-column v-for="(item,index) in col" :key="index" :col="item" :Formula="formula" type="original" :lastHeader="lastHeader" :hd='hd' :list="form.collect?list:null" :collect="form.collect" ></my-column>
            </elx-editable>
            <div v-show="menuVisible">
                <ul id="menu" class="menu" ref="menu">
                    <li class="menu__item"  @click="setAtt()">属性设置</li>
                    <li class="menu__item" @click="setAtt('auto')" >公式(自动填写)</li>
                    <li class="menu__item" @click="setAtt('manual')">公式(手动填写)</li>
                </ul>
            </div>

            <p style="color: red;font-size: 12px;margin:10px 0 0px 0;text-align:left;">注意：审批单通过后不许再做任何修改！</p>
        </div>
    </div>
    <div v-else>
        <printing :tableData='tableData' :print_show.sync="print_show" ></printing>
    </div>
    <!-- 单元格内属性设置 -->
    <el-drawer
        title="请选择相关表头单元格"
        :before-close="handleClose"
        :visible.sync="show_Drawer"
        direction="ltr"
        size="80%"
        custom-class="demo-drawer"
        ref="drawer"
        >
        <div v-if="editRow && editRow.attribute !=='auto' && editRow.attribute !=='manual'" class="demo-drawer__content" style="margin: 0 50px;">
            <p style="margin:10px 0 10px 0">{{editRow && editRow.td?editRow.td:''}}</p>
            <p style="margin:10px 0 10px 0">当前位置 : {{editRow.colNum+editRow.trNum}}</p>
            <div style="margin:10px 0 20px 0">
            <el-select size="mini" v-model="editRow.attribute" clearable @change="colattChange(editRow.attribute)" placeholder="请选择属性">
                <el-option label="原清单的合计" value="auto_original_sum"></el-option>
                <el-option label="变更（本期全部表）的合计" value="auto_change_sum"></el-option>
                <el-option label="累计变更的合计" value="auto_totalchange_sum"></el-option>
                <el-option label="新清单的合计" value="auto_update_sum"></el-option>
                <el-option label="计量（本期全部表）的合计" value="auto_meterage_sum"></el-option>
                <el-option label="累计计量的合计" value="auto_totalmeterage_sum"></el-option>
                <el-option label="支付（本期全部表）的合计" value="auto_pay_sum"></el-option>
                <el-option label="累计支付的合计" value="auto_totalpay_sum"></el-option>
            </el-select>
            </div>
            <el-input style="margin:10px 0 20px 0" size="mini" placeholder="请输入公式" v-model="editRow.formula" clearable></el-input>
            <allhead v-if="editRow.attribute && editRow.attribute !=='auto' && editRow.attribute !=='manual' " :headRowSelected='headRowSelected' :joinParent="true" :tenderId="tender.id" :type="AllHeaderType" ></allhead>
            <div class="demo-drawer__footer">
            <el-button @click="show_Drawer = false" size="mini" >取 消</el-button>
            <el-button type="primary" @click="addAttrbute(editRow.formula)" size="mini" >确 定</el-button>
            </div>
        </div>
    </el-drawer>
    <!-- 单元格内公式设置 -->
    <div class="formula" v-if="formula_state">
        <p style="margin:10px 0 10px 0;text-align:left;">单元格内容 : {{editRow && editRow.td?editRow.td:''}}</p>
        <p style="margin:10px 0 10px 0;text-align:left;">当前位置 : {{editRow.colNum+editRow.trNum}}</p>
        <div >
            <el-input placeholder="请输入公式" v-model="editRow.formula" ref="inputRef" class="input-with-select" size="mini">
                <el-select v-model="editRow.attribute" slot="prepend" placeholder="请选择" @change="editRow.formula=''">
                    <el-option label="公式(自动填写 (A3-B3)*3C )" value="auto"></el-option>
                    <el-option label="公式(手动填写 SUM(A3:B6) )" value="manual"></el-option>
                </el-select>
                 <el-button slot="append" type="primary" @click="addFormula(editRow.formula)" >完 成</el-button>
            </el-input>
            <!-- <el-button  size="mini" >取 消</el-button> -->
        </div>
    </div>
    
  </div>
</template>

<script>
import MyColumn from './MyColumn';
import allhead from '../OptHead/AllHead';
import printing from '../MultiplexCom/Printing';
import XEUtils from 'xe-utils';

export default {
  name: 'InvenEdit',
  components: {
    MyColumn,
    allhead,
    printing
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
    originalList:{  //父组件的清单列表
      type: Array,
    },
    joinParent:{   //接入父组件标记，当joinParent标记为true时表示连接到父组件并接受父组件的参数；当joinParent为false时组件独立调试使用。
    },
    organizationId:{   //部门id
    },
    refresh:{ //显示此组件的变量
    }
  },
  data () {
    return {
      form:{
        name:'',
        num:'',
        headerId:'',
        collect:0,
        headerList:[],//表头列表
      },
      showHeader:true,
      hd:[],
      originalHead:null, //用来存储表头信息
      startTime:null,
      loading: false,
      editRow:null, //单元格编辑的存储上一个已点击单元格数据
      rest:[],
      formula:{}, //存储表头的公式数据
      row: null,//公式字符串转代码的全局变量
      col: [],//已对PackHeader再次组装的多级表头数据.
      PackHeader:[],//已组装的表头数据
      list: [], //表格数据
      RowDelList: [],//记录被删除有id的单元格
      lastHeader: null,
      totalobj: {},//合计尾行计算结果存储
      ResetList: [], //清单初始值（重置数据时用）
      new: false, //判断是否新建清单 默认为否（重置数据时候用来判断是否要存储备用数据）
      Height: 400,
      Width:100,
      tableData:{},
      print_show:true,  // false则显示打印预览组件
      menuVisible:false,
      headRowSelected:{ //属性存储
          headRowStr:'',
          refresh: true,
      },
      show_Drawer: false, //是否显示抽屉选择表头单元格组件
      formula_state: false, // 公式输入状态
    }
  },
    computed:{
        AllHeaderType:function(){
            let type = 'original';
            if (this.editRow && this.editRow.attribute) {
                switch (this.editRow.attribute) {
                    case 'auto_original_sum':
                        type = 'original';
                        break;   
                    case 'auto_change_sum':
                        type = 'change';
                        break;
                     case 'auto_totalchange_sum':
                        type = 'totalchange';
                        break;
                    case 'auto_update_sum':
                        type = 'update';
                        break;
                    case 'auto_meterage_sum':
                        type = 'meterage';
                        break;
                    case 'auto_totalmeterage_sum':
                        type = 'totalmeterage';
                        break;
                    case 'auto_pay_sum':
                        type = 'pay';
                        break;                    
                    case 'auto_totalpay_sum':
                        type = 'totalpay';
                        break;
                }
                console.log(type)
                return type;
            }
            return type
        }
    },
    watch: {
        uplist: function(newVal,oldVal){  //子组件返回来的数据
            this.print_show = true;
            //此处可进行判断，然后进行清单导入
            this.upif( newVal );//此处调用父组件传来的清单数据判断处理函数
        },
        '$store.state.clientSize': {
            handler: function() {
                this.tViewSize();
            }
        },
        print_show: function(newVal,oldVal) {    //监听显示预览组件为true时则重新加载清单
            if (newVal) {
                this.findList();
            }
        },
        'headRowSelected.headRowStr': function(newVal, oldVal) {    //用于原清单属性设置
     
            if (this.editRow) {
                this.$set(this.editRow, 'formula', newVal)
                this.$set(this.editRow, 'alter', 'Y')
                // console.log('newVal ： '+newVal)
                // console.log('已经修改过了formula ： '+this.editRow.formula)
                // console.log('已经修改过了alter ： '+this.editRow.alter)
                
            }
        }
    },
    mounted(){
        this.tViewSize();
        // document.getElementById('menu').addEventListener(eventType, fn, false) 
    },
    created () {
        this.allHeader( this.tender.id );//调用请求一个标段的所有变更表头
        this.upif( this.uplist );//此处调用父组件传来的清单数据判断处理函数
        this.$root.state = true;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
    },
    beforeDestroy () {
        // this.foo();//清除监听鼠标右键事件
    },
    methods: {
        cccconslo () {
            console.log('----------打印一下this.list--------')
            console.log(this.list)
         
        },
        addAttrbute (formula) { //添加合计属性并计算按钮
            this.$refs.drawer.closeDrawer(); //关闭合计属性 抽屉 组件
            console.log('打印一下_formula :  '+formula);
            console.log('打印一下全部集合')
            console.log(this.originalList)

        },
        addFormula (formula) {  //添加公式并计算按钮
            this.formula_state = false;
            if (formula) {
                let list = this.list; // 配合公式解析用
                try {
                    let td = eval(this.$excel.Summary_Formula_analysis(formula));//此处调用公式解析
                    this.$set(this.editRow, 'td', td?td:0); 
                    // this.editRow.td = td?td:0;
                } catch (error) {
                    this.$message({
                    type: 'info',
                    message: `发生错误！ 请检查修改或者公式，位置 :  ${this.editRow.colNum+this.editRow.trNum}`
                    });
                    console.log(error)
                    // this.editRow.td = 0;
                    this.$set(this.editRow, 'td', 0); 
                }
                this.$root.state = true;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
            }
        },
        handleClose(done) {
            done();
        },
        colattChange (New) {    //单元格属性选择框chang事件
            this.$nextTick(() => {
                this.$set(this.editRow, 'formula', '');//属性切换后 属性值formula得清空
            })
        },
        setAtt ( str ) { //单元格鼠标右键后显示的菜单栏 设置属性
            let mode = str?str:'';
            if (this.editRow) {
                if (!this.editRow.formula) {
                    this.$set(this.editRow, 'formula', '');
                    this.$set(this.editRow, 'attribute', mode); 
                }else{
                    if (mode) {
                        this.$set(this.editRow, 'attribute', mode); 
                        this.formula_state = true;
                    }else{
                        if (this.editRow.attribute && (this.editRow.attribute==='auto' || this.editRow.attribute==='manual')) {
                            this.$set(this.editRow, 'attribute', '');
                            this.$set(this.editRow, 'formula', '');
                        }else{
                            this.$set(this.editRow, 'formula', '');
                            this.$set(this.editRow, 'attribute', mode);
                        }
                    }
                }
            }else {
                return false;
            }
            //展开抽屉组件 显示表头单元格选择组件

            // console.log('this.editRow.formula  : '+this.editRow.formula)
            // console.log('this.editRow')
            // console.log(this.editRow)
            if (!mode) {
                this.show_Drawer = true;    //显示组件
                this.$nextTick(() => {
                    this.$set(this.headRowSelected, 'headRowStr', this.editRow.formula); //把内容传入组件
                    this.$set(this.headRowSelected, 'refresh', true); //组件刷新（因不同的单元格属性值 字符串需要重新解析）

                })
            }else{
                this.formula_state = true;
            }
            
        },
        rightClick(row, column, event) {    //表格内容鼠标右键显示菜单栏
            event.preventDefault();//阻止系统默认事件
            if(this.approval.state === 1 || !this.form.collect)return false; //审批单已通过与不是汇总表头不允许右键，并且不是新建清单的话不许做修改
            if (this.formula_state) return false; //当前正在输入公式，不能切换单元格

            this.editRow && this.editRow.edit && this.editRow.edit === "Y" ? this.editRow.edit = "N" :this.editRow; //清除上一个单元格编辑状态
            var menu = document.querySelector('#menu')
            menu.style.left = event.clientX -60 + 'px'
            document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
            menu.style.top = event.clientY - 165 + 'px'
            this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
            this.$nextTick(() => {
                this.menuVisible = true // 显示模态窗口，跳出自定义菜单栏
            })
            if (column.property) {
                // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
                let str = column.property,
                colName = str.substr(0,str.indexOf(".td"));
                this.editRow = row[colName];
            }  
           
            
        },
        foo() { // 取消鼠标监听事件 菜单栏
            this.menuVisible = false;
            this.editRow && this.editRow.edit && this.editRow.edit === "Y" ? this.editRow.edit = "N" :this.editRow; //清除上一个单元格编辑状态
            document.removeEventListener('click', this.foo); // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
        },

        preview(){  //打印预览
            if (this.list.length > 500) {
                return this.$confirm('暂不支持在线打印超过 500 行的数据，请导出excel 文件再进行打印。此操作将导出文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        return this.exportList();
                    }).catch(() => {
                        return false
                });
                
            }
            this.print_show = false;
            this.tableData = {
                list: this.list,
                hd: this.hd,
                PackHeader: this.PackHeader,
                col: this.col,
                totalobj: this.totalobj,
            }
        },
        con(){
            console.log(this.totalobj)
        },
        getRowClass ({ row, column, rowIndex, columnIndex }) {  //表头样式
            if (column.property) {
                return {'background':'#FFFFE0'} //编辑区颜色
            }  
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
            console.log('----obj-------')
            console.log(obj)
            this.$nextTick(() => {
                this.Height = this.Height;
                setTimeout(()=>{
                this.Height = obj.height-180;
                this.loading = false;
                },100)
                
            });
        },
        upif ( newVal ) {   //处理父组件传来的值
            this.allHeader(this.tender.id); //请求该标段的全部计量清单表头列表
            this.RowDelList = []; //清空删除数组
            this.formula_state = false; //单元格公式输入框隐藏
            if (newVal && (newVal.id || newVal.saveTime) ) {  //此处为预览修改
                this.loading = true;
                this.form.name = newVal.name;
                this.form.num = newVal.num;
                this.form.headerId = newVal.originalHead.id;
                this.form.collect = newVal.originalHead.collect?newVal.originalHead.collect:0; // 保存表头标志
                console.log('this.form.collect')
                console.log(this.form.collect)
                console.log('newVal')
                console.log(newVal)

                
                this.new = false; //不需要在清单导入时备份
                switch(this.mode) {
                    case 'new': //此处为新建模式处理
                        return this.updates(newVal);
                        break;
                    case 'show': //此处为显示模式处理
                        return this.OneOriginal(newVal.id);
                        break;
                    case 'alter': //此处为修改模式处理
                        if (newVal.originalHead && newVal.originalHead.tOriginalHeadRows && newVal.originalRowList) {
                            return this.updates(newVal);
                        }else if (newVal.id){
                            return this.OneOriginal(newVal.id);
                        }
                        break;
                } 
            }else if(newVal && (!newVal.id && !newVal.saveTime)){ //此处为新建
                this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
                this.form.name = this.form.num = this.form.headerId = this.headerList =null;
                this.$nextTick(() => {
                    this.$refs.elxEditable1.reload([]);
                });
                this.new = false; //不需要在清单导入时备份
            }
        },
        updates (row) {  //新建模式与修改模式的预览修改数据呈现函数
            console.log('row')
            console.log(row)

            this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
            try {
                let headsArr = this.$excel.Package(row.originalHead.tOriginalHeadRows,row.originalHead.refCol,row.originalHead.refRow);
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
            this.originalHead = { //保存表头信息
                id: row.originalHead.id,
                name:row.originalHead.name,
                num: row.originalHead.num,
                collect: row.originalHead.collect
            }
            if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
                this.originalHead.refCol = row.originalHead.refCol;
                this.originalHead.refRow = row.originalHead.refRow;
                this.originalHead.tOriginalHeadRows = row.originalHead.tOriginalHeadRows;
            }
            try {
                 
                this.list = this.$excel.ListAssemble(row.originalRowList); //组装清单表格数据
                // return console.log(this.list)

                for (let index = this.list.length -1; index >=0; index--) { //给行数据加上索引
                    this.list[index]['seq'] = index;
                }
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
        allHeader (tenderId) {  //请求该标段的全部变更清单表头列表
            console.log('调用了那')
            this.$post('/head/alloriginal',{tenderId, judge: 0})
            .then((response) => {
                console.log('response222222222222')
                console.log(response)
                this.form.headerList = response.data.originalHeadList;
                //此处调用限制选择表头函数参数（清单类型,全部清单列表，全部表头列表） 表头列表返回（limit）属性 
                this.$excel.limitHeader('original', this.originalList, this.form.headerList); 
            }).catch(e => {
                this.$message({
                type: 'info',
                message: 'id发生错误！'+e
                });
            });
        },
        oneHeader (id) {  //请求单个表头 表头id  表头类型
            this.$post('/head/getone',{id,type:'original'})
                .then((response) => {
                this.ResetList = []; //更换表头时需清空备份数据
                this.RowDelList = []; //清空存放删除集合数据
                this.new = true; //需备份数据
                this.list.length = this.hd.length = 0;
                let data = response.data.onehead,
                headsArr = this.$excel.Package(data['tOriginalHeadRows'],data.refCol,data.refRow);
                this.PackHeader = [...headsArr]; //拷贝
                this.refreshTable(); //刷新表格布局
                this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
                this.lastHeader = this.$excel.BikoFoArr([...this.col]);
                this.hd = Object.keys(this.lastHeader); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
                this.originalHead = { //保存表头编号与名称
                id: data.id,
                name: data.name,
                num: data.num
                }
                this.form.collect = data.collect?data.collect:0;  //添加表头标志
  

                if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
                    this.originalHead.refCol = data.refCol;
                    this.originalHead.refRow = data.refRow;
                    this.originalHead.tOriginalHeadRows = data.tOriginalHeadRows;
                    this.originalHead.collect = data.collect;
                }
                this.loading = false;

                //调用表格公式解析 存储
                this.formula = this.$excel.FormulaAnaly([...this.col]);
            })
        },
        OneOriginal (id) { //原清单id
            this.loading = true;
            //此处请求一个审批单的一个原清单
            this.$post('/original/row/getone',{ id })
                .then((response) => {
                this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
                console.log('/此处请求一个审批单的一个原清单-----------------------')
                console.log(response)
                let data = response.data.original;
                // this.list = response.data.originalList.list;
                if (!data && !data.originalRowList) return this.loading = false;
                let headsArr = this.$excel.Package(data['originalHead'].tOriginalHeadRows,data['originalHead'].refCol,data['originalHead'].refRow);
                this.PackHeader = [...headsArr];

                this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
                this.refreshTable(); //刷新表格布局
                //调用表格公式解析 存储
                this.formula = this.$excel.FormulaAnaly([...this.col]);

                //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
                this.lastHeader = this.$excel.BikoFoArr([...this.col]);
                this.hd = Object.keys(this.lastHeader); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
                this.originalHead = { //.保存表头信息
                    id: data.originalHead.id,
                    name: data.originalHead.name,
                    num: data.originalHead.num,
                    collect: data.originalHead.collect
                };
                this.form.collect = data.originalHead.collect?data.originalHead.collect:0;//保存表头标志

                if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
                this.originalHead.refCol = data.originalHead.refCol;
                this.originalHead.refRow = data.originalHead.refRow;
                this.originalHead.tOriginalHeadRows = data.originalHead.tOriginalHeadRows;
                }
                this.loading = false;
                this.list = this.$excel.ListAssemble(data.originalRowList); //组装清单表格数据
                this.findList(); //调用滚动渲染数据
            }).catch(e => {
                this.loading = false;
                console.log(e)
                this.$message({
                    type: 'info',
                    message: '233发生错误！'+e
                });
            })
        }, 
        impt(){ //button 按钮调用input文件选择事件
            if (this.hd && this.hd.length ==0) return this.$message({ message: '请先选择表头', type: 'warning', duration: 3000, showClose: true }); 
            this.$refs.input.value = '';    //清除文件名字
            this.$refs.input.click();
        },
        importfxx() { //导入函数
            this.loading = true;
            this.startTime = Date.now();
            this.$excel.Imports(data=>{ //数据导入组装函数
                this.list.length = 0; //归为初始化状态
                try { //先判断表头是否一致
                    // console.log(data);
                    let hd = [...this.hd], //用来所需要的所有列(obj)（属性）名
                    datahd = Object.keys(data[0]);
                    if ( datahd.length < hd.length ) {
                        this.loading = false;
                        hd.length = datahd.length = 0;
                        return this.$message({ message: '您导入的excel数据表头与清单表头不一致，请确认修改后再导入', type: 'warning', duration: 6000, showClose: true });
                    }else{
                        hd.length = datahd.length = 0;
                    }
                    let arr = [...this.PackHeader],
                    arrlen = arr.length = arr.length-1,
                    dataSplice = data.splice(0,arrlen), //去掉表头并且用来作判断是否一致
                    ff = arr.some( function( item, index, array ){ //判断导入的清单表头与文件Excel清单表头如果是否相等
                        let hdsome = hd.some( function( val, i){ 
                            let headrs = array[index][val];
                            Rows = dataSplice[index][val];
                            return headrs.colNum !== Rows.colNum || headrs.td !== Rows.td || headrs.tdRowspan !== Rows.tdRowspan || headrs.tdColspan !== Rows.tdColspan || headrs.trNum !== Rows.trNum;
                        }); 
                        return hdsome;
                    }); 
                    if (ff) {
                        this.loading = false;
                        return this.$message({ message: '您导入的excel数据表头与清单表头不一致，请确认修改后再导入', type: 'warning', duration: 6000, showClose: true });
                    }
                    arr = hd = dataSplice = null; //释放内存
                } catch (error) {
                this.loading = false;
                return this.$message({ message: '您导入的excel数据表头与清单表头不一致，请确认修改后再导入', type: 'warning', duration: 6000, showClose: true });
                }

                //此处需要将去掉表头的剩余表格内容的行号更新为最新
                let collect = this.form.collect;
                console.log('collect')
                console.log(collect)
                if (collect==='0' || collect===0) {
                    console.log('1111111111111111')

                    for (let a = data.length-1; a >= 0; a--) {
                        console.log('1111111111111111')

                        for (let b = this.hd.length-1; b >= 0; b--) {
                            data[a][this.hd[b]].trNum = a+1;
                        }
                        
                    }
                }

                try {  //把数据载入表格
                    let listlen = this.list.length;
                    this.list = [...data];
                    for (let index = listlen -1; index >=0; index--) {
                        this.list[index]['seq'] = index;
                    }
                    this.findList();
                    data = null; //内存释放
                } catch (e) {
                    data = this.list = null;
                    this.loading =false;
                    // console.log(e);
                    this.$message({ message: `遇到问题了呀,表格导入失败,请检查表格。${e}`, type: 'error', duration: 6000, showClose: true })
                }
            })
        },
        cell_click(row, column, cell, event){ //单元格点击编辑事件
            
            if(this.approval.state === 1)return false; //审批单已通过，并且不是新建清单的话不许做修改
            if (this.formula_state) {   //公式输入框开启后
                if (column.property) {
                    let str = column.property,
                    colName = str.substr(0,str.indexOf(".td"));
                    let td = row[colName];
                    this.editRow.formula += td.colNum+td.trNum; //返回一个 单元格位置
                } 
                this.$nextTick(() => {
                    this.$refs.inputRef.focus()
                })
                return false; //当前正在输入公式，不能切换单元格
            }

            this.editRow && this.editRow.edit && this.editRow.edit === "Y" ? this.editRow.edit = "N" :this.editRow; //清除上一个单元格编辑状态
            if (column.property) {
                // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
                let str = column.property,
                colName = str.substr(0,str.indexOf(".td"));
                this.editRow = row[colName];
                if (this.editRow.edit && this.editRow.edit==='Y') return false;
                this.editRow.edit = "Y";  //Y为编辑模式N为只读状态
                // document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
            }  
        },
        RowCss({row, rowIndex}) {     // 定义changeCss函数，这样当表格中的相应行满足自己设定的条件是就可以将该行css样式改变
            if (!row['A'].id ) {
                return 'background:#f5ffe5'
            }
            return '';
        },
        findList () { //表格滚动渲染函数
            this.formula_state = false; //单元格公式输入框隐藏
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
            // console.log('this.$root.state11111111111')
            // console.log(this.$root.state)
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
        insertEvent () {
            if (!this.hd.length || this.hd.length===0) return false;
            let rest = this.$refs.elxEditable1.getRecords(),//获取表格的全部数据;
            restLen = rest.length,
            NewRow = {};
            for (let index = this.hd.length -1; index >= 0; index--) {
                NewRow['seq'] = restLen;
                NewRow[this.hd[index]]= {attribute: 'add',colNum: this.hd[index],edit: "N",formula:null,td: '', tdColspan: 1,tdRowspan: 1,trNum:restLen+1,upload: 1 };
            }
            console.log('打印一下NewRow 新增的一行')
            console.log(NewRow);
            // this.$refs.elxEditable1.insertAt(NewRow, -1);
            this.list.push(NewRow);
            this.$nextTick(() => {
                this.$refs.elxEditable1.reload([]);
                this.$refs.elxEditable1.reload(this.list);
            })

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
        RemoveSelecteds () {  //删除选中
            let selection = this.$refs.elxEditable1.getSelecteds(),
            seleLen = selection.length;
            console.log('seleLen')
            console.log(selection)
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
                console.log('this.RowDelList')
                console.log(this.RowDelList)
            }

        },
        Rowsort( sub ) { //删除清单表格单元格行内的时候对清单表格被影响行列号的有id的作修改标记与重新排列
            this.list = this.$refs.elxEditable1.getRecords();//获取表格的全部数据;
            try {
                for (let index = this.list.length -1; index >= 0; index--) {
                    if (sub > index) break;
                    this.list[index]['seq']=index;  //更新索引
                    for (let a = this.hd.length -1; a >= 0; a--) {
                        let item = this.list[index][this.hd[a]];
                        item.trNum = index+1;
                        // console.log('item.trNum--'+item.trNum)
                        if (item['id']) this.list[index]['alter'] = 'Y';   
                    }
                }
                this.$nextTick(() => {
                    this.$refs.elxEditable1.reload([]);
                    this.$refs.elxEditable1.reload(this.list);
                    this.$root.state = true;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
                })
            } catch (error) {
                console.log('删除后重新排序出了问题'+error);
                return this.$message({ type: 'success',message: '删除后重新排序出了问题，请联系相关技术人员!' });
            }

        },

        submitEvent () {
            this.$refs.elxEditable1.validate(valid => {
                if (valid) {
                    // let list = this.list;//获取表格的全部数据;
                    let list = this.$refs.elxEditable1.getRecords();//获取表格的全部数据;

                    // console.log(list)
                    // return false
                    if (list.length === 0) return this.$message({ type: 'success',message: '请先导入数据!' });
                    //解构数据进行提交
                    this.loading = true;
                    let header = Object.keys(this.PackHeader[0]), //用来所需要的所有列(obj)（属性）名
                    originalHead = this.originalHead, //表头数据
                    originalRowList = [], //清单内容
                    originalRowAddList = [],  //增
                    originalRowDelList = [], //删
                    originalRowAltList = [];  //改
                    console.log('this.RowDelList')
                    console.log(this.RowDelList)

                    //查询上一次修改有无这个集合  ，有的话合并两个数组
                    if (this.uplist['originalRowDelList'] && this.uplist['originalRowDelList'].length >0) {
                        console.log('已经开始二次修改删除操作 this.RowDelList,   this.uplist[originalRowDelList]----------')
                        console.log(this.RowDelList,this.uplist['originalRowDelList'])
                        originalRowDelList = this.RowDelList.concat(this.uplist['originalRowDelList']);  //删
                    }else{
                        originalRowDelList = this.RowDelList;
                    }
                
                    try {
                        for (let index = list.length -1; index >=0 ; index--) {
                            for (let i = header.length -1; i >=0; i--) {
                                let listRows = list[index][header[i]];
                                if (listRows && listRows.colNum) {
                                    // delete listRows.edit;                                
                                    listRows['trNum'] = index+1;      
                                    // listRows.attribute = ''; //加入属性
                                    // listRows.formula = ''; //加入公式                  
                                    listRows['upload'] = 1; 
                                    if (!listRows.attribute) listRows.attribute = ''; //加入属性
                                    if (!listRows.formula) listRows.formula = ''; //加入公式
                                    if (!listRows['id']) {  //无id则视为新增，新增到originalRowAddList
                                        originalRowAddList.push(listRows);
                                    }else if ( ( this.form.collect || list[index]['alter'] || listRows['alter']) && listRows['id'] ) {    //有id 与 alter 视为已修改过的数据 新增到originalRowAddList
                                        // console.log('jjjjjjjjjjjj')
                                        // console.log(listRows)
                                        listRows['alter'] = "Y";
                                        originalRowAltList.push(listRows);
                                    }
                                    originalRowList.push(listRows);
                                }
                            }
                        }
                    } catch (error) {
                        this.loading = false;
                        console.log('保存数据遇到错误  :'+error)
                        return this.$message({ type: 'success',message: '存储失败，请联系相关技术人员!' });
                    }
                    let obj = { //新建清单的时候需要用
                        originalHeadId: this.form.headerId,    //清单表头id
                        processId: this.approval.id,         //审批单流程id
                        sysOrder: '',                   //系统序号  预留，暂不使用
                        sysNum: '',                    //系统编号  预留，暂不使用
                        name: this.form.name,               //清单名称
                        num: this.form.num,                 //清单编号
                        tenderId: this.tender.id,           //标段id
                        type: 'original',                 //清单类别为”original”
                        originalRowAddList,  //增
                        originalRowDelList,  //删
                        originalRowAltList,  //改
                        totalobj: this.totalobj,
                        enter:this.list.length>0?1:0,
                        tender:this.tender,
                        saveTime: new Date(),
                        organizationId: this.organizationId,  //部门id
                        saveEmployee:{name:this.$store.state.username}
                    };
                    if (this.uplist.id)obj.saveTime = this.uplist.saveTime; //设置时间
                    if (this.mode !=='show') {
                        obj['originalHead'] = originalHead; //表头数据
                        obj['originalRowList'] = originalRowList; //清单内容
                    }
                    console.log('打印一下即将提交的参数obj')
                    console.log(obj)
                    console.log('this.joinParent')
                    console.log(this.joinParent)
                    console.log('this.mode')
                    console.log(this.mode)


                    // console.log('删除集合------------------')
                    // for (let index = 0; index < obj.originalRowDelList.length; index++) {
                    //     const element = obj.originalRowDelList[index];
                    //     // console.log(element.colNum)
                    //     console.log(element.trNum)
                    
                    // }
                    // console.log('修改集合------------------')

                    // for (let index = 0; index < obj.originalRowAltList.length; index++) {
                    //     const element = obj.originalRowAltList[index];
                    //     // console.log(element.colNum)
                    //     console.log(element.trNum)
                    
                    // }
                    //  console.log('新增集合------------------')

                    // for (let index = 0; index < obj.originalRowAddList.length; index++) {
                    //     const element = obj.originalRowAddList[index];
                    //     // console.log(element.colNum)
                    //     console.log(element.trNum)
                    
                    // }
                    //此处做个判断，判断是新建还是修改。
                    if (this.joinParent) {  //接入父组件的情况
                        if (this.uplist && !this.uplist.id && !this.uplist.saveTime ) {  //当前属于新建清单====
                            switch(this.mode) {
                                case 'show':  //为show模式
                                    this.loading = false;
                                    return this.$message({ type: 'success',message: '当前为show模式，在joinParent=true 时 不支持新建清单！' })
                                    break;
                                default:  //为 alter模式与 new模式    
                                    this.originalList.push(obj);
                                    this.list.length =0;
                                    this.$message({ message: `已为你保存 ${originalRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                                    return this.saveShow();                      
                            } 
                        }else if (this.uplist && (this.uplist.id || this.uplist.saveTime)) {  //当前属于修改清单====
                            switch(this.mode) {
                                case 'show':  //为 show模式
                                    this.loading = false;
                                    return this.$message({ type: 'success',message: '当前为show模式，在joinParent=true 时 不支持更改清单！' })
                                    break;
                                default:  //为 alter模式与 new模式 
                                    for (let index = this.originalList.length -1; index >=0; index--) {
                                        let ListRow = this.originalList[index];
                                        if(  (ListRow.id && this.uplist.id && ListRow.id === this.uplist.id) || (!ListRow.id && !this.uplist.id && ListRow.saveTime === this.uplist.saveTime)){
                                        // if(  (ListRow.id && this.uplist.id && ListRow.id === this.uplist.id) || (!ListRow.id && !this.uplist.id && ListRow.saveTime === this.uplist.saveTime)){
                                            ListRow.originalHeadId = this.form.headerId;
                                            ListRow.originalRowList = originalRowList;
                                            ListRow.originalRowAddList = originalRowAddList;  //增
                                            ListRow.originalRowDelList = originalRowDelList;  //删
                                            ListRow.originalRowAltList = originalRowAltList;  //改
                                            ListRow.name = this.form.name;
                                            ListRow.num = this.form.num;
                                            ListRow.totalobj = this.totalobj;
                                            ListRow.originalHead = originalHead;
                                            ListRow.updateTime = new Date();
                                            if (ListRow.id && ListRow.id === this.uplist.id && this.mode === 'alter') { //此时要把修改后的有id的清单放入修改清单列表
                                                ListRow.alter ='Y'; //标记为修改
                                            }
                                           this.list.length =0;
                                           this.$message({ message: `已为你修改---保存 ${originalRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                                            return this.saveShow();
                                        }
                                        
                                    }
                                    
                            } //switch的 }
                        }
                        
                    }else{    //不接入父组件的情况
                        let parameter = {
                            originalAddList: [], //增清单
                            originalDelList: [],   //删清单
                            originalAltList: []  //改清单
                        } 
                        if (this.uplist && !this.uplist.id ) {  //当前为新建清单
                            switch(this.mode) {
                                case 'show':  //为show模式
                                    parameter.originalAddList.push(obj);
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
                                    parameter.originalAltList.push(obj);
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
            this.$post('/original/update',obj )
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
        exportList() {
            /*
            将清单导出为表格
            param tableData: 清单内容this.list 
            param headerData: 表头内容this.PackHeader
            param totalobj: 例如this.totalobj,  合计尾行计算结果若无则 传false
            param lastHeader: 例如this.lastHeader, 表头最后一层 对象嵌套对象{A:{}}
            param filterVal: 所有列 例如this.hd  
            param filename: 文件名
            */
            this.$excel.exportTable(this.list, this.PackHeader, this.totalobj, this.lastHeader, this.hd, 'filename')
        }


    }
}
</script>

<style scoped>
.table_box {
    position: relative;
}
.menu__item {
		display: block;
		line-height: 20px;
		text-align: center;
		margin-top: 10px;
}

.menu {
		height: 130px;
		width: 110px;
		position: absolute;
		border-radius: 2px;
		border: 1px solid #999999;
		background-color: #f4f4f4;
}

li:hover {
		background-color: #1790ff;
		color: white;
}

.formula {
    width: 400px;
    height: 100px;
    padding: 0 5px;
    /* background: #E6A23C; */
    background-color:rgba(220,38,38,0.2);
    position: fixed;
    top: 50px;
    right: 100px;
    border: 1px solid #DCDFE6;
    

}
@import '../../modules/Tablestyle.css';
</style>