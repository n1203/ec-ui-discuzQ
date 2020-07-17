<template>
  <qui-page :data-qui-theme="theme" class="favorite">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('profile.myfavorite')"></qui-header-back>
    <!-- #endif -->
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      show-scrollbar="false"
      class="scroll-y"
      @scroll="scroll"
    >
      <view class="favorite-head">
        <qui-cell-item
          :title="`${totalData}${i18n.t('profile.item')}${i18n.t('profile.collection')}`"
          :border="false"
        ></qui-cell-item>
      </view>
      <view class="favorite-content">
        <view v-for="(item, index) in data" :key="index" class="favorite-content__item">
          <qui-thread-item
            :currentindex="index"
            :thread="item"
            :scroll-top="scrollTop"
            @toTopic="toTopic"
            @handleClickShare="handleClickShare"
          ></qui-thread-item>
          <qui-icon
            name="icon-delete"
            size="28"
            color="#aaa"
            @tap="itemDelete(item._jv.id, item.isFavorite, index)"
          ></qui-icon>
        </view>
        <qui-load-more :status="loadingType" :show-icon="false" v-if="loadingType"></qui-load-more>
      </view>
    </scroll-view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';

export default {
  props: {
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingType: '',
      data: [],
      query: {},
      totalData: 0, // 总数
      pageSize: 20,
      pageNum: 1, // 当前页数
      scrollTop: 0,
      editThreadId: '',
      nowThreadId: '',
    };
  },
  mounted() {
    this.loadlikes();
  },
  onShow() {
    this.uploadItem();
  },
  methods: {
    toTopic(id) {
      this.editThreadId = id;
    },
    handleClickShare(id) {
      this.nowThreadId = id;
    },
    scroll(event) {
      this.scrollTop = event.detail.scrollTop;
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
    loadlikes() {
      this.loadingType = 'loading';
      const params = {
        include: [
          'user',
          'firstPost',
          'user.groups',
          'lastThreePosts',
          'lastThreePosts.user',
          'firstPost.likedUsers',
          'rewardedUsers',
          'lastThreePosts.replyUser',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
        'filter[isApproved]': 1,
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
      };
      status
        .run(() => this.$store.dispatch('jv/get', ['favorites', { params }]))
        .then(res => {
          if (res._jv) {
            this.totalData = res._jv.json.meta.threadCount;
            delete res._jv;
          }
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          this.data = [...this.data, ...res];
        });
    },
    // 删除收藏
    itemDelete(id, isFavorite, index) {
      const params = {
        _jv: {
          type: 'threads',
          id,
        },
        isFavorite: isFavorite !== true,
      };
      this.$store.dispatch('jv/patch', params).then(() => {
        this.totalData -= 1;
        this.data.splice(index, 1);
      });
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.loadlikes();
    },
    uploadItem() {
      if (!this.editThreadId) {
        return;
      }
      const item = this.$store.getters['jv/get'](`threads/${this.editThreadId}`);
      this.data.forEach((data, index) => {
        if (data._jv.id === this.editThreadId) {
          this.editThreadId = '';
          this.$set(this.data, index, item);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.scroll-y {
  max-height: 100vh;
}
.favorite /deep/ {
  .favorite-head {
    padding-top: 20rpx;
    padding-left: 40rpx;
    /* #ifdef H5 */
    margin-top: 60rpx;
    /* #endif */
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .cell-item__body {
    height: 78rpx;
  }
  .themeCount .addFine {
    display: none;
  }
  .themeCount .icon-delete {
    position: absolute;
    top: 35rpx;
    right: 40rpx;
  }
  .favorite-content__item {
    position: relative;
  }
  .icon-delete {
    position: absolute;
    top: 15px;
    right: 20px;
  }
}
</style>
