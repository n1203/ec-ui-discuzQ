<template>
  <qui-page :data-qui-theme="theme" class="shield">
    <!-- 用户搜索 -->
    <view class="search">
      <view class="search-box">
        <view class="search-box__content">
          <view class="icon-content-search">
            <qui-icon name="icon-search" size="30" color="#bbb"></qui-icon>
          </view>
          <input
            type="text"
            class="search-box__content-input"
            placeholder-class="input-placeholder"
            :placeholder="i18n.t('search.searchusers')"
            @input="searchInput"
            :value="searchValue"
          />
          <view @tap="cancelSearch" v-if="searchValue" class="search-box__content-delete">
            <qui-icon name="icon-close1" size="32" color="#ccc"></qui-icon>
          </view>
        </view>
        <view class="search-box__cancel" v-if="searchValue" @tap="cancelSearch">
          <text>{{ i18n.t('search.cancel') }}</text>
        </view>
      </view>
    </view>
    <!-- 用户屏蔽列表 -->
    <view class="shield-item" v-if="!searchValue">
      <scroll-view
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="shieldpullDown"
        show-scrollbar="false"
        class="scroll-y"
        v-if="shieldTotal"
      >
        <view class="shield-item__users" v-for="(item, index) in shieldList" :key="index">
          <qui-avatar
            class="shield-item__users__avatar"
            size="70"
            :user="item"
            :is-real="item.isReal"
          ></qui-avatar>
          <qui-cell-item class="shield-item__users__content" :title="item.username" slot-right>
            <view
              class="shield-item__users__operation"
              plain
              @tap="shieldUser(item.id, 'sheild')"
              v-if="unbundlingID(item.id)"
            >
              <text>{{ i18n.t('profile.shield') }}</text>
              <qui-icon
                name="icon-shieldUser"
                class="shield-item__users__icon"
                size="36"
                color="#FC8888"
              ></qui-icon>
            </view>
            <view class="shield-item__users__operation" plain @tap="unbundlingUser(item.id)" v-else>
              <text>{{ i18n.t('profile.unbundling') }}</text>
              <qui-icon
                name="icon-deleteUser"
                class="shield-item__users__icon"
                size="36"
                color="#777777"
              ></qui-icon>
            </view>
          </qui-cell-item>
        </view>
        <qui-load-more
          :status="sloadingType"
          :show-icon="false"
          v-if="sloadingType"
        ></qui-load-more>
      </scroll-view>
      <qui-no-data
        class="no-data"
        :tips="i18n.t('profile.noshield')"
        v-if="shieldTotal == 0"
      ></qui-no-data>
    </view>
    <!-- 用户搜索列表 -->
    <view class="shield-item" v-if="searchValue">
      <scroll-view
        scroll-y="true"
        scroll-with-animation="true"
        @scrolltolower="pullDownUsers"
        show-scrollbar="false"
        class="scroll-y"
      >
        <view class="shield-item__users" v-for="(item, index) in userList" :key="index">
          <qui-avatar
            class="shield-item__users__avatar"
            size="70"
            :user="item"
            :is-real="item.isReal"
          ></qui-avatar>
          <qui-cell-item
            class="shield-item__users__content"
            :title="item.username"
            :brief="item.groupName"
            slot-right
          >
            <view class="shield-item__users__operation" plain @tap="shieldUser(item.id, 'user')">
              <text>{{ i18n.t('profile.shield') }}</text>
              <qui-icon
                name="icon-shieldUser"
                class="shield-item__users__icon"
                size="36"
                color="#FC8888"
              ></qui-icon>
            </view>
          </qui-cell-item>
        </view>
        <qui-load-more
          :status="uloadingType"
          :show-icon="false"
          v-if="uloadingType"
        ></qui-load-more>
      </scroll-view>
    </view>
    <!-- 屏蔽用户提示 -->
    <uni-popup ref="popShield" type="center">
      <uni-popup-dialog
        type="warning"
        :before-close="true"
        :content="i18n.t('profile.shieldusersure')"
        @close="handleCancel"
        @confirm="handleOk"
      ></uni-popup-dialog>
    </uni-popup>
  </qui-page>
</template>

<script>
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';

export default {
  components: { uniPopupDialog },
  data() {
    return {
      searchValue: '', // 输入的用户名
      uloadingType: '',
      userList: [], // 用户数据
      uPageNum: 1, // 用户当前页数
      uPageSize: 15, // 用户每页显示条数
      uid: 0, // 用户id
      sloadingType: '',
      shieldList: [], // 屏蔽数据
      sPageNum: 1, // 屏蔽当前页数
      sPageSize: 10, // 屏蔽每页显示条数
      shieldTotal: null, // 屏蔽总条数
      unbundlingArry: [], // 解绑用户组
      unbundUserData: [], // 已屏蔽用户组
      shieldType: '', // 屏蔽类型 user 用户列表 sheild 黑名单
    };
  },
  onLoad() {
    this.getShieldList();
    this.getShieldData();
  },
  computed: {
    userId() {
      return this.$store.getters['session/get']('userId');
    },
  },
  methods: {
    // 搜索框输入
    searchInput(e) {
      this.searchValue = e.target.value;
      this.unbundlingArry = [];
      if (this.uTimeOut) clearTimeout(this.uTimeOut);
      this.uTimeOut = setTimeout(() => {
        this.userList = [];
        this.uPageNum = 1;
        this.getUserList(e.target.value);
      }, 250);
    },
    // 取消搜索用户
    cancelSearch() {
      this.searchValue = '';
      this.uPageNum = 1;
      this.getUserList('', 'clear');
      this.sPageNum = 1;
      this.shieldList = [];
      this.getShieldList();
    },
    // 获取黑名单数据
    getShieldData() {
      this.$store.dispatch('jv/get', `users/${this.userId}/deny`).then(res => {
        if (res._jv) {
          delete res._jv;
        }
        this.unbundUserData = [];
        this.unbundUserData.push(Number(this.userId));
        res.forEach((v, i) => {
          this.unbundUserData.push(res[i].id);
        });
      });
    },
    // 获取黑名单列表
    getShieldList() {
      this.sloadingType = 'loading';
      const params = {
        'page[limit]': this.sPageSize,
        'page[number]': this.sPageNum,
      };
      this.$store.dispatch('jv/get', [`users/${this.userId}/deny`, { params }]).then(res => {
        if (res._jv) {
          delete res._jv;
        }
        this.shieldList = [...this.shieldList, ...res];
        this.shieldTotal = this.shieldList.length;
        this.sloadingType = res.length === this.sPageSize ? 'more' : 'nomore';
      });
    },
    // 搜索用户列表
    getUserList(key, type) {
      this.loadingType = 'loading';
      const params = {
        include: 'groups',
        sort: 'createdAt',
        'page[number]': this.uPageNum,
        'page[limit]': this.uPageSize,
        'filter[username]': `*${key}*`,
      };
      this.$store.dispatch('jv/get', ['users', { params }]).then(res => {
        if (res._jv) {
          delete res._jv;
        }
        res.forEach((v, i) => {
          res[i].groupName = v.groups[0] ? v.groups[0].name : '';
        });
        this.uloadingType = res.length === this.uPageSize ? 'more' : 'nomore';
        // 过滤搜索用户中已屏蔽的用户和当前登录用户
        const data = res.filter(item => this.unbundUserData.indexOf(item.id) === -1);
        if (type && type === 'clear') {
          this.userList = data;
        } else {
          this.userList = [...this.userList, ...data];
        }
      });
    },
    // 黑名单下拉刷新
    shieldpullDown() {
      this.sPageNum += 1;
      this.getShieldList();
    },
    // 用户列表下拉刷新
    pullDownUsers() {
      if (this.uloadingType !== 'more') {
        return;
      }
      this.uPageNum += 1;
      this.getUserList(this.searchValue);
    },
    // 屏蔽用户
    shieldUser(uid, type) {
      this.uid = uid;
      this.shieldType = type;
      this.$refs.popShield.open();
    },
    handleCancel() {
      this.$refs.popShield.close();
    },
    handleOk() {
      this.$refs.popShield.close();
      const params = {
        _jv: {
          type: `users/${this.uid}/deny`,
        },
      };
      this.$store.dispatch('jv/post', params).then(() => {
        if (this.unbundlingID(this.uid)) {
          this.unbundlingArry.splice(
            this.unbundlingArry.findIndex(item => item === this.uid),
            1,
          );
        }
        if (this.shieldType && this.shieldType === 'user') {
          this.cancelSearch();
        } else {
          this.searchValue = '';
          this.uPageNum = 1;
          this.getUserList('', 'clear');
        }
        this.getShieldData();
      });
    },
    // 解绑用户
    unbundlingUser(uid) {
      this.$store.dispatch('jv/delete', `users/${uid}/deny`).then(() => {
        this.unbundlingArry.push(uid);
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('profile.unboundsucceed'),
        });
        this.getShieldData();
      });
    },
    // 判断是否已解绑某个用户
    unbundlingID(uid) {
      if (this.unbundlingArry && this.unbundlingArry.includes(uid)) {
        return true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

$backgroundColor: --color(--qui-BG-2);

/* #ifdef H5 */
$height: calc(100vh - 200rpx);
/* #endif */

/* #ifdef MP-WEIXIN */
$height: calc(100vh - 110rpx);
/* #endif */
// 搜索
.search-box {
  background-color: $backgroundColor;
}
// 屏蔽列表
.shield-item {
  background-color: $backgroundColor;
  border-bottom: 2rpx solid --color(--qui-BOR-ED);

  /deep/ .no-data {
    padding-top: 40rpx;
  }

  &__users {
    position: relative;
    padding: 0rpx 20rpx 0rpx 130rpx;

    &__avatar {
      position: absolute;
      top: 30rpx;
      left: 40rpx;
    }

    &__content {
      display: block;
      padding: 15rpx 0rpx;
    }

    &__operation {
      display: flex;
      align-items: center;
      margin-right: 30rpx;
      font-size: $fg-f28;
      color: --color(--qui-FC-777);
    }

    &__icon {
      margin-left: 15rpx;
    }
  }
}
/deep/ .cell-item__body__content-brief {
  color: --color(--qui-FC-DDD);
}
.scroll-y {
  max-height: $height;
}
</style>
