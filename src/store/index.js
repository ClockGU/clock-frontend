import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import auth from "@/store/modules/auth";
import clock from "@/store/modules/clock";
import shift from "@/store/modules/shift";
import contract from "@/store/modules/contract";
import snackbar from "@/store/modules/snackbar";
import report from "@/store/modules/report";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingData: true,
    user: {
      first_name: ""
    },
    selectedContract: null,
    backendOffline: false
  },
  getters: {
    selectedContract: state => state.selectedContract,
    user: state => state.user
  },
  actions: {
    toggleBackend({ commit }) {
      commit("toggleBackend");
    },
    startLoading({ commit }) {
      commit("startLoading");
    },
    stopLoading({ commit }) {
      commit("stopLoading");
    },
    setContract({ commit }, payload) {
      commit("setContract", payload);
    },
    unsetContract({ commit }) {
      commit("unsetContract");
    },
    setUser({ commit }, payload) {
      commit("setUser", payload);
    }
  },
  mutations: {
    toggleBackend(state) {
      state.backendOffline = !state.backendOffline;
    },
    startLoading(state) {
      state.loadingData = true;
    },
    stopLoading(state) {
      state.loadingData = false;
    },
    setContract(state, payload) {
      state.selectedContract = payload;
    },
    unsetContract(state) {
      state.selectedContract = null;
    },
    setUser(state, payload) {
      state.user = { ...payload };
    }
  },
  modules: {
    auth,
    clock,
    shift,
    contract,
    snackbar,
    report
  },
  plugins: [createPersistedState({ paths: ["auth", "selectedContract"] })]
});
