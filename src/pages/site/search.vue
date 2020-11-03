<template>
  <qui-page :data-qui-theme="theme" class="search">
    <view class="search-box">
      <view class="search-box__content">
        <view class="icon-content-search">
          <qui-icon name="icon-sousuo" size="30" color="#bbb"></qui-icon>
        </view>
        <input
          type="text"
          class="search-box__content-input"
          placeholder-class="input-placeholder"
          :placeholder="i18n.t('search.searchkeywords')"
          @input="searchInput"
          @blur="searchDone"
          :value="searchValue"
        />
        <!-- <view class="search-item">
          <view class="search-item__head">
            <view>历史搜索</view>
            <view class="search-item__head-more" @tap="searchHistryClear">
              清空历史
            </view>
          </view>
          <view class="historyContainer fbh">
            <view class="hostryItem" v-for="item in searchHistory" :key="item">
              {{ item }}
            </view>
          </view>
        </view> -->
        <view @tap="clearSearch" v-if="searchValue" class="search-box__content-delete">
          <qui-icon name="icon-cuo" size="32" color="#ccc"></qui-icon>
        </view>
      </view>
      <view class="search-box__cancel" v-if="searchValue" @tap="clearSearch">
        <text>{{ i18n.t('search.cancel') }}</text>
      </view>
    </view>
    <view class="search-item">
      <view class="search-item__head">
        <view>历史搜索</view>
        <view class="search-item__head-more" @tap="searchHistryClear">
          <qui-icon class="icon delete" name="icon-lajitong" size="30"></qui-icon>
          清空历史
        </view>
      </view>
      <view class="historyContainer fbh">
        <view class="hostryItem" v-for="(item, index) in searchHistory" :key="index">
          {{ item }}
        </view>
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
        <qui-avatar
          class="search-item__users__avatar"
          :user="item"
          size="70"
          :is-real="item.isReal"
        />
        <qui-cell-item
          :title="item.username"
          arrow
          :border="index == userList.length - 1 ? false : true"
          :addon="item.groupName"
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
        <qui-icon class="arrow" name="icon-folding-r" size="26" color="#ddd"></qui-icon>
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
      searchHistory: '',
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
    try {
      this.searchHistory = uni.getStorageSync('searchHistory');
      console.log('⭐️ SouWind ⭐️:: onShow -> this.searchHistory', this.searchHistory);
    } catch (err) {
      console.log(`Search error: ${err}`);
    }
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
    searchDone() {
      if (!this.searchValue) return '';
      // todo 删除超出部分
      if (this.searchHistory.length >= 10) {
        this.searchHistory = this.searchHistory.slice(0, 9);
      }
      uni.setStorageSync('searchHistory', [this.searchValue, ...this.searchHistory]);
    },
    searchHistryClear() {
      uni.clearStorageSync('searchHistory');
      this.searchHistory = [];
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
          res.forEach((v, i) => {
            res[i].groupName = v.groups[0] ? v.groups[0].name : '';
          });
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
  .no-data {
    padding-top: 20rpx;
  }
}
.search-item {
  padding-left: 40rpx;
  padding-bottom: 20rpx;
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
  border: 0;
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
.historyContainer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-left: 8rpx;
}
.hostryItem {
  padding: 9rpx 21rpx;
  background: rgb(242, 242, 242);
  border-radius: 29rpx;
  margin-bottom: 16rpx;
  margin-right: 16rpx;
  font-weight: 400;
  font-size: 10px;
}
.delete {
  padding-right: 10rpx;
}
</style>
