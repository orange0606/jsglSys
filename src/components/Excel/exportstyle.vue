<template>
    <div style="text-align:left">
        <el-row>
            <el-button type="success" @click="exportxlsx">导出表格测试</el-button>
            <el-button type="success" @click="exportTable">导出表格测试2</el-button>
        </el-row>

    </div>
</template>
<script>
export default {
    name: 'ExcelStyle',
    components: {
    },
    props: {
    
    },
    data () {
        return {
            tableData:[
                {"A":1,"B":1,"C":1,"D":1,"E":1,"F":1,"G":1,"H":1,"I":1,"J":1,"K":1},
                {"A":2,"B":2,"C":2,"D":2,"E":2,"F":2,"G":2,"H":2,"I":2,"J":2,"K":2},
                {"A":3,"B":3,"C":3,"D":3,"E":3,"F":3,"G":3,"H":3,"I":3,"J":3,"K":3},
                {"A":4,"B":4,"C":4,"D":4,"E":4,"F":4,"G":4,"H":4,"I":4,"J":4,"K":4},
                {"A":5,"B":5,"C":5,"D":5,"E":5,"F":5,"G":5,"H":5,"I":5,"J":5,"K":5},
                {"A":2,"B":2,"C":2,"D":2,"E":2,"F":2,"G":2,"H":2,"I":2,"J":2,"K":2},
                {"A":3,"B":3,"C":3,"D":3,"E":3,"F":3,"G":3,"H":3,"I":3,"J":3,"K":3},
                {"A":4,"B":4,"C":4,"D":4,"E":4,"F":4,"G":4,"H":4,"I":4,"J":4,"K":4},
                {"A":5,"B":5,"C":5,"D":5,"E":5,"F":5,"G":5,"H":5,"I":5,"J":5,"K":5},
            ],
           
            filename:'导出的表格',
            autoWidth:true
        }
    },
    watch: {
    },
    mounted(){
    },
    created () {
    },
    methods: {
        exportxlsx() {
            // LAY_EXCEL.exportExcel([[1, 2, 3]], '表格导出.xlsx', 'xlsx')
            this.$xlsxstyle.downloadExl();
        },

        exportTable() {
        // const Az = this.$excel.AZ(), // excel表格的所有列
        // tableData = this.list,  //表格内容
        // headerData = this.PackHeader,   //已组装好的全部表头数据
        // headerlen = headerData.length-2,    //这里-2 减去合计尾行与表头最后一行
        // totalobj = this.totalobj,   //合计尾行计算结果
        // lastHeader = this.lastHeader, //表头最后一层
        // filterVal = this.hd, //所有列；
        // merges = [], //合并情况 ['A1:K1']
        // multiHeader = []; //表头标题（不包括表头最后一层与合计尾行） multiHeader 二维数组
        // //1、表头数据
        //     //取出转换表头标题
        //     for (let i = 0; i < headerlen; i++) {
        //         multiHeader[i] = filterVal.map(function (n) { 
        //             let item = headerData[i][n];
        //             //顺带记录合并情况
        //             if (item.tdColspan >1 || item.tdRowspan >1) {   //需要记录合并情况
        //                 // trNum:i+1, colNum:ABC[j]
        //                 let s = ;//合并结束的列  
        //                 let merge;
        //                 merge = `${item.colNum}${item.trNum}:`

        //             }
        //             return item.td; 
        //         });
        //     }

            //取出除表头的文字对齐方式（不包括表头最后一层与合计尾行） Headalign 对象 {"A":"center"...}
            //取出表头最后一层 tHeader 数组 ["A列文字","B列文字"...]
                //获取所有列名 filterVal 数组 ["A","B"...]
                //取出每列的文字居中对齐方式 Listalign 对象 {"A":"center"...}
            //取出合计尾行加入合计数据  最终把合计尾行添加到tableData 数据中 数组对象
        //2、需要把数据转换成表格格式 tableData
        import("@/modules/Export2Excel").then(excel => {
            const multiHeader = [ ["变 更1","","","","","","","","","",""] ];
            const tHeader = ["细目号", "细目名称", "单位", "单价（元）", "原设计 数量", "变更后数量", "上期累计变更数量", "上期累计变更金额", "本期变更数量","本期变更金额","本期累计变更数量"];

            const filterVal = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" ];
            const list = this.tableData;
            // const list = this.list;
            const data = this.formatJson(filterVal, list);
            console.log(data)
            const merges = ['A1:K1']; // 合并单元格
            excel.export_json_to_excel({
            multiHeader,
            header: tHeader,
            merges,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
            });
        });
        },
    // 辅助导出表格的函数
        formatJson(filterVal, jsonData) {
            return jsonData.map(v =>
                filterVal.map(j => {
                    if (j === "timestamp") {
                        return parseTime(v[j]);
                    } else {
                        return v[j];
                    }
                })
            );
        },
    }
}
</script>