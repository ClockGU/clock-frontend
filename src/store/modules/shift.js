import { getField, updateField } from "vuex-map-fields";
import { Shift } from "@/models/ShiftModel";
import ClockService from "@/services/clock";
import ShiftService from "@/services/shift";
import { isThisMonth, parseISO } from "date-fns";
import { handleApiError } from "@/utils/interceptors";

const state = {
  shifts: [],
  clockedShift: undefined,
  stagedShift: null,
  pseudoShifts: [],
  status: "idle"
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
  },
  loading: () => state.status === "loading"
};

const mutations = {
  updateField,
  clockShift(state, payload) {
    state.clockedShift = payload;
  },
  clearClockedShift() {
    state.clockedShift = null;
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
  async DELETE_CLOCKED_SHIFT(
    { commit, state, rootGetters },
    { callback, errorCallback }
  ) {
    return await ClockService.delete(state.clockedShift.id)
      .then(() => {
        callback();
        commit("clearClockedShift");
      })
      .catch(() => {
        // Only perform callback if we are still logged in
        if (rootGetters["auth/loggedIn"]) errorCallback();
      });
  },
  async CONVERT_CLOCKED_TO_NORMAL_SHIFT(
    { commit, dispatch, state, rootGetters },
    { callback, errorCallback }
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
        await ShiftService.create(payload)
          .then(() => {
            callback();
            commit("clearClockedShift");
            dispatch("queryShifts");
          })
          .catch(handleApiError);
      })
      .catch(() => {
        // Only perform callback if we are still logged in
        if (rootGetters["auth/loggedIn"]) errorCallback();
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
    state.status = "loading";
    await ShiftService.list()
      .then(response => {
        commit("setShifts", response.data);
      })
      .catch(handleApiError)
      .finally(() => {
        state.status = "idle";
      });
  },
  async queryClockedShift({ commit }) {
    await ClockService.get()
      .then(response => {
        let { data } = response;
        if (data !== undefined) {
          data = { ...data, override: true };
        }

        commit("clockShift", data);
      })
      .catch(() => {
        commit("clearClockedShift");
      });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
