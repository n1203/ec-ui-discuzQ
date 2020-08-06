<template>
  <qui-page :data-qui-theme="theme" class="site-management-box">
    <view class="site-management-box-list" v-for="listItem in list" :key="listItem.id">
      <navigator :url="listItem.url" hover-class="none">
        <qui-cell-item :title="listItem.title" arrow :slot-right="listItem.slotRight">
          <text>{{ listItem.text }}</text>
        </qui-cell-item>
      </navigator>
    </view>
  </qui-page>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          id: 1,
          url: '/pages/manage/member',
          title: this.i18n.t('manage.manageMembers'),
          slotRight: true,
          text: this.i18n.t('manage.setting'),
        },
        {
          id: 2,
          url: '/pages/manage/invite',
          title: this.i18n.t('manage.inviteMembers'),
          slotRight: false,
          text: '',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scope>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.site-management-box {
  background-color: --color(--qui-BG-2);

  &-list {
    padding: 0rpx 0rpx 0rpx 40rpx;

    .cell-item {
      padding: 0rpx 40rpx 0rpx 0rpx;
    }
  }
}
</style>
