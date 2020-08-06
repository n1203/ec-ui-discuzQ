/* eslint-disable-next-line no-param-reassign */
import { SET_EMOJI } from '@/store/types/emoji';

const state = {
  emojis: [],
};

const actions = {};

const mutations = {
  [SET_EMOJI](state, payload) {
    if (payload) state.emojis = payload;
  },
};

const getters = {
  get: state => {
    return data => {
      return state[data];
    };
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
