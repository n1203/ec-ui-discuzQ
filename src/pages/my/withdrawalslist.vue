<template>
  <qui-page :data-qui-theme="theme" class="withdrawalslist">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('profile.withdrawalslist')"></qui-header-back>
    <!-- #endif -->
    <view class="withdrawalslist-head">
      <qui-cell-item slot-right :border="false">
        <view @tap="showFilter">
          <text>{{ `${i18n.t('profile.status')} ：${filterSelected.label}` }}</text>
          <qui-icon class="text" name="icon-screen" size="30" color="#777"></qui-icon>
          <qui-filter-modal
            v-model="show"
            @confirm="confirm"
            :filter-list="filterList"
            @change="changeType"
            :if-need-confirm="false"
            ref="filter"
          ></qui-filter-modal>
        </view>
      </qui-cell-item>
      <picker mode="date" :value="date" @change="bindDateChange" fields="month" class="date-picker">
        <view class="uni-input">{{ `${i18n.t('profile.time')}：${date}` }}</view>
      </picker>
    </view>
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      show-scrollbar="false"
      class="scroll-y"
    >
      <view class="withdrawalslist-items" v-show="dataList.length > 0">
        <qui-cell-item
          v-for="(item, index) in dataList"
          :key="index"
          :title="operateStatus[item.cash_status - 1]"
          :brief="item.cash_sn"
          :addon="'¥' + item.cash_apply_amount"
          :brief-right="timeHandle(item.created_at)"
          :border="index == dataList.length - 1 ? false : true"
          :class-item="
            item.cash_status == 3 ? 'fail' : item.cash_status == 4 ? 'success' : 'normal'
          "
        ></qui-cell-item>
      </view>
      <qui-load-more :status="loadingType" :show-icon="false" v-if="loadingType"></qui-load-more>
    </scroll-view>
  </qui-page>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import { time2MinuteOrHour } from '@/utils/time';

export default {
  data() {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    const currentDate = `${year}-${month}`;
    return {
      loadingType: '',
      pageSize: 20,
      pageNum: 1, // 当前页数
      userId: this.$store.getters['session/get']('userId'), // 获取当前登陆用户的ID
      show: false,
      date: currentDate,
      filterSelected: { label: this.i18n.t('profile.all'), value: '' }, // 筛选类型
      operateStatus: [
        this.i18n.t('profile.tobereviewed'),
        this.i18n.t('profile.approved'),
        this.i18n.t('profile.auditfailed'),
        this.i18n.t('profile.paymenttobemade'),
        this.i18n.t('profile.paymentsucceed'),
        this.i18n.t('profile.paymentfailed'),
      ],
      showDate: false,
      dataList: [],
      filterList: [
        {
          title: this.i18n.t('profile.type'),
          data: [
            { label: this.i18n.t('profile.all'), value: '', selected: true },
            { label: this.i18n.t('profile.tobereviewed'), value: 1 },
            { label: this.i18n.t('profile.approved'), value: 2 },
            { label: this.i18n.t('profile.auditfailed'), value: 3 },
            { label: this.i18n.t('profile.paymenttobemade'), value: 4 },
            { label: this.i18n.t('profile.paymentsucceed'), value: 5 },
            { label: this.i18n.t('profile.paymentfailed'), value: 6 },
          ],
        },
      ],
    };
  },
  onLoad() {
    this.getList();
  },
  methods: {
    confirm(e) {
      this.filterSelected = { ...e[0].data };
      this.getList('filter');
    },
    changeType(e) {
      this.filterList = e;
    },
    showFilter() {
      this.show = true;
      this.$refs.filter.setData();
    },
    // 日期选中
    bindDateChange(e) {
      this.date = e.target.value;
      this.getList('filter');
    },
    // 处理时间
    timeHandle(time) {
      return time2MinuteOrHour(time);
    },
    getList(type) {
      this.loadingType = 'loading';
      const dateArr = this.date.split('-');
      const days = new Date(dateArr[0], dateArr[1], 0).getDate();
      // cash_status(1-6) '待审核', '审核通过', '审核不通过', '待打款', '已打款', '打款失败'
      const params = {
        'filter[user]': this.userId,
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[start_time]': `${this.date}-01-00-00-00`,
        'filter[end_time]': `${this.date}-${days}-00-00-00`,
      };
      if (type && type === 'filter') {
        params.pageNum = 1;
        this.dataList = [];
      }
      if (this.filterSelected.value) {
        params['filter[cash_status]'] = this.filterSelected.value;
      }
      status
        .run(() => this.$store.dispatch('jv/get', ['wallet/cash', { params }]))
        .then(res => {
          if (res._jv) {
            delete res._jv;
          }
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          this.dataList = [...this.dataList, ...res];
        });
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
/* #ifdef H5 */
$height: calc(100vh - 190rpx);
/* #endif */

/* #ifdef MP-WEIXIN */
$height: calc(100vh - 150rpx);
/* #endif */

.withdrawalslist /deep/ {
  min-height: auto;
  .cell-item {
    padding-right: 40rpx;
  }
  .cell-item__body {
    height: 150rpx;
  }
  .cell-item__body__right-text {
    font-weight: bold;
  }
  .icon-screen {
    margin-left: 20rpx;
  }
  .withdrawalslist-head {
    position: relative;
    padding: 40rpx 0 0 40rpx;
    /* #ifdef H5 */
    padding-top: 90rpx;
    /* #endif */
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .withdrawalslist-head .cell-item__body {
    height: 78rpx;
  }
  .withdrawalslist-items {
    padding-left: 40rpx;
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .cell-item.fail .cell-item__body__content-title {
    color: --color(--qui-RED);
  }
  .cell-item.success .cell-item__body__content-title {
    color: #189a00;
  }
}

.date-picker {
  position: absolute;
  top: 40rpx;
  left: 40rpx;
  z-index: 10;
  width: 50%;
  height: 78rpx;
  /* #ifdef H5 */
  margin-top: 50rpx;
  /* #endif */
}
.date-picker .uni-input {
  width: 100%;
  height: 78rpx;
  font-size: $fg-f28;
  line-height: 78rpx;
}
.scroll-y {
  max-height: $height;
}
</style>
