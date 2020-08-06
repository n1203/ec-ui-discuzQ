/* eslint-disable-next-line no-param-reassign */
import { SET_FOOTERINDEX } from '@/store/types/footerTab';

const state = {
  footerIndex: 0,
};

const actions = {};

const mutations = {
  [SET_FOOTERINDEX](state, payload) {
    if (payload !== '') state.footerIndex = payload;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
