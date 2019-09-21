<template>
<div
    v-loading="loading"
    element-loading-text="正在加速处理数据"
    element-loading-spinner="el-icon-loading"
  >
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
                :label="item.name"
                :value="item.id">
              </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <input id="upload" type="file" @change="importfxx()" ref="input" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
    <div class="click-table11-oper" v-if="joinParent && mode==='show'?false:true" >
      <el-button :disabled="approval.state === 1?true:false" type="primary" size="mini" @click="impt">导入表格</el-button>
      <el-button :disabled="approval.state === 1?true:false" type="warning" size="mini" @click="submitEvent">完成</el-button>
      <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
      <el-button :disabled="approval.state === 1?true:false" type="success" size="mini" @click="insertEvent">新增</el-button>
      <el-button :disabled="approval.state === 1?true:false" type="danger" size="mini" @click="RemoveSelecteds">删除选中</el-button>
      <el-button :disabled="approval.state === 1?true:false" type="info" size="mini" @click="$refs.elxEditable1.revert()">放弃更改</el-button>
      <el-button :disabled="approval.state === 1?true:false" type="info" size="mini" @click="$refs.elxEditable1.clear()">清空表格</el-button>
    </div>
          <!-- show-summary
      :summary-method="getSummaries" -->
      <!-- :summary-method="getSummaries" -->
            <!-- show-summary
      :summary-method="getSummaries" -->
         <!-- :data.sync="list" -->
    <!-- :edit-config="{trigger: 'click', mode: 'cell', render: 'scroll', renderSize: 80, useDefaultValidTip: true}" -->
    <elx-editable
      ref="elxEditable1"
      class="scroll-table4 click-table11"
      border
      height="500"
      size="mini"
      :show-header="showHeader"
      v-if="showHeader"
      :span-method="arraySpanMethod"
      @cell-click ="cell_click"
      show-summary
      :summary-method="getSummaries"
      :edit-config="{render: 'scroll', renderSize: 80}"
      style="width: 100%">
      
      <elx-editable-column type="selection" align="center" width="55"></elx-editable-column>
      <elx-editable-column type="index" width="60" align="center" >
        <template v-slot:header>
          <i class="el-icon-setting" @click="dialogVisible = true"></i>
        </template>
      </elx-editable-column>
      <!-- 此处使用多级表头嵌套组件 -->
      <my-column v-for="(item,index) in col" :key="index" :col="item" :Formula="formula" type="original" ></my-column>
    </elx-editable>
    <p style="color: red;font-size: 12px;margin:10px 0 5px 0;text-align:left;">注意：审批单通过后不许再做任何修改！</p>

  </div>
</template>

<script>
import MyColumn from './MyColumn';
import XEUtils from 'xe-utils';
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
    originalAltList:{    //修改清单数据列表，这个数据用于返回给父组件
      type: Array,
    },
    joinParent:{   //接入父组件标记，当joinParent标记为true时表示连接到父组件并接受父组件的参数；当joinParent为false时组件独立调试使用。
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
      list: [], //表格数据
      originalRowDelList: [],//记录删除了的单元格
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
  },

  beforeDestroy () {
    this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
    this.$refs.input = null;
  },
  methods: {
    upif ( newVal ) {   //处理父组件传来的值
        this.allHeader(this.tender.id); //请求该标段的全部计量清单表头列表
        if (newVal && (newVal.id || newVal.saveTime) ) {  //此处为预览修改
            this.loading = true;
            this.startTime = Date.now(); 
            this.form.name = newVal.name;
            this.form.num = newVal.num;
            this.form.headerId = newVal.originalHead.id;
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
        }
    },
    updates (row) {  //新建模式与修改模式的预览修改数据呈现函数
          console.log('row')
          console.log(row)

          this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
          try {
              var headsArr = this.$excel.Package(row.originalHead.tOriginalHeadRows,row.originalHead.refCol,row.originalHead.refRow);
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
          this.originalHead = { //保存表头信息
              id: row.originalHead.id,
              name:row.originalHead.name,
              num: row.originalHead.num
          }
          if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
              this.originalHead.refCol = row.originalHead.refCol;
              this.originalHead.refRow = row.originalHead.refRow;
              this.originalHead.tOriginalHeadRows = row.originalHead.tOriginalHeadRows;
          }
          try {
              var arr = this.$excel.ListAssemble(row.originalRowList); //组装清单表格数据
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
          id: data.id,
          name: data.name,
          num: data.num
        }
        if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
            this.originalHead.refCol = data.refCol;
            this.originalHead.refRow = data.refRow;
            this.originalHead.tOriginalHeadRows = data.tOriginalHeadRows;
        }
        this.showHeader = false;
          this.$nextTick(() => {  //强制重新渲染
            this.showHeader = true;
        })
        this.loading = false;
        this.list.length = this.hd.length = 0;

        //调用表格公式解析 存储
        this.formula = this.$excel.FormulaAnaly([...this.col]);
      })
    },
    OneOriginal (id) { //原清单id
        //此处请求一个审批单的一个原清单
        this.$post('/original/row/getone',{ id })
            .then((response) => {
            console.log(response)
            var data = response.data.original;
            // this.list = response.data.originalList.list;
            if (!data && !data.originalRowList) return this.loading = false;
            var headsArr = this.$excel.Package(data['originalHead'].tOriginalHeadRows,data['originalHead'].refCol,data['originalHead'].refRow);
            this.PackHeader = [...headsArr];
            this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数

            //调用表格公式解析 存储
            this.formula = this.$excel.FormulaAnaly([...this.col]);

            //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
            this.lastHeader = this.$excel.BikoFoArr([...this.col]);
            this.originalHead = { //保存表头信息
                name:data.originalHead.name,
                num: data.originalHead.num
            };
            if ( this.mode !== 'show') {  //为新建模式与修改模式才添加的数据
              this.originalHead.refCol = data.originalHead.refCol;
              this.originalHead.refRow = data.originalHead.refRow;
              this.originalHead.tOriginalHeadRows = data.originalHead.tOriginalHeadRows;
            }
            this.loading = false;
            this.list.length = this.hd.length = 0;
            var arr = this.$excel.ListAssemble(data.originalRowList); //组装清单表格数据
            this.list = [...arr];
            this.findList(); //调用滚动渲染数据
            this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
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
        this.$refs.input.click();
    },
    importfxx() { //表头导入函数
        this.loading = true;
        this.startTime = Date.now();
        this.$excel.Imports(data=>{ //数据导入组装函数
            console.log('导入完成--------')
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
                    this.loading = false;
                    return this.$message({ message: '您导入的excel数据表头与清单表头不一致，请确认修改后再导入', type: 'warning', duration: 6000, showClose: true });
                }
                arr = hd = dataSplice = null; //释放内存
            } catch (error) {
               this.loading = false;
               return this.$message({ message: '您导入的excel数据表头与清单表头不一致，请确认修改后再导入', type: 'warning', duration: 6000, showClose: true });
            }
            try {  //把数据载入表格
                this.list = [...data];
                this.showHeader = true;
                this.findList(); //调用滚动渲染数据
                // this.$excel.Formula(this, this.list, this.formula);  //调用公式计算
                this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）

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
        if (columnIndex >1) {  //带选择框的情况
            if (row[this.hd[columnIndex-2]]) {
                return [row[this.hd[columnIndex-2]].tdRowspan, row[this.hd[columnIndex-2]].tdColspan]
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
    RemoveSelecteds () {  //删除选中
      var selection = this.$refs.elxEditable1.getSelecteds(),
      seleLen = selection.length;
      if (seleLen && seleLen > 0) {
          this.$refs.elxEditable1.removeSelecteds();
          if (selection[0]['A'] && selection[0]['A'].trNum) {
              this.Rowsort(selection[0]['A'].trNum-1);  //调用表格重新排序函数
          }
          for (let index = seleLen -1; index >= 0; index--) { //解构已删除的单元格
              for (let a = this.hd.length-1; a >= 0; a--) {
                  this.originalRowDelList.push(selection[index][this.hd[a]]);
              }
          }
          console.log('this.originalRowDelList')
          console.log(this.originalRowDelList)
      }
      console.log('获取已选中数据')
    },
    Rowsort( sub ) { //删除清单表格单元格行内的时候对清单表格行号重新排列
        let list = this.$refs.elxEditable1.getRecords();//获取表格的全部数据;
        try {
            for (let index = list.length -1; index >= 0; index--) {
                if (sub > index) break;
                for (let a = this.hd.length -1; a >= 0; a--) {
                    list[index][this.hd[a]].trNum = index+1;
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
            if (list.length === 0) return this.$message({ type: 'success',message: '请先导入数据!' });
            //解构数据进行提交
            this.loading = true;
            var header = Object.keys(this.PackHeader[0]), //用来所需要的所有列(obj)（属性）名
            originalHead = this.originalHead, //表头数据
            originalRowList = [], //清单内容
            originalRowAddList = [],  //增
            originalRowDelList = this.originalRowDelList,  //删
            originalRowAltList = [];  //改
            try {
                for (let index = list.length -1; index >=0 ; index--) {
                    for (let i = header.length -1; i >=0; i--) {
                        var listRows = list[index][header[i]];
                        if (listRows && listRows.colNum) {
                            // delete listRows.edit;
                            listRows['formula'] = '';
                            listRows['trNum'] = index+1;                  
                            listRows['attribute'] = '';                  
                            listRows['upload'] = 1;    
                            if (!listRows['id']) {  //无id则视为新增，新增到originalRowAddList
                                originalRowAddList.push(listRows);
                            }else if ( listRows['alter'] ) {  //有alter 视为已修改过的数据 新增到originalRowAltList
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
            var obj = { //新建清单的时候需要用
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
                enter:this.list.length>0?1:0,
                tender:this.tender,
                saveTime:new Date(),
                saveEmployee:{name:this.$store.state.username}
            };
            if (this.mode !=='show') {
                obj['originalHead'] = originalHead; //表头数据
                obj['originalRowList'] = originalRowList; //清单内容
            }
       
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
                                var ListRow = this.originalList[index];
                                if((ListRow.saveTime === this.uplist.saveTime) || (ListRow.id === this.uplist.id)){
                                    ListRow.originalHeadId = this.form.headerId;
                                    ListRow.originalRowList = originalRowList;
                                    ListRow.originalRowAddList = originalRowAddList;  //增
                                    ListRow.originalRowDelList = originalRowDelList;  //删
                                    ListRow.originalRowAltList = originalRowAltList;  //改
                                    ListRow.name = this.form.name;
                                    ListRow.num = this.form.num;
                                    ListRow.originalHead = originalHead;
                                    ListRow.updateTime = new Date();
                                    if (ListRow.id && this.mode === 'alter') { //此时要把修改后的有id的清单放入修改清单列表
                                        for (let b = this.originalAltList.length -1; b >=0; b--) {
                                            if (this.originalAltList[b].id === ListRow.id ) {
                                                delete this.originalAltList[b];
                                                break; //跳出此循环
                                            }
                                        }
                                        this.originalAltList.push(ListRow);
                                    }
                                    this.$message({ message: `已为你修改---保存 ${originalRowList.length} 条数据 `, type: 'success', duration: 3000, showClose: true })
                                    return this.saveShow();
                                }
                                
                            }
                            
                    } //switch的 }
                }
                
            }else{    //不接入父组件的情况
                  var parameter = {
                      originalAddList: [], //增清单
                      originalDelList: [],   //删清单
                      originalAltList: []  //改清单
                  } 
                  if (this.uplist && !this.uplist.id ) {  //当前为新建清单
                      switch(this.mode) {
                          case 'show':  //为show模式
                              parameter.originalAddList.push(obj);
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
                              parameter.originalAltList.push(obj);
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
    exportCsvEvent () {
      this.$refs.elxEditable1.exportCsv();
    },


  }
}
</script>

<style scope>
.click-table11-oper {
  height: 30px;
  margin-bottom: 5px;
  /* border: 1px solid pink; */
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