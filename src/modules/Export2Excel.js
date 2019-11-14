require('script-loader!file-saver');
// import XLSX from 'xlsx-style';
// import XLSX2 from 'xlsx';
var XLSX = require('xlsx-style'),
XLSX2 = require('xlsx');
 
function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
 
function sheet_from_array_of_arrays(data,Headalign,Listalign) {
  var ws = {},
  patt1=/[A-Z+]*/g;

  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {
        v: data[R][C]
      };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      });
 
      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = 's';
      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  // let border = {bottom:{style:"thin",color:{rgb: "000000"}},top:{style:"thin",color:{rgb: "000000"}},
  // left:{style:"thin",color:{rgb: "000000"}},right:{style:"thin",color:{rgb: "000000"}}};
  // //加粗
  // let style0 = {border:border, alignment:{horizontal:'center',wrapText: true ,vertical: "center"},font: { sz: 18, bold: true, color: { rgb: "000000" },outline:true }, fill: { bgColor: { indexed: 64 } } };
  // let style1 = {border:border, alignment:{horizontal:'center',wrapText: true,vertical: "center"},font: { sz: 12, bold: true, color: { rgb: "000000" },outline:true }, fill: { bgColor: { indexed: 64 } } };
  // //不加粗
  // let style2 = {border:border, alignment:{horizontal:'center',wrapText: true,vertical: "center"},font: { sz: 12,  color: { rgb: "000000" },outline:true } };
  // //蓝底加粗
  // let style3 = {border:border, alignment:{horizontal:'center',wrapText: true,vertical: "center"},font: { sz: 12, bold: true, color: { rgb: "000000" },outline:true }, fill: { fgColor: {rgb: "00BFFF" } } };
  let border = {bottom:{style:"thin",color:{rgb: "000000"}},top:{style:"thin",color:{rgb: "000000"}},
  left:{style:"thin",color:{rgb: "000000"}},right:{style:"thin",color:{rgb: "000000"}}};
  let center = {border:border, alignment:{horizontal:'center',wrapText: true,vertical: "center"},font: { sz: 12,  color: { rgb: "000000" },outline:true } },
  left = {border:border, alignment:{horizontal:'left',wrapText: true,vertical: "left"},font: { sz: 12,  color: { rgb: "000000" },outline:true } },
  right = {border:border, alignment:{horizontal:'right',wrapText: true,vertical: "right"},font: { sz: 12,  color: { rgb: "000000" },outline:true } };


  // console.log('Headalign--------------------')
  // console.log(Headalign)
  // console.log('Listalign--------------------')
  // console.log(Listalign)

  for(let key  in ws){  //给单元格添加样式
      try {
        let col = key.match(patt1)[0],
        colalign = Listalign[col];
        if (col && colalign) {  
            if (colalign === 'center') {
                ws[key].s = center;
            }else if (colalign === 'left') {
                ws[key].s = left;
            }else if (colalign === 'right') {
                ws[key].s = right;
            }
        }else{  //如无设置样式，默认居中
          ws[key].s = center;
        }
        // console.log(col)
      } catch (error) {
          // console.log('跳过了吗')
          break;
      }
      // if (key !=="!cols" && key !=="!merges" && key !=="!ref") {
  }
  for(let key  in Headalign){  //给单元格添加样式
    try {
      let colalign = Headalign[key];
      if (colalign) {  
          if (colalign === 'center') {
              ws[key].s = center;
          }else if (colalign === 'left') {
              ws[key].s = left;
          }else if (colalign === 'right') {
              ws[key].s = right;
          }
      }else{  //如无设置样式，默认居中
        ws[key].s = center;
      }
    } catch (error) {
        // console.log('跳过了吗')
        break;
    }
    // if (key !=="!cols" && key !=="!merges" && key !=="!ref") {
}
  // console.log('ws')
  // console.log(ws)
  return ws;
}
 
function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}
 
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
 
// 通过table标签渲染导出表格
export function export_table_to_excel({
  id,
  filename,
  bookType = 'xlsx',
  styleFun
} = {}) {
  var table = document.querySelector(id);
  var ws = XLSX2.utils.table_to_sheet(table);
  styleFun(ws);
  var wb = XLSX2.utils.book_new();
  XLSX2.utils.book_append_sheet(wb, ws, "SheetJS");
  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  });
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  saveAs(new Blob([s2ab(wbout)], { type: "" }), filename + "." + bookType)
}
 
//通过json渲染导出表格
export function export_json_to_excel({
  multiHeader = [],
  header,
  data,
  Headalign,
  Listalign,
  filename,
  merges = [],
  autoWidth = true,
  bookType = 'xlsx'
} = {}) {
  /* original data */
  filename = filename || 'excel-list'
  data = [...data]
  data.unshift(header);
 
  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i])
  }
 
  var ws_name = "SheetJS";
  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data,Headalign,Listalign);
 
  if (merges.length > 0) {
    if (!ws['!merges']) ws['!merges'] = [];
    merges.forEach(item => {
      ws['!merges'].push(XLSX.utils.decode_range(item))
    })
  }
 
  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map(row => row.map(val => {
      /*先判断是否为null/undefined*/
      if (val == null) {
        return {
          'wch': 12
        };
      }
      /*再判断是否为中文*/
      else if (val.toString().charCodeAt(0) > 255) {
        if (val.toString().length >25) {
            return {
              'wch': val.toString().length-10
            };
        }
        return {
          'wch': val.toString().length * 1.8
        };
      } else {
        return {
          'wch': val.toString().length
        };
      }
    }))
    /*以第一行为初始值*/
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j]['wch'] < colWidth[i][j]['wch']) {
           result[j]['wch'] = colWidth[i][j]['wch'];
        }
      }
    }
    ws['!cols'] = result;
  }
 
  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
 
  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  });
  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), `${filename}.${bookType}`);

}