<template>
  <div class="hello">
      
      <el-form :model="row" ref="row" label-width="100" width="800" size="small">
            <el-form-item label="设置属性" prop="attribute">
                <el-select v-model="row.attribute" placeholder="请选择属性" filterable remote  clearable size="small" style=" width:100%;" prop="attribute">
                    <!-- <el-option v-for="(val,i) in allAttribute" :key="i" :label="val.name" :value="val.value"></el-option> -->
                    <el-option v-show="attType[type]" v-for="(val,i) in attType[type]" :key="i+'a'" :label="val.name" :value="val.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-for="(val,i) in attType[type]" :key="i+'b'" v-show="row.attribute!=null && val.value == row.attribute && val.input" label="属性值(点击左边表格的单元格选择值)" >
                <el-input v-model="row.attributeValue" :autofocus="true">
                    <el-button slot="append" type="primary" size="mini">确定</el-button>
                </el-input>
            </el-form-item>
            <!-- <div>{{attType[type][0].name}}</div> -->
            <!-- <div>{{attType[type][0].name}}</div> -->
            <!-- <el-button @click="cancelAtt">取 消</el-button>
            <el-button type="primary" @click="submitAtt">确 定</el-button> -->
        </el-form>
  </div>
</template>

<script>

  export default {
    name: 'attForm',
    props: {
        row:{  //表单数据
            type: Object,
        },
        type: { //表头类型
            required: false,
            default: 'original'
        },
    },
    data () {
        return {
            allAttribute: [   //所有清单表头共有的属性
                { value: 'sysOrder', name: '系统序号列“sysOrder”（用于系统的排序，导入导出时无需匹配）', input: false },
                { value: 'sysNum', name: '系统编号列“sysNum”（系统用于对清单编号去空格和中文符号的处理，导入导出时无需匹配）', input: false },
                { value: 'formula', name: '“formula”公式', input: true },
                { value: 'sumText', name: '系统默认的合计行-普通文本', input: true },
                { value: 'sumNull', name: '系统默认的合计行-空文本', input: false },
                { value: 'sumFormula', name: '系统默认的合计行-合计公式', input: false }
            ],
            allLimit:[ //所有清单表头行限制限制属性的值
                { value: 'null', name: '无', input: false},
                { value: 'max', name: 'max最大值', input: true},
                { value: 'increaseMax', name: 'increasemax增加的最大值', input: true },
                { value: 'decreaseMax', name: 'decreasemax减少的最大值', input: true }
            ],
            attType: {
                original:[  // 原清单
                    { value: 'originalNull', name: '“originalnull”原清单（无对应）', input: false },
                ],
                change:[    //变更清单
                    { value: 'original', name: '“original”原清单', input: true },
                    { value: 'originalNull', name: '“originalnull”新清单（无对应）', input: false },
                    { value: 'change', name: '“change”变更清单', input: true },
                    { value: 'fluctuate', name: '“fluctuate”变更清单增减', input: true }
                ],
                // update[    //变更后（新）清单
                //     attribute:[ //属性及属性值
                //     ]
                // },
                meterage:[    //计量清单
                    { value: 'update', name: '“update”新清单', input: true },
                    { value: 'updateNull', name: '“updatenull”新清单（无对应）', input: false },
                    { value: 'meterage', name: '“meterage”计量清单', input: false },
                    { value: 'totalmeterage-meterage', name: '累计计量对应的计量清单', input: true },
                ],
                totalmeterage:[    //累计计量清单
                    { value: 'update', name: '“update”新清单', input: true },
                    { value: 'updateNull', name: '“updatenull”新清单（无对应）', input: false },
                    { value: 'meterage', name: '“meterage”变更清单', input: false },
                    { value: 'fluctuate', name: '“fluctuate”变更清单增减', input: true }
                ],   
                pay:[    //支付清单
                    { value: 'update', name: '“update”新清单', input: true },
                    { value: 'updateNull', name: '“updatenull”新清单（无对应）', input: false },
                    { value: 'meterage', name: '“pay”支付清单', input: false },
                    { value: 'fluctuate', name: '“fluctuate”变更清单增减', input: true }   
                ],  
                totalpay:[    //累计支付清单
                    { value: 'update', name: '“update”新清单', input: true },
                    { value: 'updateNull', name: '“updatenull”新清单（无对应）', input: false },
                    { value: 'totalPay', name: '“totalpay"累计支付清单', input: true },
                    { value: 'fluctuate', name: '“fluctuate”变更清单增减', input: true }
                ] 
            },
        }
    },
     created () { //2
    },
   watch: {
        ruleForm:{  
            handler(New, Old) {
            },
            deep: true
        }

   },
    methods: {
        
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-dialog__body {
  padding: 10px 20px;
}
</style>
