<template>
  <qui-page :data-qui-theme="theme">
    <!-- #ifdef H5-->
    <qui-header-back title="" :is-show-more="false"></qui-header-back>
    <!-- #endif -->
    <view class="register-reason-box">
      <view class="register-reason-box-h">{{ i18n.t('user.registerReason') }}</view>
      <view class="register-reason-box-con">
        <input
          class="input"
          :placeholder="i18n.t('user.reason')"
          placeholder-style="color: #ddd"
          v-model="reason"
        />
      </view>
      <view class="register-reason-box-btn" @click="submit">
        {{ i18n.t('user.submit') }}
      </view>
    </view>
  </qui-page>
</template>

<script>
export default {
  data() {
    return {
      reason: '', // 注册原因
    };
  },
  computed: {
    // 获取当前登录的id
    currentLoginId() {
      const userId = this.$store.getters['session/get']('userId');
      console.log('获取当前登录的id', userId);
      return parseInt(userId, 10);
    },
  },
  methods: {
    submit() {
      if (this.reason === '') {
        this.showDialog('注册原因不能为空');
      } else {
        const params = {
          _jv: {
            type: `users/${this.currentLoginId}`,
          },
          data: {
            attributes: {
              register_reason: this.reason,
            },
          },
        };
        this.$store
          .dispatch('jv/patch', params)
          .then(res => {
            if (res) {
              console.log('修改注册原因', res);
              uni.showToast({
                title: '修改成功',
                duration: 2000,
                success() {
                  setTimeout(() => {
                    uni.navigateTo({
                      url: '/pages/home/index',
                    });
                  }, 1000);
                },
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
        this.clear();
      }
    },
    clear() {
      this.reason = '';
    },
    showDialog(title) {
      uni.showToast({
        icon: 'none',
        title,
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.register-reason-box {
  height: 100vh;
  /* #ifdef H5 */
  margin: 44px 0rpx 0rpx;
  /* #endif */
  font-size: $fg-f28;
  background-color: --color(--qui-BG-2);

  &-h {
    padding: 60rpx 0rpx 80rpx 40rpx;
    font-size: 50rpx;
    font-weight: bold;
    color: --color(--qui-FC-333);
  }

  &-con {
    margin: 0rpx 0rpx 0rpx 40rpx;

    .input {
      width: 100%;
      height: 100rpx;
      font-size: $fg-f34;
      line-height: 100rpx;
      text-align: left;
      border-bottom: 2rpx solid --color(--qui-BOR-ED);
    }
  }

  &-btn {
    width: 670rpx;
    height: 90rpx;
    margin: 50rpx auto 0rpx;
    line-height: 90rpx;
    color: --color(--qui-FC-FFF);
    text-align: center;
    background-color: --color(--qui-MAIN);
    border-radius: 5rpx;
  }
}
</style>
