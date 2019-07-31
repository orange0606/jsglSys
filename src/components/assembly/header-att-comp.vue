 <!-- <elx-editable-column prop="0" label="名字" min-width="80"  show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="1" label="名字" min-width="80" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="2" label="名字" min-width="80" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="3" label="名字" min-width="80" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="4" label="名字" min-width="80" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="5" label="名字" min-width="80" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="6" label="名字" min-width="80" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="7" label="名字" min-width="80" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column>
      <elx-editable-column prop="8" label="名字" min-width="80" show-overflow-tooltip :edit-render="{name: 'ElInput'}"></elx-editable-column> -->
              {
          label: '配送信息',
          children: [
            {
              prop: 'name',
              label: '姓名'
            },
            {
              label: '地址',
              children: [
                {
                  prop: 'name2',
                  label: '省份'
                },
                {
                  prop: 'name3',
                  label: '市区'
                },
                {
                  prop: 'name4',
                  label: '地址'
                }
              ]
            }
          ]
        }