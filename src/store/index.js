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
    loadingData: true
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
    }
  },
  mutations: {
    updateField,
    startLoading(state) {
      state.loadingData = true;
    },
    stopLoading(state) {
      state.loadingData = false;
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
