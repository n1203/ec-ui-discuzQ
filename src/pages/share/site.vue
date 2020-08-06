<template>
  <qui-page :data-qui-theme="theme">
    <view class="painter">
      <view class="canvas-box">
        <view class="cent">
          <image
            :src="imagePath"
            mode="widthFix"
            @tap="previewImage"
            :show-menu-by-longpress="true"
            class="cent-image"
          ></image>
        </view>
        <view class="box-img">
          <painter
            custom-style="margin-left: 40rpx; height: 0rpx; position:fixed"
            :palette="template"
            @imgErr="imgErr"
            @imgOK="onImgOK"
            width-pixels="2080"
          />
        </view>
      </view>
      <view class="btn-box">
        <qui-button type="primary" size="large" @click="fun">
          {{ i18n.t('share.savealbum') }}
        </qui-button>
      </view>
    </view>
  </qui-page>
</template>

<script>
import Cardc from '@/wxcomponents/card/cardbasemap'; // 首页海报有底图
import Carde from '@/wxcomponents/card/cardnobasemap'; // 首页海报无底图
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  data() {
    return {
      userid: '',
      imagePath: '',
      width: 700,
      template: {},
      headerImg: '', // 头像
      headerName: '', // 名字
      slitename: '', // 站点名称
      slitelogo: '', // 站点logo
      sliteback: '', // 站点背景图
      themnumber: '', // 成员人数
      contdata: '', // 内容大小
      introd: '', // 站点介绍
      themwidth: 180,
      renamewidth: 400,
      openSettingBtnHidden: true,
      jurisdiction: true,
      leftwidth: 253,
      pages: '/pages/home/index',
    };
  },
  onLoad() {
    uni.showLoading({
      title: this.i18n.t('share.generating'),
      mask: true,
    });
    if (this.forums.set_site.site_mode === 'public') {
      this.pages = '/pages/home/index';
    } else if (this.forums.set_site.site_mode === 'pay') {
      this.pages = '/pages/site/index';
    }
    this.$nextTick(() => {
      this.userid = this.usersid;
      this.slitename = this.forums.set_site.site_name;
      this.slitelogo = this.forums.set_site.site_header_logo || `${this.$u.host()}static/logo.png`;
      this.sliteback = this.forums.set_site.site_background_image;
      this.themnumber = this.forums.other.count_users;
      this.contdata = this.forums.other.count_threads;
      this.introd = this.forums.set_site.site_introduction || this.i18n.t('share.nothing');
      this.usertitle();
    });
  },
  computed: {
    usersid() {
      return this.$store.getters['session/get']('userId');
    },
    userInfo() {
      return this.$store.getters['jv/get'](`users/${this.userid}`);
    },
  },
  methods: {
    usertitle() {
      const that = this;
      this.headerName = this.userInfo.username;
      this.themwidth = this.headerName.length * 28 + 3;
      if (this.themwidth >= 240) {
        this.themwidth = 240;
      }
      this.renamewidth = 160 + this.themwidth;
      this.headerImg = this.userInfo.avatarUrl || `${this.$u.host()}static/images/noavatar.gif`;
      if (this.slitelogo) {
        uni.getImageInfo({
          src: that.slitelogo,
          success(image) {
            const num = image.width * (88 / image.height);
            that.leftwidth = (700 - num) / 2;
          },
        });
      }
      setTimeout(() => {
        this.initData();
      }, 300);
    },
    initData() {
      const obj = {
        username: this.headerName + this.i18n.t('share.recomment'), // 名字
        userheader: this.headerImg, // 头像
        slitename: this.slitename, // 站点名称
        slitelogo: this.slitelogo, // 站点logo
        sliteback: this.sliteback, // 站点背景图
        themnumber: this.themnumber, // 成员人数
        contdata: this.contdata, // 内容大小
        introd: this.introd, // 站点介绍
        leftwidth: this.leftwidth,
        userweixincode: `${this.$u.host()}api/oauth/wechat/miniprogram/code?path=${this.pages}`, // 微信二维码
        namewidth: this.themwidth,
        renamewidth: this.renamewidth,
        longpressrecog: this.i18n.t('share.longpressrecog'), // 长按识别
        recomment: this.i18n.t('share.recomment'),
        siteintroduction: this.i18n.t('share.siteintroduction'),
        comefrom: this.i18n.t('share.comefrom'),
        member: this.i18n.t('share.member'),
        contents: this.i18n.t('share.contents'),
      };
      if (this.sliteback) {
        this.template = new Cardc().palette(obj);
        // 没有标题的海报
      } else {
        this.template = new Carde().palette(obj);
      }
    },
    onImgOK(e) {
      this.imagePath = e.detail.path;
      uni.hideLoading();
    },
    imgErr() {
      uni.hideLoading();
      uni.showModal({
        title: this.i18n.t('discuzq.msgbox.title'),
        content: this.i18n.t('share.buildfailed'),
        showCancel: false,
      });
    },
    fun() {
      const _this = this;
      uni.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            _this.jurisdiction = false;
          } else {
            _this.jurisdiction = res.authSetting['scope.writePhotosAlbum'];
          }
        },
      });
      if (!this.jurisdiction) {
        uni.openSetting({
          success(res) {
            _this.jurisdiction = res.authSetting['scope.writePhotosAlbum'];
          },
        });
      }
      uni.showModal({
        title: _this.i18n.t('discuzq.msgbox.title'),
        content: _this.i18n.t('share.confirm'),
        success(res) {
          if (res.confirm) {
            uni.saveImageToPhotosAlbum({
              filePath: _this.imagePath,
              success() {
                uni.showToast({
                  title: _this.i18n.t('share.successfully'),
                  icon: 'none',
                  duration: 2000,
                });
              },
              fail(err) {
                if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                  _this.jurisdiction = false;
                }
                uni.showToast({
                  title: _this.i18n.t('share.savefailed'),
                  icon: 'none',
                  duration: 2000,
                });
              },
            });
          }
        },
      });
    },
    previewImage() {
      const currimg = this.imagePath; // 这里获取到的是一张本地的图片
      uni.previewImage({
        current: currimg, // 需要预览的图片链接列表
        urls: [currimg], // 当前显示图片的链接
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.painter {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: --color(--qui-BG-2);
}
.canvas-box {
  width: 100%;
  height: 100%;
  padding-top: 41rpx;
  margin-bottom: 80rpx;
}
.cent {
  width: 700rpx;
  height: 980rpx;
  margin: 0 auto;
  background: --color(--qui-FC-FFF);
  border-radius: 10px;
  box-shadow: 0 3rpx 6rpx rgba(0, 0, 0, 0.16);
  .cent-image {
    display: block;
    width: 100%;
    height: 100%;
  }
}
#front {
  position: fixed;
  width: 0;
  height: 0;
}
.btn-box {
  margin: 0 0 40rpx 40rpx;
}
canvas {
  width: 600px;
  height: 300px;
}
</style>
