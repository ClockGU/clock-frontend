import axios from "axios";
import {
  handleGenericError,
  handleLogout,
  handleNetworkError,
  handleTokenRefresh
} from "@/utils/interceptors";

const ApiService = {
  _401interceptor: null,

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

  get(resource) {
    return axios.get(resource);
  },

  post(resource, data) {
    return axios.post(resource, data);
  },

  patch(resource, data) {
    return axios.patch(resource, data);
  },

  delete(resource) {
    return axios.delete(resource);
  },

  customRequest(data) {
    return axios(data);
  },

  mount401Interceptor() {
    this._401interceptor = axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const isNetworkError = error.message == "Network Error";
        const isRefreshTokenExpired =
          error.response.data.code === "token_not_valid" &&
          (error.response.data.detail === "Token is invalid or expired" ||
            error.response.data.detail === "Token 'exp' claim has expired");

        // We cannot reach the backend :(
        if (isNetworkError) {
          handleNetworkError();
          return;
        }

        // The error is not 401, so we should handle it and show it to the user.
        if (error.request.status != 401) {
          handleGenericError(error);
          return Promise.reject(error);
        }

        // Logout if refresh token is expired
        if (isRefreshTokenExpired) {
          handleLogout();

          return Promise.reject(error);
        }

        // Try to refresh the access token
        return await handleTokenRefresh(error, this.customRequest);
      }
    );
  },

  unmount401Interceptor() {
    // Eject the interceptor
    axios.interceptors.response.eject(this._401interceptor);
  }
};

export default ApiService;
