import Vue from "vue";
import Vuex from "vuex";
import { getField, updateField } from "vuex-map-fields";

import { getToday } from "@/utils/date";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    calendar: {
      type: "month",
      start: getToday()
    }
  },
  getters: {
    getField
  },
  mutations: {
    setCalendarStart(state, data) {
      state.calendar.start = data;
    },
    updateField
  },
  actions: {
    setCalendarStart({ commit }, data) {
      commit("setCalendarStart", data);
    }
  }
});
