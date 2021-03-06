import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import AuthService from "@/services/auth";

import auth from "@/store/modules/auth";
import clock from "@/store/modules/clock";
import shift from "@/store/modules/shift";
import contract from "@/store/modules/contract";
import snackbar from "@/store/modules/snackbar";
import report from "@/store/modules/report";

import i18n, { selectedLocale } from "@/plugins/i18n";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingData: true,
    locale: selectedLocale,
    user: {
      first_name: ""
    },
    selectedContract: null,
    backendOffline: false,
    userLoading: false
  },
  getters: {
    selectedContract: (state) => state.selectedContract,
    user: (state) => state.user,
    userLoading: (state) => state.userLoading
  },
  actions: {
    changeLocale({ commit }, locale) {
      i18n.locale = locale;
      commit("updateLocale", locale);
    },
    toggleBackend({ commit }) {
      commit("toggleBackend");
    },
    GET_USER({ commit, dispatch, state }) {
      state.userLoading = true;
      return AuthService.getUser()
        .then((response) => {
          commit("SET_USER", response.data);
          dispatch("changeLocale", response.data.language);

          return Promise.resolve(response);
        })
        .finally(() => {
          state.userLoading = false;
        });
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
    updateLocale(state, locale) {
      state.locale = locale;
    },
    SET_USER(state, payload) {
      state.user = payload;
    },
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
  plugins: [
    createPersistedState({
      key: "clock1.0",
      paths: ["auth.accessToken", "auth.refreshToken", "locale"]
    })
  ]
});
