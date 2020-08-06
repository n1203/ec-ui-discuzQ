<template>
  <view>
    <view
      class="select-box"
      v-if="show"
      :style="{
        position: posival,
        top: top + 'rpx',
        right: right + 'rpx',
        left: left + 'rpx',
        width: width + 'rpx',
      }"
    >
      <view class="select-content">
        <view class="jt-bg" :style="{ right: jtRight + 'rpx' }"></view>
        <view class="jt-con" :style="{ right: jtRight + 'rpx' }"></view>
        <view class="select-con" v-for="(child, index) in list" :key="index">
          <view
            class="select-child"
            v-if="child.canOpera"
            @click="handleClick(child.canOpera, child.isStatus, child.type)"
          >
            {{ child.text }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'QuiDropDown',
  props: {
    // 是否显示组件
    show: {
      default: false,
      type: Boolean,
    },
    // 组件内数据list
    list: {
      default: () => [],
      type: Array,
    },
    // 定位属性值
    posival: {
      default: 'absolute',
      type: String,
    },
    // top值
    top: {
      default: '',
      type: [Number, String],
    },
    // right值
    right: {
      default: '',
      type: [Number, String],
    },
    // left值
    left: {
      default: '',
      type: [Number, String],
    },
    // 下拉框宽度
    width: {
      default: '180',
      type: [Number, String],
    },
    // 下拉框背景色
    // bgColor: {
    //   default: '#ffffff',
    //   type: String,
    // },
    // 气泡背景箭头位置
    jtRight: {
      default: '25',
      type: [Number, String],
    },
  },
  data() {
    return {};
  },
  methods: {
    handleClick(canOpera, status, type) {
      this.$emit('click', { canOpera, status, type });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.select-box {
  display: flex;
  flex-direction: column;
  background: --color(--qui-BG-FFF);
  border: 1px solid --color(--qui-BOR-ED);
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.16);
}
.select-content {
  position: relative;
  z-index: 11;
  padding: 10rpx;
  .jt-bg {
    position: absolute;
    top: -10rpx;
    width: 16rpx;
    height: 16rpx;
    background: --color(--qui-BOR-ED);
    transform: rotate(45deg);
  }
  .jt-con {
    position: absolute;
    top: -8rpx;
    width: 16rpx;
    height: 16rpx;
    background: --color(--qui-BG-FFF);
    transform: rotate(45deg);
  }
  .select-child {
    font-size: $fg-f28;
    line-height: 76rpx;
    color: #6d6d6d;
    text-align: center;
    border-bottom: 1px solid --color(--qui-BOR-ED);
  }
}
.select-con:last-child .select-child {
  border-bottom: 1px solid transparent;
}
</style>
