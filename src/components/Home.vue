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
        tableData: [{
          id1: '12987122',
          id2: '王小虎',
          id3: '234',
          id4: '3.2',
          id5: 10
        }, {
          id1: '12987123',
          id2: '王小虎',
          id3: '165',
          id4: '4.43',
          id5: 12
        }, {
          id1: '12987124',
          id2: '王小虎',
          id3: '324',
          id4: '1.9',
          id5: 9
        }, {
          id1: '12987125',
          id2: '王小虎',
          id3: '621',
          id4: '2.2',
          id5: 17
        }, {
          id1: '12987126',
          id2: '王小虎',
          id3: '539',
          id4: '4.1',
          id5: 15
        }],


        // table:[
        //     [
        //         {id:1,key:A1,value:222},
        //         {id:1,key:B1,value:222},
        //         {id:1,key:C1,value:222},
        //         {id:1,key:D1,value:222},
        //     ],
        //      [
        //         {id:1,key:A2,value:222},
        //         {id:1,key:B2,value:222},
        //         {id:1,key:C2,value:222},
        //         {id:1,key:D2,value:222},
        //     ],
        // ],
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