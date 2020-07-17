<template>
  <text :class="tagClass" :style="tagStyle" @click="handleClick">
    <slot />
  </text>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default',
    },
    // small, medium, large
    size: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    plain: {
      type: Boolean,
      default: false,
    },
    textColor: {
      type: String,
      default: '',
    },
  },
  computed: {
    tagClass() {
      const { type, plain, size } = this;
      let cls = `qui-tag qui-tag--${type}`;
      if (plain) cls = `${cls} qui-tag--plain`;
      if (size) cls = `${cls} qui-tag--${size}`;
      return cls;
    },
    tagStyle() {
      let styl = '';
      const { color, textColor } = this;
      if (color) styl = `background-color: ${color};`;
      if (textColor) styl += `color: ${textColor};`;
      return styl;
    },
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt);
    },
  },
};
</script>

<style lang="scss" scoped>
$default-bg-color: rgba(249, 250, 252, 1);
$primary-bg-color: rgba(24, 120, 243, 1);
$success-bg-color: #07c160;
$danger-bg-color: #ee0a24;
$warning-bg-color: #ff976a;
$plain-bg-color: #fff;

$border-bg-color: rgba(204, 221, 255, 1);

$txt-color-white: #fff;
$txt-color-grey: rgba(119, 119, 119, 1);

$font-size-sm: 24rpx;
$font-size-md: 26rpx;
$font-size-lg: 28rpx;

$padding-sm: 14rpx;
$padding-md: 20rpx;
$padding-lg: 26rpx;

.qui-tag {
  display: inline-flex;
  align-items: center;
  padding: $padding-md;
  font-size: $font-size-md;
  color: $txt-color-white;
  border: 1px solid currentColor;
  border-radius: 7rpx;
  box-sizing: border-box;

  &--default {
    color: $txt-color-grey;
    background-color: $default-bg-color;
    &.qui-tag--plain {
      color: $txt-color-grey;
    }
  }
  &--primary {
    background-color: $primary-bg-color;
    &.qui-tag--plain {
      color: $primary-bg-color;
    }
  }
  &--success {
    background-color: $success-bg-color;
    &.qui-tag--plain {
      color: $success-bg-color;
    }
  }
  &--danger {
    background-color: $danger-bg-color;
    &.qui-tag--plain {
      color: $danger-bg-color;
    }
  }
  &--warning {
    background-color: $warning-bg-color;
    &.qui-tag--plain {
      color: $warning-bg-color;
    }
  }
  &--plain {
    background-color: $plain-bg-color;
  }
  &--small {
    padding: $padding-sm;
    font-size: $font-size-sm;
  }
  &--large {
    padding: $padding-lg;
    font-size: $font-size-lg;
  }
}
</style>
