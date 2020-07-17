<template>
  <qui-page :data-qui-theme="theme" class="site">
    <qui-header
      :head-img="
        forums.set_site && forums.set_site.site_logo
          ? forums.set_site.site_logo
          : '/static/logo.png'
      "
      :theme="i18n.t('home.theme')"
      :theme-num="forums.other && forums.other.count_users"
      :post-num="forums.other && forums.other.count_threads"
      :share-btn="shareBtn"
      :share-show="shareShow"
      :is-show-more="false"
      :is-show-back="false"
      :is-show-home="false"
      :iconcolor="theme === $u.light() ? '#333' : '#fff'"
      @click="open"
      @closeShare="closeShare"
    ></qui-header>
    <uni-popup ref="popupHead" type="bottom">
      <qui-share @close="cancel"></qui-share>
    </uni-popup>
    <view class="site-item">
      <qui-cell-item
        class="cell-item--auto cell-item--left"
        :title="i18n.t('site.circleintroduction')"
        :addon="forums.set_site && forums.set_site.site_introduction"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('site.creationtime')"
        :addon="forums.set_site && forums.set_site.site_install"
      ></qui-cell-item>
      <qui-cell-item :title="i18n.t('site.circlemode')" :addon="handleMode()"></qui-cell-item>
      <qui-cell-item :title="i18n.t('site.circlemaster')" slot-right>
        <view class="site-item__owner">
          <qui-avatar
            class="site-item__owner-avatar"
            :user="{
              username: forums.set_site && forums.set_site.site_author.username,
              avatarUrl: forums.set_site && forums.set_site.site_author.avatar,
            }"
            size="60"
          />
          <text class="site-item__owner-name">
            {{ forums.set_site && forums.set_site.site_author.username }}
          </text>
        </view>
      </qui-cell-item>
      <qui-cell-item :title="i18n.t('home.theme')" slot-right>
        <view class="site-item__person">
          <view
            v-for="(item, index) in forums.users"
            :key="index"
            class="site-item__person__content"
          >
            <qui-avatar class="site-item__person__content-avatar" :user="item" size="60" />
          </view>
        </view>
      </qui-cell-item>
      <qui-cell-item
        :title="i18n.t('site.myauthority')"
        slot-right
        :border="false"
        class="cell-item--auto cell-item--left"
      >
        <view v-for="(item, index) in permission" :key="index" class="site-item__permission">
          <text>{{ i18n.t(`permission.${item.permission}`) }}</text>
        </view>
      </qui-cell-item>
    </view>
    <view class="site-invite">
      <view class="site-invite__detail">
        <text class="site-invite__detail__bold">
          {{ inviteData.user && inviteData.user.username }}
        </text>
        <text>{{ i18n.t('site.inviteyouas') }}</text>
        <text class="site-invite__detail__bold">
          {{ `[ ${inviteData.group && inviteData.group.name} ]` }}
        </text>
        <text>{{ i18n.t('site.join') }}</text>
        <text class="site-invite__detail__bold">
          {{ forums.set_site && forums.set_site.site_name }}
        </text>
        <text>{{ i18n.t('site.site') }}</text>
      </view>
      <view class="site-invite__button">
        <qui-button type="primary" size="large" @click="check">
          {{ i18n.t('site.accepttheinvitationandbecome') }}
          {{ inviteData.group && inviteData.group.name }}
        </qui-button>
      </view>
    </view>
    <uni-popup ref="popCode" type="center">
      <uni-popup-dialog
        type="warning"
        :before-close="true"
        :content="codeTips"
        @close="handleInviteCancel"
        @confirm="handleInviteOk"
      ></uni-popup-dialog>
    </uni-popup>
    <qui-toast ref="toast"></qui-toast>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
import appCommonH from '@/utils/commonHelper';
import loginAuth from '@/mixin/loginAuth-h5';
// #endif

export default {
  components: { uniPopupDialog },
  mixins: [
    forums,
    // #ifdef  H5
    wxshare,
    loginAuth,
    appCommonH,
    // #endif
  ],
  data() {
    return {
      code: '', // 邀请码
      permission: [],
      shareBtn: 'icon-share1',
      shareShow: false, // h5内分享提示信息
      isWeixin: '', // 是否是微信浏览器内
      inviteData: {}, // 邀请的相关信息
      codeTips: '',
    };
  },
  onLoad(params) {
    this.code = params.code;
    this.getInviteInfo(params.code);
    // #ifdef  H5
    this.isWeixin = appCommonH.isWeixin().isWeixin;
    // #endif
  },
  onReady() {
    // 处理站点模式
    this.handleMode();
  },
  // 唤起小程序原声分享
  onShareAppMessage(res) {
    // 来自页面内分享按钮
    if (res.from === 'button') {
      return {
        title: this.forums.set_site.site_name,
      };
    }
    return {
      title: this.forums.set_site.site_name,
    };
  },
  methods: {
    // 首页头部分享按钮弹窗
    open() {
      // #ifdef MP-WEIXIN
      this.$refs.popupHead.open();
      // #endif
      // #ifdef H5
      if (this.isWeixin === true) {
        this.shareShow = true;
      } else {
        this.h5Share({
          title: this.forums.set_site.site_name,
          url: `pages/site/partner-invite?code=${this.code}`,
        });
      }
      // #endif
    },
    closeShare() {
      this.shareShow = false;
    },
    // 取消按钮
    cancel() {
      this.$refs.popupHead.close();
    },
    handleMode() {
      if (!this.forums.set_site) {
        return;
      }
      if (this.forums.set_site.site_mode === 'pay') {
        const siteMode = `${this.i18n.t('site.paymentmode')}，¥${
          this.forums.set_site.site_price
        }，`;
        const siteExpire = this.forums.set_site.site_expire
          ? this.i18n.t('site.periodvalidity') +
            this.forums.set_site.site_expire +
            this.i18n.t('site.day')
          : this.i18n.t('site.permanent');
        return siteMode + siteExpire;
      }
      const siteMode = this.i18n.t('site.publicmode');
      return siteMode;
    },
    // 调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
    },
    check() {
      // 处理邀请码状态 status 0 失效  1 未使用  2 已使用 3 已过期
      const statusVal =
        this.inviteData.status || this.inviteData.status === 0 ? this.inviteData.status : 'error';
      switch (statusVal) {
        case 0: {
          this.codeTips = this.i18n.t('site.codeinvalid');
          this.$refs.popCode.open();
          break;
        }
        case 1: {
          this.submit();
          break;
        }
        case 2: {
          this.codeTips = this.i18n.t('site.codeused');
          this.$refs.popCode.open();
          break;
        }
        case 3: {
          this.codeTips = this.i18n.t('site.codeexpired');
          this.$refs.popCode.open();
          break;
        }
        case 'error': {
          this.codeTips = this.i18n.t('site.codenotfound');
          this.$refs.popCode.open();
          break;
        }
        default:
          return '';
      }
    },
    getInviteInfo(code) {
      status
        .run(() => this.$store.dispatch('jv/get', `invite/${code}`))
        .then(res => {
          this.inviteData = res;
          this.permission = res.group.permission;
        });
    },
    handleInviteCancel() {
      this.$refs.popCode.close();
    },
    handleInviteOk() {
      this.$refs.popCode.close();
      this.submit();
    },
    submit() {
      // 未登陆的情况
      if (!this.$store.getters['session/get']('isLogin')) {
        // #ifdef MP-WEIXIN
        this.$store.getters['session/get']('auth').open();
        // #endif
        // #ifdef H5
        this.handleLogin(this.code);
        // #endif
      } else {
        // 已经登陆的情况
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: '/pages/home/index',
        });
        // #endif
        // #ifdef H5
        if (this.forums.set_reg.register_type === 2 && this.isWeixin === true) {
          // 无感模式
          uni.navigateTo({
            url: '/pages/home/index',
          });
        } else {
          this.$refs.toast.show({ message: this.i18n.t('site.codeforbid') });
        }
        // #endif
      }
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.site /deep/ {
  .header {
    height: auto;
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .header .circleDet {
    padding: 60rpx 40rpx 50rpx;
    opacity: 1;
  }
  .header .circleDet-txt {
    color: --color(--qui-FC-333);
    opacity: 1;
  }
  .header .logo {
    height: 75rpx;
    padding-top: 71rpx;
  }
  .cell-item__body__content-title {
    width: 120rpx;
    margin-right: 40rpx;
    color: --color(--qui-FC-777);
  }
  .header .circleDet-num,
  .header .circleDet-share {
    color: --color(--qui-FC-333);
  }
  .site-invite {
    padding-bottom: 50rpx;
    text-align: center;
  }
  .cell-item--auto .cell-item__body {
    height: auto;
    padding: 35rpx 0;
    align-items: flex-start;
  }
  .cell-item--left .cell-item__body__right {
    text-align: left;
  }
}
//下面部分样式
.site-item {
  padding-left: 40rpx;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.site .cell-item {
  padding-right: 40rpx;
}
.site-invite__detail__bold {
  margin: 0 5rpx;
  font-weight: bold;
}
.site-invite__detail {
  width: 85%;
  padding: 0 20rpx;
  margin: 50rpx auto 30rpx;
  font-size: 28rpx;
}
.site-item__person__content-avatar,
.site-item__owner-avatar {
  margin-left: 8rpx;
}
.site-item__person__content-avatar {
  margin-left: 8rpx;
}
.site-item__owner {
  display: flex;
  align-items: center;
}
.site-item__owner-avatar {
  margin-right: 20rpx;
}
.site-item__person {
  display: flex;
  height: 60rpx;
  overflow: hidden;
  font-size: 0;
}
.site-item__person__content {
  display: inline-block;
}
.site-item__permission {
  display: inline-block;
  height: 60rpx;
  padding: 0 28rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  font-size: $fg-f26;
  line-height: 60rpx;
  border: 2rpx solid --color(--qui-BOR-ED);
  border-radius: 7rpx;
}
</style>
