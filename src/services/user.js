import ApiService from "@/services/api";
import store from "@/store";
import { log } from "@/utils/log";

export function parseJwt(token) {
  /* Decode JWT token.
  Source: https://stackoverflow.com/a/38552302
  */
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const UserService = {
  login: async function(email, password) {
    return new Promise((resolve, reject) => {
      return ApiService.post("/auth/jwt/create/", { email, password })
        .then(response => {
          log("UserService.login: resolved");
          ApiService.setHeader(response.data.access);

          resolve(response.data);
        })
        .catch(error => {
          log(`UserService.login error: ${error}`);
          log("UserService.login: rejected");
          reject(error);
        });
    });
  },

  changePassword: async function(current_password, new_password) {
    const requestData = {
      method: "post",
      url: "/auth/users/set_password/",
      data: {
        current_password,
        new_password
      }
    };

    return new Promise((resolve, reject) => {
      return ApiService.customRequest(requestData)
        .then(() => {
          this.logout();
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  getUser: async function() {
    const url = "/auth/users/me/";

    return new Promise((resolve, reject) => {
      return ApiService.get(url)
        .then(response => {
          store.dispatch("setUser", response.data);
          resolve();
        })
        .catch(error => {
          reject(error.errorCode, error.message);
        });
    });
  },

  /**
   * Refresh the access token.
   **/
  refreshToken: async function(refreshToken) {
    return new Promise((resolve, reject) => {
      return ApiService.post("/auth/jwt/refresh", {
        refresh: refreshToken
      })
        .then(response => {
          resolve(response.data.access);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  /**
   * Logout the current user by removing the token from storage.
   *
   * Will also remove `Authorization Bearer <token>` header from future requests.
   **/
  logout() {
    // Remove the token and remove Authorization header from Api Service as well
    ApiService.removeHeader();
    ApiService.unmountInterceptor();
  }
};

export default UserService;

export { UserService };
