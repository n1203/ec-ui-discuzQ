# qui-upload-file 附件上传

## 使用

在 `template` 中使用
```html
<qui-upload-file  url="接口地址" header="请求头" file-format="支持的文件类型" file-size="支持的文件大小">></cell-item>
```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| url | 接口地址 | string | 空 |
| header | 请求头 | string| 空 |
| file-format | 支持的文件类型 | string | 空 |
| file-size | 支持的文件大小 | string| 空 |
| maxLength | 文件最大长度 | Number| 3 |
| showAdd | 是否显示上传按钮 | Boolean | true |

### 事件说明

| 事件 | 说明 | 返回值 |
| ---- | ---- | ---- |
| uploadBtn | 点击上传 | event: Event |
| deleteItem | 删除附件 | event: Event |
| getValue | 获取附件数组 | event: Event |
| setValue | 赋值附件数组 | event: Event |
| uploadFile | 接口上传 | event: Event |