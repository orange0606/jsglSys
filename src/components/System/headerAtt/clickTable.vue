<template>
<transition name="el-fade-in-linear">
    <div class="read-only_form" >
            <h1>&nbsp;</h1>
            <div v-if="Form.tender" class="title">标段名称：<span class="demonstration" v-text="Form.tender.name"></span></div>  
            <div class="title">表头编号：<span class="demonstration" v-text="Form.num"></span></div>
            <div class="title">表头名称：<span class="demonstration" v-text="Form.name"></span></div>
            <div class="title">类别：<span class="demonstration" v-text="typeName"></span></div>
            <div v-if="Form.saveEmployee" class="title">创建人：<span class="demonstration" v-text="Form.saveEmployee.name"></span></div>
            <div class="title">创建时间：<span class="demonstration" v-text="Form.saveTime"></span></div>
            
            <h1>&nbsp;</h1>
            <elx-editable
                v-loading="loading" 
                ref="elxEditable2"
                class="click-table12"
                border
                :data="list"
                size="small"
                :span-method="arraySpanMethod"
                @cell-click ="cell_click"
                :cell-style ="cell_select"
                :highlight-current-row="false"
                :edit-config="{ render: 'scroll'}"
                >
                    <elx-editable-column type="index" width="50" align="center" > </elx-editable-column>
                    <elx-editable-column  :prop="val+'.td'" :label="hd[i]" show-overflow-tooltip v-for="(val,i) in hd" :key="i" align="center"  >
                    </elx-editable-column>
            </elx-editable>
    </div>
</transition>
</template>

<script>
  export default {
    name: 'headerForm',
    props: {
        obj:{  //需要请求的关联表头 id 表头类型type
            type: Object,
            required: false,
            default: () => ({    
                type: 'original',          
                id: null
            })
        },
        attVal:{    //返回给父组件的点击单元格的值与
            type: Object,
            required: false,
            default: () => ({    
                // type: null,          
                // id: null
            })
        },
        showTable:{ //显示表格
            type: Boolean,
            required: false,
            default: false
        }
     
    },
    // components: {headeratt},
    data () {
      return {
          list:[],
          hd:[],
          loading:false,
          Form: {
              tender: { name:'', },
              num: '',
              name: '',
              typeName: null,
              saveEmployee: { name:''},
              saveTime: ''
          },
          type:'',
         cellStyle: {    //点击单元格颜色变化
            row:null,
            col:null
        },
       
      }
    },
    created () { //2
        if (this.obj.type && this.obj.id) {
            // console.log('请求表头01');
            this.getHeader(this.obj.id, this.obj.type);//请求表头
        }
    },
   watch: {
        obj: function(New, Old){
            // console.log('父组件发需要请求关联的表头类型和id来了02');
            // console.log(New)
            this.getHeader(New.id, New.type)
        },
        showTable: function(New, Old){
            if (New) this.findList();
        }

   },
      computed: {
      // 计算属性的 getter

      typeName () {
        // `this` 指向 vm 实例
        let obj = {
          original: '原清单',
          change: '变更清单',
          update: '变更后的清单',
          meterage: '计量清单',
          totalmeterage: '累计计量清单',	
          pay: '支付清单',
          totalpay: '累计支付清单'
        }
        return this.Form.type ? obj[this.Form.type ] : '未知'
      }
    },
    methods: {
        getHeader (id, type) {  //请求表头数据
            this.loading = true;
            var params = {id,type};
            // console.log('进来请求表头了',params)
            this.type = type;   //保存表头类型
            var key = '';
            switch (type) {
                case 'original':
                    key = 'tOriginalHeadRows';
                    break;
                case 'update':
                    key = 'tUpdateHeadRows';
                    break;
                case 'meterage':
                    key = 'tMeterageHeadRows';
                    break;
                case 'totalmeterage':
                    key = 'tTotalmeterageHeadRows';
                    break;
                case 'pay':
                    key = 'tPayHeadRows';
                    break;
            } 
            if (key === '' || !id || !type) return false;
            this.$post('/head/getone',params)
            .then((response) => {
                this.Form = response.data.onehead;
                var arr = this.$excel.ListAssemble(this.Form[key]);  //组装表头
                this.list= [...arr];
                this.hd = Object.keys(arr[0]);
                if (this.hd[0]!='A') {
                    this.hd.reverse();
                }
                this.loading = false;
                this.findList();
            }).catch(e => {
                // console.log(e)
                this.loading = false;
                this.$message({
                type: 'info',
                message: '请求表头失败，请重试！'+e
                })
            })
        },
        findList () {
            this.$nextTick(() => {
                this.$refs.elxEditable2.reload([]);
                setTimeout(() => {
                    let list = this.list;
                    this.$refs.elxEditable2.reload(list)
                    this.loading = false;
                    // this.$nextTick(() => {
                    //     this.$notify({title: '提示',duration: 5000,message: `渲染 ${this.list.length} 条耗时 ${Date.now() - this.startTime} ms`,type: 'success'});
                    //     // this.$message({ message: `渲染 ${this.list.length} 条耗时 ${Date.now() - this.startTime} ms`, type: 'success', duration: 5000, showClose: true })
                    // });
                }, 300)
            })
        },
        cell_click(row, column, cell, event){ //单元格点击事件
            if (column.property) {  //做容错处理，防止点击到选择框触发此事件
                var colum =column.property;
                colum = colum.substr(0,colum.indexOf('.'));
                
                //点击单元格边框颜色显示
                this.cellStyle.row = row[colum].trNum;
                this.cellStyle.col = column.id;
                
                // let key = row[colum].trNum;
                var key = `${row[colum].colNum}${row[colum].trNum}`,
                id = null,
                succre = {};
                switch (this.type) {
                    case 'original':
                        id = row[colum].toId;
                        break;
                    case 'update':
                        id = row[colum].tuId;
                        break;
                    case 'meterage':
                        id = row[colum].tmId;
                        break;
                    case 'totalmeterage':
                        id = row[colum].ttmId;
                        break;
                    case 'pay':
                        id = row[colum].tmIdtpId;
                        break;
                } 
                succre.id = id;
                succre.key = key;
                // console.log('单击表格正在发送点击数据到父组件')
                // console.log(succre)
                this.$emit("update:attVal", succre)    
            }
                
       },
       cell_select ({row, column, rowIndex, columnIndex}){ //单元格样式
            if (columnIndex >0) { //带选择框的情况
                row = row[this.hd[columnIndex-1]]
                if (rowIndex == this.cellStyle.row-1 && column.id == this.cellStyle.col) {
                    return {'border':'1px solid #409EFF'}
                }
            }
            return {}
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {   //单元格合并处理
            if (columnIndex >0) {  //带选择框的情况
                if (columnIndex <= this.hd.length) {
                    return [row[this.hd[columnIndex-1]].tdRowspan, row[this.hd[columnIndex-1]].tdColspan]
                }
            }
            return [1, 1]
        }, 

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title{
  display: inline;
  margin-right: 10px;
  color: cadetblue;
}
.demonstration {
  /* color: #606266; */
  color: pink;

}
</style>
