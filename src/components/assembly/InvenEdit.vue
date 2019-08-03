<template>
  <div
    v-loading="loading"
    element-loading-text="正在努力为你加载数据，请稍后..."
    element-loading-spinner="el-icon-loading"
  >
    <p style="color: red;font-size: 12px;">拖动排序/、右键菜单</p>
    <input id="upload" type="file" @change="importfxx()" ref="input" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
    <div class="click-table11-oper">
      <el-button type="primary" size="mini" @click="impt">导入表格</el-button>
      <el-button type="warning" size="mini" @click="submitEvent">保存</el-button>
      <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
      <el-button type="success" size="small" @click="insertEvent">新增</el-button>
      <el-button type="danger" size="mini" @click="$refs.elxEditable.removeSelecteds()">删除选中</el-button>
      <el-button type="info" size="mini" @click="$refs.elxEditable.revert()">放弃更改</el-button>
      <el-button type="info" size="mini" @click="$refs.elxEditable.clear()">清空表格</el-button>
      <el-button type="success" size="small" @click="consoles">控制台打印所有数据</el-button>
    </div>
          <!-- show-summary
      :summary-method="getSummaries" -->
         <!-- :data.sync="list" -->
    <!-- :edit-config="{trigger: 'click', mode: 'cell', render: 'scroll', renderSize: 80, useDefaultValidTip: true}" -->
    <elx-editable
      
      ref="elxEditable"
      class="click-table11 scroll-table4"
      border
      height="600"
      size="small"
      row-key="id"
      :span-method="arraySpanMethod"
      @cell-click ="cell_click"
      :edit-config="{ render: 'scroll', renderSize: 50}"
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
     
  
      <!-- <elx-editable-column :prop="val+'.td'" label="aa" v-for="(val,i) in hd" :key="i" align="center" show-overflow-tooltip :edit-render="{name: 'ElInput'}"  >
      </elx-editable-column> -->
      <elx-editable-column v-for='(item,i) in col' :label="item.td" :prop='item.colNum+".td"' :key="i+'b'" show-overflow-tooltip align="center"  >
          <elx-editable-column v-show='item.children||item.children.length>0' v-for="(item1,a) in item.children"
          :label="item1.td" :prop='item1.colNum+".td"'  :key="a+'a'" align="center" show-overflow-tooltip  >
                <elx-editable-column v-show='item1.children||item1.children.length>0' v-for="(item2,c) in item1.children"
                :label="item2.td" :prop='item2.colNum+".td"'  :key="c+'b'" align="center" show-overflow-tooltip  >
                      <elx-editable-column v-show='item2.children||item2.children.length>0' v-for="(item3,d) in item2.children"
                      :label="item3.td" :prop='item3.colNum+".td"'  :key="d+'i'" show-overflow-tooltip  >
                            <elx-editable-column v-show='item3.children||item3.children.length>0' v-for="(item4,f) in item3.children"
                            :label="item4.td" :prop='item4.colNum+".td"'  :key="f+'ii'" show-overflow-tooltip  >
                                  <elx-editable-column v-show='item4.children||item4.children.length>0' v-for="(item5,h) in item4.children"
                                  :label="item5.td" :prop='item5.colNum+".td"'  :key="h+'iii'" show-overflow-tooltip  >
                                        <elx-editable-column v-show='item5.children||item5.children.length>0' v-for="(item6,j) in item5.children"
                                        :label="item6.td" :prop='item6.colNum+".td"'  :key="j+'j'" show-overflow-tooltip  >
                                              <elx-editable-column v-show='item6.children||item6.children.length>0' v-for="(item7,k) in item6.children"
                                              :label="item7.td" :prop='item7.colNum+".td"'  :key="k+'jj'" show-overflow-tooltip  >
                                                    
                                              </elx-editable-column>
                                        </elx-editable-column>
                                  </elx-editable-column>
                            </elx-editable-column>
                      </elx-editable-column>
                </elx-editable-column>
          </elx-editable-column>
      </elx-editable-column>

      <!-- <my-column v-for="(item,index) in col" :key="index" :col="item"></my-column> -->

    </elx-editable>
    
  </div>
</template>

<script>
import MyColumn from './MyColumn'
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
      datelist:[],//未更改的所有表格数据
      datehd:[],//未更改的所有表格列名
      dialogVisible: true,
      column:'',
      editRow:null, //单元格编辑的存储上一个已点击单元格数据
      rest:[],
      // col:[],//表头数据.
      col: [],//已对PackHeader再次组装的多级表头数据.
      PackHeader:[  //已组装的表头数据
  {
    "A": {
      "tOriginalHeadId": 137,
      "trNum": 1,
      "colNum": "A",
      "td": "ԭ�嵥��ͷ��",
      "tdRowspan": 1,
      "tdColspan": 8,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "B": {
      "tOriginalHeadId": 137,
      "trNum": 1,
      "colNum": "B",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "C": {
      "tOriginalHeadId": 137,
      "trNum": 1,
      "colNum": "C",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "D": {
      "tOriginalHeadId": 137,
      "trNum": 1,
      "colNum": "D",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "E": {
      "tOriginalHeadId": 137,
      "trNum": 1,
      "colNum": "E",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "F": {
      "tOriginalHeadId": 137,
      "trNum": 1,
      "colNum": "F",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "G": {
      "tOriginalHeadId": 137,
      "trNum": 1,
      "colNum": "G",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "H": {
      "tOriginalHeadId": 137,
      "trNum": 1,
      "colNum": "H",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    }
  },
  {
    "A": {
      "tOriginalHeadId": 137,
      "trNum": 2,
      "colNum": "A",
      "td": "���\r\n?",
      "tdRowspan": 2,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "B": {
      "tOriginalHeadId": 137,
      "trNum": 2,
      "colNum": "B",
      "td": "����\r\n?",
      "tdRowspan": 2,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "C": {
      "tOriginalHeadId": 137,
      "trNum": 2,
      "colNum": "C",
      "td": "��λ\r\n?",
      "tdRowspan": 2,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "D": {
      "tOriginalHeadId": 137,
      "trNum": 2,
      "colNum": "D",
      "td": "����\r\n?",
      "tdRowspan": 1,
      "tdColspan": 3,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "E": {
      "tOriginalHeadId": 137,
      "trNum": 2,
      "colNum": "E",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "F": {
      "tOriginalHeadId": 137,
      "trNum": 2,
      "colNum": "F",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "G": {
      "tOriginalHeadId": 137,
      "trNum": 2,
      "colNum": "G",
      "td": "���� \r\n��",
      "tdRowspan": 2,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "H": {
      "tOriginalHeadId": 137,
      "trNum": 2,
      "colNum": "H",
      "td": "�ϼ�   \r\n��ʽ��=G3*F4",
      "tdRowspan": 2,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    }
  },
  {
    "A": {
      "tOriginalHeadId": 137,
      "trNum": 3,
      "colNum": "A",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "B": {
      "tOriginalHeadId": 137,
      "trNum": 3,
      "colNum": "B",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "C": {
      "tOriginalHeadId": 137,
      "trNum": 3,
      "colNum": "C",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "D": {
      "tOriginalHeadId": 137,
      "trNum": 3,
      "colNum": "D",
      "td": "����\r\n?",
      "tdRowspan": 1,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "E": {
      "tOriginalHeadId": 137,
      "trNum": 3,
      "colNum": "E",
      "td": "�շ�վ\r\n?",
      "tdRowspan": 1,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "F": {
      "tOriginalHeadId": 137,
      "trNum": 3,
      "colNum": "F",
      "td": "�ϼ�\r\n��ʽ��=D4+E4",
      "tdRowspan": 1,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "G": {
      "tOriginalHeadId": 137,
      "trNum": 3,
      "colNum": "G",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "H": {
      "tOriginalHeadId": 137,
      "trNum": 3,
      "colNum": "H",
      "tdRowspan": 0,
      "tdColspan": 0,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    }
  },
  {
    "A": {
      "tOriginalHeadId": 137,
      "trNum": 4,
      "colNum": "A",
      "td": "�ϼ�0",
      "tdRowspan": 1,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "B": {
      "tOriginalHeadId": 137,
      "trNum": 4,
      "colNum": "B",
      "td": "�ϼ�1",
      "tdRowspan": 1,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "C": {
      "tOriginalHeadId": 137,
      "trNum": 4,
      "colNum": "C",
      "td": "�ϼ�2",
      "tdRowspan": 1,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "D": {
      "tOriginalHeadId": 137,
      "trNum": 4,
      "colNum": "D",
      "td": "�ϼ�3",
      "tdRowspan": 1,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "E": {
      "tOriginalHeadId": 137,
      "trNum": 4,
      "colNum": "E",
      "td": "�ϼ�4",
      "tdRowspan": 1,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "F": {
      "tOriginalHeadId": 137,
      "trNum": 4,
      "colNum": "F",
      "td": "�ϼ�5",
      "tdRowspan": 1,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "G": {
      "tOriginalHeadId": 137,
      "trNum": 4,
      "colNum": "G",
      "td": "�ϼ�6",
      "tdRowspan": 1,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    },
    "H": {
      "tOriginalHeadId": 137,
      "trNum": 4,
      "colNum": "H",
      "td": "�ϼ�7",
      "tdRowspan": 1,
      "tdColspan": 1,
      "colWidth": 80,
      "trHigh": 35,
      "textAlign": "center",
      "edit": 0
    }
  }
],

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

      // this.$post('/head/getone',{id:142,type:'original'})
      //   .then((response) => {
      //   console.log('请求成功')
        // console.log(response)
        // this.list = response.data.oneh.headRowList;
        // this.Form = response.data.onehead.tOriginalHead
        // this.all = response.data.onehead;
        // let data = response.data.onehead.tOriginalHeadRows;
        // this.key = '';
        // if (type == 'original') {
        //   this.key = 'tOriginalHeadRows';
        // }else if (type == 'change'){
        //   this.key = 'tChangeHeadRows';
        // }else if (type == 'update'){
        //   this.key = 'tUpdateHeadRows';
        // }else if (type == 'totalmeterage'){
        //   this.key = 'tTotalmeterageHeadRows';
        // }else if (type == 'meterage'){
        //   this.key = 'tMeterageHeadRows';
        // }else if (type == 'totalpay'){
        //   this.key = 'tTotalpayHeadRows';
        // }else if (type == 'pay'){
        //   this.key = 'tPayHeadRows';
        // }
        // let data = response.data.onehead;
        // let headsArr = this.$excel.Package(data.tOriginalHeadRows,data.refCol,data.refRow);
        let headsArr = this.PackHeader;
        this.col = new Array();  //新建一个数组存储多级表头嵌套
        this.col = this.$excel.Nesting(headsArr);
        console.log('这里打印已组装的表头')


      // })



		

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
        // this.$notify.info({
        //     title: '提示',
        //     duration: 800,
        //     message: '正在努力导入表格噢，请稍等片刻。'
        // });
        this.list = []; //归为初始化状态
        this.hd = [];
        let _this = this;
        this.startTime = Date.now()
        
            this.$excel.Imports(data=>{
                try {
                console.log('打印一下data')
                // console.log(data)
                // this.list = data;
                // let hd = Object.keys(data[0]); //用来所需要的所有列(obj)（属性）名
                
                this.list = [];
                this.hd = [];
                this.editRow = null; //初始化编辑状态
                this.list = data;
                console.log('打印一下list')
                // console.log(this.list)
                this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名
                // console.log(this.hd)
                // this.datehd= [];
                // this.datelist =[];
                // this.list = data;
                // let AZ = this.$excel.AZ();
                // let hd = Object.keys(data[0])

                // this.datehd = hd;
                // this.datelist = data;
                // console.log(this.datehd)

                // this.hd = AZ.slice(0,data.refCol);
                // for (let index = 0; index < data.length; index++) {
                //     this.list.push({});
                //     for (let i = 0; i < hd.length; i++) {
                //       if (data[index][hd[i]]) {
                //         this.list[index][AZ[i]] = data[index][hd[i]].td;
                //       }  
                //     }
                // }

                this.findList()
                // this.$nextTick(() => {
                //   this.$message({ message: `导入 ${data.length} 条耗时 ${Date.now() - this.startTime} ms`, type: 'info', duration: 3000, showClose: true })
                // })

                // _this.loading = false
                 } catch (e) {
                    this.list = [];
                    this.loading =false;
                    this.$message({ message: `出错了啦啦啦${e}`, type: 'info', duration: 3000, showClose: true })
                }
            })
    },
    cell_click(row, column, cell, event){ //单元格点击事件
        if (column.property) {
            // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
            this.editRow != null && this.editRow ? this.editRow.edit = 0 :this.editRow; //清除上一个单元格编辑状态
            // console.log('表格单击事件====row, column, cell, event')
            // console.log(row, column, cell, event)
            let str = column.property;
            let colName = str.substr(0,str.indexOf(".td"))
            // console.log(colName)
            this.editRow = row[colName];
            row[colName].edit = 1;  //1为编辑模式0为只读状态
            

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

        // if (columnIndex >2) {  //带选择框和序列框和操作框的情况
        // // console.log(rowIndex);
        //     try {
        //       if (this.datelist[rowIndex][this.datehd[columnIndex-3]]) {
        //             return [this.datelist[rowIndex][this.datehd[columnIndex-3]].tdRowspan, this.datelist[rowIndex][this.datehd[columnIndex-3]].tdColspan]
        //         }
        //     } catch (error) {
              
        //     }
        // }
        // return [1, 1]    
  
    }, 
    findList () {
      // this.loading = true
      this.$nextTick(() => {
        this.$refs.elxEditable.reload([])
        setTimeout(() => {
          let list = this.list;
          // let startTime = Date.now()
          this.$refs.elxEditable.reload(list)
          this.loading = false
         this.$nextTick(() => {
              this.$message({ message: `导入 ${this.list.length} 条耗时 ${Date.now() - this.startTime} ms`, type: 'info', duration: 3000, showClose: true })
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