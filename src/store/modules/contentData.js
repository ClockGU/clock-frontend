import {
  // eslint-disable-next-line no-unused-vars
  groupByContract,
  indexOfByMonthYear,
  indexOfByStarted,
  sortByMonthYear,
  sortByStartDate,
  sortByStarted
} from "@/utils";
import Vue from "vue";
import { ShiftService } from "@/services/models";

const state = {
  contentData: {},
  contentDataInitialized: false
};

const getters = {
  contentDataInitialized: (state) => state.contentDataInitialized,
  contractById: (state) => (id) => {
    return state.contentData[id].contract;
  },
  selectedShifts(state, getters, rootState, rootGetters) {
    try {
      const selectedContractId =
        rootGetters["selectedContract/selectedContract"].id;
      return state.contentData[selectedContractId].shifts;
    } catch (err) {
      return undefined;
    }
  },
  selectedReports(state, getters, rootState, rootGetters) {
    try {
      const selectedContractId =
        rootGetters["selectedContract/selectedContract"].id;
      return state.contentData[selectedContractId].reports;
    } catch (err) {
      return undefined;
    }
  },
  allShifts(state) {
    let shiftArray = [];
    for (let data of Object.values(state.contentData)) {
      shiftArray.push(...data.shifts);
    }
    return sortByStarted(shiftArray);
  },
  allReports(state) {
    let reportArray = [];
    for (let data of Object.values(state.contentData)) {
      reportArray.push(...data.reports);
    }
    return sortByMonthYear(reportArray);
  },
  allContracts(state) {
    let contractArray = [];
    for (let data of Object.values(state.contentData)) {
      contractArray.push(data.contract);
    }
    return sortByStartDate(contractArray);
  }
};

const mutations = {
  // eslint-disable-next-line no-unused-vars
  setupContentData(state, { contractData, shiftData, reportData }) {
    const groupedShifts = groupByContract(shiftData);
    const groupedReports = groupByContract(reportData);
    try {
      for (let contractInstance of contractData) {
        let data = { contract: null, shifts: [], reports: [] };
        const contractID = contractInstance.id;
        const shiftsOfContract = groupedShifts[contractID] ?? [];
        const reportsOfContract = groupedReports[contractID] ?? [];
        Vue.set(state.contentData, contractID, data);
        this.commit("contentData/setContract", {
          contractID,
          contractInstance
        });
        this.commit("contentData/setShifts", {
          contractID: contractID,
          shiftData: shiftsOfContract
        });
        this.commit("contentData/setReports", {
          contractID,
          reportData: reportsOfContract
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
  removeContract(state, { contractID }) {
    Vue.delete(state.contentData, contractID);
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
    const index = state.contentData[contractID].shifts.findIndex(
      (shiftElement) => shiftElement.id === shiftInstance.id
    );
    state.contentData[contractID].shifts.splice(index, 1);
  },
  updateShift(state, { contractID, shiftInstance }) {
    const currentIndex = state.contentData[contractID].shifts.findIndex(
      (shiftElement) => shiftElement.id === shiftInstance.id
    );
    const supposedIndex = indexOfByStarted({
      element: shiftInstance,
      array: state.contentData[contractID].shifts
    });
    if (currentIndex !== supposedIndex) {
      // delete the shift at the old, now incorrect position
      state.contentData[contractID].shifts.splice(currentIndex, 1);
      // add the shift, at the correct position
      state.contentData[contractID].shifts.splice(
        supposedIndex,
        0,
        shiftInstance
      );
      return;
    }

    state.contentData[contractID].shifts.splice(currentIndex, 1, shiftInstance);
  },
  switchShiftContract(state, { oldContractID, newContractID, shiftInstance }) {
    this.commit("contentData/removeShift", {
      contractID: oldContractID,
      shiftInstance: shiftInstance
    });
    this.commit("contentData/addShift", {
      contractID: newContractID,
      shiftInstance: shiftInstance
    });
  },
  addReport(state, { contractID, reportInstance }) {
    const index = indexOfByMonthYear({
      element: reportInstance,
      array: state.contentData[contractID].reports
    });
    state.contentData[contractID].reports.splice(index + 1, 0, reportInstance);
  },
  removeReport(state, { contractID, reportInstance }) {
    const index = state.contentData[contractID].reports.findIndex(
      (reportElement) => reportElement.id === reportInstance.id
    );
    state.contentData[contractID].reports.splice(index, 1);
  },
  updateReport(state, { contractID, reportInstance }) {
    const currentIndex = state.contentData[contractID].reports.findIndex(
      (shiftElement) => shiftElement.id === reportInstance.id
    );
    const supposedIndex = indexOfByMonthYear({
      element: reportInstance,
      array: state.contentData[contractID].reports
    });
    if (currentIndex !== supposedIndex) {
      // delete the shift at the old, now incorrect position
      state.contentData[contractID].reports.splice(currentIndex, 1);
      // add the shift, at the correct position
      state.contentData[contractID].reports.splice(
        supposedIndex,
        0,
        reportInstance
      );
      return;
    }
    state.contentData[contractID].reports.splice(
      currentIndex,
      1,
      reportInstance
    );
  },
  setShifts(state, { contractID, shiftData }) {
    Vue.set(state.contentData[contractID], "shifts", sortByStarted(shiftData));
  },
  setReports(state, { contractID, reportData }) {
    Vue.set(
      state.contentData[contractID],
      "reports",
      sortByMonthYear(reportData)
    );
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
  },
  async updateContractsShifts({ commit }, contractID) {
    const data = await ShiftService.filterList(`?contract=${contractID}`);
    data.forEach((item) => {
      commit("updateShift", { contractID, shiftInstance: item });
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
