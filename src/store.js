import Vue from "vue";
import Vuex from "vuex";
import { getField, updateField } from "vuex-map-fields";

import uuid from "uuid/v4";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    shifts: [],
    calendar: {
      date: new Date(),
      type: "month",
      locale: "en-us"
    }
  },
  getters: {
    start: state => {
      return state.calendar.date.toISOString().slice(0, 10);
    },
    type: state => {
      return state.calendar.type;
    },
    locale: state => {
      return state.calendar.locale;
    },
    getField
  },
  mutations: {
    addShift(state, shift) {
      shift.uuid = uuid();
      state.shifts.push(shift);
    },
    setCalendarDate(state, date) {
      Vue.set(state.calendar, "date", date);
    },
    setCalendarType(state, type) {
      Vue.set(state.calendar, "type", type);
    },
    updateField
  },
  actions: {
    addShift({ commit }, shift) {
      commit("addShift", shift);
    },
    setCalendarDate({ commit }, date) {
      commit("setCalendarDate", date);
    },
    setCalendarType({ commit }, type) {
      commit("setCalendarType", type);
    }
  }
});
