const state = {
  selectedContract: undefined
};

const getters = {
  selectedContract: (state) => state.selectedContract
};

const actions = {
  selectContract({ commit }, payload) {
    commit("setSelectedContract", payload);
  },
  clearSelectedContract({ commit }) {
    commit("unsetSelectedContract");
  }
};

const mutations = {
  setSelectedContract(state, payload) {
    state.selectedContract = payload;
  },
  unsetSelectedContract(state) {
    state.selectedContract = undefined;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
