<template>
  <qui-page :data-qui-theme="theme">
    <!-- #ifdef H5-->
    <qui-header-back title="站点管理"></qui-header-back>
    <!-- #endif -->
    <view class="manage-items">
      <navigator url="/pages/manage/member" hover-class="none">
        <qui-cell-item :title="i18n.t('manage.manageMembers')" arrow slot-right>
          <text>{{ i18n.t('manage.setting') }}</text>
        </qui-cell-item>
      </navigator>
      <navigator url="/pages/manage/invite" hover-class="none">
        <qui-cell-item :title="i18n.t('manage.inviteMembers')" arrow></qui-cell-item>
      </navigator>
    </view>
  </qui-page>
</template>

<style lang="scss" scope>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.manage-items {
  height: 100vh;
  padding: 0rpx 0rpx 0rpx 40rpx;
  /* #ifdef H5 */
  margin: 44px 0rpx 0rpx;
  /* #endif */
  background: --color(--qui-BG-2);

  .cell-item {
    padding: 0rpx 40rpx 0rpx 0rpx;
  }
}
</style>
