<template>
  <view class="qui-tabs">
    <view
      v-for="(item, index) in values"
      :class="index === currentIndex ? 'qui-tabs__item--active qui-tabs__item' : 'qui-tabs__item'"
      :key="index"
      :style="{
        borderColor: index === currentIndex ? activeColor : 'transparent',
      }"
      @tap="onClick(index)"
    >
      <text v-if="brief" class="qui-tabs__item__brief">
        {{ item.brief }}
      </text>
      <text class="qui-tabs__item__title">
        {{ item.title }}
      </text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'QuiTabs',
  props: {
    current: {
      type: Number,
      default: 0,
    },
    values: {
      type: Array,
      default() {
        return [];
      },
    },
    brief: {
      type: Boolean,
      default: false,
    },
    activeColor: {
      type: String,
      default: '#1878F3',
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  watch: {
    current(val) {
      if (val !== this.currentIndex) {
        this.currentIndex = val;
      }
    },
  },
  created() {
    this.currentIndex = this.current;
  },
  methods: {
    onClick(index) {
      this.currentIndex = index;
      this.$emit('clickItem', { currentIndex: index });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.qui-tabs {
  display: flex;
  flex-direction: row;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  box-sizing: border-box;
  transition: $switch-theme-time;
}
.qui-tabs__item {
  position: relative;
  display: inline-flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30rpx;
  box-sizing: border-box;
}
.qui-tabs__item__brief {
  font-size: 28rpx;
  color: --color(--qui-FC-333);
  transition: $switch-theme-time;
}
.qui-tabs__item__title {
  font-size: $fg-f24;
  color: --color(--qui-FC-AAA);
}
.qui-tabs__item--active {
  border-bottom: 4rpx solid;
}
.qui-tabs__item--active .qui-tabs__item__title {
  font-weight: bold;
  color: --color(--qui-FC-333);
}
</style>
