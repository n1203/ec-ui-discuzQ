<template>
  <view class="auth">
    <view class="auth__header">
      <qui-icon @tap="close" class="auth__header__close" name="icon-close" size="36"></qui-icon>
    </view>
    <view class="auth__content">
      <image
        class="auth__content__image"
        mode="aspectFit"
        :src="(forums && forums.set_site && forums.set_site.site_logo) || '/static/logo.png'"
      ></image>

      <qui-button
        type="primary"
        open-type="getUserInfo"
        @getuserinfo="handleGetUserInfo"
        lang="zh_CN"
        size="medium"
      >
        {{ t.userinfo }}
      </qui-button>
    </view>
  </view>
</template>

<script>
import forums from '@/mixin/forums';
import user from '@/mixin/user';

export default {
  mixins: [forums, user],
  computed: {
    t() {
      return this.i18n.t('auth');
    },
  },
  methods: {
    handleGetUserInfo(res) {
      if (res.detail.errMsg === 'getUserInfo:ok') {
        // eslint-disable-next-line no-unused-vars
        this.$store
          .dispatch('session/login')
          .then(data => {
            this.logind();
            this.$emit('login', { res, data });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$emit('login', { res });
      }
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.auth {
  height: 400rpx;
  background: --color(--qui-BG-2);
  &__header {
    padding: 30rpx 32rpx;
    text-align: right;
    &__close {
      justify-content: flex-end;
      color: --color(--qui-FC-AAA);
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &__image {
      max-height: 65rpx;
      margin: 10rpx 0 57rpx;
    }
  }
}
</style>
