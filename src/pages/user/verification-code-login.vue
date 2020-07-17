<template>
  <qui-page :data-qui-theme="theme">
    <!-- #ifdef H5-->
    <qui-header-back title="" :is-show-more="false"></qui-header-back>
    <!-- #endif -->
    <view class="new" @click.stop="toggleBox">
      <view class="verification-code-login-box-h">{{ i18n.t('user.phoneNumberLogin') }}</view>
      <view class="new-phon">
        <view class="new-phon-test">
          {{ i18n.t('user.phoneNumber') }}
        </view>
        <view class="new-phon-number">
          <input
            class="new-phon-num"
            type="number"
            v-model="phoneNumber"
            :focus="true"
            :cursor="1"
            @input="changeinput"
            maxlength="11"
          />
          <button class="new-phon-send" @click="sendVerificationCode" :disabled="disabled">
            {{ btnContent }}
          </button>
        </view>
      </view>
      <view class="newphon-erro" v-if="formeerro">
        {{ formeerro }}
      </view>
      <!-- 验证码 -->
      <view class="new-input" @click.stop="fourse">
        <view class="new-input-test">
          {{ i18n.t('modify.placeentercode') }}
        </view>
        <qui-input-code
          @getdata="btndata"
          :title="tit"
          :text="test"
          :show="inshow"
          :isiphonex="inisIphone"
          ref="quiinput"
        ></qui-input-code>
      </view>
      <view class="verification-code-login-box-btn" @click="login">
        {{ i18n.t('user.login') }}
      </view>
      <view
        class="verification-code-login-box-pwdlogin"
        @click="jump2PhoneNumberLogin"
        v-if="code !== 'undefined'"
      >
        {{ i18n.t('user.passwordLogin') }}
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
      tit: false,
      test: '',
      inshow: false,
      inisIphone: false,
      formeerro: '',
      btnContent: '发送验证码',
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
      this.time = 60;
      this.countdown();
      this.sendSMS();
    },
    // 60s倒计时
    countdown() {
      if (this.time > 1) {
        this.time -= 1;
        this.btnContent = `${this.time}秒后重发`;
        this.disabled = true;
        this.timer = setTimeout(this.countdown, 1000);
        this.isGray = true;
      } else if (this.time === 1) {
        this.btnContent = '获取验证码';
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
      };
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          if (res) {
            console.log('短信发送成功', res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    login() {
      if (this.phoneNumber === '') {
        this.showDialog('手机号不能为空');
      } else if (this.verificationCode === '') {
        this.showDialog('验证码不能为空');
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
          console.log('手机号验证成功', res);
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
      console.log('跳转到密码登录页面');
      uni.navigateTo({
        url: `/pages/user/phone-number-login?url=${this.url}&validate=${this.forums.set_reg.register_validate}&token=${this.token}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.verification-code-login-box-h {
  margin: 60rpx 0rpx 80rpx 40rpx;
  font-size: 50rpx;
  font-weight: bold;
  color: --color(--qui-FC-333);
}
.new {
  width: 100vw;
  height: 100vh;
  /* #ifdef H5 */
  padding: 44px 0rpx 0rpx;
  /* #endif */
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
