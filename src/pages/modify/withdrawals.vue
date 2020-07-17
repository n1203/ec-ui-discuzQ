<template>
  <qui-page :data-qui-theme="theme" class="page-withdra">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('modify.withdratitle')"></qui-header-back>
    <!-- #endif -->
    <view class="cash" @click.stop="toggleBox">
      <view class="cash-content">
        <!-- 收款人 -->
        <view class="cash-content-tab">
          <qui-cell-item :title="i18n.t('modify.payee')" slot-right :arrow="false" :border="false">
            <test class="cash-content-name">
              {{ name }}
            </test>
          </qui-cell-item>
        </view>
        <!-- 可提现金额 -->
        <view class="cash-content-tab">
          <qui-cell-item
            :title="i18n.t('modify.withdrawable')"
            slot-right
            :arrow="false"
            :border="false"
          >
            <test class="cash-content-name">￥{{ balance }}</test>
          </qui-cell-item>
        </view>
        <!-- 提现金额 -->
        <view class="cash-content-tab">
          <qui-cell-item
            :title="i18n.t('modify.withdrawalamount')"
            slot-right
            :arrow="false"
            :border="false"
          >
            <input
              class="cash-content-input"
              type="digit"
              maxlength="10"
              v-model="cashmany"
              @input="settlement"
              :placeholder="i18n.t('modify.enteramount')"
              placeholder-style="color:rgba(221,221,221,1)"
            />
          </qui-cell-item>
        </view>
        <!-- 实际提现金额 -->
        <view class="cash-content-tabi">
          <qui-cell-item
            class="cash-content-tab-item"
            :title="i18n.t('modify.actualamout')"
            slot-right
            :arrow="false"
            :border="false"
          >
            <view class="cash-content-name cash-content-actual">
              <view class="cash-content-ellipsis2">
                {{ contint }}
              </view>
              <view class="cash-content-proced">
                {{
                  i18n.t('modify.servicechaege') +
                    procedures +
                    i18n.t('modify.percentage') +
                    percentage +
                    i18n.t('modify.percentagcon')
                }}
              </view>
            </view>
          </qui-cell-item>
        </view>
        <!-- 验证码 -->
        <view class="input">
          <!-- 已绑定手机号码验证 -->
          <view class="cash-phon" v-if="phon">
            <view class="cash-phon-test">
              {{ i18n.t('modify.phonnumber') }}
            </view>
            <view :class="usertestphon ? 'cash-phon-num' : 'cash-phon-num1'">
              {{ usertestphon ? usertestphon : i18n.t('modify.nohasphon') }}
            </view>
            <button class="cash-phon-send" v-if="sun" @click="btnButton" :disabled="disabtype">
              {{ i18n.t('modify.sendverificode') }}
            </button>
            <button class="cash-phon-send" disabled v-else>
              {{ second + i18n.t('modify.retransmission') }}
            </button>
          </view>
          <view class="cash-erro" v-if="casherro">
            {{ casherrotest }}
          </view>
          <!-- 验证码 -->
          <view class="cash-input" @click.stop="fourse">
            <view class="cash-input-test">
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
        </view>
        <view class="cash-button">
          <qui-button class="cash-button-sun" type="primary" size="large" @click="btncash">
            {{ i18n.t('modify.submission') }}
          </qui-button>
        </view>
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
      second: 60,
      num: 5,
      cashmany: '',
      name: '',
      balance: '',
      userphon: '',
      usertestphon: '',
      code: '',
      test: '',
      test2: '',
      judge: false,
      sun: true,
      phon: true,
      length: false,
      contint: '',
      procedures: 0,
      inshow: false,
      inisIphone: false,
      casherrotest: '',
      casherro: false,
      disabtype: false,
      percentage: 0,
      cost: 0,
      interval: '',
    };
  },
  onLoad() {
    this.userid = this.usersid;
    this.setmydata();
    this.$nextTick(() => {
      this.cost = this.forums.set_cash.cash_rate;
      this.percentage = this.forums.set_cash.cash_rate * 100;
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
    btndata(num) {
      this.code = num;
    },
    btncash() {
      this.verifytitle();
    },
    settlement() {
      setTimeout(() => {
        if (this.cashmany[0] === '.') {
          const num = 0;
          const cun = '.';
          this.cashmany = num + cun;
        }
        this.cashmany = this.cashmany
          .replace(/[^\d.]/g, '')
          .replace(/\.{2,}/g, '.')
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.')
          .replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
          .replace(/^\./g, '');
        if (Number(this.cashmany) > Number(this.balance)) {
          this.cashmany = this.cashmany.slice(0, this.cashmany.length - 1);
          uni.showToast({
            icon: 'none',
            title: this.i18n.t('modify.greaterthan'),
            duration: 2000,
          });
        }
        if (this.cashmany.length > 0) {
          this.length = true;
          const number = this.cashmany - this.cashmany * this.cost;
          if (number) {
            this.contint = `¥${number.toFixed(2)}`;
            const casnumber = this.cashmany * this.cost;
            this.procedures = casnumber.toFixed(2);
          } else {
            this.contint = '';
            this.procedures = '';
          }
        } else if (this.cashmany.length <= 0) {
          // this.length = false;
          this.contint = '';
          const casnumber = this.cashmany * this.cost;
          this.procedures = casnumber.toFixed(2);
        }
      }, 5);
    },
    // 点击获取验证码计时开始
    btnButton() {
      if (this.forums.qcloud.qcloud_sms === false) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('modify.NoteOpen'),
          duration: 2000,
        });
      } else {
        if (!this.usertestphon) {
          uni.showToast({
            icon: 'none',
            title: this.i18n.t('modify.nohasphon'),
            duration: 2000,
          });
          return;
        }
        this.posttitle();
        clearInterval(this.interval);
        this.sun = false;
        this.interval = setInterval(() => {
          this.second -= 1;
        }, 1000);
        setTimeout(() => {
          clearInterval(this.interval);
          this.sun = true;
          this.second = 60;
        }, 60000);
      }
    },
    // 获取个人信息
    setmydata() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        include: ['groups', 'wechat'],
      };
      this.$store.dispatch('jv/get', params).then(data => {
        this.name = data.username;
        this.balance = data.walletBalance;
        this.usertestphon = data.mobile;
        this.userphon = data.originalMobile;
        if (!this.usertestphon) {
          this.disabtype = true;
        }
      });
    },
    // 发动短信
    posttitle() {
      const params = {
        _jv: {
          type: 'sms/send',
        },
        type: 'verify',
      };
      const postphon = status.run(() => this.$store.dispatch('jv/post', params));
      postphon.then(res => {
        console.log(res);
        this.num -= 1;
        this.second = res._jv.json.data.attributes.interval;
      });
    },
    // 验证短信
    verifytitle() {
      const params = {
        _jv: {
          type: 'sms/verify',
        },
        code: this.code,
        type: 'verify',
      };
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          if (res) {
            this.cashwithdrawal();
          }
        })
        .catch(err => {
          if (err.statusCode === 500) {
            this.test =
              this.i18n.t('modify.validionerro') + this.num + this.i18n.t('modify.frequency');
            this.judge = true;
            this.empty();
            if (this.num <= 0) {
              this.test = this.i18n.t('modify.lateron');
            }
          } else if (err.statusCode === 422) {
            uni.showToast({
              icon: this.icon,
              title: err.data.errors[0].detail,
              duration: 2000,
            });
            this.empty();
          }
        });
    },
    // 提现申请
    cashwithdrawal() {
      const params = {
        _jv: {
          type: 'wallet/cash',
          include: ['user', 'userWallet'],
        },
        cash_apply_amount: this.cashmany,
      };
      const postcash = status.run(() => this.$store.dispatch('jv/post', params));
      postcash
        .then(res => {
          if (res) {
            this.cashmany = '';
            this.contint = '';
            this.procedures = 0;
            this.setmydata();
            this.sun = true;
            this.second = 60;
            clearInterval(this.interval);
            uni.showToast({
              title: this.i18n.t('modify.withdrawal'),
              duration: 2000,
            });
            // #ifdef H5
            setTimeout(() => {
              uni.navigateBack({
                delta: 1,
              });
            }, 1500);
            // #endif
            // #ifndef H5
            setTimeout(() => {
              uni.navigateBack({
                success() {
                  const pages = getCurrentPages();
                  pages[1].onLoad();
                },
              });
            }, 1500);
            // #endif
          }
        })
        .catch(err => {
          if (err.statusCode === 422) {
            uni.showToast({
              icon: 'none',
              title: err.data.errors[0].detail[0],
              duration: 2000,
            });
            this.empty();
          } else if (err.statusCode === 500) {
            uni.showToast({
              icon: 'none',
              title: err.data.errors[0].detail,
              duration: 2000,
            });
            this.empty();
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
.page-withdra /deep/ {
  .cash {
    width: 100vw;
    height: 100vh;
    /* #ifdef H5 */
    padding-top: 88rpx;
    /* #endif */
    background-color: --color(--qui-BG-2);
    box-sizing: border-box;
  }
  .cash-content {
    padding: 31rpx 0 0 40rpx;
    box-sizing: border-box;
  }
  .cash-content-tab,
  .cash-content-tabi {
    padding: 0 40rpx 0 0;
    justify-content: space-between;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .cash-content-tabi {
    /deep/.cell-item__body {
      align-items: flex-start;
      height: 150rpx;
      &__content {
        margin-top: 32rpx;
      }
      &__right {
        margin-top: 26rpx;
      }
    }
  }
  /deep/.cell-item__body__content-title {
    color: --color(--qui-FC-777);
  }
  /deep/.cash-content-tab-item {
    height: 150rpx;
  }
  .cash-content-name {
    font-size: $fg-f34;
    font-weight: 400;
    color: --color(--qui-FC-333);
  }
  .cash-content-input {
    width: 238rpx;
    height: 100%;
    font-size: $fg-f34;
    font-weight: bold;
    line-height: 100rpx;
    color: --color(--qui-FC-333);
    text-align: right;
  }
  // .cash-content-actual {
  //   padding-top: 26rpx;
  //   box-sizing: border-box;
  // }
  .cash-content-ellipsis {
    height: 50rpx;
    font-size: $fg-f24;
    font-weight: 400;
    line-height: 50rpx;
    color: --color(--qui-FC-333);
    text-align: right;
  }
  .cash-content-ellipsis2 {
    height: 45rpx;
    font-size: $fg-f34;
    font-weight: bold;
    line-height: 45rpx;
    color: --color(--qui-RED);
  }
  .cash-content-proced {
    height: 50rpx;
    margin-top: 11rpx;
    font-size: $fg-f24;
    font-weight: 400;
    line-height: 50rpx;
    color: --color(--qui-FC-777);
  }
  .cash-phon {
    display: flex;
    width: 710rpx;
    height: 100rpx;
    justify-content: space-between;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .cash-phon-test {
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-FC-777);
  }
  .cash-phon-num {
    margin: 0 0 0 100rpx;
    font-size: $fg-f34;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-FC-000);
  }
  .cash-phon-num1 {
    margin: 0 0 0 10rpx;
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-FC-777);
  }
  .cash-phon-send {
    display: block;
    height: 70rpx;
    min-width: 180rpx;
    margin: 15rpx 40rpx 0;
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 70rpx;
    color: --color(--qui-FC-FFF);
    text-align: center;
    background-color: --color(--qui-MAIN);
    border-radius: 5rpx;
  }
  .cash-erro {
    margin-top: 20rpx;
    font-size: $fg-f24;
    font-weight: 400;
    color: --color(--qui-RED);
  }
  .cash-input {
    width: 710rpx;
  }
  .cash-input-test {
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-FC-777);
  }
  .cash-vftion-input {
    display: flex;
    width: 100%;
    height: 100rpx;
  }
  .cash-button {
    margin: 52rpx 0 0;
    border-radius: 7rpx;
  }
  // /deep/.cash-button-sun {
  //   border-radius: 7rpx;
  // }
}
/* #ifndef H5 */
.cash-content-tabi {
  /deep/.cell-item__body {
    align-items: flex-start;
    height: 150rpx;
    &__content {
      margin-top: 32rpx;
    }
    &__right {
      margin-top: 26rpx;
    }
  }
}
/* #endif */
.cash-button /deep/.qui-button--button {
  &[size='large'] {
    font-size: $fg-f28;
    color: --color(--qui-FC-FFF);
    border-radius: 7rpx;
  }
}
</style>
