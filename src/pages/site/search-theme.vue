<template>
  <qui-page :data-qui-theme="theme" class="search">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('search.searchthemes')"></qui-header-back>
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
      @scroll="scroll"
    >
      <view v-for="(item, index) in data" :key="index" class="search-item__content">
        <qui-thread-item
          :currentindex="index"
          :thread="item"
          :scroll-top="scrollTop"
          @toTopic="toTopic"
        ></qui-thread-item>
        <qui-icon class="arrow" name="icon-folding-r" size="22" color="#ddd"></qui-icon>
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
      editThreadId: '',
      pageSize: 20,
      pageNum: 1, // 当前页数
      scrollTop: 0,
    };
  },
  onLoad(params) {
    this.searchValue = params.value;
    this.getThemeList(params.value);
  },
  onShow() {
    this.uploadItem();
  },
  methods: {
    toTopic(id) {
      this.editThreadId = id;
    },
    scroll(event) {
      this.scrollTop = event.detail.scrollTop;
    },
    searchInput(e) {
      this.searchValue = e.target.value;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.data = [];
        this.pageNum = 1;
        this.getThemeList(e.target.value);
      }, 250);
    },
    // 获取主题列表
    getThemeList(key, type) {
      this.loadingType = 'loading';
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
        'page[limit]': this.pageSize,
        'filter[q]': key,
      };
      this.$store.dispatch('jv/get', ['threads', { params }]).then(res => {
        if (res._jv) {
          delete res._jv;
        }
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
      this.getThemeList('', 'clear');
    },
    uploadItem() {
      if (!this.editThreadId) {
        return;
      }
      const item = this.$store.getters['jv/get'](`threads/${this.editThreadId}`);
      const themeData = this.data;
      themeData.forEach((data, index) => {
        if (data._jv.id === this.editThreadId) {
          this.editThreadId = '';
          this.$set(themeData, index, item);
        }
      });
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getThemeList(this.searchValue);
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

// 主题
.search /deep/ {
  /* #ifdef H5 */
  height: 100vh;
  min-height: auto;
  overflow: hidden;
  /* #endif */
  .themeCount {
    padding-left: 40rpx;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    box-shadow: none;
  }
  .search-item {
    padding-top: 15rpx;
    background-color: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .search-box {
    padding: 30rpx 40rpx 0;
    /* #ifdef H5 */
    margin-top: 80rpx;
    /* #endif */
    background: --color(--qui-BG-2);
  }
}
/deep/ .themeCount .themeItem {
  padding-right: 40rpx;
  padding-left: 0;
  margin: 0;
  box-shadow: none;
}
/deep/ .themeCount .themeItem__footer {
  display: none;
}
.search-item__theme {
  position: relative;
  padding-left: 130rpx;
}
.scroll-y {
  max-height: $height;
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
