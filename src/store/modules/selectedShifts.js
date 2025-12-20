const state = {
  selectedPastShifts: [],
  selectedFutureShifts: []
};

const getters = {
  selectedPastShifts: (state) => state.selectedPastShifts,
  selectedFutureShifts: (state) => state.selectedFutureShifts
};

const actions = {
  selectShift({ commit }, { shift, isPastShift }) {
    commit("setSelectedShift", { shift, isPastShift });
  },
  deselectShift({ commit }, { shift, isPastShift }) {
    commit("unsetSelectedShift", { shift, isPastShift });
  },
  clearSelectedShifts({ commit }) {
    commit("unsetSelectedShifts");
  }
};

const mutations = {
  updateSelectedShifts(state, { freshShifts, isPastShift }) {
    const listName = isPastShift
      ? "selectedPastShifts"
      : "selectedFutureShifts";
    state[listName] = state[listName].map((selected) => {
      const match = freshShifts.find((s) => s.id === selected.id);
      return match ? match : selected;
    });
  },
  setSelectedShifts(state, { shifts, isPastShift }) {
    if (isPastShift) {
      state.selectedPastShifts = shifts;
    } else {
      state.selectedFutureShifts = shifts;
    }
  },
  setSelectedShift(state, { shift, isPastShift }) {
    if (isPastShift) {
      if (!state.selectedPastShifts.some((s) => s.id === shift.id)) {
        state.selectedPastShifts.push(shift);
      }
    } else {
      if (!state.selectedFutureShifts.some((s) => s.id === shift.id)) {
        state.selectedFutureShifts.push(shift);
      }
    }
  },
  unsetSelectedShift(state, { shift, isPastShift }) {
    if (isPastShift) {
      state.selectedPastShifts = state.selectedPastShifts.filter(
        (s) => s.id !== shift.id
      );
    } else {
      state.selectedFutureShifts = state.selectedFutureShifts.filter(
        (s) => s.id !== shift.id
      );
    }
  },
  unsetSelectedShifts(state) {
    state.selectedPastShifts = [];
    state.selectedFutureShifts = [];
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
