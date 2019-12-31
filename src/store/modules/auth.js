import { UserService } from "@/services/user";
import ApiService from "@/services/api";
import router from "@/router";
import { log } from "@/utils/log";

const state = {
  authenticating: false,
  accessToken: null,
  refreshToken: null,
  authenticationErrorCode: null,
  authenticationError: null,
  refreshTokenPromise: null
};

const getters = {
  loggedIn: state => {
    return !!state.accessToken;
  },

  accessToken: state => state.accessToken,
  refreshToken: state => state.refreshToken,

  authenticationErrorCode: state => {
    return state.authenticationErrorCode;
  },

  authenticationError: state => {
    return state.authenticationError;
  },

  authenticating: state => {
    return state.authenticating;
  }
};

const actions = {
  login({ commit }, { email, password }) {
    return UserService.login(email, password).then(token => {
      log("AuthVuex.login: resolved");
      commit("loginSuccess", token);

      // Redirect the user to the page he first tried to visit or to the home view
      router.push(
        router.history.current.query.redirect || { name: "contractSelect" }
      );
    });
  },
  logout({ commit }) {
    UserService.logout();

    commit("logoutSuccess");
    // We need to catch errors here. Otherwise we get the "NavigationDuplicated" error.
    // See: https://github.com/vuejs/vue-router/issues/2872#issuecomment-519073998
    router.push("/login").catch(() => {});
  },
  async refreshToken({ commit, state }) {
    // If this is the first time the refreshToken has been called, make a request
    // otherwise return the same promise to the caller
    if (
      state.refreshTokenPromise !== null &&
      typeof state.refreshTokenPromise !== "object"
    ) {
      return state.refreshTokenPromise;
    }

    const p = UserService.refreshToken(state.refreshToken);
    commit("refreshTokenPromise", p);

    // Wait for the UserService.refreshToken() to resolve. On success set the token and clear promise
    // Clear the promise on error as well.
    return p
      .then(response => {
        ApiService.setHeader(response);
        commit("loginSuccess", { access: response, refresh: null });

        return Promise.resolve(response);
      })
      .catch(error => {
        return Promise.reject(error);
      })
      .finally(() => commit("refreshTokenPromise", null));
  }
};

const mutations = {
  loginRequest(state) {
    state.authenticating = true;
    state.authenticationError = null;
    state.authenticationErrorCode = null;
  },
  loginSuccess(state, { access: accessToken, refresh: refreshToken }) {
    state.accessToken = accessToken;

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!refreshToken) {
      // Set the refreshToken if it is provided in the response;
      state.refreshToken = refreshToken;
    }
    state.authenticating = false;
  },
  loginError(state, { status, message }) {
    state.authenticating = false;
    state.authenticationErrorCode = status;
    state.authenticationError = message;
  },
  logoutSuccess(state) {
    state.accessToken = null;
    state.refreshToken = null;
  },
  refreshTokenPromise(state, promise) {
    state.refreshTokenPromise = promise;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
