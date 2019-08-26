<template>
  <div
    v-loading="loading"
    element-loading-text="生成数据中，请稍后..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <p style="color: red;font-size: 12px;margin:10px 0;">请选择你需要导入的原清单数据</p>
    <!-- <p style="color: red;font-size: 12px;">兼容性：不兼容动态行高；不支持树结构</p> -->
    <elx-editable
      ref="elxEditable4"
      class="scroll-table4 click-table11"
      border
      size="mini"
      :show-header="showHeader"
      v-if="showHeader"
      :span-method="arraySpanMethod"
      :edit-config="{ render: 'scroll', renderSize: 80, useDefaultValidTip: true}"
      style="width: 100%">
      <elx-editable-column type="selection" align="center" width="55"></elx-editable-column>
      <elx-editable-column type="index" align="center" width="80"></elx-editable-column>
      <!-- 此处使用多级表头嵌套组件 -->
      <column v-for="(item,index) in col" :key="index" :col="item" ></column>

    </elx-editable>
    <div slot="footer" class="dialog-footer btn">
        <el-button size="mini" @click="inner(false)">取 消</el-button>
        <el-button size="mini" type="primary" @click="inner(true)">导 入</el-button>
    </div>
    <br>
  </div>
</template>

<script>
import Column from './Column';
import XEUtils from 'xe-utils'
export default {
 name: 'ChoiceRow',
  components: {
    Column
  },
  props: {
    inventory: {
    },
    innerVisible: {
    }
    // tender:{
    //   type: Object,
    // }
  },
  data () {
    return {
      all:null,//原清单全部数据
      showHeader:true,//表头显示以及表格显示强制渲染
      loading: false,
      regionList: [],
      isClearActiveFlag: true,
      col:[],//多级表头嵌套数据
      PackHeader:null,//表头已组装数据
      list:[],//表格数据
      hd:[],//用作单元格合并
      
    }
  },
  created () {

    this.all = this.inventory;
    if (this.all!=null) {
      try {
          let id = this.all.originalHead.id;
          let type = this.all.type;
          this.oneHeader(id,type)//调用表头内容请求函数
      } catch (error) {
          console.log(error)

      }
    }

    this.$message.closeAll();
  },
  watch: {
      inventory: function(newVal,oldVal){
          if (newVal!=null) {
              try {

                  // let key = '';
                  //  if(type == 'original'){
                  //     key = this.all.originalRowList;
                  // }else if (type == 'update') {
                  //     key = this.all.updateRowList;

                  // }else if (type== 'totalmeterage'){

                  // }
                  this.all = newVal;
                  let type = this.all.type;
                  let id = this.all[type+'Head'].id;
                  this.oneHeader(id,type)//调用表头内容请求函数
              } catch (error) {
                  console.log(error)
              }
              
          }
      }
  },
  methods: {
    handle (list) { //数据处理表格数据等等 数据、列数、行数、
        if (list.length == 0) {
            return false
        }
        //调用表格组装函数（返回的是个数组对象）
        let arr = this.$excel.ListAssemble(list);
        this.hd = Object.keys(arr[0]);
        this.list = [...arr];
        this.findList()//开始渲染表格数据

    },
    oneHeader (id,type) {  //请求单个表头 表头id  表头类型
       this.$post('/head/getone',{id,type})
        .then((response) => {
        let data = response.data.onehead;
        let key = '';
        if (type == 'original') {
          key = 'tOriginalHeadRows';
        }else if (type == 'change'){
          key = 'tChangeHeadRows';
        }else if (type == 'update'){
          key = 'tUpdateHeadRows';
        }else if (type == 'totalmeterage'){
          key = 'tTotalmeterageHeadRows';
        }else if (type == 'meterage'){
          key = 'tMeterageHeadRows';
        }else if (type == 'totalpay'){
          key = 'tTotalpayHeadRows';
        }else if (type == 'pay'){
          key = 'tPayHeadRows';
        }
        let headsArr = this.$excel.Package(data[key],data.refCol,data.refRow);
        this.PackHeader = XEUtils.clone(headsArr, true); //深拷贝
        this.col = new Array();  //新建一个数组存储多级表头嵌套
        this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
        let list = new Array();
        if(type == 'original'){
            list = this.all.originalRowList;
        }else if (type == 'update') {
            list = this.all.updateRowList;

        }else if (type== 'totalmeterage'){

        }
        
        console.log('this.all----------------------------')
        console.log(this.all)
        this.handle(list);; //调用清单数据内容处理函数
      })
    },
    inner (item ) {  //关闭清单选择层，将选中的数据发回给父组件
        if (item) {
            let rest = this.$refs.elxEditable4.getSelecteds(); //此处应是已选择的表格数据
            if (rest.length >0) {
                this.$emit("update:inventory", [...rest]);
                this.hd.length = this.list.length = 0; 
                let boolen = false;
                this.$emit("update:innerVisible", boolen);//关闭弹出显示窗口
            }else{
                this.$message({
                type: 'info',
                message: '请至少选择一条数据！'
              })
            }
        }else{
            let boolen = false;
            this.hd.length = this.list.length = 0; 
            this.$emit("update:innerVisible", boolen);//关闭弹出显示窗口
        }

    },
    findList () {
        this.loading = true;
        // let size = Number(this.$route.params.number);
        this.$nextTick(() => {
            this.$refs.elxEditable4.reload([]);
            setTimeout(() => {
              let list = this.list;
            let startTime = Date.now();
            this.$refs.elxEditable4.reload(list);
            this.loading = false;
            this.$nextTick(() => {
                this.$message({ message: `渲染 ${list.length} 条耗时 ${Date.now() - startTime} ms`, type: 'info', duration: 8000, showClose: true })
            })
            }, 300)
        })
    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {   //单元格合并处理
      if (columnIndex >1) {  //带选择框的情况
          if (columnIndex <= this.hd.length) {
              return [row[this.hd[columnIndex-2]].tdRowspan, row[this.hd[columnIndex-2]].tdColspan]
          }
      }
      return [1, 1]
    }, 
  },

  // beforeRouteUpdate (to, from, next) {
  //   next();
  //   this.findList();
  // }
}
</script>



<style scoped>
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

.btn {
  text-align: right;
  margin: 15px 20px 10px 0;
}
</style>