# Tag 标签

## 使用

在 `template` 中使用图标组件
```html
<qui-tag>标签</qui-tag>
<qui-tag type="primary">标签</qui-tag>
<qui-tag type="warning" plain>标签</qui-tag>
<qui-tag type="success">标签</qui-tag>
<qui-tag type="danger">标签</qui-tag>
```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| type | 类型（primary\|success\|danger\|warning） | string | default |
| size | 标签打下（small\|medium\|large） | string | medium |
| color | 标签背景色 | string | - |
| textColor | 标签文本颜色 | string | - |
| plain | 是否是空心（背景色是白色） | string | false |

### 事件说明

| 事件 | 说明 | 返回值 |
| ---- | ---- | ---- |
| @click | 点击标签触发事件 | event: Event |