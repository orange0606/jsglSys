<template>
  <div
    v-loading="loading"
    element-loading-text="正在加速处理数据"
    element-loading-spinner="el-icon-loading"
  >
    <div class="click-table11-oper">
      <el-form :inline="true" :model="form" size="mini" class="demo-form-inline">
        <el-form-item label="清单编号">
          <el-input v-model="form.num" placeholder="请输入清单编号"></el-input>
        </el-form-item>
        <el-form-item label="清单名称">
          <el-input v-model="form.name" placeholder="请输入清单名称"></el-input>
        </el-form-item>
        <el-form-item label="表头">
          <el-select v-model="form.headerId" @change="oneHeader" placeholder="请选择表头">
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

    <p style="color: red;font-size: 12px;margin:15px 0 15px 0;text-align:left;">拖动排序、右键菜单</p>
    <p style="color: red;font-size: 12px;margin:15px 0 15px 0;text-align:left;">绿色字体为原清单内容不可编辑</p>
    <div class="click-table11-oper">
      <el-dialog
      width="85%"
      title="选择清单"
      top="10vh"
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
            :data.sync="update"
            @cell-click ="selectOriginal"
            :row-class-name="tableRowClassName"
            :edit-config="{trigger: 'click', mode: 'row'}"
            style="width: 100%">
            <elx-editable-column type="index" width="80" fixed="left" ></elx-editable-column>
            <elx-editable-column prop="updateHead.num" label="原清单表头编号" align="center" show-overflow-tooltip ></elx-editable-column>
            <elx-editable-column prop="updateHead.name" min-width="110" label="表头名称" align="center" show-overflow-tooltip ></elx-editable-column>
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
        <choice-row v-else :inventory.sync="updateList" :innerVisible.sync="innerVisible" ></Choice-row>

    </el-dialog>
      <el-button type="primary" size="mini" @click="innerVisible = true;showList =true;" >选择清单</el-button>
      <el-button type="warning" size="mini" @click="submitEvent">完成</el-button>
      <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
      <el-button type="success" size="mini" @click="insertEvent">新增</el-button>
      <el-button type="danger" size="mini" @click="$refs.elxEditable1.removeSelecteds()">删除选中</el-button>
      <el-button type="info" size="mini" @click="$refs.elxEditable1.revert()">放弃更改</el-button>
      <el-button type="info" size="mini" @click="$refs.elxEditable1.clear()">清空表格</el-button>
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
      show-summary
      size="small"
      :summary-method="getSummaries"
      :edit-config="{trigger: 'click', mode: 'cell', render: 'scroll', renderSize: 150, useDefaultValidTip: true}"
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
      <my-column v-for="(item,index) in col" :key="index" :col="item" :Formula="formula" ></my-column>
    </elx-editable>
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
    meterageList: { //所有变更清单列表
      type: Array,
    },
    tender:{  //标段信息
      type: Object,
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
      update:[],//所有关联的原清单列表
      updateList: null,//原清单内容(传给子组件，然后返回回来数据)
      pageVO: { //所有关联的原清单列表数据分页
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
      formula:{}, //存储表头的公式数据
      row:null,//公式字符串转代码的全局变量
      col: [],//已对PackHeader再次组装的多级表头数据.
      PackHeader:[],//已组装的表头数据
      list: [
      ], //表格数据
      pendingRemoveList:[],
    }
  },

 watch: {
    updateList: function(newVal,oldVal){  //ChoiceRow子组件返回来的数据
        //此处可进行判断，然后进行清单导入
        if (Array.isArray(newVal)) {  //判断返回的是不是一个数组
           console.log('最终用户选择的需要引入的清单数据在这里返回啦沙雕');
           console.log(newVal);
           this.importfxx(newVal);//这里调用表格处理函数
          //这里进行处理
        }
    },
    uplist: function(newVal,oldVal){  //子组件返回来的数据
        //此处可进行判断，然后进行清单导入
        if (newVal != null) {  //判断返回的是不是一个数组
          this.form.name = newVal.name;
          this.form.num = newVal.num;
           //请求表头 (为避免异步问题，表格数据组装已在请求到表头内容后执行)
           let id = newVal.meterageHeadId;
           this.oneHeader(id)

        }
    }
  },
  computed: {
      
  },
  created () {
    let tenderId = this.tender.id; 
    this.allHeader( tenderId);//调用请求一个标段的所有变更表头
    this.rowDrop();//调用表格行拖拽函数

  },
  mounted () {

  },
  beforeDestroy () {
      this.list.length = this.hd.length = this.col.length = this.PackHeader.length = 0;
  },
  methods: {
    allHeader (tenderId) {  //请求该标段的全部计量清单表头列表
        this.$post('/head/allmeterage',{tenderId})
        .then((response) => {
          console.log('response')
          console.log(response)
          this.form.headerList = response.data.meterageHeadList;
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
       this.$post('/head/getone',{id,type:'meterage'})
        .then((response) => {
          let data = response.data.onehead;
          let headsArr = this.$excel.Package(data['tMeterageHeadRows'],data.refCol,data.refRow);
          this.PackHeader = XEUtils.clone(headsArr, true); //深拷贝
          this.col = new Array();  //新建一个数组存储多级表头嵌套
          this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
          this.meterageHead = { //保存表头信息
            name:data.name,
            num: data.num
          }
          this.showHeader = false;
          this.list.length = this.hd.length = 0;
          this.$nextTick(() => {  //强制重新渲染
              this.showHeader = true;
              //作个防止数据错误处理表头得对应才开启修改清单的数据组装
              if (this.uplist != null && this.uplist.meterageHeadId == data.id) {  //this.uplist变更清单列表传来需要修改的数据
                  //调用表格组装函数（返回的是个数组对象）
                  this.startTime = Date.now(); 
                  let list = this.uplist.meterageRowList;
                  let arr = this.$excel.ListAssemble(list);
                  this.list = [...arr];
                  this.findList(); //调用滚动渲染数据
                  this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
              }
            })
          this.Analysis();//调用表格公式解析
          let updateHeadId = response.data.onehead.id;
          this.allRelationUpdate(updateHeadId)
        
      })
    },
    allRelationUpdate (id) {  //请求可导入的关联原清单列表
        this.$post('/update/onetender',{ id:this.tender.id,current:this.pageVO.currentPage,pageSize:this.pageVO.pageSize})
        .then((response) => {
          this.update = response.data.updateList.list;
      }).catch(e => {
          this.$message({
            type: 'info',
            message: '发生错误！'
          });
      });
    },
    oneUpatde (id) {  //请求选择可导入原清单内容
        this.$post('/update/getone',{ id })
        .then((response) => {
          this.updateList = response.data.update;
      }).catch(e => {
          this.$message({
            type: 'info',
            message: '发生错误！'
          });
      });
    },
    selectOriginal (row, column, cell, event) { //原清单列表数据表格单击事件
        let id = row.id;
        this.oneUpatde(id); //调用请求清单
        //关闭显示关联清单列表页面
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
        return 'delete-row';
      }
      return ''
    },
    consoles () {
        let rest = this.$refs.elxEditable1.getRecords();//获取表格的全部数据
        // console.log('检验一下数据对不对 rest list')
        // console.log(rest);
        // console.log(this.list);
    },

    importfxx(data) { //表头导入函数
        let patt1=/[A-Z+]*/g;
        this.loading = true;
        this.hd.length = this.list.length = 0; //归为初始化状态
        this.startTime = Date.now(); 
        // 先生成一个完整表格数据
        this.list = new Array();
        let hd = Object.keys(this.PackHeader[0]); //用来所需要的所有列(obj)（属性）名
        let hdlen = hd.length;
        let datalen = data.length;
        for (let index = 0; index < datalen; index++) {
            this.list[index] = new Object();
            for (let i = 0; i < hdlen; i++) {
              this.list[index][hd[i]] = {attribute: null,colNum: hd[i],edit: "N",formula:null,td:'',tdColspan: 1,tdRowspan: 1,trNum:index+1,upload: 1 };
            }
        }
        //截取最后一行表头遍历进行对应处理（非合计行）（实际上是取的多级嵌套表头里的最后一层）
        let cols = [...this.col]
        function BikoFoArr (col) {
            let obj = new Object();
            Biko(col);
            function Biko (colArr) { //表头尾行 真正显示对应列的数据
                for (let c = 0; c < colArr.length; c++) {
                  if (colArr[c].children && colArr[c].children.length >0) {
                      Biko(colArr[c].children);
                  }else{
                      obj[colArr[c].colNum] = colArr[c];
                  }
                }
            }
            return obj;
        }
        if (this.PackHeader.length <2) return false; 
        let sumArr = BikoFoArr(cols); //截取获取表格实际对应所有列最后一层的表头列 object

        const header = Object.keys(sumArr); //用来所需要的所有列(obj)（属性）名
        console.log('--------------------------header')
        console.log(sumArr,header)
        for (let index = 0; index < header.length; index++) { //将对应列数据加到空数组数据那里
            let row = sumArr[header[index]];
            if (row.attribute && row.attribute == "update" && row.attributeValue && row.attributeValue !="") {
                let str = row.attributeValue;
                console.log(row.attributeValue+'有没有进来--------------------------'+index+row.attribute)

                let colName = str.match(patt1)[0];
                for (let a = 0; a < this.list.length; a++) {
                    // this.list[a][row.colNum] = new Object();
                    this.list[a][row.colNum] = {...data[a][colName]};
                    this.list[a][row.colNum].colNum = row.colNum;
                }
            }
        }
        console.log(this.list)
        try {  //把数据载入表格
            this.findList(); //调用滚动渲染数据
            this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
            this.Formula();  //调用公式计算
            // data.length = 0; //内存释放
        } catch (e) {
            data.length = this.list.length = 0;
            this.loading =false;
            this.$message({ message: `遇到问题了呀,清单导入失败,请重试。${e}`, type: 'error', duration: 6000, showClose: true })
        }
    },
    cell_click(row, column, cell, event){ //单元格点击编辑事件
        let str = column.property;
        let colName = str.substr(0,str.indexOf(".td"));
        this.editRow = row[colName];
        console.log(row[colName].td)
        this.editRow != null && this.editRow ? this.editRow.edit = "N" :this.editRow; //清除上一个单元格编辑状态
        if (column.property) {
            // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
            let str = column.property;
            let colName = str.substr(0,str.indexOf(".td"));
            this.editRow = row[colName];
            row[colName].edit = "Y";  //Y为编辑模式N为只读状态     
        }  
    },
    deleteSelectedEvent () {
      let removeRecords = this.$refs.elxEditable1.getSelecteds() //获取被选中的数据
      if (removeRecords.length) {
          this.$msgbox.confirm('确定删除所选数据?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('打印选中的数据')
          console.log(removeRecords)
          this.loading = true
            this.$message({
              type: 'success',
              message: '删除成功!'
            })

        }).catch(e => e)
      } else {
        this.$message({
          type: 'info',
          message: '请至少选择一条数据！'
        })
      }
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
      this.loading = true
      this.$nextTick(() => {
        this.$refs.elxEditable1.reload([])
        setTimeout(() => {
          // let startTime = Date.now()
          this.$refs.elxEditable1.reload(this.list);
          this.loading = false;
         this.$nextTick(() => {
              this.$message({ message: `成功导入 ${this.list.length} 条数据 耗时 ${Date.now() - this.startTime} ms `, type: 'success', duration: 6000, showClose: true })
            })
        }, 300)
      })
    },
    getSummaries (param) {  //合计
        const { columns, data } = param
        const sums = []
        // console.log(param)
        let list = [...this.list];
        // console.log('data[0]')
        try {
              if (this.PackHeader.length >0 && this.list.length >0) {
                let sumArr = this.PackHeader.slice(-1); //截取合计尾行
                const header = Object.keys(this.PackHeader[0]); //用来所需要的所有列(obj)（属性）名
                const listlen = this.list.length;
                let Total = new Array();
                for (let i = 0; i < header.length; i++) {
                    let sum = sumArr[0][header[i]];
                    if (sum.attribute && sum.attribute == 'sumFormula') {
                        Total.push(sum.colNum);
                    }
                }
                let TotalObj = new Object();
                for (let a = 0; a < Total.length; a++) {
                    let num = 0;
                    for (let index = 0; index < listlen; index++) {
                        num += parseInt(this.list[index][Total[a]].td==""?0:this.list[index][Total[a]].td);
                    }
                    TotalObj[Total[a]+'.td'] = num;
                }
                columns.forEach((column, index) => {
                // console.log(column.property);

                    if (index === 0) {
                      sums[index] = '汇总';
                      return;
                    }else if(index >2){
                      sums[index] = TotalObj[column.property];
                    }
                })
                return sums;
            }
        } catch (error) {
            console.log(error)
        }
        return sums;
    },
    Analysis () {  //公式解析化为可运算的字符串
        console.log('有无进来公式解析')
        let patt1= /([A-Z]+)[A-Za-z0-9]*[0-9]+/g;
        let patt2=/[A-Z+]*/g; //查找所有的大写字母，返回一个数组;
        let patt3 = /[0-9]/;  //判断是否有数字
        let patt4 = /[A-Z]/;
          // console.log('this.col')
        //  console.log(this.col )
        let cols = [...this.col]
        function BikoFoArr (col) {
            let obj = new Object();
            Biko(col);
            function Biko (colArr) { //表头尾行 真正显示对应列的数据
                for (let c = 0; c < colArr.length; c++) {
                  if (colArr[c].children && colArr[c].children.length >0) {
                      Biko(colArr[c].children);
                  }else{
                      obj[colArr[c].colNum] = colArr[c];
                  }
                }
            }
            return obj;
        }
        if (this.PackHeader.length <2) return false; 
        // let sumArr = this.PackHeader.slice(-2)[0]; //截取合计尾行上一行

        let sumArr = BikoFoArr(cols); //截取获取表格实际对应所有列的表头列 object
        const header = Object.keys(sumArr); //用来所需要的所有列(obj)（属性）名
        for (let index = 0; index < header.length; index++) {
            let sumRow = sumArr[header[index]];
            if (sumRow.attribute && sumRow.attribute == "formula" && sumRow.attributeValue && sumRow.attributeValue !="") {
                let str = sumRow.attributeValue;
                str = this.filterStr(str);  //去除空格与特殊符号
                let arr = str.match(patt1);  // 这里将会得到一个数组['AAA3', 'A11', 'A111', 'A111']
                for (let i = 0; i < arr.length; i++) {
                    let key = arr[i].match(patt2);
                    let arrlen = arr[i].length;
                    for (let a = 0; a < str.length; a++) {
                        let index = str.indexOf(arr[i],a);
                        if ((str.length - index) < arrlen) break;
                        if (index != -1) {
                            if (index == 0 && !patt3.test(str[index+arrlen])) {
                                str = str.slice(0, index)+`row["${key[0]}"].td*1`+str.slice(index+arrlen);
                            }else if (index >= 1 && !patt4.test(str[index-1]) && !patt3.test(str[index+arrlen])) { //下标大于1时
                                str = str.slice(0, index)+`row["${key[0]}"].td*1`+str.slice(index+arrlen);
                            }
                        }
                    }
                }
                this.formula[sumRow.colNum] = str;
            }      
        }
    },
    filterStr (str) {  //去除空白以及特殊字符串
        str = str.replace(/\s*/g,"");
        var pattern = new RegExp("[`~!@#$^&（）|{}':;',\\[\\]<>?~！@#￥……&——|{}【】‘；：”“'。，、？_]");  
        var specialStr = "";  
        for(var i=0;i<str.length;i++){  
            specialStr += str.substr(i, 1).replace(pattern, '');   
        }  
        return specialStr;  
    },
    Formula () { //表格载入时进行处理公式计算
        let formuHd = Object.keys(this.formula); //用来所需要的所有有公式的列(obj)（属性）名
        let listlen = this.list.length;
        let formuHdlen = formuHd.length;
        for (let index = 0; index < listlen; index++) {  
            let row = this.list[index];
            try {
                for (let a = 0; a < formuHdlen; a++) {
                  let sum = this.formula[formuHd[a]];
                  if (row[formuHd[a]].td == "" || row[formuHd[a]].td == " " || row[formuHd[a]].td == null) {
                      // sum 格式大概是 parseInt(row["D"].td)*parseInt(row["E"].td)
                      row[formuHd[a]].td = this.filterStr(row[formuHd[a]].td);
                      row[formuHd[a]].td = parseInt(row[formuHd[a]].td);
                      // index == 0 ?this.$message({ message: `系统正在为您计算`, type: 'success', duration: 3000, showClose: true }): index;
                      eval(sum) || eval(sum)==0 ? row[formuHd[a]].td = eval(sum): row[formuHd[a]].td;  //字符串转代码计算
                  }
                }
            } catch (error) {
                console.log(error)
                return this.$message({ message: '这边出现了点问题，貌似是公式错误，建议请先去检查一下表头。再进行录入吧！', type: 'warning', duration: 3000, showClose: true });
            }
        }
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
    getSelectLabel (value, valueProp, labelProp, list) {
      let item = XEUtils.find(list, item => item[valueProp] === value)
      return item ? item[labelProp] : null
    },
    getCascaderLabel (value, list) {
      let values = value || [];
      let labels = [];
      let matchCascaderData = function (index, list) {
        let val = values[index];
        if (list && values.length > index) {
          list.forEach(item => {
            if (item.value === val) {
              labels.push(item.td);
              matchCascaderData(++index, item.children);
            }
          })
        }
      }
      matchCascaderData(0, list)
      return labels.join(' / ');
    },
    getDatePicker (value) {
      return XEUtils.toDateString(value, 'yyyy/MM/dd');
    },
    formatterDate (row, column, cellValue, index) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
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
          let list = this.list;
          list.forEach((item, index) => {
            if (XEUtils.isDate(item.date)) {
              item.date = item.date.getTime();
            }
            // 重新生成排序后的序号
            item.seq = index;
          })
          if (list.length == 0) {
              this.$message({
                type: 'success',
                message: '请先导入数据!'
              })
              return false;
          }
          //解构数据进行提交
          this.loading = true;
          const header = Object.keys(this.PackHeader[0]); //用来所需要的所有列(obj)（属性）名
          const refCol = header.length;
          const refRow = list.length;
          let meterageRowList = new Array();
          for (let index = 0; index < refRow; index++) {
              for (let i = 0; i < refCol; i++) {
                  if (list[index][header[i]] && list[index][header[i]].colNum) {
                      // delete list[index][header[i]].edit;
                      list[index][header[i]].formula = '';
                      list[index][header[i]].trNum = index+1;                  
                      list[index][header[i]].attribute = '';                  
                      list[index][header[i]].upload = 1;    
                      meterageRowList.push(list[index][header[i]]);
                  }
              }
          }

          //此处做个判断，判断是新建还是修改。
          if (this.uplist != null) {
              let time = this.uplist.saveTime;
              for (let index = 0; index < this.meterageList.length; index++) {
                  if (this.meterageList[index].saveTime == time) {
                    // delete this.meterageList[index];
                    this.meterageList.splice(index,1);
                    this.uplist.meterageHeadId = this.form.headerId;
                    this.uplist.name = this.form.name;
                    this.uplist.num = this.form.num;
                    this.uplist.meterageHead = this.meterageHead;
                    this.uplist.meterageRowList = meterageRowList; //表格数据
                    this.uplist.updateTime = new Date();//更改时间
                    this.uplist.updateEmployee = {name:this.$store.state.username};//更改人
                    this.meterageList.push(this.uplist);//保存修改信息
                    let succre = null;
                    this.$emit("update:uplist", succre)  //清空uplist
                    break;
                  }
                
              }
          }else{  //此处为新建
              let obj = new Object();
              let meterageHead = this.meterageHead;
              obj = {
                  meterageHeadId:this.form.headerId,
                  processId:6,
                  sysOrder:'',
                  sysNum:'',
                  name:this.form.name,
                  num:this.form.num,
                  tenderId:this.tender.id,
                  type:'meterage',
                  meterageRowList,
                  meterageHead,//表头数据
                  enter:this.list.length>0?1:0,
                  tender:this.tender,
                  saveTime:new Date(),
                  saveEmployee:{name:this.$store.state.username}
              }
              this.meterageList.push(obj);
          }

          
          let succre = false;
          this.$emit("update:refresh", succre)  //关闭新建变更清单子组件
          this.loading = false;
          this.list.length = this.hd.length = 0;

          this.showHeader = false;
          this.$nextTick(() => {  //强制重新渲染
              this.showHeader = true;
          })
         
        }
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
  margin-bottom: 18px;
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