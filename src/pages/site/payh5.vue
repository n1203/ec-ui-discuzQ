<template>
  <qui-page :data-qui-theme="theme"></qui-page>
</template>
<script>
export default {
  data() {
    return {
      state: true,
    };
  },
  onShow() {
    const params = {
      include: 'groups,wechat',
    };
    const userId = this.$store.getters['session/get']('userId');
    this.$store.dispatch('jv/get', [`users/${userId}`, { params }]).then(res => {
      uni.showToast({
        title: `${res.paid}支付状态`,
        duration: 3000,
      });
      if (res.paid) {
        window.location.href = '/pages/home/index';
      } else {
        window.location.href = '/pages/site/info';
      }
    });
  },
};
</script>
