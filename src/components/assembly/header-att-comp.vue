<template>
  <div>
    <p style="color: red;font-size: 12px;">拖动排序</p>

    <div class="click-table11-oper">
      <el-button type="warning" size="mini" @click="submitEvent">保存</el-button>
      <el-button type="success" size="mini" @click="exportCsvEvent">导出</el-button>
       <el-button type="success" size="small" @click="insertEvent">新增</el-button>
      <el-button type="success" size="small" @click="exportCsvEvent">导出</el-button>
    </div>

    <elx-editable
      v-loading="loading"
      element-loading-text="生成数据中，请稍后..."
      element-loading-spinner="el-icon-loading"
      ref="elxEditable"
      class="click-table11"
      border
      height="466"
      size="small"
      row-key="id"
      show-summary
      :data.sync="list"
      :custom-columns.sync="customColumns"
      :summary-method="getSummaries"
      :edit-config="{trigger: 'click', mode: 'cell'}"
      style="width: 100%">
      <elx-editable-column type="selection" width="55"></elx-editable-column>
      <elx-editable-column width="40">
        <template v-slot:header="scope">
          <el-tooltip class="item" placement="top">
            <div slot="content">按住后可以上下拖动排序，<br>完成后点击保存即可！</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template>
          <i class="el-icon-rank drag-btn"></i>
        </template>
      </elx-editable-column>
      <elx-editable-column type="index" width="55">
        <template v-slot:header>
          <i class="el-icon-setting" @click="dialogVisible = true"></i>
        </template>
      </elx-editable-column>
      <elx-editable-column prop="0.name" label="名字" min-width="140" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="1" label="名字" min-width="140" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="2" label="名字" min-width="140" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="3" label="名字" min-width="140" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="4" label="名字" min-width="140" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="5" label="名字" min-width="140" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="6" label="名字" min-width="140" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="7" label="名字" min-width="140" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="8" label="名字" min-width="140" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
    </elx-editable>
    
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import Sortable from 'sortablejs'

export default {
  name: 'InvenEdit',
  data () {
    return {
      loading: false,
      dialogVisible: false,
      sexList: [
        

      ],
      regionList: [],
      customColumns: [],
      list: [
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
        {0:{name:'洛伊'},1:'陈淑惠',2:5, 3:'小丽',4:'陈淑惠',5:5, 6:'小丽',7:'陈淑惠',8:5},
      ]
    }
  },
  computed: {
    allCustomColumnList () {
      console.log('sssssssssssssss',this.customColumns)
      return this.customColumns.filter(item => item.prop)
    }
  },
  created () {
    // this.rowDrop()
    // this.findSexList()
    // this.findRegionList()
    // this.findList()
  },
  methods: {
    findList () {
      this.loading = true
      // XEAjax.doGet('/api/user/list', { sort: 'seq', order: 'asc' }).then(({ data }) => {
      //   this.list = data
      //   this.loading = false
      // }).catch(e => {
      //   this.loading = false
      // })
    },
    findSexList () {
      // XEAjax.doGet('/api/conf/sex/list').then(({ data }) => {
      //   this.sexList = data
      // })
    },
    findRegionList () {
      // XEAjax.doGet('/api/conf/region/list').then(({ data }) => {
      //   this.regionList = data
      // })
    },
    getSummaries (param) {  //合计
      const { columns, data } = param

      const sums = []
      console.log(param)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总'
          return
        }
        switch (column.property) {
          case '5':
            sums[index] = `平均：${XEUtils.mean(data, column.property)}岁`
            break
          case '8':
            sums[index] = `平均：${XEUtils.mean(data, column.property)}岁`
            break
          case '2':
            sums[index] = `总分：${XEUtils.sum(data, column.property)}`
            break
          default:
            sums[index] = ''
            break
        }
      })
      return sums
    },
    insertEvent () {
      this.$refs.elxEditable.insert({
        0: `New ${Date.now()}`,
      }).then(({ row }) => {
        this.$refs.elxEditable.setActiveCell(row)
      })
      this.$refs.elxEditable.clearActive()
    },
    getSelectLabel (value, valueProp, labelProp, list) {
      let item = XEUtils.find(list, item => item[valueProp] === value)
      return item ? item[labelProp] : null
    },
    getCascaderLabel (value, list) {
      let values = value || []
      let labels = []
      let matchCascaderData = function (index, list) {
        let val = values[index]
        if (list && values.length > index) {
          list.forEach(item => {
            if (item.value === val) {
              labels.push(item.label)
              matchCascaderData(++index, item.children)
            }
          })
        }
      }
      matchCascaderData(0, list)
      return labels.join(' / ')
    },
    getDatePicker (value) {
      return XEUtils.toDateString(value, 'yyyy/MM/dd')
    },
    formatterDate (row, column, cellValue, index) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    rowDrop () {
      this.$nextTick(() => {
        Sortable.create(this.$el.querySelector('.el-table__body-wrapper tbody'), {
          handle: '.drag-btn',
          onEnd: ({ newIndex, oldIndex }) => {
            let currRow = this.list.splice(oldIndex, 1)[0]
            this.list.splice(newIndex, 0, currRow)
          }
        })
      })
    },
    submitEvent () {
      this.$refs.elxEditable.validate(valid => {
        if (valid) {
          let list = this.list
          list.forEach((item, index) => {
            if (XEUtils.isDate(item.date)) {
              item.date = item.date.getTime()
            }
            // 重新生成排序后的序号
            item.seq = index
          })
          this.loading = true
          // XEAjax.doPost('/api/user/save', { updateRecords: list }).then(({ data }) => {
          //   Message({
          //     type: 'success',
          //     message: '保存成功!'
          //   })
          //   this.findList()
          // }).catch(e => {
          //   this.loading = false
          // })
        }
      })
    },
    exportCsvEvent () {
      this.$refs.elxEditable.exportCsv()
    },


  }
}
</script>

<style scope>
.click-table11-oper {
  margin-bottom: 18px;
}
.click-table11-pagination {
  margin-top: 18px;
  text-align: right;
}
.click-table11 .drag-btn {
  font-size: 16px;
  cursor: move;
}
.click-table11.elx-editable .elx-editable-row.new-insert,
.click-table11.elx-editable .elx-editable-row.new-insert:hover>td {
  background-color: #f0f9eb;
}
.click-table11 .el-table__body tr.hover-row>td,
.click-table11 .el-table__body .el-table__row:hover>td {
  background-color: inherit;
}
.click-table11.elx-editable .elx-editable-row.sortable-ghost,
.click-table11.elx-editable .elx-editable-row.sortable-chosen {
  background-color: #fff6b2;
}
</style>