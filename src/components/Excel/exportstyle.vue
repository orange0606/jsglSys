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
                
                {"A":1,"B":1,"C":1,"D":1,"E":1,"F":1,"G":1,"H":1},
                {"A":2,"B":2,"C":2,"D":2,"E":2,"F":2,"G":2,"H":2},
                {"A":3,"B":3,"C":3,"D":3,"E":3,"F":3,"G":3,"H":3},
                {"A":4,"B":4,"C":4,"D":4,"E":4,"F":4,"G":4,"H":4},
                {"A":5,"B":5,"C":5,"D":5,"E":5,"F":5,"G":5,"H":5},
            ],
            list: [
                {
                phone: 18955191234,
                content:
                    "第一个为前置条件，最后一个为预期结果，需要带相应关键字,第一个为前置条件，最后一个为预期结果"
                },
                {
                phone: 18955191234,
                content: "第一个为前置条件，最后一个为预期结果，需要带相应关键字"
                },
                {
                phone: "18955191234",
                content:
                    "第一个为前置条件，最后一个为预期结果，需要带相应关键字,zhenhgdsdfsff"
                },
                {
                phone: 18955191234,
                content: "第一个为前置条件，最后一个为预期结果，需要带相应关键字"
                },
                {
                phone: "18955191234",
                content:
                    "第一个为前置条件，最后一个为预期结果，需要带相应关键字,zhenhgdsdfsff"
                },
                {
                phone: 18955191234,
                content: "第一个为前置条件，最后一个为预期结果，需要带相应关键字"
                },
                {
                phone: "18955191234",
                content:
                    "第一个为前置条件，最后一个为预期结果，需要带相应关键字,zhenhgdsdfsff"
                }
            ],
            filename:'傻狗',
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
        import("@/modules/Export2Excel").then(excel => {
            const multiHeader = [
            [
                "工作情况一览表",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                ""
            ],
            [
                "截止日期：2019年09月11日",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                ""
            ],
            [
                "截止日期：2019年09月11日",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                ""
            ],
            [
                "截止日期：2019年09月11日",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                ""
            ]
            ];
            const tHeader = [
            "序号",
            "分类",
            "报建项目",
            "有效期",
            "计划开始时间",
            "计划完成时间",
            "受理",
            "所需资料",
            "办理周期",
            "责任人",
            "工作进展"
            ];
            // const filterVal = [
            // "code",
            // "name",
            // "orderBy",
            // "pageviews",
            // "display_time"
            // ];
            const filterVal = [
            "A",
            "B",
            "C",
            "D",
            "E"
            ];
            const list = this.tableData;
            // const list = this.list;
            const data = this.formatJson(filterVal, list);
            console.log(data)
            const merges = ['A1:K1','A2:K2']; // 合并单元格
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