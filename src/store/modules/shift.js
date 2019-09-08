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
  addShift(state, payload) {
    state.shifts.push(payload);
  },
  updateShift(state, payload) {
    state.shifts = [
      ...state.shifts.filter(shift => shift.uuid !== payload.uuid),
      payload
    ];
  },
  deleteShift(state, payload) {
    state.shifts = state.shifts.filter(shift => shift.uuid !== payload);
  },
  setShifts(state, payload) {
    state.shifts = payload;
  }
};

const actions = {
  addShift({ commit }, payload) {
    commit("addShift", payload);
  },
  updateShift({ commit }, payload) {
    commit("updateShift", payload);
  },
  deleteShift({ commit }, payload) {
    commit("deleteShift", payload);
  },
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
