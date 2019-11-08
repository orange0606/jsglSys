<template>
  <div
    v-loading="loading"
    element-loading-text="生成数据中，请稍后..."
    element-loading-spinner="el-icon-loading">
    <p style="color: red;font-size: 12px;margin:10px 0;">请选择你需要导入的原清单数据</p>
    <!-- <p style="color: red;font-size: 12px;">:span-method="arraySpanMethod"兼容性：不兼容动态行高；不支持树结构</p> -->
    <div :style="{height: Height+'px' }" v-if="sonRefresh">
    <elx-editable
      ref="elxEditable4"
      class="scroll-table4"
      border
      height="100%"
      size="mini"
      :show-header="showHeader"
      v-if="showHeader"
      :row-key="keyRow"
      :row-style="RowCss"
      :edit-config="{ render: 'scroll', renderSize: 60}">
      <elx-editable-column type="selection" align="center" width="45" :key="$excel.randomkey(this)" ></elx-editable-column>
      <elx-editable-column type="index" width="60" align="center" :key="$excel.randomkey(this)" ></elx-editable-column>
      <!-- 此处使用多级表头嵌套组件 -->
      <column v-for="(item,index) in col" :key="index" :col="item" :hd="hd" ></column>

    </elx-editable>
    </div>

    <div slot="footer" class="dialog-footer btn">
        <el-button size="mini" @click="inner(false)">取 消</el-button>
        <el-button size="mini" type="primary" @click="inner(true)">导 入</el-button>
    </div>
    <br>
  </div>
</template>

<script>
import Column from './Column';
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
  },
  data () {
    return {
      showHeader:true,//表头显示以及表格显示强制渲染
      loading: false,
      regionList: [],
      isClearActiveFlag: true,
      col:[],//多级表头嵌套数据
      PackHeader:null,//表头已组装数据
      list:[],//表格数据
      hd:[],//用作单元格合并
      Height: 500, 
      sonRefresh:true
    }
  },
  created () {

  },
  mounted(){
      this.tViewSize();
  },
  watch: {
        inventory: function(newVal,oldVal){
            if (newVal!=null) {
                try {
                    // console.log('选择表格组件获取到的值')
                    // console.log(newVal)
                    this.importfxx(newVal);
                } catch (error) {
                    console.log(error)
                }
            }
        },
        '$store.state.clientSize': {
            handler: function() {
            this.tViewSize();
            }
        },
  },
  methods: {
    keyRow( row ) {
        // console.log(row.seq)
        return row.seq
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
    tViewSize () {
        let obj = this.$store.state.clientSize;
        this.$nextTick(() => {
            this.Height = obj.height-250;
        });
    },
    RowCss({row, rowIndex}) {     // 定义changeCss函数，这样当表格中的相应行满足自己设定的条件是就可以将该行css样式改变
        if (row.disabled ) {
          return 'background:#f9ec1217'
        }
      return '';
    },
    // importfxx ( All ) {
    //   this.startTime = Date.now();
    //   this.loading=true;
    //   var type = All.type,
    //   Head = type+'Head',
    //   HeadRow = '';
    //   if (type==='update') {
    //       HeadRow = 'tUpdateHeadRows';
    //   }if (type==='original') {
    //       HeadRow = 'tOriginalHeadRows';
    //   }
    //   //组装表头
    //   var headsArr = this.$excel.Package(All[Head][HeadRow],All[Head].refCol,All[Head].refRow);
    //   this.PackHeader = [...headsArr];
    //   this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
     
    //   this.hd = Object.keys(this.PackHeader[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
    //   var arr = this.$excel.ListAssemble(All[type+'RowList']); //组装清单表格数据
    //    this.refreshTable(); //刷新表格布局
    //   this.list = [...arr];

    //   //此处调用过滤被选过的数据函数
    //   this.filTer( type, this.list, All['filTerCol'], All['filTerList']);
    //   this.findList();//开始渲染表格数据

    // },
    importfxx ( All ) {
      this.startTime = Date.now();
      this.loading=true;
      var type = All.type,
      Head = type+'Head',
      HeadRow = '';
      if (type==='update') {
          HeadRow = 'tUpdateHeadRows';
      }if (type==='original') {
          HeadRow = 'tOriginalHeadRows';
      }
      //组装表头
      var headsArr = this.$excel.Package(All[Head][HeadRow],All[Head].refCol,All[Head].refRow);
      this.PackHeader = [...headsArr];
      this.col = this.$excel.Nesting(headsArr);   //调用多级表头嵌套组装函数
          this.$refs.elxEditable4.doLayout();

      this.hd = Object.keys(this.PackHeader[0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
      this.loading = false;
      var arr = this.$excel.ListAssemble(All[type+'RowList']); //组装清单表格数据
      this.list = [...arr];
      //此处调用过滤被选过的数据函数
      this.filTer( type, this.list, All['filTerCol'], All['filTerList']);
      this.findList();//开始渲染表格数据
  
    },

    filTer (type, list, filTerCol, filTerList ) { //type 此次显示的清单类型 list 此组件显示的表格内容 Head, Row 此组件的父组件的表头所有列和表格内容
        if (list.length===0 || !filTerCol || filTerList.length===0 ) return false;
        console.log('type, list, filTerCol, filTerList ---111111111--------')
        console.log(type, list, filTerCol, filTerList )
        var Idkey = '',
        listCol = filTerCol.son,
        filTerListCol = filTerCol.father;
        if (type ==='update') {
            Idkey = 'tUpdateRowId';
        }else if( type === 'original') {
            Idkey = 'originalRowId';
        }
        try {
            
            for (let i = filTerList.length-1; i >= 0 ; i--) {
                for (let index = list.length-1; index >= 0 ; index--) {
                    var sonItem = list[index];
                    if(sonItem[listCol].id === filTerList[i][filTerListCol][Idkey]){
                        sonItem['disabled']=true; //给已被选过的表格行内容添加一个禁用属性
                        break;  //开始下一个循环
                    }
              
                }
              
            }
            console.log('type, list, filTerCol, filTerList ---2222222222--------')
            console.log(type, list, filTerCol, filTerList )
        } catch (error) {
          
        }
    },
    inner (item ) {  //关闭清单选择层，将选中的数据发回给父组件
        
      if (item) {
          var list = this.$refs.elxEditable4.getSelecteds(), //此处应是已选择的表格数据
          rest = null,
          assert = null;  //是否需要过滤
          //（检测有无选择到需要过滤的数据） some方法是只要一个成员的返回值是true，则整个some方法的返回值就是true，否则返回false。
          assert = list.some(function (elem, index, arr) {
              return elem.disabled;
          });
          if (assert) {
              this.$alert('系统已检测到您已选择到有已经导入过的数据，系统将会自动为您过滤数据。', '提示', {
                confirmButtonText: '知道了',
                callback: action => {
                    //过滤掉已经被选过的数据
                    rest = list.filter(item=>(
                        !item.disabled
                    ));
                    if (rest.length >0) {
                        this.$emit("update:inventory", [...rest]);
                        list.length = this.hd.length = this.list.length = 0; 
                        let boolen = false;
                        this.$emit("update:innerVisible", boolen);//关闭弹出显示窗口
                    }else{
                        this.$message({type: 'info',message: '请至少选择一条可导入的数据！'})
                    }
                }
              });
              
          }else{
              rest = list;
              if (rest.length >0) {
                  this.$emit("update:inventory", [...rest]);
                  list.length = this.hd.length = this.list.length = 0; 
                  let boolen = false;
                  this.$emit("update:innerVisible", boolen);//关闭弹出显示窗口
              }else{
                  this.$message({type: 'info',message: '请至少选择一条数据！'})
              }
          }
          
          
      }else{
          let boolen = false;
          this.hd.length = this.list.length = 0; 
          this.$emit("update:innerVisible", boolen);//关闭弹出显示窗口
      }

    },
   findList () {
        this.loading = true;
        this.$nextTick(() => {
            this.$refs.elxEditable4.reload([]);
            setTimeout(() => {
            let list = this.list;
            this.$refs.elxEditable4.reload(list);
            this.loading = false;
            this.$message({ message: `渲染 ${list.length} 条耗时 ${Date.now() - this.startTime} ms`, type: 'info', duration: 6000, showClose: true })
            },200)
        })
    },
  },

}
</script>



<style scoped>
    @import '../../modules/Tablestyle.css';
</style>