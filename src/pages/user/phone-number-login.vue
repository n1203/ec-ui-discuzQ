<template>
  <qui-page :data-qui-theme="theme">
    <view class="new">
      <view class="phone-number-login-box-h">{{ i18n.t('user.phoneNumberLogin') }}</view>
      <view class="new-phon">
        <view class="new-phon-test">
          {{ i18n.t('user.phoneNumber') }}
        </view>
        <view class="new-phon-number">
          <input class="new-phon-num" type="number" v-model="username" maxlength="11" />
        </view>
      </view>
      <view class="new-phon">
        <view class="new-phon-test">
          {{ i18n.t('user.pwd') }}
        </view>
        <view class="new-phon-number">
          <input class="new-phon-num" type="password" maxlength="50" v-model="password" />
        </view>
      </view>
      <view class="phone-number-login-box-btn" @click="login">
        {{ i18n.t('user.login') }}
      </view>
      <view class="phone-number-login-box-ft">
        <view @click="jump2VerificationCodeLogin">
          {{ i18n.t('user.verificationCodeLogin') }}
        </view>
        <view @click="jump2findPassword">
          {{ i18n.t('user.forgetPassword') }}
        </view>
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
      username: '', // 手机号
      password: '', // 密码
      url: '', // 上一个页面的路径
      token: '', // token
      code: '', // 注册邀请码
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
    this.token = token;
    if (this.forums && this.forums.set_site && this.forums.set_site.site_mode) {
      this.site_mode = this.forums.set_site.site_mode;
    }
    if (this.user && this.user.paid) {
      this.isPaid = this.user.paid;
    }
  },
  created() {
    this.$u.event.$on('logind', () => {
      if (this.site_mode !== SITE_PAY) {
        uni.navigateTo({
          url: this.url,
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
        this.showDialog(this.i18n.t('user.phonenumberEmpty'));
      } else if (this.password === '') {
        this.showDialog(this.i18n.t('user.passwordEmpty'));
      } else {
        const params = {
          data: {
            attributes: {
              username: this.username,
              password: this.password,
            },
          },
        };
        if (this.token && this.token !== '') {
          params.data.attributes.token = this.token;
        }
        if (this.code !== '') {
          params.data.attributes.code = this.code;
        }
        this.$store
          .dispatch('session/h5Login', params)
          .then(res => {
            console.log(res);
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
    jump2VerificationCodeLogin() {
      uni.navigateTo({
        url: `/pages/user/verification-code-login?url=${this.url}&validate=${this.forums.set_reg.register_validate}&token=${this.token}&code=${this.code}`,
      });
    },
    jump2findPassword() {
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

.phone-number-login-box-h {
  padding-top: 20px;
  margin: 0 0rpx 80rpx 40rpx;
  font-size: 50rpx;
  font-weight: bold;
  color: --color(--qui-FC-333);
}
.new {
  width: 100vw;
  height: 100vh;
  background-color: --color(--qui-BG-2);
  box-sizing: border-box;
}
.new-phon {
  width: 710rpx;
  margin: 0rpx 40rpx;
  font-size: $fg-f50;
  font-weight: bold;
  line-height: 100rpx;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  box-sizing: border-box;
}
.new-phon-test {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
}
.new-phon-number {
  display: flex;
}
.new-phon-num {
  width: 399rpx;
  height: 100rpx;
  font-size: $fg-f50;
  font-weight: bold;
  line-height: 100rpx;
  color: --color(--qui-FC-333);
}
.newphon-erro {
  margin: 20rpx 0 0 40rpx;
  font-size: $fg-f24;
  font-weight: 400;
  color: --color(--qui-RED);
}
.new-vftion-input {
  display: flex;
  width: 100%;
  height: 100rpx;
}
.new-button {
  margin: 52rpx 40rpx 0;
}

.phone-number-login-box-btn {
  width: 670rpx;
  height: 90rpx;
  margin: 50rpx auto 0rpx;
  line-height: 90rpx;
  color: --color(--qui-FC-FFF);
  text-align: center;
  background-color: --color(--qui-MAIN);
  border-radius: 5rpx;
}

.phone-number-login-box-ft {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20rpx 40rpx 0rpx;
  font-size: $fg-f28;
  color: --color(--qui-LINK);
}
</style>
