<template>
  <view class="following">
    <view class="follow-content" v-if="followerList.length > 0">
      <view
        class="follow-content__items"
        v-for="(followerItem, index) in followerList"
        @tap="toProfile(followerItem.fromUser.id)"
        :key="index"
      >
        <qui-avatar class="follow-content__items__avatar" :user="followerItem.fromUser" size="70" />
        <qui-cell-item
          :title="(followerItem.fromUser && followerItem.fromUser.username) || ''"
          slot-right
          :brief="
            followerItem.fromUser && followerItem.fromUser.groups
              ? followerItem.fromUser.groups[0].name
              : ''
          "
          :border="index == followerList.length - 1 ? false : true"
        >
          <!-- follow 关注状态 0：未关注 1：已关注 2：互相关注 -->
          <view
            class="follow-content__items__operate"
            @tap="addFollow(followerItem.fromUser, index)"
            @tap.stop
            v-if="(followerItem.fromUser && followerItem.fromUser.id) != currentLoginId"
          >
            <text>
              {{
                (followerItem.fromUser && followerItem.fromUser.follow) == 0
                  ? i18n.t('profile.following')
                  : (followerItem.fromUser && followerItem.fromUser.follow) == 1
                  ? i18n.t('profile.followed')
                  : i18n.t('profile.mutualfollow')
              }}
            </text>
            <qui-icon
              class="text"
              :name="
                (followerItem.fromUser && followerItem.fromUser.follow) == 0
                  ? 'icon-follow'
                  : 'icon-each-follow'
              "
              size="22"
              :color="
                (followerItem.fromUser && followerItem.fromUser.follow) == 0
                  ? '#777'
                  : (followerItem.fromUser && followerItem.fromUser.follow) == 1
                  ? '#ddd'
                  : '#ff8888'
              "
            ></qui-icon>
          </view>
        </qui-cell-item>
      </view>
    </view>
    <qui-load-more :status="loadingType" :show-icon="false" v-if="loadingType"></qui-load-more>
  </view>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
// #ifdef H5
import loginAuth from '@/mixin/loginAuth-h5';
// #endif

export default {
  mixins: [
    // #ifdef H5
    loginAuth,
    // #endif
  ],
  props: {
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingType: '',
      followerList: [],
      pageSize: 20,
      pageNum: 1, // 当前页数
      currentLoginId: this.$store.getters['session/get']('userId'),
    };
  },
  mounted() {
    this.getFollowerList();
  },
  methods: {
    // 获取用户粉丝列表
    getFollowerList(type) {
      this.loadingType = 'loading';
      const params = {
        include: ['fromUser', 'fromUser.groups'],
        'filter[type]': 2,
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[user_id]': this.userId,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['follow', { params }]))
        .then(res => {
          if (res._jv) {
            delete res._jv;
          }
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          if (type === 'change') {
            this.followerList = res;
          } else {
            this.followerList = [...this.followerList, ...res];
          }
        });
    },
    // 点击头像到个人主页
    toProfile(userId) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${userId}`,
      });
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getFollowerList();
    },
    // 添加关注
    addFollow(userInfo, index) {
      // #ifdef H5
      if (!this.$store.getters['session/get']('isLogin')) {
        if (!this.handleLogin()) {
          return;
        }
      }
      // #endif
      if (userInfo.follow !== 0) {
        this.deleteFollow(userInfo, index);
        return;
      }
      const params = {
        _jv: {
          type: 'follow',
        },
        type: 'user_follow',
        to_user_id: userInfo.id,
      };
      status
        .run(() => this.$store.dispatch('jv/post', params))
        .then(res => {
          if (this.userId === this.currentLoginId) {
            this.$emit('changeFollow', { userId: this.userId });
          }
          // is_mutual 是否互相关注 1 是 0 否
          this.followerList[index].fromUser.follow = res.is_mutual === 1 ? 2 : 1;
        });
    },
    // 取消关注
    deleteFollow(userInfo, index) {
      // #ifdef H5
      if (!this.$store.getters['session/get']('isLogin')) {
        if (!this.handleLogin()) {
          return;
        }
      }
      // #endif
      this.$store.dispatch('jv/delete', `follow/${userInfo.id}/1`).then(() => {
        if (this.userId === this.currentLoginId) {
          this.$emit('changeFollow', { userId: this.userId });
        }
        this.followerList[index].fromUser.follow = 0;
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.following {
  padding: 0 20rpx;
  font-size: $fg-f28;
  /deep/ .cell-item__body {
    padding-right: 20rpx;
  }
  .cell-item__body__right {
    font-size: $fg-f28;
    color: --color(--qui-FC-333);
  }
  .qui-icon {
    margin-right: 0;
    margin-left: 14rpx;
  }
}
.follow-content {
  padding: 20rpx 0;
  margin-bottom: 30rpx;
  background: --color(--qui-BG-2);
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}
.follow-content__items {
  position: relative;
  padding-left: 110rpx;
}
.follow-content__items__avatar {
  position: absolute;
  top: 16rpx;
  left: 20rpx;
}
.text {
  margin-left: 12rpx;
}
</style>
