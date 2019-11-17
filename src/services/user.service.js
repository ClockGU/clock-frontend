import ApiService from "@/services/api.service";
import store from "@/store";

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

class AuthenticationError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errorCode = errorCode;
  }
}

const UserService = {
  /**
   * Login the user and store the access token to Vuex.
   *
   * @returns access_token
   * @throws AuthenticationError
   **/
  login: async function(email, password) {
    const requestData = {
      method: "post",
      url: "/auth/jwt/create/",
      data: {
        email: email,
        password: password
      }
    };

    return new Promise((resolve, reject) => {
      return ApiService.customRequest(requestData)
        .then(response => {
          ApiService.setHeader(response.data.access);
          ApiService.mount401Interceptor();

          resolve(response.data);
        })
        .catch(error => {
          if (error.message === "Network Error") {
            reject(
              new AuthenticationError(
                503,
                "Cannot reach the backend. Please try again later."
              )
            );
            return;
          }

          reject(
            new AuthenticationError(
              error.response.status,
              error.response.data.non_field_errors[0]
            )
          );
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
    const request = {
      method: "post",
      url: "/auth/jwt/refresh",
      data: {
        refresh: refreshToken
      }
    };

    return new Promise((resolve, reject) => {
      return ApiService.customRequest(request)
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
    ApiService.unmount401Interceptor();
  }
};

export default UserService;

export { UserService, AuthenticationError };
