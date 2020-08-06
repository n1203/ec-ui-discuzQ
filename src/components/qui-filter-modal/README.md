# qui-filter-modal 条件筛选框

## 使用

在 `template` 中使用
```html
<filter-modal v-model="show" @confirm="confirm" :filter-list="filterList"></filter-modal>

```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| confirmText | 确认框的文字 | string | 筛选 |
| value | 弹框显示隐藏 | Boolean| false |
| selectedData | 选中的项目 | Array | [] |
| ifNeedConfirm | 是否需要确认按钮 | Boolean| true |
| filterList | 筛选数据 | Array| [] |

### 数据格式说明

(selected不传的话默认为false)：
[{
    title: '板块1',
    data: [
    { label: '细类1', value: '1',selected:true },
    { label: '细类2', value: '2'},
    ],
},
{
    title: '板块2',
    data: [
    { label: '细类1', value: '1'},
    { label: '细类2', value: '1' ,selected:true},
    ],
}],

### 事件说明

| 事件 | 说明 | 返回值 |
| ---- | ---- | ---- |
| confirm | 点击确认 | event: Event |
| cancel | 关闭弹框 | event: Event |
| changeSelected | 点击item | event: Event |
| setData | 设置初始值 | event: Event |