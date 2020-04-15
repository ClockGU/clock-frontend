import axios from "axios";
import store from "@/store";
import {
  handleGenericError,
  handleLogout,
  handleNetworkError,
  handleTokenRefresh
} from "@/utils/interceptors";
import { log } from "@/utils/log";

const ApiService = {
  _interceptor: null,
  _anonymousInterceptor: null,

  init(baseURL) {
    axios.defaults.baseURL = baseURL;
  },

  setHeader(accessToken) {
    return new Promise(resolve => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      resolve();
    });
  },

  removeHeader() {
    axios.defaults.headers.common = {};
  },

  get(resource, config = {}) {
    log("ApiService.get called");
    return axios.get(resource, config);
  },

  post(resource, data, config = {}) {
    log("ApiService.post called");
    return axios.post(resource, data, config);
  },

  patch(resource, data, config = {}) {
    log("ApiService.patch called");
    return axios.patch(resource, data, config);
  },

  delete(resource, config = {}) {
    log("ApiService.delete called");
    return axios.delete(resource, config);
  },

  customRequest(data, config = {}) {
    log("ApiService.customRequest called");
    return axios(data, config);
  },

  mountInterceptor() {
    log("Mounting interceptor");
    this._401interceptor = axios.interceptors.response.use(
      response => {
        log("_interceptor: resolved");
        return response;
      },
      error => {
        log("_interceptor: rejected");
        const isLoggedIn = store.getters["auth/loggedIn"];
        const isNetworkError = error.message == "Network Error";

        // We cannot reach the backend :(
        if (isNetworkError) {
          return handleNetworkError(error);
        }

        // The error is not 401, so we should handle it and show it to the user.
        if (error.request.status != 401) {
          return handleGenericError(error);
        }

        // Only proceed if we are logged in
        if (!isLoggedIn) return;

        // Logout if refresh token is expired
        const isRefreshTokenExpired =
          error.response.code === "token_not_valid" &&
          error.response.detail === "Token is invalid or expired";
        if (isRefreshTokenExpired) {
          return handleLogout(error);
        }

        // Try to refresh the access token
        return handleTokenRefresh(error, this.customRequest);
      }
    );
  },

  unmountInterceptor() {
    log("Unmounting interceptor");
    axios.interceptors.response.eject(this._interceptor);
  }
};

export default ApiService;
