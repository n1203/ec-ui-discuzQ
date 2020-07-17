<template>
  <qui-page :data-qui-theme="theme" class="page-setphon">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('modify.setphontitle')"></qui-header-back>
    <!-- #endif -->
    <view class="new" @click.stop="toggleBox">
      <view class="new-phon" v-if="phon">
        <view class="new-phon-test">
          {{ i18n.t('modify.newphonnumber') }}
        </view>
        <view class="new-phon-number">
          <input
            class="new-phon-num"
            type="number"
            v-model="newphon"
            :focus="true"
            :cursor="1"
            @input="changeinput"
            maxlength="11"
          />
          <button class="new-phon-send" v-if="sun" @click="btnButton" :disabled="disabtype">
            {{ i18n.t('modify.sendverificode') }}
          </button>
          <button class="new-phon-send" disabled v-else>
            {{ second + i18n.t('modify.retransmission') }}
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
      <view class="new-button">
        <qui-button type="primary" size="large" @click="dingphon">
          {{ i18n.t('modify.submission') }}
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
      iptValue: '',
      isFocus: false,
      second: 60,
      num: 5,
      tit: false,
      test: '',
      sun: true,
      phon: true,
      newphon: '',
      setnum: '',
      icon: 'none',
      duration: 2000,
      inshow: false,
      inisIphone: false,
      typebind: 'bind',
      disabtype: true,
      formeerro: '',
      novice: '',
      interval: '',
    };
  },
  onLoad(arr) {
    this.userid = this.usersid;
    this.typebind = arr.type || 'bind';
  },
  computed: {
    usersid() {
      return this.$store.getters['session/get']('userId');
    },
  },
  methods: {
    changeinput() {
      setTimeout(() => {
        this.newphon = this.newphon.replace(/[^\d]/g, '');
      }, 30);
      if (this.newphon.length < 11) {
        this.disabtype = true;
      } else if (this.newphon.length === 11) {
        this.disabtype = false;
        this.novice = this.newphon.replace(/\s+/g, '');
      }
    },
    fourse() {
      this.inshow = true;
    },
    // setValue(event) {
    //   // 文本框输入事件
    //   const { value } = event.target;
    //   setTimeout(() => {
    //     this.iptValue = value.replace(/[^\d\s]/ig,"");
    //   }, 1); // 重点
    // },
    btndata(num) {
      this.setnum = num;
    },
    // 点击获取验证码计时开始
    btnButton() {
      this.setphon();
      const num = 1;
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.second -= num;
      }, 1000);
      setTimeout(() => {
        clearInterval(this.interval);
        this.sun = true;
      }, 60000);
    },
    dingphon() {
      if (this.newphon) {
        this.bindphon();
      }
    },
    // 新手机号发送验证码
    setphon() {
      const params = {
        _jv: {
          type: 'sms/send',
        },
        mobile: this.novice,
        type: this.typebind,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/post', params));
      postphon
        .then(res => {
          this.num -= 1;
          this.second = res._jv.json.data.attributes.interval;
          this.sun = false;
        })
        .catch(err => {
          if (err.statusCode === 500) {
            const [
              {
                detail: [sun],
              },
            ] = err.data.errors;
            this.formeerro = sun;
            this.sun = true;
            uni.showToast({
              icon: this.icon,
              title: sun,
              duration: this.duration,
            });
          } else if (err.statusCode === 422) {
            uni.showToast({
              icon: this.icon,
              title: err.data.errors[0].detail[0],
              duration: this.duration,
            });
            const [
              {
                detail: [sun],
              },
            ] = err.data.errors;
            this.formeerro = sun;
            this.sun = true;
          }
        });
    },
    // 验证手机号
    bindphon() {
      const _this = this;
      const params = {
        _jv: {
          type: 'sms/verify',
        },
        mobile: this.newphon,
        code: this.setnum,
        type: this.typebind,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/post', params));
      postphon
        .then(res => {
          if (res) {
            uni.showToast({
              title: this.i18n.t('modify.phontitle'),
              duration: 1000,
            });
            const param = {
              _jv: {
                type: 'forum',
              },
            };
            _this.$store.dispatch('jv/get', param).then(() => {
              // console.log(1, 'froums');
            });
            const promsget = {
              _jv: {
                type: 'users',
                id: this.userid,
              },
              // include: 'groups',
            };
            _this.$store.dispatch('jv/get', promsget).then(() => {});
            if (this.typebind === 'bind') {
              // #ifdef H5
              uni.navigateBack({
                delta: 1,
              });
              // #endif
              // #ifndef H5
              uni.navigateBack({
                delta: 1,
                success() {
                  const pages = getCurrentPages();
                  pages[1].onLoad();
                },
              });
              // #endif
            } else {
              // #ifdef H5
              uni.navigateBack({
                delta: 2,
              });
              // #endif
              // #ifndef H5
              uni.navigateBack({
                delta: 2,
                success() {
                  const pages = getCurrentPages();
                  pages[1].onLoad();
                },
              });
              // #endif
            }
          }
        })
        .catch(err => {
          uni.showToast({
            icon: this.icon,
            title: this.i18n.t('modify.valifailed'),
            duration: 2000,
          });
          if (err.statusCode === 422) {
            this.tit = true;
            if (err.data.errors.length > 1) {
              const [
                {
                  detail: [arr],
                },
                {
                  detail: [sun],
                },
              ] = err.data.errors;
              this.formeerro = arr;
              this.test = sun;
            } else {
              const [
                {
                  detail: [sun],
                },
              ] = err.data.errors;
              this.test = sun;
            }
          } else if (err.statusCode === 500) {
            this.test =
              this.i18n.t('modify.validionerro') + this.num + this.i18n.t('modify.frequency');
            this.tit = true;
            this.empty();
            if (this.num < 0) {
              this.test = this.i18n.t('modify.lateron');
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
.page-setphon /deep/ {
  .new {
    width: 100vw;
    height: 100vh;
    /* #ifdef H5 */
    padding-top: 100rpx;
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
}
.new-button /deep/.qui-button--button {
  &[size='large'] {
    font-size: $fg-f28;
    color: --color(--qui-FC-FFF);
    border-radius: 7rpx;
  }
}
</style>
