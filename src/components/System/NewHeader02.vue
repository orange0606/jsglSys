<template>
    <div>
    <h4 style="margin:10px 0 10px 0;" v-show="!btn.edit">请点击每个单元格设置相关属性</h4>
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
            :row-class-name="tableRowClassName"
            @cell-click ="cellClick"
            :edit-config="{ render: 'scroll', renderSize: 80, useDefaultValidTip: true}"
            :context-menu-config="{headerMenus, bodyMenus}"
            style="width: 100%">
                <elx-editable-column type="selection" align="center" width="45" ></elx-editable-column>
                <elx-editable-column type="index" align="center" width="50"> </elx-editable-column>
                <elx-editable-column :prop="val+'.td'" :label="hd[i]" align="center" show-overflow-tooltip v-for="(val,i) in hd" :key="i">
                    <template slot-scope="scope" >
                        <el-input v-if="btn.stateEdit" v-model="scope.row[val].td" ></el-input>
                        <div v-else-if="!btn.stateEdit">
                            <!-- <el-badge is-dot :class="[scope.row[val].attribute == null ? 'state':'statenull']">{{scope.row[val].td}}</el-badge> -->
                            <el-badge style="display:block;" :hidden="scope.row[val].attribute !=null" is-dot class="item_red">{{scope.row[val].td ==null || scope.row[val].td == ''?'&nbsp;&nbsp;':scope.row[val].td}}</el-badge>
                            <el-badge v-show="scope.row[val].attribute !=null" type="warning" :value="badge_name[scope.row[val].attribute]" class="new"></el-badge>
                            <el-badge v-show="scope.row[val].tLimit !=null" type="success" :value="badge_name[scope.row[val].tLimit]" class="new"></el-badge>
                        </div>
                    </template>

                </elx-editable-column>
            </elx-editable>
                
        </el-col>


        <el-col :span="5" :offset="1" :xs="23" :sm="13" :md="8" :lg="6" :xl="5">
            <div class="headerform">
                <!-- 此处引入表头名称标段选择Form表单组件 -->
                <header-form v-show="!showAtt" :Form="Form"></header-form>

                <att-form v-show="!btn.editAtt && showAtt" :row="rowAtt" :type="Form.type"></att-form>
            </div>
            <!-- 此处引入表头单元格内容属性设置Form表单组件 -->
        </el-col>

    </el-row>
    <div class="footer">
        <el-button @click="back">{{ cancelBtnName }}</el-button>
        <el-button type="primary" @click="next">{{ nextBtnName }}</el-button>
    </div>
    </div>
     
</template>

<script>
import headerForm from './headerAtt/headerForm';
import attForm from './headerAtt/attForm';


import XEUtils from 'xe-utils';
// import inven from '../../modules/inventory';
  export default {
    name: 'NewHeader02',
    components: {
        headerForm,
        attForm
    },
    props: {
        Form:{  //表单数据
            type: Object,
            required: false,
            default: () => ({    //利用引用赋值给新建表头表单子组件进行赋值
                sysOrder: null,          //系统序号 预留，暂时不用
                sysNum: null,           //系统编号 预留，暂时不用
                tenderId: null,   //标段id 
                num: null,    //表头编号
                name: null,           //表名
                type: null,          //类别 original原清单change变更清单update变更后的清单meterage计量清单 totalmeterage累计计量清单 pay支付清单 totalpay累计支付清单
                tOriginalHeadId: null,    //原清单表头ID，建变更清单和变更后清单表头时传
                tUpdateHeadId:null,   //变更后新清单表头ID，建计量清单表头时需要
                refCol:null,   //多少列
                refRow:null,   //多少行
                headRowList:[],           //表头单元格内容
            })
        },
    },
    data () {
        return {
            list: [], //表格数据
            hd: [], //表格数据的所有列名（A,B,C...）
            startTime: Date.now(),
            btn: {
                stateEdit: false, //单元格编辑状态
                editAtt: true, //编辑属性状态（第一步true，第二步为false）
            },
            showAtt: false, //显示属性设置子组件
            rowAtt: {}, //属性设置传给子组件（引入赋值）
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
    computed: {
      nextBtnName () {
        return this.btn.editAtt ? '下一步' : '提交'
      },
      cancelBtnName () {
        return this.btn.editAtt ? '取消' : '上一步'
      },

    },
    watch: {
        'Form.type': function(New, Old){
            console.log('子组件传表头类型值过来了')
            console.log(New);
            //对于表头类型的更改，每次改变，应把表格数据为空
            this.hd.length = this.list.length = 0; 
            this.btn.stateEdit = false;
            this.btn.editAtt = true;
            this.$refs.elxEditable.reload([]);
        }

    },
    mounted() {
    },
    methods: {
        impt () { //button 按钮调用input文件选择事件
            this.$refs.input.click();
        },
        importfxx () { //表格导入函数
            this.btn.editAtt = true;    //当前为第一步编辑状态
            this.startTime = Date.now();    //开启计时
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
        edit () {  //开启编辑状态或者关闭编辑
            this.btn.stateEdit ? this.btn.stateEdit = false: this.btn.stateEdit = true;
        },
        findList () {
            this.$nextTick(() => {
                this.$refs.elxEditable.reload([]);
                setTimeout(() => {
                    let list = this.list;
                    this.$refs.elxEditable.reload(list)
                    this.loading = false
                    this.$nextTick(() => {
                        this.$notify({title: '提示',duration: 5000,message: `渲染 ${this.list.length} 条耗时 ${Date.now() - this.startTime} ms`,type: 'success'});
                        // this.$message({ message: `渲染 ${this.list.length} 条耗时 ${Date.now() - this.startTime} ms`, type: 'success', duration: 5000, showClose: true })
                    });
                }, 300)
            })
        },
        next(){  //编辑完成点击下一步(完成提交新建表头按钮)
            let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
            if (this.Form.type !=null) {
                if (this.Form.type == 'change') {
                    if (this.Form.tOriginalHeadId == null) return this.$notify.info({title: '提示',duration: 3000,message: '请先选择原清单表头'});
                }else if(this.Form.type == 'meterage'){
                    if (this.Form.tUpdateHeadId == null) return this.$notify.info({title: '提示',duration: 3000,message: '请先选择变更后新清单表头'}); 
                }
            }else{
                return this.$notify.info({title: '提示',duration: 3000,message: '请先选择表头类型'});
            }
            if (rest.length ==0) return this.$notify.info({title: '提示',duration: 3000,message: '请先导入数据再进行操作'});
         
            if (this.btn.editAtt) {
                this.startTime = Date.now();    //开启计时
                this.btn.editAtt = false;
                if (!this.Form.id) {
                    //此处生成合计尾行
                    let tr = XEUtils.clone(rest[rest.length-1], true);
                    rest.push(tr);
                    let hd = Object.keys(rest[0]);
                    for (let i = 0; i < hd.length; i++) {
                    let tb = rest[rest.length-1][hd[i]];
                    // let tb2 = rest[rest.length-2][hd[i]];
                    tb.td = '合计'+i;
                    tb.trNum +=1;
                    tb.tdRowspan >=0?tb.tdRowspan =1:tb.tdRowspan=1;
                    tb.tdColspan >=0?tb.tdColspan =1:tb.tdColspan=1;
                    }
                    this.list = rest;   
                    let lastTwo = this.list.slice(-2)[0];
                    let arr = Object.keys(lastTwo);
                    let one = lastTwo[arr[0]].tdRowspan;
                    let tru = arr.every( function( item, index, array ){ 
                        let arrindex = lastTwo[arr[index]].tdRowspan;
                        return one == arrindex; 
                    });
                    if (tru) {
                        for (let index = 0; index < arr.length; index++) {
                            lastTwo[arr[index]].tdRowspan = 1;
                        }
                    }
                    this.$notify({title: '提示',duration: 5000,message: `系统已自动生成合计尾行`,type: 'success'});

                    this.findList();
                }   
            }else{  //提交新建表头数据到父组件
                // alert('直接完成')
                this.btn.editAtt = true;
                // this.Submission()//提交表格数据函数

            }
        },
        back(){ //编辑完成点击上一步
            if (this.btn.editAtt) {
                this.btn.editAtt = true;

            }else{
                this.startTime = Date.now();    //开启计时
                //关闭属性设置（第二步），返回编辑第一步
                this.btn.editAtt = true;
                //隐藏属性设置子组件
                this.showAtt = false;
                if (!this.Form.id) {
                    //此处删除合计尾行
                    let rest = this.$refs.elxEditable.getRecords()  //获取表格的全部数据
                    rest.pop();
                    this.list =rest;
                    this.findList();
                }
            }
        },

        cellClick(row, column, cell, event){ //单元格点击事件

              if (column.property && !this.btn.editAtt) {  //做容错处理，防止点击到选择框触发此事件
                    //显示属性设置子组件
                    this.showAtt = true;

                    //从单击单元格获取单元格的数据
                    let colum =column.property;
                    colum = colum.substr(0,colum.indexOf('.'));

                    //赋值传到属性设置子组件中
                    this.rowAtt = row[colum];

                    // this.lead.cell_row = row[colum].trNum;
                    // this.lead.cell_col = column.id;
                    // // console.log(column)
                    // this.lead.cell_hd = colum;
                    // //点击单元格获取id 和key（位置）
                    // this.lead.att_id = row[colum].id;
                    // this.lead.att_key = `${row[colum].colNum}${row[colum].trNum}`;

                //     if(this.lead.att_click_type == 'formula'){    ////点击单元格设置公式属性值
                          
                //           // console.log(this.lead.att_id,this.lead.att_key)
                //           // console.log('this.row_att')
                //           // console.log('进来了公式设置')
                //           console.log(this.row_att)
                //           this.row_att.attributeValue==null? this.row_att.attributeValue="":this.row_att.attributeValue;
                //           this.row_att.attributeValue = this.row_att.attributeValue+this.lead.att_key;
                          
                //     }else if(this.lead.att_click_type =='limit'){  //点击单元格设置限制属性值与id
                //             // console.log('点击单元格设置限制属性值与')
                //             this.row_att.limitValue = this.lead.att_key;
 
                //    }else if(this.lead.att_click_type == null){
                //           //调用点击属性设置显示事件
                //           // console.log('调用点击属性设置显示事件')
                //           this.att(row[colum])
                //     }  
                //     //手动刷新表格
                //     this.refresfhs();
                //     // this.$refs.elxEditable.doLayout()
              }
          },

        formatterDate (row, column, cellValue, index) {
            return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
        },
        insertEvent () {
            this.$refs.elxEditable.insert({
                name: `New ${Date.now()}`,
                age: 26,
                rate: 2
            }).then(({ row }) => {
                this.$refs.elxEditable.setActiveCell(row);
            })
        },
        getSelectLabel (value, valueProp, labelProp, list) {
            let item = XEUtils.find(list, item => item[valueProp] === value)
            return item ? item[labelProp] : null;
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
                    return [row[this.hd[columnIndex-2]].tdRowspan, row[this.hd[columnIndex-2]].tdColspan];
                }
            }
            return [1, 1];
        }, 
        tableRowClassName({row, rowIndex}) {   //最后一行合计尾行特别样式
            let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
            if (rowIndex === rest.length) {
                return 'success-row';
            }
            return '';
        },
        beforeRouteUpdate (to, from, next) {
            next();
            this.findList();
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /* .box {
        width: 100%;
        height: 100%;
        position: relative;
    } */
    .scroll-table4-oper {
         margin-bottom: 18px;
    }
    .scroll-table4.elx-editable .elx-editable-row.new-insert,
    .scroll-table4.elx-editable .elx-editable-row.new-insert:hover>td {
        background-color: #f0f9eb;
    }
    .headerform {
        margin: 70px 0 0 0;
    }
    /* 属性设置状态 未与已 */

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
}

/* 上一步下一步按钮 */
.footer {
    text-align: right;
    margin: 35px 50px 0 0;
}

/* 合计尾行特别样式 */
.scroll-table4.elx-editable .elx-editable-row .success-row {
    background: #f0f9eb;
}
</style>
