<template>
  <qui-page :data-qui-theme="theme">
    <!-- #ifdef H5-->
    <qui-header-back title="" :is-show-more="false"></qui-header-back>
    <!-- #endif -->
    <view class="login-box">
      <view class="login-box-h">{{ i18n.t('user.login') }}</view>
      <view class="login-box-con">
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
      <view class="login-box-btn" @click="login">
        {{ i18n.t('user.login') }}
      </view>
      <view class="login-box-ft" v-if="register">
        <view @click="jump2Register">
          {{ i18n.t('user.noexist') }}
        </view>
        <!-- 开启短信功能才显示 -->
        <view @click="jump2findPassword" v-if="qcloud_sms">
          {{ i18n.t('user.forgetPassword') }}
        </view>
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
      validate: false, // 开启注册审核
      site_mode: '', // 站点模式
      isPaid: false, // 是否付费
      qcloud_sms: false, // 默认不开启短信功能
      register: true, // 默认展示注册链接
    };
  },
  onLoad(params) {
    console.log('登录');
    this.$store.dispatch('forum/setError', {
      code: 'user_login',
      status: 200,
    });
    console.log('params', params);
    const { url, validate, register } = params;
    if (url) {
      this.url = url;
    }
    if (validate) {
      this.validate = JSON.parse(validate);
    }
    if (register) {
      this.register = JSON.parse(register);
    }
    console.log('register', typeof this.register);
    console.log('validate', typeof this.validate);
    console.log('----this.forums-----', this.forums);
    if (this.forums && this.forums.set_site && this.forums.set_site.site_mode) {
      this.site_mode = this.forums.set_site.site_mode;
    }
    if (this.forums && this.forums.qcloud) {
      this.qcloud_sms = this.forums.qcloud.qcloud_sms;
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
            },
          },
        };
        this.$store
          .dispatch('session/h5Login', params)
          .then(res => {
            console.log('登录成功', res);
            this.logind();
            uni.showToast({
              title: this.i18n.t('user.loginSuccess'),
              duration: 2000,
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    jump2Register() {
      console.log('跳转到注册页面');
      uni.navigateTo({
        url: `/pages/user/register?url=${this.url}&validate=${this.validate}`,
      });
    },
    jump2findPassword() {
      console.log('跳转到找回密码页面');
      uni.navigateTo({
        url: `/pages/modify/findpwd?pas=reset_pwd`,
      });
    },
    showDialog(title) {
      uni.showToast({
        icon: 'none',
        title,
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.login-box {
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

  &-ft {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20rpx 40rpx 0rpx;
    color: --color(--qui-LINK);
  }
}
</style>
