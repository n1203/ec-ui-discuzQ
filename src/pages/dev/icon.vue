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
        'icon-unfold',
        'icon-fold',
        'icon-loading2',
        'icon-loading1',
        'icon-loading',
        'icon-load',
        'icon-rmb',
        'icon-percent',
        'icon-success',
        'icon-fail',
        'icon-mine',
        'icon-search',
        'icon-folding-r',
        'icon-fill',
        'icon-wx-pay',
        'icon-wallet-pay',
        'icon-reward',
        'icon-pay',
        'icon-management',
        'icon-image',
        'icon-comments',
        'icon-collection',
        'icon-collectioned',
        'icon-waring',
        'icon-follow',
        'icon-each-follow',
        'icon-cancel-follow',
        'icon-selected',
        'icon-play',
        'icon-oval',
        'icon-expression',
        'icon-call',
        'icon-add',
        'icon-delete',
        'icon-wx-friends',
        'icon-word',
        'icon-video',
        'icon-share1',
        'icon-share',
        'icon-screen',
        'icon-publish',
        'icon-poster',
        'icon-post',
        'icon-message',
        'icon-message1',
        'icon-link',
        'icon-like',
        'icon-liked',
        'icon-img',
        'icon-home',
        'icon-close',
        'icon-wxPay',
        'icon-walletPay',
        'icon-message-n',
        'icon-noData',
        'icon-circle',
        'icon-back',
        'icon-close1',
        'icon-wei',
        'icon-more',
        'icon-resources',
        'icon-ZIP',
        'icon-XLSX',
        'icon-XLS',
        'icon-TXT',
        'icon-RAR',
        'icon-PSD',
        'icon-PPT',
        'icon-PDF',
        'icon-MP4',
        'icon-MP3',
        'icon-LINK',
        'icon-IPA',
        'icon-EXE',
        'icon-EPS',
        'icon-DOC',
        'icon-DOCX',
        'icon-CDR',
        'icon-CAD',
        'icon-APK',
        'icon-AI',
        'icon-7ZIP',
        'icon-sort',
        'icon-bold',
        'icon-title',
        'icon-italic',
        'icon-quote',
        'icon-code',
        'icon-link1',
        'icon-unordered-list',
        'icon-ordered-list',
        'icon-fujian',
        'icon-undeline',
        'icon-strikethrough',
        'icon-sort1',
        'icon-home-icon',
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
