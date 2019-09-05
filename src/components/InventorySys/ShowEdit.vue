
<template>
  <div
    v-loading="loading"
    element-loading-text="正在加速处理数据"
    element-loading-spinner="el-icon-loading"
  >
  <div class="click-table11-oper">
      <el-form :inline="true" :model="form" size="mini" class="demo-form-inline">
        <el-form-item label="清单编号">
          <el-input :disabled="approval.state === 1 && uplist.id?true:false" v-model="form.num" placeholder="请输入清单编号"></el-input>
        </el-form-item>
        <el-form-item label="清单名称">
          <el-input :disabled="approval.state === 1 && uplist.id?true:false" v-model="form.name" placeholder="请输入清单名称"></el-input>
        </el-form-item>
        <el-form-item label="表头">
          <el-select :disabled="approval.state === 1 && uplist.id?true:false" v-model="form.headerId" @change="oneHeader" placeholder="请选择表头">
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
    <input id="upload" type="file" @change="importfxx()" ref="input" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
    <div class="click-table11-oper">
      <el-button :disabled="approval.state === 1 && uplist.id?true:false" type="primary" size="mini" @click="impt">导入表格</el-button>
      <el-button :disabled="approval.state === 1 && uplist.id?true:false" type="warning" size="mini" @click="submitEvent">保存</el-button>
      <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
      <el-button :disabled="approval.state === 1 && uplist.id?true:false" type="success" size="mini" @click="insertEvent">新增</el-button>
      <el-button :disabled="approval.state === 1 && uplist.id?true:false" type="danger" size="mini" @click="$refs.elxEditablecom.removeSelecteds()">删除选中</el-button>
      <el-button :disabled="approval.state === 1 && uplist.id?true:false" type="info" size="mini" @click="$refs.elxEditablecom.revert()">放弃更改</el-button>
      <el-button :disabled="approval.state === 1 && uplist.id?true:false" type="info" size="mini" @click="$refs.elxEditablecom.clear()">清空表格</el-button>
      <el-button type="success" size="mini" @click="consoles">控制台打印所有数据</el-button>
    </div>
    <br>
          <!-- show-summary
      :summary-method="getSummaries" -->
      <!-- :summary-method="getSummaries" -->
         <!-- :data.sync="list" -->
    <!-- :edit-config="{trigger: 'click', mode: 'cell', render: 'scroll', renderSize: 80, useDefaultValidTip: true}" -->
    <elx-editable
      ref="elxEditablecom"
      class="scroll-table4 click-table11"
      border
      height="500"
      size="mini"
      :show-header="showHeader"
      v-if="showHeader"
      :span-method="arraySpanMethod"
      :summary-method="getSummaries"
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
      <my-column v-for="(item,index) in col" :key="index" :col="item" :Formula="formula" ></my-column>
    </elx-editable>
  </div>
</template>

<script>
import MyColumn from './MyColumn';
import XEUtils from 'xe-utils';
import Sortable from 'sortablejs';

export default {
  name: 'ShowEdit',
  components: {
    MyColumn
  },
  props: {
    uplist:{  //查看和修改清单数据
      type: Object,
    },
    approval:{
      type: Object,
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
        console.log('这里进入了吗')
        //此处可进行判断，然后进行清单导入
        this.upif( newVal );//此处调用父组件传来的清单数据判断处理函数
    }
  },
  computed: {
      
  },
  created () {
    this.allHeader( this.tender.id );//调用请求一个标段的所有原清单表头 
    this.upif( this.uplist );//此处调用父组件传来的清单数据判断处理函数
    this.rowDrop();//调用表格行拖拽函数
  },

  mounted () {
 
  },
  beforeDestroy () {
    this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
    this.$refs.input = null;
  },
  methods: {
    upif ( newVal ) {   //处理父组件传来的值
        if (newVal && newVal.id) {  //判断返回的是不是一个数组
            this.loading = true;
            // console.log('此时为预览修改')
            this.form.name = newVal.name;
            this.form.num = newVal.num;
            var id = newVal.originalHead.id;
            this.form.headerId = id;
            //请求表头 (为避免异步问题，表格数据组装已在请求到表头内容后执行)
            return this.oneHeader(id);
        }else if (newVal) {
            // console.log('此时为新建原清单')
            this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
            this.form.name = this.form.num = this.form.headerId = this.headerList =null;
            this.$nextTick(() => {
                this.$refs.elxEditablecom.reload([]);
            })
        }
    },
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
          name: data.name,
          num: data.num
        }
        this.showHeader = false;
        this.list.length = this.hd.length = 0;
        this.$nextTick(() => {  //强制重新渲染
            this.showHeader = true;
              //作个防止数据错误处理表头得对应才开启修改清单的数据组装
              if (this.uplist !== null && this.uplist.originalHead && this.uplist.originalHead.id === data.id) {  //this.uplist变更清单列表传来需要修改的数据
                  //调用表格组装函数（返回的是个数组对象）
                  this.startTime = Date.now(); 
                  this.loading = true;
                  this.OneOriginal(this.uplist.id);
                  
              }
          })
        //调用表格公式解析 存储
        this.formula = this.$excel.FormulaAnaly([...this.col]);
      })
    },
    OneOriginal (id) { //原清单id
        //此处请求一个审批单的一个原清单
        this.$post('/original/row/getone',{ id })
            .then((response) => {
            // this.list = response.data.originalList.list;
            if (!response.data.original.originalRowList) return this.loading = false;;
            var arr = this.$excel.ListAssemble(response.data.original.originalRowList); //组装清单表格数据
            this.list = [...arr];
            this.findList(); //调用滚动渲染数据
            this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
            this.loading = false;
        }).catch(e => {
            this.loading = false;
            console.log(e)
            this.$message({
                type: 'info',
                message: '233发生错误！'+e
            });
        })
    },
    consoles () {
        let rest = this.$refs.elxEditablecom.getRecords();//获取表格的全部数据
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
                this.showHeader = true;

                 this.findList(); //调用滚动渲染数据
                this.$excel.Formula(this.list, this.formula);  //调用公式计算
                this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
             
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
        if(this.approval.state === 1 && this.uplist.id )return false; //审批单已通过，并且不是新建清单的话不许做修改。
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
        this.$refs.elxEditablecom.reload([])
        setTimeout(() => {
          // let startTime = Date.now()
          this.$refs.elxEditablecom.reload(this.list);
          this.loading = false;
          
        //  this.$nextTick(() => {
          this.$message({ message: `渲染 ${this.list.length} 条数据 耗时 ${Date.now() - this.startTime} ms`, type: 'success', duration: 6000, showClose: true })
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
    Analysis () {  //公式解析化为可运算的字符串
        var patt1 = /([A-Z]+)[A-Za-z0-9]*[0-9]+/g,
        patt2 =/[A-Z+]*/g, //查找所有的大写字母，返回一个数组,
        patt3 = /[0-9]/,  //判断是否有数字
        patt4 = /[A-Z]/,
        cols = [...this.col];
        function BikoFoArr (col) {
            let obj = {};
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
        var sumArr = BikoFoArr(cols); //截取获取表格实际对应所有列的表头列 object
        const header = Object.keys(sumArr); //用来所需要的所有列(obj)（属性）名
        for (let index = 0; index < header.length; index++) {
            var sumRow = sumArr[header[index]];
            if (sumRow.attribute && sumRow.attribute === "formula" && sumRow.attributeValue && sumRow.attributeValue !="") {
                var str = sumRow.attributeValue;
                str = this.filterStr(str);  //去除空格与特殊符号
                var arr = str.match(patt1);  // 这里将会得到一个数组['AAA3', 'A11', 'A111', 'A111']
                for (let i = 0; i < arr.length; i++) {
                    var key = arr[i].match(patt2),
                    arrlen = arr[i].length;
                    for (let a = 0; a < str.length; a++) {
                        let index = str.indexOf(arr[i],a);
                        if ((str.length - index) < arrlen) break;
                        if (index !== -1) {
                            if (index === 0 && !patt3.test(str[index+arrlen])) {
                                str = str.slice(0, index)+`(row["${key[0]}"].td)*1`+str.slice(index+arrlen);
                            }else if (index >= 1 && !patt4.test(str[index-1]) && !patt3.test(str[index+arrlen])) { //下标大于1时
                                str = str.slice(0, index)+`(row["${key[0]}"].td)*1`+str.slice(index+arrlen);
                            }
                        }
                    }
                }
                this.formula[sumRow.colNum] = str;
            }      
        }
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
      this.$refs.elxEditablecom.insert({
        '0': `New ${Date.now()}`,
      }).then(({ row }) => {
        this.$refs.elxEditablecom.setActiveCell(row);
      })
      this.$refs.elxEditablecom.clearActive();
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
      this.$refs.elxEditablecom.validate(valid => {
        if (valid) {
            let list = this.$refs.elxEditablecom.getRecords();//获取表格的全部数据;
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
            refCol = header.length,
            refRow = list.length,
            originalRowList = [];

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
            var obj = {
                // id:                                    //原清单id
                originalHeadId: this.form.headerId,    //原清单表头id
                processId: this.approval.id,         //审批单流程id
                sysOrder: '',                   //系统序号  预留，暂不使用
                sysNum: '',                    //系统编号  预留，暂不使用
                name: this.form.name,                     //原清单名称
                num: this.form.num,                    //原清单编号
                tenderId: this.tender.id,                     //标段id
                type: 'original',                 //原清单类别为”original”
                originalRowList                 //原清单内容，如果为null表示无内容修改，如果为空数组，表示删除全部内容
            },
            originalList = [],
            url = '';
            if (this.uplist && !this.uplist.id ) { //此处是新建清单
                url = '/original/save';
            }else if (this.uplist && this.uplist.id) {    //此处是修改,先删除，再保存。二次请求
                obj.id = this.uplist.id;
                url = '/original/update';
            }
            if (url === '') return false;
            originalList.push(obj);
            this.$post(url,{ originalList })
                .then((response) => {   
                this.$message({ message: `已为你保存 ${originalRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                let succre = false;
                this.$emit("update:refresh", succre)  //关闭新建变更清单子组件
                this.loading = false;
                originalRowList.length = this.list.length = this.hd.length = 0;
                this.showHeader = false;
                this.$nextTick(() => {  //强制重新渲染
                    this.showHeader = true;
                })
            }).catch(e => {
                this.loading = false;
                originalRowList.length = 0;
                this.$message({
                    type: 'info',
                    message: '585发生错误！'+e
                });
            })

          
        }
      })
    },
    saveRowList () {

    },
    exportCsvEvent () {
      this.$refs.elxEditablecom.exportCsv();
    },


  }
}
</script>

<style scope>
.click-table11-oper {
  /* margin-bottom: 18px; */
  text-align: left;
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