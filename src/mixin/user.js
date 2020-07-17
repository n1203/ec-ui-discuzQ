import { STORGE_GET_USER_TIME } from '@/common/const';

module.exports = {
  computed: {
    user() {
      const userId = this.$store.getters['session/get']('userId');
      if (userId) {
        return this.$store.getters['jv/get'](`users/${userId}`);
      }
      return {};
    },
  },
  methods: {
    /**
     * 获取用户信息
     * @param {boolean} isNow 是否立刻更新请求
     */
    getUserInfo(isNow = false) {
      const now = new Date().getTime();
      const old = uni.getStorageSync(STORGE_GET_USER_TIME);
      // 立即 | 限定 1 分钟进入消息页后会重新请求用户数据，更新红点（避免请求多次）
      if (isNow || (now - old) / 1000 > 60) {
        const params = {
          include: 'groups,wechat',
        };
        const userId = this.$store.getters['session/get']('userId');
        this.$store.commit('jv/deleteRecord', { _jv: { type: 'users', id: userId } });
        this.$store
          .dispatch('jv/get', [`users/${userId}`, { params }])
          .then(() => uni.$emit('updateNotiNum'));
        uni.setStorageSync(STORGE_GET_USER_TIME, new Date().getTime());
      }
    },
    logind() {
      const userId = this.$store.getters['session/get']('userId');
      if (!userId) return;
      this.$store.dispatch('jv/get', [
        'forum',
        {
          params: {
            include: 'users',
          },
        },
      ]);

      const params = {
        include: 'groups,wechat',
      };

      this.$store.dispatch('jv/get', [`users/${userId}`, { params }]).then(val => {
        this.$u.event.$emit('logind', val);
      });
      this.$store.dispatch('forum/setError', { loading: false });
    },
  },
};
