import { getField, updateField } from "vuex-map-fields";
import { Shift } from "@/models/ShiftModel";
import ClockService from "@/services/clock";
import ShiftService from "@/services/shift";
import { isThisMonth, parseISO } from "date-fns";
import { handleApiError } from "@/utils/interceptors";

const state = {
  shifts: [],
  clockedShift: null,
  stagedShift: null,
  pseudoShifts: []
};

const getters = {
  getField,
  stagedShift: state => {
    return state.stagedShift;
  },
  pseudoShifts: state => {
    return state.pseudoShifts;
  },
  currentShifts: state => {
    return state.shifts.filter(shift =>
      isThisMonth(parseISO(shift.date.start))
    );
  }
};

const mutations = {
  updateField,
  clockShift(state, payload) {
    state.clockedShift = payload;
  },
  clearClockedShift(state) {
    state.clockedShift = undefined;
  },
  addShift(state, payload) {
    state.shifts.push(payload);
  },
  updateShift(state, payload) {
    state.shifts = [
      ...state.shifts.filter(shift => shift.uuid !== payload.uuid),
      payload
    ];
  },
  updatePseudoShift(state, payload) {
    state.pseudoShifts = [
      ...state.pseudoShifts.filter(shift => shift.uuid !== payload.uuid),
      payload
    ];
  },
  deleteShift(state, payload) {
    state.shifts = state.shifts.filter(shift => shift.uuid !== payload);
  },
  deletePseudoShift(state, payload) {
    state.pseudoShifts = state.pseudoShifts.filter(
      shift => shift.uuid !== payload
    );
  },
  setShifts(state, payload) {
    state.shifts = payload;
  },
  setPseudoShifts(state, payload) {
    state.pseudoShifts = payload;
  },
  stageShift(state, payload) {
    state.stagedShift = payload;
  }
};

const actions = {
  async CREATE_CLOCKED_SHIFT(
    { dispatch },
    { shift: shift, callback: callback }
  ) {
    return await ClockService.create(shift)
      .then(response => {
        shift.id = response.uuid;
        dispatch("clockShift", shift);
        callback();
      })
      .catch(handleApiError);
  },
  async DELETE_CLOCKED_SHIFT({ commit, state }, { callback }) {
    return await ClockService.delete(state.clockedShift.id)
      .then(() => {
        callback();
        commit("clearClockedShift");
      })
      .catch(handleApiError);
  },
  async CONVERT_CLOCKED_TO_NORMAL_SHIFT(
    { commit, dispatch, state },
    { callback }
  ) {
    return await ClockService.delete(state.clockedShift.id)
      .then(async () => {
        const data = {
          date: {
            start: state.clockedShift.started,
            end: new Date()
          },
          contract: state.clockedShift.contract,
          type: { value: "st", text: "Shift" }
        };

        const payload = new Shift(data).toPayload();
        await ShiftService.create(payload).catch(handleApiError);
      })
      .catch(handleApiError)
      .finally(() => {
        callback();
        commit("clearClockedShift");
        dispatch("queryShifts");
      });
  },
  clockShift({ commit }, payload) {
    commit("clockShift", payload);
  },
  clearClockedShift({ commit }) {
    commit("clearClockedShift");
  },
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
  updatePseudoShift({ commit }, payload) {
    commit("updatePseudoShift", payload);
  },
  deletePseudoShift({ commit }, payload) {
    commit("deletePseudoShift", payload);
  },
  setPseudoShifts({ commit }, payload) {
    commit("setPseudoShifts", payload);
  },
  stageShift({ commit }, payload) {
    commit("stageShift", payload);
  },
  async queryShifts({ commit }) {
    const shifts = await ShiftService.list().catch(handleApiError);

    commit("setShifts", shifts.data);
  },
  async queryClockedShift({ commit }) {
    const clockedShift = await ClockService.get().catch(handleApiError);

    let payload = clockedShift.data;
    if (payload !== undefined) {
      payload = { ...payload, override: true };
    }

    commit("clockShift", payload);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
