<template>
  <qui-page :data-qui-theme="theme">
    <!-- #ifdef H5-->
    <qui-header-back title="" :is-show-more="false"></qui-header-back>
    <!-- #endif -->
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
    console.log('params', params);
    const { url, validate, token, code } = params;
    if (url) {
      this.url = url;
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
    console.log('validate', typeof this.validate);
    console.log('----this.forums-----', this.forums);
    if (this.forums && this.forums.set_site && this.forums.set_site.site_mode) {
      this.site_mode = this.forums.set_site.site_mode;
    }
    this.$u.event.$on('logind', () => {
      if (this.user && this.user.paid) {
        this.isPaid = this.user.paid;
      }
      console.log('----this.user-----', this.user);
      if (this.site_mode !== SITE_PAY || this.isPaid) {
        uni.navigateTo({
          url: '/pages/home/index',
        });
      }
      if (this.site_mode === SITE_PAY && !this.isPaid) {
        uni.navigateTo({
          url: '/pages/site/info',
        });
      }
    });
  },
  methods: {
    login() {
      if (this.username === '') {
        this.showDialog('用户名不能为空');
      } else if (this.password === '') {
        this.showDialog('密码不能为空');
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
            console.log('登录绑定成功', res);
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
      console.log('注册并绑定页');
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
  /* #ifdef H5 */
  margin: 44px 0rpx 0rpx;
  /* #endif */
  font-size: $fg-f28;
  background-color: --color(--qui-BG-2);

  &-h {
    padding: 60rpx 0rpx 80rpx 40rpx;
    font-size: 50rpx;
    font-weight: bold;
    color: --color(--qui-FC-333);
  }

  &-con {
    margin: 0rpx 0rpx 0rpx 40rpx;

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
