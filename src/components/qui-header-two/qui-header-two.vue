<template>
  <view>
    <view :class="['header', headerH5]" :style="`background: url(${backgroundHeadFullImg})`">
      <view
        class="logoBox"
        :style="headerShow ? '' : 'width:100%;position:fixed;z-index:9;top:' + 0 + 'px;'"
      >
        <view v-if="headerShow" class="fbh fbjc logoBox__header">
          <view class="logoBox__header__icon">
            <image
              class="logo"
              :src="headImg != '' && headImg != null ? headImg : '/static/logo.png'"
              lazy-load
              mode="aspectFit"
            ></image>
          </view>
          <view class="fbh fb1 fbje">
            <view @click="onHandleClickSearch" class="logoBox__header__icon iconMenu">
              <qui-icon name="icon-search" size="36" color="#fff"></qui-icon>
              <!-- <span>{{ this.$i18n.t('ec.tags') }}</span> -->
            </view>
            <view @click="onHandleClickSetting" class="logoBox__header__icon iconMenn">
              <qui-icon name="icon-screen" size="36" color="#fff"></qui-icon>
              <!-- <span>{{ this.$i18n.t('ec.tags') }}</span> -->
            </view>
          </view>
        </view>
        <view
          :style="
            `background-image: url(${backgroundHeadFullImg}); background-position-y: -120rpx;`
          "
        >
          <view class="solt" id="soltNav">
            <slot></slot>
          </view>
        </view>
      </view>
    </view>
    <slot v-if="!headerShow"></slot>

    <!-- <view :class="['header', headerH5]" v-if="!headerShow">
      <view class="logoBox" style="background: none;">
        <view class="fbh fbjc logoBox__header">
          <view class="logoBox__header__icon"></view>
          <view class="fbh fb1 fbje">
            <view class="logoBox__header__icon iconMenu"></view>
            <view class="logoBox__header__icon iconMenn"></view>
          </view>
        </view>
        <view class="solt" id="soltNav"></view>
      </view>
    </view> -->
  </view>
  <!-- :style="headerShow ? '' : 'width:100%;position:fixed;z-index:9;top:' + navbarHeight + 'px;'" -->

  <!-- <image
            mode="heightFix"
            style="height: 24px; width: 30px"
            lazy-load
            :src="headImg != '' && headImg != null ? headImg : 'https://i0.hdslb.com/bfs/sycp/creative_img/202007/d62064d5f8c9961c1a99a170434169d8.jpg'"
          ></image> -->
  <!-- <image
        class="logo"
        :src="headImg != '' && headImg != null ? headImg : '/favicon.ico'"
        mode="aspectFit"
        lazy-load
      ></image> -->
  <!-- <view class="circleDet">
      <text>
        <text class="circleDet-txt">{{ t.theme }}</text>
        <text class="circleDet-num">{{ themeNum }}</text>
      </text>
      <text>
        <text class="circleDet-txt">{{ t.homecontent }}</text>
        <text class="circleDet-num">{{ postNum }}</text>
      </text>

      <view class="circleDet-share" @click="open">
        <qui-icon class="qui-icon" name="icon-share1" size="26" :color="iconcolor"></qui-icon>
        {{ t.share }}
      </view>
      <view class="mask" v-if="shareShow" @click="closeShare">
        <view class="wxShareTip">
          <img src="/static/sharePoint.png" alt class="sharePoint" />
          <img src="/static/shareKnow.png" alt class="shareKnow" />
        </view>
      </view>
    </view> -->
</template>
<script>
let headerH5 = 'header-h5';
/* #ifdef MP-WEIXIN */
headerH5 = '';
/* #endif */
export default {
  name: 'QuiHeader',
  props: {
    headImg: {
      type: String,
      default: '',
    },
    backgroundHeadFullImg: {
      type: String,
      default: '',
    },
    themeNum: {
      type: [Number, String],
      default: 0,
    },
    homecontent: {
      type: String,
      default: '',
    },
    iconcolor: {
      type: String,
      default: '#fff',
    },
    postNum: {
      type: [Number, String],
      default: 0,
    },
    share: {
      type: String,
      default: '',
    },
    shareBtn: {
      type: String,
      default: '',
    },
    shareShow: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    isShowBack: {
      type: Boolean,
      default: true,
    },
    isShowHome: {
      type: Boolean,
      default: true,
    },
    isShowMore: {
      type: Boolean,
      default: true,
    },
    onHandleClickSetting: {
      type: Function,
      default: () => {},
    },
    onHandleClickSearch: {
      type: Function,
      default: () => {},
    },
    // 是否吸顶状态
    suspended: {
      type: Boolean,
      default: false,
    },
    headerShow: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    return {
      headerH5,
    };
  },
  computed: {
    // 语言包
    t() {
      return this.i18n.t('home');
    },
  },
  onLond() {},
  methods: {
    open(evt) {
      this.$emit('click', evt);
    },
    closeShare(evt) {
      this.$emit('closeShare', evt);
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.header {
  position: relative;
  width: 100%;
  background: linear-gradient(127.43deg, #00f0ff 0%, #a80028 100%),
    radial-gradient(107% 142.8% at 15.71% 104.5%, #f3d0fc 0%, #1700a4 100%),
    radial-gradient(111% 111% at 74.29% -11%, #a90000 0%, #00ffe0 100%),
    linear-gradient(127.43deg, #b7d500 0%, #2200aa 100%);
  background-blend-mode: overlay, difference, difference, normal;
  // height: 400rpx;
  // background: #1878f3;
  background-size: 100%;
  .logo {
    display: block;
    width: 100px;
    max-height: 30rpx;
    margin: 0 auto;
  }
  /deep/ .qui-back {
    background: transparent;
  }
  .circleDet {
    display: flex;
    justify-content: space-between;
    padding: 69rpx 30rpx 47rpx;
    line-height: 37rpx;
    text-align: center;
    text {
      // padding: 0 15rpx;
      // font-size: $fg-f26;
      line-height: 37rpx;
      text-align: center;
    }
  }
  .circleDet-txt {
    font-size: $fg-f26;
    color: --color(--qui-FC-FFF);
    opacity: 0.5;
  }
  .circleDet-num {
    padding-left: 15rpx;
    font-size: $fg-f28;
    color: --color(--qui-FC-FFF);
  }
  .circleDet-share {
    font-size: $fg-f26;
    color: --color(--qui-FC-FFF);
  }
  .qui-icon {
    padding-right: 18rpx;
  }
  .bar-sticky {
    position: sticky;
    // position: -webkit-sticky;
    top: 0;
    z-index: 101;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 17;
    width: 100%;
    height: 100%;
    background: rgba(#000, 0.6);
  }
  .wxShareTip {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2222222222222;
    width: 100%;
    height: 100%;
    text-align: right;
    .sharePoint {
      display: inline-block;
      width: 70%;
      margin-top: 10rpx;
      margin-right: 30rpx;
    }
    .shareKnow {
      display: block;
      width: 35%;
      margin: 20vh auto 30rpx;
    }
  }
}
.header-h5 {
  // height: 180rpx;
  // background-size: 100% auto;
  .logo {
    max-height: 50rpx;
    padding-top: 10rpx;
  }
  .circleDet {
    padding: 49rpx 20rpx 47rpx;
  }
}
.logoBox {
  &__header {
    padding: 25rpx 20rpx;
    box-sizing: border-box;
    line-height: 60rpx;
    &__search {
      // background: #349aff;
      color: #80c5ff;
      text-indent: 10px;
      border-radius: 3px;
      font-size: 24rpx;
    }
    &__icon {
      color: #fff;
      font-size: 28rpx;
      text-align: center;
      height: 70rpx;
      max-width: 100px;
      display: block;
      &__logo {
        height: 26px;
        margin-right: 10px;
        display: block;
      }
    }
  }
}
.solt {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: saturate(180%) blur(20px);
}
.iconMenu {
  width: 80rpx;
  display: block;
}
</style>
