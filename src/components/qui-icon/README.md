# Icon 图标

## 使用

在 `template` 中使用图标组件
```html
<qui-icon name="icon-unfold" size="24" color="red" @click="handleClick"></qui-icon>

<qui-icon name="icon-loading" color="red"></qui-icon>

<qui-icon name="icon-message" size="30" dot></qui-icon>

<qui-icon name="icon-message" size="40" dot badge="9999"></qui-icon>
```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| name | 图标名称，具体需要查看 font-icon.scss 文件中的图标样式名称 | string | - |
| size | 图标大小 | string\|number | 16px |
| color | 图标颜色 | string | - |
| dot | 是否在图标右上角显示小红点 | boolean | false |
| badge | 图标右上角小红点里面的内容 | string\|number | - |

### 事件说明

| 事件 | 说明 | 返回值 |
| ---- | ---- | ---- |
| @click | 点击图标触发事件 | event: Event |