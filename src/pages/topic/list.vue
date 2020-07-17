<template>
  <qui-page :data-qui-theme="theme" class="pages-list">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('topic.topictitlelist')"></qui-header-back>
    <!-- #endif -->
    <view class="qui-topic-page-box">
      <view class="qui-topic-page-box__hd">
        <view class="qui-topic-page-box__hd__sc">
          <qui-icon class="icon-search" name="icon-search" size="30"></qui-icon>
          <input
            class="topicSearchInput"
            type="text"
            placeholder-class="input-placeholder"
            confirm-type="search"
            :placeholder="i18n.t('topic.searchTopic')"
            v-model="keyword"
            @input="searchInput"
          />
        </view>
      </view>
    </view>
    <view class="topic-list-page">
      <view class="topic-list-page-header">
        <view class="topic-list-page-header_title">{{ i18n.t('topic.topicList') }}</view>
        <!-- 排序功能后续补上完善 -->
        <view class="topic-list-page-header_sortBox" @click="toggleDropDown">
          <view>
            <qui-icon class="icon-sort" name="icon-sort" size="30"></qui-icon>
            <text>{{ i18n.t('core.sort') }}</text>
          </view>
          <view class="dropDownBox" v-show="dropDownShow">
            <view @click="switchSort('-viewCount')" class="dropDownBox-view">
              {{ i18n.t('topic.hot') }}
            </view>
            <view @click="switchSort('-threadCount')">
              {{ i18n.t('topic.contents') }}
            </view>
          </view>
        </view>
      </view>
      <view style="clear: both;"></view>
      <view class="topic-page-list-item" v-for="(item, i) in topicData" :key="i">
        <navigator :url="'/pages/topic/content?id=' + item._jv.id">
          <view class="topic-page-list-item_title">#{{ item.content }}#</view>
        </navigator>
        <view class="topic-page-list-item_details" v-if="item.lastThread.length">
          <navigator :url="'/pages/topic/index?id=' + item.lastThread[0]._jv.id">
            <qui-uparse
              class="topic-page-list-item_details_text"
              :content="item.lastThread[0].firstPost.summary"
            ></qui-uparse>
          </navigator>
          <qui-image
            class="topic-page-list-item_details_image"
            :images-list="item.lastThread[0].firstPost.images"
            v-if="item.lastThread[0].firstPost.images.length"
          ></qui-image>
        </view>
        <view class="topic-page-list-item_other">
          <view class="topic-page-list-item_heat">
            {{ i18n.t('topic.hot') }}
            <text>
              {{
                item.view_count > 10000
                  ? Number(item.view_count / 10000) + i18n.t('core.thousand')
                  : item.view_count
              }}
            </text>
          </view>
          <view class="topic-page-list-item_content">
            {{ i18n.t('core.content') }}
            <text>
              {{
                item.thread_count > 1000
                  ? Number(item.thread_count / 1000) + 'k'
                  : item.thread_count
              }}
            </text>
          </view>
        </view>
      </view>
    </view>
    <qui-load-more :content-text="contentText"></qui-load-more>
  </qui-page>
</template>

<script>
let timer = null;
let currentPage = 1;

export default {
  data() {
    return {
      dropDownShow: false,
      topicData: [],
      meta: {}, // 接口返回meta值
      contentText: {
        contentdown: this.i18n.t('topic.noMoreData'),
      },
      keyword: '',
      sort: '-viewCount',
    };
  },
  methods: {
    toggleDropDown() {
      this.dropDownShow = !this.dropDownShow;
    },
    searchInput() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // 为发送请求添加防抖处理
        this.topics();
      }, 300);
    },
    switchSort(sort) {
      this.sort = sort;
      this.topics();
    },
    topics(page = 1, limit = 20) {
      const params = {
        include: 'user,lastThread,lastThread.firstPost,lastThread.firstPost.images',
        'page[number]': page,
        'page[limit]': limit,
        sort: this.sort,
      };
      if (this.keyword) {
        params['filter[content]'] = this.keyword;
      }

      return this.$store.dispatch('jv/get', ['topics', { params }]).then(data => {
        this.meta = data._jv.json.links;
        // eslint-disable-next-line no-param-reassign
        // delete data._jv;
        if (page > 1) {
          this.topicData = this.topicData.concat(data);
        } else {
          this.topicData = data;
        }
        if (this.meta.next) {
          this.contentText.contentdown = this.i18n.t('core.loadMore');
        } else if (this.meta.last && this.meta.first) {
          this.contentText.contentdown = this.i18n.t('core.noMoreData');
        } else {
          this.contentText.contentdown = this.i18n.t('core.available');
        }
      });
    },
  },
  onLoad() {
    this.topics();
  },
  onReachBottom() {
    if (this.meta.next) {
      this.topics((currentPage += 1));
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
.pages-list /deep/ {
  /* #ifdef H5 */
  padding-top: 88rpx;
  box-sizing: border-box;
  /* #endif */
}
.dropDownBox {
  position: absolute;
  top: 50rpx;
  right: -20rpx;
  z-index: 10;
  width: 180rpx;
  padding: 10rpx;
  text-align: center;
  background: --color(--qui-BG-2);
  border-radius: 10rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.16);
  box-sizing: border-box;
  view {
    height: 70rpx;
    font-size: $fg-f28;
    line-height: 70rpx;
    color: --color(--qui-FC-777);
    text-align: center;
  }
  &-view {
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  &:before {
    position: absolute;
    top: -12rpx;
    right: 24rpx;
    width: 0;
    height: 0;
    border-color: transparent transparent --color(--qui-BOR-ED);
    border-style: solid;
    border-width: 0 12rpx 12rpx;
    content: '';
  }
  &:after {
    position: absolute;
    top: -10rpx;
    right: 24rpx;
    width: 0;
    height: 0;
    border-color: transparent transparent --color(--qui-BG-2);
    border-style: solid;
    border-width: 0 12rpx 12rpx;
    content: '';
  }
}

$otherHeight: 292rpx;
.topicSearchInput {
  font-size: 32rpx;
  color: #333;
}
.topic-list-page-header {
  margin: 24rpx;
  &_title {
    float: left;
    margin: 20rpx;
    margin-bottom: 8rpx;
    font-size: 28rpx;
  }
  &_sortBox {
    position: relative;
    float: right;
    margin: 20rpx;
    margin-bottom: 8rpx;
    font-size: 28rpx;
    color: #1878f3;
  }
  .icon-sort {
    margin-right: 8rpx;
  }
}
.topic-page-list-item {
  padding: 30rpx;
  margin: 20rpx;
  background: --color(--qui-BG-2);
  border-radius: 6rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  &_title {
    font-size: 35rpx;
    font-weight: 700;
    word-break: break-all;
  }
  &_details {
    margin: 20rpx 0;
    &_text {
      overflow: hidden;
      font-size: 30rpx;
      color: --color(--qui-FC-333);
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
    }
  }
  &_heat,
  &_content {
    margin-right: 37rpx;
    font-size: 28rpx;
    color: --color(--qui-FC-AAA);
  }
  &_other {
    display: flex;
  }
}
.topic-content-item {
  position: relative;
  height: 99.5rpx;
  margin-left: 40rpx;
  line-height: 99.5rpx;
  border-bottom: 0.5rpx solid #dedede;
  &_title {
    position: absolute;
    left: 0;
    padding-bottom: 34rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
  }
  &_heat {
    position: absolute;
    right: 15rpx;
    font-size: 24rpx;
    color: #aaa;
  }
}
.qui-topic-page-box {
  width: 100%;
  height: 100%;
  background-color: --color(--qui-BG-2);
  &__hd {
    display: flex;
    align-items: center;
    height: 80rpx;
    padding: 20rpx 40rpx;

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
