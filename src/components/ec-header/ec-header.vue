<!-- 使用方法： 只需要传递一个name：管理员、成员....即可 -->
<template>
  <view class="header fbh">
    <view class="header_box fbh">
      <view class="ipt" @click="onHandleClickSearch">
        <qui-icon class="search_icon" name="icon-sousuo_2" size="30" />
        <span>在这里搜索</span>
      </view>
      <view class="fbh fabu_box" @click="footerOpen">
        <qui-icon name="icon-bianji_5" size="38" color="#fff" />
        <p>发布</p>
      </view>
    </view>
    <!-- 弹出发帖框 -->
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
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
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
    width: {
      type: String,
      default: '140rpx',
    },
    onClickFilter: {
      type: Function,
      default: () => {},
    },
    filterContent: {
      type: String,
      default: '高中',
    },
  },
  data: () => {
    return {
      sel: 1,
      type: '',
      bottomData: [], // 发帖弹窗容器
    };
  },
  computed: {
    // 语言包
    t() {
      return this.i18n.t('home');
    },
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
  methods: {
    select(item, index) {
      this.setFooterIndex(parseInt(index, 10));
      this.$emit('click', item, index, this.isTabBar);
      this.sel = item.id;
    },
    ...mapMutations({
      setFooterIndex: 'footerTab/SET_FOOTERINDEX',
    }),
    onHandleClickSearch() {
      uni.navigateTo({
        url: '/pages/site/search',
      });
      this.show = false;
    },
    // onHandleClickMessage() {
    //   uni.navigateTo({
    //     url: '',
    //   });
    // },
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

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.header {
  padding: 8rpx 20rpx 8rpx 0;
  background: --color(--qui-BG-40);
}
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
.location {
  position: relative;
  margin-right: 20rpx;
  font-size: 28rpx;
}
.cornerMark {
  position: absolute;
  right: 0rpx;
  bottom: 30rpx;
  height: 20rpx;
  transform: scale(0.5);
}
.search {
  background: --color(--qui-BG-777);
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 20rpx;
  font-size: 20rpx;
  border-radius: 50rpx;
  color: --color(--qui-FC-B2);
}
.icon {
  text-align: center;
  font-size: 28rpx;
}
.search_icon {
  opacity: 0.7;
  margin-left: 20rpx;
  margin-right: 10rpx;
}
.ipt {
  display: flex;
  width: 75%;
  align-items: center;
  background-color: rgba(104, 96, 96, 0.05);
  border-radius: 50px;
  padding: 10rpx;
  font-size: 10px;
  font-weight: 300;
  span {
    font-size: 20rpx;
  }
}
.header_box {
  width: 100vw;
  padding: 20rpx 0 20rpx 20rpx;
  justify-content: space-between;
  .fabu_box {
    display: flex;
    align-items: center;
    background: var(--qui-TAB);
    padding: 10rpx 20rpx 10rpx 20rpx;
    border-radius: 50px;
    p {
      color: #fff;
      margin-left: 10rpx;
    }
  }
}
</style>
