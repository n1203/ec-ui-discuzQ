<template>
  <qui-page :data-qui-theme="theme"></qui-page>
</template>
<script>
let payPhone = null;

export default {
  data() {
    return {
      userId: uni.getStorageSync('user_id') || 0,
    };
  },
  onLoad() {
    this.refresh();
    // 输入密码错误的情况
    payPhone = setInterval(() => {
      this.refresh();
    }, 3000);
  },
  onUnload() {
    clearInterval(payPhone);
  },
  methods: {
    refresh() {
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/site/info',
        });
      }, 1000);
      this.$u.event.$emit('refresh');
    },
  },
};
</script>
