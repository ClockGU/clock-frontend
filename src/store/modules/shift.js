import ShiftService from "@/services/shift";
import { isThisMonth, parseISO } from "date-fns";

const state = {
  shifts: [],
  stagedShift: null,
  pseudoShifts: [],
  status: "idle"
};

const getters = {
  shifts: state => state.shifts,
  stagedShift: state => state.stagedShift,
  pseudoShifts: state => state.pseudoShifts,
  currentShifts: state =>
    state.shifts.filter(shift => isThisMonth(parseISO(shift.date.start))),
  shiftsOfContract: (state, getters, rootState) =>
    state.shifts.filter(
      shift => shift.contract === rootState.selectedContract.uuid
    ),
  loading: state => state.status === "loading",
  usedTags: state =>
    state.shifts.reduce(function(a, b) {
      return a.concat(b.tags);
    }, [])
};

const mutations = {
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
  CREATE_SHIFT({ dispatch }, payload) {
    return ShiftService.create(payload).then(() => {
      dispatch("queryShifts");
    });
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
    try {
      const response = await ShiftService.list();
      commit("setShifts", response.data);

      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      state.status = "idle";
    }
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
