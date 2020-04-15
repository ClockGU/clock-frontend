import ClockService from "@/services/clock";

const state = {
  clockedShift: undefined,
  status: "idle"
};

const getters = {
  clockedShift: state => state.clockedShift,
  loading: state => state.status === "loading"
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
    return ClockService.create(payload).then(response => {
      payload.id = response.uuid;

      commit("CLOCK_SHIFT", payload);

      return response;
    });
  },
  DELETE_CLOCKED_SHIFT() {
    return ClockService.delete(state.clockedShift.id);
  },
  UNCLOCK_SHIFT({ commit }) {
    commit("UNCLOCK_SHIFT");
  },
  GET_CLOCKED_SHIFT({ commit }) {
    state.status = "loading";
    return ClockService.get()
      .then(response => {
        let { data } = response;
        if (data !== undefined) {
          data = { ...data, override: true };
        }

        commit("CLOCK_SHIFT", data);
      })
      .catch(err => {
        commit("UNCLOCK_SHIFT");

        return Promise.reject(err);
      })
      .finally(() => {
        state.status = "idle";
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
