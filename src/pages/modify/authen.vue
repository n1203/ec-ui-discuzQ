<template>
  <qui-page :data-qui-theme="theme" class="page-authen">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('modify.authontitle')"></qui-header-back>
    <!-- #endif -->
    <view class="authen" @click.stop="toggleBox">
      <view class="authen-input" @click.stop="fourse">
        <view class="authen-tit">
          {{ i18n.t('modify.authentication') }}
        </view>
        <qui-input-code
          @getdata="btndata"
          :title="sun"
          :text="test"
          :number="types"
          :show="inshow"
          :isiphonex="inisIphone"
          ref="quiinput"
        ></qui-input-code>
      </view>
      <view class="authen-forget" @click="forgetpay" v-if="forums.qcloud.qcloud_sms">
        {{ i18n.t('modify.forgetmanypassword') }}
      </view>
    </view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  data() {
    return {
      userid: '',
      pas: true,
      sun: false,
      types: 'password',
      test: '',
      status: '',
      inputpas: '',
      repeatpas: '',
      icon: 'none',
      inshow: true,
      inisIphone: false,
    };
  },
  onLoad() {
    this.userid = this.usersid;
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
    btndata(num) {
      if (num.length === 6) {
        this.mobelypas(num);
      }
    },
    // 验证信息获取token
    mobelypas(sum) {
      const params = {
        _jv: {
          type: 'users/pay-password/reset',
        },
        pay_password: sum,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/post', params));
      postphon
        .then(res => {
          if (res._jv.json.data.id) {
            uni.showToast({
              title: this.i18n.t('modify.authensucceeded'),
              duration: 2000,
            });
            const tokenid = res._jv.json.data.id;
            uni.navigateTo({
              url: `/pages/modify/paypwd?token=${tokenid}&id=${this.userid}`,
            });
          }
        })
        .catch(err => {
          uni.showToast({
            icon: this.icon,
            title: this.i18n.t('modify.authenfailed'),
            duration: 2000,
          });
          if (err.statusCode === 422) {
            this.sun = true;
            const [
              {
                detail: [sun],
              },
            ] = err.data.errors;
            this.test = sun;
          } else if (err.statusCode === 500) {
            this.sun = true;
            this.test = this.i18n.t('modify.passwordinputerro');
          }
          this.empty();
        });
    },
    forgetpay() {
      uni.redirectTo({
        url: `/pages/modify/findpwd?user=${this.userid}&pas=reset_pay_pwd`,
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
.page-authen /deep/ {
  .authen {
    width: 100vw;
    height: 100vh;
    /* #ifdef H5 */
    padding-top: 100rpx;
    /* #endif */
    background: --color(--qui-BG-2);
    box-sizing: border-box;
  }
  .authen-input {
    width: 710rpx;
    padding: 31rpx 0 0 40rpx;
    background: --color(--qui-BG-2);
    box-sizing: border-box;
  }
  .authen-tit {
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-FC-777);
  }
  .authen-forget {
    margin: 30rpx 0 0 40rpx;
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 37rpx;
    color: --color(--qui-LINK);
  }
  .authen-erro-messag1 {
    font-size: $fg-f24;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-RED);
  }
}
</style>
