import { ClockedInShiftService } from "@/services/clockedInShift";

const state = {
  clockedShift: undefined,
  status: "idle"
};

const getters = {
  clockedShift: (state) => state.clockedShift,
  loading: (state) => state.status === "loading"
};

const mutations = {
  clockShift(state, shiftInstance) {
    state.clockedShift = shiftInstance;
  },
  unclockShift(state) {
    state.clockedShift = undefined;
  }
};

const actions = {
  clockShift({ commit }, payload) {
    return ClockedInShiftService.create(payload).then((shift) => {
      commit("clockShift", shift);
      return shift;
    });
  },
  deleteClockedShift() {
    return ClockedInShiftService.delete(state.clockedShift.id);
  },
  unclockShift({ commit }) {
    commit("unclockShift");
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
