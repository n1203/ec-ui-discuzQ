<template>
  <view class="popup-share">
    <view class="popup-share-content">
      <button class="popup-share-button" open-type="share"></button>
      <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
        <view class="popup-share-content-image">
          <view class="popup-share-box" @click="shareContent(index)">
            <qui-icon class="content-image" :name="item.icon" size="46" color="#777"></qui-icon>
          </view>
        </view>
        <text class="popup-share-content-text">{{ item.text }}</text>
      </view>
    </view>
    <view class="popup-share-content-space"></view>
    <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
  </view>
</template>

<script>
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  props: {
    shareType: {
      type: String,
      default: 'top',
    },
    nowThreadId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      bottomData: [
        {
          text: this.i18n.t('home.generatePoster'),
          icon: 'icon-poster',
          name: 'wx',
        },
        {
          text: this.i18n.t('home.wxShare'),
          icon: 'icon-wx-friends',
          name: 'wx',
        },
      ],
    };
  },
  mounted() {
    // 付费圈子只显示海报分享
    if (this.forums.set_site && this.forums.set_site.site_mode === 'pay') {
      this.bottomData = [
        {
          text: this.i18n.t('home.generatePoster'),
          icon: 'icon-poster',
          name: 'wx',
        },
      ];
    }
  },
  methods: {
    cancel() {
      this.$emit('close');
    },
    shareContent(index) {
      const { shareType } = this;
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      if (shareType === 'top') {
        if (index === 0) {
          uni.navigateTo({
            url: '/pages/share/site',
          });
        }
      } else if (index === 0) {
        uni.navigateTo({
          url: `/pages/share/topic?id=${this.nowThreadId}`,
        });
      }
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
</style>
