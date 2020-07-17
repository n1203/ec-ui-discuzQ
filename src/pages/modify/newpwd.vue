<template>
  <qui-page :data-qui-theme="theme" class="page-newpwd">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('modify.newpwdtitle')"></qui-header-back>
    <!-- #endif -->
    <view class="setuppas">
      <view class="setuppas-pas">
        <input
          type="password"
          class="setuppas-pas-inpa"
          :placeholder="i18n.t('modify.enternew')"
          placeholder-style="color:rgba(221,221,221,1)"
          v-model="valueused"
        />
        <input
          type="password"
          class="setuppas-pas-inpa"
          :placeholder="i18n.t('modify.enterreplace')"
          placeholder-style="color:rgba(221,221,221,1)"
          v-model="valuenew"
        />
        <view class="setuppas-erro-messag1" v-if="judge2">
          {{ test }}
        </view>
        <view class="setuppas-pas-btn">
          <qui-button type="primary" size="large" @click="submission">
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
      valueused: '',
      valuenew: '',
      judge: false,
      judge2: false,
      test: '',
    };
  },
  onLoad() {
    this.userid = this.usersid;
  },
  computed: {
    usersid() {
      return this.$store.getters['session/get']('userId');
    },
    users() {
      return this.$store.getters['jv/get'](`users/${this.usersid}`);
    },
  },
  methods: {
    submission() {
      if (this.valueused && this.valuenew) {
        if (this.valueused === this.valuenew) {
          if (this.users.hasPassword) {
            uni.showToast({
              icon: 'none',
              title: this.i18n.t('modify.logoinpaswd'),
              duration: 2000,
            });
          } else {
            this.setpassword();
          }
        } else {
          this.judge2 = true;
          this.test = this.i18n.t('modify.masstext');
        }
      } else if (!this.valueused) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('modify.newpassword'),
          duration: 2000,
        });
      } else if (!this.valuenew) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('modify.confrimpasword'),
          duration: 2000,
        });
      }
    },
    setpassword() {
      const _this = this;
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        newPassword: this.valueused,
        password_confirmation: this.valuenew,
      };
      const postphon = status.run(() => this.$store.dispatch('jv/patch', params));
      postphon
        .then(res => {
          const promsget = {
            _jv: {
              type: 'users',
              id: this.userid,
            },
            // include: 'groups',
          };
          _this.$store.dispatch('jv/get', promsget).then(() => {});
          if (res) {
            uni.showToast({
              title: this.i18n.t('modify.passwordsetsucc'),
              duration: 2000,
            });
          }
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
        })
        .catch(err => {
          if (err.statusCode === 422) {
            this.judge2 = true;
            const [
              {
                detail: [sun],
              },
            ] = err.data.errors;
            this.test = sun;
          } else if (err.statusCode === 500) {
            this.judge2 = true;
            const [
              {
                detail: [sun],
              },
            ] = err.data.errors;
            this.test = sun;
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.page-newpwd /deep/ {
  .setuppas {
    width: 100vw;
    height: 100vh;
    /* #ifdef H5 */
    padding-top: 100rpx;
    /* #endif */
    background-color: --color(--qui-BG-2);
    box-sizing: border-box;
  }
  .setuppas-pas {
    width: 100%;
    padding: 31rpx 0 0 40rpx;
    box-sizing: border-box;
  }
  .setuppas-pas-inpa {
    width: 100%;
    height: 100rpx;
    font-size: $fg-f34;
    font-weight: 400;
    line-height: 100rpx;
    text-align: left;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    opacity: 1;
  }
  .setuppas-pas-inpa2 {
    width: 100%;
    height: 100rpx;
    font-size: $fg-f34;
    font-weight: 400;
    line-height: 100rpx;
    color: --color(--qui-RED);
    text-align: left;
    border-bottom: 2rpx solid --color(--qui-RED);
    opacity: 1;
  }
  .setuppas-pas-btn {
    margin: 50rpx 0 0;
  }
  .setuppas-erro-messag1 {
    margin-top: 20rpx;
    font-size: $fg-f24;
    font-weight: 400;
    color: --color(--qui-RED);
  }
}
.setuppas-pas-btn /deep/.qui-button--button {
  &[size='large'] {
    font-size: $fg-f28;
    color: --color(--qui-FC-FFF);
    border-radius: 7rpx;
  }
}
</style>
