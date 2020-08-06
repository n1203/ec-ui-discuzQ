# tabs

## 使用

在 `template` 中使用
```html
<qui-tabs :current="current" :values="items"></qui-tabs>

```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| current | 当前索引值 | Number | 0 |
| values | 选项数组（支持标题和备注，其他需要的可自行添加） | Array| [] |
| Boolean | 是否显示备注 | Boolean | false |
| activeColor | 选中的标签边框颜色 | String| #1878F3 |

### 数据格式说明

values: 
[
    { title: '主题', brief: '73' },
    { title: '关注', brief: '12' },
    { title: '粉丝', brief: '31' },
    { title: '点赞', brief: '65' },
],

### 事件说明

| 事件 | 说明 | 返回值 |
| ---- | ---- | ---- |
| onClick | 点击item事件| event: Event |
