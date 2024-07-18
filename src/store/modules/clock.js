import { ClockedInShiftService } from "@/services/clockedInShift";

const state = {
  clockedShift: undefined,
  status: "idle"
};

const getters = {
  clockedShift: (state) => state.clockedShift,
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
  async deleteClockedShift({dispatch}) {
    const response = await ClockedInShiftService.delete(state.clockedShift.id);
    if (response.status === 204) {
      await dispatch("unclockShift")
    }
    return response;
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
