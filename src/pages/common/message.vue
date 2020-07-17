<template>
  <qui-page :data-qui-theme="theme">
    <qui-page-message :type="status"></qui-page-message>
  </qui-page>
</template>

<script>
const TYPE_404 = '404';
export default {
  data() {
    return {
      status: '', // success, fail, 404
    };
  },
  onLoad(params) {
    // #ifdef MP-WEIXIN
    uni.hideHomeButton();
    // #endif
    const { status } = params;
    if (!status) this.status = TYPE_404;
    else this.status = status;
  },
};
</script>
