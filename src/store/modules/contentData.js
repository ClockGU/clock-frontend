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
  },
  allShifts(state) {
    let shiftArray = [];
    for (let data of Object.values(state.contentData)) {
      shiftArray.push(...data.shifts);
    }
    return shiftArray;
  },
  allReports(state) {
    let reportArray = [];
    for (let data of Object.values(state.contentData)) {
      reportArray.push(...data.reports);
    }
    return reportArray;
  },
  allContracts(state) {
    let contractArray = [];
    for (let data of Object.values(state.contentData)) {
      contractArray.push(data.contract);
    }
    return contractArray;
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
