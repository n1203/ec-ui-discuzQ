# Content 内容部分

## 使用

在 `template` 中使用图标组件

```html
<qui-person-list
  :show-status="true"
  :type="打赏"
  :person-num="data.paidCount"
  :limit-count="limitShowNum"
  :person-list="data.paidUsers"
  :btn-show="true"
  :btn-icon-show="true"
  btn-icon-name="rmb"
  btn-text="t.paymentViewPicture"
  @personJump="personJump"
  @btnClick="payClick"
></qui-person-list>
```

### Props 属性说明

| 参数         | 说明                 | 类型    | 默认值 |
| ------------ | -------------------- | ------- | ------ |
| type         | 类型                 | string  | -      |
| personNum    | 总数                 | number  | -      |
| limitCount   | 初始化限制显示数量   | number  | -      |
| personList   | 用户列表             | object  | -      |
| btnShow      | 是否显示按钮         | boolean | -      |
| btnBg        | 按钮背景色           | string  | -      |
| btnIconShow  | 按钮是否显示 Icon    | string  | -      |
| btnIconName  | 按钮 Icon 的 name 值 | string  | -      |
| btnText      | 按钮的文本           | string  | -      |
| btnTextColor | 按钮的文本颜色值     | string  | -      |

### 事件说明

| 事件        | 说明                         | 返回值       |
| ----------- | ---------------------------- | ------------ |
| @foldClick  | 展开折叠事件                 | event: Event |
| @personJump | 点击用户名及用户头像跳转事件 | event: Event |
| @btnClick   | 按钮点击事件                 | event: Event |
