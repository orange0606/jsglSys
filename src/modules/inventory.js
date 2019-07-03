var myModule = {
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
    orginal: {
        head_row:[  // 原清单
            't_original_head_id', //原清单头id
            'name', //名称
            'col_width', //列宽（注意上行与下行的列宽要相等）
            'tr_high', // 行高
            'attribute', //属性
            'attribute_value' //属性值
        ],
        attribute:[ //属性及属性值
            {att_name: 'sys_order',zh:'系统序号列“sys_order”（用于系统的排序，导入导出时无需匹配）',value:null},
            {att_name: 'sys_num',zh:'系统编号列“sys_num”（系统用于对清单编号去空格和中文符号的处理，导入导出时无需匹配）',value:null},
            {att_name: 'formula',zh:'“formula”公式',value:'=H3-G2'},
            {att_name: 'sum_text',zh:'系统默认的合计行-普通文本',value:'合计'},
            {att_name: 'sum_null',zh:'系统默认的合计行-空文本',value:null},
            {att_name: 'sum_formula',zh:'系统默认的合计行-合计公式',value:'=SUM()'}
        ]
    },
    change:{    //变更清单
        head_row:[
            't_change_head_id', //原清单头id
            'name', //名称
            'col_width', //列宽（注意上行与下行的列宽要相等）
            'tr_high', // 行高
            'attribute', //属性
            'attribute_value', //属性值
            'attribute_value_id', //对应原清单表头内容的id
            'limit', //限制 1、max最大值 2、increasemax增加的最大值 3、decreasemax减少的最大值
            'limit_value', // 3、“CA14”
            'limit_id' //对应原清单表头内容的id1、3 2、5 3、2
        ],
        attribute:[ //属性及属性值
            {att_name: 'sys_order',zh:'系统序号列“sys_order”（用于系统的排序，导入导出时无需匹配）',value:null},
            {att_name: 'sys_num',zh:'系统编号列“sys_num”（系统用于对清单编号去空格和中文符号的处理，导入导出时无需匹配）',value:null},
            {att_name: 'orginal',zh:'“orginal”原清单',value:'CA14'},
            {att_name: 'orginalnull',zh:'系统默认的合计行-普通文本',value:null},
            {att_name: 'change',zh:'“change”变更清单',value:null},
            {att_name: 'formula',zh:'“formula”公式',value:'=H3-G2'},
            {att_name: 'sum_text',zh:'系统默认的合计行-普通文本',value:'合计'},
            {att_name: 'sum_null',zh:'系统默认的合计行-空文本',value:null},
            {att_name: 'sum_formula',zh:'系统默认的合计行-合计公式',value:'=SUM()'}
        ],
        limit:[ //限制
            {att_name: 'max',zh:'max最大值', value:null},
            {att_name: 'max',zh:'increasemax增加的最大值', value:null},
            {att_name: 'max',zh:'decreasemax减少的最大值', value:'"CA14"'}
        ]
        
    },

    var2: 2,
    func1: function(){
        
    },
    func2: function(){
    }
}
module.exports = myModule;