<template>
  <view>
    <!-- mask层 -->
    <view :class="['mask', show ? '' : 'visible']"></view>
    <!-- 金额 -->
    <view :class="['content', show ? '' : 'contenthide']">
      <view class="title">
        <view class="close"></view>
        <view class="center">{{ p.payNow }}</view>
        <qui-icon
          name="icon-close"
          size="40"
          color="#aaa"
          class="icon-close"
          @click="close()"
        ></qui-icon>
      </view>
      <view class="pay-money">
        <view class="money">
          ￥
          <text>{{ money }}</text>
        </view>
      </view>
      <view class="pay-way">
        <view>{{ p.payType }}</view>
        <view class="pay-img">
          <qui-icon name="icon-walletPay" size="40" color="#1878F3" class="icon-pay"></qui-icon>
          {{ p.walletPay }}
        </view>
      </view>
      <view class="pay-password">{{ p.payPassword }}</view>
      <view :class="['code', show ? '' : 'visible']">
        <view class="code-box">
          <block v-for="(item, index) in 6" :key="index">
            <view class="code-box-item">{{ (password[index] && '●') || '' }}</view>
          </block>
        </view>
        <input type="number" v-model="password" class="number-input" />
      </view>
    </view>
    <!-- 键盘 -->
    <view :class="['keyboard', show ? '' : 'active', isIphoneX ? 'isIphone' : '']">
      <block v-for="(item, index) in 9" :key="index">
        <view class="keyboard-item" @tap="key(index + 1)">{{ index + 1 }}</view>
      </block>
      <view class="keyboard-item hide"></view>
      <view class="keyboard-item" @tap="key(0)"><text>0</text></view>
      <view class="keyboard-item delte" @tap="del()">
        <image class="img" src="@/static/del.png" mode="aspectFill" :lazy-load="true"></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    isIphoneX: {
      type: Boolean,
      default: false,
    },
    // 支付金额
    money: {
      type: [String, Number],
      default: '0',
    },
  },
  data() {
    return {
      password: '',
      trantision: false,
    };
  },
  computed: {
    p() {
      return this.i18n.t('pay');
    },
  },
  methods: {
    key(key) {
      if (this.password.length < 6) {
        this.password += key;
        if (this.password.length === 6) {
          console.log(this.password);
          this.$emit('onInput', this.password);
          // uni.showToast({ title: '输入完成' });
        }
      }
    },
    clear() {
      this.password = '';
    },
    close() {
      this.password = '';
      this.trantision = false;
      this.$emit('close', false);
    },
    del() {
      if (this.password.length > 0) {
        this.password = this.password.substring(0, this.password.length - 1);
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.number-input {
  display: none;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100vw;
  height: 100vh;
  background: rgba(102, 102, 102, 0.3);
  opacity: 1;
  visibility: visible;
  transition: all 0.3s ease;
}
.content {
  position: fixed;
  top: 12%;
  left: 40rpx;
  z-index: 9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 670rpx;
  height: 610rpx;
  padding: 40rpx;
  margin-top: 0;
  margin-left: 0;
  background: --color(--qui-BG-FFF);
  border-radius: 14rpx;
  opacity: 1;
  visibility: visible;
  box-sizing: border-box;
  transition: all 0.3s ease;
}
.contenthide {
  z-index: 0;
  width: 700rpx;
  height: 680rpx;
  margin-top: -340rpx;
  margin-left: -350rpx;
  opacity: 0;
  visibility: hidden;
}
.visible {
  z-index: 8;
  opacity: 0;
  visibility: hidden;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 24rpx;
  font-size: 28rpx;
  line-height: 37rpx;
}
.center {
  font-size: 32rpx;
  color: #333;
}
.close {
  width: 50rpx;
  height: 50rpx;
}
.pay-money {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  height: 160rpx;
}
.pay-money view {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80rpx;
}
.pay-way {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 40rpx;
  font-size: 34rpx;
  border-bottom: 1px solid --color(--qui-BOR-ED);
}
.pay-password {
  font-size: 34rpx;
  line-height: 80rpx;
  text-align: left;
}
.money {
  margin-bottom: 50rpx;
  font-size: 45rpx;
  font-weight: 600;
}
.money text {
  margin-left: 10rpx;
  font-size: 60rpx;
}
.pay-img {
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-pay {
  margin-right: 20rpx;
}
.code {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 120rpx;
  background: #fff;
  box-sizing: border-box;
}
.code-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid --color(--qui-BOR-D5);
}
.code-box-item {
  width: 98rpx;
  height: 96rpx;
  font-size: 40rpx;
  line-height: 96rpx;
  text-align: center;
  background: --color(--qui-BG-FFF);
}
.code-box-item:not(:last-child) {
  border-right: 1px solid --color(--qui-BOR-D5);
}
.keyboard {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  background: --color(--qui-BG-IT);
  transition: all 0.2s ease-in 0.2s;
}
.active {
  bottom: -400rpx;
}
.keyboard-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 250rpx;
  height: 99rpx;
  font-size: 40rpx;
  color: #333;
  background: #fff;
  border: 1rpx solid #ebebeb;
  border-top: none;
  border-left: none;
  box-sizing: border-box;
}
.hide {
  opacity: 0;
}
.delte {
  background: none;
  box-shadow: none;
}
.delte image {
  width: 60rpx;
  height: 60rpx;
}
.isIphone {
  //   padding-bottom: 68rpx !important;
  padding-bottom: 68rpx;
}
</style>
