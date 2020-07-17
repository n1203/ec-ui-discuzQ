<template>
  <qui-page :data-qui-theme="theme">
    <!-- #ifdef H5-->
    <qui-header-back :title="navTitle"></qui-header-back>
    <!-- #endif -->
    <view class="notification-box">
      <!-- 通知信息 -->
      <scroll-view
        scroll-y="true"
        @scrolltolower="pullDown"
        show-scrollbar="false"
        show-icon="true"
        class="scroll-y"
        style="height: 100vh;"
      >
        <qui-notification :list="noticeList" @deleteNotice="deleteNotice"></qui-notification>
        <qui-load-more
          :status="loadingType"
          v-if="noticeList && noticeList.length > 0"
        ></qui-load-more>
      </scroll-view>
    </view>
  </qui-page>
</template>

<script>
import { time2MorningOrAfternoon } from '@/utils/time';

export default {
  data() {
    return {
      navTitle: '', // 导航栏标题
      loadingType: 'more', // 上拉加载状态
      pageSize: 20, // 每页20条数据
      pageNum: 1, // 当前页数
      noticeList: [], // 通知列表
      type: '', // 当前的通知类型
    };
  },
  onLoad(params) {
    console.log('通知列表的params：', params);
    const { title, type, unReadNum } = params;
    this.type = type;
    this.navTitle = title;
    if (parseInt(unReadNum, 10) > 0) {
      this.navTitle = `${title}(${unReadNum}条)`;
    }
    uni.setNavigationBarTitle({
      title: this.navTitle,
    });
    this.getNotices(type);
  },
  methods: {
    // 根据type的类型发送不同的通知请求
    getNotices(type) {
      const params = {
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[type]': type,
      };
      this.$store.commit('jv/clearRecords', { _jv: { type: 'notification' } });
      this.$store.dispatch('jv/get', ['notification', { params }]).then(res => {
        console.log('通知列表res', res);
        if (res && res._jv) {
          delete res._jv;
          for (let i = 0; i < res.length; i += 1) {
            res[i].username = res[i].user_name;
            res[i].avatarUrl = res[i].user_avatar;
            if (res[i].created_at) {
              res[i].time = time2MorningOrAfternoon(res[i].created_at);
            }
            if (res[i].thread_created_at) {
              res[i].thread_time = time2MorningOrAfternoon(res[i].thread_created_at);
            }
            if (res[i].reply_post_created_at) {
              res[i].reply_time = time2MorningOrAfternoon(res[i].reply_post_created_at);
            }
            if (res[i].type === 'rewarded' && res[i].amount) {
              res[i].money = `￥${res[i].amount}`;
            }
            if (res[i].type === 'withdrawal' && res[i].cash_actual_amount) {
              res[i].money = `-￥${res[i].cash_actual_amount}`;
            }
          }
          this.noticeList = [...this.noticeList, ...res];
          console.log('this.noticeList', this.noticeList);
          this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
          uni.$emit('notiRead');
        }
      });
    },
    // 上拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.getNotices(this.type);
      console.log('页码', this.pageNum);
    },
    // 删除通知
    deleteNotice(id) {
      this.$store.dispatch('jv/delete', `notification/${id}`).then(res => {
        console.log('删除成功', res);
        if (res) {
          this.pageNum = 1;
          this.noticeList = [];
          this.getNotices(this.type);
          uni.showToast({
            title: '删除成功',
            duration: 2000,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.notification-box {
  /* #ifdef H5 */
  margin: 44px 0rpx 0rpx;
  /* #endif */
  color: --color(--qui-FC-333);
  background-color: --color(--qui-BG-1);
  transition: $switch-theme-time;
}
</style>
