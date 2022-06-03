import ContractService from "@/services/contract";

const state = {
  contracts: [],
  status: "idle",
  selectedContract: { uuid: undefined, worktime: "00:00" }
};

const getters = {
  contracts: (state) => state.contracts,
  loading: (state) => state.status === "loading",
  selectedContract: (state) => state.selectedContract,
  selectedContracUUID: (state) => state.selectedContract.uuid,
  selectContractWorktime: (state) => state.selectedContract.worktime
};

const actions = {
  addContract({ commit }, payload) {
    commit("addContract", payload);
  },
  updateContract({ commit }, payload) {
    commit("updateContract", payload);
  },
  deleteContract({ commit }, payload) {
    commit("deleteContract", payload);
  },
  setContracts({ commit }, payload) {
    commit("setContracts", payload);
  },
  async queryContracts({ commit }) {
    state.status = "loading";
    try {
      const response = await ContractService.list();
      commit("setContracts", response.data);

      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      state.status = "idle";
    }
  },
  selectContract({ commit }, payload) {
    commit("setSelectedContract", payload);
  },
  clearSelectedContract({ commit }) {
    commit("unsetSelectedContract");
  }
};

const mutations = {
  addContract(state, payload) {
    state.contracts.push(payload);
  },
  updateContract(state, payload) {
    state.contracts = [
      ...state.contracts.filter((contract) => contract.uuid !== payload.uuid),
      payload
    ];
  },
  deleteContract(state, payload) {
    state.contracts = state.contracts.filter(
      (contract) => contract.uuid !== payload
    );
  },
  setContracts(state, payload) {
    state.contracts = payload;
  },
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
