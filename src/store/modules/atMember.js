/* eslint-disable-next-line no-param-reassign */
import { SET_ATMEMBER } from '@/store/types/atMember';

const state = {
  atMemberData: [],
};

const actions = {};

const mutations = {
  [SET_ATMEMBER](state, payload) {
    if (payload) state.atMemberData = payload;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
