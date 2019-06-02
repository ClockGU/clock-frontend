import Vue from "vue";
import Vuex from "vuex";
import { getField, updateField } from "vuex-map-fields";

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
    calendar,
    shift,
    contract
  }
});
