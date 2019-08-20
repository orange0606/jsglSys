
const data = {
    /*
        原清单、变更清单，、计量清单、累计计量清单、支付清单，累计支付清单
    */
//    'update'变更后的（新）清单,
    all_headname:['original', 'change', 'meterage', 'totalmeterage', 'pay', 'totalpay'],  
    // all_head:{  //所有清单表头字段
    //     tenderId : null, //标段id
    //     sysOrder : null, //系统序号，用于排序
    //     sysNum : null, // 系统编号，用于处理清单编号的去空格、转换中文符号为英文等。
    //     num : null, //表头编号
    //     name : null, //表头名称
    //     type : null, //清单类别
    //     tOriginalHeadId:null,//原清单id 
    // },
    all_head_row:[  //所有表头行共有的key值
        'name', //名称
        'colWidth', //列宽（注意上行与下行的列宽要相等）
        'colWdthProportion',//列宽比例
        'trHigh', // 行高
        'trHighproportion',//行高比例
        'attribute', //属性
        'attributeValue', //属性值
        'textAlign', //文本对齐对齐方式
        'tOriginalHeadRowId', //原清单表头内容ID
        'tUpdateHeadRowId', //变更后新清单表头内容ID
        'tLimit',    //限制值类型 int
        'limitValue', //限制值
    ],
    all_attribute: [   //所有清单表头共有的属性
        {att_name: 'sysOrder',zh:'系统序号列“sysOrder”（用于系统的排序，导入导出时无需匹配）',value:null,if:false,no:1},
        {att_name: 'sysNum',zh:'系统编号列“sysNum”（系统用于对清单编号去空格和中文符号的处理，导入导出时无需匹配）',value:null,if:false,no:1},
        {att_name: 'formula',zh:'“formula”公式',value:'=H3-G2',if:true,no:1},
        {att_name: 'sumText',zh:'系统默认的合计行-普通文本',value:'合计',if:true,no:1},
        {att_name: 'sumNull',zh:'系统默认的合计行-空文本',value:null,if:false,no:1},
        {att_name: 'sumFormula',zh:'系统默认的合计行-合计公式',value:'=SUM()',if:true,no:1}
    ],
    all_limit:[ //所有清单表头行限制限制属性的值
        {att_name: 'null',zh:'无', value:null,if:true},
        {att_name: 'max',zh:'max最大值', value:1,if:false},
        {att_name: 'increaseMax',zh:'increasemax增加的最大值', value:2,if:false},
        {att_name: 'decreaseMax',zh:'decreasemax减少的最大值', value:3,if:true},
    ],
    original: {  // 原清单
        attribute:[ //属性及属性值
            {att_name: 'originalNull',zh:'“originalnull”原清单（无对应）',value:null,if:false},
        ]
    },
    change:{    //变更清单
        attribute:[ //属性及属性值
            {att_name: 'original',zh:'“original”原清单',value:'CA14',if:true},
            {att_name: 'originalNull',zh:'“originalnull”新清单（无对应）',value:null,if:false},
            {att_name: 'change',zh:'“change”变更清单',value:null,if:false},
            {att_name: 'fluctuate',zh:'“fluctuate”变更清单增减',value:'DC12',if:true},
        ]

    },
    // update:{    //变更后（新）清单
    //     attribute:[ //属性及属性值
    //     ]

    // },
    meterage:{    //计量清单
        attribute:[ //属性及属性值
            {att_name: 'update',zh:'“update”新清单',value:'CA14',if:true},
            {att_name: 'updateNull',zh:'“updatenull”新清单（无对应）',value:null,if:false},
            {att_name: 'meterage',zh:'“meterage”计量清单',value:null,if:false},
            {att_name: 'totalmeterage-meterage',zh:'累计计量对应的计量清单',value:"H4",if:false},
        ]
        
    },
    totalmeterage:{    //累计计量清单
        attribute:[ //属性及属性值
            {att_name: 'update',zh:'“update”新清单',value:'CA14',if:true},
            {att_name: 'updateNull',zh:'“updatenull”新清单（无对应）',value:null,if:false},
            {att_name: 'meterage',zh:'“meterage”变更清单',value:null,if:false},
            {att_name: 'fluctuate',zh:'“fluctuate”变更清单增减',value:'DC12',if:true},
        ]        
    },   
    pay:{    //支付清单
        attribute:[ //属性及属性值
            {att_name: 'update',zh:'“update”新清单',value:'CA14',if:true},
            {att_name: 'updateNull',zh:'“updatenull”新清单（无对应）',value:null, if:false},
            {att_name: 'meterage',zh:'“pay”支付清单',value:null, if:false},
            {att_name: 'fluctuate',zh:'“fluctuate”变更清单增减',value:'DC12',if:true},
        ]        
    },  
    totalpay:{    //累计支付清单
        attribute:[ //属性及属性值
            {att_name: 'update',zh:'“update”新清单',value:'CA14',if:true},
            {att_name: 'updateNull',zh:'“updatenull”新清单（无对应）',value:null,if:false},
            {att_name: 'totalPay',zh:'“totalpay"累计支付清单',value:null,if:false},
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
        
        let attr = data.all_head_row; //合并共有属性和私有属性数组
        // console.log('打印一下组装属性数据的arr')
        // console.log('有没有到这里啊  ')

        if (arr!=null ) {    //     
        // console.log(arr.length,arr)

            let hd = Object.keys(arr[0]);   //获取所有的列
            for (let index = 0; index < arr.length; index++) { 
                for (let i = 0; i < hd.length; i++) {  
                    for (let e = 0; e < attr.length; e++) {    
                        if (attr[e] =='colWidth') {        //设置单元格默认宽高
                            arr[index][hd[i]][attr[e]] =80;
                        }else if(attr[e] =='trHigh'){
                            arr[index][hd[i]][attr[e]] =35;        
                        }else if(attr[e] == 'textAlign'){  //默认居中文字
                            arr[index][hd[i]][attr[e]] ='center';
                        }else{
                            arr[index][hd[i]][attr[e]] =null;   //把合并的属性一起注入数据
                        }  
                    } 

                }
            }
        }
        Arr.sheet = arr;
        Arr.attribute = data[type].attribute.concat(data.all_attribute)
        // Arr.attribute = Object.assign(data[type].attribute,data.all_attribute);  //合并共有特殊属性以及私有特殊属性对象一起注入数据

        // if (data[type].head_row.indexOf("limit") !=-1) {    //先判断这个类型清单表头有无限制属性，无则不添加
        Arr.limit = data.all_limit;
        // }
        
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
    // deepcopy(obj){
    //     var newobj = {};
    //     for(arr in obj){
    //         if (typeof obj[arr]==='object' && obj[arr] !== null) {
    //             newobj[arr] = deepcopy(obj[arr]); //递归，核心代码
    //         } else {
    //             newobj[arr] = obj[arr];
    //         }
    //     }
    //     return newobj;
    // }
    badge_name:{
        sysOrder:'序号',
        sysNum:'编号',
        formula:'公式',
        sumText:'合计（普通）',
        sumNull:'合计（空）',
        sumFormula:'合计（公式）',
        original:'原清单',
        originalNull:'新清单（无）',
        change:'变更清单',
        update:'新清单',
        updateNull:'新清单（无）',
        meterage:'变更清单？',
        fluctuate:'变更清单（变更清单增减）',
        totalpay:'累计支付清单',
        '1':'max', //max
        '2':'增加MAX',  //increaseMax
        '3':'减少MAX' //decreaseMax
    }

}
// module.exports = Assemble;