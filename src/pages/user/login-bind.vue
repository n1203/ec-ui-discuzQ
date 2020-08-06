<template>
  <qui-page :data-qui-theme="theme">
    <view class="login-bind-box">
      <view class="login-bind-box-h">{{ i18n.t('user.loginBind') }}</view>
      <view class="login-bind-box-con">
        <input
          class="input"
          maxlength="15"
          :placeholder="i18n.t('user.username')"
          placeholder-style="color: #ddd"
          v-model="username"
        />
        <input
          class="input"
          type="password"
          maxlength="50"
          :placeholder="i18n.t('user.password')"
          placeholder-style="color: #ddd"
          v-model="password"
        />
      </view>
      <view class="login-bind-box-btn" @click="login">
        {{ i18n.t('user.loginBindId') }}
      </view>
      <view class="login-bind-box-register" @click="jump2RegisterBind">
        {{ i18n.t('user.registerBindId') }}
      </view>
    </view>
    <qui-registration-agreement></qui-registration-agreement>
  </qui-page>
</template>

<script>
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import { SITE_PAY } from '@/common/const';

export default {
  mixins: [forums, user],
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      url: '', // 上一个页面的路径
      code: '', // 注册邀请码
      token: '', // token
      validate: false, // 开启注册审核
      site_mode: '', // 站点模式
      isPaid: false, // 是否付费
    };
  },
  onLoad(params) {
    const { url, validate, token, commentId, code } = params;
    if (url) {
      let pageUrl;
      if (url.substr(0, 1) !== '/') {
        pageUrl = `/${url}`;
      } else {
        pageUrl = url;
      }
      if (commentId) {
        this.url = `${pageUrl}&commentId=${commentId}`;
      } else {
        this.url = pageUrl;
      }
    }
    if (validate) {
      this.validate = JSON.parse(validate);
    }
    if (code !== 'undefined') {
      this.code = code;
    }
    if (token) {
      this.token = token;
    }
    if (this.forums && this.forums.set_site && this.forums.set_site.site_mode) {
      this.site_mode = this.forums.set_site.site_mode;
    }
    if (this.user && this.user.paid) {
      this.isPaid = this.user.paid;
    }
  },
  created() {
    uni.$on('logind', () => {
      let url = '';
      if (this.url) {
        url = this.url;
      }
      if (this.site_mode !== SITE_PAY) {
        uni.navigateTo({
          url,
        });
      }
      if (this.site_mode === SITE_PAY && !this.isPaid) {
        uni.navigateTo({
          url: '/pages/site/info',
        });
      }
    });
  },
  destroyed() {
    uni.$off('logind');
  },
  methods: {
    login() {
      if (this.username === '') {
        this.showDialog(this.i18n.t('user.usernameEmpty'));
      } else if (this.password === '') {
        this.showDialog(this.i18n.t('user.passwordEmpty'));
      } else {
        const params = {
          data: {
            attributes: {
              username: this.username,
              password: this.password,
              token: this.token,
            },
          },
        };
        this.$store
          .dispatch('session/h5Login', params)
          .then(res => {
            console.log(res);
            this.logind();
            uni.showToast({
              title: this.i18n.t('user.loginBindSuccess'),
              duration: 2000,
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    showDialog(title) {
      uni.showToast({
        icon: 'none',
        title,
        duration: 2000,
      });
    },
    jump2RegisterBind() {
      uni.navigateTo({
        url: `/pages/user/register-bind?url=${this.url}&validate=${this.validate}&token=${this.token}&code=${this.code}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.login-bind-box {
  height: 100vh;
  font-size: $fg-f28;
  background-color: --color(--qui-BG-2);

  &-h {
    padding: 60rpx 0rpx 80rpx 40rpx;
    font-size: 50rpx;
    font-weight: bold;
    color: --color(--qui-FC-333);
  }

  &-con {
    margin: 0rpx 40rpx;

    .input {
      width: 100%;
      height: 100rpx;
      padding: 0rpx 0rpx 0rpx 20rpx;
      font-size: $fg-f34;
      line-height: 100rpx;
      text-align: left;
      border-bottom: 2rpx solid --color(--qui-BOR-ED);
    }
  }

  &-btn {
    width: 670rpx;
    height: 90rpx;
    margin: 50rpx auto 0rpx;
    line-height: 90rpx;
    color: --color(--qui-FC-FFF);
    text-align: center;
    background-color: --color(--qui-MAIN);
    border-radius: 5rpx;
  }

  &-register {
    margin: 20rpx 0rpx 0rpx 40rpx;
    font-size: $fg-f28;
    color: --color(--qui-LINK);
  }
}
</style>
