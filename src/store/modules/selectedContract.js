import { getContractWithLastActivity } from "@/utils/index";

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
  },
  // action to auto select contract based on last shift activity or most recently modified contract
  autoSelectContract({ commit, state, rootGetters }) {
    const contracts = rootGetters["contentData/allContracts"];
    const shifts = rootGetters["contentData/allShifts"];
    if (!contracts || contracts.length === 0) return;
    // get contract with last shift activity  or most recently modified contract
    const contract = getContractWithLastActivity({
      contracts,
      shifts
    });

    if (!contract || state.selectedContract?.id === contract.id) return;
    commit("setSelectedContract", contract);
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
