<template>
  <view class="qui-back">
    <view class="qui-back__body">
      <view class="qui-back__body__content">
        <view class="qui-back__body__content-title" @tap="back">
          <qui-icon
            :name="iconLeft"
            size="34"
            class="icon-left"
            :color="theme === $u.light() ? '#333' : '#fff'"
          ></qui-icon>
          <text>{{ title || i18n.t('discuzq.pageHeader.title') }}</text>
        </view>
      </view>
      <view class="qui-back_body__right" v-if="slotRight">
        <slot></slot>
      </view>
      <view class="qui-back__body__right" v-if="!slotRight && isLogin">
        <view class="qui-back__body__right-pop">
          <text class="qui-back__body__right-pop-item" @tap="backPage('/pages/home/index', '0')">
            {{ i18n.t('home.tabsCircle') }}
          </text>
          <text
            :class="['qui-back__body__right-pop-item', redCircle ? 'message' : '']"
            @tap="backPage('/pages/home/index', '1')"
          >
            {{ i18n.t('profile.notice') }}
          </text>
          <text class="qui-back__body__right-pop-item" @tap="backPage('/pages/home/index', '2')">
            {{ i18n.t('home.tabsMy') }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import user from '@/mixin/user';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'QuiBack',
  mixins: [user],
  props: {
    title: {
      type: String,
      default: '',
    },
    iconLeft: {
      type: String,
      default: 'icon-back',
    },
    slotRight: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLogin: this.$store.getters['session/get']('isLogin'),
    };
  },

  computed: {
    redCircle() {
      return this.user.unreadNotifications;
    },
    ...mapState({
      footerIndex: state => state.footerTab.footerIndex,
    }),
  },
  methods: {
    backPage(pageUrl, index) {
      if (index) {
        this.setFooterIndex(parseInt(index, 10));
      }
      uni.navigateTo({
        url: pageUrl,
      });
    },
    back() {
      window.history.go(-1);
    },
    ...mapMutations({
      setFooterIndex: 'footerTab/SET_FOOTERINDEX',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.qui-back {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: 9px 20px;
  padding-left: 16px;
  background: --color(--qui-BG-2);
  border-bottom: 1px solid --color(--qui-BOR-ED);
  box-sizing: border-box;
  &__body {
    position: relative;
    display: flex;
    height: 25px;
    align-items: center;
    justify-content: space-between;
  }
  &__body__content {
    flex: 1 1 0%;
  }
  &__body__content-title {
    font-size: $fg-f28;
    color: --color(--qui-FC-333);
    transition: $switch-theme-time;
  }
  &__body__right-pop-item {
    margin-left: 20px;
    font-size: $fg-f28;
    color: --color(--qui-FC-333);
  }
}
.icon-left {
  margin-right: 5px;
}
.cell-item__body__right {
  align-items: center;
  justify-content: flex-end;
  font-size: $fg-f28;
  text-align: right;
}
.message {
  position: relative;
}
.message:after {
  position: absolute;
  top: 6px;
  right: -10px;
  width: 7px;
  height: 7px;
  background: --color(--qui-RED);
  border-radius: 50%;
  content: '';
}
</style>
