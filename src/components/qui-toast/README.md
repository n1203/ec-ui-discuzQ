# Toast 轻提示

## 使用

在 `template` 中使用组件
```html
<qui-toast ref="toast"></qui-toast>
```

在 `script` 中调用 `qui-toast` 方法

```javascript
  ...
  methods: {
    showToast() {
      this.$refs.toast.show({ message: '这是一个轻提示' });
    },
    showSuccess() {
      this.$refs.toast.show({
        type: 'icon',
        message: '这是一个轻提示',
        icon: 'icon-success',
      });
    },
    showLoading() {
      // 不会自动消失，需要主动调用 hideLoading 或者 close 方法
      this.$refs.toast.showLoading({ message: '正在加载中...' });
      setTimeout(() => {
        this.$refs.toast.hideLoading(); // 或者 this.$refs.toast.close();
      }, 2000);
    },
  },
  ...
```

### 方法

| 方法 | 说明 | 参数 |
| ---- | ---- | ---- |
| show | 显示轻提示 | object |
| close | 关闭轻提示 | - |
| showLoading | 显示 Loading 轻提示 | object |
| hideLoading | 关闭轻提示 | - |

`show` 方法的参数说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| type | 提示类型（'text'\|'icon'\|'loading'） | string | 'text' |
| icon | 图标名称，具体需要查看 qui-icon 中 font-icon.scss 文件中的图标样式名称 | string | - |
| message | 提示的信息 | string | - |
| position | 提示位置（'top'\|'middle'\|'bottom'） | string | 'middle' |
| duration | 展示时长(ms)，值为 0 时，toast 不会消失 | number | - |

`showLoading` 方法的参数说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| icon | 图标名称，具体需要查看 qui-icon 中 font-icon.scss 文件中的图标样式名称 | string | 'icon-loading' |
| message | 提示的信息 | string | 正在加载 |
| position | 提示位置（'top'\|'middle'\|'bottom'） | string | 'middle' |
