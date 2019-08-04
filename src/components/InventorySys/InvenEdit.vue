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
      height="600"
      size="small"
      :span-method="arraySpanMethod"
      @cell-click ="cell_click"
      :edit-config="{trigger: 'click', mode: 'cell',render: 'scroll', renderSize: 80, useDefaultValidTip: true}"
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
      <elx-editable-column type="index" width="55" align="center" >
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
import MyColumn from '@/components/assembly/MyColumn'
import XEUtils from 'xe-utils'
import Sortable from 'sortablejs'

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
      // col:[],//表头数据.
      col: [],//已对PackHeader再次组装的多级表头数据.
      PackHeader:[],//已组装的表头数据
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
          console.log(newVal)
      }
  },
  computed: {
      
  },
  created () {
      let id = 41;
      let type = "change";
      this.$post('/head/getone',{id,type})
        .then((response) => {
        console.log('请求成功')
        console.log(response)
        this.key = '';
        if (type == 'original') {
          this.key = 'tOriginalHeadRows';
        }else if (type == 'change'){
          this.key = 'tChangeHeadRows';
        }else if (type == 'update'){
          this.key = 'tUpdateHeadRows';
        }else if (type == 'totalmeterage'){
          this.key = 'tTotalmeterageHeadRows';
        }else if (type == 'meterage'){
          this.key = 'tMeterageHeadRows';
        }else if (type == 'totalpay'){
          this.key = 'tTotalpayHeadRows';
        }else if (type == 'pay'){
          this.key = 'tPayHeadRows';
        }
        let data = response.data.onehead;
        let headsArr = this.$excel.Package(data[this.key],data.refCol,data.refRow);
        this.PackHeader = XEUtils.clone(headsArr,true) //深拷贝
        this.col = new Array();  //新建一个数组存储多级表头嵌套
        this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
        console.log(this.PackHeader)

      })
    // this.loading = true
    this.rowDrop()
    // this.findList()

  },
  mounted (){
    this.rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
   
  },
  methods: {
    consoles () {
        let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
        console.log('检验一下数据对不对 rest list')
        console.log(rest)
        console.log(this.list)
    },
    impt(){ //button 按钮调用input文件选择事件
        this.$refs.input.click()
    },
    importfxx() { //表头导入函数

        this.loading = true
        this.list = []; //归为初始化状态
        this.hd = [];
        let _this = this;
        this.startTime = Date.now()
        
        this.$excel.Imports(data=>{ //数据导入组装函数
            try { //先判断表头是否一致
                let hd = Object.keys(data[0]); //用来所需要的所有列(obj)（属性）名
                let headnum = this.PackHeader.length-1;
                for (let index = 0; index < headnum; index++) {
                    for (let i = 0; i<hd.length; i++) {
                        let headrs = this.PackHeader[index][hd[i]];
                        let Rows = data[index][hd[i]];
                        if (headrs.colNum != Rows.colNum || headrs.td != Rows.td || headrs.tdRowspan != Rows.tdRowspan || headrs.tdColspan != Rows.tdColspan || headrs.trNum != Rows.trNum) {
                            this.loading =false;                                
                            return this.$message({ message: '您导入的excel数据表头与清单表头不一致，请确认修改后再导入', type: 'warning', duration: 6000, showClose: true })
                        }
                    };
                };
            } catch (error) {
                this.loading =false;
                return this.$message({ message: '您导入的excel数据表头与清单表头不一致，请确认修改后再导入', type: 'warning', duration: 6000, showClose: true });
            };

            try {  //把数据载入表格
                data.splice(0,this.PackHeader.length-1); //去掉表头
                this.list = data;
                console.log('打印一下list')
                console.log(this.list)
                this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名
                this.findList() //调用滚动渲染数据
            } catch (e) {
                this.list = [];
                this.loading =false;
                this.$message({ message: `遇到问题了呀,表格导入失败,请检查表格。${e}`, type: 'error', duration: 6000, showClose: true })
                console.log(e)
            }
        })
    },
    cell_click(row, column, cell, event){ //单元格点击编辑事件
        this.editRow != null && this.editRow ? this.editRow.edit = "N" :this.editRow; //清除上一个单元格编辑状态
        if (column.property) {
            // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
            // console.log('表格单击事件====row, column, cell, event')
            // console.log(row, column, cell, event)
            let str = column.property;
            let colName = str.substr(0,str.indexOf(".td"))
            // console.log(colName)
            this.editRow = row[colName];
            row[colName].edit = "Y";  //1为编辑模式0为只读状态
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
          let list = this.list;
          // let startTime = Date.now()
          this.$refs.elxEditable.reload(list)
          this.loading = false
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
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总'
          return
        }
        switch (column.property) {
          case 'C':
            sums[index] = `平均：${XEUtils.mean(data, column.property)}`
            break
          case 'B':
            sums[index] = `平均：${XEUtils.mean(data, column.property)}`
            break
          case 'A':
            sums[index] = `总分：${XEUtils.sum(data, column.property)}`
            break
          default:
            sums[index] = ''
            break
        }
      })
      return sums
    },
    insertEvent () {
      console.log('进来了吗')
      this.$refs.elxEditable.insert({
        '0': `New ${Date.now()}`,
      }).then(({ row }) => {
        this.$refs.elxEditable.setActiveCell(row)
      })
      this.$refs.elxEditable.clearActive()
    },
    getSelectLabel (value, valueProp, labelProp, list) {
      let item = XEUtils.find(list, item => item[valueProp] === value)
      return item ? item[labelProp] : null
    },
    getCascaderLabel (value, list) {
      let values = value || []
      let labels = []
      let matchCascaderData = function (index, list) {
        let val = values[index]
        if (list && values.length > index) {
          list.forEach(item => {
            if (item.value === val) {
              labels.push(item.td)
              matchCascaderData(++index, item.children)
            }
          })
        }
      }
      matchCascaderData(0, list)
      return labels.join(' / ')
    },
    getDatePicker (value) {
      return XEUtils.toDateString(value, 'yyyy/MM/dd')
    },
    formatterDate (row, column, cellValue, index) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    rowDrop () {
      this.$nextTick(() => {
        Sortable.create(this.$el.querySelector('.el-table__body-wrapper tbody'), {
          handle: '.drag-btn',
          onEnd: ({ newIndex, oldIndex }) => {
            let currRow = this.list.splice(oldIndex, 1)[0]
            this.list.splice(newIndex, 0, currRow)
          }
        })
      })

    },
    submitEvent () {
      this.$refs.elxEditable.validate(valid => {
        if (valid) {
          let list = this.list
          list.forEach((item, index) => {
            if (XEUtils.isDate(item.date)) {
              item.date = item.date.getTime()
            }
            // 重新生成排序后的序号
            item.seq = index
          })
          this.loading = true
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
      this.$refs.elxEditable.exportCsv()
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