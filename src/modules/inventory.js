
const data = {
    all_head:{  //所有清单表头字段
        tender_id : null, //标段id
        sys_order : null, //系统序号，用于排序
        sys_num : null, // 系统编号，用于处理清单编号的去空格、转换中文符号为英文等。
        num : null, //表头编号
        name : null, //表头名称
        type : null, //清单类别
        save_time : null, //保存时间
        update_time : null, //更改时间
        save_employee_id : null, // 保存人
        update_employee_id : null //更改人
    },
    all_head_row:[  //所有表头行共有的key值
        'name', //名称
        'col_width', //列宽（注意上行与下行的列宽要相等）
        'tr_high', // 行高
        'attribute', //属性
        'attribute_value' //属性值
    ],
    all_attribute: {   //所有清单表头共有的属性
        sys_order: {att_name: 'sys_order',zh:'系统序号列“sys_order”（用于系统的排序，导入导出时无需匹配）',value:null},
        sys_num: {att_name: 'sys_num',zh:'系统编号列“sys_num”（系统用于对清单编号去空格和中文符号的处理，导入导出时无需匹配）',value:null},
        formula: {att_name: 'formula',zh:'“formula”公式',value:'=H3-G2'},
        sum_text: {att_name: 'sum_text',zh:'系统默认的合计行-普通文本',value:'合计'},
        sum_null: {att_name: 'sum_null',zh:'系统默认的合计行-空文本',value:null},
        sum_formula: {att_name: 'sum_formula',zh:'系统默认的合计行-合计公式',value:'=SUM()'}
    },
    all_limit:[ //所有清单表头行限制限制属性的值
        {att_name: 'max',zh:'max最大值', value:null},
        {att_name: 'increasemax',zh:'increasemax增加的最大值', value:null},
        {att_name: 'decreasemax',zh:'decreasemax减少的最大值', value:'"CA14"'}
    ],
    t_orginal: {  // 原清单
        head_row:[  
            't_original_head_id', //原清单头id
        ],
        attribute:{ //属性及属性值
        }
    },
    t_change:{    //变更清单
        head_row:[
            't_change_head_id', //变更清单表头id
            'attribute_value_id', //对应原清单表头内容的id
            'limit', //限制 1、max最大值 2、increasemax增加的最大值 3、decreasemax减少的最大值
            'limit_value', // 3、“CA14”
            'limit_id' //对应原清单表头内容的id1、3 2、5 3、2
        ],
        attribute:{ //属性及属性值
            orginal: {att_name: 'orginal',zh:'“orginal”原清单',value:'CA14'},
            orginalnull: {att_name: 'orginalnull',zh:'“orginalnull”新清单（无对应）',value:null},
            change: {att_name: 'change',zh:'“change”变更清单',value:null},
        }

    },
    t_update:{    //变更后（新）清单
        head_row:[
            't_update_head_id', //变更后（新）清单表头id
            't_original_head_row_id' //原清单表头内容id
        ],
        attribute:{ //属性及属性值
        }

    },
    t_meterage:{    //计量清单
        head_row:[
            't_meterage_head_id', //原清单头id
            'attribute_value_id', //对应原清单表头内容的id
            'limit', //限制 1、max最大值 2、increasemax增加的最大值 3、decreasemax减少的最大值
            'limit_value', // 3、“CA14”
            'limit_id' //对应原清单表头内容的id1、3 2、5 3、2
        ],
        attribute:{ //属性及属性值
            update: {att_name: 'update',zh:'“update”新清单',value:'CA14'},
            updatenull: {att_name: 'updatenull',zh:'“updatenull”新清单（无对应）',value:null},
            meterage: {att_name: 'meterage',zh:'“meterage”变更清单',value:null},
        }
        
    },
    t_totalmeteragge:{    //累计计量清单
        head_row:[
            't_meterage_head_id', //原清单头id
            'attribute_value_id', //对应原清单表头内容的id
            'limit', //限制 1、max最大值 2、increasemax增加的最大值 3、decreasemax减少的最大值
            'limit_value', // 3、“CA14”
            'limit_id' //对应原清单表头内容的id1、3 2、5 3、2
        ],
        attribute:{ //属性及属性值
            update: {att_name: 'update',zh:'“update”新清单',value:'CA14'},
            updatenull: {att_name: 'updatenull',zh:'“updatenull”新清单（无对应）',value:null},
            meterage: {att_name: 'meterage',zh:'“meterage”变更清单',value:null},
            fluctuate: {att_name: 'fluctuate',zh:'“fluctuate”变更清单增减',value:'DC12'},
        }        
    },   
    t_pay:{    //支付清单
        head_row:[
            't_pay_head_id', //支付清单表头id
            'attribute_value_id', //对应新清单表头内容的id
            'limit', //限制 1、max最大值 2、increasemax增加的最大值 3、decreasemax减少的最大值
            'limit_value', // 3、“CA14”
            'limit_id' //对应原清单表头内容的id1、3 2、5 3、2
        ],
        attribute:{ //属性及属性值
            update: {att_name: 'update',zh:'“update”新清单',value:'CA14'},
            updatenull: {att_name: 'updatenull',zh:'“updatenull”新清单（无对应）',value:null},
            pay: {att_name: 'meterage',zh:'“pay”支付清单',value:null},
            fluctuate: {att_name: 'fluctuate',zh:'“fluctuate”变更清单增减',value:'DC12'},
        }        
    },  
    t_totalpay:{    //累计支付清单
        head_row:[
            't_totalpay_head_id', //支付清单表头id
            'attribute_value_id', //对应新清单表头内容的id
            'limit', //限制 1、max最大值 2、increasemax增加的最大值 3、decreasemax减少的最大值
            'limit_value', // 3、“CA14”
            'limit_id', //对应原清单表头内容的id1、3 2、5 3、2
            'update_time' //最新更新的时间
        ],
        attribute:{ //属性及属性值
            update: {att_name: 'update',zh:'“update”新清单',value:'CA14'},
            updatenull: {att_name: 'updatenull',zh:'“updatenull”新清单（无对应）',value:null},
            totalpay: {att_name: 'totalpay',zh:'“totalpay"累计支付清单',value:null},
            fluctuate: {att_name: 'fluctuate',zh:'“fluctuate”变更清单增减',value:'DC12'},
        }        
    }
}

/*
 组装各种清单数据
param arr: 表头基本数据
param type: 需要组装哪种类型的清单表头数据
return : 完整清单表头数据
 */
export default {
    Assemble (arr, type){ //组装数据函数
        //先组装公有清单类型数据
        let hd = Object.keys(arr[0])

        for (let index = 0; index < arr.length; index++) {
                
            for (let i = 0; i < hd.length; i++) {
                for (let e = 0; e < data.all_head_row.length; e++) {
                    arr[index][hd[i]][data.all_head_row[e]] =null;

                }
                
                
            }

        }
        return arr;
        //组装私有清单类型数据
    }

}
// module.exports = Assemble;