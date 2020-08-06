import { status } from '@/library/jsonapi-vuex/index';

module.exports = {
  computed: {
    jvStatus() {
      return status.status;
    },
  },
};
