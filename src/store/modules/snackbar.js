import Vue from "vue";
import { v4 as uuidv4 } from "uuid";
import i18n from "@/plugins/i18n";

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
  },
  removeSnack({ commit }, uuid) {
    commit("removeSnack", uuid);
  },
  setReportReminderSnack({ commit }) {
    commit("setSnack", {
      message: i18n.t("reports.monthlyReminder"),
      timeout: 10000,
      color: "warning",
      timePassed: 0,
      show: true,
      uuid: uuidv4()
    });
  }
};

const mutations = {
  setSnack(state, payload) {
    Vue.set(state, "snacks", [...state.snacks, payload]);
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
