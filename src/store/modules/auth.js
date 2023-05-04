import AuthService from "@/services/auth";
import ApiService from "@/services/api";
import router from "@/router";
import { log } from "@/utils/log";

const state = {
  accessToken: null,
  refreshToken: null,
  refreshTokenPromise: null,
  checkoutUser: ""
};

const getters = {
  loggedIn: (state) => state.accessToken !== null,
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
  checkoutUser: (state) => state.checkoutUser
};

const actions = {
  LOGIN_OAUTH2({ commit, dispatch }, { access_token, refresh_token }) {
    commit("LOGIN", { access: access_token, refresh: refresh_token });

    ApiService.setAccessToken(access_token);
    const response = dispatch("GET_USER", null, { root: true });

    return Promise.resolve(response);
  },
  async LOGIN({ commit, dispatch }, { email, password }) {
    const response = await AuthService.login(email, password);
    log("AuthVuex.login: resolved");
    commit("LOGIN", response.data);
    ApiService.setAccessToken(response.data.access);

    const resp = dispatch("GET_USER", null, { root: true });

    return Promise.resolve(resp);
  },
  LOGOUT({ commit }) {
    AuthService.logout();

    commit("LOGOUT");
    // We need to catch errors here. Otherwise we get the "NavigationDuplicated" error.
    // See: https://github.com/vuejs/vue-router/issues/2872#issuecomment-519073998
    return router.push({ name: "home" }).catch((error) => {
      log("Experienced error while logging out: ", error);
      return Promise.reject(error);
    });
  },
  async REFRESH_TOKEN({ commit, state }) {
    // If this is the first time the refreshToken has been called, make a request
    // otherwise return the same promise to the caller
    if (state.refreshTokenPromise !== null) {
      log("Returning pending token promise");
      return state.refreshTokenPromise;
    }

    // Wait for the AuthService.refreshToken() to resolve. On success set the token and clear promise
    // Clear the promise on error as well.
    try {
      const promise = AuthService.refreshToken(state.refreshToken);
      commit("SET_REFRESH_TOKEN_PROMISE", promise);

      const response = await promise;
      commit("LOGIN", response.data);
      ApiService.setAccessToken(response.data.access);

      commit("SET_REFRESH_TOKEN_PROMISE", null);
      return Promise.resolve(response);
    } catch (error) {
      commit("SET_REFRESH_TOKEN_PROMISE", null);
      return Promise.reject(error);
    }
  }
};

const mutations = {
  LOGIN(state, { access: accessToken, refresh: refreshToken }) {
    state.accessToken = accessToken;

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!refreshToken) {
      // Set the refreshToken if it is provided in the response;
      state.refreshToken = refreshToken;
    }
  },
  LOGOUT(state) {
    state.accessToken = null;
    state.refreshToken = null;
  },
  SET_REFRESH_TOKEN_PROMISE(state, payload) {
    state.refreshTokenPromise = payload;
  },
  SET_CHECKOUT_USER(state, payload) {
    state.checkoutUser = payload;
  },
  CLEAR_CHECKOUT_USER(state) {
    state.checkoutUser = "";
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
