<template>
    <div>
        <h4 style="margin:10px 0 10px 0;text-align: left;" class="form_editing" v-show="!btn.editAtt">请点击每个单元格设置相关属性</h4>
        <el-row :gutter="0">
            
            <el-col :span="18"  :xs="24" :sm="20" :md="15" :lg="17" :xl="18">
                <input id="upload" type="file" @change="importfxx()" ref="input" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                <p style="margin:0 0 20px 0; text-align: left;">
                    <el-button type="primary" size="mini" @click="impt">导入表格</el-button>
                    <el-button type="info" size="mini" @click="impt">手动创建</el-button>
                    <el-button type="success" size="mini" @click="edit" v-text="btn.stateEdit?'关闭编辑':'开启编辑'"></el-button>
                    <!-- <el-button type="danger" size="mini" @click="pendingRemoveEvent">标记/取消删除</el-button> -->
                    <!-- <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button> -->
                    <el-button type="success" size="mini" @click="insertEvent">手动添加合计尾行</el-button>
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
                class="click-table1"
                border
                height="300"
                size="mini"
                :span-method="arraySpanMethod"
                @cell-click ="cellClick"
                :cell-style ="cell_select"
                :edit-config="{ render: 'scroll', renderSize: 80}"
                :highlight-current-row="false"
                style="width: 100%">
                    <elx-editable-column type="selection" align="center" width="45" ></elx-editable-column>
                    <elx-editable-column type="index" align="center" width="50"> </elx-editable-column>
                    <elx-editable-column :prop="val+'.td'" :label="hd[i]" align="center" show-overflow-tooltip v-for="(val,i) in hd" :key="i">
                        <template slot-scope="scope" >
                            <el-input v-if="btn.stateEdit" v-model="scope.row[val].td" ></el-input>
                            <div v-else-if="!btn.stateEdit">
                                <!-- <el-badge is-dot :class="[scope.row[val].attribute === null ? 'state':'statenull']">{{scope.row[val].td}}</el-badge> -->
                                <el-badge :style="{display:'block','text-align':scope.row[val].textAlign}" v-if="scope.row[val].attribute ==null && btn.editAtt==false" is-dot class="item_red">{{scope.row[val].td ==null || scope.row[val].td === ''?'&nbsp;&nbsp;':scope.row[val].td}}</el-badge>
                                <span v-else :style="{display:'block','text-align':scope.row[val].textAlign}">{{scope.row[val].td}}</span>
                                <el-badge v-show="scope.row[val].attribute !==null" type="warning" :value="badge_name[scope.row[val].attribute]" class="new"></el-badge>
                                <el-badge v-show="scope.row[val].tLimit !==null" type="success" :value="badge_name[scope.row[val].tLimit]" class="new"></el-badge>
                            </div>
                        </template>
                    </elx-editable-column>
                </elx-editable>
                
                <div v-show="showTable">
                    <click-table :obj="headerTypeObj" :attVal.sync="attVal" :showTable="showTable"></click-table>
                </div>
            </el-col>

            <el-col :span="5" :offset="1" :xs="23" :sm="13" :md="8" :lg="6" :xl="5">
                <div class="headerform">
                    <!-- 此处引入表头名称标段选择Form表单组件 -->
                    <!-- <header-form v-show="!showAtt" :Form="Form"></header-form> -->
                    <el-form :model="Form" v-show="!showAtt" :rules="rules" ref="Form" label-width="90px" size="small" class="demo-ruleForm">
                        <el-form-item label="表头标段" prop="tenderId">
                            <el-select v-model="Form.tenderId" clearable @change="tenChange" placeholder="请选择表头标段" style=" width:100%;">
                                <el-option v-for="(val,i) in tenderList" :key="i" :label="val.name" :value="val.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="表头类型" prop="type">
                            <el-select v-model="Form.type" placeholder="请选择表头类型" @change="typeChange" :disabled="Form.id?true:false" size="small" style=" width:100%;">
                                <el-option label="原清单" value="original"></el-option>
                                <el-option label="变更清单" value="change"></el-option>
                                <el-option label="累计变更清单" value="totalchange"></el-option>
                                <el-option v-if="Form.type =='update'" label="新清单" value="update"></el-option>
                                <el-option label="计量清单" value="meterage"></el-option>
                                <el-option label="累计计量清单" value="totalmeterage"></el-option>
                                <el-option label="支付清单" value="pay"></el-option>
                                <el-option label="累计支付清单" value="totalpay"></el-option>
                                
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="Form.type === 'change' || Form.type === 'totalchange'" label="选择表头" prop="tOriginalHeadId">
                            <el-select v-model="Form.tOriginalHeadId" placeholder="请选择原清单表头" clearable size="small" style=" width:100%;">
                                <el-option v-for="(val,i) in HeadList" :key="i+'a'" :label="val.name" :value="val.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="Form.type === 'totalchange'" label="选择表头" prop="tChangeHeadId">
                            <el-select v-model="Form.tChangeHeadId" placeholder="请选择变更清单表头" clearable size="small" style=" width:100%;">
                                <el-option v-for="(val,i) in ChangeHeadList" :key="i+'b'" :label="val.name" :value="val.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="Form.type === 'meterage' || Form.type === 'totalmeterage'" label="选择新清单表头" prop="tUpdateHeadId">
                            <el-select v-model="Form.tUpdateHeadId" placeholder="请选择新清单表头" clearable size="small" style=" width:100%;">
                                <el-option v-for="val in HeadList" :key="val.id+'c'" :label="val.name" :value="val.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="Form.type === 'totalmeterage'" label="选择计量表头" prop="tMeterageHeadId">
                            <el-select  value-key="3a" v-model="Form.tMeterageHeadId" @change="$forceUpdate()" placeholder="请选择计量清单清单表头" size="small" style=" width:100%;">
                                <el-option v-for="val in MeterageHeadList" :key="val.id+'d'" :label="val.name" :value="val.id"></el-option>
                            </el-select>
                        </el-form-item>                    
                        <el-form-item v-if="Form.type === 'pay' || Form.type === 'totalpay' " label="选择累计计量表头" prop="tTotalmeterageHeadId">
                            <el-select v-model="Form.tTotalmeterageHeadId" placeholder="请选择累计计量清单清单表头"  clearable size="small" style=" width:100%;">
                                <el-option v-for="(val,i) in ToMeterageHeadList" :key="i+'e'" :label="val.name" :value="val.id"></el-option>
                            </el-select>
                        </el-form-item>
                       <el-form-item v-if="Form.type === 'totalpay'" label="选择支付表头" prop="tTotalmeterageHeadId">
                            <el-select v-model="Form.payHeadId" placeholder="请选择支付清单清单表头"  clearable size="small" style=" width:100%;">
                                <el-option v-for="(val,i) in payHeadList" :key="i+'f'" :label="val.name" :value="val.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="表头编号" prop="num">
                            <el-input v-model="Form.num" @blur="queryHeader" ></el-input>
                        </el-form-item>
                        <el-form-item label="表头名称" prop="name">
                            <el-input v-model="Form.name" @blur="queryHeader" ></el-input>
                        </el-form-item>
                    </el-form>



                    <!-- 此处引入表头单元格内容属性设置Form表单组件 -->
                    <el-form v-if="showAtt" :model="row" ref="row" :rules="rules" label-width="100" width="800" size="small">
                        <el-form-item label="设置属性" prop="att">
                            <el-select  v-model="row.attribute" placeholder="请选择属性" filterable remote  @change="attChange" size="small" style=" width:100%;" prop="attribute">
                                <!-- <el-option v-for="(val,i) in allAttribute" :key="i" :label="val.name" :value="val.value"></el-option> -->
                                <el-option v-for="(val,i) in Attribute" :key="i+'aa'" :label="val.name" :value="val.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-for="(val,i) in Attribute" :key="i+'bb'" v-show="row.attribute && row.attribute!==null && val.value === row.attribute && val.input && row.attribute !=='sumText'" label="属性值(点击左边表格的单元格选择值)" >
                            <el-input ref="attValue" v-model="row.attributeValue" :disabled="setState && setState === 'limit'" @focus="attValueFocus">
                                <el-button slot="append" :style="setState !==null && setState !== 'limit' && row.attributeValue ?[c]:[]" type="primary" @click="attValBtn(row.attributeValue)" >确定</el-button>
                                <!-- <button slot="append" @click="attValBtn(row.attributeValue)" >确定</button> -->
                            </el-input>
                        </el-form-item>
                        <el-form-item  v-show ="row.attribute =='sumText'" label="合计尾行单元格内容" >
                            <el-input ref="attValue" v-model="row.td" :autofocus="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item v-show ="Limit.length >0" label="限制单元格大小值">
                            <el-select v-model="row.tLimit" placeholder="请选择限制类型" @change="LimitChange" clearable size="small" style=" width:100%;">
                                <!-- <el-option v-for="(val,i) in Limit" :key="i+'cc'" :label="val.name" :value="val.value"></el-option> -->
                                <el-option  :key="'c33c'" :label="'敬请期待'" :value="null"></el-option>

                            </el-select>
                        </el-form-item>
                        <el-form-item v-show ="row.tLimit && row.tLimit!==null && row.tLimit!=='null'" label="限制值" >
                            <el-input v-model="row.limitValue" @focus="LimitValFocus" :disabled="setState && setState !== 'limit'">
                                <el-button slot="append" :style="setState !==null && setState === 'limit' && row.limitValue ?[c]:[]" type="primary" size="mini" @click="LimitValBtn(row.limitValue)" >确定</el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="`表格列宽 ( 系统已自动调整，请根据内容自行调整 )`" >
                        <br>
                        <!-- <el-slider v-model="row.col_width" :max="500" :min="0" :step="5"> </el-slider> -->
                        <el-slider v-model="row.col_width" :max="500" :min="50" :step="5"> </el-slider>

                        </el-form-item>
                        <el-form-item label="此行行高 ( 默认为最低30px 请根据内容适当调整 )" >
                        <br>
                        <el-slider v-model="row.trHigh" :max="300" :min="30" :step="5"> </el-slider>
                        <div :style="{width:row.col_width+'px',height:row.trHigh+'px','text-align':row.textAlign,'line-height':row.trHigh+'px',border:'1px solid pink'}" >{{row.td}}</div>
                        </el-form-item>
                        <el-form-item label="单元格文字对齐" >
                            <el-select v-model="row.textAlign" placeholder="请选择对齐方式" clearable size="small" style=" width:100%;">
                                <el-option  label="居中" value="center"></el-option>
                                <el-option  label="靠左" value="left"></el-option>
                                <el-option  label="靠右" value="right"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>

            </el-col>

        </el-row>
        <div class="footer">
            <el-button @click="back">{{ cancelBtnName }}</el-button>

            <!-- || (Form.id && !btn.editAtt) -->
            <el-button :disabled="Form.type === 'update' ?true:false" type="primary" @click="next">{{ nextBtnName }}</el-button>
        </div>
        <br>
    </div>
     
</template>

<script>

import clickTable from './headerAtt/clickTable';
import inven from '../../modules/newheaderAtt';
import XEUtils from 'xe-utils';
  export default {
    name: 'NewHeader',
    components: {
        clickTable
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
                tOriginalHeadId: null,    //原清单表头ID 建变更清单和累计变更清单表头时传
                tChangeHeadId: null,  //   变更清单表头ID 建累计变更清单表头时传
                tUpdateHeadId: null,   //（新）清单表ID  建计量清单和累计计量清单表头时传
                tTotalmeterageHeadId: null, //累计计量清单表头ID 建支付清单和累计支付清单表头时传
                tMeterageHeadId: null,         //计量清单表头id     建累计计量清单表头时传
                payHeadId: null,    ////支付清单表头ID    建累计支付清单表头时传
                refCol:null,   //多少列
                refRow:null,   //多少行
                headRowList:[],           //表头单元格内容
            })
        },
        visible:{   //是否显示修改表头
            type: Boolean,
            required: false,
            default: false
        }
    },
    data () {
        return {
            list: [], //表格数据
            hd: [], //表格数据的所有列名（A,B,C...）
            startTime: null,
            btn: {
                stateEdit: false, //单元格编辑状态
                editAtt: true, //编辑属性状态（第一步true，第二步为false）
            },
            //表单的变量
            tenderList: [],//全部标段
            HeadList: [], //该标段所有清单(原清单与新清单)
            ChangeHeadList: [],//该标段所有变更清单表头列表
            MeterageHeadList: [],//该标段所有计量清单表头列表
            ToMeterageHeadList: [], //该标段所有累计计量表头
            payHeadList: [], //该标段所有支付清单表头列表

            //有关属性的变量
            showAtt: false, //显示属性设置子组件
            row: {}, //属性设置传给子组件（引入赋值）
            Attribute: [], //选择表头类型的所有属性
            ifInput: [],    //该表头类型要设置属性值的所有属性名
            Limit: [], //选择表头类型的所有限制值属性
            setState: null, //属性状态
            attVal: {   //点击显示关联的表的单元格，获取到的属性值和id
                id: null,
                key: null
            },
            headerTypeObj: {}, //传给关联表格子组件获取表头的数据  （object）表头类型type  表头id
            showTable: false,//显示关联点击表格单元格         
            c:{color:'white',backgroundColor:'#409EFF'},  //设置属性 确定 按钮背景颜色
            cellStyle: {    //点击单元格颜色变化
                row:null,
                col:null
            },
            rules: {
                att: [
                    { type: 'date', required: true, message: '请选择属性', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入表头名称', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change' }
                ],
                tenderId: [
                     { required: true, message: '请选择表头标段', trigger: 'change' }
                ],
                num: [
                    { required: true, message: '请输入表头编号', trigger: 'blur' },
                     { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change' }
                ],
                type: [
                    { required: true, message: '请选择表头类型', trigger: 'change' }
                ],
                tOriginalHeadId: [
                    { required: true, message: '请选择原清单表头', trigger: 'change' }
                ],
                tChangeHeadId: [
                    { required: true, message: '请选择变更清单表头', trigger: 'change' }
                ],
                tUpdateHeadId: [
                    { required: true, message: '请选择新清单表头', trigger: 'change' }
                ],
                tMeterageHeadId: [
                    { required: true, message: '请选择计量表头', trigger: 'change' }
                ],
                tTotalmeterageHeadId: [
                    { required: true, message: '请选择累计计量表头', trigger: 'change' }
                ],
                payHeadId: [
                    { required: true, message: '请选择支付表头', trigger: 'change' }
                ],

            },

            loading: false,
            badge_name:{
                sysOrder:'序号',
                sysNum:'编号',
                formula:'公式',
                sumText:'合计（文本）',
                sumNull:'合计（空）',
                sumFormula:'合计（公式）',
                original:'原清单',
                originalnull:'原清单（无）',
                change:'变更清单',
                update:'新清单',
                updatenull:'新清单（无）',
                meterage:'计量清单',
                fluctuate:'变更清单增减',
                totalpay:'累计支付清单',
                totalpay_null:'累计支付清单（无）',
                paynull: '支付清单无对应',
                pay: '支付清单',
                'meteragenull': '计量清单（无）',
                'totalmeterage-meterage':'累计计量对应的计量清单',
                'totalmeterage-sum-onerow-auto': '对应累计计量的系统合计行',
                'totalpay-pay': '累计支付对应的支付清单',
                'pay-total': '对应支付清单项的累计相加',
                'meterage-total': '对应计量清单项的累计',
                'totalchange-change': '累计变更对应的变更清单',
                'totalmeterage-head-total': '累计计量表头合计内容',
                'totalchangenull': '累计变更清单（无对应）',
                'change-total': '对应变更清单项的累加',
                totalmeteragenull:'累计计量清单(无)',
                max:'max', //max
                increaseMax:'增加MAX',  //increaseMax
                decreaseMax:'减少MAX' //decreaseMax
            }
      }
    },
    created () { 
        // console.log('父组件默认值')
        // console.log(this.Form)
        this.tenders();//发起请求全部表头标段
    },
    computed: {
      nextBtnName () {
        return this.btn.editAtt ? '下一步' : '提交(为保证数据正确，表头保存后一律不许修改)'
      },
      cancelBtnName () {
        return this.btn.editAtt ? '取消' : '上一步'
      },

    },
    watch: {
        'Form.headRowList': function(New, Old){
            this.showAtt = false;   //隐藏属性组件
            this.hd.length = this.list.length = 0;  //数据清空
            this.row = null;  //属性设置的状态
            this.ifInput.length = this.Attribute.length = 0;
            this.btn.stateEdit = false; //关闭编辑
            this.setState= null; //属性设置状态
            this.attVal = {   //点击显示关联的表的单元格，获取到的属性值和id
                id: null,
                key: null
            };
            this.$nextTick(() => { this.showTable = false; })   //隐藏关联表格
            this.$refs.elxEditable.reload([]);
            if(New ==null || !this.Form.id || New.length === 0) return false;
            
            // console.log('父组件传表头类型值过来了')
            // console.log(this.Form)
            // console.log(New);
            this.loading = true;
            this.list = [];
            // this.row = {};
            let arr = this.$excel.ListAssemble([...New]);  //组装表头
            this.list = arr;
            this.hd = Object.keys(this.list[0]);

            this.Form.headRowList.length = 0;
            if (this.hd[0]!=='A') {
                this.hd.reverse();
            }
            this.findList();    //渲染表格

            if(this.Form.type =='update') return false; //新清单不需要修改
            // 组装属性
            this.Attribute = inven.Attribute(this.Form.type);  //该表头类型的所有可设置的属性
            this.ifInput = inven.ifInput(this.Form.type);    //该表头类型要设置属性值的所有属性名
            this.Limit = inven.Limit(this.Form.type);  //该表头类型要设置的所有限制值属性
            
        },
        'Form.type': function(New, Old){
            if(!New) return false;
            this.typeChange(New);   //表头类型发生改变,需要请求对应的清单
            this.btn.stateEdit = false;
            this.btn.editAtt = true;
            this.$refs.elxEditable.reload([]);

            if(this.Form.type =='update') return false; //新清单不需要修改
            // 组装属性
            this.Attribute = inven.Attribute(New);  //该表头类型的所有可设置的属性
            console.log('该表头类型的所有可设置的属性  '+New)
            console.log(this.Attribute)
            this.ifInput = inven.ifInput(New);    //该表头类型要设置属性值的所有属性名
            this.Limit = inven.Limit(New);  //该表头类型要设置的所有限制值属性
        },
        'Form.tOriginalHeadId': function(New, Old){ //原清单表头ID 建变更清单表头和累计变更清单表头时传
            if ( New && this.Form.type === 'change' || this.Form.type === 'totalchange'){
                // console.log('请求原清单表头')
                this.headerTypeObj = {
                    id: New,
                    type: 'original'
                }
            }
        },
        'Form.tUpdateHeadId': function(New, Old){   //（新）清单表头ID  建计量清单表头和累计计量清单表头时传
            if ( New && this.Form.type === 'meterage' || this.Form.type === 'totalmeterage' ){
                // console.log('请求新清单表头')
                this.headerTypeObj = {
                    id: New,
                    type: 'update'
                }
            }
        },
        'Form.tChangeHeadId': function(New, Old){ //变更清单表头ID 建累计变更清单表头时传
            if ( New && this.Form.type === 'totalchange'){
                // console.log('请求变更清单表头')
                this.headerTypeObj = {
                    id: New,
                    type: 'change'
                }
            }
        },
        'Form.tTotalmeterageHeadId': function(New, Old){   //累计计量清单表头ID 建支付清单表头和累计支付清单表头时传
             if ( New && this.Form.type === 'pay' && this.Form.type === 'totalpay' ){
                // console.log('请求累计计量表头')
                this.headerTypeObj = {
                    id: New,
                    type: 'totalmeterage'
                }
            }   
        },
        attVal: function(New, Old){ //点击显示关联的表的单元格，获取到的属性值和id
            console.log('关联表格单击事件的单元格的行列号和id发送过来了')
            console.log(New)
            if (New && New.id && New.key && this.setState) {
                if (this.setState === 'relation') {
                    this.row.attributeValue = New.key;
                    this.row.attributeValueId = New.id;
                }else if (this.setState === 'limit') {
                    this.row.limitValue = New.key;
                    this.row.limitId = New.id;
                }else if (this.setState === 'change-total' && this.Form.type === 'totalchange') {
                    console.log('有无进来这里change-total')
                    console.log(this.row.attributeValue, this.row.attributeChangeHeadId)
                    this.row.attributeValue = New.key;
                    this.row.attributeChangeHeadId = New.id;
                }else if (this.setState === 'meterage-total' && this.Form.type === 'totalmeterage') {
                    this.row.attributeValue = New.key;
                    this.row.attributeMeterageHeadId = New.id;
                }else if (this.setState === 'pay' && this.Form.type === 'totalpay') {
                    this.row.attributeValue = New.key;
                    this.row.attributePayHeadRowId = New.id;
                }
            }
        },

    },
    mounted() {
    },
    methods: {
        oo () {
            // console.log('验证一下是否没有这个id呀')
            // console.log(this.Form)
        },
        typeChange (req) {  //选择表头的类型
            if(!this.Form.tenderId) return false;
            // 是否调用了
            this.row = {};
            this.HeadList = this.MeterageHeadList = this.payHeadList = this.ChangeHeadList = null;//清空表头列表数据
           if (req === 'change' || req === 'totalchange') {
                this.alloriginal();
                if (req === 'totalchange') {
                    console.log('这里请求变更清单表头列表')
                    //这里请求变更清单表头列表
                    this.Form.payHeadId = this.Form.tMeterageHeadId = this.Form.tUpdateHeadId = this.Form.tTotalmeterageHeadId = null;
                    return this.allchange();
                }
                this.Form.tChangeHeadId = this.Form.payHeadId = this.Form.tMeterageHeadId = this.Form.tUpdateHeadId = this.Form.tTotalmeterageHeadId = null;
            }else if (req === 'meterage' || req === 'totalmeterage') {
                this.allupdate();
                if (req === 'totalmeterage') {
                    // console.log('这里请求计量清单表头列表')
                    //这里请求计量清单表头列表
                    this.Form.payHeadId = this.Form.tOriginalHeadId = this.Form.tTotalmeterageHeadId = this.Form.tChangeHeadId = null;
                    return this.allmeterage();
                }
                this.Form.tChangeHeadId = this.Form.payHeadId = this.Form.tOriginalHeadId = this.Form.tMeterageHeadId = null;

            }else if (req === 'pay' || req === 'totalpay' ) {
            
                this.alltotalmeterage();
                if (req === 'totalpay') {
                    this.allpay();
                    return this.Form.tOriginalHeadId = this.Form.tUpdateHeadId = null;
                }
                this.Form.tChangeHeadId = this.Form.payHeadId = this.Form.tOriginalHeadId = this.Form.tUpdateHeadId = null;
            }
        },
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
                let arr = [];
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
        insertEvent () {
            // console.log('进来了吗')
            if (!this.hd.length || this.hd.length===0) return false;
            var rest = this.$refs.elxEditable.getRecords(),//获取表格的全部数据;
            restLen = rest.length,
            NewRow = {};
            console.log(rest)
            for (let index = this.hd.length -1; index >= 0; index--) {
               NewRow[this.hd[index]]= {name : null, //名称
                col_width : 120, //列宽（注意上行与下行的列宽要相等）
                colWdthProportion : null,//列宽比例
                trHigh : 35, // 行高
                trHighproportion : null,//行高比例
                attribute : null, //属性
                attributeValue : null, //属性值
                textAlign : 'center', //文本对齐对齐方式
                tLimit : null,    //限制值类型 
                limitValue : null, //限制值
                colNum: this.hd[index],
                trNum:restLen+1,
                td: null,
                tdColspan: 1,
                tdRowspan: 1,
                trNum:restLen+1,
                colNum: this.hd[index]
                }
    
            }
            console.log('打印一下NewRow 新增的一行')
            console.log(NewRow);
            this.$refs.elxEditable.insertAt(NewRow, -1)
        },
        next(){  //编辑完成点击下一步(完成提交新建表头按钮)
            let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
            if (this.Form.type !==null) {
                if (this.Form.type === 'change' || this.Form.type === 'totalchange') {
                    if (this.Form.tOriginalHeadId === null) return this.$notify.info({title: '提示',duration: 3000,message: '请先选择原清单表头'});
                    if (this.Form.type === 'totalchange' && this.Form.tChangeHeadId === null) return this.$notify.info({title: '提示',duration: 3000,message: '请先选择变更清单表头'}); 
                }else if(this.Form.type === 'meterage' || this.Form.type === 'totalmeterage'){
                    if (this.Form.type === 'totalmeterage' && this.Form.tMeterageHeadId === null) return this.$notify.info({title: '提示',duration: 3000,message: '请先选择计量清单表头'}); 
                    if (this.Form.tUpdateHeadId === null) return this.$notify.info({title: '提示',duration: 3000,message: '请先选择新清单表头'}); 
                }else if(this.Form.type === 'pay' || this.Form.type === 'totalpay'){
                    if (this.Form.tTotalmeterageHeadId === null) return this.$notify.info({title: '提示',duration: 3000,message: '请先选择累计计量清单表头'}); 
                }
            }else{
                return this.$notify.info({title: '提示',duration: 3000,message: '请先选择表头类型'});
            }
            if (rest.length === 0) return this.$notify.info({title: '提示',duration: 3000,message: '请先导入数据再进行操作'});
         
            if (this.btn.editAtt) {
                this.startTime = Date.now();    //开启计时
                this.btn.editAtt = false;
                if (!this.Form.id) {
                    this.insertEvent(); //添加一行合计尾行
                    let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
                    this.list = rest;   
                    var lastTwo = this.list.slice(-2)[0],
                    arr = Object.keys(lastTwo),
                    one = lastTwo[arr[0]].tdRowspan,
                    tru = arr.every( function( item, index, array ){ 
                        let arrindex = lastTwo[arr[index]].tdRowspan;
                        return one === arrindex; 
                    });
                    if (tru) {
                        for (let index = arr.length - 1; index >= 0; index--) {
                            lastTwo[arr[index]].tdRowspan = 1;
                        }
                    }
                    this.$notify({title: '提示',duration: 5000,message: `系统已自动生成合计尾行`,type: 'success'});
                    // this.findList();
                }   
            }else{  //提交新建表头数据到父组件
                // alert('直接完成')
                // //初始化数据和画面
                // this.initial();
                this.Submission()//提交表格数据函数

            }
        },
        back(){ //编辑完成点击上一步
            if (this.btn.editAtt) { //取消按钮
                //初始化数据和画面
                this.initial();


            }else{
                this.startTime = Date.now();    //开启计时
                //关闭属性设置（第二步），返回编辑第一步
                this.btn.editAtt = true;
                //隐藏属性设置子组件
                this.showAtt = false;
                this.$nextTick(() => { this.showTable = false; })   //隐藏关联表格
                this.row = {};  //属性设置的状态
                this.btn.stateEdit = false; //关闭编辑
                this.attVal = this.setState= null; //属性设置状态

                if (!this.Form.id) {
                    //此处删除合计尾行
                    let rest = this.$refs.elxEditable.getRecords()  //获取表格的全部数据
                    this.$refs.elxEditable.remove(rest[rest.length-1]);
                }
            }
        },
        initial () {    //提交完成与取消按钮的初始化
            this.btn.editAtt = true;    //返回第一步编辑状态
            this.showAtt = false;   //隐藏属性组件
            this.hd.length = this.list.length = 0;  //数据清空
            this.row = {};  //属性设置的状态
            this.ifInput.length = this.Attribute.length = 0;
            this.btn.stateEdit = false; //关闭编辑
            this.setState= null; //属性设置状态
            this.attVal = {   //点击显示关联的表的单元格，获取到的属性值和id
                id: null,
                key: null
            };
            this.$nextTick(() => { this.showTable = false; })   //隐藏关联表格
            if (this.visible) {
                let surrce = false;
                this.$emit("update:visible", surrce);   //关闭弹出显示建立表头窗口
            }
        },
        Submission () {
            if ( !this.Form.num || this.Form.num=='' || !this.Form.name || this.Form.name =='') {
                return this.$message({ message: '表头名字与编号不能为空！', type: 'error' });
            }
            
            var rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
            if (rest.length ==0 ) return this.$message({ message: '当前无数据不能提交！', type: 'error' });
            this.loading = true;
            //表头解构
            console.log('rest-------------')
            console.log(rest)
            this.Form.headRowList = this.$excel.Unpack(rest);
            var url = '';
            this.Form.id ? url = '/head/update' : url = '/head/add'
            var params = {...this.Form};
            params.refCol = this.hd.length;
            params.refRow = rest.length;
            if (!this.Form.id) {
                this.$post(url,params)
                .then((response) => {
                    if(response.data.repeat ==1){
                        this.$message({ message: '提交失败，已有这个表头,请修改表头名称编号。', type: 'error' })
                    }else{
                        //保存成功  进行数据初始化
                        this.$notify({title: '提示',duration: 5000,message: `表头创建成功`,type: 'success'});
                        this.initial();
                    }
                })
            }else{
                params.headRowList = [];
                this.$post(url,params)
                .then((response) => {
                    // console.log('查看路劲，参数以及是否删除成功')
                    // console.log(url,params)
                    if (response.status=='SUCCESS') {
                        let surrc = {...this.Form};
                        this.$post(url,surrc).then((response) => {
                            //保存成功  进行数据初始化
                            this.$notify({title: '提示',duration: 5000,message: `表头修改成功`,type: 'success'});
                            this.initial();
                        })
                    }
                })
            }         
        },


        //新建表头的表单设置函数
        tenders () {   //请求标段函数
                //发起网络请求
            this.$post('/tender/getall',{})
                .then((response) => {
                this.tenderList = response.data.tenderList;
            })
         
        },
        alloriginal () {  //所有该标段的原清单的id和名字
             this.$post('/head/alloriginal',{tenderId:this.Form.tenderId})
            .then((response) => {
            // console.log('所有原清单的id和名字')
            // console.log(response)
            this.HeadList = response.data.originalHeadList;
          })
        },
        allupdate () {  //所有该标段的新清单表头的id和名字
             this.$post('/head/allupdate',{tenderId:this.Form.tenderId})
            .then((response) => {
            // console.log('所有变更后清单的id和名字')
            // console.log(response)
            this.HeadList = response.data.updateHeadList;
          })
        },
        allchange () {  //所有该标段的变更清单的id和名字
             this.$post('/head/allchange',{tenderId:this.Form.tenderId})
            .then((response) => {
            // console.log('所有原清单的id和名字')
            // console.log(response)
            this.ChangeHeadList = response.data.changeHeadList;
          })
        },
        allmeterage () {    //所有计量清单表头的id和名字
            this.$post('/head/allmeterage',{tenderId:this.Form.tenderId})
            .then((response) => {
                // console.log('所有计量清单表头的id和名字')
                // console.log(response)
                // this.$set(this.MeterageHeadList, response.data.meterageHeadList)
                this.MeterageHeadList = response.data.meterageHeadList;
            })
        },
        alltotalmeterage () {  //所有该标段的累计计量清单表头的id和名字
             this.$post('/head/alltotalmeterage',{tenderId:this.Form.tenderId})
            .then((response) => {
            // console.log('所有累计计量清单表头的id和名字')
            // console.log(response)
            this.ToMeterageHeadList = response.data.headList;
          })
        },
        allpay () {  //所有该标段的支付表头的id和名字
             this.$post('/head/allpay',{tenderId:this.Form.tenderId})
            .then((response) => {
            // console.log('所有支付清单表头的id和名字')
            // console.log(response)
            this.payHeadList = response.data.payHeadList;
          })
        },

        tenChange () {
            this.typeChange(this.Form.type)
        },
        queryHeader () {  //查询用户当前输入的表头名之类的是否已存在数据库
            var params = {
                tenderId: this.Form.tenderId,
                num: this.Form.num,
                name: this.Form.name,
                type: this.Form.type
            }
            if ( !params.tenderId || !params.num || !params.name || params.name =='' || !params.type) {
                return false;
            }
            var url = '/head/'+this.Form.type;
            if (this.Form.type === 'update') {
                url = '/head/one/'+this.Form.type;
            }
            this.$post(url,params)
            .then((response) => {
              if (response.data.head) {
                  return this.$message({ message: '该表头已存在，请换个表名试试吧。', type: 'error' })
              }
          })

        },

        //-----有关属性的处理函数-----

        cellClick (row, column, cell, event) { //单元格点击事件
            if (column.property && !this.btn.editAtt) {  //做容错处理，防止点击到选择框触发此事件
                //显示属性设置子组件
                this.showAtt = true;
                //从单击单元格获取单元格的数据
                var colum =column.property;
                colum = colum.substr(0,colum.indexOf('.'));

                // 点击显示单元格边框变色
                this.cellStyle.row = row[colum].trNum;
                this.cellStyle.col = column.id;

                    //点击单元格获取 和key（位置）
                var key = `${row[colum].colNum}${row[colum].trNum}`;
                // console.log('key.......................................')
                // console.log(key)
                this.$forceUpdate(); // 强制刷新
                if (this.setState === null) {
                    //赋值传到属性设置子组件中
                    this.row = row[colum];
                    if ( !this.row.tLimit ) {
                        this.row['tLimit']='';
                    }else if (!this.row.limitValue) {
                        this.row['limitValue'] = '';
                    }else if (!this.row.attribute) {
                        this.row['attribute'] = '';
                    }else if (!this.row.attributeValue) {
                        this.row['attributeValue'] = '';
                    }
                   
                    //显示属性设置组件
                    this.showAtt = true;
                }else{
                    if (this.setState === 'formula') {
                        this.row.attributeValue === null ? this.row.attributeValue ="":this.row.attributeValue ;
                        this.row.attributeValue += key;  
                    }else if (this.setState === 'attribute') {
                        this.row.attributeValue = key;
                    }
                }
            }
        },
        cell_select ({row, column, rowIndex, columnIndex}){ //单元格样式
            if (column.property && !this.btn.editAtt) {  //做容错处理，防止触发此事件
                if (columnIndex >1) { //带选择框的情况
                    row = row[this.hd[columnIndex-2]];
                    if (this.row && this.row['colNum'] && this.row['trNum']) {
                        if (rowIndex === this.row['trNum']-1 && this.hd[columnIndex-2] === this.row['colNum']) {
                            return { 'background':'#99FFFF' };
                        }
                    }
                    if (rowIndex === this.cellStyle.row-1 && column.id === this.cellStyle.col) {
                        return { 'border':'1px solid #409EFF' };
                    }
                }
            }
            return {};
        },
        typeAttState (type) {   //判断属性 然后设置属性值状态 
            if(!type) return false;
            if (this.setState === 'limit') {
                return this.$notify.info({title: '提示',duration: 800,message: '您正在设置限制值属性，请先设置完哦，并且点击确定！'}); 
            }
            if (type =='sysOrder' || type === 'sysNum' ) {
                this.setState = null; //初始状态，可随意切换单元格设置属性状态
            } else if ((type =='pay' || type === 'pay-total') && this.Form.type === 'totalpay') {
                this.setState = 'pay'; //改为关联支付清单设置属性状态
                this.headerTypeObj = {
                        id: this.Form.payHeadId,
                        type: 'pay'
                };
                return this.$nextTick(() => { this.showTable = true; }); //显示关联表格
            }else if (type =='original' || type === 'update' || type === 'totalmeterage-head-total'){
                this.setState = 'relation'; //改为关联设置属性状态
                if (this.Form.type =='change' || this.Form.type =='totalchange'){
                    this.headerTypeObj = {
                        id: this.Form.tOriginalHeadId,
                        type: 'original'
                    }
                }
                if (this.Form.type =='totalmeterage' && this.headerTypeObj.type === 'meterage'){
                    // console.log('当前是正在建累计计量表头，上一个表头是'+this.headerTypeObj.type+',所以现在请求新清单表头')
                    this.headerTypeObj = {
                        id: this.Form.tUpdateHeadId,
                        type: 'update'
                    }
                }
                if ((this.Form.type === 'totalpay' || this.Form.type === 'pay') && type === 'totalmeterage-head-total' ) {
                    this.headerTypeObj = {
                        id: this.Form.tTotalmeterageHeadId,
                        type: 'totalmeterage'
                    }
                }
                return this.$nextTick(() => { this.showTable = true; }) //显示关联表格
                // 显示引入的表格
            }else if (type =="meterage-total"){
                // console.log('没进来吗----------------')
                this.setState = 'meterage-total'; //改为关联属性状态
                if ( this.Form.type =='totalmeterage'){ //建立累计计量表头时，需要选择一个计量表头
                    // console.log('请求计量表头')
                    this.headerTypeObj = {
                        id: this.Form.tMeterageHeadId,
                        type: 'meterage'
                    }
                //此处要清空其他id
                }
                return this.$nextTick(() => { this.showTable = true; }) //显示关联表格
            }else if (type =="change-total"){
                // console.log('没进来吗----------------')
                this.setState = 'change-total'; //改为关联属性状态
                if ( this.Form.type =='totalchange'){ //建立累计变更表头时，需要选择一个变更表头
                    // console.log('请求计量表头')
                    this.headerTypeObj = {
                        id: this.Form.tChangeHeadId,
                        type: 'change'
                    }
                //此处要清空其他id
                }
                return this.$nextTick(() => { this.showTable = true; }) //显示关联表格
            }
            else if(type === 'formula'){ //设置公式                        
                this.setState = 'formula'; //改为公式状态
            }else if(type === 'sumText'){ //设置合计尾行文字            
                this.setState = null;  //改为设置合计尾行单元格文字状态
            }else if(type === 'sumNull'){ //设置合计尾行空                       
                this.row.td ='';    //直接把单元格内容清除为空
                this.setState = null;   //状态改为空
            }else if (this.ifInput.indexOf(type)!==-1 || type === 'sumFormula') {
                this.setState = 'attribute';    //改为设置属性状态
            }else{
                this.setState = null; //初始状态，可随意切换单元格设置属性状态。
            }
            this.$nextTick(() => { this.showTable = false; });   //隐藏关联表格
        },
        attChange (type) {  //选择属性的选择框改变事件
            this.row.attributePayHeadRowId = this.row.attributeMeterageHeadId = this.row.attributeValueId = this.row.attributeValue = null;
            this.typeAttState(type);  //调用属性值设置状态
        },
        attValueFocus (e) { //属性值输入框获取焦点时触发的函数
            // if (this.setState) {   //当属性值状态为null时,判断设定属性值设置状态
            var type = this.row.attribute;
            this.typeAttState(type);  //调用属性值设置状态
        },
        attValBtn (val) {  //属性值后面的输入框
            if (this.setState === 'limit') {
                return this.$notify.info({title: '提示',duration: 800,message: '您正在设置限制值属性，请先设置完哦，并且点击确定！'}); 
            }
            if (val==null || val== '') {
                return this.$notify.info({title: '提示',duration: 800,message: '不能为空哦，否则将导致后续无法正常识别。'}); 
            }
            this.setState = null; //初始状态，可随意切换单元格设置属性状态。
            return this.$nextTick(() => { this.showTable = false; })
        },
        LimitAttState (type) {   //判断限制值属性 然后设置限制属性属性值状态 
            if (this.setState !== 'limit' && this.setState !== null) {
                return this.$notify.info({title: '提示',duration: 800,message: '您正在设置其他属性，请先设置完哦，并且点击确定！'}); 
            }
            if(type =='null') return this.setState = null; //初始状态，可随意切换单元格设置属性状态。
            this.setState = 'limit';
            
        },
        LimitChange (type) {  //选择属性的选择框改变事件
            return false;  //敬请期待

            this.row.limitId = this.row.limitValue = null;
            this.LimitAttState(type);  //调用限制值属性值设置状态
        },
        LimitValFocus (e) { //限制值属性值输入框获取焦点时触发的函数
            let type = this.row.attribute;
            this.LimitAttState(type);  //调用属性值设置状态
        },
        LimitValBtn (val) {  //属性值后面的输入框
            if (this.setState !== 'limit' && this.setState !== null) {
                return this.$notify.info({title: '提示',duration: 800,message: '您正在设置其他属性，请先设置完哦，并且点击确定！'}); 
            }
            if (val==null || val== '') {
                return this.$notify.info({title: '提示',duration: 800,message: '不能为空哦，否则将导致后续无法正常识别。'}); 
            }
            this.setState = null; //初始状态，可随意切换单元格设置属性状态。
            this.$nextTick(() => { this.showTable = false; })   //隐藏关联表格
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
        margin: 30px 0 0 0;
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
  margin-top: 50px;
  /* top: 15vh; */
}

/* 小红点 */
.item_red {
  margin-top: 5px;
  /* color: #409EFF; */
}

/* 上一步下一步按钮 */
.footer {
    text-align: right;
    margin: 35px 50px 0 0;
}

/* 合计尾行特别样式 */
.click-table1.elx-editable .elx-editable-row .success-row {
    background: #f0f9eb;
}
.click-table1-oper {
  margin-bottom: 18px;
}
.click-table1.elx-editable .elx-editable-row.new-insert,
.click-table1.elx-editable .elx-editable-row.new-insert:hover>td {
  background-color: #f0f9eb;
}
.color {
    width: 100%;
    height: 100%;
    background-color: #409EFF;
    color: white;
}
.colornull {
    width: 100%;
    height: 100%;
    background-color: #409EFF;
    color: white;
}
/* .el-input-group__append button.el-button {
  background-color: #409EFF;
  color: white;
} */
</style>
