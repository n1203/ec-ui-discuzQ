# Loading 加载

## 使用

在 `template` 中使用 Loading 加载

```html
<qui-pay
  ref="payShow"
  money="1"
  :wallet-status="true"
  :pay-password="pwdVal"
  balance="10"
  :pay-type-data="payTypeData"
  :to-name="thread.user.username"
  pay-type="图片查看"
  @radioMyHead="radioMyHead"
  @radioChange="radioChange"
  @onInput="onInput"
  @paysureShow="paysureShow"
></qui-pay>
```

### Props 属性说明

| 参数            | 说明                 | 类型           | 默认值               |
| --------------- | -------------------- | -------------- | -------------------- |
| walletStatus    | 钱包设置支付密码状态 | boolean        | false                |
| payUrl          | 设置钱包支付密码路由 | string         | /pages/modify/paypwd |
| descriptionShow | 钱包描述是否显示     | boolean        | true                 |
| money           | 支付金额             | string\|number | 0                    |
| balance         | 余额                 | string\|number | 0                    |
| payType     | 支付类型文案         | string         | 权限                 |
| toName          | 支付于用户 name      | string         |                      |
| payTypeData     | 支付方式数组         | array          | [                    |

          {
            name: '微信支付',
            icon: 'icon-wxPay',
            color: '#09bb07',
            value: '0',
          },
        ];                 |

| payPassword | 支付密码 | string | |
| payType | 支付类型 | string | 权限 |

### 事件说明

| 事件          | 说明                       | 返回值       |
| ------------- | -------------------------- | ------------ |
| @radioMyHead  | 是否选中显示头像           | event: Event |
| @payClickShow | 是否显示弹框               | event: Event |
| @paysureShow  | 是否显示钱包密码支付框     | event: Event |
| @radioChange  | 支付方式单选框 change 事件 | event: Event |
| @onInput      | 输入密码完成               | event: Event |
