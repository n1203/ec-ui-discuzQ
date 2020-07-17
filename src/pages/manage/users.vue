<template>
  <qui-page :data-qui-theme="theme">
    <!-- #ifdef MP-WEIXIN -->
    <!-- 搜索成员 -->
    <view class="site-users-wx-search">
      <view class="search">
        <view class="search-box">
          <view class="search-box__content">
            <view class="icon-content-search">
              <qui-icon name="icon-search" size="30" color="#bbb"></qui-icon>
            </view>
            <input
              type="text"
              class="search-box__content-input"
              placeholder-class="input-placeholder"
              :placeholder="i18n.t('manage.searchMembers')"
              @input="searchInput"
              :value="searchText"
            />
            <view @tap="cancelSearch" v-if="searchText" class="search-box__content-delete">
              <qui-icon name="icon-close1" size="32" color="#ccc"></qui-icon>
            </view>
          </view>
          <view class="search-box__cancel" v-if="searchText" @tap="cancelSearch">
            <text>{{ i18n.t('search.cancel') }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 成员列表 -->
    <scroll-view class="site-users-wx-box" scroll-y scroll-with-animation @scrolltolower="pullDown">
      <view>
        <view v-if="userListShow && userListShow.length > 0">
          <view class="site-users-wx-box-list" v-for="user in userListShow" :key="user.id">
            <qui-avatar-cell
              center
              right-color="#aaa"
              :mark="user.id"
              :title="user.username"
              :value="user.groups[Object.keys(user.groups || {})[0]].name"
              :icon="user.avatarUrl"
              @click="jumpUserPage(user.id)"
            ></qui-avatar-cell>
          </view>
          <qui-load-more :status="loadingTypeShow"></qui-load-more>
        </view>
        <qui-no-data :tips="i18n.t('manage.noContent')" v-else></qui-no-data>
      </view>
    </scroll-view>
    <!-- #endif -->
    <!-- #ifdef H5-->
    <qui-header-back title="站点成员"></qui-header-back>
    <!-- 搜索成员 -->
    <view class="site-users-h5-search">
      <view class="search">
        <view class="search-box">
          <view class="search-box__content">
            <view class="icon-content-search">
              <qui-icon name="icon-search" size="30" color="#bbb"></qui-icon>
            </view>
            <input
              type="text"
              class="search-box__content-input"
              placeholder-class="input-placeholder"
              :placeholder="i18n.t('manage.searchMembers')"
              @input="searchInput"
              :value="searchText"
            />
            <view @tap="cancelSearch" v-if="searchText" class="search-box__content-delete">
              <qui-icon name="icon-close1" size="32" color="#ccc"></qui-icon>
            </view>
          </view>
          <view class="search-box__cancel" v-if="searchText" @tap="cancelSearch">
            <text>{{ i18n.t('search.cancel') }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 成员列表 -->
    <scroll-view class="site-users-h5-box" scroll-y scroll-with-animation @scrolltolower="pullDown">
      <view>
        <view v-if="userListShow && userListShow.length > 0">
          <view class="site-users-h5-box-list" v-for="user in userListShow" :key="user.id">
            <qui-avatar-cell
              center
              right-color="#aaa"
              :mark="user.id"
              :title="user.username"
              :value="user.groups[Object.keys(user.groups || {})[0]].name"
              :icon="user.avatarUrl"
              @click="jumpUserPage(user.id)"
            ></qui-avatar-cell>
          </view>
          <qui-load-more :status="loadingTypeShow"></qui-load-more>
        </view>
        <qui-no-data :tips="i18n.t('manage.noContent')" v-else></qui-no-data>
      </view>
    </scroll-view>
    <!-- #endif -->
  </qui-page>
</template>

<script>
import { debounce } from 'lodash';

export default {
  data() {
    return {
      searchText: '', // 输入的用户名
      loadingType: 'more', // 上拉加载状态
      searchLoadingType: 'more', // 搜索上拉加载状态
      pageSize: 20, // 每页20条数据
      pageNum: 1, // 当前页数
      searchPageNum: 1, // 搜索的当前页数
      userList: [], // 用户数据
      searchUserList: [], // 搜索的用户数据
      isSearch: false, // 是否搜索
    };
  },
  onLoad() {
    this.searchUser();
  },
  computed: {
    userListShow() {
      return this.isSearch ? this.searchUserList : this.userList;
    },
    loadingTypeShow() {
      return this.isSearch ? this.searchLoadingType : this.loadingType;
    },
  },
  methods: {
    // 跳转到个人主页
    jumpUserPage(userId) {
      if (userId) {
        console.log('点击头像到个人主页', userId);
        uni.navigateTo({
          url: `/pages/profile/index?userId=${userId}`,
        });
      }
    },
    // eslint-disable-next-line
    searchInput: debounce(function(e) {
      if (e && e.target) {
        this.isSearch = true;
        this.searchPageNum = 1;
        this.searchUserList = [];
        this.searchUser(e.target.value);
      }
    }, 800),
    cancelSearch() {
      this.isSearch = false;
      this.searchText = '';
    },
    // 调用 搜索 接口
    searchUser(val = '') {
      this.searchText = val;
      const params = {
        include: 'groups',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[username]': `*${this.searchText}*`,
      };
      if (this.searchText === '') {
        this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
          console.log('内容为空的搜索：', res);
          if (res && res._jv) {
            delete res._jv;
            if (this.isSearch) {
              this.searchUserList = [...this.searchUserList, ...res];
            } else {
              this.userList = [...this.userList, ...res];
            }
            this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          }
        });
      } else {
        params['page[number]'] = this.searchPageNum;
        this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
          console.log('搜索res：', res);
          if (res && res._jv) {
            delete res._jv;
            this.searchUserList = [...this.searchUserList, ...res];
            this.searchLoadingType = res.length === this.pageSize ? 'more' : 'nomore';
          }
        });
      }
    },
    // 上拉加载
    pullDown() {
      if (this.loadingTypeShow !== 'more') {
        return;
      }
      if (this.isSearch) {
        this.searchPageNum += 1;
      } else {
        this.pageNum += 1;
      }
      this.searchUser(this.searchText);
      console.log('页码', this.pageNum);
    },
  },
};
</script>

<style lang="scss" scope>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

/* #ifdef MP-WEIXIN */
.site-users-wx-search {
  .search {
    position: fixed;
    top: 0rpx;
    z-index: 99;
    width: 100%;
  }

  .search-box {
    height: 135rpx;
    background-color: --color(--qui-BG-2);
    box-sizing: border-box;
  }
}

.site-users-wx-box {
  position: fixed;
  top: 135rpx;
  right: 0rpx;
  bottom: 0rpx;
  left: 0rpx;

  &-list {
    background: --color(--qui-BG-2);
  }
}
/* #endif */

/* #ifdef H5 */
.site-users-h5-search {
  .search {
    position: fixed;
    top: 44px;
    z-index: 99;
    width: 100%;
  }

  .search-box {
    height: 61px;
    padding: 14px 19px 9px;
    background-color: --color(--qui-BG-2);
    box-sizing: border-box;
  }
}

.site-users-h5-box {
  position: fixed;
  top: 105px;
  right: 0rpx;
  bottom: 0rpx;
  left: 0rpx;

  &-list {
    background: --color(--qui-BG-2);
  }
}
/* #endif */
</style>
