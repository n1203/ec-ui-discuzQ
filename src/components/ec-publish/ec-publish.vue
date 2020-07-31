<template>
  <view class="fbh publish">
    <view class="fb1 fbv publish_item">
      <view>最新版本</view>
      <view class="omit">V0.0.0-alpha20200721</view>
    </view>
    <view class="fb1 fbv publish_item">
      <view>安装教程</view>
      <view class="omit">文字版 · 视频版</view>
    </view>
    <view class="fb1 fbv publish_item">
      <view>下载主题</view>
      <view class="omit">@souwinds</view>
    </view>
  </view>
</template>

<script></script>

<style>
.publish {
  padding: 0 10px;
  width: 100%;
  box-sizing: border-box;
}
.publish_item {
  margin: 10px 5px 0px 5px;
  background: #0001;
  color: #555;
  padding: 10px;
  font-size: 14px;
  text-align: center;
  box-sizing: border-box;
  border-radius: 5px;
  width: 30%;
}
.omit {
  font-size: 12px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;    
}
</style>
