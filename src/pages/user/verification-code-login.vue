<template>
  <qui-page :data-qui-theme="theme" class="verification-code-login-box">
    <view class="new" @click.stop="toggleBox">
      <view class="verification-code-login-box-h">{{ i18n.t('user.phoneNumberLogin') }}</view>
      <view class="new-phon">
        <view class="new-phon-test">{{ i18n.t('user.phoneNumber') }}</view>
        <view class="new-phon-number">
          <input
            class="new-phon-num"
            type="number"
            v-model="phoneNumber"
            @input="changeinput"
            maxlength="11"
          />
          <button
            class="new-phon-send"
            @click="sendVerificationCode"
            id="TencentCaptcha"
            :data-appid="(forums.qcloud && forums.qcloud.qcloud_captcha_app_id) || ''"
            :disabled="disabled"
          >
            {{ btnContent }}
          </button>
        </view>
      </view>
      <view class="newphon-erro" v-if="formeerro">{{ formeerro }}</view>
      <!-- 验证码 -->
      <view class="new-input" @click.stop="fourse">
        <view class="new-input-test">{{ i18n.t('modify.placeentercode') }}</view>
        <qui-input-code
          @getdata="btndata"
          :title="tit"
          :text="test"
          :show="inshow"
          :isiphonex="inisIphone"
          ref="quiinput"
        ></qui-input-code>
      </view>
      <view class="verification-code-login-box-btn" @click="login">{{ i18n.t('user.login') }}</view>
      <view
        class="verification-code-login-box-pwdlogin"
        @click="jump2PhoneNumberLogin"
        v-if="code !== 'undefined'"
      >
        {{ i18n.t('user.passwordLogin') }}
      </view>
    </view>
    <qui-registration-agreement></qui-registration-agreement>
  </qui-page>
</template>

<script>
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import { SITE_PAY } from '@/common/const';
// #ifdef  H5
import tcaptchs from '@/utils/tcaptcha';
// #endif

export default {
  mixins: [
    forums,
    user,
    // #ifdef  H5
    tcaptchs,
    // #endif
  ],
  data() {
    return {
      tit: false,
      test: '',
      inshow: false,
      inisIphone: false,
      formeerro: '',
      btnContent: this.i18n.t('modify.sendverificode'),
      time: 0, // 倒计时
      timer: '', // 定时器
      disabled: true, // 发送验证码按钮的状态
      phoneNumber: '', // 手机号
      verificationCode: '', // 验证码
      url: '', // 上一个页面的路径
      code: '', // 注册邀请码
      token: '', // token
      validate: false, // 开启注册审核
      site_mode: '', // 站点模式
      isPaid: false, // 是否付费
      captcha: null, // 腾讯云验证码实例
      captcha_ticket: '', // 腾讯云验证码返回票据
      captcha_rand_str: '', // 腾讯云验证码返回随机字符串
      captchaResult: {},
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
    changeinput() {
      setTimeout(() => {
        this.phoneNumber = this.phoneNumber.replace(/[^\d]/g, '');
      }, 30);
      if (this.phoneNumber.length === 11) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    fourse() {
      this.inshow = true;
    },
    btndata(num) {
      this.verificationCode = num;
    },
    // 发送验证码
    sendVerificationCode() {
      if (this.forums.qcloud.qcloud_captcha) {
        if (!this.ticket || !this.randstr) {
          this.toTCaptcha();
          return false;
        }
      } else {
        this.time = 60;
        this.countdown();
        this.sendSMS();
      }
    },
    // h5内发布按钮验证码验证
    // #ifdef H5
    toTCaptcha() {
      // eslint-disable-next-line no-undef
      this.captcha = new TencentCaptcha(this.forums.qcloud.qcloud_captcha_app_id, res => {
        if (res.ret === 0) {
          this.ticket = res.ticket;
          this.randstr = res.randstr;
          // 验证通过后发布
          this.time = 60;
          this.countdown();
          this.sendSMS();
        }
        if (res.ret === 2) {
          this.postLoading = false;
          uni.hideLoading();
        }
      });
      // 显示验证码
      this.captcha.show();
    },
    // #endif
    // 60s倒计时
    countdown() {
      if (this.time > 1) {
        this.time -= 1;
        this.btnContent = `${this.time}${this.i18n.t('modify.retransmission')}`;
        this.disabled = true;
        this.timer = setTimeout(this.countdown, 1000);
        this.isGray = true;
      } else if (this.time === 1) {
        this.btnContent = this.i18n.t('modify.sendverificode');
        clearTimeout(this.timer);
        this.disabled = false;
        this.isGray = false;
      }
    },
    // 发送短信
    sendSMS() {
      const params = {
        _jv: {
          type: 'sms/send',
        },
        mobile: this.phoneNumber,
        type: 'login',
        captcha_ticket: this.ticket,
        captcha_rand_str: this.randstr,
      };
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          if (res) {
            this.ticket = '';
            this.randstr = '';
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    login() {
      if (this.phoneNumber === '') {
        this.showDialog(this.i18n.t('user.phonenumberEmpty'));
      } else if (this.verificationCode === '') {
        this.showDialog(this.i18n.t('user.verificationCodeEmpty'));
      } else {
        this.verifyPhoneNumber();
      }
    },
    // 验证手机号
    verifyPhoneNumber() {
      const params = {
        data: {
          attributes: {
            mobile: this.phoneNumber,
            code: this.verificationCode,
            type: 'login',
          },
        },
      };
      if (this.token && this.token !== '') {
        params.data.attributes.token = this.token;
      }
      if (this.code && this.code !== 'undefined') {
        params.data.attributes.inviteCode = this.code;
      }
      this.$store
        .dispatch('session/verificationCodeh5Login', params)
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
    },
    showDialog(title) {
      uni.showToast({
        icon: 'none',
        title,
        duration: 2000,
      });
    },
    toggleBox() {
      this.inshow = false;
    },
    jump2PhoneNumberLogin() {
      uni.navigateTo({
        url: `/pages/user/phone-number-login?url=${this.url}&validate=${this.forums.set_reg.register_validate}&token=${this.token}&code=${this.code}`,
      });
    },
  },
  onUnload() {
    // 隐藏验证码
    if (this.captcha) {
      this.captcha.destroy();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.verification-code-login-box {
  background-color: --color(--qui-BG-2);
}

.verification-code-login-box-h {
  padding-top: 20px;
  margin: 0 0rpx 80rpx 40rpx;
  font-size: 50rpx;
  font-weight: bold;
  color: --color(--qui-FC-333);
}
.new {
  width: 100vw;
  background-color: --color(--qui-BG-2);
  box-sizing: border-box;
}
.new-phon {
  width: 710rpx;
  margin-left: 40rpx;
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
.new-phon-send {
  display: block;
  height: 70rpx;
  min-width: 180rpx;
  margin: 15rpx 0 0 91rpx;
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 70rpx;
  color: --color(--qui-FC-FFF);
  text-align: center;
  background: --color(--qui-BG-HIGH-LIGHT);
  border-radius: 5rpx;
}
.new-input {
  width: 710rpx;
  margin: 0 0 0 40rpx;
}
.new-input-test {
  font-size: $fg-f28;
  font-weight: 400;
  line-height: 100rpx;
  color: --color(--qui-FC-777);
  opacity: 1;
}
.new-vftion-input {
  display: flex;
  width: 100%;
  height: 100rpx;
}
.new-button {
  margin: 52rpx 40rpx 0;
}
.verification-code-login-box-btn {
  width: 670rpx;
  height: 90rpx;
  margin: 50rpx auto 0rpx;
  line-height: 90rpx;
  color: --color(--qui-FC-FFF);
  text-align: center;
  background-color: --color(--qui-MAIN);
  border-radius: 5rpx;
}
.verification-code-login-box-pwdlogin {
  margin: 20rpx 0rpx 0rpx 40rpx;
  font-size: $fg-f28;
  color: --color(--qui-LINK);
}
</style>
