<template>
  <view class="no-data">
    <view class="no-data__body">
      <qui-icon :name="iconName" color="#aaa" size="25"></qui-icon>
      <text class="tips">{{ tips || i18n.t('discuzq.list.noData') }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    tips: {
      type: String,
      default: '',
    },
    iconName: {
      type: String,
      default: 'icon-noData',
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.no-data {
  padding: 44px 0rpx 40rpx;
  font-size: 28rpx;
  color: --color(--qui-FC-AAA);
  text-align: center;
}
.tips {
  margin-left: 20rpx;
}
</style>
