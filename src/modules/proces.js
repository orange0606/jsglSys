import { MessageBox, Message } from 'element-ui'
let patt1=/[A-Z+]*/g;
let patt2=/\d+/g;


let excelmodel = {

    //表格读取处理函数============
    Imports(callback){


        let _this = this;
        // 通过DOM取文件数据
        this.file = event.currentTarget.files[0];
        var rABS = false; //是否将文件读取为二进制字符串
        var f = this.file;
        var reader = new FileReader();
        //if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function(f) {
            var binary = "";
            var rABS = false; //是否将文件读取为二进制字符串
            // var pt = this;
            var wb; //读取完成的数据
            // var outdata;
            var reader = new FileReader();
            reader.onload = function(e) {
                var bytes = new Uint8Array(reader.result);
                var length = bytes.byteLength;
                for(var i = 0; i < length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                var XLSX = require('xlsx');
                if(rABS) {
                    wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(binary, {
                        type: 'binary'
                    });
                }
                var persons = []   //数组  存储文件内的所有表数据
                for (var sheet in wb.Sheets) {
                    var perobj ={}
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
    param colLength: 需要组装多少列(string,int)
    param rowLength: 需要组装多少行(string,int)
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
        for (let index = 0; index < list.length; index++) {
            if (list[index].trNum && list[index].colNum) {
                let coll = list[index].colNum;
                let row = list[index].trNum;  //行号
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
            let headers = [];
            let arrlen = (arr.length)-2;
            for (let index = arrlen; index >=0 ; index--) {
                let arrHdlen = arrHd.length;
                for (let i = 0; i < arrHdlen; i++) {  //添加第一层
                      if (index !=0) {
                          if (arr[index-1][arrHd[i]] && arr[index-1][arrHd[i]].tdRowspan !=0 && arr[index-1][arrHd[i]].tdColspan !=0) {
                              arr[index-1][arrHd[i]].children =new Array();
                              for (let e = 0; e < arrHd.length; e++) {
                                  if (arr[index][arrHd[e]] && arr[index][arrHd[e]].tdRowspan !=0 && arr[index][arrHd[e]].tdColspan !=0) {
                                      if ((arr[index][arrHd[e]].trNum == arr[index-1][arrHd[i]].trNum+1) && (arr[index][arrHd[e]].colNum == arr[index-1][arrHd[i]].colNum)) {
                                          arr[index-1][arrHd[i]].children.push(arr[index][arrHd[e]]) 
                                      }else if(arr[index-1][arrHd[i]].tdColspan > 1  && ABC.indexOf(arr[index][arrHd[e]].colNum) > ABC.indexOf(arr[index-1][arrHd[i]].colNum)){
                                          arr[index-1][arrHd[i]].children.push(arr[index][arrHd[e]]) 
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
    清单数据组装表格函数
    param list: 所有单元格基本数据(obj)
    return : 完整表格数据
    */
   ListAssemble (list){ 
       let i =0;
        let arr = [];
        for (let index = list.length-1; index >= 0; index--) {
            let coll = list[index].colNum;
            let col = ABC.indexOf(list[index].colNum); //列号A
            let row = list[index].trNum;  //行号
            if (col>=0 && coll) {
                if (!arr[row-1]) {    //判断是否有这个下标,有的话直接添加数据
                    arr[row-1]= new Object();
                    arr[row-1][coll] =list[index];
                }else{ //无此下标，先创建
                    arr[row-1][coll] =list[index];
                }
                arr[row-1][coll].edit = 'N'; //加入编辑状态
            }
        };
        for (let index = arr.length-1; index >= 0; index--) {
            if (!arr[index]) {
                arr.splice(index,1)
            }
        }
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

    /*
    表头数据解构函数
    param list: 表格所有基本数据(数组对象)
    return : 完整表格解构数据
    */
    Unpack (list) { //表格解构
        let headRowList = [];
        let hd = Object.keys(list[0]);   //获取所有的列
        let listlen = list.length;
        for (let index = 0; index < listlen; index++) {
            const hdlen = hd.length;
            for (let i = 0; i < hdlen; i++) {
                delete list[index][hd[i]].edit; //删除编辑状态
                headRowList.push(list[index][hd[i]]);
            }
        }
        // list = null;
        hd = null;
        return headRowList;
    },
    //封装遍历表格的所有的列 A-Z AA-AZ ...
    AZ () {
        let arr = [];
        let a = 0;
        for (var i = 0; i < 26; i++) {
            arr.push(String.fromCharCode((65 + i)))
            // console.log(String.fromCharCode((65 + i)))  
            // console.log(i)   
        }
        for (let j = 0; j < 26; j++) {
            for (var c = 0; c < 26; c++) {
                arr.push(arr[j]+String.fromCharCode((65 + c)))  
                // console.log(arr[j]+String.fromCharCode((65 + c)))
            }  
        }
        // console.log(arr)

        return arr;
    },
    Create(ref,callback){   //根据范围生成空数据
        // // 引入A-Z的所有列数组
        // index = this.AZ();
        if (!ref)return;
        let sub = ref.indexOf(':');

        //先获取开始的列坐标
        let start_c = ABC.indexOf(ref.substr(0,sub).match(patt1)[0])+1;
        //获取开始的行坐标
        let start_r = ref.substr(0,sub).match(patt2)[0];
        //获取结束的列坐标
        let end_c = ABC.indexOf(ref.substr(sub+1).match(patt1)[0])+1;
        //获取结束的行坐标
        let end_r = ref.substr(sub+1).match(patt2)[0];

        // console.log('表格的的范围：  开始的列坐标是：',start_c,'  开始的行坐标是：',start_r)
        // console.log('表格的的范围：  结束的列坐标是：',end_c,'  结束的行坐标是：',end_r)
        //即将要生成多少列
        let cos = end_c - start_c + 1;
        //即将要生成多少行
        let row = end_r - start_r + 1;
        // console.log('即将要生成多少列:  ',cos,'   即将要生成多少行:  ',row)

        //生成空数据数组
        //key 为单元格所在位置例如A1，td 是单元格的值， formula为单元格公式，tdRowspan tdColspan 为单元格合并的列数与行数
        //edit  是单元格是否后需要打开编辑，0为无需，1为需要。
        let arr = [];
        for (let i = 0; i < row; i++) { 
            arr[i]={}
            for (let j = 0; j < cos; j++) {
                arr[i][ABC[j]]={trNum:i+1, colNum:ABC[j], td:null, tdColspan:1, tdRowspan:1,edit:'N'}
            }
        }
        // console.log('已经生成的空数据')
        // console.log(arr)
        callback(arr)
        arr = null;
    },

    Table(arr,callback){    //表格完整数据生成函数
        let sheet=[] //储存处理好的数据（二维数组）
        // console.log('arr')
        const arrlen = arr.length;
        for (let i = 0; i < arrlen; i++) {

            //调用生成工作表 i 空数据函数
            this.Create(arr[i].ref,data=>{

                for(let key in arr[i].sheets){ //遍历sheet对象键与键值，进行数据存储
                    //做优化，直接用下标来设置值
                    if (key!='!ref' && key!='!merges' && key!='!margins' && key!='!rows' && key!='!autofilter') {
                        try{
                            // console.log(arr[i].sheets[key])
                            let cos = ABC.indexOf(key.match(patt1)[0]);  //选择所有的大写字母进行查询当作列下标
                            let row = parseInt(key.match(patt2)[0])-1;   //选择所有的数字,当作行下标
                            data[row][ABC[cos]].td = arr[i].sheets[key].v;   //给空数据加入真实的数据
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

                //开始位置的列key A1
                // let start_c = ABC[parseInt(arr[i].s.c)];

                //开始位置的列下标
                let st_c = parseInt(arr[i].s.c);

                //开始位置的行下标
                let start_r = parseInt(arr[i].s.r)
                // console.log('开始的位置: ',start_c+`${start_r}`)
 
                //结束的列 - 开始的列 + 1 = 合并了多少列
                let cos = parseInt(arr[i].e.c) - parseInt(arr[i].s.c) + 1;
                //结束的行 - 开始的行 + 1 = 合并了多少行
                let row = parseInt(arr[i].e.r) - parseInt(arr[i].s.r) + 1;
                // console.log('合并了多少列 : ',cos,' cos.length','  合并了多少行 : ',row)
            

                //储存单元格合并,进行合并处理，添加合并数量
                let hdobj = Object.keys(data[start_r]);  //储存第几行对象的所有属性名  返回的是个数组
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
        
        // data[index][r].value.match(patt3) ==null
        const datalen = data.length-1;
        for (let index = datalen; index >= 0; index--) {
            let hdobj = Object.keys(data[index]).length;
            for (let r = 0; r < hdobj; r++) {
                // console.log('Object.keys(data[index]).length   '+Object.keys(data[index]).length+'      r : '+r+'    Rnum  :'+Rnum)
                if (data[index][ABC[r]].td ==null && data[index][ABC[r]].tdRowspan == 1 && data[index][ABC[r]].tdColspan == 1) {
                    if (r== hdobj - 1) {
                        Rnum++;
                    }
                }else{
                    // console.log('检测到非空即停止') 
                    return data.length=data.length -Rnum;
                } 
            }  
        }
    },
    Delete_C (data){
        //删除多余的列
        //判断每行最少有几列是多余的,然后统一删除最少列的数量
        let Cnum =0;
        const datalen = data.length-1;
        for (let index = datalen; index >= 0; index--) {
            let num =0;
            let hdobj = Object.keys(data[index]);
            for (let r = hdobj.length-1; r >= 0; r--) {
                // console.log('r   '+r+'   length-   '+(Object.keys(data[index]).length-1)+'      num  :'+num)
                if (data[index][hdobj[r]].td ==null  && data[index][hdobj[r]].tdRowspan == 1 && data[index][hdobj[r]].tdColspan == 1) {
                    num++;
                }else{
                    if (index == datalen) {
                        Cnum = num;
                    }else{
                        if (Cnum > num) Cnum = num;
                    }
                    continue;                  
                } 
            } 
            hdobj = null; 
        }
        var dataleng = data.length;
        for (let index = 0; index < dataleng; index++) {
            let hdobj = Object.keys(data[index]);
            for (let c = 0; c < Cnum; c++) {
                // delete data[index]['hd'+(Object.keys(data[index]).length-1)];
                delete data[index][hdobj[(Object.keys(data[index]).length-1)]];
            }
            hdobj = null;
        }
    }

}
let ABC =excelmodel.AZ();

// export { AZ,Table }
module.exports = excelmodel;