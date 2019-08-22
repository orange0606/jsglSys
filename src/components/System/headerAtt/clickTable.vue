<template>
<transition name="el-fade-in-linear">
    <div class="read-only_form" >
            <input id="upload" type="file" @change="importfxx()" ref="input3" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
            <p style="margin:0 0 20px 0; text-align: left;">
                <el-button type="primary" size="mini" @click="impt">导入表格</el-button>
            </p>
            <!-- <h3 style="margin:20px 0 20px 0;">请点击下方原清单单元格选取属性</h3>
            <div v-if="From2.tender" class="title">标段名称：<span class="demonstration" v-text="From2.tender.name"></span></div>  
            <div class="title">表头编号：<span class="demonstration" v-text="From2.num"></span></div>
            <div class="title">表头名称：<span class="demonstration" v-text="From2.name"></span></div>
            <div class="title">类别：<span class="demonstration" >原清单</span></div>
            <div v-if="From2.saveEmployee" class="title">创建人：<span class="demonstration" v-text="From2.saveEmployee.name"></span></div>
            <div class="title">创建时间：<span class="demonstration" v-text="From2.saveTime"></span></div> -->
            <!-- <el-alert title="，系统已为您自动添加合并行，请点击表格的每个单元格设置相关属性以及公式，全部设置完成方可提交。" type="info"></el-alert> -->
            <h1>&nbsp;</h1>
            <elx-editable
                v-loading="loading" 
                ref="elxEditable2"
                class="click-table12"
                border
                :span-method="arraySpanMethod"
                @cell-click ="cell_click"
                :cell-style ="cell_select"
                :edit-config="{ render: 'scroll'}"
                >
                    <elx-editable-column type="index" width="50"> </elx-editable-column>
                    <elx-editable-column  :prop="val+'.td'" :label="hd[i]" show-overflow-tooltip v-for="(val,i) in hd" :key="i"  >
                    </elx-editable-column>
            </elx-editable>
    </div>
</transition>
</template>

<script>
  export default {
    name: 'headerForm',
    props: {
        Obj:{  //需要请求的关联表头 id 表头类型type
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
        }
     
    },
    // components: {headeratt},
    data () {
      return {
          list:[],
          hd:[],
          loading:false,
          Form:{},
       
      }
    },
     created () { //2
        if (this.Obj.type && this.Obj.id) {
                this.getHeader(this.Obj.id, this.Obj.type);//请求表头
            }
    },
   watch: {
        Obj:{  
            handler(New, Old) {
                console.log('父组件发需要请求关联的表头类型和id来了');
                console.log(New)
                if (New.type && New.id) {
                    this.getHeader(New.id, New.type);//请求表头
                }
            },
            deep: true
        }

   },
    methods: {
        getHeader (id, type) {  //请求表头数据
            this.loading = true;
            let params = {id,type}
            this.$post('/head/getone',params)
            .then((response) => {
                this.Form = response.data.onehead;
                let arr = this.$excel.ListAssemble(this.Form.headRowList);  //组装表头
                // let arr = this.$excel.Package(this.From2['tOriginalHeadRows'],this.From2.refCol,this.From2.refRow);
                this.list= [...arr];
                this.hd = Object.keys(arr[0]);
                this.findList();
            }).catch(e => {
                this.loading = false;
                this.$message({
                type: 'info',
                message: '请求表头失败，请重试！'
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
        impt () { //button 按钮调用input文件选择事件
            this.$refs.input3.click();
        },
        importfxx () { //表格导入函数
           
            this.loading = true;
            this.$notify.info({title: '提示',duration: 800,message: '正在努力导入表格噢，请稍等片刻。'});
            let _this = this;
            this.$excel.Imports(data=>{   // excel文件导入处理函数
                let arr = new Array();
                try {
                    this.hd.length = this.list.length = 0; //归为初始化状态
                    arr = _this.$excel.HeaderAtt(data);
                    _this.list = [...arr];
                    _this.hd = Object.keys(_this.list[0]);
                    arr.length = data.length = 0;
                    _this.findList(); //渲染表格
                } catch (error) {
                    _this.loading = false;
                    arr.length = data.length = 0;
                    _this.$notify({
                        title: '提示',
                        duration: 5000,
                        message: '遇到点问题了呀，请重试或者检查文件。'+error,
                        type: 'info'
                    });
                }
            })
        },
        cell_click(row, column, cell, event){ //单元格点击事件
            if (column.property) {  //做容错处理，防止点击到选择框触发此事件
                let colum =column.property;
                colum = colum.substr(0,colum.indexOf('.'));
                // let key = row[colum].trNum;
                let key = `${row[colum].colNum}${row[colum].trNum}`;
                let id = row[colum].id?row[colum].id:row[colum].id = 1;
                let succre = new Object();
                succre.id = id;
                succre.key = key;
                console.log('单击表格正在发送点击数据到父组件')
                console.log(succre)
                this.$emit("update:attVal", succre)    
            }
                
       },
       cell_select ({row, column, rowIndex, columnIndex}){ //单元格样式
            //   // if (this.btn.edit) {
            //       if (columnIndex >0) { //带选择框的情况
            //           row = row[this.hd[columnIndex-1]]
            //           if (rowIndex == this.lead.cell_row-1 && column.id == this.lead.cell_col) {
            //               return {'border':'1px solid #409EFF','text-align': row['textAlign'],'height':row.trHigh+'px'}
            //           }
            //       }
            //   // }else{  //不带选择框的情况
            //       // row = row[this.lead.hd[columnIndex]]
            //       // if (rowIndex == this.lead.cell_row-1 && column.id == this.lead.cell_col) {
            //       //     return {'border':'1px solid #409EFF','text-align': row['textAlign'],'height':row.trHigh+'px'}
            //       // }
            //   // }
              return {'text-align': 'center'}
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

</style>
