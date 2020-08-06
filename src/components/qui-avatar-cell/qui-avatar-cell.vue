<template>
  <view>
    <label class="avatar-box" @click="getNameId(mark)">
      <view class="avatar-box__img">
        <qui-avatar :user="{ username: title, avatarUrl: icon }" :is-real="isReal" size="70" />
      </view>
      <view class="avatar-box__r">
        <view class="avatar-box__r__tit">
          <text>
            {{ title }}
          </text>
          <text class="avatar-box__r__tit-label" v-if="center">{{ label }}</text>
        </view>
        <view class="avatar-box__r__val-box">
          <text
            class="avatar-box__r__val"
            :class="center ? 'avatar-box__r__val--777' : ''"
            :style="{ color: rightColor }"
          >
            {{ value }}
          </text>
          <slot name="rightIcon" />
          <qui-icon
            name="icon-folding-r"
            v-if="!$slots.rightIcon"
            color="#ddd"
            size="22"
          ></qui-icon>
        </view>
      </view>
    </label>
  </view>
</template>

<script>
export default {
  name: 'QuiAvatarCell',
  props: {
    title: {
      type: String,
      default: '',
    },
    isReal: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    mark: {
      type: Number,
      default: 0,
    },
    value: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    center: {
      default: false,
      type: Boolean,
    },
    rightColor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  methods: {
    getNameId(id) {
      this.$emit('click', id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';

.avatar-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100rpx;
  padding-left: 40rpx;
  box-sizing: border-box;
  &:active {
    background-color: --color(--qui-BOR-ED);
  }

  &__img {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
  }

  &__r {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    height: 100%;
    padding-right: 40rpx;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);

    .avatar-box__r__tit {
      display: flex;
      flex-direction: column;
      font-size: 28rpx;
      &-label {
        color: --color(--qui-FC-DDD);
      }
    }

    .avatar-box__r__val-box {
      display: flex;
      align-items: center;
      .avatar-box__r__val {
        margin-right: 20rpx;
        font-size: 24rpx;
        color: --color(--qui-FC-AAA);
      }
      .avatar-box__r__val--777 {
        color: --color(--qui-FC-777);
      }
    }
  }
}

/deep/ .icon-folding-r {
  color: --color(--qui-FC-DDD);
  opacity: 1;
}

//头像单元格--多选框--H5
/deep/ uni-checkbox .uni-checkbox-input {
  width: 44rpx;
  height: 44rpx;
  margin: 0;
  border-radius: 50rpx;
}
/deep/ uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
  background: --color(--qui-BG-HIGH-LIGHT);
}
/deep/ uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
  color: --color(--qui-FC-FFF);
}
</style>
