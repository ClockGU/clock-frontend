import Vue from "vue";
import Vuex from "vuex";
import { getField, updateField } from "vuex-map-fields";
// import createPersistedState from "vuex-persistedstate";

import auth from "@/store/modules/auth";
import calendar from "@/store/modules/calendar";
import shift from "@/store/modules/shift";
import contract from "@/store/modules/contract";
import snackbar from "@/store/modules/snackbar";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingData: true,
    user: {
      first_name: ""
    },
    selectedContract: null
  },
  getters: {
    getField
  },
  actions: {
    startLoading({ commit }) {
      commit("startLoading");
    },
    stopLoading({ commit }) {
      commit("stopLoading");
    },
    setContract({ commit }, payload) {
      commit("setContract", payload);
    },
    setUser({ commit }, payload) {
      commit("setUser", payload);
    }
  },
  mutations: {
    updateField,
    startLoading(state) {
      state.loadingData = true;
    },
    stopLoading(state) {
      state.loadingData = false;
    },
    setContract(state, payload) {
      state.selectedContract = payload;
    },
    setUser(state, payload) {
      state.user = { ...payload };
    }
  },
  modules: {
    auth,
    calendar,
    shift,
    contract,
    snackbar
  }
  // plugins: [createPersistedState()]
});
