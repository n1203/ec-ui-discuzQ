<template>
  <qui-page :data-qui-theme="theme" class="page-paypwd">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('modify.paypwdtitle')"></qui-header-back>
    <!-- #endif -->
    <view class="setpw" @click.stop="toggleBox">
      <view class="setpw-input" v-if="pas" @click.stop="fourse">
        <view class="setpw-tit">
          {{ i18n.t('modify.enterpaymentpas') }}
        </view>
        <qui-input-code
          @getdata="btndata"
          :title="sun"
          :text="test"
          :show="inshow"
          :isiphonex="inisIphone"
          :number="types"
          ref="quiinput"
        ></qui-input-code>
      </view>
      <view class="setpw-input" v-else @click.stop="fourse">
        <view class="setpw-tit">
          {{ i18n.t('modify.enterpaymentagin') }}
        </view>
        <qui-input-code
          @getdata="btndata2"
          :title="sun"
          :text="test"
          :show="inshow"
          :isiphonex="inisIphone"
          :number="types"
          ref="quiinput"
        ></qui-input-code>
      </view>
    </view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      userid: '',
      pas: true,
      sun: false,
      types: 'password',
      test: '',
      inputpas: '',
      repeatpas: '',
      icon: 'none',
      time: 2000,
      inshow: true,
      inisIphone: false,
      usertokenid: '',
      currs: '',
      themid: '',
    };
  },
  onLoad(arr) {
    this.userid = this.usersid;
    if (arr) {
      this.usertokenid = arr.token || '';
    }
    if (this.setRouter) {
      this.themid = this.setRouter.replace(/[^0-9]/gi, '');
    }
  },
  computed: {
    usersid() {
      return this.$store.getters['session/get']('userId');
    },
    ...mapState({
      setRouter: state => state.pay.model,
    }),
  },
  methods: {
    fourse() {
      this.inshow = true;
    },
    btndata(num) {
      if (num.length >= 6) {
        this.inputpas = num;
        this.pas = false;
        this.empty();
      }
    },
    btndata2(sum) {
      if (sum.length >= 6) {
        this.mobelypas(sum);
      }
    },
    mobelypas(sum) {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        pay_password_token: this.usertokenid,
        payPassword: this.inputpas,
        pay_password_confirmation: sum,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/patch', params));
      postphon
        .then(res => {
          const pages = getCurrentPages();
          if (res) {
            uni.showToast({
              title: this.i18n.t('modify.paymentsucceed'),
              duration: 2000,
            });
            if (this.usertokenid) {
              // #ifdef H5
              uni.navigateBack({
                delta: 2,
              });
              // #endif
              // #ifndef H5
              uni.navigateBack({
                delta: 2,
              });
              pages[2].onLoad();
              // #endif
            } else if (this.themid) {
              // #ifdef H5
              uni.redirectTo({
                url: `/pages/topic/index?id=${this.themid}`,
              });
              // #endif
              // #ifndef H5
              uni.redirectTo({
                url: `/pages/topic/index?id=${this.themid}`,
                success() {
                  pages[1].onLoad();
                },
              });
              // #endif
            } else {
              // #ifdef H5
              uni.navigateBack({
                delta: 1,
              });
              // #endif
              // #ifndef H5
              uni.navigateBack({
                delta: 1,
                success() {
                  pages[1].onLoad(); // 执行前一个页面的onLoad方法
                },
              });
              // #endif
            }
          }
        })
        .catch(err => {
          if (err.statusCode === 422) {
            if (this.inputpas !== sum) {
              this.sun = true;
              this.test = this.i18n.t('modify.reenter');
              this.empty();
            } else if (this.inputpas === sum) {
              uni.showToast({
                icon: this.icon,
                title: this.i18n.t('modify.modification'),
                duration: this.time,
              });
              this.empty();
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
.page-paypwd /deep/ {
  .setpw {
    width: 100vw;
    height: 100vh;
    /* #ifdef H5 */
    padding-top: 100rpx;
    /* #endif */
    background-color: --color(--qui-BG-2);
    box-sizing: border-box;
  }
  .setpw-input {
    width: 710rpx;
    height: 200rpx;
    padding: 31rpx 0 0 40rpx;
    background: --color(--qui-BG-2);
    box-sizing: border-box;
  }
  .setpw-tit {
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-FC-777);
    opacity: 1;
  }
}
</style>
