# Uploader 上传功能（图片/视频）

## 使用
在 `template` 中使用 Uploader
 
**基础功能**
```html
 <qui-uploader
  url="https://dq.comsenz-service.com/api/attachments"
  :header="header"
  :form-data="formData"
  async-clear="true"
  ref="upload"
  :file-preview="filePreview"
  @change="uploadChange"
  @clear="uploadClear"
></qui-uploader>
```

**异步删除**
##### 说明
需要调用接口删除图片情况下使用。使用的时候开启`async-clear="true"`功能。
在子组件上绑定`ref`，然后在绑定`clear`的方法内，使用`this.$refs.upload.clear(del)`触发组件内的`clear`方法。
```html
    <qui-uploader
      url="https://dq.comsenz-service.com/api/attachments"
      :header="header"
      :form-data="formData"
      async-clear="true"
      ref="upload"
      :file-preview="filePreview"
      @change="uploadChange"
      @clear="uploadClear"
    ></qui-uploader>

    methods: {
      uploadClear(list, del) {
          this.$refs.upload.clear(del);
      },
    }
```

**使用图标唤醒上传**
##### 说明
不使用组内的`add`按钮，使用组件外部按钮，唤醒上传功能。
触发组件`uploadClick`事件。
```html
 methods: {
   childClick() {
     // 图标式唤起上传
     this.$refs.upload.uploadClick();
   },
 }
```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
|url|上传地址|String|-
|type|上传类型(image、video)|String|image
|header|请求头部|Object|-
|formData|请求携带data|Object|-
|name|上传file类型(附件：file，头像：avatar)|String|file
|count|上传总数量|Number|9
|asyncClear|是否使用异步删除|Boolean|false
|filePreview|服务器预览图片|Array|-
|delayTime|服务器返回预览(看服务器卡顿情况设定)|Number|500

### Event 事件说明

| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
|@clear|删除图片|默认返回值，删除后的数组和删除的图片信息。开启异步删除功能后，返回删除的图片信息和删除的下标，调用clear后传入index
|@change|上传功能|返回已上传的数组

### Event 内部事件
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
|clear|删除图片|传删除图片的下标
|uploadClick|上传功能|图标式唤起上传
