<template>
  <qui-page :data-qui-theme="theme" class="search">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('search.search')"></qui-header-back>
    <!-- #endif -->
    <view class="search-box">
      <view class="search-box__content">
        <view class="icon-content-search">
          <qui-icon name="icon-search" size="30" color="#bbb"></qui-icon>
        </view>
        <input
          type="text"
          class="search-box__content-input"
          placeholder-class="input-placeholder"
          :placeholder="i18n.t('search.searchkeywords')"
          @input="searchInput"
          :value="searchValue"
        />
        <view @tap="clearSearch" v-if="searchValue" class="search-box__content-delete">
          <qui-icon name="icon-close1" size="32" color="#ccc"></qui-icon>
        </view>
      </view>
      <view class="search-box__cancel" v-if="searchValue" @tap="clearSearch">
        <text>{{ i18n.t('search.cancel') }}</text>
      </view>
    </view>
    <view class="search-item" v-if="searchValue">
      <view class="search-item__head">
        <view class="search-item__head-title">{{ i18n.t('search.users') }}</view>
        <view class="search-item__head-more" @tap="searchUser" v-if="userList.length > 0">
          {{ i18n.t('search.searchmoreusers') }}
        </view>
      </view>
      <view
        class="search-item__users"
        v-for="(item, index) in userList"
        :key="index"
        @tap="toProfile(item.id)"
      >
        <qui-avatar class="search-item__users__avatar" :user="item" size="70" />
        <qui-cell-item
          :title="item.username"
          arrow
          :border="index == userList.length - 1 ? false : true"
          :addon="item.groups ? item.groups[0].name : ''"
        ></qui-cell-item>
      </view>
      <qui-no-data :tips="i18n.t('search.norelatedusersfound')" v-if="userTotal == 0"></qui-no-data>
    </view>
    <view class="search-item search-item--themes" v-if="searchValue">
      <view class="search-item__head">
        <view class="search-item__head-title">{{ i18n.t('search.themes') }}</view>
        <view class="search-item__head-more" @tap="searchTheme" v-if="themeList.length > 0">
          {{ i18n.t('search.searchmorethemes') }}
        </view>
      </view>
      <view
        v-for="(item, index) in themeList"
        :key="index"
        :class="index == themeList.length - 1 ? 'noBorder' : ''"
        class="search-item__content"
      >
        <qui-thread-item :currentindex="index" :thread="item" @toTopic="toTopic"></qui-thread-item>
        <qui-icon class="arrow" name="icon-folding-r" size="22" color="#ddd"></qui-icon>
      </view>
      <qui-no-data
        :tips="i18n.t('search.norelatedthemesfound')"
        v-if="themeTotal == 0"
      ></qui-no-data>
    </view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';

export default {
  data() {
    return {
      searchValue: '',
      userList: [],
      themeList: [],
      userTotal: null,
      themeTotal: null,
      editThreadId: '',
      pageNum: 1, // 当前页数
    };
  },
  onShow() {
    this.uploadItem();
  },
  methods: {
    toTopic(id) {
      this.editThreadId = id;
    },
    searchInput(e) {
      this.searchValue = e.target.value;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.getUserList(e.target.value);
        this.getThemeList(e.target.value);
      }, 250);
    },

    // 获取用户列表
    getUserList(key) {
      const params = {
        include: 'groups',
        sort: 'createdAt',
        'page[number]': this.pageNum,
        'page[limit]': 3,
        'filter[username]': `*${key}*`,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['users', { params }]))
        .then(res => {
          if (res._jv) {
            delete res._jv;
          }
          this.userTotal = res.length;
          this.userList = res;
        });
    },
    // 获取主题列表
    getThemeList(key) {
      const params = {
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
        'filter[isDeleted]': 'no',
        'filter[isApproved]': 1,
        'page[number]': this.pageNum,
        'page[limit]': 2,
        'filter[q]': key,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['threads', { params }]))
        .then(res => {
          if (res._jv) {
            delete res._jv;
          }
          this.themeTotal = res.length;
          this.themeList = res;
        });
    },
    uploadItem() {
      if (!this.editThreadId) {
        return;
      }
      const item = this.$store.getters['jv/get'](`threads/${this.editThreadId}`);
      const themeData = this.themeList;
      themeData.forEach((data, index) => {
        if (data._jv.id === this.editThreadId) {
          this.editThreadId = '';
          this.$set(themeData, index, item);
        }
      });
    },
    // 点击头像到个人主页
    toProfile(userId) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${userId}`,
      });
    },
    clearSearch() {
      this.searchValue = '';
      this.userList = [];
      this.themeList = [];
    },
    searchTheme() {
      uni.navigateTo({
        url: `/pages/site/search-theme?value=${this.searchValue}`,
      });
    },
    searchUser() {
      uni.navigateTo({
        url: `/pages/site/search-user?value=${this.searchValue}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.search /deep/ {
  overflow: hidden;
  .search-item,
  .search-box {
    background-color: --color(--qui-BG-2);
  }
  .search-box {
    /* #ifdef H5 */
    margin-top: 80rpx;
    /* #endif */
  }
  .no-data {
    padding-top: 20rpx;
  }
}
.search-item {
  padding-left: 40rpx;
  margin-bottom: 30rpx;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.search-item__head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx 20rpx 0;
}
.search-item__head-title {
  font-size: $fg-f28;
  font-weight: bold;
}
.search-item__head-more {
  font-size: $fg-f24;
  color: --color(--qui-LINK);
}
// 用户
/deep/ .cell-item__body__right {
  padding-right: 40rpx;
  font-size: $fg-f28;
  color: --color(--qui-FC-AAA);
}
.search-item__users__avatar {
  position: absolute;
  top: 16rpx;
  left: 0;
}
.search-item__users {
  position: relative;
  padding-left: 90rpx;
}
// 主题
.search /deep/ .themeCount {
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  box-shadow: none;
}
/deep/ .themeCount .themeItem {
  padding-left: 0;
  margin: 0;
  box-shadow: none;
}
/deep/ .themeCount .themeItem__footer {
  display: none;
}
.noBorder /deep/ .themeCount {
  border: 0;
}
.search-item__content {
  position: relative;
}
.arrow {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
}
/deep/ .themeCount .addFine {
  display: none;
}
</style>
