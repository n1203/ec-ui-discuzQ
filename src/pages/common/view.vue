<template>
  <view>
    <qui-page>
      <web-view :webview-styles="webviewStyles" :src="url"></web-view>
    </qui-page>
  </view>
</template>
<script>
export default {
  data() {
    return {
      url: '',
      webviewStyles: {
        progress: {
          color: '#FF3333',
        },
      },
    };
  },
  onLoad(params) {
    this.url = params.url ? decodeURIComponent(params.url) : '';
  },
};
</script>
