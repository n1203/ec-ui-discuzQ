<template>
  <qui-page :data-qui-theme="theme" class="page-sinature">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('modify.signaturetitle')"></qui-header-back>
    <!-- #endif -->
    <view class="aogph">
      <view class="aogph-tab">
        <view class="aogph-tab-ao">
          <view class="aogph-tab-ao-my">
            {{ i18n.t('modify.mysignture') }}
          </view>
          <view class="aogph-tab-ao-test">
            {{ i18n.t('modify.canalsoinput') }}
            {{ num - wordnumber }}{{ i18n.t('modify.wordnumber') }}
          </view>
        </view>
        <view class="aogph-tab-input">
          <textarea
            type="text"
            class="aogph-tab-input-in"
            maxlength="140"
            :placeholder="i18n.t('modify.signturecontent')"
            placeholder-style="color:rgba(181,181,181,1)"
            v-model="content"
            :focus="true"
            :cursor="focuscours"
            @input="fun"
            :show-confirm-bar="false"
          />
          <view class="aogph-tab-input-text"></view>
        </view>
        <view class="aogph-tab-button">
          <qui-button type="primary" size="large" @click="btnbutton">
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
      sun: true,
      content: '',
      num: 140,
      wordnumber: '',
      focuscours: '',
    };
  },
  onLoad() {
    this.userid = this.usersid;
    this.mydata();
  },
  computed: {
    usersid() {
      return this.$store.getters['session/get']('userId');
    },
  },
  methods: {
    fun(e) {
      this.wordnumber = e.target.value.length;
    },
    btnbutton() {
      this.signature();
    },
    // 获取用户数据
    mydata() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        include: 'groups',
      };
      this.$store.dispatch('jv/get', params).then(data => {
        this.content = data.signature;
        this.wordnumber = this.content.length;
        this.focuscours = this.wordnumber + 1;
      });
    },
    // 修改签名数据
    signature() {
      const params = {
        _jv: {
          type: 'users',
          id: this.userid,
        },
        signature: this.content,
      };
      const patchname = status.run(() => this.$store.dispatch('jv/patch', params));
      patchname.then(res => {
        if (res) {
          uni.showToast({
            title: this.i18n.t('modify.modificationsucc'),
            duration: 2000,
          });
          // #ifdef H5
          setTimeout(() => {
            uni.navigateBack({
              delta: 1,
            });
          }, 1000);
          // #endif
          // #ifndef H5
          setTimeout(() => {
            uni.navigateBack({
              success() {
                const pages = getCurrentPages();
                pages[1].onLoad();
              },
            });
          }, 1000);
          // #endif
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.page-sinature /deep/ {
  .aogph {
    width: 100vw;
    height: 100vh;
    /* #ifdef H5 */
    padding-top: 100rpx;
    /* #endif */
    background-color: --color(--qui-BG-2);
  }
  .aogph-tab {
    padding: 36rpx 40rpx 0;
    box-sizing: border-box;
  }
  .aogph-tab-ao {
    display: flex;
    justify-content: space-between;
  }
  .aogph-tab-ao-my,
  .aogph-tab-ao-test {
    font-size: $fg-f24;
    font-weight: 400;
    line-height: 45rpx;
    color: --color(--qui-FC-777);
    opacity: 1;
  }
  .aogph-tab-input-in {
    width: 100%;
    height: 400rpx;
    padding: 20rpx 0 0 20rpx;
    margin-top: 20rpx;
    text-align: top;
    background-color: --color(--qui-BG-1);
    border: 1rpx solid --color(--qui-FC-DDD);
    box-sizing: border-box;
  }
  .aogph-tab-button {
    margin: 50rpx 0 0;
  }
}
.aogph-tab-button /deep/.qui-button--button {
  &[size='large'] {
    font-size: $fg-f28;
    color: --color(--qui-FC-FFF);
    border-radius: 7rpx;
  }
}
</style>
