<template>
  <view>
    <view class="notice-box">
      <!-- #ifdef MP-WEIXIN -->
      <uni-nav-bar
        :title="title"
        fixed
        :color="navTheme === $u.light() ? '#000000' : '#ffffff'"
        :background-color="navTheme === $u.light() ? '#ffffff' : '#2e2f30'"
        status-bar
      ></uni-nav-bar>
      <!-- #endif -->
      <!-- 通知类型列表 -->
      <scroll-view
        scroll-x
        @scrolltolower="pullDown"
        show-scrollbar="false"
        show-icon
        class="scroll-Y"
        :style="'top:' + navbarHeight + 'px'"
      >
        <view class="notice-box__list fbh">
          <view
            class="ec-notice-box"
            v-for="item in list"
            :key="item.id"
            @click="jumpNoticePage(item)"
          >
            <view
              class="ec-notice-box__item"
              :title="i18n.t(item.title)"
              :border="item.border"
              arrow
              slot-right
            >
              <view class="ec-notice-box__item__icon">
                <qui-icon
                  v-if="item.unReadNum && item.unReadNum > 0"
                  name="icon-circle"
                  class="red-circle ec-notice-box__item__icon__circle"
                  color="red"
                  size="14"
                ></qui-icon>
                <qui-icon name="icon-message" color="#fff" size="30"></qui-icon>
              </view>
              <view class="ec-notice-box__item__text">
                {{ i18n.t(item.title) }}
              </view>
            </view>
            <!-- <qui-cell-item :title="i18n.t(item.title)" :border="item.border" arrow slot-right>
              <qui-icon
                v-if="item.unReadNum && item.unReadNum > 0"
                name="icon-circle"
                class="red-circle"
                color="red"
                size="14"
              ></qui-icon>
            </qui-cell-item> -->
          </view>
        </view>
        <!-- 如果没有会话 -->
        <view
          v-if="!dialogList.length === 0"
          style="text-align: center; padding: 30px; color: #ccc"
        >
          <qui-icon size="100" name="icon-message" />
          <view style="line-height: 40px; font-size: 12px;">暂时没有私信，赶快去联系好友！</view>
        </view>
        <!-- 会话列表 -->
        <view class="dialog-box__main" v-if="dialogList && dialogList.length > 0">
          <view
            class="dialog-box"
            v-for="(dialog, index) of dialogList"
            :key="dialog._jv.id"
            @click="jumpMsglistPage(dialog, index)"
          >
            <view class="dialog-box__header">
              <view class="dialog-box__header__info">
                <qui-avatar class="dialog-box__header__info__user-avatar" :user="dialog" />
                <view>
                  <view class="dialog-box__header__info__box">
                    <text class="dialog-box__header__info__username">
                      {{ dialog.username }}
                    </text>
                    <text
                      class="dialog-box__header__info__groupname"
                      v-for="item in dialog.groups"
                      :key="item.name"
                    >
                      <text v-if="item.name">（{{ item.name }}）</text>
                    </text>
                  </view>
                  <view class="dialog-box__con">
                    <rich-text
                      :nodes="dialog.dialogMessage ? dialog.dialogMessage.summary : ''"
                      style="word-break: break-all;"
                    ></rich-text>
                  </view>
                </view>
              </view>
              <view class="dialog-box__header__r">
                <view class="dialog-box__header__info__time">{{ dialog.time }}</view>
                <qui-icon
                  name="icon-circle"
                  class="red-circle"
                  v-if="dialog.readAt === null"
                  color="red"
                  size="14"
                ></qui-icon>
                <qui-icon class="arrow" name="icon-folding-r" size="22" color="#ddd"></qui-icon>
              </view>
            </view>
          </view>
          <qui-load-more
            :status="loadingType"
            v-if="dialogList && dialogList.length > 0"
          ></qui-load-more>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { time2MorningOrAfternoon } from '@/utils/time';
import user from '@/mixin/user';

export default {
  mixins: [user],
  props: {
    navTheme: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: this.i18n.t('notice.notice'), // 标题
      list: [
        { id: 1, title: 'notice.relate', type: 'related', unReadNum: 0, border: true },
        { id: 2, title: 'notice.reply', type: 'replied', unReadNum: 0, border: true },
        { id: 3, title: 'notice.like', type: 'liked', unReadNum: 0, border: true },
        { id: 4, title: 'notice.reward', type: 'rewarded,withdrawal', unReadNum: 0, border: true },
        { id: 5, title: 'notice.system', type: 'system', unReadNum: 0, border: false },
      ],
      loadingType: 'more', // 上拉加载状态
      isFirst: true, // 是否是第一次进入页面
      pageSize: 10, // 每页10条数据
      pageNum: 1, // 当前页数
      dialogList: [], // 会话列表
      navbarHeight: 0, // 顶部导航栏的高度
    };
  },
  computed: {
    // 获取当前登录的id
    currentLoginId() {
      const userId = this.$store.getters['session/get']('userId');
      console.log('获取当前登录的id', userId);
      return parseInt(userId, 10);
    },
  },
  mounted() {
    // #ifndef MP-WEIXIN
    this.navbarHeight = uni.getSystemInfoSync().statusBarHeight;
    // #endif
    // #ifdef MP-WEIXIN
    this.navbarHeight = uni.getSystemInfoSync().statusBarHeight + 44;
    // #endif
    uni.$on('updateNotiNum', () => {
      console.log('updateNode', this.user);
      this.getUnreadNoticeNum();
    });
  },
  destroyed() {
    uni.$off('updateNotiNum');
  },
  methods: {
    // 调用 会话列表 的接口
    getDialogList() {
      const params = {
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        sort: '-dialogMessageId',
        include: ['sender', 'recipient', 'sender.groups', 'recipient.groups', 'dialogMessage'],
      };
      this.$store.dispatch('jv/get', ['dialog', { params }]).then(res => {
        console.log('会话列表res', res);
        if (res && res.length > 0) {
          const list = JSON.parse(JSON.stringify(res));
          for (let i = 0; i < list.length; i += 1) {
            if (list[i] && list[i].dialogMessage) {
              list[i].time = time2MorningOrAfternoon(list[i].dialogMessage.created_at);
            }
            if (list[i] && list[i].recipient && list[i].sender) {
              if (list[i].recipient.id === this.currentLoginId) {
                list[i].username = list[i].sender.username;
                list[i].avatarUrl = list[i].sender.avatarUrl;
                list[i].groupname = list[i].sender.groups;
                list[i].readAt = list[i].recipient_read_at;
              } else if (list[i].sender.id === this.currentLoginId) {
                list[i].username = list[i].recipient.username;
                list[i].avatarUrl = list[i].recipient.avatarUrl;
                list[i].groupname = list[i].recipient.groups;
                list[i].readAt = list[i].sender_read_at;
              }
            } else {
              list[i].username = '该用户已被删除';
              list[i].avatarUrl = '';
            }
          }
          this.dialogList = [...this.dialogList, ...list];
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        }
      });
    },
    // 调用 未读通知数 的接口
    getUnreadNoticeNum() {
      if (this.user && this.user.typeUnreadNotifications) {
        console.log('this.user', this.user);
        this.list[0].unReadNum = this.user.typeUnreadNotifications.related || '';
        this.list[1].unReadNum = this.user.typeUnreadNotifications.replied || '';
        this.list[2].unReadNum = this.user.typeUnreadNotifications.liked || '';
        this.list[3].unReadNum =
          this.user.typeUnreadNotifications.rewarded ||
          this.user.typeUnreadNotifications.withdrawal ||
          '';
        this.list[4].unReadNum = this.user.typeUnreadNotifications.system || '';
      }
    },
    // 跳转至 @我的/回复我的/点赞我的/财务通知/系统通知 页面（传入标题，类型和未读通知条数）
    jumpNoticePage(item) {
      console.log('item', item);
      // 如果有未读消息，点击时请求并更新消息信息
      if (item.unReadNum) this.getUserInfo(true);
      uni.navigateTo({
        url: `/pages/notice/notice?title=${this.i18n.t(item.title)}&type=${item.type}&unReadNum=${
          item.unReadNum
        }`,
      });
      console.log(`跳转${this.i18n.t(item.title)}页面`);
    },
    // 跳转至 聊天页面
    jumpMsglistPage(dialogInfo, index) {
      if (dialogInfo) {
        console.log('会话信息', dialogInfo);
        this.dialogList[index].readAt = '1';
        uni.navigateTo({
          url: `/pages/notice/msglist?dialogId=${dialogInfo._jv.id}&username=${dialogInfo.username}`,
        });
      }
    },
    // 上拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getDialogList();
      console.log('页码', this.pageNum);
    },
    // 组件初始化数据
    ontrueGetList() {
      this.getDialogList();
      this.getUnreadNoticeNum();
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.scroll-Y {
  position: fixed;
  right: 0rpx;
  bottom: 119rpx;
  left: 0rpx;
}

.notice-box {
  width: 100%;
  min-height: 100vh;
  font-size: $fg-f28;

  .left-text {
    min-width: 250rpx;
    font-weight: bold;
    color: --color(--qui-FC-34);
  }

  &__list {
    padding-left: 40rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    transition: $switch-theme-time;

    &-red-circle {
      position: relative;
    }
    &-red-circle:after {
      position: absolute;
      top: 4px;
      right: -5px;
      width: 7px;
      height: 7px;
      background: --color(--qui-RED);
      border-radius: 50%;
      content: '';
    }

    /deep/ text {
      vertical-align: middle;
    }
  }
}

.dialog-box {
  margin: 20rpx 0;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);

  &__header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f0f0f0;

    &__info {
      display: flex;
      justify-content: space-between;

      &__user-avatar {
        margin: 20rpx 20rpx 20rpx 40rpx;
      }

      &__box {
        width: 100%;
        align-items: center;
        margin: 20rpx 0rpx 10rpx;
      }

      &__username {
        margin-right: 6rpx;
        font-weight: bold;
        line-height: 37rpx;
        color: --color(--qui-FC-000);
      }

      &__groupname {
        font-weight: 400;
        line-height: 37rpx;
        color: --color(--qui-FC-AAA);
      }

      &__time {
        font-size: 24rpx;
        line-height: 31rpx;
        color: --color(--qui-FC-AAA);
      }
    }

    &__r {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0rpx 40rpx 0rpx 0rpx;

      &-red-circle {
        position: relative;
      }
      &-red-circle:after {
        position: absolute;
        top: -4px;
        right: 5px;
        width: 7px;
        height: 7px;
        background: --color(--qui-RED);
        border-radius: 50%;
        content: '';
      }
    }
  }

  &__con {
    // padding: 0rpx 40rpx 30rpx;
    font-weight: 400;
    color: --color(--qui-FC-333);
    opacity: 1;
  }
}

.ec-notice-box {
  width: 17%;
  padding: 1%;
  margin: 10px 0;
  &__item {
    text-align: center;
    &__icon {
      background: #1878f3;
      text-align: center;
      width: 40px;
      height: 40px;
      margin: 0 auto;
      border-radius: 10px;
      line-height: 40px;
      position: relative;
      &__circle {
        position: absolute;
        top: -15px;
        right: -5px;
      }
    }
    &__text {
      font-size: 26rpx;
      margin-top: 15rpx;
    }
  }
}
</style>
