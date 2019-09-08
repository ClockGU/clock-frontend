import axios from "axios";
import store from "@/store";
import router from "@/router";
import TokenService from "@/services/storage.service";

const ApiService = {
  _401interceptor: null,

  init(baseURL) {
    axios.defaults.baseURL = baseURL;
  },

  setHeader() {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${TokenService.getToken()}`;
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

  /**
   * Perform a custom Axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   **/
  customRequest(data) {
    return axios(data);
  },

  mount401Interceptor() {
    this._401interceptor = axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        // We cannot reach the backend. PANIC!
        if (error.message == "Network Error") {
          router.push({ path: "/uhoh" });
          throw error;
        }

        // The error is not 401!
        if (error.request.status != 401) {
          throw error;
        }

        // Logout if refresh token is expired
        if (
          error.response.data.code == "token_not_valid" &&
          error.response.data.messages === undefined
        ) {
          store.dispatch("auth/logout");
          store.dispatch("snackbar/setSnack", {
            snack: "Your session has expired.",
            timeout: 10000,
            color: "warning"
          });

          throw "Logging you out!";
        }

        try {
          // Refresh the access token
          await store.dispatch("auth/refreshToken");

          // Retry the original request
          const failedRequest = { ...error };
          // Set new access token
          failedRequest.response.config.headers[
            "Authorization"
          ] = `Bearer ${TokenService.getToken()}`;

          // Return the refreshed request
          return this.customRequest({
            method: failedRequest.config.method,
            url: failedRequest.config.url,
            data: failedRequest.config.data,
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          });
        } catch (e) {
          // Refresh has failed - reject the original request
          console.log(e);
          throw error;
        }
      }
    );
  },

  unmount401Interceptor() {
    // Eject the interceptor
    axios.interceptors.response.eject(this._401interceptor);
  }
};

export default ApiService;
