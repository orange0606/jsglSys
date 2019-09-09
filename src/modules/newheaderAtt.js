
let data = {
    /*
        原清单、变更清单，、计量清单、累计计量清单、支付清单，累计支付清单
    */
//    'update'变更后的（新）清单,
    allAttribute: [   //所有清单表头共有的属性
        { value: 'sysOrder', name: '系统序号列“sysOrder”（用于系统的排序，导入导出时无需匹配）', input: false },
        { value: 'sysNum', name: '系统编号列“sysNum”（系统用于对清单编号去空格和中文符号的处理，导入导出时无需匹配）', input: false },
        { value: 'formula', name: '“formula”公式', input: true },
        { value: 'sumText', name: '系统默认的合计行-普通文本', input: false },
        { value: 'sumNull', name: '系统默认的合计行-空文本', input: false },
        { value: 'sumFormula', name: '系统默认的合计行-合计公式', input: true }
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
            { value: 'change', name: '“change”变更清单', input: false },
            { value: 'fluctuate', name: '“fluctuate”变更清单增减', input: true }
        ],
        // update[    //变更后（新）清单
        //     attribute:[ //属性及属性值
        //     ]
        // },
        meterage:[    //计量清单
            { value: 'update', name: '“update”新清单', input: true },
            { value: 'meterageNull', name: '“meteragenull”计量清单（无对应）', input: false },
            { value: 'meterage', name: '“meterage”计量清单', input: true },
            { value: 'totalmeterage-meterage', name: 'totalmeterage-meterage"累计计量对应的计量清单。目的是对应累计计量清单的值，但通过计量清单做对应。', input: true },
        ],
        totalmeterage:[    //累计计量清单
            { value: 'update', name: '“update”新清单', input: true },
            { value: 'updateNull', name: '“updatenull”新清单（无对应）', input: false },
            { value: 'totalmeteragenull', name: '“totalmeteragenull”累计计量清单', input: false },
            { value: 'meterage-total', name: '"meterage-total"对应计量清单项的累计', input: true },
        ],   
        pay:[    //支付清单
            { value: 'pay', name: '“pay”支付清单', input: false },
            // { value: 'totalmeterage-sum-onerow-auto', name: 'totalmeterage-sum-onerow-auto”对应累计计量的系统合计行，只有一行内容，系统自动添加', input: true },  
            { value: 'totalpay-pay', name: '"totalpay-pay"累计支付对应的支付清单。目的是对应累计支付清单的值，但通过支付清单做对应。', input: true },   
            { value: 'totalmeterage-head-total', name: '"totalmeterage-head-total"累计计量表头合计内容', input: true }   
        ],  
        totalpay:[    //累计支付清单
            { value: 'totalpay_null', name: 'totalpay_null累计支付清单（无对应）', input: false },
            // { value: 'totalmeterage-sum-onerow-auto', name: '“totalmeterage-sum-onerow-auto”对应累计计量的系统合计行，只有一行内容，系统自动添加', input: true },
            { value: 'pay-head-total', name: '"pay-head-total "支付表头合计内容', input: true },
            { value: 'totalmeterage-head-total', name: '"totalmeterage-head-total"累计计量表头合计内容', input: true },
            { value: 'pay', name: '"pay"支付清单', input: true },

        ] 
    }
}


/*
 组装各种表头属性数据
param type: 需要组装哪种类型的清单表头数据(string)
return : 完整清单表头属性数据（Array）
 */
export default {
    ifInput (type) {  //获取该表头类型的要设置属性值的所有属性
        let list = data.attType[type];
        let arr = [];
        for (let index = 0; index < list.length; index++) {
            if (list[index].value != 'update' && list[index].value != 'original' && list[index].input ) {
                arr.push(list[index].value);
            }
        }
        return arr;
    },
    Attribute (type){ //该表头类型的全部属性
        // console.log(data)
        let arr = [];
        arr = data.attType[type].concat(data.allAttribute)
        return arr;
    },
    Limit (type) {  //该表头类型的全部限制属性
        let arr = [];
        if (type == 'original') {
           return arr; 
        }
        arr = [...data.allLimit];
        return arr;
    },
    

}
// module.exports = Assemble;