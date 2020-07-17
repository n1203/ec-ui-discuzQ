<template>
  <qui-page :data-qui-theme="theme" class="profile">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('profile.personalhomepage')"></qui-header-back>
    <!-- #endif -->
    <view v-if="loaded">
      <scroll-view
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="pullDown"
        show-scrollbar="false"
        @scroll="scroll"
        class="scroll-y"
      >
        <view class="profile-info">
          <view class="profile-info__box">
            <view class="profile-info__box__detail">
              <qui-avatar :user="userInfo" />
              <qui-cell-item
                :title="userInfo.username || ''"
                slot-right
                :brief="userInfo.groupsName"
                :border="false"
                class="my-info__box__detail-username"
              >
                <view v-if="userId != currentLoginId">
                  <view
                    class="profile-info__box__detail-operate"
                    @tap="chat"
                    v-if="can_create_dialog"
                  >
                    <qui-icon
                      class="text"
                      name="icon-message1"
                      size="22"
                      :color="themeColor"
                    ></qui-icon>
                    <text>{{ i18n.t('profile.privateMessage') }}</text>
                  </view>
                  <!-- follow 关注状态 0：未关注 1：已关注 2：互相关注 -->
                  <view
                    class="profile-info__box__detail-operate"
                    @tap="userInfo.follow == 0 ? addFollow(userInfo) : deleteFollow(userInfo)"
                  >
                    <qui-icon
                      class="text"
                      :name="userInfo.follow == 0 ? 'icon-follow' : 'icon-each-follow'"
                      size="26"
                      :color="
                        userInfo.follow == 0
                          ? '#777'
                          : userInfo.follow == 1
                          ? themeColor
                          : '#ff8888'
                      "
                    ></qui-icon>
                    <text>
                      {{
                        userInfo.follow == 0
                          ? i18n.t('profile.following')
                          : userInfo.follow == 1
                          ? i18n.t('profile.followed')
                          : i18n.t('profile.mutualfollow')
                      }}
                    </text>
                  </view>
                </view>
              </qui-cell-item>
            </view>
          </view>
          <view class="profile-info__introduction" v-if="userInfo.signature">
            {{ userInfo.signature }}
          </view>
        </view>
        <view class="profile-tabs">
          <qui-tabs
            :current="current"
            :values="items"
            @clickItem="onClickItem"
            :brief="true"
          ></qui-tabs>
          <view class="profile-tabs__content">
            <view v-if="current == 0" class="items">
              <topic
                :user-id="userId"
                :scroll-top="scrollTop"
                @changeFollow="changeFollow"
                ref="topic"
                @handleClickShare="handleClickShare"
              ></topic>
            </view>
            <view v-else-if="current == 1" class="items">
              <following :user-id="userId" @changeFollow="changeFollow" ref="following"></following>
            </view>
            <view v-else-if="current == 2" class="items">
              <followers :user-id="userId" ref="followers" @changeFollow="changeFollow"></followers>
            </view>
            <view v-else class="items">
              <like
                :user-id="userId"
                :scroll-top="scrollTop"
                @changeFollow="changeFollow"
                ref="like"
                @handleClickShare="handleClickShare"
              ></like>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <qui-page-message v-else-if="loaded === false"></qui-page-message>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
// #ifdef H5
import loginAuth from '@/mixin/loginAuth-h5';
// #endif
import topic from './topic';
import following from './following';
import followers from './followers';
import like from './like';

export default {
  components: {
    topic,
    following,
    followers,
    like,
  },
  mixins: [
    // #ifdef H5
    loginAuth,
    // #endif
  ],
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      items: [
        { title: this.i18n.t('profile.topic'), brief: '0' },
        { title: this.i18n.t('profile.following'), brief: '0' },
        { title: this.i18n.t('profile.followers'), brief: '0' },
        { title: this.i18n.t('profile.likes'), brief: '0' },
      ],
      userId: 0,
      currentLoginId: this.$store.getters['session/get']('userId'),
      current: 0,
      nowThreadId: '',
      imageStatus: true,
      can_create_dialog: false,
      dialogId: 0, // 会话id
      scrollTop: 0,
      loaded: false, // 用户数据是否请求成功
    };
  },
  computed: {
    userInfo() {
      const userInfo = this.$store.getters['jv/get'](`users/${this.userId}`);
      userInfo.groupsName = userInfo.groups ? userInfo.groups[0].name : '';
      this.setNum(userInfo);
      return userInfo;
    },
    themeColor() {
      return this.theme === this.$u.light() ? '#333' : '#fff'; // 用于图标色
    },
  },
  onLoad(params) {
    // 区分是自己的主页还是别人的主页
    const { userId, current } = params;
    this.userId = userId || this.currentLoginId;
    this.current = parseInt(current, 10) || 0;
    this.getAuth();
  },
  // 解决左上角返回数据不刷新情况
  onShow() {
    this.getUserInfo(this.userId);
    if (this.$refs.topic) this.$refs.topic.uploadItem();
    if (this.$refs.like) this.$refs.like.uploadItem();
  },
  // 唤起小程序原声分享（微信）
  onShareAppMessage(res) {
    // 来自页面内分享按钮
    if (res.from === 'button') {
      const threadShare = this.$store.getters['jv/get'](`/threads/${this.nowThreadId}`);
      return {
        title: threadShare.type === 1 ? threadShare.title : threadShare.firstPost.summary,
        path: `/pages/topic/index?id=${this.nowThreadId}`,
      };
    }
  },
  methods: {
    scroll(event) {
      this.scrollTop = event.detail.scrollTop;
    },
    onClickItem(e) {
      if (e.currentIndex !== this.current) {
        this.current = e.currentIndex;
      }
    },
    getAuth() {
      // 用户组等改变会改变私信权限
      const params = {
        include: 'users',
      };
      this.$store.dispatch('jv/get', [`forum`, { params }]).then(res => {
        if (res.other && res.other.can_create_dialog) {
          this.can_create_dialog = true;
        } else {
          this.can_create_dialog = false;
        }
      });
    },
    // 获取用户信息
    getUserInfo(userId) {
      const params = {
        include: ['groups', 'dialog'],
      };
      this.$store
        .dispatch('jv/get', [`users/${userId}`, { params }])
        .then(res => {
          if (res.isDeleted) {
            this.$store.dispatch('forum/setError', {
              code: 'user_deleted',
              status: 500,
            });
            this.loaded = false;
          } else {
            this.loaded = true;
            this.dialogId = res.dialog ? res.dialog._jv.id : 0;
            uni.setNavigationBarTitle({
              title: `${res.username}的${this.i18n.t('profile.personalhomepage')}`,
            });
          }
        })
        .catch(err => {
          this.loaded = false;
          if (err.statusCode === 404) {
            console.log('没找到');
            this.$store.dispatch('forum/setError', {
              code: 'user_deleted',
              status: 500,
            });
          }
        });
    },
    // 设置粉丝点赞那些数字
    setNum(res) {
      this.items[0].brief = res.threadCount || 0;
      this.items[1].brief = res.followCount || 0;
      this.items[2].brief = res.fansCount || 0;
      this.items[3].brief = res.likedCount || 0;
    },
    // 添加关注
    addFollow(userInfo) {
      // #ifdef H5
      if (!this.$store.getters['session/get']('isLogin')) {
        if (!this.handleLogin()) {
          return;
        }
      }
      // #endif
      const params = {
        _jv: {
          type: 'follow',
        },
        type: 'user_follow',
        to_user_id: userInfo.id,
      };
      status
        .run(() => this.$store.dispatch('jv/post', params))
        .then(() => {
          this.getUserInfo(this.userId);
          if (this.$refs.followers) this.$refs.followers.getFollowerList('change');
        });
    },
    // 取消关注
    deleteFollow(userInfo) {
      // #ifdef H5
      if (!this.$store.getters['session/get']('isLogin')) {
        if (!this.handleLogin()) {
          return;
        }
      }
      // #endif
      this.$store.dispatch('jv/delete', `follow/${userInfo.id}/1`).then(() => {
        this.getUserInfo(this.userId);
        if (this.$refs.followers) this.$refs.followers.getFollowerList('change');
      });
    },
    changeFollow(e) {
      this.getUserInfo(e.userId);
    },
    pullDown() {
      const { current } = this;
      const item = ['topic', 'following', 'followers', 'like'];
      this.$refs[item[current]].pullDown();
    },
    // 点击分享事件
    handleClickShare(e) {
      this.nowThreadId = e;
    },
    // 头像加载失败,显示默认头像
    imageError() {
      this.imageStatus = false;
    },
    // 私信跳转到聊天页面（传入用户名和会话id）
    chat() {
      uni.navigateTo({
        url: `/pages/notice/msglist?username=${this.userInfo.username}&dialogId=${this.dialogId}`,
      });
    },
  },
  onUnload() {
    this.$store.dispatch('forum/setError', { loading: false });
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.profile {
  .qui-icon {
    margin-right: 14rpx;
  }
  /deep/ .qui-tabs__item__brief {
    font-weight: bold;
  }
}
.profile-info {
  padding: 40rpx;
  padding-top: 30rpx;
  /* #ifdef H5 */
  margin-top: 44px;
  /* #endif */
  font-size: $fg-f28;
  background: --color(--qui-BG-2);
}
.profile-info__box {
  display: flex;
  justify-content: space-between;
}
.profile-info__introduction {
  margin-top: 40rpx;
  color: --color(--qui-FC-333);
  word-break: break-all;
  transition: $switch-theme-time;
}
.profile-info__box__detail {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: $fg-f28;
  box-sizing: border-box;
}
.my-info__box__detail-username {
  width: 100%;
  padding-left: 20rpx;
}
.profile-info__box__detail /deep/ .cell-item__body {
  height: auto;
  align-items: flex-start;
}
.profile-info__box__detail /deep/ .cell-item__body__content-title {
  font-weight: bold;
}
.profile-info__box__detail-operate {
  display: inline-block;
  margin-left: 42rpx;
  color: --color(--qui-FC-333);
}
.profile-tabs__content {
  padding-top: 30rpx;
}
/deep/ .qui-tabs {
  background: --color(--qui-BG-2);
}
.scroll-y {
  max-height: 100vh;
}
</style>
