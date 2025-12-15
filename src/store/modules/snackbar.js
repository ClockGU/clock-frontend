import { v4 as uuidv4 } from "uuid";
import i18n from "@/plugins/i18n.js";

const { t } = i18n.global;

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
  snacks: (state) => state.snacks
};
const defaultSnackPayload = {
  message: "Snack Message",
  timeout: 4000,
  color: "success",
  timePassed: 0,
  show: true
};

const actions = {
  setSnack({ commit, rootGetters }, payload) {
    const userTime = rootGetters.userSnackTime;
    const isEnabled = rootGetters.userTimeoutEnabled;
    // Determine the effective timeout: use payload's timeout if set, otherwise use user setting or -1 (for persistent snacks) when disabled.
    const effectiveTimeout =
      payload.timeout !== undefined
        ? payload.timeout
        : isEnabled
        ? userTime
        : -1;

    payload.uuid = uuidv4();
    commit("setSnack", {
      ...defaultSnackPayload,
      ...payload,
      timeout: effectiveTimeout
    });
  },
  setErrorSnacks(
    { commit, rootGetters },
    errorPayload,
    options = { timeout: 4000, color: "error", timePassed: 0, show: true }
  ) {
    const userTime = rootGetters.userSnackTime;
    const isEnabled = rootGetters.userTimeoutEnabled;
    // Set effectiveTimeout to user time or -1 if disabled (means persistent snacks)
    const effectiveTimeout = isEnabled ? userTime : -1;
    // Apply user setting to the default options only if a specific timeout wasn't provided
    options.timeout =
      options.timeout !== 4000 ? options.timeout : effectiveTimeout;

    for (const [key, value] of Object.entries(errorPayload)) {
      let snackMsg =
        key !== "non_field_errors" ? `Field ${key}:` : `Context Errors:`;
      if (Array.isArray(value)) {
        snackMsg = snackMsg + value.join("\n");
      } else {
        snackMsg = snackMsg + value;
      }
      const payload = { ...options, message: snackMsg };
      commit("setSnack", payload);
    }
  },
  removeSnack({ commit }, uuid) {
    commit("removeSnack", uuid);
  },
  setReportReminderSnack({ commit }) {
    commit("setSnack", {
      message: t("reports.monthlyReminder"),
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
    state.snacks.push(payload);
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
