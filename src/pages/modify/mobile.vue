<template>
  <qui-page :data-qui-theme="theme" class="page-mobile">
    <view class="input" @click.stop="toggleBox">
      <view class="mobile-titel">
        {{ i18n.t('modify.verifyoldphon') }}
      </view>
      <!-- 已绑定手机号码验证 -->
      <view class="modify-phon" v-if="phon">
        <view class="modify-phon-test">
          {{ i18n.t('modify.phonbound') }}
        </view>
        <view :class="userphon ? 'modify-phon-sun' : 'modify-phon-sun1'">
          {{ userphon ? userphon : i18n.t('modify.phonnumberempty') }}
        </view>
        <button
          class="modify-phon-send"
          v-if="sun"
          @click="sendsms"
          :disabled="noclick"
          id="TencentCaptcha"
          :data-appid="(forums.qcloud && forums.qcloud.qcloud_captcha_app_id) || ''"
        >
          {{ i18n.t('modify.sendverificode') }}
        </button>
        <button class="modify-phon-send" disabled v-else>
          {{ second + i18n.t('modify.retransmission') }}
        </button>
      </view>
      <!-- 验证码 -->
      <view class="modify-input" @click.stop="fourse">
        <view class="modify-input-test">
          {{ i18n.t('modify.placeentercode') }}
        </view>
        <qui-input-code
          @getdata="btndata"
          :title="judge"
          :text="test"
          :show="inshow"
          :isiphonex="inisIphone"
          ref="quiinput"
        ></qui-input-code>
      </view>
      <view class="modify-button">
        <qui-button type="primary" size="large" @click="submission">
          {{ judge ? i18n.t('modify.nextsetp') : i18n.t('modify.submission') }}
        </qui-button>
      </view>
    </view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';
// #ifdef  H5
import tcaptchs from '@/utils/tcaptcha';
// #endif

export default {
  mixins: [
    forums,
    // #ifdef  H5
    tcaptchs,
    // #endif
  ],
  data() {
    return {
      userid: '',
      second: 60,
      sun: true,
      phon: true,
      userphon: '', // 我的手号码加密
      userphone1: '', // 手机号
      coum: '',
      judge: false,
      test: '',
      icon: 'none',
      num: 5,
      duration: 2000,
      inshow: false,
      inisIphone: false,
      noclick: false,
      detail: '',
      captcha: null, // 腾讯云验证码实例
      ticket: '',
      randstr: '',
      captchaResult: {},
    };
  },
  onLoad() {
    this.userid = this.usersid;
    this.senduser();
    // 接受验证码captchaResult
    this.$u.event.$on('captchaResult', result => {
      console.log(result, 'resultresultresultresultresult');
      this.ticket = result.ticket;
      this.randstr = result.randstr;
      console.log('111');
      this.btnButton();
      this.verstype();
    });
    this.$u.event.$on('closeChaReault', () => {
      // this.postLoading = false;
      uni.hideLoading();
    });
  },
  computed: {
    usersid() {
      return this.$store.getters['session/get']('userId');
    },
  },
  methods: {
    fourse() {
      this.inshow = true;
    },
    getCode() {
      this.showText = false;
      const interval = setInterval(() => {
        this.second -= 1;
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        this.showText = true;
      }, 60000);
    },
    // 点击获取验证码计时开始
    btnButton() {
      this.sun = !this.sun;
      const interval = setInterval(() => {
        this.second -= 1;
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        this.sun = !this.sun;
        this.second = 60;
      }, 60000);
    },
    // 获取用户信息
    senduser() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        include: ['groups', 'wechat'],
      };
      const man = status.run(() => this.$store.dispatch('jv/get', params));
      man.then(res => {
        this.userphon = res.mobile;
        this.userphone1 = res.originalMobile;
        if (!this.userphon) {
          this.noclick = true;
        }
      });
    },
    // 发送短信接口
    sendsms() {
      console.log('9999');
      if (this.forums.qcloud.qcloud_captcha) {
        if (!this.ticket || !this.randstr) {
          console.log('腾讯云验证已经开启');
          this.verification();
          return false;
        }
      } else {
        console.log('腾讯云验证未开启');
        this.second = 60;
        this.btnButton();
        this.verstype();
      }
    },
    btndata(num) {
      this.coum = num;
    },
    // 验证短信
    submission() {
      const params = {
        _jv: {
          type: 'sms/verify',
        },
        code: this.coum,
        type: 'verify',
      };
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          if (res) {
            uni.navigateTo({
              url: '/pages/modify/setphon?type=rebind',
            });
          }
        })
        .catch(err => {
          uni.showToast({
            icon: this.icon,
            title: this.i18n.t('modify.valifailed'),
            duration: 2000,
          });
          if (err.statusCode === 422) {
            this.judge = true;
            const [
              {
                detail: [sun],
              },
            ] = err.data.errors;
            this.test = sun;
          } else if (err.statusCode === 500) {
            this.test =
              this.i18n.t('modify.validionerro') + this.num + this.i18n.t('modify.frequency');
            this.judge = true;
            this.empty();
            if (this.num < 0) {
              this.test = this.i18n.t('modify.lateron');
            }
          }
        });
    },
    // 发送短信
    verstype() {
      const params = {
        _jv: {
          type: 'sms/send',
        },
        type: 'verify',
        captcha_ticket: this.ticket,
        captcha_rand_str: this.randstr,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/post', params));
      postphon
        .then(res => {
          this.num -= 1;
          this.second = res._jv.json.data.attributes.interval;
          this.ticket = '';
          this.randstr = '';
        })
        .catch(err => {
          if (err.statusCode === 500) {
            uni.showToast({
              icon: this.icon,
              title: this.lateron,
              duration: this.duration,
            });
          }
        });
    },
    verification() {
      // #ifdef MP-WEIXIN
      // const _this = this;
      wx.navigateToMiniProgram({
        appId: 'wx5a3a7366fd07e119',
        path: '/pages/captcha/index',
        envVersion: 'release',
        extraData: {
          appId: this.forums.qcloud.qcloud_captcha_app_id, // 您申请的验证码的 appId
        },
        success() {
          console.log('验证码成功打开');
        },
        fail() {
          uni.hideLoading();
          // _this.postLoading = false;
        },
      });
      // #endif
      // #ifdef H5
      // eslint-disable-next-line no-undef
      this.captcha = new TencentCaptcha(this.forums.qcloud.qcloud_captcha_app_id, res => {
        if (res.ret === 0) {
          this.ticket = res.ticket;
          this.randstr = res.randstr;
          // 验证通过后发布
          console.log('验证码发送');
          this.second = 60;
          this.btnButton();
          this.verstype();
        }
        if (res.ret === 2) {
          // this.postLoading = false;
          // uni.hideLoading();
        }
      });
      // 显示验证码
      this.captcha.show();
      // #endif
    },
    toggleBox() {
      this.inshow = false;
    },
    empty() {
      const empty = this.$refs.quiinput;
      empty.deleat();
    },
  },
  // onUnload() {
  //   this.$u.event.$off('captchaResult');
  //   this.$u.event.$off('closeChaReault');
  //   // 隐藏验证码
  //   if (this.captcha) {
  //     this.captcha.destroy();
  //   }
  // },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.page-mobile /deep/ {
  background-color: --color(--qui-BG-2);
  box-sizing: border-box;
  .input {
    width: 100vw;
    /* #ifndef H5 */
    height: 100vh;
    /* #endif */
    background-color: --color(--qui-BG-2);
    box-sizing: border-box;
  }
  .mobile-titel {
    padding: 31rpx 0 0 40rpx;
    font-size: $fg-f50;
    font-weight: bold;
    line-height: 60rpx;
    color: --color(--qui-FC-333);
    box-sizing: border-box;
  }
  .modify-phon {
    display: flex;
    height: 100rpx;
    justify-content: space-between;
    margin-left: 40rpx;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .modify-phon-test {
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-FC-777);
  }
  .modify-phon-sun {
    margin-left: 40rpx;
    font-size: $fg-f34;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-FC-00);
    opacity: 1;
  }
  .modify-phon-sun1 {
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-FC-777);
  }
  .modify-phon-send {
    display: block;
    height: 70rpx;
    min-width: 180rpx;
    margin: 15rpx 40rpx 0;
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 70rpx;
    color: --color(--qui-FC-FFF);
    background-color: --color(--qui-BG-BTN);
    border-radius: 5rpx;
  }
  .modify-input {
    width: 710rpx;
    margin: 0 0 0 40rpx;
  }
  .modify-input-test {
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-FC-777);
    opacity: 1;
  }
  .modify-button {
    width: 670rpx;
    margin: 52rpx auto 0;
  }
}
.modify-button /deep/.qui-button--button {
  &[size='large'] {
    font-size: $fg-f28;
    color: --color(--qui-FC-FFF);
    border-radius: 7rpx;
  }
}
</style>
