import axios from "axios";
import store from "@/store";
import i18n from "@/plugins/i18n";

import { log } from "@/utils/log";

const ApiService = {
  _interceptor: null,
  _anonymousInterceptor: null,

  init(baseURL) {
    axios.defaults.baseURL = baseURL;
    axios.defaults.headers.common["Accept-Language"] = i18n.locale || "de";
  },

  setHeader(header, value) {
    return new Promise(resolve => {
      axios.defaults.headers.common[header] = value;

      resolve();
    });
  },

  setAccessToken(accessToken) {
    this.setHeader("Authorization", `Bearer ${accessToken}`);
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
      async error => {
        log("_interceptor: rejected");

        const { data, status } = error.response;

        if (
          status === 404 &&
          error.response.config.url === "/clockedinshifts/"
        ) {
          return Promise.resolve({ ...error, response: { data: [] } });
        }

        const tokenNotValid = data.code === "token_not_valid";
        const accessTokenExpired =
          data.detail === "Given token not valid for any token type";
        const refreshTokenExpired =
          data.detail === "Token is invalid or expired";

        if (tokenNotValid && accessTokenExpired) {
          return store.dispatch("auth/REFRESH_TOKEN").then(response => {
            const { access: accessToken } = response.data;
            const { config: originalRequest } = error;

            // Set new access token
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

            // Retry the request
            log("retrying request");
            return this.customRequest({
              ...originalRequest,
              headers: {
                "Content-Type": "application/json;charset=UTF-8"
              }
            }).catch(async () => {
              await store.dispatch("auth/LOGOUT");

              return;
            });
          });
        }

        if (tokenNotValid && refreshTokenExpired) {
          await store.dispatch("auth/LOGOUT");

          return Promise.reject(error);
        }

        return error;
      }
    );
  },

  unmountInterceptor() {
    log("Unmounting interceptor");
    axios.interceptors.response.eject(this._interceptor);
  }
};

export default ApiService;
