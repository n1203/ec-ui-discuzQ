# Loading 加载

## 使用

在 `template` 中使用 Loading 加载
```html
<qui-loading></qui-loading>
<qui-loading>加载中...</qui-loading>
<qui-loading vertical>加载中...</qui-loading>
<qui-loading vertical text-size="20" text-color="#000">加载中...</qui-loading>
```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| name | 图标名称，具体需要查看 qui-icon 中 font-icon.scss 文件中的图标样式名称 | string | icon-loading |
| size | 图标大小（单位默认px） | string\|number | 30 |
| color | 图标颜色 | string | #ccc |
| textSize | 文本字体大小（单位默认px） | string\|number | 14 |
| textColor | 文本颜色 | string | #888 |
| vertical | 是否垂直排列图标和文字内容 | boolean | false |

### Slots

| 名称 | 说明 |
| ---- | ---- |
| default | 加载文案 |