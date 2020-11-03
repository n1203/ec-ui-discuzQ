<template>
  <view class="box">
    <view
      class="item fbv fbjc"
      v-for="(item, index) in datas"
      :key="index"
      @click="handleCopy(item)"
    >
      <qui-icon :name="item" size="48" color="#000" />
      <view class="text">
        {{ item }}
      </view>
    </view>
  </view>
</template>
<script>
import user from '@/mixin/user';
import forums from '@/mixin/forums';
import appCommonH from '@/utils/commonHelper';
import loginAuth from '@/mixin/loginAuth-h5';

export default {
  mixins: [user, forums, appCommonH, loginAuth],
  data: () => {
    return {
      datas: [
        'icon-unfold', // 箭头下
        'icon-fold', // 箭头下
        'icon-loading2', // 红心原点
        'icon-loading1',
        'icon-loading',
        'icon-load', // “,"
        'icon-rmb', // ¥
        'icon-percent', // %
        'icon-success', // 圆型空心勾
        'icon-fail', // 圆型空心错
        'icon-mine', // 我的
        'icon-search', // 搜索
        'icon-folding-r', // 箭头右
        'icon-fill', // 实心圆点
        'icon-wx-pay',
        'icon-wallet-pay',
        'icon-reward', // 爱心
        'icon-pay', // 圆型空心¥
        'icon-management', // 设置
        'icon-image', // 图片
        'icon-comments', // 消息
        'icon-collection', // 五角星
        'icon-collectioned', // 实心五角星
        'icon-waring', // ！
        'icon-guanzhu', // 爱心➕
        'icon-each-follow', // 爱心
        'icon-cancel-follow', // 爱心➖
        'icon-selected', // 圆型实心勾
        'icon-play', // 播放
        'icon-oval', // 实心点
        'icon-expression', // 笑脸
        'icon-call', // @
        'icon-add', // +
        'icon-delete', // 删除（垃圾箱图标）
        'icon-wx-friends', // 微信朋友
        'icon-word', // 段落文字
        'icon-video', // 视频播放按钮
        'icon-share1', // 分享
        'icon-share', // 分享
        'icon-screen', // 分类
        'icon-publish', // 圆形空心+
        'icon-poster', // 图片
        'icon-post', // 文件
        'icon-message', // 消息
        'icon-message1', // 消息
        'icon-link', // 链接
        'icon-like', // 点赞
        'icon-liked', // 点赞
        'icon-img', // 图片
        'icon-home', // 首页
        'icon-close', // x
        'icon-close1', // 实心x
        'icon-wxPay', // 微信支付
        'icon-walletPay', // 微信钱包
        'icon-message-n', // 消息（有消息显示实心点）
        'icon-noData', // 苦脸
        'icon-circle', // 实心圆点
        'icon-back', // 返回
        'icon-wei', // 话题#
        'icon-more', // ...
        'icon-resources', // ？文件
        'icon-ZIP', // 压缩包
        'icon-XLSX', // xls文件
        'icon-XLS', // xls文件
        'icon-TXT', // txt文件
        'icon-RAR', // rar文件
        'icon-PSD', // psd文件
        'icon-PPT', // ppt文件
        'icon-PDF', // pdf文件
        'icon-MP4', // mp4文件
        'icon-MP3', // mp3文件
        'icon-LINK', // link文件
        'icon-IPA', // ipa文件
        'icon-EXE', // exe文件
        'icon-EPS', // eps文件
        'icon-DOC', // doc文件
        'icon-DOCX', // docx文件
        'icon-CDR', // cdr文件
        'icon-CAD', // cad文件
        'icon-APK', // apk文件
        'icon-AI', // ai文件
        'icon-7ZIP', // 7zip文件
        'icon-sort', // 排序
        'icon-bold', // B
        'icon-title', // H
        'icon-italic', // I
        'icon-quote', // "
        'icon-code', // </>
        'icon-link1', // 链接🔗
        'icon-unordered-list', // 分类
        'icon-ordered-list', // 分类
        'icon-fujian', // 链接
        'icon-undeline', // 字母U下标
        'icon-strikethrough', // S
        'icon-sort1', // 降序
        'icon-home-icon', // 首页
      ],
    };
  },
  methods: {
    handleCopy: value => {
      const oInput = document.createElement('input');
      oInput.value = value;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      oInput.readOnly = true;
      oInput.id = 'copyInp';
      document.execCommand('Copy');
      oInput.setAttribute('onfocus', () => {
        oInput.blur();
        document.body.removeChild(oInput);
      });
      // 执行浏览器复制命令
      oInput.className = 'oInput';
      oInput.style.display = 'none';
      uni.showToast({
        icon: 'none',
        title: `${value} 复制成功`,
      });
    },
    copyFocus(obj) {
      obj.blur();
      document.body.removeChild(obj);
    },
  },
};
</script>
<style lang="scss">
.box {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.item {
  width: 160rpx;
  text-align: center;
  height: 160rpx;
  box-shadow: 0 0 10rpx #ccc;
  margin: 10rpx;
  box-sizing: border-box;
}
.text {
  font-size: 24rpx;
  color: #555;
  margin-top: 20rpx;
}
</style>
