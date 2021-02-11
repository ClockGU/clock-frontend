import ClockService from "@/services/clock";

const state = {
  clockedShift: undefined,
  status: "idle"
};

const getters = {
  clockedShift: (state) => state.clockedShift,
  loading: (state) => state.status === "loading"
};

const mutations = {
  CLOCK_SHIFT(state, payload) {
    state.clockedShift = payload;
  },
  UNCLOCK_SHIFT() {
    state.clockedShift = null;
  }
};

const actions = {
  CLOCK_SHIFT({ commit }, payload) {
    return ClockService.create(payload).then((response) => {
      payload.id = response.uuid;

      commit("CLOCK_SHIFT", payload);

      return Promise.resolve(response);
    });
  },
  DELETE_CLOCKED_SHIFT() {
    return ClockService.delete(state.clockedShift.id);
  },
  UNCLOCK_SHIFT({ commit }) {
    commit("UNCLOCK_SHIFT");
  },
  async GET_CLOCKED_SHIFT({ commit }) {
    state.status = "loading";
    try {
      const response = await ClockService.get();

      if (response.data === undefined) {
        state.status = "idle";
        return Promise.reject();
      }

      commit("CLOCK_SHIFT", response.data);

      state.status = "idle";
      return Promise.resolve(response.data);
    } catch (error) {
      commit("UNCLOCK_SHIFT");
      state.status = "idle";
      return Promise.reject(error);
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
