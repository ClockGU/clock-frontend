import { groupByContract } from "@/utils";
import Vue from "vue";

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

const mutations = {
  setupContentData({ state, commit }, contractData, shiftData, reportData) {
    const groupedShifts = groupByContract(shiftData);
    const groupedReports = groupByContract(reportData);
    try {
      for (let contract in contractData) {
        let data = { contract: null, shifts: [], reports: [] };
        Vue.set(state.contentData, contract.id, data);
        commit("contentData/setContract", contract.id, contract);
        commit(
          "contentData/setShifts",
          contract.id,
          groupedShifts[contract.id]
        );
        commit(
          "contentData/setReports",
          contract.id,
          groupedReports[contract.id]
        );
      }
    } catch (e) {
      throw Error(e.message);
    }
    commit("contentData/setContentDataInitialized");
  },
  clearContentData({ state, commit }) {
    state.contentData = {};
    commit("contentData/unsetContentDataInitialized");
  },
  setContentDataInitialized(state) {
    state.contentDataInitialized = true;
  },
  unsetContentDataInitialized(state) {
    state.contentDataInitialized = false;
  },
  addContract(state, contractInstance) {
    const data = { contract: contractInstance, shifts: [], reports: [] };
    Vue.set(state.contentData, contractInstance.id, data);
  },
  removeContract(state, contractInstance) {
    delete state.contentData[contractInstance.id];
  },
  setShifts(state, contractID, shiftData) {
    Vue.set(state.contentData[contractID], "shifts", shiftData);
  },
  setReports(state, contractID, reportData) {
    Vue.set(state.contentData[contractID], "reports", reportData);
  },
  setContract(state, contractID, contractInstance) {
    Vue.set(state.contentData[contractID], "contract", contractInstance);
  }
};

const actions = {
  setup({ commit }, contractData, shiftData, reportData) {
    commit("setupContentData", contractData, shiftData, reportData);
  },
  clearContentData({ commit }) {
    commit("clearContentData");
  },
  addNewContract({ commit }, contractInstance) {
    commit("addNewContract", contractInstance);
  },
  removeContract({ commit }, contractInstance) {
    commit("removeContract", contractInstance);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
