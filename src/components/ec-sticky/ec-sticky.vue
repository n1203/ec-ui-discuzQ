<template>
  <view>
    <view class="sticky" v-if="items.length > 0">
      <swiper class="sticky__box fbh" next-margin="50px" autoplay>
        <swiper-item
          :class="['sticky__isSticky', { 'acticv-sticky': index === items.length - 1 }]"
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
            <view class="meta fbh">
              <view class="meta-item fbh">
                <qui-icon
                  class="qui-icon"
                  name="icon-liked"
                  size="24"
                  v-if="item.firstPost.isLiked"
                ></qui-icon>
                <qui-icon class="qui-icon" name="icon-like" size="24" v-else></qui-icon>
                <view class="meta-item-count">{{ item.firstPost.likeCount || '' }}</view>
              </view>
              <view class="meta-item fbh">
                <qui-icon class="qui-icon" name="icon-message" size="24"></qui-icon>
                <view class="meta-item-count">
                  {{ item.postCount || '' }}
                </view>
              </view>
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
.sticky__isSticky {
  position: relative;
}
.stick-head {
  line-height: 40rpx;
}
.stick-badge {
  background: --color(--qui-BG-HIGH-LIGHT);
  font-size: 20rpx;
  padding: 0rpx 10rpx;
  border-radius: 10rpx;
  color: #fff;
  display: block;
  margin-right: 20rpx;
}
.stick-title {
  font-size: 28rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.ec-sticky-box {
  box-sizing: border-box;
  margin-right: 40rpx;
  box-shadow: 0 0 10rpx #00000010;
  border: 1rpx solid #00000010;
  padding: 20rpx;
  background: --color(--qui-BG-40);
  height: 180rpx;
  .stick-content {
    font-size: 24rpx;
    color: #999;
    overflow: hidden;

    text-overflow: ellipsis;

    display: -webkit-box;

    -webkit-line-clamp: 2;

    overflow: hidden;

    /*! autoprefixer: off */

    -webkit-box-orient: vertical;
  }
}
.acticv-sticky {
  background: brown;
  overflow: visible;
  .ec-sticky-box {
    margin-right: -50px;
  }
}

.meta {
  position: absolute;
  bottom: 20rpx;
  left: 20rpx;
  &-item {
    margin-right: 20rpx;
    &-count {
      font-size: 24rpx;
      padding: 0 20rpx;
    }
  }
}
</style>
