import ReportService from "@/services/report";
import { handleApiError } from "@/utils/interceptors";

const state = {
  reports: [],
  status: "idle"
};

const getters = {
  loading: state => state.status === "loading",
  reports: state => state.reports
};

const mutations = {
  delete(state, payload) {
    state.reports = state.reports.filter(report => report.uuid !== payload);
  },
  set(state, payload) {
    state.reports = payload;
  }
};

const actions = {
  delete({ commit }, payload) {
    commit("delete", payload);
  },
  set({ commit }, payload) {
    commit("set", payload);
  },
  async list({ commit }) {
    state.status = "loading";
    return ReportService.list()
      .then(response => {
        commit("set", response.data);

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
