<template>
<transition name="el-fade-in-linear">
    <div class="read-only_form" >
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
                v-loading="lead.loading" 
                ref="elxEditable"
                class="click-table12"
                border
                :data="lead.list"
                :span-method="arraySpanMethod"
                @cell-click ="cell_click2"
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
    //   Form:{  //表单数据
    //     type: Object,
    //   },
    },
    // components: {headeratt},
    data () {
      return {
          list:[],
          hd:[]
       
      }
    },
     created () { //2
    
    },
   watch: {
        // ruleForm:{  
        //     handler(New, Old) {
                
        //     },
        //     deep: true
        // }

   },
    methods: {
        cell_click2(row, column, cell, event){ //单元格点击事件
            if (column.property) {  //做容错处理，防止点击到选择框触发此事件
                let colum =column.property;
                colum = colum.substr(0,colum.indexOf('.'));
                let key = row[colum].trNum;
                let id = row[colum].id?row[colum].id:row[colum].id = 1;
                            
            }
                
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
