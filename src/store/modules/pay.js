/* eslint-disable-next-line no-param-reassign */
import { SET_ROUTER } from '@/store/types/pay';

const state = {};

const actions = {};

const mutations = {
  [SET_ROUTER](state, setRouter) {
    state.model = setRouter;
    console.log(state.model, '这是存储起来的路由');
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
