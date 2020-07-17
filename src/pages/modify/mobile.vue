<template>
  <qui-page :data-qui-theme="theme" class="page-mobile">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('modify.mobiletitle')"></qui-header-back>
    <!-- #endif -->
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
        <button class="modify-phon-send" v-if="sun" @click="btnButton" :disabled="noclick">
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

export default {
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
    };
  },
  onLoad() {
    this.userid = this.usersid;
    this.senduser();
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
      this.sendsms();
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
      const params = {
        _jv: {
          type: 'sms/send',
        },
        type: 'verify',
      };
      const postphon = status.run(() => this.$store.dispatch('jv/post', params));
      postphon
        .then(res => {
          this.num -= 1;
          this.second = res._jv.json.data.attributes.interval;
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
    toggleBox() {
      this.inshow = false;
    },
    empty() {
      const empty = this.$refs.quiinput;
      empty.deleat();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.page-mobile /deep/ {
  .input {
    width: 100vw;
    height: 100vh;
    /* #ifdef H5 */
    padding-top: 100rpx;
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
    margin-left: 80rpx;
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
