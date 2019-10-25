<!--:span-method="arraySpanMethod"-->
<template>
  <div
    v-loading="loading"
    element-loading-text="正在加速处理数据"
    element-loading-spinner="el-icon-loading"
  >
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
        :edit-config="{render: 'scroll', renderSize: 150}">
      
        <elx-editable-column type="index" width="60" :key="$excel.randomkey()" align="center"  ></elx-editable-column>
        <!-- 此处使用多级表头嵌套组件 -->
        <my-column v-for="(item,index) in col" :key="index" :col="item" :hd="hd"></my-column>
      </elx-editable>
  </div>
    
  </div>
</template>

<script>
import MyColumn from './MyColumn';
import XEUtils from 'xe-utils';
export default {
  name: 'RowList',
  components: {
    MyColumn
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
      Height: 400,
      Width:99.9
    }
  },
 watch: {
      uplist: function(newVal,oldVal){  //子组件返回来的数据
        console.log('这里进入了吗')
        //此处可进行判断，然后进行清单导入
        this.upif( newVal );//此处调用父组件传来的清单数据判断处理函数
    }
  },
  computed: {
      
  },
  created () {
    this.upif( this.uplist );//此处调用父组件传来的清单数据判断处理函数
  },

  mounted(){
      this.tViewSize();
      window.onresize = () => {
        return (() => {
            this.tViewSize();
        })();
      }
  },
  beforeDestroy () {
    this.hd.length = this.col.length = this.PackHeader.length = this.list.length = 0;
  },
  methods: {
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
        let obj = this.$getViewportSize();
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
        var url = '',
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
            var data = response.data[this.type],
            header = this.$excel.Package( data[this.type+'Head'][headkey],data[this.type+'Head'].refCol,data[this.type+'Head'].refRow );

            this.PackHeader = XEUtils.clone(header, true); //深拷贝
            this.col = this.$excel.Nesting(this.PackHeader);   //调用多级表头嵌套组装函数
            this.hd = Object.keys(this.PackHeader[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
            console.log('this.col----------- ')
            console.log(this.col)
            this.$nextTick(() => {  //强制重新渲染
                this.showHeader = false;
                this.showHeader = true;
            })
            this.loading = false;
            var list = this.$excel.ListAssemble( data[rowlistkey] ); //组装清单表格数据
            this.list = XEUtils.clone(list, true); //深拷贝
            if (this.list.length >0) {
                this.findList(); //调用滚动渲染数据
            }
            
            list = header = null;  //初始化
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
        this.$refs.elxEditablecom.reload([])
        setTimeout(() => {
          // let startTime = Date.now()
          this.$refs.elxEditablecom.reload(this.list);
        //  this.$nextTick(() => {
          // this.loading = false;
          this.$message({ message: `渲染 ${this.list.length} 条数据 耗时 ${Date.now() - this.startTime} ms`, type: 'success', duration: 6000, showClose: true })
            // })
          this.tViewSize();
        }, 200)
      })
    },
    getSummaries (param) {  //合计
        if (!this.$refs.elxEditablecom || !this.showHeader) return [];
        let list = this.$refs.elxEditablecom.getRecords();//获取表格的全部数据;
        if (this.PackHeader.length ===0 || list.length ===0) return [];
        return this.$excel.getSummaries(this.PackHeader, list, param);//调用合计尾行。
    },
    formatterDate (row, column, cellValue, index) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
    },
    exportCsvEvent () {
      this.$refs.elxEditablecom.exportCsv();
    },


  }
}
</script>

<style scoped>
@import '../../modules/Tablestyle.css';
</style>