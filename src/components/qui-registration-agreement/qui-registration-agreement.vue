<template>
  <view
    class="registration-agreement"
    v-if="
      (forums.agreement && forums.agreement.register) ||
        (forums.agreement && forums.agreement.privacy)
    "
    :style="'top:' + top + 'px'"
  >
    <view class="registration-agreement__content">
      <text>{{ i18n.t('user.agreement') }}</text>
      <text
        class="registration-agreement__content__register"
        @tap="open('register')"
        v-if="forums.agreement && forums.agreement.register"
      >
        {{ `《${i18n.t('user.agreementRegister')}》` }}
      </text>
      <text
        class="registration-agreement__content__privacy"
        @tap="open('privacy')"
        v-if="forums.agreement && forums.agreement.privacy"
      >
        {{ `《${i18n.t('user.agreementPrivacy')}》` }}
      </text>
    </view>
    <uni-popup-pullscreen ref="popupMessage" type="bottom" :stop-touch="false">
      <view class="popup-message">
        <view class="popup-message__content">
          <view class="popup-message__content__title">{{ popTitle }}</view>
          <view class="popup-message__content__detail">
            {{ popDetail || i18n.t('share.nothing') }}
          </view>
        </view>
        <view class="popup-message__space"></view>
        <text class="popup-message__btn" @click="cancel('share')">
          {{ i18n.t('discuzq.close') }}
        </text>
      </view>
    </uni-popup-pullscreen>
  </view>
</template>

<script>
import forums from '@/mixin/forums';
import uniPopupPullscreen from '@/components/uni-popup/uni-popup-pullscreen';

export default {
  components: { uniPopupPullscreen },
  mixins: [forums],
  props: {
    tips: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      popTitle: '',
      popDetail: '',
      top: 0,
    };
  },
  mounted() {
    const height = window.innerHeight - 50;
    this.top = height;
  },
  methods: {
    open(type) {
      this.$refs.popupMessage.open();
      if (type === 'register') {
        this.popTitle = this.i18n.t('user.agreementRegister');
        this.popDetail = this.forums.agreement.register_content;
      } else {
        this.popTitle = this.i18n.t('user.agreementPrivacy');
        this.popDetail = this.forums.agreement.privacy_content;
      }
    },
    cancel() {
      this.$refs.popupMessage.close();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.registration-agreement {
  position: absolute;
  // bottom: 40px;
  width: 100%;
  padding: 0 27px;
  box-sizing: border-box;
  &__content {
    font-size: $fg-f24;
    color: --color(--qui-FC-AAA);
    text-align: center;
  }
  &__content__register,
  &__content__privacy {
    margin-left: 5px;
    font-weight: bold;
  }
}
/deep/ .uni-popup__wrapper-box {
  height: 100vh;
  background: --color(--qui-BG-2);
}
.popup-message {
  text-align: center;
  &__btn {
    height: 100rpx;
    font-size: $fg-f28;
    line-height: 100rpx;
    color: --color(--qui-FC-333);
    text-align: center;
  }
  &__space {
    width: 100%;
    height: 10rpx;
    background: --color(--qui-BG-ED);
  }
  &__content {
    min-height: calc(100vh - 60px);
  }
  &__content__title {
    height: 60rpx;
    padding: 40rpx 0;
    font-size: $fg-f28;
    line-height: 60rpx;
  }
  &__content__detail {
    padding: 0 40rpx;
    padding-bottom: 40px;
    font-size: $fg-f24;
    text-align: justify;
    // text-indent: 2em;
    white-space: pre-line;
  }
}
</style>
