<template>
  <view :class="positionClass" v-if="isShow">
    <view class="qui-toast--position">
      <qui-icon
        v-if="type === 'icon'"
        :name="icon"
        class="qui-toast--icon"
        size="35"
        color="#fff"
      ></qui-icon>
      <view v-if="type !== 'loading'" class="qui-toast--content">{{ message }}</view>
      <qui-loading
        v-if="type === 'loading'"
        :name="icon"
        class="qui-toast--icon"
        size="35"
        color="#fff"
        text-color="#fff"
        vertical
      >
        {{ message }}
      </qui-loading>
    </view>
  </view>
</template>

<script>
const initData = {
  type: 'text', // 'text': 文本，'icon': 带图标，'loading': 加载提示
  message: '', // 提示消息
  icon: '', // 提示消息图标
  position: 'middle', // top, middle, bottom
  duration: 2500, // 如果是 0，表示不会自动消失
};
export default {
  data() {
    const { type, icon, message, position, duration } = initData;
    return {
      type,
      icon,
      message,
      position,
      duration,
      isShow: false,
    };
  },
  computed: {
    positionClass() {
      if (this.position) return `qui-toast ${this.position}`;
      return 'qui-toast';
    },
  },
  methods: {
    close() {
      this.isShow = false;
      if (this.timer) clearTimeout(this.timer);
    },
    operatorData(options = {}) {
      if (this.timer) clearTimeout(this.timer);
      const { icon, message, position, duration, type } = { ...initData, ...options };
      this.type = type;
      this.icon = icon;
      this.message = message;
      this.position = position;
      this.duration = duration;
    },
    show(options = {}) {
      const { type } = options;
      if (type === 'loading') {
        this.showLoading();
        return;
      }
      this.operatorData(options);
      this.isShow = true;
      if (this.duration === 0) return;
      this.timer = setTimeout(() => {
        this.close();
      }, this.duration);
    },
    showLoading(options = {}) {
      this.operatorData({
        icon: 'icon-loading',
        message: '正在加载',
        ...options,
        type: 'loading',
        duration: 0,
      });
      this.isShow = true;
    },
    hideLoading() {
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.qui-toast {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 16rpx;
  &--position {
    display: line-flex;
    flex-direction: column;
    justify-content: center;
    max-width: 80%;
    padding: 30rpx;
    text-align: center;
    background-color: rgba($color: #000, $alpha: 0.8);
    border-radius: 7rpx;
    box-sizing: border-box;
  }
  &--icon {
    margin-bottom: 16rpx;
  }
  &--content {
    font-size: 28rpx;
    color: #fff;
    word-break: break-all;
  }
}
.qui-toast.top {
  align-items: flex-start;
  .qui-toast--position {
    margin-top: 30rpx;
  }
}
.qui-toast.middle {
  align-items: center;
}
.qui-toast.bottom {
  align-items: flex-end;
  .qui-toast--position {
    margin-bottom: 30rpx;
  }
}
</style>
