<template>
  <view class="page-message">
    <view class="page-message--inner">
      <!-- 如果不是本地的图片，这里可以改一下，只用一个 image 标签即可，更换 src 的值即可-->
      <image
        class="page-message--icon"
        src="@/static/msg-404.svg"
        mode="aspectFit"
        lazy-load
        v-if="forumError.code === '404'"
      ></image>
      <image
        class="page-message--icon"
        src="@/static/msg-warning.svg"
        mode="aspectFit"
        lazy-load
        v-if="show || inshow"
      ></image>
      <view class="page-message--title" v-if="message.title">{{ message.title }}</view>
      <view class="page-message--subtitle" v-if="inshow">{{ message.subtitle }}</view>
      <navigator v-if="inshow" open-type="exit" target="miniProgram" class="close-btn">
        {{ message.btnTxt }}
      </navigator>
      <view class="page-message--subtitle" v-if="show">
        {{ message.subtitle | closedError(forumError, forumError.code) }}
      </view>
      <!-- 退出小程序：https://uniapp.dcloud.io/component/navigator?id=navigator 2.1.0+ -->
      <!--#ifdef MP-WEIXIN -->
      <navigator
        v-if="show && message.btnclickType == 'siteClose'"
        class="out page-message--exit"
        open-type="exit"
        hover-class="none"
        target="miniProgram"
      >
        <qui-button size="medium" class="out-btn">
          {{ message.btnTxt }}
        </qui-button>
      </navigator>
      <!-- #endif -->
      <qui-button
        v-if="
          (show && message.btnclickType == 'toBack') || (show && message.btnclickType == 'tHome')
        "
        size="medium"
        @click="handleClick"
        class="out-btn"
      >
        {{ message.btnTxt }}
      </qui-button>
      <!-- #ifdef H5-->
      <qui-button size="medium" @click="handleLoginClick" v-if="forumError.code === 'site_closed'">
        {{ i18n.t('core.admin_login') }}
      </qui-button>
      <!-- #endif -->
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import { i18n } from '@/locale';

const TYPE_404 = 'type_404';
const TYPE_CLOSED = 'site_closed';
const NOT_INSTALL = 'not_install';
const BAN_USER = 'ban_user';
const THREAD_DELETED = 'thread_deleted';
const POST_DELETED = 'post_deleted';
const IOS_DISPLAY = 'dataerro';
const TYPE_401 = 'type_401';
const USER_DELETED = 'user_deleted';
const message = {
  [TYPE_404]: {
    title: i18n.t('core.page_not_found'),
    subtitle: i18n.t('core.page_not_found_detail'),
    btnTxt: i18n.t('core.back_history'),
    icon: '@/static/msg-404.svg',
    btnclickType: 'toBack', // 点击类型，当为toHome时，navigator的open-type = redirect，当为siteClose时，navigator的open-type = exit
  },
  [TYPE_CLOSED]: {
    title: i18n.t('core.site_closed'),
    subtitle: '', // 从接口读取站点关闭后的提示语
    btnTxt: i18n.t('core.close'),
    icon: '@/static/msg-warning.svg',
    btnclickType: 'siteClose',
  },
  [NOT_INSTALL]: {
    title: i18n.t('core.not_install'),
    subtitle: '', // 从接口读取站点关闭后的提示语
    btnTxt: i18n.t('core.close'),
    icon: '@/static/msg-warning.svg',
    btnclickType: 'siteClose',
  },
  [BAN_USER]: {
    title: i18n.t('core.ban_user'),
    subtitle: '', // 从接口读取站点关闭后的提示语
    btnTxt: i18n.t('core.close'),
    icon: '@/static/msg-warning.svg',
    btnclickType: 'siteClose',
  },
  [THREAD_DELETED]: {
    title: i18n.t('core.thread_deleted'),
    subtitle: i18n.t('core.page_not_found_detail'), // 从接口读取主题被删除时主题详情页的提示语
    btnTxt: i18n.t('core.back_history'),
    icon: '@/static/msg-warning.svg',
    btnclickType: 'toBack',
  },
  [POST_DELETED]: {
    title: i18n.t('core.post_deleted'),
    subtitle: i18n.t('core.page_not_found_detail'), // 从接口读取主题被删除时主题详情页的提示语
    btnTxt: i18n.t('core.back_history'),
    icon: '@/static/msg-warning.svg',
    btnclickType: 'toBack',
  },
  [IOS_DISPLAY]: {
    title: i18n.t('home.ioschoicetitle'),
    subtitle: i18n.t('home.ioschoicecontent'), // 从接口读取主题被删除时主题详情页的提示语
    btnTxt: i18n.t('discuzq.pageHeader.title'),
    icon: '@/static/msg-warning.svg',
    btnclickType: 'toBack',
  },
  [TYPE_401]: {
    title: i18n.t('core.noViewPermission'),
    subtitle: '',
    btnTxt: i18n.t('core.back_history'),
    icon: '@/static/msg-404.svg',
    btnclickType: 'toHome', // 点击类型，当为toHome时，navigator的open-type = redirect，当为siteClose时，navigator的open-type = exit
  },
  [USER_DELETED]: {
    title: i18n.t('core.userDeleted'),
    subtitle: '',
    btnTxt: i18n.t('core.back_history'),
    icon: '@/static/msg-404.svg',
    btnclickType: 'toHome', // 点击类型，当为toHome时，navigator的open-type = redirect，当为siteClose时，navigator的open-type = exit
  },
};
export default {
  filters: {
    closedError(subtitle, err, code) {
      if (err && err.detail && code === TYPE_CLOSED) return err.detail[0];
      return subtitle;
    },
  },
  computed: {
    ...mapState({
      forumError: state => state.forum.error,
    }),
    message() {
      return message[this.forumError.code] || {};
    },
    show() {
      return (
        [
          TYPE_404,
          TYPE_CLOSED,
          NOT_INSTALL,
          BAN_USER,
          THREAD_DELETED,
          POST_DELETED,
          TYPE_401,
          USER_DELETED,
        ].indexOf(this.forumError.code) >= 0
      );
    },
    inshow() {
      return [IOS_DISPLAY].indexOf(this.forumError.code) >= 0;
    },
  },
  methods: {
    handleClick() {
      if (
        this.forumError.code === TYPE_401 ||
        this.forumError.code === THREAD_DELETED ||
        this.forumError.code === TYPE_404 ||
        this.forumError.code === POST_DELETED ||
        this.forumError.code === USER_DELETED
      ) {
        const pages = getCurrentPages();
        const delta = pages.indexOf(pages[pages.length - 1]);
        console.log(delta, '$$$$$$$$$$');
        if (delta === 0) {
          // console.log('走跳转');
          uni.redirectTo({
            url: `/pages/home/index`,
          });
        } else {
          // console.log('走返回');
          uni.navigateBack({
            delta: 1,
          });
        }
      }
    },
    handleLoginClick() {
      // #ifdef H5
      uni.navigateTo({
        url: `/pages/user/login?url=/pages/home/index&register=false`,
      });
      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';

.page-message {
  display: flex;
  align-items: center;
  justify-content: center;
  &--icon {
    height: 140rpx;
    margin: 140rpx 0 40rpx;
  }
  &--inner {
    position: relative;
    padding-bottom: 20rpx;
    margin-top: 140rpx;
    text-align: center;
  }
  &--title {
    max-width: 510rpx;
    margin: 0 auto 20rpx;
    font-size: $fg-f34;
    font-weight: bold;
    line-height: 45rpx;
    color: rgba(51, 51, 51, 1);
  }
  &--subtitle {
    max-width: 510rpx;
    margin: 0 auto 50rpx;
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 37rpx;
    color: rgba(170, 170, 170, 1);
  }
}
.out {
  height: 90rpx;
  margin-bottom: 40rpx;
  .page-message--exit {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 1;
    width: 510rpx;
    height: 90rpx;
    margin: 0 auto;
    opacity: 0;
    transform: translateX(-50%);
  }
}
.navigator-hover {
  background-color: rgba(0, 0, 0, 0);
}
.close-btn {
  width: 510rpx;
  height: 90rpx;
  margin: 50rpx auto 0;
  font-size: 28rpx;
  font-weight: 400;
  line-height: 90rpx;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  background: rgba(24, 120, 243, 1);
  border: 2rpx solid 2px rgba(237, 237, 237, 1);
}
</style>
