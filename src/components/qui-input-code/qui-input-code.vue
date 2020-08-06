<template>
  <view class="modify-vftion">
    <view class="modify-vftion-input">
      <input
        type="number"
        class="hidden-ipt"
        maxlength="6"
        :focus="isFocus"
        @input="enters"
        @blur="lose"
        v-model="iptValue"
        disabled
      />
      <view
        :class="
          title
            ? 'hidden-ipt-input2'
            : show
            ? dun
              ? 'hidden-ipt-input'
              : 'hidden-ipt-input alias'
            : 'hidden-ipt-input alias'
        "
        @click="onFocus"
        v-text="iptValue.length >= 1 ? iptValue[0] : ''"
      />
      <view
        :class="
          title
            ? 'hidden-ipt-input2'
            : dun
            ? iptValue[0]
              ? 'hidden-ipt-input'
              : 'hidden-ipt-input alias'
            : 'hidden-ipt-input alias'
        "
        @tap="onFocus"
        v-text="iptValue.length >= 2 ? iptValue[1] : ''"
      />
      <view
        :class="
          title
            ? 'hidden-ipt-input2'
            : dun
            ? iptValue[1]
              ? 'hidden-ipt-input'
              : 'hidden-ipt-input alias'
            : 'hidden-ipt-input alias'
        "
        @tap="onFocus"
        v-text="iptValue.length >= 3 ? iptValue[2] : ''"
      />
      <view
        :class="
          title
            ? 'hidden-ipt-input2'
            : dun
            ? iptValue[2]
              ? 'hidden-ipt-input'
              : 'hidden-ipt-input alias'
            : 'hidden-ipt-input alias'
        "
        @tap="onFocus"
        v-text="iptValue.length >= 4 ? iptValue[3] : ''"
      />
      <view
        :class="
          title
            ? 'hidden-ipt-input2'
            : dun
            ? iptValue[3]
              ? 'hidden-ipt-input'
              : 'hidden-ipt-input alias'
            : 'hidden-ipt-input alias'
        "
        @tap="onFocus"
        v-text="iptValue.length >= 3 ? iptValue[4] : ''"
      />
      <view
        :class="
          title
            ? 'hidden-ipt-input2'
            : dun
            ? iptValue[4]
              ? 'hidden-ipt-input'
              : 'hidden-ipt-input alias'
            : 'hidden-ipt-input alias'
        "
        @tap="onFocus"
        v-text="iptValue.length >= 4 ? iptValue[5] : ''"
      />
    </view>
    <view class="hidden-ipt-test" v-if="title">
      {{ text }}
    </view>
    <!-- 键盘 -->
    <view
      :class="['keyboard', show ? (dun ? '' : 'active') : 'active', isiphonex ? 'isIphone' : '']"
    >
      <view class="keyboard-dow" @click="btndun">
        <qui-icon class="keyboard-dow-img" name="icon-unfold" size="20" color="#ddd"></qui-icon>
      </view>
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
    title: {
      default: false,
      type: Boolean,
    },
    text: {
      default: '',
      type: String,
    },
    number: {
      default: 'number',
      type: String,
    },
    show: {
      default: false,
      type: Boolean,
    },
    isiphonex: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      iptValue: '',
      isFocus: false,
      inpcont: '',
      num: 1,
      dun: true,
    };
  },
  methods: {
    onFocus() {
      this.isFocus = true;
      this.dun = true;
    },
    enters() {
      this.$emit('getdata', this.iptValue);
    },
    lose() {
      this.isFocus = false;
    },
    deleat() {
      this.iptValue = '';
    },
    btndun() {
      this.dun = false;
    },
    key(key) {
      if (this.iptValue.length < 6) {
        this.iptValue += key;
        if (this.iptValue.length === 6) {
          this.$emit('getdata', this.iptValue);
        }
      }
    },
    del() {
      if (this.iptValue.length > 0) {
        this.iptValue = this.iptValue.substring(0, this.iptValue.length - 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.modify-vftion {
  width: 710rpx;
}
.modify-vftion-input {
  display: flex;
  width: 100%;
  height: 100rpx;
}
.hidden-ipt {
  width: 0;
  height: 0;
  margin: 0;
  border: 0;
}
.hidden-ipt-input {
  width: 92rpx;
  height: 98rpx;
  margin: 0 24rpx 0 0;
  font-size: $fg-f50;
  font-weight: bold;
  line-height: 98rpx;
  text-align: center;
  border-bottom: 2rpx solid --color(--qui-FC-333);
}
.hidden-ipt-input2 {
  width: 92rpx;
  height: 98rpx;
  margin: 0 24rpx 0 0;
  font-size: $fg-f50;
  font-weight: bold;
  line-height: 98rpx;
  color: --color(--qui-RED);
  text-align: center;
  border-bottom: 2rpx solid --color(--qui-RED);
}
.alias {
  border-bottom: 2rpx solid rgba(197, 202, 213, 1);
}
.hidden-ipt-test {
  margin: 21rpx 0 0;
  font-size: $fg-f24;
  font-weight: 400;
  color: --color(--qui-RED);
  opacity: 1;
}
.keyboard {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  background: #ebebeb;
  border-top: 2rpx solid #ebebeb;
  transition: all 0.2s ease-in 0.2s;
}
.active {
  bottom: -440rpx;
}
.keyboard-dow {
  width: 100%;
  height: 40rpx;
  text-align: center;
  background-color: #fff;
  border-bottom: 2rpx solid #ebebeb;
}
.keyboard-dow-img {
  width: 40rpx;
  height: 40rpx;
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
  padding-bottom: 0;
}
</style>
