<template>
  <qui-page :data-qui-theme="theme" class="favorite">
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
            size="30"
            color="#aaa"
            @tap="itemDelete(item._jv.id, item.isFavorite, index)"
          ></qui-icon>
        </view>
        <qui-load-more :status="loadingType" :show-icon="false" v-if="loadingType"></qui-load-more>
      </view>
    </scroll-view>
    <uni-popup ref="popTips" type="center">
      <uni-popup-dialog
        type="warn"
        :before-close="true"
        :content="i18n.t('core.deleteFavoriteSure')"
        @close="handleCancel"
        @confirm="handleOk"
      ></uni-popup-dialog>
    </uni-popup>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';

export default {
  components: { uniPopupDialog },
  mixins: forums,
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
      currentItem: '',
      editThreadId: '',
      nowThreadId: '',
    };
  },
  mounted() {
    this.loadlikes();
  },
  onLoad() {
    // #ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    // #endif
  },
  onShow() {
    this.uploadItem();
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
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.forums.set_site.site_name,
      query: '',
    };
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
    handleCancel() {
      this.$refs.popTips.close();
    },
    handleOk() {
      this.$refs.popTips.close();
      const { currentItem } = this;
      const params = {
        _jv: {
          type: 'threads',
          id: currentItem.id,
        },
        isFavorite: currentItem.isFavorite !== true,
      };
      this.$store.dispatch('jv/patch', params).then(() => {
        this.totalData -= 1;
        this.data.splice(currentItem.index, 1);
      });
    },
    // 删除收藏
    itemDelete(id, isFavorite, index) {
      const currentItem = { id, isFavorite, index };
      this.currentItem = currentItem;
      this.$refs.popTips.open();
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
