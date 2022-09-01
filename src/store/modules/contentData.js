import { groupByContract } from "@/utils";
import Vue from "vue";
import gdprCardText from "@/components/gdpr/agreement-components/GdprCardText";

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
        data.contract = contract;
        data.shifts = groupedShifts[contract.id];
        data.reports = groupedReports[contract.id];
        Vue.set(state.contentData, contract.id, data);
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
  addNewContract(state, contractInstance) {}
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
