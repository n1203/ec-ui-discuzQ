<template>
  <view :style="{ height: statusBarHeight }" class="uni-status-bar">
    <slot />
  </view>
</template>

<script>
const statusBarHeight = `${uni.getSystemInfoSync().statusBarHeight}px`;
export default {
  name: 'UniStatusBar',
  data() {
    return {
      statusBarHeight,
    };
  },
};
</script>

<style lang="scss" scoped>
.uni-status-bar {
  width: 750rpx;
  height: 20px;
  // height: var(--status-bar-height);
}
</style>
