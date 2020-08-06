# input 验证码输入

## 使用
在 `template` 中使用
 
**基础功能**
```html
<qui-input-code 
@getdata="btndata" 
:title="Boolean"
:text="text"
:number="password"
></qui-input-code>
```
### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| title | 判断输入码是否正确，不正确传入false正确返回true | Boolean | false |
| text | 输入错误后提示信息 | string | 输入错误提示信息 |
| number | input的type类型 | string | number |
| show | 是否弹出键盘 | Boolean | false |