import { groupByContract, indexOfByMonthYear, indexOfByStarted } from "@/utils";
import Vue from "vue";

const state = {
  contentData: {},
  contentDataInitialized: false
};

const getters = {
  contentDataInitialized: (state) => state.contentDataInitialized,
  selectedShifts(state, getters, rootState, rootGetters) {
    const selectedContractId = rootGetters["contract/selectedContract"].id;
    return state.contentData[selectedContractId].shifts;
  },
  selectedReports(state, rootGetters) {
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
  setupContentData(state, { contractData, shiftData, reportData }) {
    const groupedShifts = groupByContract(shiftData);
    const groupedReports = groupByContract(reportData);
    try {
      for (let contractInstance of contractData) {
        let data = { contract: null, shifts: [], reports: [] };
        const contractID = contractInstance.id;
        const shiftData = groupedShifts[contractID];
        const reportData = groupedReports[contractID];
        Vue.set(state.contentData, contractInstance.id, data);
        this.commit("contentData/setContract", {
          contractID,
          contractInstance
        });
        this.commit("contentData/setShifts", {
          contractID,
          shiftData
        });
        this.commit("contentData/setReports", {
          contractID,
          reportData
        });
      }
    } catch (e) {
      throw Error(e.message);
    }
    this.commit("contentData/setContentDataInitialized");
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
  updateContract(state, { contractID, contractInstance }) {
    Vue.set(state.contentData[contractID], "contract", contractInstance);
  },
  addShift(state, { contractID, shiftInstance }) {
    const index = indexOfByStarted({
      element: shiftInstance,
      array: state.contentData[contractID].shifts
    });
    state.contentData[contractID].shifts.splice(index + 1, 0, shiftInstance);
  },
  removeShift(state, { contractID, shiftInstance }) {
    state.contentData[contractID].shifts.pop(shiftInstance);
  },
  updateShift(state, { contractID, shiftInstance }) {
    const index = state.contentData[contractID].shifts.find(
      (shiftElement) => shiftElement.id === shiftInstance.id
    );
    state.contentData[contractID].shifts[index] = shiftInstance;
  },
  addReport(state, { contractID, reportInstance }) {
    const index = indexOfByMonthYear({
      element: reportInstance,
      array: state.contentData[contractID].reports
    });
    state.contentData[contractID].reports.splice(index + 1, 0, reportInstance);
  },
  removeReport(state, { contractID, reportInstance }) {
    state.contentData[contractID].reports.pop(reportInstance);
  },
  updateReport(state, { contractID, reportInstance }) {
    const index = state.contentData[contractID].reports.find(
      (shiftElement) => shiftElement.id === reportInstance.id
    );
    state.contentData[contractID].reports[index] = reportInstance;
  },
  setShifts(state, { contractID, shiftData }) {
    Vue.set(state.contentData[contractID], "shifts", shiftData);
  },
  setReports(state, { contractID, reportData }) {
    Vue.set(state.contentData[contractID], "reports", reportData);
  },
  setContract(state, { contractID, contractInstance }) {
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
