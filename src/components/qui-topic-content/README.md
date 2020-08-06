# Content 内容部分

## 使用

在 `template` 中使用图标组件

```html
<qui-topic-content
  v-model="data"
  :pay-status="true"
  :avatar-url="data.user.avatarUrl"
  :user-name="data.user.username"
  :theme-types="data.type"
  :theme-time="data.createdAt"
  :theme-content="data.firstPost.contentHtml"
  :images-list="data.firstPost.images"
  :tags="[data.category]"
  @personJump="personJump"
></qui-topic-content>
```

### Props 属性说明

| 参数         | 说明                  | 类型          | 默认值 |
| ------------ | --------------------- | ------------- | ------ |
| themeType    | 主题类型              | number,string | -      |
| userId       | 发布主题用户 Id       | number        | -      |
| avatarUrl    | 发布主题用户头像      | string        | -      |
| payStatus    | 主题支付状态          | boolean       | -      |
| userName     | 发布主题用户 username | string        | -      |
| themeTitle   | 主题标题              | string        | 0      |
| themeContent | 主题内容              | string        | -      |
| themeTime    | 主题发布事件          | string        | -      |
| imagesList   | 主题发布图片          | object        | -      |
| modeVal      | 图片裁剪模式          | string        | -      |
| tags         | 主题标签              | object        | -      |
| fileList     | 附件列表              | Array        | []     |

### 事件说明

| 事件        | 说明                         | 返回值       |
| ----------- | ---------------------------- | ------------ |
| @personJump | 点击用户名及用户头像跳转事件 | event: Event |
| @imageClick | 点击图片事件                 | event: Event |
