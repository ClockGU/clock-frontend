import { getField, updateField } from "vuex-map-fields";

const state = {
  shifts: []
};

const getters = {
  getField
};

const mutations = {
  updateField,
  setShifts(state, payload) {
    state.shifts = payload;
  }
};

const actions = {
  setShifts({ commit }, payload) {
    commit("setShifts", payload);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
