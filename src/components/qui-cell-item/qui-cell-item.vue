<template>
  <view :class="['cell-item', { border: border }, classItem]" @tap="$_click">
    <view class="cell-item__body">
      <view class="cell-item__body__left" v-if="slotLeft">
        <slot></slot>
      </view>
      <view class="cell-item__body__content" @tap="contentClick">
        <view class="cell-item__body__content-title" v-if="title" v-text="title"></view>
        <view class="cell-item__body__content-brief" v-if="brief" v-text="brief"></view>
      </view>
      <view class="cell-item__body__right" v-if="slotRight">
        <slot></slot>
        <qui-icon
          class="arrow"
          name="icon-folding-r"
          size="22"
          color="#ddd"
          v-if="arrow"
        ></qui-icon>
      </view>
      <view class="cell-item__body__right" v-if="!slotRight">
        <text class="cell-item__body__right-text">
          {{ addon }}
        </text>
        <qui-icon
          class="arrow"
          name="icon-folding-r"
          size="22"
          color="#ddd"
          v-if="arrow"
        ></qui-icon>
        <view class="cell-item__body__right-brief" v-if="briefRight">{{ briefRight }}</view>
      </view>
    </view>
    <view v-if="addon2" v-text="addon2" class="cell-item_children"></view>
  </view>
</template>

<script>
export default {
  name: 'QuiCellItem',

  props: {
    title: {
      type: String,
      default: '',
    },
    brief: {
      type: String,
      default: '',
    },
    addon: {
      type: String,
      default: '',
    },
    arrow: {
      type: Boolean,
      default: false,
    },
    addon2: {
      type: String,
      default: '',
    },
    briefRight: {
      type: String,
      default: '',
    },
    border: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    slotLeft: {
      type: Boolean,
      default: false,
    },
    slotRight: {
      type: Boolean,
      default: false,
    },
    classItem: {
      type: String,
      default: '',
    },
  },

  methods: {
    /**
     * item项点击事件
     */
    $_click(e) {
      if (!this.disabled) {
        this.$emit('click', e);
      }
    },
    contentClick(e) {
      if (!this.disabled) {
        this.$emit('contentClick', e);
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.cell-item {
  position: relative;
}
.cell-item.border {
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  // transition: $switch-theme-time;
}

.cell-item__body {
  position: relative;
  display: flex;
  height: 100rpx;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.cell-item__body__content-title {
  font-size: $fg-f28;
  color: --color(--qui-FC-333);
  transition: $switch-theme-time;
}

.cell-item__body__content-brief,
.cell-item__body__right-brief {
  margin-top: 6rpx;
  font-size: $fg-f24;
  color: --color(--qui-FC-AAA);
}

.cell-item__body__content {
  flex: 1 1 0%;
}

.cell-item__body__right {
  align-items: center;
  justify-content: flex-end;
  font-size: $fg-f28;
  text-align: right;
}

.cell-item__body__right .cell-item__body__right-text {
  font-size: $fg-f28;
  word-break: break-all;
}

.cell-item__children {
  padding: 20upx 0;
  margin: 0 20upx;
}

.cell-item.is-disabled .cell-item__body__content,
.cell-item.is-disabled .cell-item__body__content-title,
.cell-item.is-disabled .cell-item__body__content-brief,
.cell-item.is-disabled .cell-item__body__left,
.cell-item.is-disabled .cell-item__body__right,
.cell-item.is-disabled .cell-item__body__right-brief,
.cell-item.is-disabled .cell-item__children {
  color: #c5cad5;
}
.arrow {
  margin-left: 20rpx;
}
</style>
