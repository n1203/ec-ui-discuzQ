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
      <view class="qui-back__body__right" v-if="!slotRight">
        <view class="qui-back__body__right-pop">
          <view class="qui-back__body__right-pop-item" @tap="backPage('/pages/home/index', '0')">
            <qui-icon
              name="icon-home"
              size="34"
              :color="theme === $u.light() ? '#777' : '#fff'"
            ></qui-icon>
          </view>
          <view
            :class="['qui-back__body__right-pop-item', redCircle ? 'message' : '']"
            @tap="backPage('/pages/home/index', '1')"
            v-if="isLogin"
          >
            <qui-icon
              name="icon-message"
              size="32"
              :color="theme === $u.light() ? '#777' : '#fff'"
            ></qui-icon>
          </view>
          <view
            class="qui-back__body__right-pop-item"
            @tap="backPage('/pages/home/index', '2')"
            v-if="isLogin"
          >
            <qui-icon
              name="icon-mine"
              size="34"
              :color="theme === $u.light() ? '#777' : '#fff'"
            ></qui-icon>
          </view>
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
      // route:'',
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
  // 暂时留着 后期修改路由时可能会用
  // created() {
  //   let pagesRouter = getCurrentPages();
  //   let beforeRouter = pagesRouter[pagesRouter.length - 2];
  //   this.route = beforeRouter.route;
  //   console.log(beforeRouter.route, 'beforeRouterbeforeRouterbeforeRouter');
  // },
  methods: {
    backPage(pageUrl, index) {
      if (index) {
        this.setFooterIndex(parseInt(index, 10));
      }
      if (index === '0') {
        uni.$emit('updateIndex');
      }
      if (index === '1') {
        uni.$emit('updateNoticePage');
      }
      if (index === '2') {
        uni.$emit('updateMy');
      }
      uni.redirectTo({
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
  z-index: 200;
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
    display: inline-block;
    margin-left: 24px;
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
  top: -2px;
  right: -3px;
  width: 5px;
  height: 5px;
  background: --color(--qui-RED);
  border-radius: 50%;
  content: '';
}
</style>
