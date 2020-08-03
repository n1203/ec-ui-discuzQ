import { THEME_DEFAULT } from '@/common/const';

module.exports = {
  data() {
    return {
      theme: this.$u.currentTheme,
      loaded: false,
      appLoadedStatus: false,
    };
  },
  onLoad() {
    const app = getApp();
    this.themeChanged(this.$u.currentTheme);
    app.globalData.watchThemeChange(this.themeChanged);

    // getRect挂载到$u上，因为这方法需要使用in(this)，所以无法把它独立成一个单独的文件导出
    this.$u.getRect = this.$uGetRect;
  },
  methods: {
    // 查询节点信息
    $uGetRect(selector, all) {
      return new Promise(resolve => {
        uni
          .createSelectorQuery()
          .in(this)
          [all ? 'selectAll' : 'select'](selector)
          .boundingClientRect(rect => {
            if (all && Array.isArray(rect) && rect.length) {
              resolve(rect);
            }
            if (!all && rect) {
              resolve(rect);
            }
          })
          .exec();
      });
    },

    // 更改主题
    themeChanged(theme) {
      if (this.theme !== theme) {
        this.theme = theme;
      }
      uni.setNavigationBarColor({
        frontColor: theme === THEME_DEFAULT ? '#000000' : '#ffffff',
        backgroundColor: theme === THEME_DEFAULT ? '#ffffff' : '#2e2f30',
      });
    },
  },
  onUnload() {
    getApp().globalData.unWatchThemeChange(this.themeChanged);
  },
};
