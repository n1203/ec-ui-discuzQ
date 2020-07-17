# qui-load-more 加载更多 
  来自uni-app官网 https://ext.dcloud.net.cn/plugin?id=29

## 使用

在 `template` 中使用
```html
<qui-load-more :status="loadingType"></qui-load-more>

```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| status | loading 的状态[more(loading前)|loading(loading中)|noMore(没有更多了)] | String | more |
| iconSize | 指定图标大小 | Number| 24 |
| iconType | 指定图标样式[snow|circle|auto] 指定图标样式 | String | 根据手机系统自动 |
| color | 图标和文字颜色 | String| #aaa |
| contentText | 各状态文字说明 | String| 空 |
| showIcon | 是否显示 loading 图标 | Boolean| true |

### 事件说明

| 事件 | 说明 | 返回值 |
| ---- | ---- | ---- |
| clickLoadMore | 点击加载更多| event: Event |
