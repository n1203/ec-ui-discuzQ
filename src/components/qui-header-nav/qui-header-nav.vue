<template>
  <view class="qui-back">
    <view class="qui-back__body">
      <view class="qui-back__body__content">
        <view class="qui-back__body__content-title">
          <qui-icon
            class="icon-back"
            size="32"
            :color="theme === $u.light() ? '#333' : '#fff'"
            @tap="back"
          ></qui-icon>
          <text @tap="back">{{ title }}</text>
        </view>
      </view>
      <view class="qui-back_body__right" v-if="slotRight">
        <slot></slot>
      </view>
      <view class="qui-back__body__right" v-if="!slotRight">
        <qui-icon
          name="icon-home"
          size="32"
          :color="theme === $u.light() ? '#777' : '#fff'"
          @tap="backPage"
        ></qui-icon>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'QuiHeaderNav',
  props: {
    title: {
      type: String,
      default: '',
    },
    slotRight: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    back() {
      window.history.back(-1);
    },
    backPage() {
      uni.navigateTo({
        url: '/pages/home/index',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.qui-back {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: 0 40rpx;
  background: --color(--qui-BG-2);
  box-sizing: border-box;
}
.qui-back__body {
  position: relative;
  display: flex;
  height: 44px;
  align-items: center;
  justify-content: space-between;
}
.qui-back__body__content-title {
  font-size: $fg-f28;
  font-weight: bold;
  color: --color(--qui-FC-333);
  transition: $switch-theme-time;
}
.qui-back__body__content-title .qui-icon {
  margin-right: 18rpx;
}
.qui-back__body__content {
  flex: 1 1 0%;
}
.icon-back {
  margin-left: -10rpx;
}
</style>
