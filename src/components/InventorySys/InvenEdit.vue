<template>
  <div
    v-loading="loading"
    element-loading-text="正在加速处理数据"
    element-loading-spinner="el-icon-loading"
  >
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
         <!-- :data.sync="list" -->
    <!-- :edit-config="{trigger: 'click', mode: 'cell', render: 'scroll', renderSize: 80, useDefaultValidTip: true}" -->
    <elx-editable
      ref="elxEditable"
      class="scroll-table4 click-table11"
      border
      height="450"
      size="mini"
      :span-method="arraySpanMethod"
      @cell-click ="cell_click"
      show-summary
      :summary-method="getSummaries"
      :edit-config="{trigger: 'click', mode: 'cell', render: 'scroll', renderSize: 150, useDefaultValidTip: true}"
      :context-menu-config="{headerMenus, bodyMenus}"
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
      <my-column v-for="(item,index) in col" :key="index" :col="item"></my-column>
    </elx-editable>
  </div>
</template>

<script>
import MyColumn from '@/components/assembly/MyColumn';
import XEUtils from 'xe-utils';
import Sortable from 'sortablejs';

export default {
  name: 'InvenEdit',
  components: {
    MyColumn
  },
  data () {
    return {
      hd:null,
      startTime:null,
      loading: false,
      dialogVisible: true,
      editRow:null, //单元格编辑的存储上一个已点击单元格数据
      rest:[],
      formula:{}, //存储表头的公式数据
      // col:[],//表头数据.
      col: [
        {colNum:'A',td:'A1',textAlign:'center',edit:'N'},
        {colNum:'B',td:'B1',textAlign:'center',edit:'N'},
        {colNum:'C',td:'C1',textAlign:'center',edit:'N'},
        {colNum:'D',td:'D1',textAlign:'center',edit:'N'},
        {colNum:'E',td:'E1',textAlign:'center',edit:'N'},
        {colNum:'F',td:'F1',textAlign:'center',edit:'N'},
      ],//已对PackHeader再次组装的多级表头数据.
      PackHeader:[],//已组装的表头数据
      nn:[{"tOriginalHeadId":149,"trNum":1,"colNum":"A","td":"工 程 量 清 单","tdRowspan":1,"tdColspan":6,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"originalNull"},{"tOriginalHeadId":149,"trNum":1,"colNum":"B","tdRowspan":0,"tdColspan":0,"colWidth":80,"trHigh":35,"textAlign":"center"},{"tOriginalHeadId":149,"trNum":1,"colNum":"C","tdRowspan":0,"tdColspan":0,"colWidth":80,"trHigh":35,"textAlign":"center"},{"tOriginalHeadId":149,"trNum":1,"colNum":"D","tdRowspan":0,"tdColspan":0,"colWidth":80,"trHigh":35,"textAlign":"center"},{"tOriginalHeadId":149,"trNum":1,"colNum":"E","tdRowspan":0,"tdColspan":0,"colWidth":80,"trHigh":35,"textAlign":"center"},{"tOriginalHeadId":149,"trNum":1,"colNum":"F","tdRowspan":0,"tdColspan":0,"colWidth":80,"trHigh":35,"textAlign":"center"},{"tOriginalHeadId":149,"trNum":2,"colNum":"A","td":"第100章   总 则","tdRowspan":1,"tdColspan":6,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"originalNull"},{"tOriginalHeadId":149,"trNum":2,"colNum":"B","tdRowspan":0,"tdColspan":0,"colWidth":80,"trHigh":35,"textAlign":"center"},{"tOriginalHeadId":149,"trNum":2,"colNum":"C","tdRowspan":0,"tdColspan":0,"colWidth":80,"trHigh":35,"textAlign":"center"},{"tOriginalHeadId":149,"trNum":2,"colNum":"D","tdRowspan":0,"tdColspan":0,"colWidth":80,"trHigh":35,"textAlign":"center"},{"tOriginalHeadId":149,"trNum":2,"colNum":"E","tdRowspan":0,"tdColspan":0,"colWidth":80,"trHigh":35,"textAlign":"center"},{"tOriginalHeadId":149,"trNum":2,"colNum":"F","tdRowspan":0,"tdColspan":0,"colWidth":80,"trHigh":35,"textAlign":"center"},{"tOriginalHeadId":149,"trNum":3,"colNum":"A","td":"子目号","tdRowspan":1,"tdColspan":1,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"originalNull"},{"tOriginalHeadId":149,"trNum":3,"colNum":"B","td":"子目名称","tdRowspan":1,"tdColspan":1,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"originalNull"},{"tOriginalHeadId":149,"trNum":3,"colNum":"C","td":"单位","tdRowspan":1,"tdColspan":1,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"originalNull"},{"tOriginalHeadId":149,"trNum":3,"colNum":"D","td":"数量","tdRowspan":1,"tdColspan":1,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"originalNull"},{"tOriginalHeadId":149,"trNum":3,"colNum":"E","td":"单价（元）","tdRowspan":1,"tdColspan":1,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"originalNull"},{"tOriginalHeadId":149,"trNum":3,"colNum":"F","td":"合价（元）","tdRowspan":1,"tdColspan":1,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"formula","attributeValue":"D3*E3"},{"tOriginalHeadId":149,"trNum":4,"colNum":"A","td":"合计0","tdRowspan":1,"tdColspan":1,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"sumNull"},{"tOriginalHeadId":149,"trNum":4,"colNum":"B","td":"合计1","tdRowspan":1,"tdColspan":1,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"sumNull"},{"tOriginalHeadId":149,"trNum":4,"colNum":"C","td":"合计2","tdRowspan":1,"tdColspan":1,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"sumNull"},{"tOriginalHeadId":149,"trNum":4,"colNum":"D","td":"合计3","tdRowspan":1,"tdColspan":1,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"sumFormula","attributeValue":"D4"},{"tOriginalHeadId":149,"trNum":4,"colNum":"E","td":"合计4","tdRowspan":1,"tdColspan":1,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"sumFormula","attributeValue":"E4"},{"tOriginalHeadId":149,"trNum":4,"colNum":"F","td":"合计5","tdRowspan":1,"tdColspan":1,"colWidth":80,"trHigh":35,"textAlign":"center","attribute":"sumFormula","attributeValue":"F4"}],
      list: [
      ], //表格数据
       headerMenus: [
        [
          {
            code: 'ALL_EXPORT',
            name: '导出全部.csv',
            prefixIcon: 'el-icon-download'
          }
        ]
      ],
      bodyMenus: [
        [
          {
            code: 'ROW_INSERT_ACTIVE',
            name: '插入新行',
            prefixIcon: 'el-icon-plus'
          },
          {
            code: 'ROW_REMOVE',
            name: '删除行',
            prefixIcon: 'el-icon-minus'
          }
        ],
        [
          {
            code: 'SELECT_REMOVE',
            name: '删除选中的行',
            prefixIcon: 'el-icon-close'
          },
          {
            code: 'CELL_RESET',
            name: '清除内容',
            prefixIcon: 'el-icon-close'
          },
          {
            code: 'CELL_REVERT',
            name: '还原数据'
          }
        ],
        [
          {
            code: 'ROW_EXPORT',
            name: '导出行.csv',
            prefixIcon: 'el-icon-download'
          },
          {
            code: 'ALL_EXPORT',
            name: '导出全部.csv'
          }
        ]
      ]
    }
  },
 watch: {
      list: function(newVal,oldVal){
          console.log('数据有发生改变吗')
          // console.log(newVal)
      }
  },
  computed: {
      
  },
  created () {



      let id = 149;
      let type = "original";
      // this.$post('/head/getone',{id,type})
      //   .then((response) => {
      //   console.log('请求成功')
      //   console.log(response)
      //   this.key = '';
      //   if (type == 'original') {
      //     this.key = 'tOriginalHeadRows';
      //   }else if (type == 'change'){
      //     this.key = 'tChangeHeadRows';
      //   }else if (type == 'update'){
      //     this.key = 'tUpdateHeadRows';
      //   }else if (type == 'totalmeterage'){
      //     this.key = 'tTotalmeterageHeadRows';
      //   }else if (type == 'meterage'){
      //     this.key = 'tMeterageHeadRows';
      //   }else if (type == 'totalpay'){
      //     this.key = 'tTotalpayHeadRows';
      //   }else if (type == 'pay'){
      //     this.key = 'tPayHeadRows';
      //   }
        // let data = response.data.onehead;
        // let headsArr = this.$excel.Package(data[this.key],data.refCol,data.refRow);

        let headsArr = this.$excel.Package(this.nn,6,4);
        this.PackHeader = XEUtils.clone(headsArr,true) //深拷贝
        this.col = new Array();  //新建一个数组存储多级表头嵌套
        this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
        console.log(this.PackHeader)
        // headsArr = data = null; //释放内存

      // })
      
      
    
    // this.loading = true
    this.Formula();//调用表格公式解析
    this.rowDrop();
    // this.findList()


  },
  mounted () {
    this.rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
   
  },
  beforeDestroy () {
    this.rest = null;
    this.hd = null;
    this.col = null;
    this.PackHeader = null;
    this.list = null;
    this.$refs.input = null;
  },
  methods: {
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
        this.hd = this.list = []; //归为初始化状态
        this.startTime = Date.now();
        this.$excel.Imports(data=>{ //数据导入组装函数
            try { //先判断表头是否一致
                let hd = Object.keys(this.PackHeader[0]); //用来所需要的所有列(obj)（属性）名
                let datahd = Object.keys(data[0]);
                if ( datahd.length < hd.length ) {
                    hd.length = datahd.length = 0;
                    return this.$message({ message: '您导入的excel数据表头与清单表头不一致，请确认修改后再导入', type: 'warning', duration: 6000, showClose: true });
                }else{
                    hd.length = datahd.length = 0;
                }
                let arr = [...this.PackHeader];
                arr.length = arr.length-1;
                let dataSplice = data.splice(0,arr.length); //去掉表头并且用来作判断是否一致
                let ff = arr.some( function( item, index, array ){ //判断导入的清单表头与网络清单表头如果是否相等
                      let hdsome = hd.some( function( val, i){ 
                          let headrs = array[index][val];
                          let Rows = dataSplice[index][val];
                          return headrs.colNum != Rows.colNum || headrs.td != Rows.td || headrs.tdRowspan != Rows.tdRowspan || headrs.tdColspan != Rows.tdColspan || headrs.trNum != Rows.trNum;
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
                this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名

                let formuHd = Object.keys(this.formula); //用来所需要的所有列(obj)（属性）名
                let listlen = this.list.length;
                let formuHdlen = formuHd.length;
                for (let index = 0; index < listlen; index++) {  
                    console.log('jin')
                    // console.log(formuHdlen)
                    for (let a = 0; a < formuHdlen; a++) {
                      console.log('建立阿勒阿三')
                      console.log(formuHd[a])
                      let sum = this.formula[formuHd[a]];
                      let row = this.list[index];
                      this.list[index][formuHd[a]].td = eval(sum);
                      console.log(sum)
                      
                    }
                    // this.[index] 
                    // for (let i = 0; i < this.formula.length; i++) {
                    //   cols = this.list[index][this.formula[i]].colNum;
                      
                    //   if (row.colNum in this.formula) {
                        
                    //   }
                    // }
                }
                this.findList() //调用滚动渲染数据
                data.length = 0; //内存释放

            } catch (e) {
                data.length = this.list.length = 0;
                this.loading =false;
                console.log(e);
                this.$message({ message: `遇到问题了呀,表格导入失败,请检查表格。${e}`, type: 'error', duration: 6000, showClose: true })
            }
        })
    },
    cell_click(row, column, cell, event){ //单元格点击编辑事件
        this.editRow != null && this.editRow ? this.editRow.edit = "N" :this.editRow; //清除上一个单元格编辑状态
        if (column.property) {
            // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
            let str = column.property;
            let colName = str.substr(0,str.indexOf(".td"))
            // console.log(colName)
            this.editRow = row[colName];
            row[colName].edit = "Y";  //Y为编辑模式N为只读状态
        }  
    },
    deleteSelectedEvent () {
      let removeRecords = this.$refs.elxEditable.getSelecteds() //获取被选中的数据
      if (removeRecords.length) {
          this.$msgbox.confirm('确定删除所选数据?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            console.log('打印选中的数据')
            console.log(removeRecords)
          // this.loading = true
          //   this.$message({
          //     type: 'success',
          //     message: '删除成功!'
          //   })

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
      // this.loading = true
      this.$nextTick(() => {
        this.$refs.elxEditable.reload([])
        setTimeout(() => {
          // let startTime = Date.now()
          this.$refs.elxEditable.reload(this.list);
          this.loading = false;
         this.$nextTick(() => {
              this.$message({ message: `成功导入 ${this.list.length} 条数据 耗时 ${Date.now() - this.startTime} ms  系统已为你自动去除表头`, type: 'success', duration: 6000, showClose: true })
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
          if (this.PackHeader.length >0 && this.list) {
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
                      num += parseInt(this.list[index][Total[a]].td);
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
          return sums
          }
          return sums

    },
    Formula () {  //公式计算
        let patt1= /([A-Z]+)[A-Za-z0-9]*[0-9]+/g;
          let patt2=/[A-Z+]*/g; //查找所有的大写字母，返回一个数组;
          let patt3 = /[0-9]/;  //判断是否有数字
          let patt4 = /[a-z]/i;
          if (this.PackHeader.length <2) return false; 
          let sumArr = this.PackHeader.slice(-2)[0]; //截取合计尾行上一行
          const header = Object.keys(sumArr); //用来所需要的所有列(obj)（属性）名
          for (let index = 0; index < header.length; index++) {
              // console.log('进来了几次了呀 ',index)
              let sumRow = sumArr[header[index]];
              // console.log('sumRow')
              // console.log(sumRow.attribute,sumRow.attributeValue,sumRow.td)
              if (sumRow.attribute && sumRow.attribute == "formula" && sumRow.attributeValue && sumRow.attributeValue !="") {
                  let str = sumRow.attributeValue;
                  console.log('str1');
                  console.log(str);
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
                                  str = str.slice(0, index)+`parseInt(row["${key[0]}"].td)`+str.slice(index+arrlen);
                              }else if (index >= 1 && !patt4.test(str[index-1]) && !patt3.test(str[index+arrlen])) { //下标大于1时
                                  str = str.slice(0, index)+`parseInt(row["${key[0]}"].td)`+str.slice(index+arrlen);
                              }
                          }
                      }
                  }
                  console.log(str)
                  this.formula[sumRow.colNum] = str;
                  console.log(this.formula)
            }      
        }
    },
    filterStr (str) {  //去除空白以及特殊字符串
        str = str.replace(/\s*/g,"");
        var pattern = new RegExp("[`~!@#$^&（）|{}':;',\\[\\]<>/?~！@#￥……&（）——|{}【】‘；：”“'。，、？_]");  
        var specialStr = "";  
        for(var i=0;i<str.length;i++){  
            specialStr += str.substr(i, 1).replace(pattern, '');   
        }  
        return specialStr;  
    },
    insertEvent () {
      console.log('进来了吗')
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
          this.loading = true;
          // XEAjax.doPost('/api/user/save', { updateRecords: list }).then(({ data }) => {
          //   this.$message({
          //     type: 'success',
          //     message: '保存成功!'
          //   })
          //   this.findList()
          // }).catch(e => {
          //   this.loading = false
          // })
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