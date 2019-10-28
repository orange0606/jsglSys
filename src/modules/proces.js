import { MessageBox, Message, Switch } from 'element-ui'
let patt1=/[A-Z+]*/g,
patt2=/\d+/g,
excelmodel = {
    //表格读取处理函数============
    Imports(callback){
        // 通过DOM取文件数据
        this.file = event.currentTarget.files[0];
        let rABS = false, //是否将文件读取为二进制字符串
        f = this.file,
        reader = new FileReader(),
         _this = this;
        //if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function(f) {
            let binary = "",
            rABS = false, //是否将文件读取为二进制字符串
            // pt = this,
            wb, //读取完成的数据
            // outdata,
            reader = new FileReader();
            reader.onload = function(e) {
                let bytes = new Uint8Array(reader.result),
                length = bytes.byteLength;
                for(let i = 0; i < length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                let XLSX = require('xlsx');
                if(rABS) {
                    wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(binary, {
                        type: 'binary'
                    });
                }
                let persons = []   //数组  存储文件内的所有表数据
                for (let sheet in wb.Sheets) {
                    let perobj ={}
                    if (wb.Sheets.hasOwnProperty(sheet)) {
                    // console.log('wb.Sheets[sheet]')
                        // perobj.sheets = XLSX.utils.get_formulae(wb.Sheets[sheet]) //添加工作表的数据
                        perobj.sheets = wb.Sheets[sheet] //添加工作表的数据
                        perobj.ref= wb.Sheets[sheet]['!ref']  //添加表的单元格范围
                        // console.log('perobj.ref')
                        // console.log(perobj.ref)
                        if(wb.Sheets[sheet]['!merges']){    //检测该工作表有无单元格合并
                        perobj.merges = wb.Sheets[sheet]['!merges']   //添加单元格合并情况，是个数组
                        }else{
                        perobj.merges = null
                        }
                        persons.push(perobj)
                         break; //只需要单张工作表数据时才跳出循环
                    }
                }       
                // console.log(' excel文件中的所有表需要处理的数据persons')
                // console.log(persons)
                //最终处理的数据
                _this.Table(persons,data=>{
                    callback(data);
                })
                persons = null;
                perobj = null;
                reader = wb = null;
            //  console.log('表格导入的未经任何处理的原始数据')
            //  console.log(wb.Sheets[wb.SheetNames[0]]) //  为转换的原始数据，可作为提交或者另外处理
            }
            f?reader.readAsArrayBuffer(f):f;
        }
        if(rABS) {
            reader.readAsArrayBuffer(f);
        } else {
            reader.readAsBinaryString(f);
        }
        reader = f = null;

    },
    /*
    表头数据组装表格函数
    param list: 所有单元格基本数据(obj)
    param colLength: 需要组装多少列(int)
    param rowLength: 需要组装多少行(int)
    return : 完整表格数据
    */
    Package (list,colLength,rowLength){ 
        // let AZ = this.AZ();
        let arr = [];
        for (let i = 0; i < parseInt(rowLength); i++) { 
            arr[i]={}
            for (let j = 0; j < parseInt(colLength); j++) {
                arr[i][ABC[j]]=null;
            }  
        }
        for (let index = list.length-1; index >= 0; index--) {
            if (list[index].trNum && list[index].colNum) {
                let coll = list[index].colNum,
                row = list[index].trNum;  //行号
                // let col = ABC.indexOf(list[index].colNum); //列号A
                arr[row-1][coll] =list[index];
                arr[row-1][coll].edit = 'N'; //加入编辑状态
            
            }
        }
        return arr;
    },
    /*
    多级表头嵌套组装函数
    param arr: 已组装的表格数据(数组对象)
    return : 完整多级嵌套数据(已除去合并行)
    */
    Nesting (arr) {
        let arrHd = Object.keys(arr[0]);
        // let ABC = this.$excel.AZ();
        if (arr[0]) {
            let headers = [],
            arrlen =  arr.length -2;
            for (let index = arrlen; index >=0 ; index--) {
                let arrHdlen = arrHd.length;
                for (let i = 0; i < arrHdlen; i++) {  //添加第一层
                      if (index !=0) {
                          if (arr[index-1][arrHd[i]] && arr[index-1][arrHd[i]].tdRowspan !=0 && arr[index-1][arrHd[i]].tdColspan !=0) {
                              arr[index-1][arrHd[i]].children =[];
                              for (let e = 0; e < arrHd.length; e++) {
                                  if (arr[index][arrHd[e]] && arr[index][arrHd[e]].tdRowspan !=0 && arr[index][arrHd[e]].tdColspan !=0) {
                                      if ((arr[index][arrHd[e]].trNum == arr[index-1][arrHd[i]].trNum+1) && (arr[index][arrHd[e]].colNum == arr[index-1][arrHd[i]].colNum)) {
                                          arr[index-1][arrHd[i]].children.push(arr[index][arrHd[e]]) 
                                      }else if(arr[index-1][arrHd[i]].tdColspan > 1  && ABC.indexOf(arr[index][arrHd[e]].colNum) > ABC.indexOf(arr[index-1][arrHd[i]].colNum)){
                                            if (( ABC.indexOf(arr[index][arrHd[e]].colNum)-ABC.indexOf(arr[index-1][arrHd[i]].colNum) ) < arr[index-1][arrHd[i]].tdColspan) {
                                                arr[index-1][arrHd[i]].children.push(arr[index][arrHd[e]]) 
                                            }
                                          
                                      }
                                  }
                              }
                          }
                      }else{
                          if (arr[index][arrHd[i]] && arr[index][arrHd[i]].tdRowspan !=0 && arr[index][arrHd[i]].tdColspan !=0) {
                                headers.push(arr[index][arrHd[i]])
                          }
                      }
                    
                }
            }
        arrHd = arr = null;
        return headers;
        }
        
    },
     /*
    表头属性数据组装函数
    param list: 所有表头单元格单元格基本数据(obj)
    return : 完整表头数据
    */
    HeaderAtt (list) {
        list = [...list];
        let arr = [],
        listhd = Object.keys(list[0]),
        listhdlen = listhd.length;
        for (let index = 0; index < list.length; index++) {
            arr[index] = {};
            for (let i = 0; i < listhdlen; i++) {
                let arrObj = arr[index][listhd[i]] = list[index][listhd[i]];
                arrObj.name = null; //名称
                arrObj.col_width = 120; //列宽（注意上行与下行的列宽要相等）
                arrObj.colWdthProportion = null;//列宽比例
                arrObj.trHigh = 35; // 行高
                arrObj.trHighproportion = null;//行高比例
                arrObj.attribute = null; //属性
                arrObj.attributeValue = null; //属性值
                arrObj.textAlign = 'center'; //文本对齐对齐方式
                arrObj.attributeValueId = null; //属性值内容ID
                arrObj.limitId = null; //限制属性值内容ID
                arrObj.tLimit = null;    //限制值类型 
                arrObj.limitValue = null; //限制值
                // arrObj.attributeMeterageHeadId = null;                                    //id
                // arrObj.limitMeterageHeadId = null;
                // arrObj.attributePayHeadRowId = null;    //支付表头内容的id
                // arrObj.limitPayHeadRowId = null;        //支付表头内容的id
            }
        }
        return arr;
    },
    
    /*
    清单数据组装表格函数
    param list: 所有单元格基本数据(obj)
    return : 完整表格数据
    */
    ListAssemble (list){ 
        if (list == null || list.length ==0) {
            return [];
        }
        let arr = [];
        for (let index = list.length-1; index >= 0; index--) {
            let coll = list[index].colNum,
            col = ABC.indexOf(list[index].colNum), //列号A
            row = list[index].trNum;  //行号
            if (col>=0 && coll) {
                if (!arr[row-1]) {    //判断是否有这个下标,有的话直接添加数据
                    arr[row-1]= {};
                    arr[row-1][coll] =list[index];
                }else{ //无此下标，先创建
                    arr[row-1][coll] =list[index];
                }
                arr[row-1][coll].edit = 'N'; //加入编辑状态
            }
        };
        return arr;
    },
    /*
    清单数据解构函数
    param list: 表格所有基本数据(数组对象)
    return : 完整表格解构数据
    */
    Inventory (list, hdlen) {
        for (let index = 0; index < list.length; index++) {
            // list[index]
        }
    },
    filterStr (str) {  //去除空白以及特殊字符串
        str = str.replace(/\s*/g,"");
        let pattern = new RegExp("[`~!@#$^&（）|{}':;',\\[\\]<>?~！@#￥……&——|{}【】‘； = ”“'。，、？_]"), 
        strlen = str.length,
        specialStr = "";  
        for(let i=0;i<strlen;i++){  
            specialStr += str.substr(i, 1).replace(pattern, '');   
        }  
        return specialStr;  
    },
    /*
    公式解析化为可运算的字符串(新建表头时用)
    param str: 需要解析的字符串
    return : 完整表格解析完成的字符串
    */
    Analysis (str) {  //
        let patt1= /([A-Z]+)[A-Za-z0-9]*[0-9]+/g,
        patt2=/[A-Z+]*/g, //查找所有的大写字母，返回一个数组,
        patt3 = /[0-9]/,  //判断是否有数字
        patt4 = /[A-Z]/;
        str = this.filterStr(str);  //去除空格与特殊符号
        let arr = str.match(patt1);  // 这里将会得到一个数组['AAA3', 'A11', 'A111', 'A111']
        for (let i = 0; i < arr.length; i++) {
            let key = arr[i].match(patt2),
            arrlen = arr[i].length;
            for (let a = 0; a < str.length; a++) {
                let index = str.indexOf(arr[i],a);
                if ((str.length - index) < arrlen) break;
                if (index != -1) {
                    if (index == 0 && !patt3.test(str[index+arrlen])) {
                        str = str.slice(0, index)+key[0]+str.slice(index+arrlen);
                    }else if (index >= 1 && !patt4.test(str[index-1]) && !patt3.test(str[index+arrlen])) { //下标大于1时
                        str = str.slice(0, index)+key[0]+str.slice(index+arrlen);
                    }
                }
            }
        }
        return str;
    },

    /*
    表头数据解构函数
    param list: 表格所有基本数据(数组对象)
    return : 完整表格解构数据
    */
    Unpack (list) { //表格解构
        let headRowList = [],
        hd = Object.keys(list[0]);   //获取所有的列
        for (let index = list.length -1; index >=0; index--) {
            const hdlen = hd.length;
            for (let i = hd.length -1; i >= 0; i--) {
                let row = list[index][hd[i]];
                delete row.edit; //删除编辑状态
                delete row.id; //删除id
                row.trNum = index+1;
                if (row.attribute == 'formula' && row.attributeValue && row.attributeValue !='' ) {
                    row.headFormula = this.Analysis(row.attributeValue);
                    console.log(row.formula_col,'--------------判断公式对不对----------'+row.attributeValue)
                    console.log(row)
                }
                headRowList.push(row);
            }
        }
        // list = null;
        hd = null;
        return headRowList;
    },
    //封装遍历表格的所有的列 A-Z AA-AZ ...
    AZ () {
        let arr = [];
        for (let i = 0; i < 26; i++) {
            arr.push(String.fromCharCode((65 + i)))
            // console.log(String.fromCharCode((65 + i)))  
            // console.log(i)   
        }
        for (let j = 0; j < 26; j++) {
            for (let c = 0; c < 26; c++) {
                arr.push(arr[j]+String.fromCharCode((65 + c)))  
                // console.log(arr[j]+String.fromCharCode((65 + c)))
            }  
        }
        return arr;
    },
    Create(ref,callback){   //根据范围生成空数据
        // // 引入A-Z的所有列数组
        // index = this.AZ();
        if (!ref)return;
        let subs = ref.indexOf(':'),
        //先获取开始的列坐标
        
        start_c = ABC.indexOf(ref.substr(0,subs).match(patt1)[0])+1,
        //获取开始的行坐标
        start_r = ref.substr(0,subs).match(patt2)[0],
        //获取结束的列坐标
        end_c = ABC.indexOf(ref.substr(subs+1).match(patt1)[0])+1,
        //获取结束的行坐标
        end_r = ref.substr(subs+1).match(patt2)[0],

        // console.log('表格的的范围：  开始的列坐标是：',start_c,'  开始的行坐标是：',start_r)
        // console.log('表格的的范围：  结束的列坐标是：',end_c,'  结束的行坐标是：',end_r)
        //即将要生成多少列
        cos = end_c - start_c + 1,
        //即将要生成多少行
        row = end_r - start_r + 1,
        // console.log('即将要生成多少列:  ',cos,'   即将要生成多少行:  ',row)

        //生成空数据数组
        //key 为单元格所在位置例如A1，td 是单元格的值， formula为单元格公式，tdRowspan tdColspan 为单元格合并的列数与行数
        //edit  是单元格是否后需要打开编辑，0为无需，1为需要。
        arr = [];
        for (let i = 0; i < row; i++) { 
            arr[i]={}
            for (let j = 0; j < cos; j++) {
                arr[i][ABC[j]]={trNum:i+1, colNum:ABC[j], td:'', tdColspan:1, tdRowspan:1,edit:'N'}
            }
        }
        // console.log('已经生成的空数据')
        // console.log(arr)
        callback(arr)
        arr = null;
    },

    Table(arr,callback){    //表格完整数据生成函数
        let sheet=[]; //储存处理好的数据（二维数组）
        // console.log('arr')
        const arrlen = arr.length;
        for (let i = 0; i < arrlen; i++) {

            //调用生成工作表 i 空数据函数
            this.Create(arr[i].ref,data=>{

                for(let key in arr[i].sheets){ //遍历sheet对象键与键值，进行数据存储
                    //做优化，直接用下标来设置值
                    if (key !== '!ref' && key!== '!merges' && key !== '!margins' && key !=='!rows' && key != '!autofilter') {
                        try{
                            // console.log(arr[i].sheets[key])
                            let cos = ABC.indexOf(key.match(patt1)[0]),  //选择所有的大写字母进行查询当作列下标
                            row = parseInt(key.match(patt2)[0])-1,   //选择所有的数字,当作行下标
                            Td = arr[i].sheets[key].v;
                            
                            if (!Number.isNaN(Number(Td))) {
                                Td = this.Count(Td);
                            }
                            data[row][ABC[cos]].td = Td;   //给空数据加入真实的数据
                            
                        }
                        catch (e) {
                            Message({ message: `出错了啦啦啦${e}`, type: 'info', duration: 3000, showClose: true })
                        }
                        // data[row][cos].value = arr[i].sheets[key].w;    

                        // //若单元格有公式的话，对公式进行保存
                        // if (arr[i].sheets[key].f) {
                        //     data[row]['hd'+cos].formula = arr[i].sheets[key].f;
                        // }
                    }
                }
                // console.log('已注入数据')
                // console.log(data)

                //调用表格去除多余无值的行列
                this.Delete_R(data);
                this.Delete_C(data);

                //调用单元格合并信息函数
                this.Merge(arr[i].merges,data);

                //把数据添加到即将要回调的数组中
                sheet = data;
                data =null;
                // //把表头所有列信息提交到回调函数中
                // oktable.hd.push(Object.getOwnPropertyNames(data[0]))

            })         
        }
        // console.log('oktable')
        //最终生成好的数据
        callback(sheet);
        sheet =null;
    },
    Merge(arr,data){  //arr是合并信息 数组，data 是生成的数据
        // console.log('这里开始设置合并单元格啦')
        // console.log(arr[0])
        if(arr!=null){
            // console.log(arr)
            const arrlen = arr.length;
            for (let i = 0; i<arrlen;i++){
                //开始位置的列下标
                let st_c = parseInt(arr[i].s.c),

                //开始位置的行下标
                start_r = parseInt(arr[i].s.r),
                // console.log('开始的位置: ',start_c+`${start_r}`)
 
                //结束的列 - 开始的列 + 1 = 合并了多少列
                cos = parseInt(arr[i].e.c) - parseInt(arr[i].s.c) + 1,
                //结束的行 - 开始的行 + 1 = 合并了多少行
                row = parseInt(arr[i].e.r) - parseInt(arr[i].s.r) + 1,
                // console.log('合并了多少列 : ',cos,' cos.length','  合并了多少行 : ',row)
            

                //储存单元格合并,进行合并处理，添加合并数量
                hdobj = Object.keys(data[start_r]);  //储存第几行对象的所有属性名  返回的是个数组
                // if (data[start_r][hdobj[st_c]].key==(start_c+`${start_r+1}`)) {
                    data[start_r][hdobj[st_c]].tdColspan = cos;
                    data[start_r][hdobj[st_c]].tdRowspan = row;
                // }
                    // 标记需要清除数据的合并的单元格
                for (let a = 0; a< row; a++) {  
                        if (a==0) {
                            for(let b =1 ; b < cos; b++){
                                // data[start_r-1].splice(parseInt(arr[i].s.c)+1,cos-1);
                                if (data[start_r][hdobj[(parseInt(arr[i].s.c)+b)]]) {
                                    // console.log((parseInt(arr[i].s.c)+b))
                                    // console.log(data[start_r][hdobj[(parseInt(arr[i].s.c)+b)]])
                                    // data[start_r][hdobj[(parseInt(arr[i].s.c)+b)]].td =null;
                                    data[start_r][hdobj[(parseInt(arr[i].s.c)+b)]].tdRowspan =0;   //在饿了么单元格合并，被合并了的单元格需要设置为rowspan: 0, colspan: 0,  
                                    data[start_r][hdobj[(parseInt(arr[i].s.c)+b)]].tdColspan =0;
                                }
                                                         
                            }
                        }else{  //因为只保留最初始位置左上角的值，所以其他值都得删除掉
                            for(let b =0 ; b < cos; b++){
                                let num = (parseInt(arr[i].s.c)+b);
                                if (data[start_r+a]) {
                                    // data[start_r+a][hdobj[num]].td =null;
                                    data[start_r+a][hdobj[num]].tdRowspan =0;
                                    data[start_r+a][hdobj[num]].tdColspan =0;
                                }
                            }
                        } 
                }             
            }    
            // arr = hdobj = null;
            // //  对已经标记了合并需要删除的数组元素进行删除
            // for (let b = data.length-1; b >= 0; b--) {
            //     let hdobj = Object.keys(data[b]);
            //     for (let c =hdobj.length-1; c >= 0; c--) {
            //             if (data[b][hdobj[c]].dele==1) {
            //                 // data[b].splice(c,1);
            //                 delete data[b][hdobj[c]];
            //             }
            //     }
            // }         
        }

    },
    Delete_R(data){
        // console.log(data)
        let Rnum = 0;
        // 删除多余的行
        for (let index = data.length-1; index >= 0; index--) {
            let hdobj = Object.keys(data[index]).length;
            for (let r = 0; r < hdobj; r++) {
                // console.log('Object.keys(data[index]).length   '+Object.keys(data[index]).length+'      r : '+r+'    Rnum  :'+Rnum)
                if (data[index][ABC[r]].td === null && data[index][ABC[r]].tdRowspan === 1 && data[index][ABC[r]].tdColspan === 1) {
                    if (r== hdobj - 1) {
                        Rnum++;
                    }
                }else{
                    // console.log('检测到非空即停止') 
                    return data.length = data.length -Rnum;
                } 
            }  
        }
    },
    Delete_C (data){
        //删除多余的列
        //判断每行最少有几列是多余的,然后统一删除最少列的数量
        let Cnum = 0;
        for (let index = data.length-1; index >= 0; index--) {
            let num = 0,
            hdobj = Object.keys(data[index]);
            for (let r = hdobj.length-1; r >= 0; r--) {
                // console.log('r   '+r+'   length-   '+(Object.keys(data[index]).length-1)+'      num  :'+num)
                if (data[index][hdobj[r]].td === null && data[index][hdobj[r]].tdRowspan === 1 && data[index][hdobj[r]].tdColspan === 1) {
                    num++;
                }else{
                    if (index === data.length-1) {
                        Cnum = num;
                    }else{
                        if (Cnum > num) Cnum = num;
                    }
                    continue;                  
                } 
            } 
            hdobj = null; 
        }
        let dataleng = data.length;
        for (let index = 0; index < dataleng; index++) {
            let hdobj = Object.keys(data[index]);
            for (let c = 0; c < Cnum; c++) {
                // delete data[index]['hd'+(Object.keys(data[index]).length-1)];
                delete data[index][hdobj[(Object.keys(data[index]).length-1)]];
            }
            hdobj = null;
        }
    },
    BikoFoArr (col) {   //截取最后一层相对应的表头
        let obj = {};
        Biko(col);
        function Biko (colArr) { //表头尾行 真正显示对应列的数据
            for (let c = 0; c < colArr.length; c++) {
              if (colArr[c].children && colArr[c].children.length >0) {
                  Biko(colArr[c].children);
              }else{
                  obj[colArr[c].colNum] = colArr[c];
              }
            }
        }
        return obj;
    },
    /*
    公式解析(新建清单和预览清单时用)
    param col: 多级嵌套表头的数据   Array[ object ]
    return : 真正显示对应列的数据(object)
    */
    FormulaAnaly ( col ) {    //
        let patt1 = /([A-Z]+)[A-Za-z0-9]*[0-9]+/g,
        patt2 =/[A-Z+]*/g, //查找所有的大写字母，返回一个数组,
        patt3 = /[0-9]/,  //判断是否有数字
        patt4 = /[A-Z]/,
        Fobj = {},
        sumArr = this.BikoFoArr(col); //截取获取表格实际对应所有列的表头列 object
        let header = Object.keys(sumArr); //用来所需要的所有列(obj)（属性）名
        for (let index = 0; index < header.length; index++) {
            let sumRow = sumArr[header[index]];
            if (sumRow.attribute && sumRow.attribute === "formula" && sumRow.attributeValue && sumRow.attributeValue !="") {
                let str = sumRow.attributeValue;
                str = this.filterStr(str);  //去除空格与特殊符号
                let arr = str.match(patt1);  // 这里将会得到一个数组['AAA3', 'A11', 'A111', 'A111']
                for (let i = 0; i < arr.length; i++) {
                    let key = arr[i].match(patt2),
                    arrlen = arr[i].length;
                    for (let a = 0; a < str.length; a++) {
                        let index = str.indexOf(arr[i],a);
                        if ((str.length - index) < arrlen) break;
                        if (index !== -1) {
                            if (index === 0 && !patt3.test(str[index+arrlen])) {
                                str = str.slice(0, index)+`(row["${key[0]}"].td)*1`+str.slice(index+arrlen);
                            }else if (index >= 1 && !patt4.test(str[index-1]) && !patt3.test(str[index+arrlen])) { //下标大于1时
                                str = str.slice(0, index)+`(row["${key[0]}"].td)*1`+str.slice(index+arrlen);
                            }
                        }
                    }
                }
                Fobj[sumRow.colNum] = str;
            }      
        }
        return Fobj;
    },
    /*
    对数据进行公式计算(导入表格（与清单）时使用)
    param that: this指向组件内
    param list: 清单数据   Array[ object ]
    param formula: 存储相应列的eval 的字符串公式  object
    使用引用赋值
    */
    Formula (that, list, formula) { //表格载入时进行处理公式计算
        let formuHd = Object.keys(formula), //用来所需要的所有有公式的列(obj)（属性）名
        row = null,
        sum = null,
        evalSum = null,
        fhdlen = formuHd.length;
        try {
            for (let index = list.length - 1; index >= 0; index--) {  
                row = list[index];
                for (let a = fhdlen -1; a >= 0; a--) {
                    let rowTd = row[formuHd[a]].td;
                    if (rowTd !==null && rowTd !== '') break;  //不为空，马上跳出这个循环不进行计算
                    sum = formula[formuHd[a]];
                    evalSum = eval(sum);
                    if (evalSum) {
                        that.$set(row[formuHd[a]],'td',this.Count(evalSum));  //this.Count小数点精度计算 
                    }else{
                        that.$set(row[formuHd[a]],'td',0);
                    }
                }
                index === 0 ?Message({ message: `系统已为你计算完成`, type: 'success', duration: 3000, showClose: true }): index;
            }
        } catch (error) {
            console.log(error)
            return Message({ message: '这边出现了点问题，貌似是公式错误，建议请先去检查一下表头。再进行录入吧！', type: 'warning', duration: 3000, showClose: true });
        };
        fhdlen = formula = that = formuHd = evalSum = sum = row = null;
    },
    /*
    双击单元格修改数据进行公式计算(编辑表格（与清单）时使用)
    param lastHeader: 表头的最后一层 object
    param fkeys: 参数F （object）的所有属性
    param row: 清单数据行   object
    param col: 清单数据（该单元格内容）   object
    param F: 存储相应列的eval 的字符串公式  object
    使用引用赋值
    */
    Calculation (lastHeader, type, F, fkeys, row, col) { //单元格值发生改变后进行行公式计算
        if (col['id']) row['alter'] = 'Y';
        if (Number.isNaN(Number(col['td']))) {
            // col['td'] = 0;
            col['td'] = this.filterStr(col['td']); //去除多余特殊字符串
            return false;
        }
        col['td'] = this.Count(col['td']);   //调用精度计算小数点处理
        let that = this;

        Object.keys(lastHeader).forEach(function(key){
            let keyObj = lastHeader[key],
            Att = keyObj.attribute,
            AttVal = keyObj.attributeValue;
            //  console.log('attributeValue');
            //  console.log(AttVal);
            if ( Att && ( Att==='fluctuate' || Att==='meterage' || Att==='pay') && AttVal && AttVal !=='') {
                // console.log('AttVal----------------2222222222222')
                // console.log(AttVal)
                let colTr = AttVal.match(patt1)[0];   //属性值  列号
                let sumNb = null;
                switch (type) {
                   
                    case 'change':
                        Object.keys(lastHeader).forEach(function(key){
                            let chkeyObj = lastHeader[key],
                            chAtt = chkeyObj.attribute,
                            chAttVal = chkeyObj.attributeValue;
                            // console.log('attributeValue');
                            // console.log(chAttVal);
                            if ( chAtt && chAtt==='totalchange-change'  && chAttVal && chAttVal !=='') {
                                // console.log('AttVal----------------333333333333333')
                                // console.log(chAttVal)
                                let chcolTr = chAttVal.match(patt1)[0];   //属性值  列号
                                if (chcolTr === col.colNum) {
                                    sumNb = that.Count(row[chkeyObj.colNum]['td']*1+ col['td']*1);
                                    // let summmm = (row[colTr]['td']*1)+(sumNb*1);

                                        // console.log(row[chkeyObj.colNum]['td']*1,'  row[chkeyObj.colNum]  ', col['td']*1)
                                        // console.log('row[colTr]------------',row[colTr]['td'])
                                        // console.log('本期计量和上期计量数量  ：'+sumNb)
                                        // console.log('原数量  ：'+row[colTr]['td']*1)
                                        // console.log('本期计量和上期计量数量 + 原数量  ：'+summmm)
                                    if ( ((row[colTr]['td']*1)+(sumNb*1)) <0 ){
                                        Message({ message: '警告 总数量不能低于0! 已为您重新调整，您可以再次修改。', type: 'warning', duration: 4000, showClose: true });
                                        col['td'] = 0-(row[colTr].td-row[chkeyObj.colNum]['td']);
                                    }
                                }
                            }
                        });
                        break;
                    case 'meterage':
                        Object.keys(lastHeader).forEach(function(key){
                            let mekeyObj = lastHeader[key],
                            meAtt = mekeyObj.attribute,
                            meAttVal = mekeyObj.attributeValue;
                            // console.log('attributeValue');
                            // console.log(meAttVal);
                            // console.log('meAtt-------------');
                            console.log(meAtt);
                            if ( meAtt && meAtt==='totalmeterage-meterage'  && meAttVal && meAttVal !=='') {

                                let mecolTr = meAttVal.match(patt1)[0];   //属性值  列号
                                if (mecolTr === col.colNum) {
                                    sumNb = that.Count(row[mekeyObj.colNum]['td']*1+ col['td']*1);
                                        // console.log(row[mekeyObj.colNum]['td']*1,'  row[mekeyObj.colNum]  ', col['td']*1)
                                        // console.log('row[colTr]------------',row[colTr]['td'])
                                    if (sumNb>row[colTr]['td']*1 ){
                                        Message({ message: '警告 上期累计数量与本期数量的和不能超过原数量! 已为您重新调整，您可以再次修改。', type: 'warning', duration: 4000, showClose: true });
                                        col['td'] = row[colTr].td-row[mekeyObj.colNum]['td'];
                                    }
                                    if (((row[colTr]['td']*1)+(sumNb*1)) <0 ){
                                        Message({ message: '警告 总数量不能低于0! 已为您重新调整，您可以再次修改。', type: 'warning', duration: 4000, showClose: true });
                                        col['td'] = 0-(row[colTr].td-row[mekeyObj.colNum]['td']);
                                    }
                                }
                            }
                        });
                        break;
    
                    case 'pay':
                            Object.keys(lastHeader).forEach(function(key){
                               let paykeyObj = lastHeader[key],
                               payAtt =paykeyObj.attribute,
                               payAttVal =paykeyObj.attributeValue;
                                // console.log('attributeValue');
                                // console.log(payAttVal);
                                if (payAtt &&payAtt==='totalpay-pay'  &&payAttVal &&payAttVal !=='') {
                                    // console.log('AttVal----------------4444444444444444444')
                                    // console.log(payAttVal)
                                    let paycolTr =payAttVal.match(patt1)[0];   //属性值  列号
                                    if (paycolTr === col.colNum) {
                                        sumNb = that.Count(row[paykeyObj.colNum]['td']*1+ col['td']*1);
                                            // console.log(row[paykeyObj.colNum]['td']*1,'  row[mekeyObj.colNum]  ', col['td']*1)
                                            // console.log('row[colTr]------------',row[colTr]['td'])
                                        if (sumNb>row[colTr]['td']*1 ){
                                            col['td'] = row[colTr].td-row[paykeyObj.colNum]['td'];
                                            Message({ message: '警告 本期支付金额与上期累计支付金额的和不能超过累计计量金额! 已为您重新调整，您可以再次修改。', type: 'warning', duration: 4000, showClose: true });
                                        }
                                        if (((row[colTr]['td']*1)+(sumNb*1)) <0 ){
                                            Message({ message: '警告 总数量不能低于0! 已为您重新调整，您可以再次修改。', type: 'warning', duration: 4000, showClose: true });
                                            col['td'] = 0-(row[colTr].td-row[paykeyObj.colNum]['td']);
                                        }
                                    }
                                }
                            });
                        break;
                }
            }
        });

        let Eval = null,
        fkeyslen = fkeys.length;
        try {
            for (let index = 0; index < fkeyslen; index++) {
                Eval = eval(F[fkeys[index]]);
                if (Eval) {
                    row[fkeys[index]].td = this.Count(Eval);   //调用精度计算小数点处理
                }else{
                    row[fkeys[index]].td = 0;
                }
            }
        } catch (error) {
            console.log(error);
            return Message({ message: '这边出现了点问题，貌似是公式错误，请先去检查一下表头。再进行录入吧！', type: 'warning', duration: 3000, showClose: true });
        }
        //此处做一个修改单元格标记col['alter'] = 'Y' 代表此单元格修改过
        // if (col['id']) col['alter'] = 'Y';
        
        console.log('代表此单元格修改过')
        // console.log(row)
        // console.log(col)
        F = fkeys = row = col = Eval = null;
    },
    getSummaries (PackHeader, list, param) {  //合计
        // console.log('是不是每次都进来了呀'+Math.random()*100)
        let { columns, data } = param,
        sums = [],
        sumArr = PackHeader.slice(-1), //截取合计尾行
        header = Object.keys(PackHeader[0]), //用来所需要的所有列(obj)（属性）名
        TotalObj = {},
        Total = [],
        listlen = list.length;
        for (let i = header.length - 1; i >= 0; i--) {
            let sum = sumArr[0][header[i]];
            if (sum.attribute && sum.attribute === 'sumFormula') {
                Total.push(sum.colNum);
            }
        }
        for (let a = Total.length -1; a >= 0 ; a--) {
            let num = 0;
            for (let index = listlen - 1; index >= 0; index--) {
                // let Tdnum =  Number(list[index][Total[a]].td);
                // num += Number.isNaN(Tdnum)?0:Tdnum;
                num += list[index][Total[a]].td*1;
            }
            TotalObj[Total[a]+'.td'] = this.Count(num); //调用小数点精度计算
        }
        columns.forEach((column, index) => {
        // console.log(column.property);
            if (index === 0) {
                sums[index] = '合计';
                return;
            }else if(index >2){
                sums[index] = TotalObj[column.property];
            }
        })
        sumArr = header = TotalObj = Total = null;
        return sums;
    },
    Count (result) {    //js精度计算
        if(result.toString().match(/\.\d\d\d99/) && result.toString().match(/\.\d\d\d99/).length>0){
            result=Math.round(result*1000)/1000;    
        }
        result=Math.round(result*100)/100;
        result=result.toString().replace(/\.0+$/g,'');
        return result;
    },
    randomkey () {    //el-table-column 的key值 用于表头错乱修正
        function S4() {
          return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        // console.log((S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()));
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },

    /*
    选择表头限制  （新建各种清单时对表头列表可选择的表头作限制）
    param type: 清单（表头类型） str
    param list: 清单列表 （Array）
    param hdlist: 可选择的表头列表 （Array）
    使用引用赋值
    */
    limitHeader(type, list, hdlist) {
        if (!type || type==='' || !list || !list.length || list.length===0 || !hdlist || !hdlist.length || hdlist.length===0 ) return false;
        for (let index = list.length-1; index >= 0; index--) {
            let item = list[index][type+'HeadId'];
            for (let i = hdlist.length-1; i >= 0; i--) {
                if (item === hdlist[i]['id']) {
                    hdlist[i].limit=true;
                    break;
                }
            }
        }
    },
     /*
    通过判断 列lable名 进行动态设置宽度
    param name: 清单（表头类型） str
    param hd: 清单（表头所有列） Array
    作用是通过判断列 lable的文字 与表头的列数来给定最小宽度与最大宽度
    */
    Setwidth(name, hd) {
        if (!hd && name.indexOf('名')!== -1) {
            console.log('进来了呀')
            return '350';
        }if (!hd && name.indexOf('名')=== -1) {
            return ''
        }
        if (hd.length <= 7) {
            return '';
        }
        if (name.indexOf('数量')!== -1) {
            return '100'
        }
        if (name.indexOf('数')!== -1 && name.indexOf('量')!== -1 ) {
            return '100'
        }
        if (name.indexOf('单位')!== -1) {
            return '60'
        }
        if (name.indexOf('计量')!== -1) {
            return '100'
        }
        if (name.indexOf('价')!== -1 || name.indexOf('元')!== -1 || name.indexOf('金额')!== -1 || name.indexOf('合计')!== -1 || name.indexOf('费')!== -1) {
            return '100'
        }
        if (name.indexOf('号')!== -1) {
            return '100'
        }
        return ''
    }

};
let ABC =excelmodel.AZ();

// export { AZ,Table }
module.exports = excelmodel;