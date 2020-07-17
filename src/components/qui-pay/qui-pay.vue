<template>
  <view>
    <uni-popup ref="payPopup" type="bottom">
      <view class="popup-pay">
        <view class="popup-content">
          <view class="pay-title">{{ payType }}</view>

          <!--<qui-button size="100%" type="primary" class="pay-btn" @click="publishClick()">
            {{ p.pay }}{{ money }}{{ p.rmb }}
          </qui-button>-->
          <button class="pay-btn" @click="payChoice">
            {{ p.pay }}
            <view class="pay-num">￥{{ money }}</view>
            {{ p.rmb }}
          </button>
          <checkbox-group @change="radioMyHead">
            <label class="pay-radio">
              <view>
                <checkbox :value="checkVal" checked="true" class="radio" color="#2699fb" />
              </view>
              <view class="radio-word" :style="{ color: checkStatus ? '#2699fb' : '#999' }">
                {{ p.showMyHead }}
              </view>
            </label>
          </checkbox-group>
        </view>
        <view class="popup-content-space"></view>
        <text class="popup-cancel-btn" @click="cancel('1')">{{ p.cancel }}</text>
      </view>
    </uni-popup>
    <uni-popup ref="payTypePopup" type="bottom">
      <view class="popup-pay-type">
        <view class="pay-title">{{ payType }}</view>
        <view class="money-box">
          ￥
          <view class="money-num">{{ money }}</view>
        </view>
        <view class="pay-type-chi" v-for="(item, index) in payTypeData" :key="index">
          <radio-group @change="radioChange" class="pay-type-radio-box">
            <label class="pay-type-radio">
              <view class="pay-type-l">
                <qui-icon :name="item.icon" :color="item.color" class="icon-pay"></qui-icon>
                <view class="pay-type-word">{{ item.name }}</view>
              </view>
              <view class="pay-type-r">
                <view
                  class="check-tip"
                  v-if="!walletStatus && item.name === p.walletPay"
                  @click="payStatusClick"
                >
                  {{ p.passwordSetting }}
                </view>
                <view
                  class="check-tip"
                  v-else-if="descriptionShow && item.name === p.walletPay && money <= balance"
                >
                  {{ p.walletBalance }}，￥{{ balance }}
                </view>
                <view
                  class="check-tip"
                  v-else-if="descriptionShow && item.name === p.walletPay && money > balance"
                >
                  {{ p.walletBalanceNo }}{{ balance }}{{ p.rmb }}
                </view>

                <view>
                  <radio
                    :value="item.value"
                    :namr="item.index"
                    :checked="index === current"
                    class="radio"
                    color="#2699fb"
                    :disabled="
                      (descriptionShow && !walletStatus && item.name === p.walletPay) ||
                        (descriptionShow && !(money <= balance) && item.name === p.walletPay)
                    "
                  />
                </view>
              </view>
            </label>
          </radio-group>
        </view>

        <view class="pay-tip">
          ￥{{ money }}{{ p.rmb }}{{ p.payTo }}，{{ toName }}{{ p.ofAccount }}
        </view>
        <!--<qui-button size="max" type="primary" class="paySureBtn" @click="paysureShow">
          {{ p.surePay }}￥{{ money }}{{ p.rmb }}
        </qui-button>-->
        <button class="paySureBtn" @click="paysureShow">
          {{ p.surePay }}￥{{ money }}{{ p.rmb }}
        </button>
        <view class="popup-share-content-space"></view>

        <text class="popup-share-btn" @click="cancel('2')">取消</text>
      </view>
    </uni-popup>
    <uni-popup ref="keyboardPopup" type="center">
      <qui-pay-keyboard
        ref="keyboard"
        :show="show"
        :money="money"
        :password="payPassword"
        @onInput="onInput"
        @close="close"
      ></qui-pay-keyboard>
    </uni-popup>
  </view>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    threadId: {
      type: [String, Number],
      default: '',
    },
    // 钱包设置支付密码状态
    walletStatus: {
      type: Boolean,
      default: false,
    },
    // 设置钱包支付密码路由
    payUrl: {
      type: String,
      default: '/pages/modify/paypwd',
    },
    // 钱包描述是否显示
    descriptionShow: {
      type: Boolean,
      default: true,
    },
    // 支付金额
    money: {
      type: Number,
      default: 0,
    },
    // 余额
    balance: {
      type: Number,
      default: 0,
    },
    // 支付主题类型
    payType: {
      type: String,
      default: '获得权限',
    },
    // 支付于用户name
    toName: {
      type: String,
      default: '',
    },
    // 支付方式数组
    payTypeData: {
      type: Array,
      default: () => {
        return [
          {
            name: '微信支付',
            icon: 'icon-wxPay',
            color: '#09bb07',
            value: '0',
          },
        ];
      },
    },
    // 支付密码
    payPassword: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      password: '',
      trantision: false,
      show: false, // 输入支付密码是否显示
      payImmediatelyClick: false,
      checkVal: '1',
      checkStatus: true, // 单选框状态
      // checkStatusVal: 1, // 单选框状态
      current: 0,
    };
  },
  computed: {
    p() {
      return this.i18n.t('pay');
    },
  },
  watch: {
    payPassword(val) {
      this.show = val;
      this.descriptionShow = parseFloat(this.money) > parseFloat(this.balance);
      if (!val) {
        this.show = false;
      }
    },
    money: {
      handler(newVal) {
        console.log(newVal, '这是监听到的点赞数');
      },
      deep: true,
      immediate: true,
    },
  },
  onLoad() {},

  methods: {
    ...mapMutations({
      setRouter: 'pay/SET_ROUTER',
    }),
    // 是否选中显示头像
    radioMyHead(evt) {
      this.checkStatus = !this.checkStatus;
      // this.checkStatusVal = 1 ? 0 : 1;
      if (evt.target.value.length <= 0) {
        this.checkStatusVal = 1;
      } else {
        this.checkStatusVal = 0;
      }
      this.$emit('radioMyHead', this.checkStatus);
    },
    // 父组件触发是否显示弹框
    payClickShow(val) {
      console.log(val, '这是父组件触发的事件');
      if (val === 0) {
        this.$refs.payPopup.open();
      } else {
        this.$refs.payTypePopup.open();
      }
    },
    // 是否显示钱包密码支付框
    paysureShow() {
      if (this.current === 0) {
        console.log('这是微信支付');
      } else if (this.current === 1) {
        console.log('这是钱包支付');
        this.show = true;
        this.$refs.payTypePopup.close();
        this.$refs.keyboardPopup.open();
      }
      this.$emit('paysureShow', this.current);
    },
    // 支付方式单选框change事件
    radioChange(evt) {
      console.log('这是change事件');
      console.log(typeof evt.target.value, '这是value的类型');

      for (let i = 0; i < this.payTypeData.length; i += 1) {
        console.log(this.payTypeData[i].value);
        console.log(this.payTypeData[i].value, '如果');
        if (this.payTypeData[i].value === evt.target.value) {
          this.current = i;
          console.log(i, '这是得到的');
          break;
        }
      }
      this.$emit('radioChange', evt.target.value);
    },
    // 确认支付，选择支付方式
    payChoice() {
      console.log('确认支付，选择支付方式');
      this.$refs.payPopup.close();
      this.$refs.payTypePopup.open();
    },
    // 取消支付
    cancel(type) {
      console.log(type);
      if (type === '1') {
        this.$refs.payPopup.close();
      } else {
        this.$refs.payTypePopup.close();
      }
    },
    // 去设置钱包支付密码
    payStatusClick() {
      // /* 获取当前路由 */
      const routes = getCurrentPages(); // 获取当前打开过的页面路由数组
      const curRoute = routes[routes.length - 1].route; // 获取当前页面路由，也就是最后一个打开的页面路由
      // console.log(curRoute, this.threadId, '这是当前路由');
      this.setRouter(`${curRoute}/${this.threadId}`);
      // this.$store.commit('setRouter', curRoute);
      if (this.payUrl) {
        console.log(1);
        uni.redirectTo({ url: this.payUrl });
      }
      console.log(2);
      uni.redirectTo({ url: '/pages/modify/paypwd' });
    },
    // 输入密码完成
    onInput(val) {
      // 当输入密码为6位数时
      console.log(val, '输入完成');
      this.$emit('onInput', val);
    },
    // 关闭密码输入框
    close() {
      console.log('关闭支付');
      this.show = false;
      this.$refs.keyboardPopup.close();
      this.$emit('close');
    },
    // 清空密码输入框
    clearPassword() {
      this.$refs.keyboard.clear();
      console.log('清空');
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.popup-pay {
  display: flex;
  flex-direction: column;
  background: --color(--qui-BG-2);
}
.popup-content-space {
  width: 100%;
  height: 9rpx;
  background: --color(--qui-FC-DDD);
}
.popup-cancel-btn {
  height: 100rpx;
  font-size: $fg-f28;
  line-height: 90rpx;
  color: #666;
  text-align: center;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}
.popup-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.pay-title {
  padding-top: 40rpx;
  padding-bottom: 20rpx;
  font-size: $fg-f28;
  line-height: 37rpx;
  text-align: center;
}
.pay-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 465rpx;
  height: 90rpx;
  font-size: $fg-f28;
  line-height: 90rpx;
  color: #fff;
  text-align: center;
  background: --color(--qui-RED);
  .pay-num {
    padding: 0 20rpx;
    font-size: 40rpx;
    color: --color(--qui-FC-FFF);
  }
}
.pay-radio {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 20rpx 0 40rpx;
  .radio {
    transform: scale(0.7);
  }
}
.radio-word {
  font-size: 24rpx;
  line-height: 48rpx;
}
.popup-pay-type {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: --color(--qui-BG-2);
}
.money-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 40rpx;
  line-height: 80rpx;
  .money-num {
    font-size: 60rpx;
    line-height: 80rpx;
  }
}
.pay-type-chi {
  // display: flex;
  // flex-direction: row;
  // justify-content: space-between;
  height: 99rpx;
  padding: 0 40rpx;
  align-items: center;
  box-sizing: border-box;
}

.pay-type-radio {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .radio {
    transform: scale(0.7);
  }
}
.pay-type-l {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .pay-type-word {
    font-size: $fg-f28;
  }
}
.pay-type-r {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.icon-pay {
  display: flex;
  margin-right: 20rpx;
  font-size: 60rpx;
  line-height: 80rpx;
}

.wxpay {
  color: #09bb07;
}
.walletpay {
  color: #1878f3;
}
.pay-tip {
  padding: 40rpx 0;
  font-size: $fg-f24;
  color: --color(--qui-FC-AAA);
  text-align: center;
}
.check-tip {
  padding-right: 20rpx;
  font-size: $fg-f24;
  color: --color(--qui-FC-AAA);
}
.pay-radio-box {
  height: 99rpx;
}
.popup-share-content-space {
  width: 100%;
  height: 9rpx;
  background: --color(--qui-FC-DDD);
}
.paySureBtn {
  width: 100%;
  height: 100rpx;
  font-size: $fg-f28;
  font-weight: normal;
  line-height: 100rpx;
  color: --color(--qui-FC-FFF);
  text-align: center;
  background: --color(--qui-MAIN);
  border-radius: 0;
}
</style>
