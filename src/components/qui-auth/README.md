# 授权弹框

## 使用

在 `template` 中使用 qui-auth， 需要配合 popup 一起使用

## 判断是否需要弹框，一般在 onLoad 里添加

```js
if (!this.$store.getters['session/get']('isLogin')) {
  this.$refs.auth.open();
}
```

**基础功能**

```html
<uni-popup ref="auth" type="bottom">
  <qui-auth @login="login" @close="close"></qui-auth>
</uni-popup>
```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |


### Event 事件说明

| 事件名 | 说明                             | 参数 |
| ------ | -------------------------------- | ---- |
| @login | 点授权，成功之后回调，拒绝和同意 |
| @close | 点击关闭回调                     |

| 名称      | 说明         |
| --------- | ------------ |
| rightIcon | 右侧内容图标 |
