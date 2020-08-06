# Content 内容部分

## 使用

在 `template` 中使用图标组件
```html
<qui-content
  v-for="(item, index) in data"
  :key="index"
  :user-name="item.userName"
  :theme-image="item.themeImage"
  :theme-status="item.themeStatus"
  :theme-btn="item.themeBtn"
  :theme-reward="item.themeReward"
  :theme-reply-btn="item.themeReplyBtn"
  :theme-delete-btn="item.themeDeleteBtn"
  :theme-types="item.userGroups"
  :theme-time="item.themeTime"
  :theme-content="item.themeContent"
  :theme-like="item.themeLike"
  :theme-comment="item.themeComment"
  :tags="item.tags"
  ></qui-content>
```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| userName | 用户名称 | string | - |
| themeImage | 用户头像 | string | -|
| themeStatus | 帖子状态 | string | - |
| themeBtn | icon图标| string | - |
| themeReward | 打赏金额 | number | 0 |
| themeReplyBtn | 回复icon图标 | string | - |
| themeDeleteBtn | 删除icon图标 | string | - |
| userGroups | 用户组 | string | - |
| themeTime | 主题时间 | string | - |
| themeContent | 主题内容 | string | - |
| themeLike | 点赞数量 | number | 0 |
| themeComment | 评论数量 | number | 0 |
| tags | 标签 | string | - |

### 事件说明

| 事件 | 说明 | 返回值 |
| ---- | ---- | ---- |
| @click | 点击图标触发事件 | event: Event |