<template>
  <qui-page :data-qui-theme="theme" class="page-realname">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('modify.realnametitle')"></qui-header-back>
    <!-- #endif -->
    <view class="tica">
      <view class="tica-name">
        <input
          type="text"
          class="tica-name-inpa"
          :placeholder="i18n.t('modify.realname')"
          placeholder-style="color:rgba(221,221,221,1)"
          v-model="myname"
        />
        <view class="tica-erro-messag1" v-if="judge">
          {{ title2 }}
        </view>
        <input
          type="text"
          class="tica-name-inpa"
          :placeholder="i18n.t('modify.enteridnumber')"
          placeholder-style="color:rgba(221,221,221,1)"
          v-model="myid"
        />
        <view class="tica-erro-messag1" v-if="judge">
          {{ title1 }}
        </view>
        <view class="tica-pas-btn">
          <qui-button type="primary" size="large" @click="btntica">
            {{ i18n.t('modify.submission') }}
          </qui-button>
        </view>
      </view>
    </view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';

export default {
  data() {
    return {
      userid: '',
      fun: true,
      myname: '',
      myid: '',
      title1: '',
      title2: '',
      judge: false,
      icon: 'none',
    };
  },
  onLoad() {
    this.userid = this.usersid;
  },
  computed: {
    usersid() {
      return this.$store.getters['session/get']('userId');
    },
  },
  methods: {
    realnameauthen() {
      if (!this.myname) {
        uni.showToast({
          icon: this.icon,
          title: this.i18n.t('modify.emptyname'),
          duration: 2000,
        });
      } else if (!this.myid) {
        uni.showToast({
          icon: this.icon,
          title: this.i18n.t('modify.idcardisempty'),
          duration: 2000,
        });
      }
    },
    btntica() {
      if (this.myname && this.myid) {
        this.authentication();
      } else if (!this.myname) {
        uni.showToast({
          icon: this.icon,
          title: this.i18n.t('modify.emptyname'),
          duration: 2000,
        });
      } else if (!this.myid) {
        uni.showToast({
          icon: this.icon,
          title: this.i18n.t('modify.idcardisempty'),
          duration: 2000,
        });
      }
    },
    authentication() {
      const _this = this;
      const params = {
        _jv: {
          type: 'users/real',
        },
        identity: this.myid,
        realname: this.myname,
      };
      const patchname = status.run(() => this.$store.dispatch('jv/patch', params));
      patchname
        .then(res => {
          if (res) {
            const param = {
              _jv: {
                type: 'forum',
              },
            };
            _this.$store.dispatch('jv/get', param).then(() => {
              // console.log(1, 'froums');
            });
            const promsget = {
              _jv: {
                type: 'users',
                id: this.userid,
              },
              // include: 'groups',
            };
            _this.$store.dispatch('jv/get', promsget).then(() => {});
            uni.showToast({
              title: this.i18n.t('modify.nameauthensucc'),
              duration: 2000,
            });
            // #ifdef H5
            uni.navigateBack({
              delta: 1,
            });
            // #endif
            // #ifndef H5
            uni.redirectTo({
              url: '/pages/my/profile',
              success() {
                const pages = getCurrentPages();
                pages[1].onLoad();
              },
            });
            // #endif
          }
        })
        .catch(err => {
          if (err.statusCode === 422) {
            this.judge = true;
            const [
              {
                detail: [sun],
              },
            ] = err.data.errors;
            this.title1 = sun;
            uni.showToast({
              icon: 'none',
              title: this.title1,
              duration: 2000,
            });
          } else if (err.statusCode === 500) {
            this.judge = true;
            if (err.data.errors[0].detail === this.i18n.t('modify.idtitl')) {
              this.title1 = err.data.errors[0].detail;
              uni.showToast({
                icon: 'none',
                title: this.title1,
                duration: 2000,
              });
            } else {
              this.title2 = err.data.errors[0].detail;
              uni.showToast({
                icon: 'none',
                title: this.title2,
                duration: 2000,
              });
            }
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.page-realname /deep/ {
  .tica {
    width: 100vw;
    height: 100vh;
    /* #ifdef H5 */
    padding-top: 100rpx;
    /* #endif */
    background-color: --color(--qui-BG-2);
    box-sizing: border-box;
  }
  .tica-name {
    width: 100%;
    padding: 31rpx 0 0 40rpx;
    box-sizing: border-box;
  }
  .tica-name-inpa {
    width: 100%;
    height: 100rpx;
    font-size: $fg-f34;
    font-weight: 400;
    line-height: 100rpx;
    text-align: left;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .tica-pas-btn {
    margin: 50rpx 0 0;
  }
  .tica-erro-messag1 {
    margin-top: 20rpx;
    font-size: $fg-f24;
    font-weight: 400;
    color: --color(--qui-RED);
  }
}
.tica-pas-btn /deep/.qui-button--button {
  &[size='large'] {
    font-size: $fg-f28;
    color: --color(--qui-FC-FFF);
    border-radius: 7rpx;
  }
}
</style>
