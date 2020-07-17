<template>
  <view class="qui-back">
    <view class="qui-back__body">
      <view class="qui-back__body__content">
        <view class="qui-back__body__content-title">
          <qui-icon
            :name="iconLeft"
            class="icon-back"
            size="32"
            :color="theme === $u.light() ? '#333' : '#fff'"
            @tap="back"
            v-if="isShowBack"
          ></qui-icon>
          <text @tap="back">{{ title }}</text>
        </view>
      </view>
      <view class="qui-back_body__right" v-if="slotRight">
        <slot></slot>
      </view>
      <view class="qui-back__body__right" v-if="!slotRight">
        <qui-icon
          name="icon-home"
          size="32"
          :color="theme === $u.light() ? '#777' : '#fff'"
          @tap="backPage('/pages/home/index', '0')"
          v-if="isShowHome"
        ></qui-icon>
        <qui-icon
          name="icon-more"
          size="32"
          :color="theme === $u.light() ? '#000' : '#fff'"
          @tap="showMore"
          v-if="isShowMore"
        ></qui-icon>
        <view class="qui-back__body__right-pop" v-if="ifShowMenu">
          <view class="qui-back__body__right-pop-item" @tap="footerOpen">
            {{ i18n.t('profile.post') }}
          </view>
          <view class="qui-back__body__right-pop-item" @tap="backPage('/pages/home/index', '1')">
            {{ i18n.t('profile.notice') }}
            <qui-icon
              name="icon-oval"
              class="red-circle"
              color="#FB2D2D"
              size="14"
              v-if="redCircle"
            ></qui-icon>
          </view>
          <view class="qui-back__body__right-pop-item" @tap="backPage('/pages/home/index', '2')">
            {{ i18n.t('profile.mine') }}
          </view>
          <!-- 管理员才显示站点管理 -->
          <view
            class="qui-back__body__right-pop-item"
            @tap="backPage('/pages/manage/index')"
            v-if="userInfo.groupsName == '管理员'"
          >
            {{ i18n.t('site.site') }}
          </view>
        </view>
      </view>
    </view>
    <view class="qui-back-mask" v-if="ifShowMenu" @tap="hideMenu"></view>
    <!-- 发帖弹框 -->
    <uni-popup ref="popup" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="handleClick(item)">
                <qui-icon class="content-image" :name="item.icon" size="56" color="#777"></qui-icon>
              </view>
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

export default {
  name: 'QuiBack',
  mixins: [forums, user],
  props: {
    title: {
      type: String,
      default: '',
    },
    iconLeft: {
      type: String,
      default: 'icon-back',
    },
    slotRight: {
      type: Boolean,
      default: false,
    },
    isShowMore: {
      type: Boolean,
      default: true,
    },
    isShowHome: {
      type: Boolean,
      default: true,
    },
    isShowBack: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    return {
      ifShowMenu: false,
      bottomData: [],
    };
  },

  computed: {
    userId() {
      return this.$store.getters['session/get']('userId');
    },
    userInfo() {
      const userInfo = this.$store.getters['jv/get'](`users/${this.userId}`);
      userInfo.groupsName = userInfo.groups ? userInfo.groups[0].name : '';
      return userInfo;
    },
    redCircle() {
      return this.user.unreadNotifications;
    },
    ...mapState({
      getCategoryId: state => state.session.categoryId,
      getCategoryIndex: state => state.session.categoryIndex,
      footerIndex: state => state.footerTab.footerIndex,
    }),
  },
  methods: {
    back() {
      // uni.navigateBack();
      window.history.back(-1);
    },
    backPage(pageUrl, index) {
      this.ifShowMenu = false;
      if (index) {
        this.setFooterIndex(parseInt(index, 10));
      }
      uni.navigateTo({
        url: pageUrl,
      });
    },
    hideMenu() {
      this.ifShowMenu = false;
    },
    showMore() {
      this.ifShowMenu = true;
    },
    ...mapMutations({
      setFooterIndex: 'footerTab/SET_FOOTERINDEX',
    }),
    // 首页底部发帖按钮弹窗
    footerOpen() {
      this.ifShowMenu = false;
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
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
          icon: 'icon-word',
          name: 'text',
          type: 0,
        });
      }
      if (this.forums.other.can_create_thread_long) {
        this.bottomData.push({
          text: this.i18n.t('home.invitation'),
          icon: 'icon-post',
          name: 'post',
          type: 1,
        });
      }
      if (this.forums.other.can_create_thread_video) {
        this.bottomData.push({
          text: this.i18n.t('home.video'),
          icon: 'icon-video',
          name: 'video',
          type: 2,
        });
      }
      if (this.forums.other.can_create_thread_image) {
        this.bottomData.push({
          text: this.i18n.t('home.picture'),
          icon: 'icon-img',
          name: 'image',
          type: 3,
        });
      }
      this.$refs.popup.open();
    },
    // 首页底部发帖点击事件跳转
    handleClick(item) {
      uni.navigateTo({
        url: `/pages/topic/post?type=${item.type}&categoryId=${this.getCategoryId}&categoryIndex=${this.getCategoryIndex}`,
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
.qui-back {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: 0 40rpx;
  background: --color(--qui-BG-2);
  box-sizing: border-box;
}
.qui-back__body {
  position: relative;
  display: flex;
  height: 44px;
  align-items: center;
  justify-content: space-between;
}
.qui-back__body__content-title {
  font-size: $fg-f28;
  font-weight: bold;
  color: --color(--qui-FC-333);
  transition: $switch-theme-time;
}
.qui-back__body__content-title .qui-icon {
  margin-right: 18rpx;
}
.qui-back__body__content {
  flex: 1 1 0%;
}
.cell-item__body__right {
  align-items: center;
  justify-content: flex-end;
  font-size: $fg-f28;
  text-align: right;
}
.icon-more {
  margin-left: 32rpx;
}
.qui-back__body__right-pop {
  position: absolute;
  top: 90rpx;
  right: -20rpx;
  z-index: 100;
  width: 180rpx;
  padding: 10rpx;
  background: --color(--qui-BG-2);
  border-radius: 10rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.16);
  box-sizing: border-box;
}
.qui-back__body__right-pop-item {
  position: relative;
  height: 70rpx;
  font-size: $fg-f28;
  line-height: 70rpx;
  color: --color(--qui-FC-777);
  text-align: center;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.red-circle {
  position: absolute;
  top: -14rpx;
}
.icon-back {
  margin-left: -10rpx;
}
.qui-back__body__right-pop-item:last-child {
  border: none;
}
.qui-back__body__right-pop:before {
  position: absolute;
  top: -12rpx;
  right: 24rpx;
  width: 0;
  height: 0;
  border-color: transparent transparent --color(--qui-BOR-ED);
  border-style: solid;
  border-width: 0 12rpx 12rpx;
  content: '';
}
.qui-back__body__right-pop:after {
  position: absolute;
  top: -10rpx;
  right: 24rpx;
  width: 0;
  height: 0;
  border-color: transparent transparent --color(--qui-BG-2);
  border-style: solid;
  border-width: 0 12rpx 12rpx;
  content: '';
}
.qui-back-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  background: transparent;
  transition: all 0.2s;
  align-items: center;
  justify-content: center;
}
</style>
