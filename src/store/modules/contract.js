import { getField, updateField } from "vuex-map-fields";
import ContractService from "@/services/contract.service";

const state = {
  contracts: []
};

const getters = {
  getField
};

const mutations = {
  updateField,
  setContracts(state, payload) {
    state.contracts = payload;
  }
};

const actions = {
  setContracts({ commit }, payload) {
    commit("setContracts", payload);
  },
  async queryContracts({ commit }) {
    const contracts = await ContractService.list();

    commit("setContracts", contracts.data);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
