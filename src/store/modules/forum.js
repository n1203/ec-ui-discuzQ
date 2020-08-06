const SET_FORUM_ERROR = 'SET_FORUM_ERROR';

const state = {
  error: {
    loading: true,
  },
};

const actions = {
  setError(context, payload) {
    context.commit(SET_FORUM_ERROR, payload);
  },
};

const mutations = {
  [SET_FORUM_ERROR](state, payload) {
    state.error = payload || {};
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
