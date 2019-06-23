import Vue from "vue";
import Vuex from "vuex";
import { getField, updateField } from "vuex-map-fields";
import createPersistedState from "vuex-persistedstate";

import auth from "@/store/modules/auth";
import calendar from "@/store/modules/calendar";
import shift from "@/store/modules/shift";
import contract from "@/store/modules/contract";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {
    getField
  },
  mutations: {
    updateField
  },
  modules: {
    auth,
    calendar,
    shift,
    contract
  },
  plugins: [createPersistedState()]
});
