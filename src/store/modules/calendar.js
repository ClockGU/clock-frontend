import Vue from "vue";
import { getField, updateField } from "vuex-map-fields";

const state = {
  date: new Date(),
  type: "month",
  locale: "en-us"
};

const getters = {
  start: state => {
    return state.date.toISOString().slice(0, 10);
  },
  locale: state => {
    return state.locale;
  },
  getField
};

const mutations = {
  setDate(state, date) {
    Vue.set(state, "date", date);
  },
  setType(state, type) {
    Vue.set(state, "type", type);
  },
  updateField
};

const actions = {
  setDate({ commit }, date) {
    commit("setDate", date);
  },
  setType({ commit }, type) {
    commit("setType", type);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
