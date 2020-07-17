<template>
  <qui-page :data-qui-theme="theme" class="orderlist">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('profile.orderlist')"></qui-header-back>
    <!-- #endif -->
    <view class="orderlist-wrap">
      <qui-cell-item slot-right :border="false">
        <view @tap="showFilter">
          <text>{{ `${i18n.t('profile.status')} :${filterSelected.label}` }}</text>
          <qui-icon class="text" name="icon-screen" size="30" color="#777"></qui-icon>
          <qui-filter-modal
            v-model="show"
            @confirm="confirm"
            @change="changeType"
            :filter-list="filterList"
            :if-need-confirm="false"
            ref="filter"
          ></qui-filter-modal>
        </view>
      </qui-cell-item>
    </view>
    <picker mode="date" :value="date" @change="bindDateChange" fields="month" class="date-picker">
      <view class="uni-input">{{ `${i18n.t('profile.time')} ：${date}` }}</view>
    </picker>
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      @scrolltolower="pullDown"
      show-scrollbar="false"
      class="scroll-y"
    >
      <view class="orderlist-items" v-show="dataList.length > 0">
        <qui-cell-item
          v-for="(item, index) in dataList"
          :key="index"
          :title="item.titleType"
          :brief="timeHandle(item.created_at)"
          :addon="'-￥' + item.amount"
          :brief-right="statusType[item.status]"
          @click="toTopic(item)"
          :border="index == dataList.length - 1 ? false : true"
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
      flag: true, // 滚动节流
      pageSize: 20,
      pageNum: 1, // 当前页数
      show: false,
      date: currentDate,
      userId: this.$store.getters['session/get']('userId'), // 获取当前登陆用户的ID
      dataList: [],
      filterSelected: { label: this.i18n.t('profile.all'), value: '' }, // 筛选类型
      statusType: {
        0: this.i18n.t('profile.tobepaid'),
        1: this.i18n.t('profile.paid'),
        2: this.i18n.t('profile.cancelorder'),
        3: this.i18n.t('profile.payfail'),
        4: this.i18n.t('profile.orderexpired'),
      },
      filterList: [
        {
          title: this.i18n.t('profile.type'),
          data: [
            { label: this.i18n.t('profile.all'), value: '', selected: true },
            { label: this.i18n.t('profile.tobepaid'), value: 0 },
            { label: this.i18n.t('profile.paid'), value: 1 },
            { label: this.i18n.t('profile.cancelorder'), value: 2 },
            { label: this.i18n.t('profile.payfail'), value: 3 },
            { label: this.i18n.t('profile.orderexpired'), value: 4 },
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
    // 处理时间
    timeHandle(time) {
      return time2MinuteOrHour(time);
    },
    // 日期选中
    bindDateChange(e) {
      this.date = e.target.value;
      this.getList('filter');
    },
    getList(type) {
      this.loadingType = 'loading';
      const dateArr = this.date.split('-');
      const days = new Date(dateArr[0], dateArr[1], 0).getDate();
      // status 0 待付款，1 已付款 ，2取消订单，3支付失败，4 订单已过期
      const params = {
        include: ['user', 'thread', 'thread.firstPost'],
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
      if (this.filterSelected.value || this.filterSelected.value === 0) {
        params['filter[status]'] = this.filterSelected.value;
      }
      status
        .run(() => this.$store.dispatch('jv/get', ['orders', { params }]))
        .then(res => {
          if (res._jv) {
            delete res._jv;
          }
          res.forEach((item, index) => {
            let desc = this.handleTitle(item);
            // 截取42个字
            if (desc.length > 42) {
              desc = `${desc.substr(0, 42)}...`;
            }
            res[index].titleType = desc;
          });
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          this.dataList = [...this.dataList, ...res];
        });
    },
    toTopic(data) {
      if (!data.thread) {
        return;
      }
      uni.navigateTo({
        url: `/pages/topic/index?id=${data.thread._jv.id}`,
      });
    },
    // 处理主题相关的数据
    handleTitle(item) {
      switch (item.type) {
        case 1: {
          // 注册
          return this.i18n.t('profile.register');
        }
        case 2: {
          // 打赏支出
          const regex = /(<([^>]+)>)/gi;
          const thread = item.thread
            ? item.thread.firstPost.summary.replace(regex, '')
            : this.i18n.t('profile.thethemewasdeleted');
          return `${this.i18n.t('profile.givearewardforthetheme')} ${thread}`;
        }
        case 3: {
          // 付费主题支出
          const regex = /(<([^>]+)>)/gi;
          const thread = item.thread
            ? item.thread.firstPost.summary.replace(regex, '')
            : this.i18n.t('profile.thethemewasdeleted');
          return `${this.i18n.t('profile.paidtoview')} ${thread}`;
        }
        case 4: {
          // 付费用户组
          return this.i18n.t('profile.paygroup');
        }
        default:
          return item.type;
      }
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
.orderlist /deep/ {
  min-height: auto;
  .cell-item {
    padding-right: 40rpx;
  }
  .cell-item__body {
    height: auto;
    padding: 35rpx 0;
  }
  .orderlist-items .cell-item__body {
    align-items: flex-start;
  }
  .orderlist-items .cell-item__body__right-brief {
    position: absolute;
    right: 0;
    bottom: 35rpx;
    width: 120rpx;
  }
  .cell-item__body__right-text {
    font-weight: bold;
    color: #189a00;
  }
  .icon-screen {
    margin-left: 20rpx;
  }
  .orderlist-wrap {
    padding: 40rpx 0 0 40rpx;
    /* #ifdef H5 */
    padding-top: 90rpx;
    /* #endif */
    margin-bottom: 30rpx;
    color: --color(--qui-FC-333);
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid #ededed;
  }
  .orderlist-wrap .cell-item__body {
    height: 78rpx;
  }
  .orderlist-items {
    padding-left: 40rpx;
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
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
.cell-item__body__right {
  padding-left: 59rpx;
}
</style>
