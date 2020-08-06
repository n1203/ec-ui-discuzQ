<template>
  <view class="qui-avatar" @click="click" @tap="click">
    <!--<img v-if="avatarUrl" :src="user.avatarUrl" :class="'qui-avatar-' + size" />-->
    <image
      v-if="avatarUrl"
      :src="user.avatarUrl"
      :class="'qui-ava qui-avatar-' + size"
      @error="error"
    ></image>
    <view v-else-if="styleText" :class="'avatar' + ' qui-avatar-' + size" :style="styleText">
      {{ usernameAt }}
    </view>
    <image v-if="isReal" src="@/static/auth.svg" class="auth-icon"></image>
  </view>
</template>

<script>
import stringToColor from '@/utils/stringToColor';

const sizes = {
  80: 'font-size: 24px;line-height: 80rpx;',
  70: 'font-size: 22px;line-height: 70rpx;',
  60: 'font-size: 20px;line-height: 60rpx;',
  50: 'font-size: 18px;line-height: 50rpx;',
};

export default {
  props: {
    user: {
      type: [Object, String],
      default() {
        return {};
      },
    },
    size: {
      type: [Number, String],
      default: 80,
    },
    isReal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      styleText: '',
    };
  },
  computed: {
    avatarUrl() {
      return this.user.avatarUrl && this.user.avatarUrl.indexOf('/static/noavatar.gif') !== 0;
    },
    usernameAt() {
      return this.user.username
        ? this.user.username.charAt(0).toUpperCase()
        : this.i18n.t('core.noavatar');
    },
  },
  mounted() {
    this.styleText = this.style();
  },
  methods: {
    style() {
      const color = stringToColor(this.usernameAt);
      return `background-color: #${color};${sizes[this.size]}`;
    },
    error() {
      this.user.avatarUrl = false;
    },
    click() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.qui-avatar {
  position: relative;
}
.qui-avatar .avatar,
.qui-ava {
  border-radius: 50%;
}

.qui-avatar-80 {
  width: 80rpx;
  height: 80rpx;
}
.qui-avatar-70 {
  width: 70rpx;
  height: 70rpx;
}
.qui-avatar-60 {
  width: 60rpx;
  height: 60rpx;
}
.qui-avatar-50 {
  width: 50rpx;
  height: 50rpx;
}

.qui-avatar .avatar {
  color: #fff;
  text-align: center;
  background-color: #e7edf3;
}
.auth-icon {
  position: absolute;
  right: 0;
  bottom: 4rpx;
  // z-index: 8;
  width: 22rpx;
  height: 26rpx;
}
</style>
