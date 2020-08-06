<template>
  <view :class="cssClass">
    <view class="qui-loading--circular">
      <qui-icon :name="name" :color="color" :size="size"></qui-icon>
    </view>
    <text class="qui-loading__text" :style="{ color: textColor, 'font-size': textSize + 'px' }">
      <slot />
    </text>
  </view>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#ccc',
    },
    name: {
      type: String,
      default: 'icon-loading',
    },
    size: {
      type: [Number, String],
      default: 30,
    },
    textSize: {
      type: [Number, String],
      default: 14,
    },
    textColor: {
      type: String,
      default: '#888',
    },
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cssClass() {
      if (!this.vertical) return 'qui-loading';
      return 'qui-loading--vertical';
    },
  },
};
</script>

<style lang="scss" scoped>
.qui-loading {
  position: relative;
  display: inline-flex;
  font-size: 0;
  align-items: center;
  &--circular {
    display: inline-block;
    animation: qui-circular 1.5s linear infinite;
  }
  &__text {
    display: inline-block;
    margin-left: 16rpx;
    font-size: 28rpx;
    color: #888;
    vertical-align: middle;
  }
  &--vertical {
    display: inline-flex;
    flex-direction: column;
    align-items: center;

    .qui-loading__text {
      margin: 8rpx 0 0;
    }
  }
}

@keyframes qui-circular {
  0% {
    transform-origin: center;
    transform: rotate(0deg);
  }

  100% {
    transform-origin: center;
    transform: rotate(360deg);
  }
}
</style>
