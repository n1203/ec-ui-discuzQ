<template>
  <qui-page :data-qui-theme="theme" class="freeze">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('profile.freezeamount')"></qui-header-back>
    <!-- #endif -->
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      show-scrollbar="false"
      class="scroll-y"
    >
      <view class="freeze-head">
        <view class="freeze-head__num">
          <text>{{ i18n.t('profile.total') }}</text>
          <text class="freeze-head__num__detail">{{ totalData }}</text>
          <text>{{ `${i18n.t('profile.item')}${i18n.t('profile.records')}` }}</text>
        </view>
        <view class="freeze-head__money">
          <text>{{ i18n.t('profile.amountinvolved') }}</text>
          <text class="freeze-head__money__detail">¥{{ userInfo.walletFreeze }}</text>
        </view>
      </view>
      <view class="freeze-items" v-show="freezelist.length > 0">
        <qui-cell-item
          v-for="(freezeItem, index) in freezelist"
          :key="index"
          :title="`${i18n.t('profile.freezingreason')} : ${freezeItem.change_desc}`"
          :brief="`ID:${freezeItem.id}`"
          :addon="
            freezeItem.change_freeze_amount > 0
              ? `￥${freezeItem.change_freeze_amount}`
              : `-￥${freezeItem.change_freeze_amount.substr(1)}`
          "
          :brief-right="timeHandle(freezeItem.created_at)"
          :border="index == freezelist.length - 1 ? false : true"
        ></qui-cell-item>
      </view>
      <qui-load-more :status="loadingType" :show-icon="false" v-if="loadingType"></qui-load-more>
    </scroll-view>
  </qui-page>
</template>

<script>
import { time2MinuteOrHour } from '@/utils/time';

export default {
  onLoad() {
    this.getFreezelist();
  },
  data() {
    return {
      loadingType: '',
      totalData: 0, // 总数
      pageSize: 20,
      pageNum: 1, // 当前页数
      freezelist: [],
      userId: this.$store.getters['session/get']('userId'),
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters['jv/get'](`/users/${this.userId}`);
    },
  },
  methods: {
    // 获取冻结金额列表数据
    getFreezelist() {
      this.loadingType = 'loading';
      const params = {
        'filter[user]': this.userId,
        'filter[change_type]': [10, 11, 12], // 10提现冻结 11提现成功 12 提现解冻
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
      };
      this.$store.dispatch('jv/get', ['wallet/log', { params }]).then(res => {
        this.totalData = res._jv.json.meta.total;
        delete res._jv;
        this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        this.freezelist = [...this.freezelist, ...res];
      });
    },
    // 处理时间
    timeHandle(time) {
      return time2MinuteOrHour(time);
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getFreezelist();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.freeze /deep/ {
  min-height: auto;
  .cell-item {
    padding-right: 40rpx;
  }
  .cell-item__body {
    height: 150rpx;
  }
  .freeze-head__num__detail,
  .freeze-head__money__detail,
  .cell-item__body__right-text {
    font-weight: bold;
  }
  .freeze-head {
    display: flex;
    height: 78rpx;
    align-items: center;
    justify-content: space-between;
    padding: 40rpx 40rpx 0;
    /* #ifdef H5 */
    padding-top: 90rpx;
    /* #endif */
    margin-bottom: 30rpx;
    font-size: $fg-f24;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .freeze-head__num {
    justify-content: flex-start;
  }
  .freeze-head__money {
    justify-content: flex-end;
  }
  .freeze-head__num__detail {
    margin: 0 5rpx;
  }
  .freeze-head__money__detail {
    margin-left: 10rpx;
  }
  .freeze-items {
    padding-left: 40rpx;
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
}
.scroll-y {
  max-height: 100vh;
}
</style>
