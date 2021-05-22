<template>
  <view>
    <view
      class="ft"
      :style="{
        paddingBottom: bottom + 'rpx',
      }"
    >
      <view
        class="ft-box fbac fbjc"
        :class="{ select: true, active: index === footerIndex }"
        v-for="(item, index) in tabs"
        :key="index"
      >
        <qui-icon
          class="ft-box-icon"
          @click="select(item, index)"
          :name="item.tabsIcon"
          size="40"
          v-if="item.tabsName"
          :class="{ select: true, active: index === footerIndex }"
        ></qui-icon>
        <qui-icon
          name="icon-bianji_5"
          size="42"
          color="#fff"
          v-if="!item.tabsName"
          class="ft-box-spacal"
          @click="footerOpen"
        />
        <text
          class="ft-box-content"
          @click="select(item, index)"
          :class="{ select: true, active: index === footerIndex }"
        >
          {{ item.tabsName }}
        </text>
        <view v-if="redCircle && item.id === 4" name="icon-dian" class="red-circle"></view>
      </view>

      <!-- <view class="ft-box-spacal" @click="footerOpen">
        <text class="">+</text>
        <image class="ft-box-spacal-icon" src="@/static/publish.svg" @click="footerOpen"></image>
      </view> -->
    </view>
    <uni-popup ref="popup" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="handleClick(item)">
                <qui-icon
                  class="content-image"
                  :name="item.icon"
                  size="56"
                  color="#777777"
                ></qui-icon>
              </view>
              <!-- <image :src="item.icon" class="content-image" mode="widthFix" /> -->
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
    <qui-toast ref="toast"></qui-toast>
  </view>
</template>
<script>
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import { mapState, mapMutations } from 'vuex';
// #ifdef H5
import loginAuth from '@/mixin/loginAuth-h5';
// #endif

export default {
  mixins: [
    forums,
    user,
    // #ifdef  H5
    loginAuth,
    // #endif
  ],
  props: {
    bottom: {
      type: Number,
      default: 0,
    },
  },
  data: () => {
    return {
      sel: 1,
      type: '',
      tabs: [
        {
          tabsName: 'home.tabsCircle',
          tabsIcon: 'icon-shouye_4',
          id: 1,
          url: '/pages/home/index',
          // routePath: 'pages/home/index', // 仅用作标识不用来跳转
        },
        {
          tabsName: 'home.tabTopic',
          tabsIcon: 'icon-diamond',
          id: 2,
          url: '/pages/site/topic/list',
          // routePath: 'pages/my/index', // 仅用作标识不用来跳转
        },
        {
          tabsName: '',
          tabsIcon: 'null',
          id: 3,
          url: '/pages/site/search',
          // routePath: 'pages/my/index', // 仅用作标识不用来跳转
        },
        {
          tabsName: 'home.tabsNews',
          tabsIcon: 'icon-xiaoxi',
          id: 4,
          url: '/pages/notice/index',
          // routePath: 'pages/notice/index', // 仅用作标识不用来跳转
        },
        {
          tabsName: 'home.tabsMy',
          tabsIcon: 'icon-icon31',
          id: 5,
          url: '/pages/my/index',
          // routePath: 'pages/my/index', // 仅用作标识不用来跳转
        },
      ],
      bottomData: [],
      isTabBar: [0], // 禁止页面第二次加载
    };
  },
  computed: {
    ...mapState({
      getCategoryId: state => state.session.categoryId,
      getCategoryIndex: state => state.session.categoryIndex,
      footerIndex: state =>
        state.footerTab.footerIndex ? parseInt(state.footerTab.footerIndex, 10) : 0,
    }),
    redCircle() {
      return this.user.unreadNotifications;
    },
  },
  created() {
    const len = getCurrentPages().length;
    if (len > 0) {
      // #ifdef MP-WEIXIN
      const currentRout = getCurrentPages()[len - 1].is;
      const str = currentRout && currentRout.split('pages/')[1];
      if (str) {
        this.tabs = this.tabs.map(tab => {
          const tabsName = this.i18n.t(tab.tabsName);
          if (tab.url && tab.url.includes(str)) {
            this.sel = tab.id;
          }
          const newTab = { ...tab, tabsName };
          return newTab;
        });
      }
      // #endif
      // #ifdef H5
      const currentRouts = getCurrentPages()[len - 1].route;
      const strs = currentRouts && currentRouts.split('pages/')[1];
      if (strs) {
        this.tabs = this.tabs.map(tab => {
          const tabsName = this.i18n.t(tab.tabsName);
          if (tab.url && tab.url.includes(strs)) {
            this.sel = tab.id;
          }
          const newTab = { ...tab, tabsName };
          return newTab;
        });
      }
      // #endif
    }
  },
  methods: {
    select(item, index) {
      this.setFooterIndex(parseInt(index, 10));
      this.$emit('click', item, index, this.isTabBar);
      this.sel = item.id;
      // console.log(this.sel, 'this.sel');
      // if (!item.url) {
      //   return;
      // }
      // const currentPage = getCurrentPages();
      // if (
      //   item.tabsName === this.i18n.t('home.tabsCircle') &&
      //   currentPage[0].route === 'pages/home/index'
      // ) {
      //   const len = currentPage.length;
      //   uni.navigateBack({
      //     delta: len,
      //   });
      // }
    },
    ...mapMutations({
      setFooterIndex: 'footerTab/SET_FOOTERINDEX',
    }),
    // 首页底部发帖按钮弹窗
    footerOpen() {
      if (!this.$store.getters['session/get']('isLogin')) {
        // #ifdef MP-WEIXIN
        this.$store.getters['session/get']('auth').open();
        // #endif
        // #ifdef H5
        if (!this.handleLogin()) {
          return;
        }
        // #endif
        return;
      }
      if (this.forums.other.publish_need_real_name) {
        this.$refs.toast.show({ message: this.i18n.t('home.needRealname') });
        return;
      }
      if (this.forums.other.publish_need_bind_phone) {
        this.$refs.toast.show({ message: this.i18n.t('home.needPhone') });
        return;
      }

      if (!this.forums.other.can_create_thread_in_category) {
        this.$refs.toast.show({ message: this.i18n.t('home.noPostingPermission') });
        return;
      }

      if (this.getCategoryId) {
        const category = this.$store.getters['jv/get'](`categories/${this.getCategoryId}`);
        if (!category.canCreateThread) {
          this.$refs.toast.show({ message: this.i18n.t('home.noPostingPermission') });
        }
      }

      if (
        !this.forums.other.can_create_thread &&
        !this.forums.other.can_create_thread_long &&
        !this.forums.other.can_create_thread_video &&
        !this.forums.other.can_create_thread_image
      ) {
        this.$refs.toast.show({ message: this.i18n.t('home.noPostingPermission') });
        return;
      }
      this.bottomData = [];
      if (this.forums.other.can_create_thread) {
        this.bottomData.push({
          text: this.i18n.t('home.word'),
          icon: 'icon-duoxingwenzi',
          name: 'text',
          type: 0,
        });
      }
      if (this.forums.other.can_create_thread_long) {
        this.bottomData.push({
          text: this.i18n.t('home.post'),
          icon: 'icon-huifudetiezi',
          name: 'post',
          type: 1,
        });
      }
      if (this.forums.other.can_create_thread_video) {
        this.bottomData.push({
          text: this.i18n.t('home.video'),
          icon: 'icon-shipin',
          name: 'video',
          type: 2,
        });
      }
      if (this.forums.other.can_create_thread_image) {
        this.bottomData.push({
          text: this.i18n.t('home.picture'),
          icon: 'icon-tupian1',
          name: 'image',
          type: 3,
        });
      }
      this.$refs.popup.open();
    },
    // 首页底部发帖点击事件跳转
    handleClick(item) {
      let url;
      if (this.footerIndex === 0) {
        url = `/pages/topic/post?type=${item.type}&categoryId=${this.getCategoryId}&categoryIndex=${this.getCategoryIndex}`;
      } else {
        url = `/pages/topic/post?type=${item.type}`;
      }
      uni.navigateTo({
        url,
      });
      this.cancel();
    },
    // 取消按钮
    cancel() {
      this.$refs.popup.close();
    },
    close() {
      this.$refs.auth.close();
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.ft {
  // position: absolute;
  position: fixed;
  bottom: 0rpx;
  z-index: 20;
  display: flex;
  width: 100%;
  height: 110rpx;
  background-color: --color(--qui-BG-2);
  box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.05);
  justify-content: space-around;
}
.ft-box {
  position: relative;
  display: flex;
  width: 20%;
  // height: 90rpx;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  &:active {
    transform: scale(0.9);
  }
}
.ft-box-icon {
  align-self: center;
  height: 50rpx;
  // background: #c33;
}
.ft-box-content {
  align-self: center;
  margin-top: 8rpx;
  font-size: 24rpx;
  line-height: 26rpx;
  color: --color(--qui-FC-777);
  text-align: center;
}
.ft-box-spacal {
  text-align: center;
  font-size: 58rpx;
  background-color: --color(--qui-BG-HIGH-LIGHT);
  box-shadow: 0 0 40rpx --color(--qui-BOR-CCDD);
  border-radius: 30rpx;
  width: 100rpx;
  height: 60rpx;
  line-height: 1.5rem;
  margin-top: 0.3rem;
  color: #fff;
  display: block;
}
.ft-box-spacal-icon {
  position: relative;
  width: 110rpx;
  height: 72rpx;
}
.active {
  color: --color(--qui-TAB);
}
.red-circle {
  position: absolute;
  top: -4rpx;
  left: calc(50% + 18rpx);
  width: 14rpx;
  height: 14rpx;
  background: red;
  border-radius: 50%;
}
.red-circle-wx {
  /* #ifdef MP-WEIXIN */
  left: calc(29% + 24rpx);
  /* #endif */
}
// .red-num {
//   position: absolute;
//   top: -22rpx;
//   left: calc(23% + 12rpx);
//   color: --color(--qui-BOR-FFF);
// }
</style>
