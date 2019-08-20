<template>
    
    <el-row :gutter="0">
        
        <el-col :span="18"  :xs="24" :sm="20" :md="15" :lg="17" :xl="18">
            <input id="upload" type="file" @change="importfxx()" ref="input" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
            <p style="margin:0 0 20px 0; text-align: left;">
                <el-button type="primary" size="mini" @click="impt">导入表格</el-button>
                <el-button type="info" size="mini" @click="impt">手动创建</el-button>
                <el-button type="success" size="mini" @click="edit" v-text="btn.stateEdit?'关闭编辑':'开启编辑'"></el-button>
                <!-- <el-button type="danger" size="mini" @click="pendingRemoveEvent">标记/取消删除</el-button> -->
                <!-- <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button> -->
                <el-button type="success" size="mini" @click="insertEvent(0)">新增一行</el-button>
                <el-button type="danger" size="mini" @click="deleteSelectedEvent">删除选中</el-button>
                <el-button type="info" size="mini" @click="$refs.elxEditable.revert()">放弃更改</el-button>
                <!-- <el-button type="info" size="mini" @click="$refs.elxEditable.clear()">清空表格</el-button> -->
                <!-- <el-button type="warning" size="mini" @click="submitEvent">保存&提交</el-button> -->
            </p>
            <!-- <h4 style="margin:10px 0 10px 0;">请点击每个单元格设置相关属性</h4> -->
            <!-- <el-alert title="可以点击 手动创建 按钮创建表头，也可以点击左上方按钮 导入表格 导入excel 文件噢，导入完成后可进行编辑修改。" type="info"></el-alert> -->
            <!-- <el-alert title="系统已为你自动添加合计行" type="info"></el-alert> -->
            
            <elx-editable
            ref="elxEditable"
            class="scroll-table4"
            border
            height="400"
            size="small"
            :span-method="arraySpanMethod"
            :edit-config="{ render: 'scroll', renderSize: 80, useDefaultValidTip: true}"
            :context-menu-config="{headerMenus, bodyMenus}"
            style="width: 100%">
                <elx-editable-column type="selection" align="center" width="45" ></elx-editable-column>
                <elx-editable-column type="index" align="center" width="50"> </elx-editable-column>
                <elx-editable-column :prop="val+'.td'" :label="hd[i]" align="center" show-overflow-tooltip v-for="(val,i) in hd" :key="i">
                    <template slot-scope="scope" >
                        <el-input v-if="btn.stateEdit" v-model="scope.row[val].td" ></el-input>
                        <div v-else-if="!btn.stateEdit">
                            <el-badge style="display:block;" :hidden="scope.row[val].attribute !=null" is-dot  class="item_red">{{scope.row[val].td}}</el-badge>
                            <el-badge v-show="scope.row[val].attribute !=null" type="warning" :value="badge_name[scope.row[val].attribute]" class="new"></el-badge>
                            <el-badge v-show="scope.row[val].tLimit !=null" type="success" :value="badge_name[scope.row[val].tLimit]" class="new"></el-badge>
                        </div>
                    </template>

                </elx-editable-column>
            </elx-editable>
                
        </el-col>


        <el-col :span="5" :offset="1" :xs="23" :sm="13" :md="8" :lg="6" :xl="5">
            <!-- 此处引入表头名称标段选择Form表单组件 -->


            <!-- 此处引入表头单元格内容属性设置Form表单组件 -->
        </el-col>

    </el-row>

     
</template>

<script>
import XEUtils from 'xe-utils'
// import inven from '../../modules/inventory';
  export default {
    name: 'NewHeader02',
    data () {
        return {
            list: [], //表格数据
            hd: [], //表格数据的所有列名（A,B,C...）
            startTime: Date.now(),
            btn: {
                stateEdit: false, //编辑状态
            },
            loading: false,
            headerMenus: [
                [
                {
                    code: 'ALL_EXPORT',
                    name: '导出全部.csv',
                    prefixIcon: 'el-icon-download'
                }
                ]
            ],
            bodyMenus: [
                [
                    {
                        code: 'ROW_INSERT_ACTIVE',
                        name: '插入新行',
                        prefixIcon: 'el-icon-plus'
                    },
                    {
                        code: 'ROW_REMOVE',
                        name: '删除行',
                        prefixIcon: 'el-icon-minus'
                    }
                ],
                [
                    {
                        code: 'CELL_RESET',
                        name: '清除内容',
                        prefixIcon: 'el-icon-close'
                    },
                    {
                        code: 'CELL_REVERT',
                        name: '还原数据'
                    }
                ],
                [
                    {
                        code: 'ROW_EXPORT',
                        name: '导出行.csv',
                        prefixIcon: 'el-icon-download'
                    },
                    {
                        code: 'ALL_EXPORT',
                        name: '导出全部.csv'
                    }
                ]
            ],
            badge_name:{
                sysOrder:'序号',
                sysNum:'编号',
                formula:'公式',
                sumText:'合计（普通）',
                sumNull:'合计（空）',
                sumFormula:'合计（公式）',
                original:'原清单',
                originalNull:'新清单（无）',
                change:'变更清单',
                update:'新清单',
                updateNull:'新清单（无）',
                meterage:'变更清单？',
                fluctuate:'变更清单（变更清单增减）',
                totalpay:'累计支付清单',
                '1':'max', //max
                '2':'增加MAX',  //increaseMax
                '3':'减少MAX' //decreaseMax
            }
      }
    },
    created () { 
    },
    mounted() {
    },
    methods: {
        impt () { //button 按钮调用input文件选择事件
            this.$refs.input.click()
        },
        importfxx () { //表格导入函数
            this.startTime = Date.now();    //开启计时
            this.loading = true;
            this.$notify.info({
                title: '提示',
                duration: 800,
                message: '正在努力导入表格噢，请稍等片刻。'
            });
            let _this = this;
            this.$excel.Imports(data=>{   // excel文件导入处理函数
                let arr = new Array();
                try {
                    this.hd.length = this.list.length = 0; //归为初始化状态
                    arr = _this.$excel.HeaderAtt(data);
                    _this.list = [...arr];
                    _this.hd = Object.keys(_this.list[0]);
                    arr.length = data.length = 0;
                    console.log('最终处理完成的数据')
                    console.log(_this.list);
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
        edit () {  //开启编辑状态或者关闭编辑
            this.btn.stateEdit ? this.btn.stateEdit = false: this.btn.stateEdit = true;
        },
        findList () {
            this.$nextTick(() => {
                this.$refs.elxEditable.reload([])
                setTimeout(() => {
                    let list = this.list;
                    this.$refs.elxEditable.reload(list)
                    this.loading = false
                    this.$nextTick(() => {
                        this.$message({ message: `渲染 ${this.list.length} 条耗时 ${Date.now() - this.startTime} ms`, type: 'success', duration: 5000, showClose: true })
                    })
                }, 300)
            })
        },
        formatterDate (row, column, cellValue, index) {
            return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
        },
        insertEvent () {
            this.$refs.elxEditable.insert({
                name: `New ${Date.now()}`,
                age: 26,
                rate: 2
            }).then(({ row }) => {
                this.$refs.elxEditable.setActiveCell(row)
            })
        },
        getSelectLabel (value, valueProp, labelProp, list) {
            let item = XEUtils.find(list, item => item[valueProp] === value)
            return item ? item[labelProp] : null
        },
        deleteSelectedEvent () {    //删除选中
            let selection = this.$refs.elxEditable.getSelecteds()
            if (selection.length) {
              this.$refs.elxEditable.removeSelecteds()
              this.$message({ message: '删除成功', type: 'success' })
            } else {
              this.$message({
                type: 'info',
                message: '请至少选择一条数据！'
              })
            }
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {   //单元格合并处理
            if (columnIndex >1) {  //带选择框的情况
                if (row[this.hd[columnIndex-2]]) {
                    return [row[this.hd[columnIndex-2]].tdRowspan, row[this.hd[columnIndex-2]].tdColspan]
                }
            }
            // if (columnIndex < this.hd.length) {   //不带选择框的情况
            //     return [row[this.hd[columnIndex]].tdRowspan, row[this.hd[columnIndex]].tdColspan]
            // }
            return [1, 1]
        }, 
        beforeRouteUpdate (to, from, next) {
            next()
            // this.findList()
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .scroll-table4-oper {
         margin-bottom: 18px;
    }
    .scroll-table4.elx-editable .elx-editable-row.new-insert,
    .scroll-table4.elx-editable .elx-editable-row.new-insert:hover>td {
        background-color: #f0f9eb;
    }

    .text {
  font-size: 14px;
  
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
  text-align: left;
  margin-top: 40px;
  /* top: 15vh; */
}

/* 小红点 */
.item_red {
  margin-top: 5px;
  color: #409EFF;
  /* margin-right: 40px; */
}
/* 小红点 */
.new {
  margin-top: -5px;
  font-size: 5px;
  color: #409EFF;
  /* margin-right: 40px; */
}
.form_editing{
    /* padding: 5px; */
    /* margin: 0 auto; */
    /* border: 1px solid pink; */
    /* border: 1px solid #ffffff; */
    /* border: 1px solid orange; */
    text-align: left;
}
.form_editing, .read-only_form {
    /* padding: 5px; */
    /* margin: 0 auto; */
    /* border: 1px solid pink; */
    /* border: 1px solid #ffffff; */
    /* border: 1px solid orange; */
    margin-top: 10px;
}

.title{
  display: inline;
  margin-right: 10px;
  color: cadetblue;
}
.demonstration {
  /* color: #606266; */
  color: pink;

}
.switch {
  /* text-align: right; */
  position: absolute;
  right: 0px;
}
.el-dialog__body {
  padding: 10px 20px;
}
.el-input-group__append button.el-button {
  /* background-color: rgb(0, 17, 255); */
  background-color: #409EFF;
  color: white;
}
</style>
