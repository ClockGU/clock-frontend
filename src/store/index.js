import Vue from "vue";
import Vuex from "vuex";
import { getField, updateField } from "vuex-map-fields";

import uuid from "uuid/v4";

import calendar from "@/store/modules/calendar";
import shift from "@/store/modules/shift";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {
    getField
  },
  mutations: {
    addShift(state, shift) {
      shift.uuid = uuid();
      state.shifts.push(shift);
    },
    updateField
  },
  actions: {
    addShift({ commit }, shift) {
      commit("addShift", shift);
    }
  },
  modules: {
    calendar,
    shift
  }
});
