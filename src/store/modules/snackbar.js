const defaultState = {
  snack: null,
  timeout: 5000,
  color: "success"
};

const state = {
  snackbar: {
    ...defaultState
  }
};

const getters = {
  snack: (status) => status.snackbar.snack
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
    state.snackbar = { ...state.snackbar, ...payload };
  },
  resetSnack(state) {
    state.snackbar = defaultState;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
