<template>
  <div>
    <el-table
      :data="table"
      :span-method="arraySpanMethod"
      border
      style="width: 100%">
      <el-table-column
        prop="hd1.key"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="hd2.key"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="hd3.key"
        sortable
        label="数值 1">
      </el-table-column>
      <el-table-column
        prop="hd"
        sortable
        label="数值 1">
      </el-table-column>
    </el-table>

   
  </div>
</template>

<script>
  export default {
    data() {
      return {
        
        table:[
            {
                hd1: {
                    key: 'A1',
                    value: 11,
                    row: 1,
                    cos: 1,
                    fom: null
                },
                hd2: {
                    key: 'B1',
                    value: 11,
                    row: 1,
                    cos: 1,
                    fom: null
                },
                hd3: {
                    key: 'C1',
                    value: 11,
                    row: 1,
                    cos: 1,
                    fom: null  
                },
                hd:'11'
            },
            {
                hd1: {
                    key: 'A2',
                    value: 11,
                    row: 1,
                    cos: 1,
                    fom: null
                },
                hd2: {
                    key: 'B2',
                    value: 11,
                    row: 1,
                    cos: 1,
                    fom: null
                },
                hd3: {
                    key: 'C2',
                    value: 11,
                    row: 1,
                    cos: 1,
                    fom: null  
                },
                hd:'11'
            },
            {
                hd1: {
                    key: 'A2',
                    value: 11,
                    row: 1,
                    cos: 1,
                    fom: null
                },
                hd2: {
                    key: 'B2',
                    value: 11,
                    row: 1,
                    cos: 1,
                    fom: null
                },
                hd3: {
                    key: 'C2',
                    value: 11,
                    row: 1,
                    cos: 1,
                    fom: null  
                },
                hd:'11'
            },
        ]



      };
    },
    methods: {
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (row.hd1.key=="A1") {
          return [2, 1];
        }else{
          // return [0, 0];
        }

      },

    }
  };
</script>