const state = {
  selectedPastShifts: [],
  selectedFutureShifts: []
};

const getSelectedShifts = (state, isPastShift) =>
  isPastShift ? state.selectedPastShifts : state.selectedFutureShifts;
const getOppositeSelectedShifts = (state, isPastShift) =>
  isPastShift ? state.selectedFutureShifts : state.selectedPastShifts;

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
    const currentList = getSelectedShifts(state, isPastShift);
    const oppositeList = getOppositeSelectedShifts(state, isPastShift);

    const updatedCurrentList = currentList.map((selected) => {
      const match = freshShifts.find((s) => s.id === selected.id);
      return match ? match : selected;
    });

    // Handle cross-table migration: if a selected shift moved from past to future (or vice versa)
    freshShifts.forEach((fresh) => {
      const indexInOpposite = oppositeList.findIndex((s) => s.id === fresh.id);
      if (indexInOpposite !== -1) {
        oppositeList.splice(indexInOpposite, 1);
        if (!updatedCurrentList.some((s) => s.id === fresh.id)) {
          updatedCurrentList.push(fresh);
        }
      }
    });

    if (isPastShift) {
      state.selectedPastShifts = updatedCurrentList;
    } else {
      state.selectedFutureShifts = updatedCurrentList;
    }
  },
  setSelectedShifts(state, { shifts, isPastShift }) {
    if (isPastShift) {
      state.selectedPastShifts = shifts;
    } else {
      state.selectedFutureShifts = shifts;
    }
  },
  setSelectedShift(state, { shift, isPastShift }) {
    const selectedShifts = getSelectedShifts(state, isPastShift);

    if (!selectedShifts.some((s) => s.id === shift.id)) {
      selectedShifts.push(shift);
    }
  },
  unsetSelectedShift(state, { shift, isPastShift }) {
    if (isPastShift) {
      state.selectedPastShifts = getSelectedShifts(state, isPastShift).filter(
        (s) => s.id !== shift.id
      );
    } else {
      state.selectedFutureShifts = getSelectedShifts(state, isPastShift).filter(
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
