<template>
  <qui-page :data-qui-theme="theme">
    <!-- #ifdef H5-->
    <qui-header-back title="邀请成员"></qui-header-back>
    <!-- #endif -->
    <scroll-view
      scroll-y
      show-scrollbar="false"
      show-icon
      class="invite"
      :style="current === 0 ? 'bottom: 150rpx;' : 'bottom: 0rpx;'"
    >
      <!-- 标签栏 -->
      <view class="invite-tabs">
        <qui-tabs
          class="invite-tabs-h"
          :current="current"
          :values="tabList"
          @clickItem="onClickItem"
        ></qui-tabs>
        <view>{{ role }}</view>
        <view>
          <view v-if="current === 0" class="items">
            <qui-invite
              :total="total"
              :status="status"
              :list="allInviteList"
              v-if="allInviteList && allInviteList.length > 0"
              @setInvalid="setInvalid"
              @share="share"
            ></qui-invite>
            <qui-no-data :tips="i18n.t('manage.noContent')" v-else></qui-no-data>
          </view>
          <view v-if="current === 1" class="items">
            <qui-invite
              :total="total"
              :status="status"
              :list="allInviteList"
              v-if="allInviteList && allInviteList.length > 0"
            ></qui-invite>
            <qui-no-data :tips="i18n.t('manage.noContent')" v-else></qui-no-data>
          </view>
          <view v-if="current === 2" class="items">
            <qui-invite
              :total="total"
              :status="status"
              :list="allInviteList"
              v-if="allInviteList && allInviteList.length > 0"
            ></qui-invite>
            <qui-no-data :tips="i18n.t('manage.noContent')" v-else></qui-no-data>
          </view>
          <view v-if="current === 3" class="items">
            <qui-invite
              :total="total"
              :status="status"
              :list="allInviteList"
              v-if="allInviteList && allInviteList.length > 0"
            ></qui-invite>
            <qui-no-data :tips="i18n.t('manage.noContent')" v-else></qui-no-data>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 邀请链接按钮 -->
    <view class="invite-button" v-if="current === 0">
      <button class="btn" @click="generate">
        {{ i18n.t('manage.generateInvitationUrl') }}
      </button>
    </view>
    <!-- 邀请链接弹窗 -->
    <uni-popup ref="popup" type="bottom">
      <scroll-view scroll-y style="max-height: 968rpx;">
        <view class="popup-wrap">
          <view class="popup-wrap-con">
            <view v-for="item in groupList" :key="item._jv.id">
              <view class="popup-wrap-con-text" @click="generateUrl(item)">{{ item.name }}</view>
              <view class="popup-wrap-con-line"></view>
            </view>
          </view>
          <view class="popup-wrap-space"></view>
          <text class="popup-wrap-btn" @click="cancelModify">{{ i18n.t('home.cancel') }}</text>
        </view>
      </scroll-view>
    </uni-popup>
    <!-- 分享弹窗 -->
    <uni-popup ref="popupShare" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content" style="box-sizing: border-box;">
          <button class="popup-share-button__center" open-type="share"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box">
                <qui-icon class="content-image" :name="item.icon" size="46" color="#777"></qui-icon>
              </view>
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancelShare('share')">
          {{ i18n.t('home.cancel') }}
        </text>
      </view>
    </uni-popup>
  </qui-page>
</template>

<script>
import { timestamp2day } from '@/utils/time';
import quiInvite from '@/components/qui-invite';
import forums from '@/mixin/forums';
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
import appCommonH from '@/utils/commonHelper';
// #endif

export default {
  components: { quiInvite },
  mixins: [
    forums,
    // #ifdef H5
    wxshare,
    appCommonH,
    // #endif
  ],
  data() {
    return {
      current: 0, // 当前标签页
      total: 0, // 邀请链接的总数
      tabList: [
        { id: 1, title: '未使用', status: 1 },
        { id: 2, title: '已使用', status: 2 },
        { id: 3, title: '已过期', status: 3 },
        { id: 4, title: '已失效', status: 0 },
      ], // 邀请链接的类型列表
      role: '', // 用户角色
      status: 1, // 邀请链接的类型
      bottomData: [
        {
          text: this.i18n.t('home.wxShare'),
          icon: 'icon-wx-friends',
          name: 'wx',
        },
      ],
      navbarHeight: 0,
      isWeixin: '', // 是否是微信浏览器
    };
  },
  onLoad() {
    this.getInviteList(1);
    this.getGroupList();
    // #ifdef H5
    this.isWeixin = appCommonH.isWeixin().isWeixin;
    // #endif
  },
  // 唤起小程序原生分享
  onShareAppMessage(res) {
    console.log('唤起小程序原生分享', res);
    // 来自页面内分享按钮
    if (res.from === 'button') {
      console.log('res.from为button');
      return {
        title: this.forums.set_site.site_name,
        path: `/pages/site/partner-invite?code=${this.code}`,
      };
    }
    return {
      title: this.forums.set_site.site_name,
      path: `/pages/site/partner-invite?code=${this.code}`,
    };
  },
  computed: {
    // 获取当前登录的id
    currentLoginId() {
      const userId = this.$store.getters['session/get']('userId');
      console.log('获取当前登录的id', userId);
      return parseInt(userId, 10);
    },
    // 获取管理邀请列表（非管理员无的邀请链接无管理）
    allInviteList() {
      const list = [];
      const inviteList = this.$store.getters['jv/get']('invite');
      const groupList = this.$store.getters['jv/get']('groups');
      console.log('会话列表接口的响应：', inviteList);
      console.log('用户组接口的响应：', groupList);
      const inviteListKeys = Object.keys(inviteList);
      const groupListKeys = Object.keys(groupList);
      if (inviteList && inviteListKeys.length > 0) {
        for (let i = 0; i < inviteListKeys.length; i += 1) {
          const inviteListValue = inviteList[inviteListKeys[i]];
          const day = timestamp2day(inviteListValue.endtime);
          if (inviteListValue.status === 1) {
            inviteListValue.time = `有效期剩余${day}天`;
          } else {
            inviteListValue.time = `有效期剩余0天`;
          }
          if (groupListKeys && groupListKeys.length > 0) {
            for (let j = 0; j < groupListKeys.length; j += 1) {
              const groupListValue = groupList[groupListKeys[j]];
              if (inviteListValue.group_id.toString() === groupListValue._jv.id.toString()) {
                inviteListValue.title = groupListValue.name;
              }
            }
          }
          list.push(inviteListValue);
        }
      }
      console.log('allInviteList', list);
      return list;
    },
    // 获取用户组列表
    groupList() {
      const groups = this.$store.getters['jv/get']('groups');
      console.log('groups', groups);
      const list = [];
      const array = Object.keys(groups);
      for (let i = 0; i < array.length; i += 1) {
        list.push(groups[array[i]]);
      }
      console.log('groupList', list);
      return list;
    },
    // 获取用户角色
    userInfos() {
      return this.$store.getters['jv/get'](`users/${this.currentLoginId}`);
    },
  },
  methods: {
    // 调用 管理邀请列表 接口
    getInviteList(status) {
      const params = {
        'filter[status]': status,
      };
      this.$store.commit('jv/clearRecords', { _jv: { type: 'invite' } });
      this.$store.dispatch('jv/get', ['invite', { params }]).then(res => {
        this.total = res._jv.json.meta.total;
        console.log('获取管理邀请列表', res);
      });
    },
    // 调用 获取所有用户组 接口
    getGroupList() {
      const params = {
        'filter[type]': 'invite',
      };
      this.$store.commit('jv/clearRecords', { _jv: { type: 'groups' } });
      this.$store.dispatch('jv/get', ['groups', { params }]);
      console.log('获取所有用户组');
    },
    // 改变标签页
    onClickItem(e) {
      if (e.currentIndex !== this.current) {
        this.current = e.currentIndex;
        this.status = this.tabList[e.currentIndex].status;
        this.getInviteList(this.tabList[e.currentIndex].status);
      }
    },
    // 生成邀请链接弹窗
    generate() {
      console.log('生成邀请链接弹窗');
      this.$refs.popup.open();
    },
    // 生成 合伙人/嘉宾/成员 邀请链接
    generateUrl(item) {
      console.log('生成邀请链接：', item);
      const adminParams = {
        _jv: {
          type: 'invite',
        },
        type: 'invite',
        group_id: parseInt(item._jv.id, 10),
      };
      const userParams = {
        _jv: {
          type: 'userInviteCode',
        },
      };
      if (
        this.userInfos &&
        this.userInfos.groups.length > 0 &&
        this.userInfos.groups[0].name === '管理员'
      ) {
        // 角色是管理员
        this.$store
          .dispatch('jv/post', adminParams)
          .then(res => {
            if (res) {
              console.log('管理员生成邀请链接res：', res);
              this.$refs.popup.close();
              this.getInviteList(1);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // 角色不是管理员
        this.$store
          .dispatch('jv/post', userParams)
          .then(res => {
            if (res) {
              console.log('生成邀请链接res：', res);
              this.$refs.popup.close();
              this.getInviteList(1);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 删除链接
    setInvalid(id) {
      this.$store.dispatch('jv/delete', `invite/${id}`).then(res => {
        console.log('设为无效', res);
        if (res) {
          this.getInviteList(this.status);
          uni.showToast({
            title: '该链接已失效',
            duration: 2000,
          });
        }
      });
    },
    // 分享
    share(code) {
      this.code = code;
      console.log('分享');
      // #ifdef MP-WEIXIN
      this.$refs.popupShare.open();
      // #endif
      // #ifdef H5
      if (this.isWeixin === true) {
        this.shareShow = true;
      } else {
        this.h5Share({
          title: this.forums.set_site.site_name,
          url: `pages/site/partner-invite?code=${this.code}`,
        });
      }
      // #endif
    },
    // 取消分享
    cancelShare() {
      console.log('取消分享');
      this.$refs.popupShare.close();
    },
    // 取消修改用户组
    cancelModify() {
      console.log('取消修改用户组');
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.invite {
  position: fixed;
  top: 0rpx;
  right: 0rpx;
  left: 0rpx;
  /* #ifdef H5 */
  margin: 44px 0rpx 0rpx;
  /* #endif */
  font-size: $fg-f28;

  &-tabs {
    /deep/ .qui-tabs__item--active .qui-tabs__item__title {
      font-size: $fg-f28;
    }
  }
}

.invite-button {
  position: fixed;
  right: 0;
  bottom: 40rpx;
  left: 0;
  width: 670rpx;
  height: 90rpx;
  margin: auto;

  .btn {
    font-size: $fg-f28;
    line-height: 90rpx;
    color: --color(--qui-FC-333);
    background: --color(--qui-BG-2);
  }
}

.popup-wrap {
  display: flex;
  flex-direction: column;
  background: --color(--qui-BG-2);
  border-radius: 10rpx 10rpx 0rpx 0rpx;

  &-con {
    border-radius: 10rpx 10rpx 0rpx 0rpx;

    &-text {
      width: 100%;
      height: 100rpx;
      font-size: $fg-f34;
      line-height: 100rpx;
      text-align: center;
    }

    &-line {
      border: 2rpx solid --color(--qui-BG-ED);
    }
  }

  &-space {
    border: 8rpx solid --color(--qui-BG-ED);
  }

  &-btn {
    width: 100%;
    height: 100rpx;
    font-size: $fg-f28;
    line-height: 100rpx;
    text-align: center;
  }
}
</style>
