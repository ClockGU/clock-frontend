const state = {
  selectedShifts: []
};

const getters = {
  selectedShifts: (state) => state.selectedShifts
};

const actions = {
  setSelectedShifts({ commit }, shifts) {
    commit("setSelectedShifts", shifts);
  },
  selectShift({ commit }, shift) {
    commit("setSelectedShift", shift);
  },
  deselectShift({ commit }, shift) {
    commit("unsetSelectedShift", shift);
  },
  clearSelectedShifts({ commit }) {
    commit("unsetSelectedShifts");
  }
};

const mutations = {
  setSelectedShifts(state, shifts) {
    state.selectedShifts = shifts;
  },
  setSelectedShift(state, shift) {
    if (!state.selectedShifts.some((s) => s.id === shift.id)) {
      state.selectedShifts.push(shift);
    }
  },
  unsetSelectedShift(state, shift) {
    state.selectedShifts = state.selectedShifts.filter(
      (s) => s.id !== shift.id
    );
  },
  unsetSelectedShifts(state) {
    state.selectedShifts = [];
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
