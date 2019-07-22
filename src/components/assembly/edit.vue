<template>
  <div v-loading="loading">
    <p style="color: red;font-size: 12px;">关闭自动清除：如果 autoClearActive=false 当点击其它地方后，则不会自动清除最后活动行或列</p>

    <div class="manual-table3-oper">
      <el-button type="success" size="mini" @click="insertEvent">新增</el-button>
      <el-button type="danger" size="mini" @click="deleteSelectedEvent">删除选中</el-button>
      <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
    </div>

    <elx-editable
      ref="elxEditable"
      class="manual-table4"
      border
      height="466"
      :data.sync="list"
      style="width: 100%">
      <!-- <elx-editable-column type="selection" width="55"></elx-editable-column> -->
     <elx-editable-column type="index" width="50"> </elx-editable-column>
      <elx-editable-column :prop="val+'.td'" :width="`${col_width}`" :label="'标题'+(i+1)" show-overflow-tooltip v-for="(val,i) in hd" :key="i"  >       
      </elx-editable-column>
    </elx-editable>

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
</template>

<script>
export default {
  name: 'edit',
  props:['headID','show'],
  data () {
    return {
      loading: false,
      list: [],
      headObj:{},
      hd:[],

    }
  },
  created () {
    this.headObj = this.headID.id;
    this.findList(this.headObj.id,this.headObj.type)
  },
  methods: {
    findList (id,type) {
      this.loading = true
        //发起网络请求
      this.$post('/headrow/getone',{id,type})
        .then((response) => {
        console.log('请求成功')
        console.log(response)
        // this.list = response.data.oneh.headRowList;
        let data = response.data.oneh;
        this.package(data.headRowList,data.refCol,data.refRow)
        this.loading = false;

      })
     
    },
    package (list,colLength,rowLength){
        let AZ = this.AZ;
        let arr = [];
        for (let i = 0; i < parseInt(rowLength); i++) { 
            arr[i]={}
            for (let j = 0; j < parseInt(colLength); j++) {
                arr[i]['hd'+j]=null;
            }  
        }
        for (let index = 0; index < list.length; index++) {
            let row = list[index].trNum;  //行号
            let col = AZ.indexOf(list[index].colNum); //列号A
            console.log('行号列号')
            console.log(row,col)
            arr[row-1]['hd'+col] =list[index];
        }
        this.list = arr;
        this.hd = Object.keys(arr[0]);
    },
    AZ(){  //封装遍历表格的所有的列 A-Z AA-AZ ...
        let arr = [];
        let a = 0;
        for (var i = 0; i < 26; i++) {
            arr.push(String.fromCharCode((65 + i)))
            // console.log(String.fromCharCode((65 + i)))  
            // console.log(i)   
        }
        for (let j = 0; j < 26; j++) {
            for (var c = 0; c < 26; c++) {
                arr.push(arr[j]+String.fromCharCode((65 + c)))  
                // console.log(arr[j]+String.fromCharCode((65 + c)))
            }  
        }
        // console.log(arr)
        return arr;
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.findList()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.findList()
    },
   
    exportCsvEvent () {
      this.$refs.elxEditable.exportCsv()
    }
  }
}
</script>

<style>
.manual-table4-oper {
  margin-bottom: 18px;
}
.manual-table4-pagination {
  margin-top: 18px;
  text-align: right;
}
.manual-table4.elx-editable .elx-editable-row.new-insert,
.manual-table4.elx-editable .elx-editable-row.new-insert:hover>td {
  background-color: #f0f9eb;
}
</style>