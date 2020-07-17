# Button 按钮

> 基于 `uniapp` 的 `Button` 进行了一层封装，主要是样式的更改，样式改成我们设计的样式了

## 使用

在 `template` 中使用
```html
<qui-button></qui-button>
<qui-button type="primary"></qui-button>
<qui-button type="primary" plain>产品经理</qui-button>
<qui-button type="default" size="large">按钮</qui-button>
<qui-button type="primary" size="medium">按钮</qui-button>
```

### Props 属性说明

> 具体的一些属性请看 [https://uniapp.dcloud.io/component/button](https://uniapp.dcloud.io/component/button) ，不过有有部分参数不一样，如下主要是展示不一样的部分

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
|size | 按钮的大小(default\|medium\|large)| string |default |
|type| 按钮的样式（primary\|warn\|success\|default）|string |default |
|plain| 按钮是否空心，背景白色 |boolean |false |
| @click| 点击事件（点击按钮时触发）|handler| - |

`hover-class`，`hover-start-time`，`hover-stay-time` 去掉了，其它参数不变。