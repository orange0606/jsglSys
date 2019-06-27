
let patt1=/[A-Z+]*/g;
let patt2=/\d+/g;
// let excelmodel = {

//     //表格读取处理函数============
//     Imports(callback){

//         // this.table = [null]; //归为初始化状态
//         let _this = this;
//         // let inputDOM = this.$refs.inputer;
//         // 通过DOM取文件数据
//         this.file = event.currentTarget.files[0];
//         var rABS = false; //是否将文件读取为二进制字符串
//         var f = this.file;
//         var reader = new FileReader();
//         //if (!FileReader.prototype.readAsBinaryString) {
//         FileReader.prototype.readAsBinaryString = function(f) {
//             var binary = "";
//             var rABS = false; //是否将文件读取为二进制字符串
//             var pt = this;
//             var wb; //读取完成的数据
//             var outdata;
//             var reader = new FileReader();
//             reader.onload = function(e) {
//                 var bytes = new Uint8Array(reader.result);
//                 var length = bytes.byteLength;
//                 for(var i = 0; i < length; i++) {
//                     binary += String.fromCharCode(bytes[i]);
//                 }
//                 var XLSX = require('xlsx');
//                 if(rABS) {
//                     wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
//                         type: 'base64'
//                     });
//                 } else {
//                     wb = XLSX.read(binary, {
//                         type: 'binary'
//                     });
//                 }

//                 var persons = []   //数组  存储文件内的所有表数据
//                 for (var sheet in wb.Sheets) {
//                     var perobj ={}
//                     if (wb.Sheets.hasOwnProperty(sheet)) {
//                     // console.log('wb.Sheets[sheet]')
//                     // console.log(wb.Sheets[sheet])

//                         // perobj.sheets = XLSX.utils.get_formulae(wb.Sheets[sheet]) //添加工作表的数据
//                         perobj.sheets = wb.Sheets[sheet] //添加工作表的数据

//                         perobj.ref= wb.Sheets[sheet]['!ref']  //添加表的单元格范围
//                         console.log('perobj.ref')
//                         console.log(perobj.ref)

//                         if(wb.Sheets[sheet]['!merges']){    //检测该工作表有无单元格合并
//                         perobj.merges = wb.Sheets[sheet]['!merges']   //添加单元格合并情况，是个数组
//                         }else{
//                         perobj.merges = null
//                         }
//                         persons.push(perobj)

//                         //  break; //只需要单张工作表数据时才跳出循环
//                     }
//                 }       

//                 console.log(' excel文件中的所有表需要处理的数据persons')
//                 console.log(persons)

//                 //最终处理的数据
//                 _this.Table(persons,data=>{
//                     callback(data)
//                 })
//              outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //  outdata就是转换为json的数据
//             //  _this.table = outdata;  //  可作为转换成html表格的数据
//             //  _this.tb_header =[] //  json格式的表头
//              console.log('转换为json的数据')
//              console.log(outdata)
//              console.log('表格导入的未经任何处理的原始数据')
//              console.log(wb.Sheets[wb.SheetNames[0]]) //  为转换的原始数据，可作为提交或者另外处理

                   
//             //  var formulae = XLSX.utils.sheet_to_formulae(wb.Sheets[wb.SheetNames[0]]); //  转换成数组
//             //  console.log('转换为数组的数据 formulae')
//             //  console.log(formulae)

//             //  obj.Table(persons)


//             //  var b =XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
//             //  console.log("转换为csv格式")
//             //  console.log(typeof b)
//             //  _this.tb = b;

//             //  a = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]);  //  将数据转换为 html格式表格
//             //  console.log('将数据转换为 html格式表格')


//             //  XLSX.writeFile(wb, 'output.xlsx');  //  导出为表格

//             //  this.da = [...outdata]

//             }

//             f?reader.readAsArrayBuffer(f):f
//         }
//         if(rABS) {
//             reader.readAsArrayBuffer(f);
//         } else {
//             reader.readAsBinaryString(f);
//         }

//     },
//     //封装遍历表格的所有的列 A-Z AA-AZ ...
//     AZ(){
//         let arr = [];
//         let a = 0;
//         for (var i = 0; i < 26; i++) {
//             arr.push(String.fromCharCode((65 + i)))
//             // console.log(String.fromCharCode((65 + i)))  
//             // console.log(i)   
//         }
//         for (let j = 0; j < 26; j++) {
//             for (var c = 0; c < 26; c++) {
//                 arr.push(arr[j]+String.fromCharCode((65 + c)))  
//                 // console.log(arr[j]+String.fromCharCode((65 + c)))
//             }  
//         }
//         // console.log(arr)
//         return arr;
//     },
//     Create(ref,callback){   //根据范围生成空数据
//         // // 引入A-Z的所有列数组
//         // index = this.AZ();
//         if (!ref)return
//         let sub = ref.indexOf(':');

//         //先获取开始的列坐标
//         let start_c = index.indexOf(ref.substr(0,sub).match(patt1)[0])+1;
//         //获取开始的行坐标
//         let start_r = ref.substr(0,sub).match(patt2)[0];
//         //获取结束的列坐标
//         let end_c = index.indexOf(ref.substr(sub+1).match(patt1)[0])+1;
//         //获取结束的行坐标
//         let end_r = ref.substr(sub+1).match(patt2)[0];

//         // console.log('表格的的范围：  开始的列坐标是：',start_c,'  开始的行坐标是：',start_r)
//         // console.log('表格的的范围：  结束的列坐标是：',end_c,'  结束的行坐标是：',end_r)
//         //即将要生成多少列
//         let cos = end_c - start_c + 1;
//         //即将要生成多少行
//         let row = end_r - start_r + 1;
//         // console.log('即将要生成多少列:  ',cos,'   即将要生成多少行:  ',row)

//         //生成空数据数组
//         //key 为单元格所在位置例如A1，value 是单元格的值， formula为单元格公式，cos row 为单元格合并的列数与行数
//         //dele是单元格合并后需要标记删除的元素，0为无需删除，1为需要删除。
//         let arr = [];
//         for (let i = 0; i < row; i++) { 
//                 arr[i]=[]
//             for (let j = 0; j < cos; j++) {
//                 arr[i].push({key:index[j]+`${i+1}`,value:null,cos:1,row:1,formula:null,dele:0}) 
//             }
            
//         }
//         // console.log('已经生成的空数据')
//         // console.log(arr)
//         callback(arr)
//     },

//     Table(arr,callback){    //表格完整数据生成函数
//         let oktable =[] //储存处理好的数据（二维数组）
//         // console.log('arr')
//         for (let i = 0; i < arr.length; i++) {

//             //调用生成工作表 i 空数据函数
//             this.Create(arr[i].ref,data=>{

//                 for(let key  in arr[i].sheets){ //遍历sheet对象键与键值，进行数据存储
//                     //做优化，直接用下标来设置值
//                     if (key!='!ref' && key!='!merges' && key!='!margins') {
//                         let cos = index.indexOf(key.match(patt1)[0]);  //选择所有的大写字母进行查询当作列下标
//                         let row = parseInt(key.match(patt2)[0])-1;   //选择所有的数字,当作行下标
//                         data[row][cos].value = arr[i].sheets[key].w;    //给空数据加入真实的数据

//                         //若单元格有公式的话，对公式进行保存
//                         if (arr[i].sheets[key].f) {
//                             data[row][cos].formula = arr[i].sheets[key].f;
//                         }
//                     }
//                 }
//                 //调用单元格合并信息函数
//                 this.Merge(arr[i].merges,data);

//                 //调用表格去除多余无值的行列
//                 this.Delete_R(data)
//                 this.Delete_C(data)

//                 oktable.push(data)

//             })         
//         }
//         // console.log('oktable')
//         //最终生成好的数据
//         callback(oktable)
//     },
//     Merge(arr,data){  //arr是合并信息 数组，data 是生成的数据
//         // console.log('这里开始设置合并单元格啦')
//         // console.log(arr[0])
//         if(arr!=null){
//             // console.log(arr)
//             for (let i = 0; i<arr.length;i++){

//                 //开始位置的列
//                 let start_c = index[parseInt(arr[i].s.c)]
//                 //开始位置的行
//                 let start_r = parseInt(arr[i].s.r)
//                 // console.log('开始的位置: ',start_c+`${start_r}`)
 
//                 //结束的列 - 开始的列 + 1 = 合并了多少列
//                 let cos = parseInt(arr[i].e.c) - parseInt(arr[i].s.c) + 1;
//                 //结束的行 - 开始的行 + 1 = 合并了多少行
//                 let row = parseInt(arr[i].e.r) - parseInt(arr[i].s.r) + 1;
//                 // console.log('合并了多少列 : ',cos,' cos.length','  合并了多少行 : ',row)

//                 //储存单元格合并,进行合并处理，添加合并数量
//                 if (data[start_r][parseInt(arr[i].s.c)].key==(start_c+`${start_r+1}`)) {
//                     data[start_r][parseInt(arr[i].s.c)].cos = cos;
//                     data[start_r][parseInt(arr[i].s.c)].row = row;
//                 }
//                 //标记需要删除的合并的单元格
//                 for (let a = 0; a< row; a++) {   //dele是单元格合并后需要标记删除的元素，0为无需删除，1为需要删除。
//                         if (a==0) {
//                             for(let b =1 ; b < cos; b++){
//                                 // data[start_r-1].splice(parseInt(arr[i].s.c)+1,cos-1);
//                                 data[start_r][parseInt(arr[i].s.c)+b].dele=1;
//                             }
//                         }else{  //因为只保留最初始位置左上角的值，所以其他值都得删除掉
//                             for(let b =0 ; b < cos; b++){
//                                 data[start_r+a][parseInt(arr[i].s.c)+b].dele=1;
//                             }
//                         } 
//                 }                        

//             }

//             //对已经标记了合并需要删除的数组元素进行删除
//             for (let b = data.length-1; b >= 0; b--) {
//                 for (let c = data[b].length-1; c >= 0; c--) {
//                         if (data[b][c].dele==1) {
//                             data[b].splice(c,1);
//                         }
//                 }
//             }         
//         }

//     },
//     Delete_R(data){
//         // console.log(data)
//         let Rnum = 0;
//         // 删除多余的行
        
//         // data[index][r].value.match(patt3) ==null
//         for (let index = data.length-1; index >= 0; index--) {
//             for (let r = 0; r < data[index].length; r++) {
//                 if (data[index][r].value ==null && data[index][r].formula == null && data[index][r].row == 1 && data[index][r].cos == 1) {
//                     if (r==data[index].length-1) {
//                         Rnum++;
//                     }
//                 }else{
//                     // console.log('检测到非空即停止')
//                     return data.length=data.length -Rnum;
//                 } 
//             }  
//         }
//     },
//     Delete_C (data){
//         //删除多余的列
//         //判断每行最少有几列是多余的,然后统一删除最少列的数量
//         let Cnum =0;
//         for (let index = data.length-1; index >= 0; index--) {
//             let num =0;
//             for (let r = data[index].length-1; r >= 0; r--) {
//                 if (data[index][r].value ==null && data[index][r].formula == null && data[index][r].row == 1 && data[index][r].cos == 1) {
//                     num++;
//                 }else{
//                     if (index==data.length-1) {
//                         Cnum = num;
//                     }else{
//                         if (Cnum > num) Cnum = num;
//                     }
//                     continue;                  
//                 } 
//             }  
//         }
//         for (let index = 0; index < data.length; index++) {
//            data[index].length = data[index].length -Cnum;        
//         }
//     }

// }
// let index =excelmodel.AZ();

// // export { AZ,Table }
// module.exports = excelmodel;



let excelmodel = {

    //表格读取处理函数============
    Imports(callback){

        // this.table = [null]; //归为初始化状态
        let _this = this;
        // let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        this.file = event.currentTarget.files[0];
        var rABS = false; //是否将文件读取为二进制字符串
        var f = this.file;
        var reader = new FileReader();
        //if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function(f) {
            var binary = "";
            var rABS = false; //是否将文件读取为二进制字符串
            var pt = this;
            var wb; //读取完成的数据
            var outdata;
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
                        console.log('perobj.ref')
                        console.log(perobj.ref)

                        if(wb.Sheets[sheet]['!merges']){    //检测该工作表有无单元格合并
                        perobj.merges = wb.Sheets[sheet]['!merges']   //添加单元格合并情况，是个数组
                        }else{
                        perobj.merges = null
                        }
                        persons.push(perobj)

                        //  break; //只需要单张工作表数据时才跳出循环
                    }
                }       

                // console.log(' excel文件中的所有表需要处理的数据persons')
                // console.log(persons)

                //最终处理的数据
                _this.Table(persons,data=>{
                    callback(data)
                })
           
             console.log('表格导入的未经任何处理的原始数据')
             console.log(wb.Sheets[wb.SheetNames[0]]) //  为转换的原始数据，可作为提交或者另外处理
            }

            f?reader.readAsArrayBuffer(f):f
        }
        if(rABS) {
            reader.readAsArrayBuffer(f);
        } else {
            reader.readAsBinaryString(f);
        }

    },
    //封装遍历表格的所有的列 A-Z AA-AZ ...
    AZ(){
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
        if (!ref)return
        let sub = ref.indexOf(':');

        //先获取开始的列坐标
        let start_c = index.indexOf(ref.substr(0,sub).match(patt1)[0])+1;
        //获取开始的行坐标
        let start_r = ref.substr(0,sub).match(patt2)[0];
        //获取结束的列坐标
        let end_c = index.indexOf(ref.substr(sub+1).match(patt1)[0])+1;
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
        //key 为单元格所在位置例如A1，value 是单元格的值， formula为单元格公式，cos row 为单元格合并的列数与行数
        //dele是单元格合并后需要标记删除的元素，0为无需删除，1为需要删除。
        let arr = [];
        for (let i = 0; i < row; i++) { 
            arr[i]={}
            for (let j = 0; j < cos; j++) {
                arr[i]['hd'+j]={key:index[j]+`${i+1}`,value:null,cos:1,row:1,formula:null,dele:0}
  
            }
            
        }
        // console.log('已经生成的空数据')
        // console.log(arr)
        callback(arr)
    },

    Table(arr,callback){    //表格完整数据生成函数
        let oktable ={sheet:[],hd:[]} //储存处理好的数据（二维数组）
        // console.log('arr')
        for (let i = 0; i < arr.length; i++) {

            //调用生成工作表 i 空数据函数
            this.Create(arr[i].ref,data=>{

                for(let key  in arr[i].sheets){ //遍历sheet对象键与键值，进行数据存储
                    //做优化，直接用下标来设置值
                    if (key!='!ref' && key!='!merges' && key!='!margins') {
                        let cos = index.indexOf(key.match(patt1)[0]);  //选择所有的大写字母进行查询当作列下标
                        let row = parseInt(key.match(patt2)[0])-1;   //选择所有的数字,当作行下标
                        data[row]['hd'+cos].value = arr[i].sheets[key].w;   //给空数据加入真实的数据
                        // data[row][cos].value = arr[i].sheets[key].w;    

                        //若单元格有公式的话，对公式进行保存
                        if (arr[i].sheets[key].f) {
                            data[row]['hd'+cos].formula = arr[i].sheets[key].f;
                        }
                    }
                }
                // console.log('已注入数据')
                // console.log(data)


                //调用表格去除多余无值的行列
                this.Delete_R(data)
                this.Delete_C(data)

                //调用单元格合并信息函数
                this.Merge(arr[i].merges,data);

                //把数据添加到即将要回调的数组中
                oktable.sheet.push(data)

                //把表头所有列信息提交到回调函数中
                oktable.hd.push(Object.getOwnPropertyNames(data[0]))

            })         
        }
        // console.log('oktable')
        //最终生成好的数据
        callback(oktable)
    },
    Merge(arr,data){  //arr是合并信息 数组，data 是生成的数据
        // console.log('这里开始设置合并单元格啦')
        // console.log(arr[0])
        if(arr!=null){
            // console.log(arr)
            for (let i = 0; i<arr.length;i++){

                //开始位置的列key A1
                let start_c = index[parseInt(arr[i].s.c)]

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
                let hdobj = Object.keys(data[start_r])  //储存第几行对象的所有属性名  返回的是个数组
                if (data[start_r][hdobj[st_c]].key==(start_c+`${start_r+1}`)) {
                    data[start_r][hdobj[st_c]].cos = cos;
                    data[start_r][hdobj[st_c]].row = row;
                }

                    // 标记需要清除数据的合并的单元格
                for (let a = 0; a< row; a++) {   //dele是单元格合并后需要标记删除的元素，0为无需删除，1为需要删除。
                        if (a==0) {
                            for(let b =1 ; b < cos; b++){
                                // data[start_r-1].splice(parseInt(arr[i].s.c)+1,cos-1);
                                data[start_r][hdobj[(parseInt(arr[i].s.c)+b)]].value=null;
                            }
                        }else{  //因为只保留最初始位置左上角的值，所以其他值都得删除掉
                            for(let b =0 ; b < cos; b++){
                                data[start_r+a][hdobj[(parseInt(arr[i].s.c)+b)]].value=null;
                            }
                        } 
                }             
               

            }    

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
        for (let index = data.length-1; index >= 0; index--) {
            for (let r = 0; r < Object.keys(data[index]).length; r++) {
                // console.log('Object.keys(data[index]).length   '+Object.keys(data[index]).length+'      r : '+r+'    Rnum  :'+Rnum)
                if (data[index]['hd'+r].value ==null && data[index]['hd'+r].formula == null && data[index]['hd'+r].row == 1 && data[index]['hd'+r].cos == 1) {
                    if (r==Object.keys(data[index]).length-1) {
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
        for (let index = data.length-1; index >= 0; index--) {
            let num =0;
            let hdobj = Object.keys(data[index]);
            for (let r = hdobj.length-1; r >= 0; r--) {
                // console.log('r   '+r+'   length-   '+(Object.keys(data[index]).length-1)+'      num  :'+num)
                if (data[index][hdobj[r]].value ==null && data[index][hdobj[r]].formula == null && data[index][hdobj[r]].row == 1 && data[index][hdobj[r]].cos == 1) {
                    num++;
                }else{
                    if (index==data.length-1) {
                        Cnum = num;
                    }else{
                        if (Cnum > num) Cnum = num;
                    }
                    continue;                  
                } 
            }  
        }
        for (let index = 0; index < data.length; index++) {
            let hdobj = Object.keys(data[index]);
            for (let c = 0; c < Cnum; c++) {
                // delete data[index]['hd'+(Object.keys(data[index]).length-1)];
                delete data[index][hdobj[(Object.keys(data[index]).length-1)]]
            }
        }
    }

}
let index =excelmodel.AZ();

// export { AZ,Table }
module.exports = excelmodel;