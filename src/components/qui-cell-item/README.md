# qui-cell-item 单元格

## 使用

在 `template` 中使用
```html
<cell-item title="普通条目" addon="附加文案" arrow></cell-item>
<cell-item title="普通条目" slot-right></cell-item>
```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| title | 左侧标题 | string | 空 |
| brief | 左侧标题底下的描述 | string| 空 |
| addon | 右侧标题 | string | 空 |
| briefRight | 右侧标题底下的描述 | string| 空 |
| arrow | 是否需要右侧箭头 | Boolean| false |
| addon2 | 在列表单元下显示文字说明 | string | 空 |
| disabled | 是否禁用 | Boolean| false |
| border | 是否需要下边框 | Boolean | true |
| slot-left | 左边插槽（当自带内容不满足需求可使用） | Boolean| false |
| slot-right | 右边插槽（当自带内容不满足需求可使用） | Boolean| false |
| classItem | 自定义样式名 | string| 空 |

### 事件说明

| 事件 | 说明 | 返回值 |
| ---- | ---- | ---- |
| $_click | 点击单元格 | event: Event |