
let XLSX = require('xlsx');
// 模拟数据
var data = [
    {"1":"傻狗","2":"狗松","3":"胖狗","4":"飞机","5":"物理","6":"手段","7":"狗崽","8":"哦哦"},
    {"1":"傻狗","2":"狗松","3":"胖狗","4":"飞机","5":"物理","6":"手段","7":"狗崽","8":"哦哦"},
    {"1":"傻狗","2":"狗松","3":"胖狗","4":"飞机","5":"物理","6":"手段","7":"狗崽","8":"哦哦"},
    {"1":"傻狗","2":"狗松","3":"胖狗","4":"飞机","5":"物理","6":"手段","7":"狗崽","8":"哦哦"},
    {"1":"傻狗","2":"狗松","3":"胖狗","4":"飞机","5":"物理","6":"手段","7":"狗崽","8":"哦哦"},
    {"1":"傻狗","2":"狗松","3":"胖狗","4":"飞机","5":"物理","6":"手段","7":"狗崽","8":"哦哦"},
    {"1":"傻狗","2":"狗松","3":"胖狗","4":"飞机","5":"物理","6":"手段","7":"狗崽","8":"哦哦"},
    {"1":"傻狗","2":"狗松","3":"胖狗","4":"飞机","5":"物理","6":"手段","7":"狗崽","8":"哦哦"},
]
// 配置文件类型
const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true };
// 下载功能
xlsxstyle = {
    saveAs(obj, fileName) {
        var tmpa = document.createElement("a");
        tmpa.download = fileName || "未命名";
        // 兼容ie 
        if ("msSaveOrOpenBlob" in navigator) {
        window.navigator.msSaveOrOpenBlob(obj, "下载的文件名"+ ".xlsx");
        } else {
        tmpa.href = URL.createObjectURL(obj);
        }
        tmpa.click();
        setTimeout(function() {
        URL.revokeObjectURL(obj);
        }, 100);
    },
    downloadExl(json, type) {
        if (!json) {
            json = data;
        }
        var tmpdata = json[0];
        json.unshift({});
        var keyMap = []; //获取keys
        for (var k in tmpdata) {
            keyMap.push(k);
            json[0][k] = k;
        }
        var tmpdata = [];//用来保存转换好的json 
        json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
            v: v[k],
            position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
        }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
            v: v.v
        });
        var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
        tmpdata["A1"].s = { font: { sz: 14, bold: true, color: { rgb: "FFFFAA00" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };//<====设置xlsx单元格样式
    //     tmpdata["!merges"] = [
    //         {
    //         s: { c: 0, r: 0 },
    //         e: { c: 4, r: 0 }
    //          }
    // ];//<====合并单元格 
        var tmpWB = {
            SheetNames: ['mySheet'], //保存的表标题
            Sheets: {
                'mySheet': Object.assign({},
                    tmpdata, //内容
                    {
                        '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                    })
            }
        };
        console.log('---tmpWB---')
        console.log(tmpWB)
        tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
            { bookType: (type == undefined ? 'xlsx' : type), bookSST: false, type: 'binary' }//这里的数据是用来定义导出的格式类型
        ))], {
                type: ""
            });
        this.saveAs(tmpDown, "导出的表格"+Math.random()*100 + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
    },
    // 获取26个英文字母用来表示excel的列
    getCharCol(n) {
        let temCol = '',
            s = '',
            m = 0
        while (n > 0) {
            m = n % 26 + 1
            s = String.fromCharCode(m + 64) + s
            n = (n - m) / 26
        }
        return s
    },
    s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        } else {
            var buf = new Array(s.length);
            for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
    }
}
module.exports = xlsxstyle;