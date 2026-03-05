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
    const currentList = isPastShift
      ? "selectedPastShifts"
      : "selectedFutureShifts";
    const oppositeList = isPastShift
      ? "selectedFutureShifts"
      : "selectedPastShifts";

    state[currentList] = state[currentList].map((selected) => {
      const match = freshShifts.find((s) => s.id === selected.id);
      return match ? match : selected;
    });

    // Handle cross-table migration: if a selected shift moved from past to future (or vice versa)
    freshShifts.forEach((fresh) => {
      const indexInOpposite = state[oppositeList].findIndex(
        (s) => s.id === fresh.id
      );
      if (indexInOpposite !== -1) {
        state[oppositeList].splice(indexInOpposite, 1);
        if (!state[currentList].some((s) => s.id === fresh.id)) {
          state[currentList].push(fresh);
        }
      }
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
