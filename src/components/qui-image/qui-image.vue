<template>
  <view>
    <view v-if="imagesList.length == 1">
      <view class="themeItem__content__imgone">
        <image
          class="themeItem__content__imgone__item"
          v-for="(image, index) in imagesList"
          :key="index"
          :mode="modeVal"
          :src="image.thumbUrl"
          alt
          @click="previewPicture(previewStatus, index)"
          lazy-load
        ></image>
      </view>
    </view>
    <view v-if="imagesList.length == 2">
      <view class="themeItem__content__imgtwo">
        <image
          class="themeItem__content__imgtwo__item"
          v-for="(image, index) in imagesList"
          :key="index"
          :mode="modeVal"
          :src="image.thumbUrl"
          alt
          @click="previewPicture(previewStatus, index)"
          lazy-load
        ></image>
      </view>
    </view>
    <view v-if="imagesList.length >= 3">
      <view class="themeItem__content__imgmore">
        <image
          class="themeItem__content__imgmore__item"
          v-for="(image, index) in imagesList"
          :key="index"
          :mode="modeVal"
          :src="image.thumbUrl"
          alt
          @click="previewPicture(previewStatus, index)"
          lazy-load
        ></image>
        <view class="themeItem__content__imgmore__item" v-if="imagesList.length % 3 != 0"></view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    // 图片
    imagesList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 图片裁剪、缩放的模式
    modeVal: {
      type: String,
      default: 'aspectFill',
    },
    // 是否可预览
    previewStatus: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    // 预览图片
    previewPicture(previewStatus, index) {
      if (previewStatus) {
        // 如果对当前主题已支付
        const _this = this;
        const preview = [];
        for (let i = 0, len = _this.imagesList.length; i < len; i += 1) {
          preview.push(_this.imagesList[i].url);
        }
        uni.previewImage({
          current: index,
          urls: preview,
          indicator: 'number',
        });
      } else {
        // 如果未支付当前主题
        this.$emit('previewPicture');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.themeItem {
  &__content {
    &__imgone {
      display: flex;
      justify-content: flex-start;
      margin-top: 30rpx;
      line-height: 0;
      &__item {
        max-width: 100%;
        max-height: 100%;
        border-radius: 5rpx;
      }
    }
    &__imgtwo {
      display: flex;
      justify-content: space-between;
      margin-top: 30rpx;
      line-height: 0;
      &__item {
        display: block;
        width: 49.3%;
        height: 211rpx;
        margin-bottom: 10rpx;
        background: #fff;
        border-radius: 5rpx;
      }
    }
    &__imgmore {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-content: flex-start;
      flex-wrap: wrap;
      margin-top: 30rpx;
      line-height: 0;
      &__item {
        display: block;
        width: 32%;
        height: 211rpx;
        margin-right: 1.33%;
        margin-bottom: 10rpx;
        border-radius: 5rpx;
      }
    }
  }
}
</style>
