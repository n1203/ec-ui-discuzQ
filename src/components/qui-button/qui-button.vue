<template>
  <button
    class="qui-button--button"
    :type="type"
    :size="size"
    :plain="plain"
    :disabled="disabled"
    :loading="loading"
    :form-type="formType"
    :open-type="openType"
    :hover-stop-propagation="hoverStopPropagation"
    :app-parameter="appParameter"
    :lang="lang"
    :session-from="sessionFrom"
    :send-message-title="sendMessageTitle"
    :send-message-path="sendMessagePath"
    :send-message-img="sendMessageImg"
    :show-message-card="showMessageCard"
    @getphonenumber="handleGetPhoneNumber"
    @getuserinfo="handleGetUserInfo"
    @error="handleError"
    @opensetting="handleOpenSetting"
    @launchapp="handleLaunchApp"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'default',
    },
    type: {
      type: String,
      default: 'default',
    },
    plain: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    formType: {
      type: String,
      default: '',
    },
    openType: {
      type: String,
      default: '',
    },
    appParameter: {
      type: String,
      default: '',
    },
    hoverStopPropagation: {
      type: Boolean,
      default: false,
    },
    lang: {
      type: String,
      default: 'zh_CN',
    },
    sessionFrom: {
      type: String,
      default: '',
    },
    sendMessageTitle: {
      type: String,
      default: '',
    },
    sendMessagePath: {
      type: String,
      default: '',
    },
    sendMessageImg: {
      type: String,
      default: '',
    },
    showMessageCard: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleGetPhoneNumber(evt) {
      this.$emit('getphonenumber', evt);
    },
    handleGetUserInfo(evt) {
      this.$emit('getuserinfo', evt);
    },
    handleError(evt) {
      this.$emit('error', evt);
    },
    handleOpenSetting(evt) {
      this.$emit('opensetting', evt);
    },
    handleLaunchApp(evt) {
      this.$emit('launchapp', evt);
    },
    handleClick(evt) {
      this.$emit('click', evt);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
// css
$default-bg-color: --color(--qui-BG-F9F);
$primary-bg-color: rgba(24, 120, 243, 1);
$success-bg-color: #07c160;
$danger-bg-color: #ee0a24;
$plain-bg-color: #fff;

$txt-color-grey: --color(--qui-FC-TAG);
$txt-color-white: #fff;
$text-color-333: #333;

$font-size-sm: 24rpx;
$font-size-md: 26rpx;
$font-size-lg: 28rpx;
$font-size-post: 40rpx;

.qui-button--button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: $txt-color-grey;
  background-color: $default-bg-color;
  border-radius: 7rpx;
  &[type='primary'] {
    color: $txt-color-white;
    background-color: $primary-bg-color;
  }
  &[type='warn'] {
    color: $txt-color-white;
    background-color: $danger-bg-color;
  }
  &[type='success'] {
    color: $txt-color-white;
    background-color: $success-bg-color;
  }
  &[size='large'] {
    width: 670rpx;
    height: 90rpx;
    font-size: $font-size-lg;
    border-radius: 0;
  }
  &[size='max'] {
    width: 100%;
    height: 90rpx;
    font-size: $font-size-lg;
  }
  &[size='medium'] {
    width: 510rpx;
    height: 90rpx;
    font-size: $font-size-md;
  }
  &[size='default'] {
    height: 70rpx;
    padding: 18rpx 20rpx;
    font-size: $font-size-sm;
  }
  &[size='post'] {
    width: 200rpx;
    height: 100rpx;
    font-size: $font-size-post;
  }
  &[plain][type='primary'] {
    color: $primary-bg-color;
    background-color: $plain-bg-color;
    border-color: currentColor;
  }
  &[plain][type='warn'] {
    color: $danger-bg-color;
    background-color: $plain-bg-color;
    border-color: currentColor;
  }
  &[plain][type='success'] {
    color: $success-bg-color;
    background-color: $plain-bg-color;
    border-color: currentColor;
  }
  &[plain][type='post'] {
    color: $text-color-333;
    background-color: $plain-bg-color;
    border: none;
    border-radius: 7rpx;
    box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
  }
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
