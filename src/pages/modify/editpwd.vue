<template>
  <qui-page :data-qui-theme="theme" class="page-edipwd">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('modify.edipwdtitle')"></qui-header-back>
    <!-- #endif -->
    <view class="chagepas">
      <view class="chagepas-pas">
        <input
          type="password"
          :class="judge ? 'chagepas-pas-inpa2' : 'chagepas-pas-inpa'"
          :placeholder="i18n.t('modify.enterold')"
          placeholder-style="color:rgba(221,221,221,1)"
          v-model="valueused"
          @input="changeinput"
        />
        <view class="chagepas-erro-messag1" v-if="judge">
          {{ text }}
        </view>
        <input
          type="password"
          :class="judge2 ? 'chagepas-pas-inpa2' : 'chagepas-pas-inpa'"
          :placeholder="i18n.t('modify.enternew')"
          placeholder-style="color:rgba(221,221,221,1)"
          v-model="valuenew"
          @input="changeinput2"
        />
        <view class="chagepas-erro-messag1" v-if="judge2">
          {{ text1 }}
        </view>
        <input
          type="password"
          :class="judge3 ? 'chagepas-pas-inpa2' : 'chagepas-pas-inpa'"
          :placeholder="i18n.t('modify.enterreplace')"
          placeholder-style="color:rgba(221,221,221,1)"
          v-model="valuetone"
          @input="changeinput3"
        />
        <view class="chagepas-erro-messag1" v-if="judge3">
          {{ i18n.t('modify.masstext') }}
        </view>
        <view class="chagepas-pas-btn">
          <qui-button :type="styledisbla" size="large" :disabled="disab" @click="submission">
            {{ i18n.t('modify.submission') }}
          </qui-button>
        </view>
        <view class="chagepas-erro-forget" @click="runretire" v-if="forums.qcloud.qcloud_sms">
          {{ i18n.t('modify.forgetoldpassword') }}
        </view>
      </view>
    </view>
  </qui-page>
</template>
<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  data() {
    return {
      userid: '',
      fun: true,
      valueused: '',
      valuenew: '',
      valuetone: '',
      judge: false,
      judge2: false,
      judge3: false,
      text: '',
      text1: '',
      styledisbla: 'primary',
      disab: false,
      icon: 'none',
      currs: '',
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
      if (this.valueused && this.valuetone && this.valuenew) {
        this.changpasword();
      } else if (!this.valueused) {
        uni.showToast({
          icon: this.icon,
          title: this.i18n.t('modify.oldpassword'),
          duration: 2000,
        });
      } else if (!this.valuenew) {
        uni.showToast({
          icon: this.icon,
          title: this.i18n.t('modify.newpassword'),
          duration: 2000,
        });
      } else if (!this.valuetone) {
        uni.showToast({
          icon: this.icon,
          title: this.i18n.t('modify.confrimpasword'),
          duration: 2000,
        });
      }
    },
    changtype() {
      this.disab = false;
    },
    changeinput() {
      this.judge = false;
      this.disab = false;
      this.styledisbla = 'primary';
      this.chanagedisab();
    },
    changeinput2() {
      this.judge2 = false;
      this.disab = false;
      this.styledisbla = 'primary';
      this.chanagedisab();
    },
    changeinput3() {
      this.judge3 = false;
      this.disab = false;
      this.styledisbla = 'primary';
      this.chanagedisab();
    },
    chanagedisab() {
      if (this.valueused && this.valuenew && this.valuetone) {
        this.disab = false;
        this.styledisbla = 'primary';
      }
    },
    // 修改密码请求
    changpasword() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        password: this.valueused,
        newPassword: this.valuenew,
        password_confirmation: this.valuetone,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/patch', params));
      postphon
        .then(res => {
          if (res) {
            uni.showToast({
              title: this.i18n.t('modify.titlepassword'),
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
          this.disab = true;
          this.styledisbla = 'default';
          if (err.statusCode === 422) {
            if (this.valuetone === this.valuenew) {
              this.judge2 = true;
              this.judge3 = false;
              const [
                {
                  detail: [sun],
                },
              ] = err.data.errors;
              this.text1 = sun;
            } else {
              this.judge3 = true;
              this.judge2 = false;
              this.disab = true;
            }
          } else if (err.statusCode === 500) {
            this.judge2 = false;
            this.judge3 = false;
            this.judge = true;
            const [
              {
                detail: [sun],
              },
            ] = err.data.errors;
            this.text = sun;
          }
        });
    },
    runretire() {
      uni.redirectTo({
        url: `/pages/modify/findpwd?user=${this.userid}&pas=reset_pwd`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.page-edipwd /deep/ {
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
  .chagepas-pas-inpa {
    width: 100%;
    height: 100rpx;
    font-size: $fg-f34;
    font-weight: 400;
    line-height: 100rpx;
    text-align: left;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .chagepas-pas-inpa2 {
    width: 100%;
    height: 100rpx;
    font-size: $fg-f34;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-RED);
    text-align: left;
    border-bottom: 2rpx solid --color(--qui-RED);
  }
  .chagepas-pas-btn {
    margin: 50rpx auto 0;
  }
  .chagepas-erro-messag1 {
    margin-top: 20rpx;
    font-size: $fg-f24;
    font-weight: 400;
    color: --color(--qui-RED);
  }
  .chagepas-erro-forget {
    margin: 30rpx 0 0;
    font-size: $fg-f28;
    font-weight: 400;
    line-height: 37rpx;
    color: --color(--qui-LINK);
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
