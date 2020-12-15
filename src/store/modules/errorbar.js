const defaultState = {
  snack: null,
  timeout: 5000,
  color: "success"
};

const state = {
  errorbar: {
    ...defaultState
  }
};

const getters = {
  snack: (status) => status.errorbar.snack
};

const actions = {
  setSnack({ commit }, payload) {
    commit("setSnack", payload);

    return Promise.resolve();
  },
  resetSnack({ commit }) {
    commit("resetSnack");
  }
};

const mutations = {
  setSnack(state, payload) {
    state.errorbar = { ...state.errorbar, ...payload };
  },
  resetSnack(state) {
    state.errorbar = defaultState;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
