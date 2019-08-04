<template>
    <!-- <div v-if="dialog"> -->
    <el-dialog
    title="建立表头"
    :visible.sync="dialog"
    width="95%"
    :append-to-body="false" 
    top="9vh"
    :before-close="handleClose">
      <el-row :gutter="0">
        <el-collapse-transition>
        <el-col :span="18"  :xs="24" :sm="20" :md="15" :lg="17" :xl="18">
            <div v-if="From.tender" class="title">标段名称：<span class="demonstration" v-text="From.tender.name"></span></div>  
            <div class="title">表头编号：<span class="demonstration" v-text="From.num"></span></div>
            <div class="title">表头名称：<span class="demonstration" v-text="From.name"></span></div>
            <div class="title">类别：<span class="demonstration" v-text="typeName"></span></div>
            <div v-if="From.saveEmployee" class="title">创建人：<span class="demonstration" v-text="From.saveEmployee.name"></span></div>
            <div class="title">创建时间：<span class="demonstration" v-text="From.saveTime"></span></div>
            
            <div class="form_editing" >
                <input id="upload" type="file" @change="importfxx()" ref="input" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                <p v-show="btn.edit" style="margin:0 0 20px 0">
                  <el-button type="primary" size="mini" @click="impt">导入表格</el-button>
                  <el-button type="info" size="mini" @click="impt">手动创建</el-button>
                  <el-button type="success" size="mini" @click="showEdit?showEdit=false:showEdit=true;refresfhs()">{{showEditName}}</el-button>
                  <el-button type="danger" size="mini" @click="pendingRemoveEvent">标记/取消删除</el-button>
                  <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
                  <el-button type="success" size="mini" @click="insertEvent(0)">新增一行</el-button>
                  <el-button type="danger" size="mini" @click="deleteSelectedEvent">删除选中</el-button>
                  <el-button type="info" size="mini" @click="$refs.elxEditable.revert()">放弃更改</el-button>
                  <!-- <el-button type="info" size="mini" @click="$refs.elxEditable.clear()">清空表格</el-button> -->
                  <el-button type="warning" size="mini" @click="submitEvent">保存&提交</el-button>
                </p>
                <h4 style="margin:10px 0 10px 0;" v-show="!btn.edit">请点击每个单元格设置相关属性</h4>
               <el-alert v-show="btn.edit" title="可以点击 手动创建 按钮创建表头，也可以点击左上方按钮 导入表格 导入excel 文件噢，导入完成后可进行编辑修改。" type="info"></el-alert>
               <el-alert v-show="!btn.edit" title="系统已为你自动添加合计行" type="info"></el-alert>
                <p>&nbsp;</p>
                <elx-editable
                  v-loading="loading" 
                  ref="elxEditable"
                  class="click-table12"
                  border
                  width="100%"
                  :highlight-current-row="false"
                  :data.sync="list"
                  height="350"
                  :span-method="arraySpanMethod"
                  @select="selectEvent"
                  @current-change="currentChangeEvent"
                  @cell-click ="cell_click"
                  :cell-style ="cell_select"
                  :edit-config="{ render: 'scroll',showIcon: true, showStatus: true, isTabKey: true, isArrowKey: true, isCheckedEdit: true}"
                  >
                  <elx-editable-column v-if="showEdit && btn.edit" type="selection" align="center" width="45"  ></elx-editable-column>
                  <elx-editable-column v-if="!showEdit || !btn.edit" type="index" align="center" width="50"> </elx-editable-column>
                  <elx-editable-column :prop="val+'.td'" :label="columnName[i]" align="center" show-overflow-tooltip v-for="(val,i) in hd" :key="i">
                      <template slot-scope="scope" >
                          <el-input v-if="btn.edit && showEdit" v-model="scope.row[val].td" ></el-input>
                          <div v-else-if="!btn.edit">
                              <el-badge style="display:block;" :hidden="scope.row[val].attribute !=null" is-dot  class="item_red">{{scope.row[val].td}}</el-badge>
                              <el-badge v-show="scope.row[val].attribute !=null" type="warning" :value="badge_name[scope.row[val].attribute]" class="new"></el-badge>
                              <el-badge v-show="scope.row[val].tLimit !=null" type="success" :value="badge_name[scope.row[val].tLimit]" class="new"></el-badge>
                          </div>
                      </template>

                  </elx-editable-column>
                </elx-editable>
            </div>
                <!-- ********点击 attribute之后的选择清单类型，然后显示引入的只读表格****** -->
            <transition name="el-fade-in-linear">
            <div class="read-only_form" v-if="show_lead">
                  <h3 style="margin:20px 0 20px 0;">请点击下方原清单单元格选取属性</h3>
                  <div v-if="From2.tender" class="title">标段名称：<span class="demonstration" v-text="From2.tender.name"></span></div>  
                  <div class="title">表头编号：<span class="demonstration" v-text="From2.num"></span></div>
                  <div class="title">表头名称：<span class="demonstration" v-text="From2.name"></span></div>
                  <div class="title">类别：<span class="demonstration" >原清单</span></div>
                  <div v-if="From2.saveEmployee" class="title">创建人：<span class="demonstration" v-text="From2.saveEmployee.name"></span></div>
                  <div class="title">创建时间：<span class="demonstration" v-text="From2.saveTime"></span></div>
                  <!-- <el-alert title="，系统已为您自动添加合并行，请点击表格的每个单元格设置相关属性以及公式，全部设置完成方可提交。" type="info"></el-alert> -->
                  <h1>&nbsp;</h1>
                  <elx-editable
                      v-loading="lead.loading" 
                      ref="elxEditable1"
                      class="click-table12"
                      border
                      :data="lead.list"
                      :span-method="arraySpanMethod"
                      @cell-click ="cell_click2"
                      :cell-style ="cell_select"
                      :edit-config="{ render: 'scroll'}"
                      >
                          <elx-editable-column type="index" width="50"> </elx-editable-column>
                          <elx-editable-column  :prop="val+'.td'" :label="columnName[i]" show-overflow-tooltip v-for="(val,i) in lead.hd" :key="i"  >
                          </elx-editable-column>
                    </elx-editable>
            </div>
            </transition>
      </el-col>
      </el-collapse-transition>

      <el-collapse-transition>
      <el-col :span="5" :offset="1" :xs="23" :sm="13" :md="8" :lg="6" :xl="5">
            
            <div class="tips" v-show="!shwo_att" style="margin:72px 0 0 0">
                <!-- <br><br> -->
                <template>
                  <el-card class="box-card">
                    <div slot="header" class="clearfix" >
                      <span>注意事项</span>
                      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                    </div>
                    <div class="text item" style="color: red;font-size: 13px;">
                      第一步
                    </div>
                    <div class="text item" style="font-size: 13px;">
                      上下左右方向键切换列、Tab 键切换列、选中后可直接输入值覆盖旧值、点击单元格进行编辑修改
                    </div> 
                    <div class="text item" style="color: red;font-size: 12px;">
                      第二步
                    </div>                    
                    <div class="text item" style="font-size: 12px;">
                      点击每个单元格蓝色文字进行相关属性属性设置哦、表格样式与实际导出表格的可能不同噢，请根据实际情况进行调整
                    </div>                    
                    <div class="text item" style="font-size: 12px;">
                      可引入相关的清单进行关联
                    </div>
                  </el-card>
                </template>
            </div>

            <!-- **************单元格属性*********** -->
         
            <div class="cell_att" v-if="shwo_att">
                <!-- <br><br><br> -->
                <el-form :model="row_att" :rules="rules" ref="row_att" label-width="100" width="800" size="small">
                    <el-form-item label="设置属性" prop="attribute">
                      <el-select v-model="row_att.attribute" placeholder="请选择属性" filterable remote @change="remote1" clearable size="small" style=" width:100%;" prop="attribute">
                          <el-option v-for="(val,i) in attribute" :key="i" :label="val.zh" :value="val.att_name"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-for="(val,a) in attribute" :key="a+'a'" v-show="(val.att_name==row_att.attribute && val.if && row_att.attribute!=null )?true:false" label="属性值(点击左边表格的单元格选择值)" >
                          <el-input v-model="row_att.attributeValue" :autofocus="true" :placeholder="val.value">
                              <el-button slot="append" type="primary" size="mini" @click="att_input1(row_att)">确定</el-button>
                          </el-input>
                    </el-form-item>
                    <el-form-item v-if="listType!='original' && listType!='update'" label="限制单元格大小值">
                        <el-select v-model="row_att.tLimit" placeholder="请选择限制类型" @change="limiremote" clearable size="small" style=" width:100%;">
                            <el-option v-for="(val,i) in tLimits" :key="i" :label="val.zh" :value="val.value"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="row_att.tLimit!=null" label="限制值" >
                        <el-input v-model="row_att.limitValue">
                            <el-button slot="append" type="primary" size="mini" @click="att_input2(row_att)">确定</el-button>
                        </el-input>
                    </el-form-item>
                    <!-- <el-form-item v-if="'attribute_value_id' in row_att" label="（属性id）对应新清单表头内容id" prop="attribute_value_id">
                      <el-input v-model="row_att.attributeValue_id"></el-input>
                    </el-form-item> -->
                    <el-form-item :label="`表格列宽 ( 系统已自动调整，请根据内容自行调整 )`" >
                      <br>
                      <!-- <el-slider v-model="row_att.col_width" :max="500" :min="0" :step="5"> </el-slider> -->
                      <el-slider v-model="col_width" :max="500" :min="50" :step="5"> </el-slider>

                    </el-form-item>
                    <el-form-item label="此行行高 ( 默认为最低30px 请根据内容适当调整 )" >
                      <br>
                      <el-slider v-model="row_att.trHigh" :max="300" :min="30" :step="5"> </el-slider>
                      <div :style="{width:col_width+'px',height:row_att.trHigh+'px','text-align':row_att.textAlign,'line-height':row_att.trHigh+'px'}" class="wh">{{row_att.td}}</div>
                    </el-form-item>
                     <el-form-item label="单元格文字对齐" >
                        <el-select v-model="row_att.textAlign" placeholder="请选择对齐方式" clearable size="small" style=" width:100%;">
                            <el-option  label="居中" value="center"></el-option>
                            <el-option  label="靠左" value="left"></el-option>
                            <el-option  label="靠右" value="right"></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-button @click="cancelAtt">取 消</el-button>
                    <el-button type="primary" @click="submitAtt">确 定</el-button>
                </el-form>
            </div>

      </el-col>
      </el-collapse-transition>

    </el-row>
    <br>
    <!-- *************导入之后单元格编辑 取消和下一步按钮************* -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="back">{{ cancelBtnName }}</el-button>
      <el-button type="primary" @click="next">{{ nextBtnName }}</el-button>
    </span>
  </el-dialog>
  <!-- </div> -->
     
</template>

<script>
import XEUtils from 'xe-utils'
import inven from '../../modules/inventory';
  export default {
    name: 'headerAtt',
    props:['type','params','dialog'],
    data () {
      return {
        From:{},//清单表头数据
        From2:{},//选择变更清单与变更清单之后要引入的原清单
        btn: {  //按钮的名称,与存储信息事件
            edit: true,    //true开启单元格编辑，false开启属性设置，默认true。
        },
        columnName:[],//列名ABCD
        showEdit: false,//显示编辑
        loading: true, //  div  加载中的样式
        list:[], //用来存储导入的数据
        hd:[],//用来存储数据中对象的所有（列）的key值 (处理饿了么单元格合并该行中的所有列)
        attribute:{}, //用来存储特殊属性的所有类
        tLimits:[],  //用来存储限制单元格大小的所有类
        row_att:{},  //存储属性弹窗选择所需要的每个单元格的数据
        shwo_att:false, //属性弹窗默认不显示 
        show_lead:false, //显示引入的清单类型表格
        col_width:130, //调整单元格的列宽
        badge_name:inven.badge_name, //属性标记名对象
        listType:'',//清单类型
        lead:{ //存储引入清单数据
            list:[],//引入的清单数据
            loding:true, //加载中
            hd:[],//用来存储数据中对象的所有（列）的key值 (处理饿了么单元格合并该行中的所有列)
            att_id:null,
            att_key:null,
            key_click:false, //当前是否点击获取属性值状态  默认不开启false
            att_click_type:null, //当前属性开启状态 null为未开启 formula为公式状态 attribute为属性状态 limit 为限制属性状态        
        },
         //存储引入进来的表格数据    
        rules: {  //属性 反馈错误
          attributeValue: [
            { required: true, message: '请点击单元格或者输入内容', trigger: 'blur' },
            { min: 0, max: 30, message: '长度在 1 到 20 个字符', trigger: 'change' },
          ],
          limitValue: [
            { required: true, message: '请点击单元格或者输入内容', trigger: 'blur' },
            { min: 0, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' },
          ],
          attribute: [
            { required: true, message: '请选择属性', trigger: 'change' }
          ],
        },
      
        pendingRemoveList: [] //存储已标记的行数
      }
    },
    created () { //2
        let AZ = this.$excel.AZ()
        this.columnName = AZ.slice(0,50);
        this.From = this.params;

        if (this.From.type =='change' || this.From.type =='update') {
            //开启请求原清单表头
            this.tOrigina()
        }
       
        if (this.From.id) {
            this.list = this.From.headRowList;
            this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名
            this.listType = this.From.type;
            let arr = inven.Assemble(null,this.From.type);   // 数据添加属性组装函数
            this.attribute = arr.attribute;
            this.tLimits = arr.limit;
            this.loading = false;
        }else{
            this.list = this.From.headRowList;
            this.hd = [];
            this.listType = this.From.type;
            this.loading = false;
        }
        //请求引入的原清单
    },
    mounted() {
      // window.onresize = () => {
      //   return (() => {
      //     this.screenWidth = document.body.clientWidth;
      //       if (this.screenWidth > 1900) {    //浏览器兼容自动调整列宽Math.ceil(5/2)
      //           this.col_width = Math.floor(((this.screenWidth/24)*18)/(this.hd.length+3));
      //           this.hd.length <=20 ? this.col_width : this.col_width = 150
      //       }else if (this.screenWidth >= 1500) {
      //           this.col_width = Math.floor(((this.screenWidth/24)*17)/(this.hd.length+3));
      //           this.hd.length <=15 ? this.col_width : this.col_width = 140
      //       }else{
      //          this.col_width = Math.floor(((this.screenWidth/24)*20)/(this.hd.length+3));
      //           this.hd.length <=6 ? this.col_width : this.col_width = 80
      //       }
      //   })();
      // };
    },
    watch: {
        params: function(newVal,oldVal){
  
            this.From = newVal;
            if (this.From.type =='change' || this.From.type =='update') {
                //开启请求原清单表头
                this.tOrigina()
            }
            if (newVal == null ) {    //当没有数据的时候div 为加载中状态
                this.loading = true;
            }else{
                if (this.From.id) {
                    this.list = this.From.headRowList;
                    this.listType = this.From.type;
                    this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名
                    let arr = inven.Assemble(null,this.From.type);   // 数据添加属性组装函数
                    this.attribute = arr.attribute;
                    this.tLimits = arr.limit;
                    this.loading = false;
                }else{
                    this.list = this.From.headRowList;
                    this.hd = [];
                    this.listType = this.From.type;
                    this.loading = false;
                }
                // this.screenWidth = document.body.clientWidth;
                // // // this.screenHeight = document.body.clientHeight;
                // this.col_width = Math.floor(((this.screenWidth/24)*18)/(this.hd.length+3));
                // this.hd.length <=20 ? this.col_width : this.col_width = 150
            }
            //请求引入的原清单
        },
        dialog:function(n,v){

        }
       
    },
    computed: {
      // 计算属性的 getter
      showEditName () {
        // `this` 指向 vm 实例
        return this.showEdit ? '完成编辑' : '启用编辑'
      },
      nextBtnName () {
        return this.btn.edit ? '下一步' : '提交'
      },
      cancelBtnName () {
        return this.btn.edit ? '取消' : '上一步'
      },
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
        return this.From.type ? obj[this.From.type ] : '未知'
      }
    },
    methods: {
          tOrigina () {  //请求原清单表头数据
              let params = {id:this.From.tOriginalHeadId,type:'original'}
              this.$post('/head/getone',params)
                .then((response) => {
                this.From2 = response.data.onehead;
                let arr = this.$excel.Package(this.From2['tOriginalHeadRows'],this.From2.refCol,this.From2.refRow);
                this.lead.list= arr;
                this.lead.hd = Object.keys(arr[0]);
              })
          },
          impt(){ //button 按钮调用input文件选择事件
      

                this.$refs.input.click()
          },
          importfxx() { //表头导入函数
                this.loading = true
                this.$notify.info({
                    title: '提示',
                    duration: 800,
                    message: '正在努力导入表格噢，请稍等片刻。'
                });
                this.list = null; //归为初始化状态
                let _this = this;
                this.$excel.Imports(data=>{
                    // console.log('最终处理完成的数据')
                    let arr = inven.Assemble(data,_this.From.type);   // 数据添加属性组装函数
                     if(arr.sheet.length >0){
                        this.list = arr.sheet;
                        this.hd = Object.keys(this.list[0]); //用来所需要的所有列(obj)（属性）名
                        this.loading =false;
                        this.attribute = arr.attribute;
                        this.tLimits = arr.limit;
                    }
                    _this.loading = false
                    _this.$notify({
                      title: '提示',
                      duration: 3000,
                      message: '表格成功导入啦hhh',
                      type: 'success'
                    });
                })
          },
          aa(row, column, cell, event){ 
          },
          handleClose(done) {   //表格编辑弹窗关闭确认
            this.$confirm('确认关闭？ 直接关闭将不保存任何数据噢。')
              .then(_ => {
                this.back() //设置按钮为最初样式
                let succre = false;
                this.$emit("update:dialog", succre)
                done();
              })
              .catch(_ => {
                let succre = false;
                this.$emit("update:dialog", succre)
              });
          },
          submitAtt(){  //校验属性设置的值是否成功
            // console.log('submitatt 状态')
            // console.log(this.lead.att_click_type)
            if(this.lead.att_click_type == 'transit'){
                return this.$message({ message: '属性未设置完毕', type: 'error' });
            }else if(this.lead.att_click_type == 'limit' || this.lead.att_click_type == 'attribute' || this.lead.att_click_type == 'formula'){
                return this.$message({ message: '设置完属性未点击相关确定按钮', type: 'error' })
            }
            this.$refs.row_att.validate(valid => {
             if (valid && this.lead.att_click_type == 'okay') {   //校验通过与点击设置属性及设置限制属性值关闭后才能完成
                  this.$message({ message: '保存成功', type: 'success' })
                  this.lead.att_click_type = null;
                  this.shwo_att = false;  //隐藏设置属性组件页面
                  this.show_lead = false; //隐藏引入的表格
                // alert('成功1')
                  return false;
              } else {
                  this.$message({ message: '校验不通过', type: 'error' })
              }
            })
            
          },
          cancelAtt(){  //属性组件取消按钮
              this.shwo_att = false;  //隐藏设置属性组件页面
              this.show_lead = false; //隐藏引入的表格
              this.lead.att_click_type =null;  //属性设置恢复默认

          },
          /*
            单元格属性设置
            param row:  Object  
            return : 无
          */
          att(row){ //把数据传入属性组件
            // console.log(this.list)
            if (this.lead.att_click_type ==null) {
                   this.row_att = row;
                  // console.log(row)
                  //显示设置属性弹窗
                  this.shwo_att = true;
            }
          },
          next(){  //编辑完成点击下一步(完成提交新建表头按钮)
              if (this.btn.edit) {
                  this.btn.edit = false;
                  if (!this.From.id) {
                      let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
                      //此处生成合计尾行
                      let tr = XEUtils.clone(rest[rest.length-1], true)
                      rest.push(tr) 
                      let hd = Object.keys(rest[0])
                      for (let i = 0; i < hd.length; i++) {
                        let tb = rest[rest.length-1][hd[i]];
                        tb.td = '合计'+i;
                        tb.trNum +=1;
                        if (tb.tdRowspan >1 || tb.tdRowspan == 0) {	//这里进行不复制上一行的行合并，默认全部显示。
                          tb.tdRowspan = 1;
                        }
                        tb.tdColspan ==0?tb.tdColspan =1:tb.tdColspan;
                      }
                      this.list = rest;           
                  }   
              }else{  //提交新建表头数据到父组件
                  // alert('直接完成')
                  this.btn.edit = true;
                  this.Submission()//提交表格数据函数

              }
          },
          Submission () {
              let url = '';
              this.From.id ? url = '/head/update' : url = '/head/add'
              let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据

              console.log('检查表格的所有数据')
              console.log(this.list)
              console.log(rest)

              let params = this.From;
              // let hd = ;   //获取所有的列
              // let hdarr = Object.keys(rest[0])
              params.refCol = this.hd.length;
              if (this.length) {
                  params.refRow = rest.length;

              }else{
                  params.refRow = rest.length;

              }
              
              console.log('行号列好=======headatt')
              console.log(params.refCol,params.refRow)

              //进行数据解构
              let list = this.$excel.Unpack(rest); //调用表格解构函数
              
              console.log('查看提交的数据')
              console.log(params)
              if (!this.From.id) {
                  params.headRowList = list;
                  this.$post(url,params)
                    .then((response) => {
                      if(response.data.repeat ==1){
                          this.$message({ message: '保存失败，已有这个表头。', type: 'error' })
                      }else{
                          let succre = false;
                          this.$emit("update:dialog", succre) //关闭表格显示窗口
                          this.$message({ message: '保存成功', type: 'success' });
                      }
                    
                  })
              }else{
                  params.headRowList = [];
                  this.$post(url,params)
                    .then((response) => {
                        console.log('查看路劲，参数以及是否删除成功')
                        console.log(url,params)
                        if (response.status=='SUCCESS') {
                            params.headRowList = list;
                            console.log('能进来这里吗')
                            console.log(url,params)
                            this.$post(url,params)
                            .then((response) => {
                              let succre = false;
                              this.$emit("update:dialog", succre) //关闭表格显示窗口
                              this.$message({ message: '保存成功', type: 'success' });
                            })
                        }
                        
                  })
              }

             

          },
          back(){ //编辑完成点击上一步
            if (this.btn.edit) {
                  this.btn.edit = true;
                  let succre = false;
                  this.$emit("update:dialog", succre)
              }else{
                  this.btn.edit = true
                  this.shwo_att = false;  //隐藏属性设置栏
                  this.show_lead = false; //隐藏引入的表格
                  this.lead.att_click_type =null;  //属性设置恢复默认
                  //此处清除单元格点击残留样式
                  this.lead.cell_row = null;
                  this.lead.cell_col = null;
                  this.lead.cell_hd = null;
                  //点击单元格获取id 和key（位置）
                  this.lead.att_id = null;
                  this.lead.att_key = null;
                  if (!this.From.id) {
                      //此处删除合计尾行
                      let rest = this.$refs.elxEditable.getRecords()  //获取表格的全部数据
                      rest.pop();
                      this.list =rest;
                  }
              }
          },
          
          getSelectLabel (value, valueProp, labelProp, list) {
            let item = XEUtils.find(list, item => item[valueProp] === value)
            return item ? item[labelProp] : null
          },
          selectEvent (selection, row) {
          },
          currentChangeEvent (currentRow, oldCurrentRow) { 
          },
          deleteSelectedEvent () {  //删除选中数据
            let selection = this.$refs.elxEditable.getSelecteds()
            if (selection.length) {
              this.$refs.elxEditable.removeSelecteds()
              Message({ message: '删除成功', type: 'success' })
            } else {
              Message({
                type: 'info',
                message: '请至少选择一条数据！'
              })
            }
          },          
          pendingRemoveEvent () { //标记/取消
            let selection = this.$refs.elxEditable.getSelecteds()
            if (selection.length) {
              let plus = []
              let minus = []
              selection.forEach(data => {
                if (this.pendingRemoveList.some(item => data === item)) {
                  minus.push(data)
                } else {
                  plus.push(data)
                }
              })
              if (minus.length) {
                this.pendingRemoveList = this.pendingRemoveList.filter(item => minus.some(data => data !== item)).concat(plus)
              } else if (plus) {
                this.pendingRemoveList = this.pendingRemoveList.concat(plus)
              }
              this.$refs.elxEditable.clearSelection()
            } else {
              this.$message({
                type: 'info',
                message: '请至少选择一条数据！'
              })
            }
          },
          arraySpanMethod({ row, column, rowIndex, columnIndex }) {   //单元格合并处理
                  if (columnIndex >0) {  //带选择框的情况
                      if (columnIndex <= this.hd.length) {
                          return [row[this.hd[columnIndex-1]].tdRowspan, row[this.hd[columnIndex-1]].tdColspan]
                      }
                  }
                  // if (columnIndex < this.hd.length) {   //不带选择框的情况
                  //     return [row[this.hd[columnIndex]].tdRowspan, row[this.hd[columnIndex]].tdColspan]
                  // }
                  return [1, 1]
             
  
          }, 
          cell_click(row, column, cell, event){ //单元格点击事件

              if (column.property && !this.btn.edit) {  //做容错处理，防止点击到选择框触发此事件
                    let colum =column.property;
                    colum = colum.substr(0,colum.indexOf('.'));
                    this.lead.cell_row = row[colum].trNum;
                    this.lead.cell_col = column.id;
                    // console.log(column)
                    this.lead.cell_hd = colum;
                    //点击单元格获取id 和key（位置）
                    this.lead.att_id = row[colum].id;
                    this.lead.att_key = `${row[colum].colNum}${row[colum].trNum}`;

                    if(this.lead.att_click_type == 'formula'){    ////点击单元格设置公式属性值
                          
                          // console.log(this.lead.att_id,this.lead.att_key)
                          // console.log('this.row_att')
                          // console.log('进来了公式设置')
                          console.log(this.row_att)
                          this.row_att.attributeValue==null? this.row_att.attributeValue="":this.row_att.attributeValue;
                          this.row_att.attributeValue = this.row_att.attributeValue+this.lead.att_key;
                          
                    }else if(this.lead.att_click_type =='limit'){  //点击单元格设置限制属性值与id
                            // console.log('点击单元格设置限制属性值与')
                            this.row_att.limitValue = this.lead.att_key;
 
                   }else if(this.lead.att_click_type == null){
                          //调用点击属性设置显示事件
                          // console.log('调用点击属性设置显示事件')
                          this.att(row[colum])
                    }  
                    //手动刷新表格
                    this.refresfhs();
                    // this.$refs.elxEditable.doLayout()
              }
          },
          refresfhs () {
              this.$refs.elxEditable?this.$refs.elxEditable.refresh():this.$refs.elxEditable1.refresh()
          },
          cell_select ({row, column, rowIndex, columnIndex}){ //单元格样式
              // if (this.btn.edit) {
                  if (columnIndex >0) { //带选择框的情况
                      row = row[this.hd[columnIndex-1]]
                      if (rowIndex == this.lead.cell_row-1 && column.id == this.lead.cell_col) {
                          return {'border':'1px solid #409EFF','text-align': row['textAlign'],'height':row.trHigh+'px'}
                      }
                  }
              // }else{  //不带选择框的情况
                  // row = row[this.lead.hd[columnIndex]]
                  // if (rowIndex == this.lead.cell_row-1 && column.id == this.lead.cell_col) {
                  //     return {'border':'1px solid #409EFF','text-align': row['textAlign'],'height':row.trHigh+'px'}
                  // }
              // }
              return {'text-align': 'center'}
          },
          exportCsvEvent () { //导出表格
            this.$refs.elxEditable.exportCsv()
          },
          insertEvent (index) { //新增一行

            this.$refs.elxEditable.insertAt({
              hd0: {
                value:789,
                row:1,
                cos:1
              },
            }, index)

            // .then(({ row }) => {
            //   // this.$refs.elxEditable.setActiveCell(row, 'name')
            // })

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
          submitEvent () {  //校验(表格数据)保存  即可提交数据
            this.$refs.elxEditable.validate(valid => {
              if (valid) {
                  this.$message({ message: '保存成功', type: 'success' })
                // alert('成功1')
              } else {
                this.$message({ message: '校验不通过', type: 'error' })
              }
            })
          },
          //****************引入清单的表格函数**********
          cell_click2(row, column, cell, event){ //单元格点击事件
              if (column.property && !this.btn.edit) {  //做容错处理，防止点击到选择框触发此事件
                    //判断引入表格是否显示
                    // this.show_lead?this.show_lead = false:this.show_lead;
                            // console.log('进来了表格2点击单元格1')
                            // console.log(this.lead.att_click_type)

                        if(this.lead.att_click_type =='attribute'){ //设置属性开启后，才执行相关属性与限制值属性操作
                            // console.log('进来了表格2点击单元格2')
                            let colum =column.property;
                            colum = colum.substr(0,colum.indexOf('.'));
                            this.lead.cell_row = row[colum].trNum;
                            this.lead.cell_col = column.id;
                            // console.log(column)
                            this.lead.cell_hd = colum;
                            //点击单元格获取id 和key（位置）
                            this.lead.att_id = row[colum].id;
                            this.lead.att_key = `${row[colum].colNum}${row[colum].trNum}`;
                            // console.log(this.lead.att_id,this.lead.att_key)
                            // console.log('cell_click2打印一下this.row_att')
                            // console.log(this.row_att)
                            // console.log('点击单元格设置属性值')
                            this.row_att.attributeValue = this.lead.att_key;
                            let attribute = this.row_att.attribute;
                            if (attribute =="original") {  //原清单表头内容ID
                                this.row_att.tOriginalHeadRowId =  this.lead.att_id;
                            }else if(attribute =="change" || attribute =="meterage" || attribute =="fluctuate"){  //变更后清单表头内容ID
                                this.row_att.tUpdateHeadRowId =  this.lead.att_id;
                  
                            }
                        }
                    
                    //手动刷新表格
                    this.$refs.elxEditable?this.$refs.elxEditable.refresh():this.$refs.elxEditable1.refresh()
                    // this.$refs.elxEditable.doLayout()
              }
          },
          remote1(req){   //监听设置属性选择框的值
              // console.log('这里开始网络请求查找用户选择的清单类型的所有清单')
              // console.log(req)
              if (req=='original' || req== 'update' || req== 'fluctuate'){
                  //网络请求
                  //数据返回后，开启清单选择
                  
                  //显示引入的表格
                  this.show_lead = true;
                  this.lead.att_click_type = 'attribute';  //开启属性输入状态为属性模式
                  // console.log('attribute开启属性输入状态为属性模式')
 
              }else if(req== 'formula' || req== 'sumText' || req== 'sumFormula'){  //设置公式                        
                  this.show_lead = false;//隐藏引入的表格
                  this.lead.att_click_type = 'formula';  //开启属性输入状态为公式模式
                  // console.log('formula开启属性输入状态为公式模式')
              }else{
                  //隐藏引入的表格
                  this.show_lead = false;
                  this.lead.att_click_type = 'okay';

              }

          },
          limiremote(req){  //限制值类型的选择改变后触发的函数（开启点击引入的单元格输入限制值）
              //数据返回后，开启清单选择
                            //隐藏引入的表格
              this.show_lead = false;
              this.lead.att_click_type = 'limit';  //开启限制值属性输入
              console.log('limit开启限制值属性输入状态模式')

          },
          att_input1(row){  //属性值输入完成确定按钮
                // console.log('属性值输入完成确定按钮 状态')
                // console.log(this.lead.att_click_type)
                // console.log(row.attributeValue)
                if(this.lead.att_click_type == 'limit')return this.$message({ message: '当前正在设置限制属性，请继续完成！', type: 'error' });; //当前是限制属性状态的话无法点击此按钮
                if (row.attributeValue==null || row.attributeValue =='') {  //检测属性值是否输入完成
                    this.$message({ message: '属性值不能为空！', type: 'error' })
                    return false;
                }else{
                    this.InspectAtt(row,'limit') //调用限制值状态检测设定函数
                }
          },
          att_input2(row){  //属性值输入完成确定按钮
                if(this.lead.att_click_type == 'attribute' || this.lead.att_click_type == 'formula')return this.$message({ message: '当前正在设置公式或者属性，请继续完成！', type: 'error' }); //当前是公式OR属性状态的话无法点击此按钮
                if (row.limitValue==null || row.limitValue=='') {
                    this.$message({ message: '限制属性值不能为空！', type: 'error' })
                    return false;
                }else{
                    this.InspectAtt(row,'att') //调用状态检测设定函数
                }
          },
          InspectAtt(data,type){   //设定属性状态函数（检测各种属性值情况）   data该单元格数据   type属性类型（公式与属性值属于att   限制值属性属于limit）
              // console.log(data)
              if (data!=null && type=='limit') {
                    if (data.tLimit == null) {
                        this.show_lead=false;//隐藏引入的清单表格
                        return this.lead.att_click_type = 'okay';
                    }
                    if (this.listType!='original' && this.listType!='update') {  //检测有无限制属性
                          if (data.limitValue !=null && data.limitValue !='') { //检测限制值是否已经设定
                              this.show_lead=false;//隐藏引入的清单表格
                              // 设置为等待完成状态
                              return this.lead.att_click_type = 'okay';
                          }else{
                              // 设置为有未设置属性存在，过渡状态
                              this.show_lead=false;//隐藏引入的清单表格
                              return this.lead.att_click_type = 'transit';
                          } 
                    }else{  //无限制属性直接完成属性设置
                          this.show_lead=false;//隐藏引入的清单表格
                          return this.lead.att_click_type = 'okay';
                    }
              }else if(data!=null && type=='att'){
                  if (data.attribute !=null) {
                        if (data.attribute=='original' || data.attribute== 'update' || data.attribute== 'fluctuate' || data.attribute== 'formula' || data.attribute== 'sumText' || data.attribute== 'sumFormula') {
                              if (data.attributeValue ==null || data.attributeValue =='') { //检测属性有无设置
                                  // 设置为有未设置属性存在，过渡状态
                                  return this.lead.att_click_type = 'transit';
                              }else{
                                  // 设置为等待完成状态
                                  return this.lead.att_click_type = 'okay';
                              }
                        }else{
                              // 设置为等待完成状态
                              return this.lead.att_click_type = 'okay';
                        }
                  }else{
                          // 设置为有未设置属性存在，过渡状态
                          return this.lead.att_click_type = 'transit';
                  }
              }
          }

    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.click-table12 .el-table__body .el-table__row>td.elx_checked {
  box-shadow: inset 0 0 6px #409EFF;
  
}
.el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #2248A2;
}
.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
    border-right: 1px solid #2B4EA1;
}
.el-table__body td, .el-table__body th, .el-table__body tr {
    border-bottom: 1px solid #2248A2;

}
.transition-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px;
  }
.wh{
	width: 100px;
	border: 1px solid #409EFF;
	display: block;
	border-radius: 2px;
	text-align: center;
	overflow: hidden;
  color: #409EFF;
	
}
.dialogm_att .el-dialog__wrapper{
	background: none;
  /* right: 0; */
}
.dialogm_att .dialog_att {
  right: 0;
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
