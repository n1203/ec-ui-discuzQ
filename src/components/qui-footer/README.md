# Footer 页面底部

## 使用

在 `template` 中使用图标组件

```html
<qui-footer :tabs="tabs" @click="footerOpen"></qui-footer>
```

### Props 属性说明

| 参数 | 说明     | 类型  | 默认值 |
| ---- | -------- | ----- | ------ |
| tabs | 文字图标 | array | -      |
| postImg | 发帖按钮图片| string | -      |

### 事件说明

| 事件   | 说明             | 返回值       |
| ------ | ---------------- | ------------ |
| @click | 点击图标触发事件 | event: Event |
