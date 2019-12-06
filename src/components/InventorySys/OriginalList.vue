<template>
    <el-collapse-transition>
    <div v-loading="loading" element-loading-text="飞速加载中">
        <h3>原清单列表</h3>
        <!-- 业务按钮 -->
        <div class="manual-table2-oper" v-if="joinParent && mode==='show'?false:true">
            <span v-if="edit">
                <el-button :disabled="approval.state === 1?true:false" type="success" size="mini" @click="see({})" >新增</el-button>
                <el-button :disabled="approval.state === 1?true:false" type="danger" size="mini" @click="Console">打印一下增删改集合</el-button>
                <el-button :disabled="approval.state === 1?true:false" type="danger" size="mini" @click="deleteSelectedEvent">删除选中</el-button>
                
            </span>
            <span v-if="!joinParent && mode==='show'?true:false" style="position: absolute; right:0;top:10px;">
                <el-switch
                v-model="edit"
                active-text="开启操作"> 
                </el-switch>   
            </span>
        </div>
        <!-- 主体表格 -->
        <elx-editable
        ref="elxEditable" 
        class="manual-table2"
        border
        size="mini"
        :data.sync="list"
        :cell-style ="cell_select"
        :edit-config="{trigger: 'manual', mode: 'row', autoClearActive: false}"
        style="width: 100%">
        <elx-editable-column type="selection" width="50" align="center" fixed="left" ></elx-editable-column>
        <elx-editable-column type="index" width="50" align="center" fixed="left" > </elx-editable-column>
        <!-- <elx-editable-column prop="id" label="ID" width="80"></elx-editable-column> -->
                
        <!-- <elx-editable-column prop="originalHead.num" label="原清单表头编号" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <elx-editable-column prop="originalHead.name" min-width="110" label="表头名称" align="center" fixed="left" show-overflow-tooltip ></elx-editable-column>
        <!-- <elx-editable-column prop="process.num" label="审批单编号" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <!-- <elx-editable-column prop="process.name" label="审批单名称" align="center" show-overflow-tooltip ></elx-editable-column> -->
        <elx-editable-column prop="num" label="原清单编号" min-width="100" align="center" fixed="left" show-overflow-tooltip :edit-render="{name: 'ElInput'}" ></elx-editable-column>     
        <elx-editable-column prop="name" label="原清单名称" min-width="120" align="center" fixed="left"  :edit-render="{name: 'ElInput'}" >
            <template slot-scope="scope">
              <el-link :underline="false" style="font-size:12px;" type="success" @click="see(scope.row)" >{{scope.row.name}}</el-link>
            </template>
        </elx-editable-column>
        <elx-editable-column prop="tender.num" label="标段编号" min-width="110" align="center" show-overflow-tooltip ></elx-editable-column>
        <elx-editable-column prop="tender.name" label="标段名称"  min-width="110" align="center" show-overflow-tooltip ></elx-editable-column>
        <elx-editable-column prop="type" label="审批单类别" min-width="110" align="center" show-overflow-tooltip :formatter="formatterType" ></elx-editable-column>
        <elx-editable-column prop="enter" label="录入状态" align="center" show-overflow-tooltip >
            <template slot-scope="scope">
                <!-- 1已录入 0未录入 其他出错-->
                <i v-if="scope.row.enter ==0" style="color:orange;width:20px;" class="el-icon-circle-close"></i>
                <i v-if="scope.row.enter ==1" style="color:#67c23a;width:20px;" class="el-icon-circle-check"></i>
                <i v-if="scope.row.enter ==2" style="color:red;width:20px;" class="el-icon-warning-outline"></i>
            </template>
        </elx-editable-column>
        <!-- <elx-editable-column prop="startTime" label="发起时间" min-width="150" align="center" show-overflow-tooltip sortable :formatter="formatterDate" ></elx-editable-column> -->
        <elx-editable-column prop="saveEmployee.name" width="90" label="创建人" align="center" ></elx-editable-column>
        <elx-editable-column prop="saveTime" label="创建时间" min-width="150" align="center" show-overflow-tooltip sortable :formatter="formatterDate" ></elx-editable-column>
        <elx-editable-column prop="updateEmployee.name" width="90" label="更改人" align="center" ></elx-editable-column>
        <elx-editable-column prop="updateTime" label="更新时间" min-width="150" align="center" show-overflow-tooltip sortable  :formatter="formatterDate"></elx-editable-column>
        
        <elx-editable-column label="操作" :width="edit?'140':'60'" align="center" >
            <template v-slot="scope">
            <template v-if="$refs.elxEditable.hasActiveRow(scope.row)">
                <el-tooltip v-if="edit" content="保存" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="success" icon="el-icon-document-checked" @click="saveRowEvent(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip v-if="edit" content="取消" placement="top" :enterable="false" effect="light">
                    <el-button size="mini" type="info" icon="el-icon-close" @click="cancelRowEvent(scope.row)"></el-button>
                </el-tooltip>
            </template>
            <template v-else>
                <el-tooltip v-if="edit && approval.state !== 1" content="修改" placement="top" :enterable="false" effect="light">
                    <el-link icon="el-icon-edit" style="margin: 0 5px;" @click="openActiveRowEvent(scope.row)"></el-link>
                </el-tooltip>
                <el-tooltip content="查看" placement="top" :enterable="false" effect="light">
                    <el-link icon="el-icon-view el-icon--right" style="margin: 0 5px;"  @click="see(scope.row)"></el-link>
                </el-tooltip>
                 <el-tooltip content="导出" placement="top" :enterable="false" effect="light">
                    <el-link icon="el-icon-folder-checked" style="margin: 0 5px;" @click="exported(scope.row.id)"></el-link>
                </el-tooltip>
                <el-tooltip v-if="edit && approval.state !== 1" content="删除" placement="top" :enterable="false" effect="light">
                    <el-link icon="el-icon-delete" style="margin: 0 5px;" @click="removeEvent(scope.row)"></el-link>
                </el-tooltip>
            </template>
            </template>
        </elx-editable-column>
        </elx-editable>
         <!-- 引入新建原清单组件 -->
        <transition name="el-fade-in">
          <el-dialog :title="EditTitle" width="97%" top="3vh"  lock-scroll :visible.sync="visibleNew" :append-to-body="true">
              <inven-edit :tender="tender" :refresh.sync="visibleNew" :originalList="originalList" :uplist="uprow" :approval="approval" :mode="mode" :joinParent="joinParent"  ></inven-edit>
          </el-dialog>
        </transition>
    </div>
    </el-collapse-transition>
</template>

<script>
import InvenEdit from './InvenEdit';
import XEUtils from 'xe-utils'
  export default {
  name: 'OriginalList',
  components: {
    InvenEdit
  },
  props: {
    originalList:{    //原清单数据列表，这个数据用于返回给父组件
      type: Array,
      required: false,
      default: () => []
    },
    originalAddList:{    //增加原清单数据列表，这个数据用于返回给父组件
      type: Array,
      required: false,
      default: () => []
    },
    originalDelList:{    //删除原清单数据列表，这个数据用于返回给父组件
      type: Array,
      required: false,
      default: () => []
    },
    originalAltList:{    //修改原清单数据列表，这个数据用于返回给父组件
      type: Array,
      required: false,
      default: () => []
    },
    mode:{  //子组件的展示模式
      type: String,
      required: false,
      default: "new"  //new:新建模式 ，show:展示模式   ，alter:更改模式      
    },
    joinParent:{   //接入父组件标记，当joinParent标记为true时表示连接到父组件并接受父组件的参数；当joinParent为false时组件独立调试使用。
      // type:Array,
      required:false,
      default: true
    },
    approval:{
      type: Object,
      required: false,
      default: () => ({id:110, name:"清单审批单",state:0}) //state=1为已通过的审批单
    },
    tender:{
      type: Object,
      required: false,
      default: () => ({id:34, name:"机电标段"})
    },
    organizationId:{   //部门id
      // type:Array,
      required:false,
      default: 35
    },
  },
  data () {
    return {
      list: [],
      visibleNew:false,
      edit: false, // 是否开启编辑
      EditTitle: '新建原清单', //新建原清单
      refresh:false,
      loading: false,
      list: null,
      uprow: null, //修改清单传入保存清单组组件的数据
      tenderList:null,  //全部标段
      dialogVisible:false,//显示隐藏
      isClearActiveFlag: true,
      allstae: false,
      rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
    }
  },
  created () {
      //此处判断父组件传来的展示模式类型
      this.modeType ( this.mode );
  },
  watch: {
    mode: function(newVal,oldVal){
        //此处判断父组件传来的展示模式类型
        this.modeType ( newVal );
        
    },
    visibleNew: function(newVal,oldVal){
        if (!newVal) {
            if (this.mode === 'show') {
                  this.edit = false;
                 if (!this.joinParent) {  //是否接受父组件的值
                    this.findList();  //请求该审批id的所有清单
                    this.edit = true;
                }
            }else{   
                this.edit = true;
                this.$nextTick(() => {
                    this.list = this.originalList;
                }); // 强制刷新
                this.watchList(this.originalList);  //监听清单列表 判断增/改 添加到对应增改集合
            }
            this.visibleNew = false; //关闭显示
        }
    }
  },
  computed: {
    // enter: function () {
    // }
  },
  methods: {
    exported (id) { //清单id 直接导出无需预览
        this.loading = true;
        //此处请求一个审批单的一个原清单
        this.$post('/original/row/getone',{ id })
            .then((response) => {
            let data = response.data.original;
            if (!data && !data.originalRowList) return this.loading = false;
            let headsArr = this.$excel.Package(data['originalHead'].tOriginalHeadRows,data['originalHead'].refCol,data['originalHead'].refRow),
            PackHeader = [...headsArr],
            col = this.$excel.Nesting(headsArr),   //调用多级表头嵌套组装函数
            //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
            lastHeader = this.$excel.BikoFoArr([...col]),
            hd = Object.keys(lastHeader), //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
            list = this.$excel.ListAssemble(data.originalRowList), //组装清单表格数据
            totalobj = this.$excel.Total(list, PackHeader); //调用合计计算
            this.loading = false;

             /*
              将清单导出为表格
              param tableData: 清单内容this.list 
              param headerData: 表头内容this.PackHeader
              param totalobj: 例如this.totalobj,  合计尾行计算结果若无则 传false
              param lastHeader: 例如this.lastHeader, 表头最后一层 对象嵌套对象{A:{}}
              param filterVal: 所有列 例如this.hd  
              param filename: 文件名
            */
            this.$excel.exportTable(list, PackHeader, totalobj, lastHeader, hd, 'filename')

        }).catch(e => {
            this.loading = false;
            console.log(e)
            this.$message({
                type: 'info',
                message: '233发生错误！'+e
            });
        })
    },
    watchList (list) {  //监听清单列表 判断增/改 添加到对应增改集合
        this.originalAltList.length = this.originalAddList.length = 0;
        for (let index = list.length - 1; index >= 0; index--) {
            if( !list[index].id ) { //无id的情况（新增清单）
                this.originalAddList.push(list[index]);
            }if (list[index].id && list[index].alter && list[index].alter==='Y') { //修改清单
                this.originalAltList.push(list[index]);
            }
        }
        console.log('此处打印一下清单列表增删改')
        console.log('this.originalList')
        console.log(this.originalList)
        console.log(' this.originalAddList,')
        console.log( this.originalAddList,)
        console.log('this.originalDelList')
        console.log(this.originalDelList)        
        console.log('this.originalAltList')
        console.log(this.originalAltList)
    },
    Console () {
        console.log('此处打印一下清单列表增删改')
        console.log('this.originalList')
        console.log(this.originalList)
        console.log(' this.originalAddList,')
        console.log( this.originalAddList,)
        console.log('this.originalDelList')
        console.log(this.originalDelList)        
        console.log('this.originalAltList')
        console.log(this.originalAltList)

    },
    modeType ( type ) {
        if (this.joinParent) { //判断父组件是否传来数据

            this.loading = true;
            let Allid = this.originalList.map(function(item){
                console.log('  item.id  : ',item.id)
                return item.id;
            })
            this.originalList.length = 0;
            //用递归代替for循环，可以保证正常执行顺序
            let that = this;
            function recurTest(j, length){
                let id = Allid[j]
                that.$post('/original/row/getone',{ id })
                    .then((response) => {
                    console.log('/此处请求一个审批单的一个原清单-----------------------')
                    console.log(response)
                    let data = response.data.original;
                    let headsArr = that.$excel.Package(data['originalHead'].tOriginalHeadRows,data['originalHead'].refCol,data['originalHead'].refRow);
                    //截取获取表格实际对应所有列最后一层的表头列 object(用来单元格点击判断)
                    let list = that.$excel.ListAssemble(data.originalRowList); //组装清单表格数据
                    data.totalobj = that.$excel.Total(list, headsArr); //调用合计计算
                    if(++j < length){
                        recurTest(j, length);
                  }
                  that.originalList.push(data);
                  that.list = that.originalList;
                }).catch(e => {
                    that.loading = false;
                    console.log(e)
                    that.$message({
                        type: 'info',
                        message: '请求全部清单内容时发生错误！'+e
                    });
                })

            }
            if (Allid.length >0) {
                recurTest(0, Allid.length);
            }
        
            this.loading = false;
            //此处设置不需要分页
            this.list = this.originalList;

        }
        this.edit = true;
        switch(type) {
            case 'new': //此处为新建模式处理
                break;
            case 'show': //此处为显示模式处理
                this.edit = false;
                if (!this.joinParent) {  //是否接受父组件的值
                    this.findList();  //请求该审批id的所有清单
                    this.edit = true;
                }
                break;
            case 'alter': //此处为修改模式处理
                break;
        } 
    },
    All_request ( list ) {
        let rest =  [];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
          
        }

    },
    findList () {
        // 发起网络请求
        this.$post('/original/getall',{id: this.approval.id})
            .then((response) => {
            this.list = response.data.originalList;
            this.loading = false;
        }).catch(e => {
            this.loading = false;
            this.$message({
                type: 'info',
                message: '发生错误！'
            });
        })
    },
    see (row) { //预览和修改清单
        if (row.id || row.saveTime) {
            this.EditTitle = '查看原清单';
        }else{
            this.EditTitle = '新建原清单';
        }
        this.uprow = row;
        // console.log(this.uprow,' this.uprow')
        // console.log(this.originalList,' originalList')
        this.visibleNew = true; //显示建立清单组件
    },
    
    formatterType (row, column, cellValue, index) {
      var obj = {
        original: '原清单',
        change: '变更清单',
        update: '新清单',
        meterage: '计量清单',
        totalmeterage: '累计计量清单',	
        pay: '支付清单',
        totalpay: '累计支付清单'
      }
      return cellValue ? obj[cellValue] : '未知';
    },
    formatterDate (row, column, cellValue, index) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss');
    },

    // 点击表格外面处理
    checkOutSave (row) {
      if (!row.id) {
        this.isClearActiveFlag = false;
        this.$confirm('该数据未保存，请确认操作?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存数据',
          cancelButtonText: '移除数据',
          type: 'warning'
        }).then(action => {
          this.$refs.elxEditable.clearActive();
          this.saveRowEvent(row);
        }).catch(action => {
          if (action === 'cancel') {
            this.$refs.elxEditable.remove(row);
          }
        }).then(() => {
          this.isClearActiveFlag = true;
        })
      } else if (this.$refs.elxEditable.hasRowChange(row)) {
        this.isClearActiveFlag = false;
        this.$confirm('检测到未保存的内容，请确认操作?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存数据',
          cancelButtonText: '取消修改',
          type: 'warning'
        }).then(() => {
          this.$refs.elxEditable.clearActive();
          this.saveRowEvent(row);
        }).catch(action => {
          if (action === 'cancel') {
            this.$refs.elxEditable.revert(row);
            this.$refs.elxEditable.clearActive();
          }
        }).then(() => {
          this.isClearActiveFlag = true;
        })
        return false;
      }
      return this.isClearActiveFlag;
    },
    // 编辑处理
    openActiveRowEvent (row) {
      this.$nextTick(() => {
        let activeInfo = this.$refs.elxEditable.getActiveRow();
        if (activeInfo && activeInfo.isUpdate) {
          this.isClearActiveFlag = false
          this.$confirm('检测到未保存的内容，请确认操作?', '温馨提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '保存数据',
            cancelButtonText: '取消修改',
            type: 'warning'
          }).then(() => {
            this.$refs.elxEditable.setActiveRow(row);
            this.saveRowEvent(activeInfo.row);
          }).catch(action => {
            if (action === 'cancel') {
              this.$refs.elxEditable.revert(activeInfo.row);
              this.$refs.elxEditable.setActiveRow(row);
            }
          }).then(() => {
            this.isClearActiveFlag = true;
          })
        } else {
          this.$refs.elxEditable.setActiveRow(row);
        }
      })
    },
    // 取消处理
    cancelRowEvent (row) {
      if (!row.id) {
        this.isClearActiveFlag = false;
        this.$confirm('该数据未保存，是否移除?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '移除数据',
          cancelButtonText: '返回继续',
          type: 'warning'
        }).then(action => {
          if (action === 'confirm') {
            this.$refs.elxEditable.remove(row);
            // console.log('移除数据')
          }
        }).catch(e => e).then(() => {
          this.isClearActiveFlag = true;
        })
      } else if (this.$refs.elxEditable.hasRowChange(row)) {
        this.isClearActiveFlag = false
       this.$confirm('检测到未保存的内容，是否取消修改?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '取消修改',
          cancelButtonText: '返回继续',
          type: 'warning'
        }).then(action => {
          this.$refs.elxEditable.clearActive();
          this.$refs.elxEditable.revert(row);
        }).catch(action => {
          if (action === 'cancel') {
            this.$refs.elxEditable.setActiveRow(row);
          }
        }).then(() => {
          this.isClearActiveFlag = true;
        })
      } else {
        this.$refs.elxEditable.clearActive();
      }
    },
    removeEvent (row) {     //删除单个清单
      if ( row.id && this.mode === 'show') {   //展示模式才能进行网路保存
          this.isClearActiveFlag = false;
          this.$confirm('确定永久删除该数据?', '温馨提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              this.loading = true
              // 进行发起请求删除
              var obj = {
                    originalAddList: [],    //增
                    originalDelList: [],     //删 
                    originalAltList: []   //改
              };
              if (row.id) obj.originalDelList.push(row);
                
              this.$post('/original/update',obj)
                .then((response) => {
                //删除成功
                this.loading = false;
                this.$refs.elxEditable.remove(row);
                this.$message({type: 'success', message: '删除所选选项成功!'})
              }).catch(e => {
                  this.$message({
                      type: 'info',
                      message: '删除失败！'+e
                  });
              })
          }).catch(action => action).then(() => {
            this.isClearActiveFlag = true;
          })
          return true;
        } else if(this.mode !== 'show') {    //新建模式与修改模式，仅进行数组的引用赋值修改
            this.$refs.elxEditable.remove(row);
            if ( this.mode ==='alter' && this.joinParent && row.id  ) {
                this.originalDelList.push(row);
            }
            console.log('删除单个清单需记录  this.originalDelList，此处显示     this.originalList ------this.originalDelList');
            console.log(this.originalList,this.originalDelList)

            let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
            this.originalList.length = 0;
            for (let index = 0; index < rest.length; index++) {
                this.originalList.push(rest[index]); 
            }
            this.watchList(this.originalList);  //监听清单列表 判断增/改 添加到对应增改集合
            this.$message({type: 'success', message: '删除所选选项成功!'})
        }
    },
    deleteSelectedEvent () {    //删除选中
      let removeRecords = this.$refs.elxEditable.getSelecteds()
      if (removeRecords.length) {
        this.isClearActiveFlag = false;
       this.$confirm('确定删除所选数据?', '温馨提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.loading = true
            // 进行发起请求删除
            if ( this.mode === 'show') {    //展示模式执行的网络请求批量删除
                var obj = {
                    originalAddList: [],    //增
                    originalDelList: [],     //删 
                    originalAltList: []   //改
                };
                for (let index = 0; index < removeRecords.length; index++) {
                    if (removeRecords[index].id) obj.originalDelList.push(removeRecords[index]);
                };
                // 进行发起请求删除
                this.$post('/original/update', obj)
                  .then((response) => {
                  //删除成功
                  this.loading = false;
                  this.$refs.elxEditable.remove(removeRecords);
                  this.findList();
                  this.$message({
                    type: 'success',
                    message: '删除所选选项成功!'
                  })
                }).catch(e => {
                    this.$message({
                        type: 'info',
                        message: '删除失败！'+e
                    });
                })
            }else {   //此处为新建模式与修改模式所需要的引用赋值操作
                this.$refs.elxEditable.remove(removeRecords);
                if (this.mode ==='alter' && this.joinParent) {       
                    for (let a = removeRecords.length -1; a >= 0; a--) {
                        if ( removeRecords[a].id ) this.originalDelList.push(removeRecords[a]);
                    }
                    console.log('删除多个个清单需记录  this.originalDelList，此处显示     removeRecords ------this.originalDelList');
                    console.log(removeRecords,this.originalDelList);
                }
                let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据
                this.originalList.length = 0;
                for (let index = 0; index < rest.length; index++) {
                    this.originalList.push(rest[index]); 
                }
                this.watchList(this.originalList);  //监听清单列表 判断增/改 添加到对应增改集合
                this.loading = false;
                this.$message({
                    type: 'success',
                    message: '删除所选选项成功!'
                })
            }
            
        })
          // this.isClearActiveFlag = true;
      } else {
        this.$message({
          type: 'info',
          message: '请至少选择一条数据！'
        })
      }
    },
    saveRowEvent (row) {  //保存
      this.$refs.elxEditable.validateRow(row, valid => {
        if (valid) {
            if (this.mode === 'show') {
                var obj = {
                    originalAddList: [],    //增
                    originalDelList: [],     //删 
                    originalAltList: []   //改
                };
                if (row.id) obj.originalAltList.push(row);
                this.$post('/original/update',obj)
                    .then((response) => {   
                    this.$refs.elxEditable.clearActive();//清除所有单元格编辑状态
                    this.$message({ message: `修改成功`, type: 'success', duration: 3000, showClose: true })
                }).catch(e => {
                    this.$refs.elxEditable.clearActive();//清除所有单元格编辑状态
                    this.$message({
                        type: 'info',
                        message: '修改失败！'+e
                    });
                })
            }else { //此处为新建模式与修改模式所需要的引用赋值操作
                if ( row.id ) row.alter='Y'; //标记为修改
                let rest = this.$refs.elxEditable.getRecords();//获取表格的全部数据

                this.originalList.length = 0;
                for (let index = 0; index < rest.length; index++) {
                    this.originalList.push(rest[index]); 
                }
                this.watchList(this.originalList);  //监听清单列表 判断增/改 添加到对应增改集合
                this.$message({ message: `修改成功`, type: 'success', duration: 3000, showClose: true });
                this.$refs.elxEditable.clearActive();//清除所有单元格编辑状态
            }
        }
      })
    },
    exportCsvEvent () {
      this.$refs.elxEditable.exportCsv();
    },
    cell_select ({row, column, rowIndex, columnIndex}){ //单元格样式
        if (columnIndex >0) { //带选择框的情况
            //  return {'text-align': 'center'}
        }
    }
        
  }
}
</script>

<style scoped>
.manual-table2-oper {
  width: 100%;
  height: 25px;
  position: relative;
  margin: 4px 0 15px 0;
  text-align: left;
}
.manual-table2-oper a{
color: #fff;
}
.manual-table2-pagination {
  margin-top: 18px;
  text-align: right;
}
.manual-table4-pagination {
  margin-top: 18px;
  text-align: right;
}

.manual-table2.elx-editable .elx-editable-row.new-insert,
.manual-table2.elx-editable .elx-editable-row.new-insert:hover>td {
  background-color: #f0f9eb;
}
</style>