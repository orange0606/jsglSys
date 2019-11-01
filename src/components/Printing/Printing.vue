<template>



<el-dialog title="收货地址" :visible.sync="showprint" :modal-append-to-body="false" width="97%" top="3vh"  :lock-scroll="false">
    <div
    v-loading="loading"
    element-loading-text="正在加速处理数据"
    element-loading-spinner="el-icon-loading"
    class="_compbox"
  >

    <!-- <input id="upload" type="file" @change="importfxx()" ref="input" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" /> -->
    <div class="click-table11-oper" >
      <!-- <el-button v-if="joinParent && mode==='show' || (approval.state === 1)?false:true" type="warning" size="mini" @click="submitEvent">完成</el-button> -->
      <el-button type="success" size="mini" @click="insertEvent">新增</el-button>
      <!-- <el-button type="success" size="mini" @click="con">打印一下啊</el-button> -->
      <el-button type="danger" size="mini" @click="RemoveSelecteds">删除选中</el-button>
      <el-button type="info" size="mini" @click="Abandon">放弃更改</el-button>
      <el-button type="success" size="mini" @click="printDemo">测试打印</el-button>
      <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
    </div>

    <div :style="{'min-height': Height+'px' }">
    <vue-easy-print tableShow ref="easyPrint" >
        <elx-editable
          ref="Printtable"
          class="scroll-table4 click-table11"
          border
          size="mini"
          v-if="showHeader"
          show-summary
          :summary-method="getSummaries"
          :edit-config="{render: 'scroll', renderSize: 500 }">
          
          <elx-editable-column type="selection" align="center" width="45" :key="$excel.randomkey(this)" ></elx-editable-column>
          <elx-editable-column type="index" width="60" align="center" :key="$excel.randomkey(this)" ></elx-editable-column>
          <!-- 此处使用多级表头嵌套组件 -->
          <my-column v-for="(item,index) in col" :key="index+'a'" :col="item"></my-column>
        </elx-editable>
    </vue-easy-print>
        
    </div>
    
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>

</template>

<script>
import MyColumn from './MyColumn';
import XEUtils from 'xe-utils';
import vueEasyPrint from "vue-easy-print";
export default {
  name: 'Printing',
  components: {
    MyColumn,
    vueEasyPrint
  },
  props: {
    showprint:{},   //表格是否显示
    print:{  //需要打印预览的数据
      type: Object,
    },
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
      col: [],//已对PackHeader再次组装的多级表头数据.
      PackHeader:[],//已组装的表头数据
      list: [], //表格数据
      lastHeader: null,
      totalobj: {},//合计尾行计算结果存储
      ResetList: [], //清单初始值（重置数据时用）
      Height: 400,
      Width:100
    }
  },
    watch: {
        print: function(newVal,oldVal){  //子组件返回来的数据
            console.log('传数据过来打印了')
            console.log('newVal',newVal)
            if (!newVal) return false;
            //此处可进行判断，然后进行清单导入
            this.Assemble( newVal );//此处调用父组件传来的清单数据判断处理函数
        },
    },
    mounted(){
        this.tViewSize();
        window.onresize = () => {
            return (() => {
                this.tViewSize();
            })();
        }
    },
    created () {
        console.log('打印组件初始化数据完成')
        this.$root.state = true;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
        if (!this.print) return false;
        //此处可进行判断，然后进行清单导入
        this.Assemble( this.print );//此处调用父组件传来的清单数据判断处理函数
    },

    beforeDestroy () {
    // this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
    },
    methods: {
        printDemo(){
            this.$refs.easyPrint.print()
        },
        Assemble(data) {
            console.log('data-----------------')
            console.log(data)

            this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
            try {
                this.PackHeader = data.PackHeader; //表头内容
                this.col = data.col;   //多级表头嵌套组装
                // this.refreshTable(); //刷新表格布局
                //表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
                this.lastHeader = data.lastHeader;
                this.hd = data.hd; //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
            } catch (error) {
                this.$message({
                    type: 'info',
                    message: '发生错误！ 当前为子组件 '+this.mode+' 模式  应该是表头内容出错'+error
                });
                this.loading = false;
            }
            try {
                this.list = data.list; //清单表格数据
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
            let obj = this.$getViewportSize();
            this.$nextTick(() => {
                this.Height = this.Height;
                setTimeout(()=>{
                this.Height = obj.height-180;
                this.loading = false;
                },100)
                
            });
        },
       
        findList () { //表格滚动渲染函数
            this.loading = true;
            this.$nextTick(() => {
                this.$refs.Printtable.reload([])
                setTimeout(() => {
                    this.$refs.Printtable.reload(this.list);
                    this.$root.state = true;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
                    this.loading = false;
                    this.$message({ message: `成功导入 ${this.list.length} 条数据 耗时 ${Date.now() - this.startTime} ms `, type: 'success', duration: 6000, showClose: true })
                    this.tViewSize();
                }, 300)
            });

        },
        getSummaries (param) {  //合计
            // if (!this.$refs.Printtable || !this.showHeader) return [];
            // let list = this.$refs.Printtable.getRecords();//获取表格的全部数据;
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
        insertEvent () {
            if (!this.hd.length || this.hd.length===0) return false;
            let rest = this.$refs.Printtable.getRecords(),//获取表格的全部数据;
            restLen = rest.length,
            NewRow = {};
            for (let index = this.hd.length -1; index >= 0; index--) {
                NewRow['seq'] = restLen;
                NewRow[this.hd[index]]= {attribute: 'add',colNum: this.hd[index],edit: "N",formula:null,td: '', tdColspan: 1,tdRowspan: 1,trNum:restLen+1,upload: 1 };
            }
            console.log('打印一下NewRow 新增的一行')
            console.log(NewRow);
            // this.$refs.Printtable.insertAt(NewRow, -1);
            this.list.push(NewRow);
            this.$nextTick(() => {
                this.$refs.Printtable.reload([]);
                this.$refs.Printtable.reload(this.list);
            })

        },
        Abandon () {  //放弃更改
            this.list = XEUtils.clone(this.ResetList, true); //深拷贝
            this.$nextTick(() => {
                this.$refs.Printtable.reload([]);
                this.$refs.Printtable.reload(this.list);
                this.RowDelList = []; //放弃更改后  删除数组清空
                this.$root.state = true;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
            })
        },
        RemoveSelecteds () {  //删除选中
            let selection = this.$refs.Printtable.getSelecteds(),
            seleLen = selection.length;
            this.$refs.Printtable.removeSelecteds();
        },


      
        exportCsvEvent () {
        this.$refs.Printtable.exportCsv();
        },


    }
}
</script>

<style scoped>
@import '../../modules/Tablestyle.css';
</style>