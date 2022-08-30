const state = {
  contentData: {},
  contentDataInitialized: false
};

const getters = {
  selectedShifts({ state, rootGetters }) {
    const selectedContractId = rootGetters["contract/selectedContract"].id;
    return state.contentData[selectedContractId].shifts;
  },
  selectedReports({ state, rootGetters }) {
    const selectedContractId = rootGetters["contract/selectedContract"].id;
    return state.contentData[selectedContractId].reports;
  }
};

const mutations = {};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
