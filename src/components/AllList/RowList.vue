<!--:span-method="arraySpanMethod"-->
<template>
  <div
    v-loading="loading"
    element-loading-text="正在加速处理数据"
    element-loading-spinner="el-icon-loading"
  >
      <div v-if="print_show">
          <div class="click-table11-oper"  >
                <el-button type="success" size="mini" @click="exportList">导出</el-button>
                <el-button type="success" size="mini" @click="preview">预览打印</el-button>
                
          </div>
          <div :style="{ height: Height+'px' }">
                <elx-editable
                ref="elxEditablecom"
                class="scroll-table4"
                border
                height="100%"
                size="mini"
                :show-header="showHeader" 
                v-if="showHeader"
                show-summary
                :summary-method="getSummaries"
                :edit-config="{render: 'scroll', renderSize: 80}">
                <elx-editable-column type="index" width="60" align="center" :key="$excel.randomkey(this)" ></elx-editable-column>
                <!-- 此处使用多级表头嵌套组件 -->
                <my-column v-for="(item,index) in col" :key="index" :col="item" :hd="hd"></my-column>
              </elx-editable>
          </div>
      </div>
      <div v-else>
          <printing :tableData='tableData' :print_show.sync="print_show" ></printing>
      </div> 
  </div>
</template>

<script>
import MyColumn from './MyColumn';
import printing from '../MultiplexCom/Printing'

import XEUtils from 'xe-utils';
export default {
  name: 'RowList',
  components: {
    MyColumn,
    printing
  },
  props: {
    uplist:{  //查看和修改清单数据
      type: Object,
    },
    refresh:{ //显示此组件的变量
    },
    type:{  //新清单、累计计量、累计支付的类型    
    },
  },
  data () {
    return {
      showHeader:true,
      hd:[],
      loading: false,
      col: [],//已对PackHeader再次组装的多级表头数据.
      PackHeader:[],//已组装的表头数据
      list: [
      ], //表格数据
      totalobj: {},//合计尾行计算结果存储
      Height: 400,
      Width:99.9,
      tableData:{},
      print_show:true,  // false则显示打印预览组件
    }
  },
 watch: {
      uplist: function(newVal,oldVal){  //子组件返回来的数据
        this.print_show = true;
        console.log('这里进入了吗')
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
      }
  },
  computed: {
      
  },
  created () {
    this.upif( this.uplist );//此处调用父组件传来的清单数据判断处理函数
    this.$root.state = true;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
  },

  mounted(){
      this.tViewSize();

  },
  beforeDestroy () {
    this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
  },
  methods: {
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
    refreshTable () {  //刷新表格布局
        this.$nextTick(() => {  //强制重新渲染
          this.startTime = Date.now(); 
          this.showHeader = false;
          setTimeout(()=>{
              this.showHeader = true;
          },300);
        })
    },
    tViewSize () {  //动态调整表格的高度
        this.loading = true;
        let obj = this.$store.state.clientSize;
        this.$nextTick(() => {
            this.Height = this.Height;
            setTimeout(()=>{
               this.Height = obj.height-180;
              this.UpHeight = obj.height-360;
              this.loading = false;
            },100)
            
        });
    },
    upif ( newVal ) {   //处理父组件传来的值
        if (newVal && newVal.id) {  //判断返回的是不是一个数组
            this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
            this.loading = true;
            this.showHeader = false;
            this.$nextTick(() => {  //强制重新渲染
                this.showHeader = true;
                this.startTime = Date.now(); 
            })
            this.oneList(newVal);
        }
    },
    oneList ( row ) {    //读取一个清单
        let url = '',
        headkey = '',
        rowlistkey = '';
        switch(this.type) {
            case 'update':
                url = '/update/row/getone';
                headkey = 'tUpdateHeadRows';
                break;
            case 'totalchange':
                url = '/totalchange/by/totalchangeid';
                headkey = 'totalchangeHeadRows';
                break;
            case 'totalmeterage':
                url = '/totalmeterage/by/totalmeterageid';
                headkey = 'tTotalmeterageHeadRows';
                break;
            case 'totalpay':
                url = '/totalpay/by/totalpayid';
                headkey = 'tTotalpayHeadRows';
                break;
        };
        rowlistkey = this.type+'RowList';

        if( url === '' ) return false;
        this.$post( url, { id: row.id } )
            .then((response) => {
            let data = response.data[this.type],
            header = this.$excel.Package( data[this.type+'Head'][headkey],data[this.type+'Head'].refCol,data[this.type+'Head'].refRow );

            this.PackHeader = [...header]; //深拷贝
            this.col = this.$excel.Nesting(this.PackHeader);   //调用多级表头嵌套组装函数
            this.hd = Object.keys(this.PackHeader[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
            console.log('this.col----------- ')
            console.log(this.col)
            this.$nextTick(() => {  //强制重新渲染
                this.showHeader = false;
                this.showHeader = true;
            })
            this.loading = false;
            this.list = this.$excel.ListAssemble( data[rowlistkey] ); //组装清单表格数据
            if (this.list.length >0) {
                this.findList(); //调用滚动渲染数据
            }
            
            header = null;  //初始化
            console.log('this.list')
            console.log(this.list)
            
        }).catch(e => {
            this.loading = false;
            console.log(e)
            this.$message({
                type: 'info',
                message: '发生错误！'+e
            });
        })
    },
    findList () { //表格滚动渲染函数
      this.loading = true;
      this.$nextTick(() => {
        this.$refs.elxEditablecom.reload([])
        setTimeout(() => {
          this.$refs.elxEditablecom.reload(this.list);
          this.$root.state = true;//全局变量 用于是否开启调用清单合计尾行计算 为true开启相反为false
          this.$message({ message: `渲染 ${this.list.length} 条数据 耗时 ${Date.now() - this.startTime} ms`, type: 'success', duration: 6000, showClose: true })
          this.tViewSize();
        }, 200)
      })
    },
    getSummaries (param) {  //合计
        // if (!this.$refs.elxEditable1 || !this.showHeader) return [];
        // let list = this.$refs.elxEditable1.getRecords();//获取表格的全部数据;
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
    exportList () {
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
    },


  }
}
</script>

<style scoped>
@import '../../modules/Tablestyle.css';
</style>