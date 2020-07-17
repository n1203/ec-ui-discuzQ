<template>
  <qui-page :data-qui-theme="theme" class="walletlist">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('profile.walletlist')"></qui-header-back>
    <!-- #endif -->
    <view class="walletlist-head">
      <qui-cell-item slot-right :border="false">
        <view @tap="showFilter">
          <text>{{ `${i18n.t('profile.status')} ：${filterSelected.label}` }}</text>
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
      <view class="walletlist-items" v-show="dataList.length > 0">
        <qui-cell-item
          v-for="(item, index) in dataList"
          :key="index"
          :title="item.change_desc"
          :brief="timeHandle(item.created_at)"
          :addon="
            item.change_available_amount > 0
              ? `+￥${item.change_available_amount}`
              : `-￥${item.change_available_amount.substr(1)}`
          "
          :class-item="item.change_available_amount > 0 ? 'fail' : 'success'"
          :border="index == dataList.length - 1 ? false : true"
          @click="toTopic(item)"
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
      show: false,
      userId: this.$store.getters['session/get']('userId'), // 获取当前登陆用户的ID
      date: currentDate,
      filterSelected: { label: this.i18n.t('profile.all'), value: '' }, // 筛选类型
      dataList: [],
      filterList: [
        {
          title: this.i18n.t('profile.type'),
          data: [
            { label: this.i18n.t('profile.all'), value: '', selected: true },
            { label: this.i18n.t('profile.withdrawalfreeze'), value: 10 },
            { label: this.i18n.t('profile.withdrawalsucceed'), value: 11 },
            { label: this.i18n.t('profile.withdrawalunfreeze'), value: 12 },
            { label: this.i18n.t('profile.registeredincome'), value: 30 },
            { label: this.i18n.t('profile.rewardincome'), value: 31 },
            { label: this.i18n.t('profile.laborincome'), value: 32 },
            { label: this.i18n.t('profile.laborexpenditure'), value: 50 },
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
      // change_type 10提现冻结，11提现成功，12提现解冻，30注册收入，31打赏收入，32人工收入，50人工支出
      const params = {
        include: ['user', 'order.user', 'order.thread', 'order.thread.firstPost'],
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
        params['filter[change_type]'] = this.filterSelected.value;
      }
      status
        .run(() => this.$store.dispatch('jv/get', ['wallet/log', { params }]))
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
            res[index].change_desc = desc;
          });
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          this.dataList = [...this.dataList, ...res];
        });
    },
    // 处理主题相关的数据
    handleTitle(item) {
      switch (item.change_type) {
        case 31: {
          // 打赏收入
          const user = item.order.user
            ? item.order.user.username
            : this.i18n.t('profile.theuserwasdeleted');
          const regex = /(<([^>]+)>)/gi;
          const thread = item.order.thread
            ? item.order.thread.firstPost.summary.replace(regex, '')
            : this.i18n.t('profile.thethemewasdeleted');
          return `${user} ${this.i18n.t('profile.givearewardforyourtheme')} ${thread}`;
        }
        case 41: {
          // 打赏支出
          const regex = /(<([^>]+)>)/gi;
          const thread = item.order.thread
            ? item.order.thread.firstPost.summary.replace(regex, '')
            : this.i18n.t('profile.thethemewasdeleted');
          return `${this.i18n.t('profile.givearewardforthetheme')} ${thread}`;
        }
        case 60: {
          // 付费主题收入
          const user = item.order.user
            ? item.order.user.username
            : this.i18n.t('profile.theuserwasdeleted');
          const regex = /(<([^>]+)>)/gi;
          const thread = item.order.thread
            ? item.order.thread.firstPost.summary.replace(regex, '')
            : this.i18n.t('profile.givearewardforthetheme');
          return `${user} ${this.i18n.t('profile.paidtoseeyourtheme')} ${thread}`;
        }
        case 61: {
          // 付费主题支出
          const regex = /(<([^>]+)>)/gi;
          const thread = item.order.thread
            ? item.order.thread.firstPost.summary.replace(regex, '')
            : this.i18n.t('profile.thethemewasdeleted');
          return `${this.i18n.t('profile.paidtoview')} ${thread}`;
        }
        default:
          return item.change_desc;
      }
    },
    toTopic(data) {
      if (!data.order || !data.order.thread) {
        return;
      }
      uni.navigateTo({
        url: `/pages/topic/index?id=${data.order.thread._jv.id}`,
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

.walletlist /deep/ {
  min-height: auto;
  .cell-item {
    padding-right: 40rpx;
  }
  .cell-item__body {
    height: auto;
    padding: 35rpx 0;
  }
  .walletlist-items /deep/ .cell-item__body {
    align-items: flex-start;
  }
  .cell-item__body__right-text {
    font-weight: bold;
  }
  .icon-screen {
    margin-left: 20rpx;
  }
  .walletlist-head {
    position: relative;
    padding: 40rpx 0 0 40rpx;
    /* #ifdef H5 */
    padding-top: 90rpx;
    /* #endif */
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .walletlist-head .cell-item__body {
    height: 78rpx;
  }
  .cell-item.fail .cell-item__body__right-text {
    color: --color(--qui-RED);
  }
  .cell-item.success .cell-item__body__right-text {
    color: #189a00;
  }
  .walletlist-items {
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
