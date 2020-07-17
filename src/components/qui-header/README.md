# Header 页面头部

## 使用

在 `template` 中使用图标组件
```html
    <qui-header
      :head-img="defaultHeadImg"
      :background-head-full-img="backgroundHeadFullImg"
      :theme="theme"
      :theme-num="themeNum"
      :post="post"
      :post-num="postNum"
      :share="share"
      :icon-share="iconShare"
      @click="open"
    ></qui-header>
```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| headImg | 头部logo | string | - |
| backgroundHeadFullImg | 背景图片 | string | -|
| theme | 主题名称 | string | - |
| themeNum | 主题数量| number | 0 |
| post | 帖子名称 | string | - |
| postNum | 帖子数量 | number | 0 |
| share | 分享 | string | - |
| iconShare | 分享图标 | string | - |

### 事件说明

| 事件 | 说明 | 返回值 |
| ---- | ---- | ---- |
| @click | 点击图标触发事件 | event: Event |