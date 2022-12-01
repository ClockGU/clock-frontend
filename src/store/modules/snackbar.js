import Vue from "vue";
import { v4 as uuidv4 } from "uuid";

const defaultState = {
  snack: null,
  timeout: 5000,
  color: "success"
};

const state = {
  snackbar: {
    ...defaultState
  },
  snacks: []
};

const getters = {
  snacks: (status) => status.snacks
};

const actions = {
  setSnack({ commit }, payload) {
    payload.uuid = uuidv4();
    commit("setSnack", payload);

    return Promise.resolve();
  },
  removeSnack({ commit }, uuid) {
    commit("removeSnack", uuid);
  }
};

const mutations = {
  setSnack(state, payload) {
    Vue.set(state, "snacks", [...state.snacks, payload]);
    // state.snackbar = { ...state.snackbar, ...payload };
  },
  removeSnack(state, uuid) {
    state.snacks = state.snacks.filter((snack) => snack.uuid !== uuid);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
