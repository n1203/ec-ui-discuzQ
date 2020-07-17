<template>
  <qui-page :data-qui-theme="theme" class="quipage">
    <view class="painter">
      <view class="canvas-box" :style="{ paddingTop: paddingtop + 'rpx' }">
        <view class="cent" :style="{ height: constyle + 'rpx' }">
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
// import Carda from '@/wxcomponents/card/cardtposter'; // 标题文字海报 41
import Cardk from '@/wxcomponents/card/cardtpostertwo'; // 标题文字海报 41
import Cardb from '@/wxcomponents/card/cardaitu'; // 标题单图片文字海报 43
import Cardd from '@/wxcomponents/card/cardimg'; // 纯图片海报  164
// import Cardf from '@/wxcomponents/card/cardpicture'; // 标题多图片海报 41
import Cardg from '@/wxcomponents/card/cardvideo'; // 视频海报 43
import Cardh from '@/wxcomponents/card/card'; // 文字海报  46
// import Cardi from '@/wxcomponents/card/cardtext';
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  data() {
    return {
      imagePath: '',
      width: 700,
      template: {},
      userid: '',
      slitename: '', // 站点名称
      themeid: '', // 数据id
      headerImg: '', // 头像
      headerName: '', // 名字
      postyTepy: '', // 帖子类型
      subHeading: '', // 小标题
      contentTitle: '', // 内容标题
      content: '', // 内容
      contentImg: [], // 内容照片
      video: '', // 视频帖子
      videoduc: '', // 视频文件名
      videotime: '', // 视频时间
      attachmentsType: '', // 话题分类
      themwidth: 180,
      renamewidth: 400,
      reconame: '',
      recoimg: '',
      constyle: 0,
      paddingtop: 43,
      imgtop: 0,
      jurisdiction: true,
      that: '',
      attachlength: 97,
      marglength: 160,
      heightdefill: '',
      picutre: '',
      picutrecopy: '',
      contentheight: '',
      implement: '',
    };
  },
  onLoad(arr) {
    uni.showLoading({
      title: this.i18n.t('share.generating'),
      mask: true,
    });
    this.themeid = arr.id;
    this.userid = this.usersid;
    this.slitename = this.forums.set_site.site_name;
    this.getusertitle();
  },
  computed: {
    usersid() {
      return this.$store.getters['session/get']('userId');
    },
    // themedata() {
    //   return this.$store.getters['jv/get'](`threads/${this.themeid}`);
    // },
    userInfo() {
      return this.$store.getters['jv/get'](`users/${this.userid}`);
    },
  },
  watch: {
    heightdefill: {
      handler(newValue) {
        if (newValue || newValue === 0) {
          this.initData();
        }
      },
      deep: true,
    },
    content: {
      handler(newValue) {
        if (newValue) {
          if (this.implement) {
            this.initData();
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    // 获取用户信息
    getusertitle() {
      this.reconame = this.userInfo.username;
      this.recoimg = this.userInfo.avatarUrl || `${this.$u.host()}static/images/noavatar.gif`;
      this.getthemdata();
    },
    // 获取帖子内容信息
    getthemdata() {
      const that = this;
      this.$store
        .dispatch(
          'jv/get',
          `threads/${this.themeid}?include=user,firstPost,firstPost.images,threadVideo,category`,
        )
        .then(data => {
          this.headerName = data.user.username;
          this.postyTepy = data.type;
          this.headerImg = data.user.avatarUrl || `${this.$u.host()}static/images/noavatar.gif`;
          if (data.firstPost.images.length >= 1) {
            if (this.postyTepy === 2 && data.threadVideo.cover_url) {
              this.implement = false;
            } else {
              this.implement = false;
            }
          } else {
            this.implement = true;
          }
          const arr = Object.values(data.firstPost.images);
          arr.forEach(value => {
            this.contentImg.push(value.thumbUrl || value.url);
          });
          if (this.contentImg) {
            uni.getImageInfo({
              src: that.contentImg[0],
              success(image) {
                const num = image.height * (620 / image.width);
                if (num > 402) {
                  that.heightdefill = num - 402;
                } else {
                  that.heightdefill = 0;
                }
              },
            });
          }
          this.contentTitle = data.title;
          this.content = data.firstPost.content;
          if (this.content) {
            const num = Math.ceil(this.content.length / 23);
            if (num >= 11) {
              this.contentheight = 0;
            } else {
              this.contentheight = 472 - num * 42;
            }
          }
          this.attachmentsType = data.category.name;
          this.attachlength = this.attachmentsType.length * 24 + 3;
          this.marglength = this.attachlength + 40;
          if (this.postyTepy === 2) {
            this.video = data.threadVideo.cover_url;
            this.videoduc = data.threadVideo.file_name;
            uni.getImageInfo({
              src: that.video,
              success(image) {
                const num = image.height * (620 / image.width);
                if (num > 402) {
                  that.heightdefill = num - 402;
                } else {
                  that.heightdefill = 0;
                }
              },
            });
          }
        });
      // this.headerName = this.themedata.user.username;
      // this.postyTepy = this.themedata.type;
      // this.headerImg =
      //   this.themedata.user.avatarUrl || `${this.$u.host()}static/images/noavatar.gif`;
      // if (this.themedata.firstPost.images.length >= 1 || this.postyTepy === 2) {
      //   this.implement = false;
      // } else {
      //   this.implement = true;
      // }
      // console.log(this.implement);
      // const arr = Object.values(this.themedata.firstPost.images);
      // arr.forEach(value => {
      //   this.contentImg.push(value.thumbUrl || value.url);
      // });
      // if (this.contentImg) {
      //   uni.getImageInfo({
      //     src: that.contentImg[0],
      //     success(image) {
      //       const num = image.height * (620 / image.width);
      //       if (num > 402) {
      //         that.heightdefill = num - 402;
      //       } else {
      //         that.heightdefill = 0;
      //       }
      //     },
      //   });
      // }
      // this.contentTitle = this.themedata.title;
      // this.content = this.themedata.firstPost.content;
      // console.log(this.content);
      // if (this.content) {
      //   const num = Math.ceil(this.content.length / 23);
      //   if (num >= 11) {
      //     this.contentheight = 0;
      //   } else {
      //     this.contentheight = 472 - num * 42;
      //   }
      // }
      // console.log(this.contentheight);
      // this.attachmentsType = this.themedata.category.name;
      // this.attachlength = this.attachmentsType.length * 24 + 3;
      // this.marglength = this.attachlength + 40;
      // if (this.postyTepy === 2) {
      //   this.video = this.themedata.threadVideo.cover_url;
      //   this.videoduc = this.themedata.threadVideo.file_name;
      //   uni.getImageInfo({
      //     src: that.video,
      //     success(image) {
      //       const num = image.height * (620 / image.width);
      //       if (num > 402) {
      //         that.heightdefill = num - 402;
      //       } else {
      //         that.heightdefill = 0;
      //       }
      //     },
      //   });
      // }
    },
    initData() {
      if (!this.contentTitle) {
        this.imgtop = 80;
      }
      const obj = {
        username: this.headerName, // 名字
        userheader: this.headerImg, // 头像
        usertitle: this.contentTitle, // 内容标题
        usercontent: this.content, // 内容
        usercontimg: this.contentImg, // 内容图片
        userattname: this.attachmentsName, // 帖子内容名称
        useratttype: this.attachmentsType, // 帖子分类
        userweixincode: `${this.$u.host()}api/oauth/wechat/miniprogram/code?path=/pages/topic/index?id=${
          this.themeid
        }`, // 微信二维码
        slitename: this.slitename, // 站点名称
        uservideo: this.video,
        uservideoduc: this.videoduc,
        namewidth: this.themwidth,
        renamewidth: this.renamewidth,
        reconame: this.reconame + this.i18n.t('share.recomment'),
        recoimg: this.recoimg,
        imgtop: this.imgtop,
        attachlength: this.attachlength,
        marglength: this.marglength,
        heightdefill: this.heightdefill,
        contentheight: this.contentheight,
        longpressrecog: this.i18n.t('share.longpressrecog'), // 长按识别
        recomment: this.i18n.t('share.recomment'),
        goddessvideo: this.attachmentsType,
        comefrom: this.i18n.t('share.comefrom'), // 来自
        stay: this.i18n.t('share.stay'), // 在
        published: this.i18n.t('share.published'),
        contents: this.i18n.t('share.contents'),
      };
      if (this.contentTitle) {
        // 有标题有图片海报
        if (this.contentImg.length === 1) {
          this.constyle = 1100 + this.heightdefill;
          this.paddingtop = 43;
          this.template = new Cardb().palette(obj);
          // 多图片海报
        } else if (this.contentImg.length > 1) {
          this.constyle = 1100 + this.heightdefill;
          this.paddingtop = 43;
          this.template = new Cardb().palette(obj);
          // 只有标题文字的海报
        } else if (this.contentImg.length === 0 && this.content) {
          this.constyle = 1083 - this.contentheight;
          this.paddingtop = 41;
          this.template = new Cardk().palette(obj);
          // 视频贴
        } else if (this.postyTepy === 2) {
          this.constyle = 1100 + this.heightdefill;
          this.paddingtop = 43;
          this.template = new Cardg().palette(obj);
        }
        // 没有标题的海报
      } else if (!this.contentTitle) {
        if (this.content && this.contentImg.length === 1) {
          this.constyle = 1100 + this.heightdefill;
          this.paddingtop = 43;
          this.template = new Cardb().palette(obj);
          // 只有一张图片
        } else if (!this.content && this.contentImg.length === 1) {
          this.constyle = 908;
          this.paddingtop = 164;
          this.template = new Cardd().palette(obj);
          // 多图片没标题内容海报
        } else if (this.content && this.contentImg.length > 1) {
          this.constyle = 1100 + this.heightdefill;
          this.paddingtop = 43;
          this.template = new Cardb().palette(obj);
        } else if (this.postyTepy === 2) {
          this.constyle = 1100 + this.heightdefill;
          this.paddingtop = 43;
          this.template = new Cardg().palette(obj);
        } else {
          this.constyle = 1082 - this.contentheight;
          this.paddingtop = 46;
          // this.template = new Cardh().palette(obj);
          this.template = new Cardh().palette(obj);
        }
      } else {
        this.constyle = 1082 - this.contentheight;
        this.paddingtop = 46;
        // this.template = new Cardh().palette();
        this.template = new Cardh().palette(obj);
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
.quipage {
  width: 100vw;
  height: 100vh;
}
.painter {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  background-color: --color(--qui-BG-2);
}
.canvas-box {
  // width: 100%;
  // height: 100vh;
  margin-bottom: 155rpx;
}
.cent {
  width: 700rpx;
  margin: 0 auto;
  background: --color(--qui-FC-FFF);
  border-radius: 7rpx;
  box-shadow: 0 3rpx 6rpx rgba(0, 0, 0, 0.16);
  .cent-image {
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
  margin: 0 auto 40rpx;
}
</style>
