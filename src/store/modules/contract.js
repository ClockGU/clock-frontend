import ContractService from "@/services/contract";
import { handleApiError } from "@/utils/interceptors";

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
    return ContractService.list()
      .then(response => {
        commit("setContracts", response.data);

        return response.data;
      })
      .catch(handleApiError)
      .finally(() => {
        state.status = "idle";
      });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
