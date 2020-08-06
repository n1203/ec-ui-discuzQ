# Emoji 头像单元格

## 使用

在 `template` 中使用 Emoji，表情一页是35个，5 * 7排列。

**基础功能**

```html
<view class="emoji-bd">
  <qui-emoji
    :list="allEmoji"
    position="absolute"
    top="20rpx"
    border-radius="10rpx"
    v-if="emojiShow"
    @click="getEmojiClick"
  ></qui-emoji>
</view>
```

### Props属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
|list|表情数据，数据格式参考表情接口请求|Object|-
|position|右侧内容|String|absolute
|top|css属性top|String| -
|left|css属性left|String| -
|right|css属性right|String| -
|bottom|css属性bottom|String| -
|border-radius|圆角边框|String|0rpx

### Event 事件说明

| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
|@click|点击表情时触发|返回data属性

### 其他

    1. 如何隐藏和显示？
       通过v-if使用者自己控制。(v-show属性，uni-app不支持)
