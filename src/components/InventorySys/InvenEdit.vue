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


    <p style="color: red;font-size: 12px;margin:15px 0 15px 0;text-align:left;">拖动排序/、右键菜单</p>
    <input id="upload" type="file" @change="importfxx()" ref="input" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
    <div class="click-table11-oper">
      <el-button type="primary" size="mini" @click="impt">导入表格</el-button>
      <el-button type="warning" size="mini" @click="submitEvent">保存</el-button>
      <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
      <el-button type="success" size="mini" @click="insertEvent">新增</el-button>
      <el-button type="danger" size="mini" @click="$refs.elxEditable.removeSelecteds()">删除选中</el-button>
      <el-button type="info" size="mini" @click="$refs.elxEditable.revert()">放弃更改</el-button>
      <el-button type="info" size="mini" @click="$refs.elxEditable.clear()">清空表格</el-button>
      <el-button type="success" size="mini" @click="consoles">控制台打印所有数据</el-button>
    </div>
          <!-- show-summary
      :summary-method="getSummaries" -->
      <!-- :summary-method="getSummaries" -->
         <!-- :data.sync="list" -->
    <!-- :edit-config="{trigger: 'click', mode: 'cell', render: 'scroll', renderSize: 80, useDefaultValidTip: true}" -->
    <elx-editable
      ref="elxEditable"
      class="scroll-table4 click-table11"
      border
      height="400"
      size="mini"
      :show-header="showHeader"
      v-if="showHeader"
      :span-method="arraySpanMethod"
      @cell-click ="cell_click"
      show-summary
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
      <my-column v-for="(item,index) in col" :key="index" :col="item" :Formula="formula" :approval="approval" ></my-column>
    </elx-editable>
  </div>
</template>

<script>
import MyColumn from './MyColumn';
import XEUtils from 'xe-utils';
import Sortable from 'sortablejs';

export default {
  name: 'InvenEdit',
  components: {
    MyColumn
  },
  props: {
    uplist:{  //查看和修改清单数据
      type: Object,
    },
    approval:{
      type: Object,
      required: false,
      default: () => ({id:93, name:"清单审批单", state:0}) //state=1为已通过的审批单
    },
    tender:{  //标段数据
      type: Object,
    },
    originalList:{  //父组件的清单列表
      type: Array,
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
        headerList:[],//表头列表
      },
      showHeader:true,
      hd:[],
      originalHead:null, //用来存储表头信息
      startTime:null,
      loading: false,
      dialogVisible: true,
      editRow:null, //单元格编辑的存储上一个已点击单元格数据
      rest:[],
      formula:{}, //存储表头的公式数据
      row:null,//公式字符串转代码的全局变量
      // col:[],//表头数据.
      col: [
      ],//已对PackHeader再次组装的多级表头数据.
      PackHeader:[],//已组装的表头数据
      list: [
      ], //表格数据
    }
  },
 watch: {
      list: function(newVal,oldVal){
          // console.log('数据有发生改变吗')
          // console.log(newVal)
      },
      uplist: function(newVal,oldVal){  //子组件返回来的数据
        //此处可进行判断，然后进行清单导入
        if (newVal !== null) {  //判断返回的是不是一个数组
          this.form.name = newVal.name;
          this.form.num = newVal.num;
           //请求表头 (为避免异步问题，表格数据组装已在请求到表头内容后执行)
          let id = newVal.originalHeadId;
          this.oneHeader(id);
          
        }
    }
  },
  computed: {
      
  },
  created () {
    let tenderId = this.tender.id; 
    this.allHeader( tenderId);//调用请求一个标段的所有原清单表头 
    this.rowDrop();//调用表格行拖拽函数
    // this.findList()
  },
  mounted () {
    this.rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
  },
  beforeDestroy () {
    this.rest.length = this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
    this.$refs.input = null;
  },
  methods: {
    allHeader (tenderId) {  //请求该标段的全部变更清单表头列表
        this.$post('/head/alloriginal',{tenderId})
        .then((response) => {
          this.form.headerList = response.data.originalHeadList;
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
        var data = response.data.onehead,
        headsArr = this.$excel.Package(data['tOriginalHeadRows'],data.refCol,data.refRow);
        this.PackHeader = XEUtils.clone(headsArr, true); //深拷贝
        this.col = [];  //新建一个数组存储多级表头嵌套
        this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
        this.originalHead = { //保存表头编号与名称
          name:data.name,
          num: data.num
        }
        this.showHeader = false;
        this.list.length = this.hd.length = 0;
        this.$nextTick(() => {  //强制重新渲染
            this.showHeader = true;
              //作个防止数据错误处理表头得对应才开启修改清单的数据组装
              if (this.uplist !== null && this.uplist.originalHeadId === data.id) {  //this.uplist变更清单列表传来需要修改的数据
                  //调用表格组装函数（返回的是个数组对象）
                  this.startTime = Date.now(); 
                  let arr = this.$excel.ListAssemble(this.uplist.originalRowList); //组装清单表格数据
                  this.list = [...arr];
                  this.findList(); //调用滚动渲染数据
                  this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
              }
          })
          //调用表格公式解析 存储
          this.formula = this.$excel.FormulaAnaly([...this.col]);
      })
    },
    consoles () {
        let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
        console.log('检验一下数据对不对 rest list')
        console.log(rest);
        console.log(this.list);
    },
    impt(){ //button 按钮调用input文件选择事件
        this.$refs.input.click();
    },
    importfxx() { //表头导入函数
        this.loading = true;
        this.startTime = Date.now();
        this.$excel.Imports(data=>{ //数据导入组装函数
            this.hd.length = this.list.length = 0; //归为初始化状态
            try { //先判断表头是否一致
                // console.log(data);
                var hd = Object.keys(this.PackHeader[0]), //用来所需要的所有列(obj)（属性）名
                datahd = Object.keys(data[0]);
                if ( datahd.length < hd.length ) {
                    this.loading = false;
                    hd.length = datahd.length = 0;
                    return this.$message({ message: '您导入的excel数据表头与清单表头不一致，请确认修改后再导入', type: 'warning', duration: 6000, showClose: true });
                }else{
                    hd.length = datahd.length = 0;
                }
                var arr = [...this.PackHeader],
                arrlen = arr.length = arr.length-1,
                dataSplice = data.splice(0,arrlen), //去掉表头并且用来作判断是否一致
                ff = arr.some( function( item, index, array ){ //判断导入的清单表头与文件Excel清单表头如果是否相等
                      var hdsome = hd.some( function( val, i){ 
                          var headrs = array[index][val];
                          Rows = dataSplice[index][val];
                          return headrs.colNum !== Rows.colNum || headrs.td !== Rows.td || headrs.tdRowspan !== Rows.tdRowspan || headrs.tdColspan !== Rows.tdColspan || headrs.trNum !== Rows.trNum;
                      }); 
                      return hdsome;
                }); 
                if (ff) {
                    arr.length = hd.length = dataSplice.length = 0; //释放内存
                    this.loading = false;
                    return this.$message({ message: '您导入的excel数据表头与清单表头不一致，请确认修改后再导入', type: 'warning', duration: 6000, showClose: true });
                }
            } catch (error) {
               this.loading = false;
               return this.$message({ message: '您导入的excel数据表头与清单表头不一致，请确认修改后再导入', type: 'warning', duration: 6000, showClose: true });
            }
            try {  //把数据载入表格
                this.list = [...data];
                this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
                this.showHeader = true;
                this.$excel.Formula(this.list, this.formula);  //调用公式计算
                this.findList(); //调用滚动渲染数据
                data.length = 0; //内存释放
            } catch (e) {
                data.length = this.list.length = 0;
                this.loading =false;
                // console.log(e);
                this.$message({ message: `遇到问题了呀,表格导入失败,请检查表格。${e}`, type: 'error', duration: 6000, showClose: true })
            }
        })
    },
    cell_click(row, column, cell, event){ //单元格点击编辑事件
        this.editRow !== null && this.editRow ? this.editRow.edit = "N" :this.editRow; //清除上一个单元格编辑状态
        if (column.property) {
            // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
            var str = column.property,
            colName = str.substr(0,str.indexOf(".td"));
            // console.log(colName)
            this.editRow = row[colName];
            row[colName].edit = "Y";  //Y为编辑模式N为只读状态
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
      // this.loading = true
      this.$nextTick(() => {
        this.$refs.elxEditable.reload([])
        setTimeout(() => {
          // let startTime = Date.now()
          this.$refs.elxEditable.reload(this.list);
          this.loading = false;
          
        //  this.$nextTick(() => {
          this.$message({ message: `成功导入 ${this.list.length} 条数据 耗时 ${Date.now() - this.startTime} ms  系统已为你自动去除表头`, type: 'success', duration: 6000, showClose: true })
            // })
        }, 200)
      })
    },
    getSummaries (param) {  //合计
        var { columns, data } = param,
        sums = [];
        // console.log('data[0]')
        if (this.PackHeader.length >0 && this.list.length >0) {
            var sumArr = this.PackHeader.slice(-1), //截取合计尾行
            header = Object.keys(this.PackHeader[0]), //用来所需要的所有列(obj)（属性）名
            TotalObj = {},
            Total = [];
            for (var i = header.length - 1; i >= 0; i--) {
                var sum = sumArr[0][header[i]];
                if (sum.attribute && sum.attribute === 'sumFormula') {
                    Total.push(sum.colNum);
                }
            }
            for (var a = Total.length -1; a >= 0 ; a--) {
                var num = 0;
                for (let index = this.list.length - 1; index >= 0; index--) {
                    num += this.list[index][Total[a]].td*1;
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
        return sums;
    },
    filterStr (str) {  //去除空白以及特殊字符串
        if (str==null)return '';
        str = str.replace(/\s*/g,"");
        var pattern = new RegExp("[`~!@#$^&（）|{}':;',\\[\\]<>?~！@#￥……&——|{}【】‘；：”“'。，、？_]"),
        specialStr = "";  
        for(var i=0;i<str.length;i++){  
            specialStr += str.substr(i, 1).replace(pattern, '');   
        }  
        return specialStr;  
    },

    insertEvent () {
      // console.log('进来了吗')
      this.$refs.elxEditable.insert({
        '0': `New ${Date.now()}`,
      }).then(({ row }) => {
        this.$refs.elxEditable.setActiveCell(row);
      })
      this.$refs.elxEditable.clearActive();
    },
    getSelectLabel (value, valueProp, labelProp, list) {
      let item = XEUtils.find(list, item => item[valueProp] === value)
      return item ? item[labelProp] : null
    },
    getCascaderLabel (value, list) {
      let values = value || [],
      labels = [],
      matchCascaderData = function (index, list) {
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
      this.$refs.elxEditable.validate(valid => {
        if (valid) {
          let list = this.list;
          list.forEach((item, index) => {
            if (XEUtils.isDate(item.date)) {
              item.date = item.date.getTime();
            }
            // 重新生成排序后的序号
            item.seq = index;
          })
          // this.loading = true;
          // console.log('list')
          // console.log(list)
          if (list.length === 0) {
              this.$message({
                type: 'success',
                message: '请先导入数据!'
              })
              return false;
          }
          //解构数据进行提交
          // this.loading = true;


        //解构数据进行提交
          this.loading = true;
          let header = Object.keys(this.PackHeader[0]), //用来所需要的所有列(obj)（属性）名
          refCol = header.length,
          refRow = list.length,
          originalRowList = new Array();

          for (let index = 0; index < refRow; index++) {
              for (let i = 0; i < refCol; i++) {
                  if (list[index][header[i]] && list[index][header[i]].colNum) {
                      // delete list[index][header[i]].edit;
                      list[index][header[i]].formula = '';
                      list[index][header[i]].trNum = index+1;                  
                      list[index][header[i]].attribute = '';                  
                      list[index][header[i]].upload = 1;    
                      originalRowList.push(list[index][header[i]]);
                  }

              }
          }

          //此处做个判断，判断是新建还是修改。
          if (this.uplist !== null) {
              let time = this.uplist.saveTime;
              for (let index = 0; index < this.originalList.length; index++) {
                  if (this.originalList[index].saveTime === time) {
                    // delete this.changeList[index];
                    this.originalList.splice(index,1);
                    this.uplist.originalHeadId = this.form.headerId;
                    this.uplist.name = this.form.name;
                    this.uplist.num = this.form.num;
                    this.uplist.originalHead = this.originalHead;
                    this.uplist.originalRowList = originalRowList; //表格数据
                    this.uplist.updateTime = new Date();//更改时间
                    this.uplist.updateEmployee = {name:this.$store.state.username};//更改人
                    this.originalList.push(this.uplist);//保存修改信息
                    let succre = null;
                    this.$emit("update:uplist", succre)  //清空uplist
                    break;
                  }
                
              }
          }else{  //此处为新建
              let originalHead = this.originalHead;
              let obj = {
                  originalHeadId:this.form.headerId,
                  processId: this.approval.id,
                  sysOrder:'',
                  sysNum:'',
                  name:this.form.name,
                  num:this.form.num,
                  tenderId:this.tender.id,
                  type:'original',
                  originalRowList,
                  originalHead,//表头数据
                  enter:this.list.length>0?1:0,
                  tender:this.tender,
                  saveTime:new Date(),
                  saveEmployee:{name:this.$store.state.username}

              }
              this.originalList.push(obj)
              // originalList.push(obj)
              //  //进行网路请求保存
              // this.$post('/original/save',{ originalList })
              //   .then((response) => {
              //   // console.log(response)
              //   this.loading = false;
              //   // this.findList();
              //   this.$message({ message: '保存成功', type: 'success' })
              // }).catch(e => {
              //       this.loading = false;
              //       this.$message({
              //       type: 'info',
              //       message: '保存失败，请重试！'
              //       })
              // })
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
      this.$refs.elxEditable.exportCsv();
    },


  }
}
</script>

<style scope>
.click-table11-oper {
  margin-bottom: 18px;
  text-align: left;
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