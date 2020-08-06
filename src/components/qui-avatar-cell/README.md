# AvatarCell 头像单元格

## 使用
在 `template` 中使用 AvatarCell
 
**基础功能**
```html
<qui-avatar-cell
  center
  right-color="#777"
  :mark="item.id"
  :title="item.title"
  :value="item.value"
  :label="item.label"
  :icon="item.icon"
></qui-avatar-cell>
```

**多选功能**
```html
<checkbox-group @change="changeCheck">
 <label v-for="item in avatarData">
  <qui-avatar-cell
    center
    right-color="red"
    :mark="item.id"
    :key="item.id"
    :title="item.title"
    :value="item.value"
    :label="item.label"
    :icon="item.icon"
  >
    <checkbox slot="rightIcon" :value="item.id"></checkbox>
  </qui-avatar-cell>
 </label>
</checkbox-group>
```

**关注页面**
```html
<qui-avatar-cell
  center
  :mark="item.id"
  v-for="item in avatarData" :key="item.id"
  :title="item.title"
  :value="item.value"
  :label="item.label"
  :icon="item.icon"
>
  <qui-icon slot="rightIcon" name="icon-each-follow"></qui-icon>
</qui-avatar-cell>
```

### Props 属性说明

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
|title|左侧名称|String|-
|value|右侧内容|String|-
|label|左侧下面名称|String|-
|mark|名称id(一般传用户ID)|Number|-
|icon|左侧图标|String|-
|center|开启左侧下面名称,开启时右侧内容字体颜色更改为777|Boolean|false
|rightColor|右侧内容颜色，支持格式：`color_name`、`hex_number`、`rgb_number`、`rgba_number`|String|#AAA

### Event 事件说明

| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
|@click|点击头像单元格时触发|返回参数`mark`传的值
|@change|<checkbox-group>中选中项发生改变是触发 change 事件，detail = {value:[选中的checkbox的value的数组]}|选中的checkbox的value的数组

### Slots

| 名称 | 说明 |
| ---- | ---- |
| rightIcon | 右侧内容图标 |