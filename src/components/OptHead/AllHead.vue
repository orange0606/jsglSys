<template>
    <div style="min-width:1000px;overflow: hidden;">
    <el-collapse-transition>
    <el-card class="box-card" shadow="never" v-if="col.length>0">
        <div slot="header" class="clearfix">
          <span>已选择的单元格 {{col.length}} 个</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="Splicing">控制台打印</el-button>
        </div>
        <ul class="text item" >
            <li class="ul_li" style="width:40px">#</li>
            <li class="ul_li">表头类型</li>
            <li class="ul_li">表头名称</li>
            <li class="ul_li" style="width:100px" >表头标段</li>
            <li class="ul_li" style="width:100px" >单元格位置</li>
            <li class="ul_li" style="width:60px">操作</li>
        </ul>
        <div class="cardbody">
            <!-- <div v-for="o in 10" :key="o" class="text item">
              {{'列表内容 ' + o }}
            </div> -->
            <ul class="text item" v-for="(val,i) in col" :key="i" style="overflow:auto">
                <li class="ul_li" style="width:40px">{{i+1}}</li>
                <li class="ul_li" v-text="typeName(val.type)" ></li>
                <li class="ul_li">{{val.name}}</li>
                <li class="ul_li" style="width:100px" >{{val.tender.name}}</li>
                <li class="ul_li" style="width:100px" >{{val.key}}</li>
                <li class="ul_li" style="width:60px" @click="deleCol(i)"><i class="el-icon-delete"></i></li>
            </ul>
        </div>
        
    </el-card>
    </el-collapse-transition>
    <el-collapse-transition>
    
    <div >
        <div style="text-align:left;font-size:15px;font-weight:bold;color:#909399;">
            <ul class="" >
              <li class="ul_li2" style="width:40px">#</li>
              <li class="ul_li2">标段编号</li>
              <li class="ul_li2">标段名称</li>
              <li class="ul_li2">表头编号</li>
              <li class="ul_li2" style="width:150px">表头名称</li>
              <li class="ul_li2" style="width:100px">类别</li>
            </ul>
        </div>
        <el-collapse accordion>
        <el-collapse-item v-for="(item,i) in list" :key="i" >
          <template slot="title">
            <ul class="" >
              <li class="ul_li2" style="width:40px">{{i+1}}</li>
              <li class="ul_li2">{{item.tender.num}}</li>
              <li class="ul_li2">{{item.tender.name}}</li>
              <li class="ul_li2">{{item.num}}</li>
              <li class="ul_li2" style="width:150px">{{item.name}}</li>
              <li class="ul_li2" style="width:100px" v-text="typeName(item.type)"></li>
            </ul>
          </template>
          <div>
                <!-- :span-method="arraySpanMethod"
                @cell-click ="cell_click"
                :cell-style ="cell_select" -->
              <el-table
                v-loading="loading" 
                ref="elxEditable2"
                class="click-table12"
                border
                
                :data.sync="item.RowList"
                size="small"
                :span-method="arraySpanMethod"
                @cell-click ="cell_click"
                :cell-style ="cell_select"
                :highlight-current-row="false"
                >
                    <el-table-column type="index" width="50" :index="i" align="center" > </el-table-column>
                    <el-table-column :prop="val+'.td'" :label="item.RowHd[a]" align="center" :index="i" show-overflow-tooltip v-for="(val,a) in item.RowHd" :key="a">
                        
                    </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
        <el-pagination
          class="manual-table4-pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageVO.currentPage"
          :page-sizes="[5, 10, 15, 20, 50, 100, 150, 200]"
          :page-size="pageVO.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageVO.totalResult">
        </el-pagination>
    </div>
    </el-collapse-transition>
    </div>

</template>

<script>
  export default {
  name: 'AllHead',
  props: {
    joinParent:{   //接入父组件标记，当joinParent标记为true时表示连接到父组件并接受父组件的参数；当joinParent为false时组件独立调试使用。
      // type:Array,
      required:false,
      default:false   
    },
    tenderId:{    //标段id
      required: false,
      default: null
    },
    type:{   //类型，当joinParent标记为true时表示连接到父组件并接受父组件的参数；
      // type:Array,
      required:false,
      default: null   
    },

    headRowSelected:{ //选定的单元格
      type: Object,
      required: false,
      default: () => ({headRowStr:''}) //记录多个表头，如“-original-27-93-AC10-,-change-29-98-AC10-”。
    },
  },
  data () {
    return {
      loading: false,
      list: [
      ],
      arr:[],
      tenderList:[],//全部标段
      editShow:false,//显示隐藏修改表头
      pageVO: {
        currentPage: 1,
        pageSize: 5,
        totalResult: 0
      },
      col:[],
      isClearActiveFlag: true
    }
  },
  created () {
      if (!this.joinParent) {
           this.findList()  //发起请求所有已建表头数据
      }
     
  },
  computed: {
      // 计算属性的 getter
      
  },
  watch: {
      headRowSelected(New, Old){
          console.log('有没有进来--------')
          this.list = this.col = null;
          this.findList()  //发起请求所有已建表头数据
          if (New.headRowStr && New.headRowStr.length > 0) {
              this.strSplit (New.headRowStr)
          }
          
      }
  },
  methods: {
    Splicing () {
        
        // var strArr = [];
        // for (let index = this.col.length-1; index >= 0; index--) {
        //     var item = this.col[index];
        //     strArr.push('-'+item.type+'-'+item.hdId+'-'+item.rowId+'-'+item.key+'-')
        // }
        // console.log('打印一下数组strArr')
        // console.log(strArr)
        
        // this.headRowSelected.headRowStr= strArr.join(",");
        console.log('this.headRowSelected')
        console.log(this.headRowSelected.headRowStr)
        console.log('this.col')
        console.log(this.col)
    },
    strSplit (str) {  //解析字符串
        try {
            let strs = str.split(","); //字符分割 
            console.log('第一次分割的字符串：')
            console.log(strs)
            this.col = strs.map(function (n,i) { 
                let str2 = n.split("-"); //字符分割
                // console.log('第2次分割的字符串：'+i)
                // console.log(str2)
                let str3 = str2.filter(function (elem) {
                    // console.log(i+'比较一下'+elem)
                    // console.log(elem !== "" && elem !== ",")
                    return (elem !== "" && elem !== ","); 
                })
                // console.log('第3次分割的字符串：'+i)
                // console.log(str3)
                let item = {
                    name: '',
                    type: str3[0],
                    hdId: str3[1],
                    rowId: str3[2],
                    key: str3[3],
                    tender: {
                      name:'标段'+i
                    }
                }
            return item; 
            }); 
        } catch (error) {
            this.$message({
            type: 'info',
            message: '解析选择的单元格字符串发生错误！'})
            console.log('解析选择的单元格字符串发生错误')
            console.log(error)
        }
    },
    deleCol(i) {
            var item = this.col[i],
            strKey = '-'+item.type+'-'+item.hdId+'-'+item.rowId+'-'+item.key+'-',
            strlen = strKey.length,
            AllStr = this.headRowSelected.headRowStr,
            sub = this.headRowSelected.headRowStr.indexOf(strKey);
            // console.log('strKey')
            // console.log(strKey)
            this.col.splice(i, 1);
            if (sub>0) {  //说明不止一条数据
                if (AllStr[sub-1] === ',' && AllStr[sub+strlen] && AllStr[sub+strlen]=== ',' && (!AllStr[sub+strlen+1] || AllStr[sub+strlen+1] !=='-')) {
                    return this.headRowSelected.headRowStr = AllStr.replace(','+strKey+',',"");
                }
                if (AllStr[sub-1] === ',') {
                    return this.headRowSelected.headRowStr = AllStr.replace(','+strKey,"");
                }
                if (AllStr[sub+strlen] && AllStr[sub+strlen]=== ',' && (!AllStr[sub+strlen+1] || AllStr[sub+strlen+1] !=='-') ) {
                    return this.headRowSelected.headRowStr = AllStr.replace(strKey+',',"");
                }
            }else if(sub===0){
                if (AllStr[sub+strlen] && AllStr[sub+strlen]=== ',') {
                    return this.headRowSelected.headRowStr = AllStr.replace(strKey+',',"");
                }
                return this.headRowSelected.headRowStr = AllStr.replace(strKey,"");
            }
               
         
    },
    Collchange(strname){
    },
    typeName (type) {
      // `this` 指向 vm 实例
      let obj = {
      original: '原清单',
      change: '变更清单',
      update: '新清单',
      totalchange: '累计变更清单',
      meterage: '计量清单',
      totalmeterage: '累计计量清单',	
      pay: '支付清单',
      totalpay: '累计支付清单'
      }
      return type ? obj[type ] : '未知'
    },
    tenList (){   //请求所有标段
        this.$post('/tender/getall',{})
          .then((response) => {
          this.tenderList = response.data.tenderList;
        })
    },
    findList () {   //请求所有已建表头数据函数
        let parameter = {page:{current:this.pageVO.currentPage,pageSize:this.pageVO.pageSize}}
        if (this.joinParent) {
            parameter = {tenderId: this.tenderId, type: this.type, page:{current:this.pageVO.currentPage,pageSize:this.pageVO.pageSize}}
        }
        this.loading = true;
        //发起网络请求
        this.$post('/head/row/getall',parameter)
        .then((response) => {
        var data = response.data.headList.list,
        that = this;
        this.list = [];
        this.list = data.map(function (item, i) { 
            let key = that.typeRows(item.type)+'HeadRows';
            item['RowList'] = that.$excel.Package(item[key],item.refCol,item.refRow);
            item['RowHd'] = Object.keys(item['RowList'][0]); //用来所需要的所有列(obj)（属性）名（合并单元格所需要）
            return item; 
        }); 
        console.log('打印一下最新的数据呀')
        console.log(this.list);
        this.arr = this.list[0];
        this.pageVO.totalResult = response.data.headList.total;
        this.loading = false;
        data = null;

      }).catch(e => {
          this.loading = false;
          console.log('请求可导入的对应的表头列表发生错误')
          console.log(e)
          this.$message({
            type: 'info',
            message: '请求可导入的对应的表头列表发生错误'
          });
      });
 
    },
    typeRows (type) { //转换类型
        if (type == 'original') {
          return 'tOriginal';
        }else if (type == 'change'){
          return 'tChange';
        }else if (type == 'totalchange'){
          return 'totalchange';
        }else if (type == 'update'){
          return 'tUpdate';
        }else if (type == 'totalmeterage'){
          return 'tTotalmeterage';
        }else if (type == 'meterage'){
          return 'tMeterage';
        }else if (type == 'totalpay'){
          return 'tTotalpay';
        }else if (type == 'pay'){
          return 'tPay';
        }

    },
     cell_click(row, column, cell, event){ //单元格点击编辑事件
        if (column.property) {
            var colum =column.property;
            colum = colum.substr(0,colum.indexOf('.'));
            var key = `${row[colum].colNum}${row[colum].trNum}`,
            id = null,
            succre = {},
            list = this.list[column.index];
            // console.log('row[colum]--------------------')
            // console.log(row[colum])
            // console.log(list.type)
            switch (list.type) {
                case 'original':
                    id = row[colum].toId;
                    break;
                case 'change':
                    id = row[colum].tcId;
                    break;
                case 'totalchange':
                    id = row[colum].id;
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
                    id = row[colum].tpId;
                    break;
                case 'totalpay':
                    id = row[colum].ttpId;
                    break;
            } 
            // console.log('查看id是什么')
  
            succre.id = id;
            succre.key = key;
            // console.log('单击表格')
            // console.log(succre)
            var newObj = {
                name: list.name,
                type: list.type,
                hdId: list.id, //表头id
                rowId: id,
                key,
                tender: {
                    id: list.tender.id,
                    num: list.tender.num,
                    name: list.tender.name
                }
            };

            var colstrlen = this.headRowSelected.headRowStr.length,
            strKey = '-'+newObj.type+'-'+newObj.hdId+'-'+newObj.rowId+'-'+newObj.key+'-',
            strlen = strKey.length,
            AllStr = this.headRowSelected.headRowStr,
            sub = this.headRowSelected.headRowStr.indexOf(strKey);
            // console.log('strKey')
            // console.log(strKey)
            for (let index = this.col.length-1; index >=0; index--) {
                var item = this.col[index];
                if (newObj.hdId === item.hdId && newObj.rowId === item.rowId) { //查询有相同的不添加
                        // console.log('sub       :  '+sub)
                    this.col.splice(index, 1);
                    if (sub>0) {  //说明不止一条数据
                        if (AllStr[sub-1] === ',' && AllStr[sub+strlen] && AllStr[sub+strlen]=== ',' && (!AllStr[sub+strlen+1] || AllStr[sub+strlen+1] !=='-')) {
                            return this.headRowSelected.headRowStr = AllStr.replace(','+strKey+',',"");
                        }
                        if (AllStr[sub-1] === ',') {
                            return this.headRowSelected.headRowStr = AllStr.replace(','+strKey,"");
                        }
                        if (AllStr[sub+strlen] && AllStr[sub+strlen]=== ',' && (!AllStr[sub+strlen+1] || AllStr[sub+strlen+1] !=='-') ) {
                            return this.headRowSelected.headRowStr = AllStr.replace(strKey+',',"");
                        }
                    }else if(sub===0){
                        if (AllStr[sub+strlen] && AllStr[sub+strlen]=== ',') {
                            return this.headRowSelected.headRowStr = AllStr.replace(strKey+',',"");
                        }
                        return this.headRowSelected.headRowStr = AllStr.replace(strKey,"");
                    }
                }
              
            }
            this.col.unshift(newObj); //添加新数据到col
            if (colstrlen > 0) {
                this.headRowSelected.headRowStr+=','+strKey;
            }else{
                this.headRowSelected.headRowStr += strKey;
            }
        }  
    },
    cell_select ({row, column, rowIndex, columnIndex}){ //单元格样式
        if (column.property) {
            // 每次点完单元格的时候需要清除上一个编辑状态（所以需要记住上一个）
            var colum =column.property;
            colum = colum.substr(0,colum.indexOf('.'));
            var key = `${row[colum].colNum}${row[colum].trNum}`,
            id = null,
            list = this.list[column.index];
            // console.log('row[colum]--------------------')
            // console.log(row[colum])
            // console.log(list.type)
            switch (list.type) {
                case 'original':
                    id = row[colum].toId;
                    break;
                case 'change':
                    id = row[colum].tcId;
                    break;
                case 'totalchange':
                    id = row[colum].id;
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
                    id = row[colum].tpId;
                    break;
                case 'totalpay':
                    id = row[colum].ttpId;
                    break;
            } 
            for (let index = this.col.length-1; index >=0; index--) {
                var item = this.col[index];
                if (item.key === key && item.rowId === id) { //查询有相同的不添加
                    return {'background':'pink'};
                }
              
            }
            return {};
        }  
        return {};
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {   //单元格合并处理
        if (columnIndex >0) {  //带选择框的情况
            var Row = row[this.list[column.index]['RowHd'][columnIndex-1]];
            if (Row) {
                return [Row.tdRowspan, Row.tdColspan]
            }
        }
        return [1, 1]
    }, 
    searchEvent () {
      this.pageVO.currentPage = 1
      this.findList()
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.findList()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.findList()
    },
    formatterType (row, column, cellValue, index) {
      let obj = {
        original: '原清单',
        change: '变更清单',
        update: '新清单',
        totalchange: '累计变更清单',
        meterage: '计量清单',
        totalmeterage: '累计计量清单',	
        pay: '支付清单',
        totalpay: '累计支付清单'
      }
      return cellValue ? obj[cellValue] : '未知'
    },

  }
}
</script>

<style scoped>
.text {
    font-size: 14px;
    display: block;
  }

.item {
    margin-bottom: 13px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;

}
.box-card {
    width: 100%;
    text-align: left;
    /* height: 200px; */
}
div >>> .el-card__header {
    padding: 7px 20px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.cardbody {
    height: 150px;
    overflow-y:auto; 
}
.ul_li {
    width: 150px;
    padding: 0 10px;
    overflow: hidden;
    text-align: center;
    font-size: 13px;
    display: inline-block;
}
.ul_li2 {
    width: 100px;
    padding: 0 0 0 25px;

    overflow: hidden;
    text-align: center;
    /* font-size: 13px; */
    margin-top: 16px;
    display: inline-block;
}

.manual-table2-oper {
  margin-bottom: 18px;
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