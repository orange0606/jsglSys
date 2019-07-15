          cell_click2(row, column, cell, event){ //单元格点击事件
              if (column.property && !this.btn.edit) {  //做容错处理，防止点击到选择框触发此事件
                    //判断引入表格是否显示
                    this.show_lead?this.show_lead = false:this.show_lead;

                    let colum =column.property;
                    colum = colum.substr(0,colum.indexOf('.'));
                    this.lead.cell_row = row[colum].tr_num;
                    this.lead.cell_col = column.id;
                    // console.log(column)
                    this.lead.cell_hd = colum;

                    if(this.lead.att_click_state){    //设置属性开启后，才执行相关属性与限制值属性操作
                         //点击单元格获取id 和key（位置）
                        this.lead.att_id = row[colum].id;
                        this.lead.att_key = `${row[colum].col_num}${row[colum].tr_num}`;
                        console.log(this.lead.att_id,this.lead.att_key)
                        console.log('this.row_att')
                        console.log(this.row_att)
                        if(!this.lead.lim_click_state){ //this.lead.lim_click_state 限制值属性设置状态  true为限制值操作 false为普通属性操作
                          this.row_att.attribute_value = this.lead.att_key;
                          this.row_att.attribute_value_id = this.lead.att_id;
                        }else{  //点击单元格设置限制属性值与id
                          this.row_att.limit_value = this.lead.att_key;
                          this.row_att.limit_id = this.lead.att_id;
                          
                        }

                    }
                   
                    // console.log('this.lead.att_id,this.lead.att_key')
                    
                    //手动刷新表格
                    this.$refs.elxEditable?this.$refs.elxEditable.refresh():this.$refs.elxEditable1.refresh()
                    // this.$refs.elxEditable.doLayout()
              }
          },