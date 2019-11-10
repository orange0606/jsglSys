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
            let Az = this.$excel.AZ(), // excel表格的所有列
            tableData = this.list,  //表格内容
            headerData = this.PackHeader,   //已组装好的全部表头数据   
            totalobj = this.totalobj,   //合计尾行计算结果
            lastHeader = this.lastHeader, //表头最后一层 对象嵌套对象{A:{}}
            tHeader = [], //表头最后一层的单元格内容  array
            filterVal = this.hd, //所有列；
            merges = [], //合并情况 ['A1:K1']
            multiHeader = [], //表头标题（不包括表头最后一层与合计尾行） multiHeader 二维数组
            Headalign = {}, //表头的文字对齐方式（不包括表头最后一层与合计尾行） Headalign 对象 {"A1":"center"...}
            Listalign = {},  //每列的文字居中对齐方式 Listalign 对象 {"A":"center"...}
            list = []; //转换好的数据
            //1、表头数据
                //取出转换表头标题
                for (let i = headerData.length-2; i > -1 ; i--) {   //这里-2 减去合计尾行与
                    multiHeader[i] = filterVal.map(function (n) { 
                        let item = headerData[i][n],
                        colNum = item.colNum,
                        trNum = item.trNum,
                        align = item.textAlign
                        key = colNum+trNum;

                        //记录表头合并情况
                        if (item.tdColspan >1 || item.tdRowspan >1) {   //需要记录合并情况
                            // trNum:i+1, colNum:ABC[j]
                            let sub = Az.indexOf(colNum),
                            s = Az[sub+item.tdColspan-1],//合并结束的列
                            r = trNum+item.tdRowspan-1;//合并结束的行号
                            merges.push(`${key}:${s}${r}`);
                        }
                        //取出除表头的文字对齐方式（不包括表头最后一层与合计尾行） Headalign 对象 {"A1":"center"...}
                        Headalign[key]=align;

                        return item.td; //取出表头的每个单元格内容
                    });
                }
                tHeader =[].concat(multiHeader[multiHeader.length-1]); //表头最后一层 tHeader 数组 ["A列文字","B列文字"...] 
                multiHeader.length = multiHeader.length-1; //去除最后一层的文字内容

                //2、需要把数据转换成表格格式 tableData
                let hdlen = filterVal.length; //所有列 长度
                for (let n = tableData.length-1; n > -1; n--) {
                    list[n]={};
                    for (let i = 0; i < hdlen; i++) {
                        list[n][filterVal[i]] = tableData[n][filterVal[i]].td;
                    }
                }
                //取出合计尾行加入合计数据  最终把合计尾行添加到tableData 数据中 数组对象
                let lasttableData = {}; 
                for (let n = 0; n < hdlen; n++) {
                    let key = filterVal[n];
                    lasttableData[key] = '';
                    if (totalobj[key]) lasttableData[key] = totalobj[key];
                }
                list.push(lasttableData);//合计尾行加入表格数据

                let Colmerges = {};// 存储表格内容的每列合并情况 {A:B} {开始的位置：结束的位置}
                for(let n  in lastHeader){  
                    let item = lastHeader[n],
                    colNum = item.colNum,
                    align = item.textAlign;
                    //记录合并情况
                    if (item.tdColspan >1 ) {   //需要记录最后一层表头内容合并情况  A:
                        // trNum:i+1, colNum:ABC[j]
                        let sub = Az.indexOf(colNum);
                        Colmerges[colNum]= Az[sub+item.tdColspan-1];//合并结束的列
                    }
                    //取出每列的文字居中对齐方式 Listalign 对象 {"A":"center"...}
                    Listalign[colNum] = align;
                }

                // 生成表格内容的合并信息 并添加到合并数组中
                let seq = headerData.length, //从表格内容开始 减去合计尾行 然后新的一行得加1
                listlen = list.length;
                for (let n = 0; n < listlen; n++) {
                    for(let key in Colmerges){  
                         merges.push(`${key}${n+seq}:${Colmerges[key]}${n+seq}`);
                    }
                }
                console.log('合并数组');
                console.log(merges);
                console.log('转换好的数据')
                console.log(list)
                console.log('表头最后一层的单元格内容');
                console.log(tHeader);
                console.log('表头的文字对齐方式（不包括表头最后一层与合计尾行）')
                console.log(Headalign)
                console.log('所有列')
                console.log(filterVal)
                console.log('表头最后一层的单元格内容');
                console.log(tHeader);
                console.log('每列的文字居中对齐方式')
                console.log(Listalign)
                console.log('表头标题（不包括表头最后一层与合计尾行）');
                console.log(multiHeader);

            //      let Az = this.$excel.AZ(), // excel表格的所有列
            // tableData = this.list,  //表格内容
            // headerData = this.PackHeader,   //已组装好的全部表头数据   
            // totalobj = this.totalobj,   //合计尾行计算结果
            // lastHeader = this.lastHeader, //表头最后一层 对象嵌套对象{A:{}}
            // tHeader = [], //表头最后一层的单元格内容  array
            // filterVal = this.hd, //所有列；
            // merges = [], //合并情况 ['A1:K1']
            // multiHeader = [], //表头标题（不包括表头最后一层与合计尾行） multiHeader 二维数组
            // Headalign = {}, //表头的文字对齐方式（不包括表头最后一层与合计尾行） Headalign 对象 {"A1":"center"...}
            // Listalign = {},  //每列的文字居中对齐方式 Listalign 对象 {"A":"center"...}
            // list = []; //转换好的数据
            return false;


        import("@/modules/Export2Excel").then(excel => {
            const multiHeader = [ ["变 更1","","","","","","","","","",""] ];
            const tHeader = ["细目号", "细目名称", "单位", "单价（元）", "原设计 数量", "变更后数量", "上期累计变更数量", "上期累计变更金额", "本期变更数量","本期变更金额","本期累计变更数量"];
            const filterVal = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" ];
            const list = this.tableData;
            const merges = ['A1:K1']; // 合并单元格
            // const list = this.list;
            const data = this.formatJson(filterVal, list);
            console.log(data)

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