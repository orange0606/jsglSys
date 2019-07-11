
const data = {
    /*
        原清单、变更清单，变更后的（新）清单、计量清单、累计计量清单、支付清单，累计支付清单
    */
    all_headname:['orginal', 'change', 'update', 'meterage', 'totalmeteragge', 'pay', 'totalpay'],  
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
        'attribute_value', //属性值
        'id'
    ],
    all_attribute: [   //所有清单表头共有的属性
        {att_name: 'sys_order',zh:'系统序号列“sys_order”（用于系统的排序，导入导出时无需匹配）',value:null,if:false},
        {att_name: 'sys_num',zh:'系统编号列“sys_num”（系统用于对清单编号去空格和中文符号的处理，导入导出时无需匹配）',value:null,if:false},
        {att_name: 'formula',zh:'“formula”公式',value:'=H3-G2',if:true,if:false},
        {att_name: 'sum_text',zh:'系统默认的合计行-普通文本',value:'合计',if:true},
        {att_name: 'sum_null',zh:'系统默认的合计行-空文本',value:null,if:false},
        {att_name: 'sum_formula',zh:'系统默认的合计行-合计公式',value:'=SUM()',if:true}
    ],
    all_limit:[ //所有清单表头行限制限制属性的值
        {att_name: 'max',zh:'max最大值', value:null,if:false},
        {att_name: 'increasemax',zh:'increasemax增加的最大值', value:null,if:false},
        {att_name: 'decreasemax',zh:'decreasemax减少的最大值', value:'"CA14"',if:true}
    ],
    orginal: {  // 原清单
        head_row:[  
            't_original_head_id', //原清单头id
        ],
        attribute:[ //属性及属性值
        ]
    },
    change:{    //变更清单
        head_row:[
            't_change_head_id', //变更清单表头id
            'attribute_value_id', //对应原清单表头内容的id
            'limit', //限制 1、max最大值 2、increasemax增加的最大值 3、decreasemax减少的最大值
            'limit_value', // 3、“CA14”
            'limit_id' //对应原清单表头内容的id1、3 2、5 3、2
        ],
        attribute:[ //属性及属性值
            {att_name: 'orginal',zh:'“orginal”原清单',value:'CA14',if:true,if:false},
            {att_name: 'orginalnull',zh:'“orginalnull”新清单（无对应）',value:null,if:false},
            {att_name: 'change',zh:'“change”变更清单',value:null,if:false},
        ]

    },
    update:{    //变更后（新）清单
        head_row:[
            't_update_head_id', //变更后（新）清单表头id
            't_original_head_row_id' //原清单表头内容id
        ],
        attribute:[ //属性及属性值
        ]

    },
    meterage:{    //计量清单
        head_row:[
            't_meterage_head_id', //原清单头id
            'attribute_value_id', //对应原清单表头内容的id
            'limit', //限制 1、max最大值 2、increasemax增加的最大值 3、decreasemax减少的最大值
            'limit_value', // 3、“CA14”
            'limit_id' //对应原清单表头内容的id1、3 2、5 3、2
        ],
        attribute:[ //属性及属性值
            {att_name: 'update',zh:'“update”新清单',value:'CA14',if:true},
            {att_name: 'updatenull',zh:'“updatenull”新清单（无对应）',value:null,if:false},
            {att_name: 'meterage',zh:'“meterage”变更清单',value:null,if:false},
        ]
        
    },
    totalmeteragge:{    //累计计量清单
        head_row:[
            't_meterage_head_id', //原清单头id
            'attribute_value_id', //对应原清单表头内容的id
            'limit', //限制 1、max最大值 2、increasemax增加的最大值 3、decreasemax减少的最大值
            'limit_value', // 3、“CA14”
            'limit_id' //对应原清单表头内容的id1、3 2、5 3、2
        ],
        attribute:[ //属性及属性值
            {att_name: 'update',zh:'“update”新清单',value:'CA14',if:true},
            {att_name: 'updatenull',zh:'“updatenull”新清单（无对应）',value:null,if:false},
            {att_name: 'meterage',zh:'“meterage”变更清单',value:null,if:false},
            {att_name: 'fluctuate',zh:'“fluctuate”变更清单增减',value:'DC12',if:true},
        ]        
    },   
    pay:{    //支付清单
        head_row:[
            't_pay_head_id', //支付清单表头id
            'attribute_value_id', //对应新清单表头内容的id
            'limit', //限制 1、max最大值 2、increasemax增加的最大值 3、decreasemax减少的最大值
            'limit_value', // 3、“CA14”
            'limit_id' //对应原清单表头内容的id1、3 2、5 3、2
        ],
        attribute:[ //属性及属性值
            {att_name: 'update',zh:'“update”新清单',value:'CA14',if:true},
            {att_name: 'updatenull',zh:'“updatenull”新清单（无对应）',value:null, if:false},
            {att_name: 'meterage',zh:'“pay”支付清单',value:null, if:false},
            {att_name: 'fluctuate',zh:'“fluctuate”变更清单增减',value:'DC12',if:true},
        ]        
    },  
    totalpay:{    //累计支付清单
        head_row:[
            't_totalpay_head_id', //支付清单表头id
            'attribute_value_id', //对应新清单表头内容的id
            'limit', //限制 1、max最大值 2、increasemax增加的最大值 3、decreasemax减少的最大值
            'limit_value', // 3、“CA14”
            'limit_id', //对应原清单表头内容的id1、3 2、5 3、2
            'update_time' //最新更新的时间
        ],
        attribute:[ //属性及属性值
            {att_name: 'update',zh:'“update”新清单',value:'CA14',if:true},
            {att_name: 'updatenull',zh:'“updatenull”新清单（无对应）',value:null,if:false},
            {att_name: 'totalpay',zh:'“totalpay"累计支付清单',value:null,if:false},
            {att_name: 'fluctuate',zh:'“fluctuate”变更清单增减',value:'DC12', if:true},
        ]        
    }
}



/*
 组装各种清单数据
param arr: 表头基本数据(array)
param type: 需要组装哪种类型的清单表头数据(string)
return : 完整清单表头数据
 */
export default {
    Assemble (arr, type){ //组装数据函数
        let Arr = { sheet:null, attribute: null,limit: null};        
        // type =data.all_headname[4];
        // var arr = objDeepCopy(Arrays);
        //先组装公有清单类型数据
        let hd = Object.keys(arr[0]);   //获取所有的列
        let attr = data.all_head_row.concat(data[type].head_row); //合并共有属性和私有属性数组

        for (let index = 0; index < arr.length; index++) { 
            for (let i = 0; i < hd.length; i++) {  
                for (let e = 0; e < attr.length; e++) {    
                    if (attr[e] =='col_width') {        //设置单元格默认宽高
                        arr[index][hd[i]][attr[e]] =80;
                    }else if(attr[e] =='tr_high'){
                        arr[index][hd[i]][attr[e]] =25;
                    }else{
                        arr[index][hd[i]][attr[e]] =null;   //把合并的属性一起注入数据
                    }
                    
                    
                    
                } 

            }
        }
        
        Arr.attribute = data[type].attribute.concat(data.all_attribute)
        // Arr.attribute = Object.assign(data[type].attribute,data.all_attribute);  //合并共有特殊属性以及私有特殊属性对象一起注入数据

        if (data[type].head_row.indexOf("limit") !=-1) {    //先判断这个类型清单表头有无限制属性，无则不添加
            Arr.limit = data.all_limit;
        }
        Arr.sheet = arr;
        console.log('重新组装好的数据')
        console.log(Arr)
        return Arr;
        //组装私有清单类型数据
    },

        /*
    深拷贝多层数组对象
    param obj:  Object
    return : 深拷贝后的数组对象
    */
    deepcopy(obj){
        var newobj = {};
        for(arr in obj){
            if (typeof obj[arr]==='object' && obj[arr] !== null) {
                newobj[arr] = deepcopy(obj[arr]); //递归，核心代码
            } else {
                newobj[arr] = obj[arr];
            }
        }
        return newobj;
    }

}
// module.exports = Assemble;