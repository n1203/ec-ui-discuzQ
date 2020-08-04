<template>
  <view>
    <view class="sticky" v-if="items.length > 0">
      <swiper class="sticky__box fbh" next-margin="50px" autoplay>
        <swiper-item
          class="sticky__isSticky"
          v-for="(item, index) in items"
          :key="index"
          @click="handleClick(item._jv.id)"
        >
          <view class="ec-sticky-box fbv">
            <view class="fbh stick-head">
              <view class="stick-badge">{{ i18n.t('home.sticky') }}</view>
              <view class="stick-title fb1">
                {{ item.title ? item.title : item.firstPost.summaryText }}
              </view>
            </view>
            <view class="stick-content">
              {{ item.title ? item.firstPost.summaryText : null }}
            </view>
          </view>
        </swiper-item>
        <view class="sticky__isSticky__empty"></view>
      </swiper>
    </view>
  </view>
</template>
<script>
let headerH5 = 'header-h5';
/* #ifdef MP-WEIXIN */
headerH5 = '';
/* #endif */
export default {
  name: 'QuiHeader',
  props: {
    items: {
      type: Array,
      default: [],
    },
    handleClick: {
      type: Function,
      default: () => {},
    },
  },
  data: () => {
    return {
      headerH5,
    };
  },
  computed: {
    // 语言包
    t() {
      return this.i18n.t('home');
    },
  },
  onLond() {},
  methods: {},
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.sticky__box {
  padding: 20rpx;
  height: 180rpx;
  // width: 80%;
}

.stick-head {
  line-height: 40rpx;
}
.stick-badge {
  background: #1878f3;
  font-size: 20rpx;
  padding: 0rpx 10rpx;
  border-radius: 10rpx;
  color: #fff;
  display: block;
  margin-right: 20rpx;
}
.stick-title {
  font-size: $fg-f26;
}
.ec-sticky-box {
  box-sizing: border-box;
  margin-right: 40rpx;
  box-shadow: 0 0 10rpx #00000010;
  border: 1rpx solid #00000010;
  padding: 20rpx;
  background: #fff;
  height: 180rpx;
  .stick-content {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
