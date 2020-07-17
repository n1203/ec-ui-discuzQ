<template>
  <view class="my">
    <uni-nav-bar
      :title="i18n.t('profile.mine')"
      fixed="true"
      :color="checked ? '#fff' : '#000'"
      :background-color="checked ? '#2e2f30' : '#fff'"
      status-bar
    ></uni-nav-bar>
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      show-scrollbar="false"
      class="scroll-y"
    >
      <view class="my-info">
        <view class="my-info__box">
          <view class="my-info__box__detail">
            <qui-avatar :user="userInfo" />
            <qui-cell-item
              :title="userInfo.username || ''"
              :brief="userInfo.groupsName"
              :border="false"
              class="my-info__box__detail-username"
            ></qui-cell-item>
          </view>
        </view>
        <view class="my-info__introduction" v-if="userInfo.signature">
          {{ userInfo.signature }}
        </view>
      </view>
      <view class="my-tabs">
        <qui-tabs :values="items" @clickItem="onClickItem" :brief="true" :current="-1"></qui-tabs>
      </view>
      <view class="my-items">
        <view class="my-items__wrap">
          <navigator url="/pages/my/profile" hover-class="none">
            <qui-cell-item :title="i18n.t('profile.myprofile')" arrow></qui-cell-item>
          </navigator>
          <navigator url="/pages/my/wallet" hover-class="none">
            <qui-cell-item :title="i18n.t('profile.mywallet')" arrow></qui-cell-item>
          </navigator>
          <navigator url="/pages/my/favorite" hover-class="none">
            <qui-cell-item
              :title="i18n.t('profile.myfavorite')"
              arrow
              :border="false"
            ></qui-cell-item>
          </navigator>
        </view>
        <view class="my-items__wrap">
          <navigator url="/pages/site/index" hover-class="none">
            <qui-cell-item :title="i18n.t('profile.circleinfo')" arrow></qui-cell-item>
          </navigator>
          <navigator url="/pages/site/search" hover-class="none">
            <qui-cell-item
              :title="i18n.t('profile.search')"
              arrow
              :border="userInfo.groupsName == '管理员' ? true : false"
            ></qui-cell-item>
          </navigator>
          <navigator
            v-if="userInfo.groupsName == '管理员'"
            url="/pages/manage/index"
            hover-class="none"
          >
            <qui-cell-item
              :title="i18n.t('profile.circlemanagement')"
              arrow
              :border="false"
            ></qui-cell-item>
          </navigator>
        </view>

        <view class="my-items__wrap">
          <qui-cell-item :title="i18n.t('profile.theme')" slot-right :border="false">
            <u-switch @change="changeCheck" v-model="checked" active-color="#1E78F3"></u-switch>
          </qui-cell-item>
        </view>

        <!-- #ifdef H5-->
        <!-- 微信内：无感模式不展示按钮，其他模式展示退出并解绑按钮，微信外：任何模式都展示退出登录按钮 -->
        <view class="logout">
          <qui-button
            size="large"
            type="warn"
            @click="handleClick"
            v-if="isWeixin && offiaccount_close && register_type !== 2"
          >
            {{ i18n.t('user.noBind') }}
          </qui-button>
          <qui-button
            size="large"
            type="warn"
            @click="handleClick"
            v-if="isWeixin && !offiaccount_close"
          >
            {{ i18n.t('user.logout') }}
          </qui-button>
          <qui-button size="large" type="warn" @click="handleClick" v-if="!isWeixin">
            {{ i18n.t('user.logout') }}
          </qui-button>
        </view>
        <!-- #endif -->
      </view>
    </scroll-view>
    <uni-popup ref="popup" type="center">
      <uni-popup-dialog
        type="warn"
        content="点击下面的确定解绑按钮后，您将解除微信与本账号的绑定。如果您没有设置密码或其他登录方法，将无法再次登录本账号！"
        :before-close="true"
        @close="handleClickCancel"
        @confirm="handleClickOk"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import { THEME_DEFAULT, THEME_DARK } from '@/common/const';
import forums from '@/mixin/forums';
import appCommonH from '@/utils/commonHelper';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';

export default {
  components: { uniPopupDialog },
  mixins: [forums, appCommonH],
  data() {
    return {
      items: [
        { title: this.i18n.t('profile.topic'), brief: '0' },
        { title: this.i18n.t('profile.following'), brief: '0' },
        { title: this.i18n.t('profile.followers'), brief: '0' },
        { title: this.i18n.t('profile.likes'), brief: '0' },
      ],
      current: 0,
      checked: false,
      isWeixin: false, // 默认不是微信浏览器
      offiaccount_close: false, // 默认不开启微信公众号
      register_type: 0, // 注册模式
      site_mode: '', // 站点模式
    };
  },
  computed: {
    userId() {
      return this.$store.getters['session/get']('userId');
    },
    userInfo() {
      const userInfo = this.$store.getters['jv/get'](`users/${this.userId}`);
      userInfo.groupsName = userInfo.groups ? userInfo.groups[0].name : '';
      this.setNum(userInfo);
      return userInfo;
    },
  },
  // #ifdef H5
  created() {
    if (this.forums && this.forums.set_reg) {
      this.register_type = this.forums.set_reg.register_type;
    }
    if (this.forums && this.forums.set_site) {
      this.site_mode = this.forums.set_site.site_mode;
    }
    if (this.forums && this.forums.passport) {
      this.offiaccount_close = this.forums.passport.offiaccount_close;
    }
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
  },
  // #endif
  methods: {
    changeCheck(e) {
      getApp().globalData.themeChanged(e ? THEME_DARK : THEME_DEFAULT);
    },
    onClickItem(e) {
      uni.navigateTo({
        url: `/pages/profile/index?current=${e.currentIndex}`,
      });
    },
    // #ifdef H5
    handleClick() {
      if (this.isWeixin) {
        // 微信内
        if (this.offiaccount_close) {
          if (this.register_type !== 2) {
            this.$refs.popup.open();
          }
        } else {
          this.$store.dispatch('session/logout').then(() => window.location.reload());
        }
      } else {
        this.$store.dispatch('session/logout').then(() => window.location.reload());
      }
    },
    // #endif
    // #ifdef H5
    handleClickOk() {
      console.log('----userId-----', this.userId);
      console.log('this.forums', this.forums);
      this.$store
        .dispatch('jv/delete', `users/${this.userId}/wechat`)
        .then(res => {
          console.log('解绑成功', res);
          this.handleClickCancel();
          this.$store.dispatch('session/logout').then(() => window.location.reload());
        })
        .catch(err => console.log(err));
    },
    // #endif
    // #ifdef H5
    handleClickCancel() {
      this.$refs.popup.close();
    },
    // #endif
    // 设置粉丝点赞那些数字
    setNum(res) {
      this.items[0].brief = res.threadCount || 0;
      this.items[1].brief = res.followCount || 0;
      this.items[2].brief = res.fansCount || 0;
      this.items[3].brief = res.likedCount || 0;
    },
    // 组件初始化数据
    ontrueGetList() {
      this.checked = this.theme !== THEME_DEFAULT;
    },
    // 获取最新主题数那些
    refreshNum() {
      const userId = this.$store.getters['session/get']('userId');
      const params = {
        include: 'groups,wechat',
      };
      this.$store.dispatch('jv/get', [`users/${userId}`, { params }]);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
/* #ifdef H5 */
$height: calc(100vh - 280rpx);
/* #endif */

/* #ifdef MP-WEIXIN */
$height: calc(100vh - 260rpx);
/* #endif */
.my-items__wrap {
  padding-left: 40rpx;
  margin-top: 30rpx;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  transition: $switch-theme-time;
}
.my-items {
  padding-bottom: 60rpx;
}
.my-info {
  padding: 40rpx;
  padding-top: 30rpx;
  font-size: $fg-f28;
  background: --color(--qui-BG-2);
  transition: $switch-theme-time;
}
.my-info__box {
  display: flex;
  justify-content: space-between;
}
.my-info__introduction {
  margin-top: 40rpx;
  color: --color(--qui-FC-333);
  word-break: break-all;
  transition: $switch-theme-time;
}
.my-info__box__detail {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: $fg-f28;
  box-sizing: border-box;
}
.my-info__box__detail-username {
  padding-left: 20rpx;
}
.my-tabs {
  background: --color(--qui-BG-2);
  transition: $switch-theme-time;
}
.scroll-y {
  max-height: $height;
}
.logout {
  margin: 30rpx 30rpx 0;
  text-align: center;
  border-radius: 7rpx;
}
</style>
