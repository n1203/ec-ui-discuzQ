<template>
  <qui-page :data-qui-theme="theme" class="page-ediname">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('modify.nametitle')"></qui-header-back>
    <!-- #endif -->
    <view class="chagepas">
      <view class="chagepas-pas">
        <input
          type="text"
          class="chagepas-pas-inpa"
          :placeholder="i18n.t('modify.numbermodifitions')"
          placeholder-style="color:rgba(221,221,221,1)"
          maxlength="15"
          v-model="sername"
        />
        <view class="chagepas-erro-test" v-if="edit">
          {{ test }}
        </view>
      </view>
      <view class="chagepas-pas-btn">
        <qui-button type="primary" size="large" @click="submission">
          {{ i18n.t('modify.submission') }}
        </qui-button>
      </view>
    </view>
  </qui-page>
</template>
<script>
import { status } from '@/library/jsonapi-vuex/index';

export default {
  data() {
    return {
      fun: true,
      valueused: '',
      edit: false,
      judge: false,
      myname: '',
      test: '',
      userid: '',
      sername: '',
      nametitle: { icon: 'none', duration: 2000 },
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
    submission() {
      if (this.sername) {
        this.changname();
      } else {
        uni.showToast({
          icon: this.nametitle.icon,
          title: this.i18n.t('modify.emptyname'),
          duration: this.nametitle.duration,
        });
      }
    },
    changname() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        username: this.sername,
      };
      const patchname = status.run(() => this.$store.dispatch('jv/patch', params));
      patchname
        .then(res => {
          if (res) {
            uni.showToast({
              title: this.i18n.t('modify.modifysucc'),
              duration: 2000,
            });
            // #ifdef H5
            uni.navigateBack({
              delta: 1,
            });
            // #endif
            // #ifndef H5
            uni.navigateBack({
              delta: 1,
              success() {
                const pages = getCurrentPages();
                pages[1].onLoad();
              },
            });
            // #endif
          }
        })
        .catch(err => {
          if (err.statusCode === 500) {
            this.edit = true;
            const [
              {
                detail: [sun],
              },
            ] = err.data.errors;
            this.test = sun;
            uni.showToast({
              icon: this.nametitle.icon,
              title: this.test,
              duration: 2000,
            });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.page-ediname /deep/ {
  .chagepas {
    width: 100vw;
    height: 100vh;
    /* #ifdef H5 */
    padding-top: 100rpx;
    /* #endif */
    background-color: --color(--qui-BG-2);
    box-sizing: border-box;
  }
  .chagepas-pas {
    width: 100%;
    padding: 31rpx 0 0 40rpx;
    box-sizing: border-box;
  }
  .chagepas-erro-test {
    margin-top: 20rpx;
    font-size: $fg-f24;
    font-weight: 400;
    color: --color(--qui-RED);
  }
  .chagepas-pas-inpa {
    width: 100%;
    height: 100rpx;
    font-size: $fg-f34;
    font-weight: 400;
    line-height: 100rpx;
    text-align: left;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .chagepas-pas-btn {
    width: 670rpx;
    margin: 50rpx auto 0;
  }
}
.chagepas-pas-btn /deep/.qui-button--button {
  &[size='large'] {
    font-size: $fg-f28;
    color: --color(--qui-FC-FFF);
    border-radius: 7rpx;
  }
}
</style>
