<template>
  <qui-page :data-qui-theme="theme" class="qui-at-member-page-box">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('discuzq.atMember.atTitle')"></qui-header-back>
    <!-- #endif -->
    <view class="qui-at-member-page-box__hd">
      <view class="qui-at-member-page-box__hd__sc">
        <qui-icon class="icon-search" name="icon-search" size="30"></qui-icon>
        <input
          type="text"
          placeholder-class="input-placeholder"
          confirm-type="search"
          :placeholder="i18n.t('discuzq.atMember.selectedMember')"
          @input="searchInput"
        />
      </view>
    </view>
    <view class="qui-at-member-page-box__lst">
      <scroll-view
        class="scroll-Y"
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="lower"
      >
        <checkbox-group @change="changeCheck" v-if="followStatus">
          <label v-for="item in allFollow" :key="item.id">
            <qui-avatar-cell
              v-if="item.toUser"
              :mark="item.toUser.id"
              :title="item.toUser.username"
              :icon="item.toUser.avatarUrl ? item.toUser.avatarUrl : '/static/noavatar.gif'"
              :value="item.toUser.groups[0].name"
              :label="item.toUser.label"
            >
              <checkbox slot="rightIcon" :value="JSON.stringify(item)"></checkbox>
            </qui-avatar-cell>
          </label>
        </checkbox-group>
        <checkbox-group @change="changeCheck" v-else>
          <label v-for="item in allSiteUser" :key="item.id">
            <qui-avatar-cell
              :mark="item.id"
              :title="item.username"
              :icon="item.avatarUrl ? item.avatarUrl : '/static/noavatar.gif'"
              :value="item.groups[0].name"
              :label="item.label"
            >
              <checkbox slot="rightIcon" :value="JSON.stringify(item)"></checkbox>
            </qui-avatar-cell>
          </label>
        </checkbox-group>
        <view class="loading-text">
          <qui-icon
            v-if="
              loadingText === 'search.norelatedusersfound' || loadingText === 'search.noFollowers'
            "
            name="icon-noData"
          ></qui-icon>
          <text class="loading-text__cont">{{ i18n.t(loadingText) }}</text>
        </view>
      </scroll-view>
    </view>
    <view class="qui-at-member-page-box__ft">
      <qui-button
        size="large"
        :type="Boolean(checkAvatar.length < 1) ? 'default' : 'primary'"
        :disabled="Boolean(checkAvatar.length < 1)"
        @click="getCheckMember"
      >
        {{
        checkAvatar.length &lt; 1
        ? i18n.t('discuzq.atMember.notSelected')
        : i18n.t('discuzq.atMember.selected') + '(' + checkAvatar.length + ')'
        }}
      </qui-button>
    </view>
  </qui-page>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'QuiAtMemberPage',
  data() {
    return {
      allSiteUser: [], // 所有站点成员
      allFollow: [], // 所有关注成员
      followStatus: true, // 第一次进来显示follow列表
      checkAvatar: [], // 选择人员列表
      loadingText: 'discuzq.list.loading',
      searchValue: '', // 搜索值
      pageNum: 1, // 页面
      meta: {}, // 接口返回meta值
    };
  },
  computed: {
    // 处理角色名称
    // getGroups() {
    //   const that = this;
    //   let name = '';
    //   return data => {
    //     if (data) {
    //       Object.keys(data).forEach(item => {
    //         if (data[item]) {
    //           name = data[item].name;
    //         } else {
    //           name = that.i18n.t('discuzq.role.noRole');
    //         }
    //       });
    //     }
    //     return name;
    //   };
    // },
  },
  methods: {
    ...mapMutations({
      setAtMember: 'atMember/SET_ATMEMBER',
    }),

    // 多选人员
    changeCheck(e) {
      this.checkAvatar = [];
      e.detail.value.forEach(item => {
        if (this.followStatus) {
          this.checkAvatar.push(JSON.parse(item).toUser);
        } else {
          this.checkAvatar.push(JSON.parse(item));
        }
      });
    },
    getCheckMember() {
      this.setAtMember(this.checkAvatar);
      uni.navigateBack({
        delta: 1,
      });
    },
    // 人员搜索
    searchInput(e) {
      this.followStatus = false;
      this.searchValue = e.detail.value;
      this.checkAvatar = [];

      if (this.pageNum !== 1) {
        this.pageNum = 1;
      }

      this.loadingText = 'discuzq.list.loading';

      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.allSiteUser = [];
        this.getSiteMember(1);
      }, 250);
    },
    // 上划加载更多
    lower() {
      if (this.followStatus) {
        if (this.meta.total > this.allFollow.length) {
          this.pageNum += 1;
          this.getFollowMember(this.pageNum);
        } else {
          this.loadingText = 'discuzq.list.noMoreData';
        }
      } else if (this.meta.total > this.allSiteUser.length) {
        this.pageNum += 1;
        this.getSiteMember(this.pageNum);
      } else {
        this.loadingText = 'discuzq.list.noMoreData';
      }
    },

    // 接口请求
    getFollowMember(number) {
      const params = {
        include: ['toUser', 'toUser.groups'],
        'page[size]': 20,
        'page[number]': number,
      };
      this.$store.dispatch('jv/get', ['follow', { params }]).then(res => {
        /* eslint no-underscore-dangle: ["error", { "allow": ["_jv"] }] */
        this.meta = res._jv.json.meta;
        this.allFollow = [...this.allFollow, ...res];
        console.log(this.allFollow, '这是@数据');
        if (Object.keys(res).nv_length - 1 === 0) {
          this.loadingText = 'search.noFollowers';
        } else if (res._jv.json.meta.total <= 20 && Object.keys(res).nv_length - 1 !== 0) {
          this.loadingText = 'discuzq.list.noMoreData';
        }
      });
    },
    getSiteMember(number) {
      const params = {
        'filter[username]': `*${this.searchValue}*`,
        'filter[status]': 'normal',
        'page[size]': 20,
        'page[number]': number,
      };
      this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
        this.meta = res._jv.json.meta;
        this.allSiteUser = [...this.allSiteUser, ...res];

        if (Object.keys(res).nv_length - 1 === 0) {
          this.loadingText = 'search.norelatedusersfound';
        } else if (res._jv.json.meta.total <= 20 && Object.keys(res).nv_length - 1 !== 0) {
          this.loadingText = 'discuzq.list.noMoreData';
        }
      });
    },
  },
  onLoad() {
    uni.setNavigationBarTitle({
      title: this.i18n.t('discuzq.atMember.atTitle'),
    });
    this.getFollowMember(1);
    this.setAtMember([]);
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

$otherHeight: 292rpx;
.qui-at-member-page-box {
  width: 100%;
  height: 100%;
  background-color: --color(--qui-BG-2);
  &__hd {
    display: flex;
    align-items: center;
    height: 80rpx;
    padding: 20rpx 40rpx;
    /* #ifdef H5 */
    margin-top: 44px;
    /* #endif */

    &__sc {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 0 10rpx;
      background-color: --color(--qui-BG-IT);
      border-radius: 7rpx;

      .icon-search {
        margin: 0 10rpx;
        color: #bbb;
      }
      input {
        width: 100%;
        height: 100%;
      }
      /deep/ input .input-placeholder {
        font-size: $fg-f28;
        color: --color(--qui-FC-C6);
      }
    }
  }
  &__lst {
    .scroll-Y {
      height: calc(100vh - #{$otherHeight});
      .loading-text {
        height: 100rpx;
        font-size: 28rpx;
        line-height: 100rpx;
        color: --color(--qui-FC-AAA);
        text-align: center;
      }
      .loading-text__cont {
        margin-left: 20rpx;
      }
    }
  }
  &__ft {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 40rpx;
    background-color: --color(--qui-BG-2);
    box-sizing: border-box;
    /deep/ .qui-button--button[size='large'] {
      border-radius: 5rpx;
    }
    /deep/ .qui-button--button[disabled] {
      color: #7d7979;
      background-color: #fff;
    }
  }
}
</style>
