<template>
  <qui-page :data-qui-theme="theme" class="search">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('search.searchusers')"></qui-header-back>
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
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      show-scrollbar="false"
      class="scroll-y search-item"
    >
      <view
        class="search-item__users"
        v-for="(item, index) in data"
        :key="index"
        @tap="toProfile(item.id)"
      >
        <qui-avatar class="search-item__users__avatar" :user="item" size="70" />
        <qui-cell-item
          :title="item.username"
          arrow
          :addon="item.groups ? item.groups[0].name : ''"
        ></qui-cell-item>
      </view>
      <qui-load-more :status="loadingType" :show-icon="false" v-if="loadingType"></qui-load-more>
    </scroll-view>
  </qui-page>
</template>

<script>
export default {
  data() {
    return {
      searchValue: '',
      loadingType: '',
      data: [],
      pageSize: 20,
      pageNum: 1, // 当前页数
    };
  },
  onLoad(params) {
    this.searchValue = params.value;
    this.getUserList(params.value);
  },
  methods: {
    // 头像加载失败,显示默认头像
    imageError(index) {
      this.data[index].avatarUrl = '/static/noavatar.gif';
    },
    searchInput(e) {
      this.searchValue = e.target.value;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.data = [];
        this.pageNum = 1;
        this.getUserList(e.target.value);
      }, 250);
    },
    // 获取用户列表
    getUserList(key, type) {
      this.loadingType = 'loading';
      const params = {
        include: 'groups',
        sort: 'createdAt',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[username]': `*${key}*`,
      };
      this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
        if (res._jv) {
          delete res._jv;
        }
        res.forEach((v, i) => {
          res[i].avatarUrl = v.avatarUrl || '/static/noavatar.gif';
        });
        this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        if (type && type === 'clear') {
          this.data = res;
        } else {
          this.data = [...this.data, ...res];
        }
      });
    },
    clearSearch() {
      this.searchValue = '';
      this.pageNum = 1;
      this.getUserList('', 'clear');
    },
    back() {
      uni.navigateBack();
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
      this.getUserList(this.searchValue);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
/* #ifdef H5 */
$height: calc(100vh - 200rpx);
/* #endif */

/* #ifdef MP-WEIXIN */
$height: calc(100vh - 110rpx);
/* #endif */

.search /deep/ {
  /* #ifdef H5 */
  height: 100vh;
  min-height: auto;
  overflow: hidden;
  /* #endif */
  .search-item {
    background-color: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .search-box {
    /* #ifdef H5 */
    margin-top: 80rpx;
    /* #endif */
    background: --color(--qui-BG-2);
  }
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
  left: 40rpx;
}
.search-item__users {
  position: relative;
  padding-left: 130rpx;
}
.scroll-y {
  max-height: $height;
}
</style>
