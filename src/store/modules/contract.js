import ContractService from "@/services/contract";

const state = {
  contracts: [],
  status: "idle"
};

const getters = {
  contracts: state => state.contracts,
  loading: state => state.status === "loading"
};

const mutations = {
  addContract(state, payload) {
    state.contracts.push(payload);
  },
  updateContract(state, payload) {
    state.contracts = [
      ...state.contracts.filter(contract => contract.uuid !== payload.uuid),
      payload
    ];
  },
  deleteContract(state, payload) {
    state.contracts = state.contracts.filter(
      contract => contract.uuid !== payload
    );
  },
  setContracts(state, payload) {
    state.contracts = payload;
  }
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
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
