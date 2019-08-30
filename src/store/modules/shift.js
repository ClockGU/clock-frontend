import { getField, updateField } from "vuex-map-fields";
import ShiftService from "@/services/shift.service";

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
  },
  async queryShifts({ commit }) {
    const shifts = await ShiftService.list();

    commit("setShifts", shifts.data);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
