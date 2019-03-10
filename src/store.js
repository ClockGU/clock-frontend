import Vue from "vue";
import Vuex from "vuex";
import { getField, updateField } from "vuex-map-fields";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
    setCalendarDate(state, date) {
      Vue.set(state.calendar, "date", date);
    },
    setCalendarType(state, type) {
      Vue.set(state.calendar, "type", type);
    },
    updateField
  },
  actions: {
    setCalendarDate({ commit }, date) {
      commit("setCalendarDate", date);
    },
    setCalendarType({ commit }, type) {
      commit("setCalendarType", type);
    }
  }
});
